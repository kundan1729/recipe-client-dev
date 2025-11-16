const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function generateRecipe(ingredients) {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY is not configured. Please add it to your .env file.');
  }

  const prompt = `You are a master chef. Create ONE recipe using these ingredients: ${ingredients}.
Return ONLY this JSON format (no markdown, no extra text):
{
  "title": "",
  "ingredients_needed": [],
  "steps": [],
  "time_minutes": "",
  "difficulty": "",
  "description": ""
}`;

  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      // Replaced decommissioned model with the requested supported model.
      // If you need a different context window/variant, refer to Groq's deprecation docs.
      // https://console.groq.com/docs/deprecations
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error?.message || 'Failed to generate recipe');
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No recipe generated');
  }

  const jsonMatch = content.match(/\{[\s\S]*\}/);
  const jsonString = jsonMatch ? jsonMatch[0] : content;

  return JSON.parse(jsonString);
}
