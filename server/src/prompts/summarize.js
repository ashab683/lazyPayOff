export const summarizePrompt = (text) => {
  return `You are a concise productivity assistant.
Summarize the following text using ONLY the facts and details provided in the text.
Do NOT invent any facts, dates, names, or tasks that are not explicitly stated in the source text.

Return your response in strictly valid JSON format with the following structure:
{
  "summary": "A clear, 1-3 sentence summary of the main point",
  "bullets": [
    "Short key bullet point 1",
    "Short key bullet point 2"
  ]
}

Only output raw JSON. Do not include markdown code block markers or any explanatory text outside the JSON.

Source Text:
${text}`;
};
