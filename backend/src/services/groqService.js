const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function analyzeData(headers, rows) {
  const headerLine = headers.join('\t');
  const dataLines = rows.map((row) => row.join('\t')).join('\n');
  const dataText = `${headerLine}\n${dataLines}`;

  const prompt = `You are a professional business analyst. Below is raw data from a file.
The columns are: ${headers.join(', ')}
Analyze ALL the data and write a professional executive summary (max 250 words).
Your summary must include:
- What this data is about (infer from column names)
- Key numbers, totals, or trends you notice
- Top performing categories or regions if present
- Any anomalies or concerning patterns
- 2 actionable recommendations based on the data

Data:
${dataText}`;

  const chatCompletion = await groq.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'llama-3.1-8b-instant',
    max_tokens: 1024,
    temperature: 0.7,
  });

  return chatCompletion.choices[0].message.content;
}

module.exports = { analyzeData };
