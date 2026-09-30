export default async function handler(req: any, res: any) {
  res.status(200).json({
    keyExists: !!process.env.ANTHROPIC_API_KEY,
    keyPreview: process.env.ANTHROPIC_API_KEY?.slice(0, 12),
  })
}