export const extractActionsPrompt = (text) => {
  return `You are an executive assistant extracting action items from text.
Identify all concrete action items, responsibilities, and deadlines directly mentioned in the text.

CRITICAL RULES:
- Extract ONLY what is explicitly stated or directly implied in the source text.
- Do NOT invent fake deadlines, dates, or contacts. If no deadline is stated, set "deadline" to null.
- Set priority to "High", "Medium", or "Low" based on urgency indicated in the text.

Return ONLY valid JSON matching this schema:
{
  "actionItems": [
    {
      "task": "Specific actionable item",
      "deadline": "Deadline string if mentioned, or null",
      "priority": "High",
      "context": "Brief context or relevant entity"
    }
  ]
}

Only output raw JSON. Do not include markdown code block markers or any explanatory text outside the JSON.

Source Text:
${text}`;
};
