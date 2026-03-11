const Groq = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY, timeout: 60000 });

const MAX_CHARS = 12000;

function prepareData(headers, rows) {
  const headerLine = headers.join('\t');
  const totalRows = rows.length;

  const allLines = rows.map((row) => row.join('\t'));
  const fullText = `${headerLine}\n${allLines.join('\n')}`;

  if (fullText.length <= MAX_CHARS) {
    return { dataText: fullText, totalRows, sampledRows: totalRows, wasTruncated: false };
  }

  const selected = [];
  const step = Math.max(1, Math.floor(totalRows / 80));

  for (let i = 0; i < totalRows && selected.length < 80; i += step) {
    selected.push(allLines[i]);
  }

  if (!selected.includes(allLines[totalRows - 1])) {
    selected.push(allLines[totalRows - 1]);
  }

  let sampledText = `${headerLine}\n${selected.join('\n')}`;

  if (sampledText.length > MAX_CHARS) {
    while (sampledText.length > MAX_CHARS && selected.length > 10) {
      selected.pop();
      sampledText = `${headerLine}\n${selected.join('\n')}`;
    }
  }

  return { dataText: sampledText, totalRows, sampledRows: selected.length, wasTruncated: true };
}

async function analyzeData(headers, rows) {
  const { dataText, totalRows, sampledRows, wasTruncated } = prepareData(headers, rows);

  const sampleNote = wasTruncated
    ? `\nNOTE: The original file has ${totalRows} rows. A representative sample of ${sampledRows} rows is shown below. Extrapolate your analysis to cover the full dataset.`
    : '';

  const prompt = `You are a professional business analyst. Below is raw data from a file.
The columns are: ${headers.join(', ')}
Total rows in the dataset: ${totalRows}${sampleNote}
Analyze ALL the data and write a professional executive summary (max 250 words).
Your summary must include:
- What this data is about (infer from column names)
- Key numbers, totals, or trends you notice
- Top performing categories or regions if present
- Any anomalies or concerning patterns
- 2 actionable recommendations based on the data

Do NOT use markdown bold (**) or any markdown formatting. Write in plain professional English with clear paragraphs.

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
