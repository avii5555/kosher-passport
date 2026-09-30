require('dotenv').config();
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Simple health check for uptime monitoring (Render, UptimeRobot, etc.)
app.get('/health', (req, res) => {
  res.json({ status: 'ok', hasApiKey: Boolean(process.env.ANTHROPIC_API_KEY) });
});

// Generates a day-by-day kosher itinerary using ONLY the listings the
// browser sends us. The Anthropic API key lives only here, server-side —
// it is never exposed to the browser.
app.post('/api/generate-itinerary', async (req, res) => {
  const { destination, dates, kashrutLevel, travelers, places } = req.body || {};

  if (!destination || !Array.isArray(dates) || dates.length === 0 || !Array.isArray(places)) {
    return res.status(400).json({ error: 'Missing destination, dates, or places.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Server is missing ANTHROPIC_API_KEY. Copy .env.example to .env and add your key.' });
  }

  const prompt = `Plan a kosher trip itinerary using ONLY the listings provided below. Do not invent any place that isn't listed.

Destination: ${destination}
Travel dates: ${dates.join(', ')}
Kashrut standard requested: ${kashrutLevel}
Travelers: ${travelers}

Available verified listings (JSON):
${JSON.stringify(places)}

Distribute listings sensibly across the days: include a synagogue on Friday evening or Saturday if the dates allow, spread restaurants across meals rather than stacking them on one day, and don't repeat the same listing on multiple days unless there are more days than listings. It's fine to leave a day lighter if there aren't enough suitable listings.

Respond with ONLY raw JSON in this exact shape, no markdown fences, no prose:
{"YYYY-MM-DD": ["placeId", "placeId"], "YYYY-MM-DD": ["placeId"]}`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-5',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error('Anthropic API error:', response.status, errText);
      return res.status(502).json({ error: 'The AI service returned an error. Check the server logs.' });
    }

    const data = await response.json();
    const text = (data.content || []).filter(b => b.type === 'text').map(b => b.text).join('');
    const clean = text.replace(/```json|```/g, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(clean);
    } catch (parseErr) {
      console.error('Could not parse model output as JSON:', clean);
      return res.status(502).json({ error: 'The AI response was not valid JSON. Try again.' });
    }

    res.json(parsed);
  } catch (err) {
    console.error('Could not reach Anthropic API:', err);
    res.status(500).json({ error: 'Could not reach the AI service.' });
  }
});

app.listen(PORT, () => {
  console.log(`Kosher Passport running at http://localhost:${PORT}`);
});
