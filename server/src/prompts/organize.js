export const organizePrompt = (text) => {
  return `You are an expert productivity assistant.
Analyze the provided messy to-do list, notes, or brain dump.
Extract every distinct task and categorize each into one of these categories:
- "Study" (academic, coursework, reading, revision)
- "Work" (professional, client work, projects, coding, README, deliverables)
- "Personal" (errands, groceries, health, chores, home)
- "College Communication" or "Communication" (emails, professors, meetings, messages)
- "Other" (anything that doesn't fit the above)

For each task:
1. Provide a clean, actionable title.
2. Assign a suggested priority: "High", "Medium", or "Low".
3. Provide a concrete, bite-sized "nextStep" to overcome procrastination.

CRITICAL RULES:
- Use ONLY tasks and information present in the input text.
- Do NOT invent fictional tasks or imaginary deadlines.
- If a deadline or detail is mentioned in the text, preserve it.

Return ONLY valid JSON matching this schema:
{
  "categories": [
    {
      "name": "Category Name",
      "tasks": [
        {
          "id": "1",
          "title": "Clear action title",
          "priority": "High",
          "nextStep": "Manageable immediate first step",
          "completed": false
        }
      ]
    }
  ]
}

Only output raw JSON. Do not include markdown code block markers or any explanatory text outside the JSON.

Source Text:
${text}`;
};
