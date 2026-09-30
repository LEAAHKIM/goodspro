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

      required: [
        "variable",
        "direction",
        "magnitude",
      ],

      additionalProperties: false,
    },

    explanation: {
      type: "string",
    },
  },

  required: [
    "diagnosis",
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
          {
            error: "Anthropic API key is not configured",
          },
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

            max_tokens: 1200,

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

Keep the response concise.

The explanation must be only 1–2 sentences.
Do not provide a confidence score.
Do not provide a list of evidence.
Give only one primary recommendation.
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

      console.log("Anthropic status:", response.status);
      console.log(
        "Anthropic stop reason:",
        data.stop_reason,
      );

      if (!response.ok) {
        console.error("Anthropic API error:", data);

        return Response.json(
          { error: data },
          { status: response.status },
        );
      }

      if (data.stop_reason === "max_tokens") {
        console.error(
          "Claude output was truncated because max_tokens was reached",
        );

        return Response.json(
          {
            error:
              "Claude's analysis was cut off before it finished. Please try again.",
          },
          { status: 500 },
        );
      }

      const textBlock = data.content?.find(
        (block: { type: string }) =>
          block.type === "text",
      );

      const text = textBlock?.text;

      if (!text) {
        console.error(
          "Claude returned no text:",
          data,
        );

        return Response.json(
          {
            error: "Claude returned no text analysis",
          },
          { status: 500 },
        );
      }

      try {
        const analysis = JSON.parse(text);

        return Response.json({
          analysis,
        });
      } catch (error) {
        console.error(
          "Failed to parse Claude JSON:",
          error,
        );

        console.error(
          "Claude text:",
          text,
        );

        return Response.json(
          {
            error: "Claude returned invalid JSON",
          },
          { status: 500 },
        );
      }
    },
  ),
};