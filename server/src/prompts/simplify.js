export const simplifyPrompt = (text) => {
  return `You are a clear writing and comprehension expert.
Rewrite the provided text into simple, crystal-clear, concise language that anyone can easily digest without cognitive fatigue.
Preserve all key facts, requirements, and nuance, but remove clutter, jargon, and passive phrasing.

CRITICAL RULES:
- Stick strictly to the information in the source text.
- Do NOT invent facts or change the meaning.

Return ONLY valid JSON matching this schema:
{
  "simplifiedText": "The rewritten, clear, easy-to-read version of the text",
  "keyTakeaways": [
    "Main takeaway 1",
    "Main takeaway 2"
  ]
}

Only output raw JSON. Do not include markdown code block markers or any explanatory text outside the JSON.

Source Text:
${text}`;
};
