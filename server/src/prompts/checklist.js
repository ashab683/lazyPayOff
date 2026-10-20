export const checklistPrompt = (text) => {
  return `You are a productivity organizer that turns unstructured notes into an easy, sequential checklist.
Break down the provided notes into clear, ordered checklist steps.

CRITICAL RULES:
- Base the checklist purely on the provided notes.
- Do NOT invent outside requirements.
- Keep each checklist item concise and straightforward.

Return ONLY valid JSON matching this schema:
{
  "title": "Short title describing this checklist",
  "checklist": [
    {
      "step": 1,
      "text": "Actionable checklist item",
      "tip": "Short helpful tip or detail from the notes, or null"
    }
  ]
}

Only output raw JSON. Do not include markdown code block markers or any explanatory text outside the JSON.

Source Text:
${text}`;
};
