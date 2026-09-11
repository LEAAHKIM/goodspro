import "@supabase/functions-js/edge-runtime.d.ts";

import { withSupabase } from "@supabase/server";

const ANTHROPIC_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

const shotAnalysisSchema = {
  type: "object",
  properties: {
    diagnosis: {
      type: "string",
      enum: [
        "under_extracted",
        "over_extracted",
        "balanced",
        "uncertain",
      ],
    },
    confidence: {
      type: "number",
    },
    evidence: {
      type: "array",
      items: {
        type: "string",
      },
    },
    recommendation: {
      type: "object",
      properties: {
        variable: {
          type: "string",
          enum: ["grind", "dose", "yield", "temperature"],
        },
        direction: {
          type: "string",
          enum: [
            "finer",
            "coarser",
            "increase",
            "decrease",
          ],
        },
        magnitude: {
          type: "string",
          enum: ["small", "moderate", "large"],
        },
      },
      required: ["variable", "direction", "magnitude"],
      additionalProperties: false,
    },
    explanation: {
      type: "string",
    },
  },
  required: [
    "diagnosis",
    "confidence",
    "evidence",
    "recommendation",
    "explanation",
  ],
  additionalProperties: false,
};

export default {
  fetch: withSupabase(
    { auth: ["publishable", "secret"] },
    async (req, ctx) => {
      if (!ANTHROPIC_API_KEY) {
        return Response.json(
          { error: "Anthropic API key is not configured" },
          { status: 500 },
        );
      }

      const shot = await req.json();

      const response = await fetch(
        "https://api.anthropic.com/v1/messages",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": ANTHROPIC_API_KEY,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-sonnet-5",
            max_tokens: 500,

            system: `
You are an espresso extraction assistant.

Analyze the provided espresso shot using the extraction
measurements and tasting information.

Diagnose whether the shot is likely under-extracted,
over-extracted, balanced, or uncertain.

Recommend ONE primary adjustment for the next shot.

For grind recommendations, use "finer" or "coarser"
rather than "increase" or "decrease".

Do not assume that a grinder's numerical grind setting
has the same meaning across different grinders.

If the available information is insufficient to make a
confident diagnosis, use "uncertain".
            `,

            messages: [
              {
                role: "user",
                content: `Analyze this espresso shot:

${JSON.stringify(shot, null, 2)}`,
              },
            ],

            output_config: {
              format: {
                type: "json_schema",
                schema: shotAnalysisSchema,
              },
            },
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        return Response.json(
          { error: data },
          { status: response.status },
        );
      }

      const textBlock = data.content?.find(
        (block: { type: string }) => block.type === "text"
      );

      const text = textBlock?.text;

      if (!text) {
        return Response.json(
          { error: "Claude returned no text analysis" },
          { status: 500 },
        );
      }

      const analysis = JSON.parse(text);

      return Response.json({
        analysis,
      });
    },
  ),
};