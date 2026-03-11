const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY;

function markdownToHtml(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^### (.+)$/gm, '<h3 style="color:#1a1a2e;font-size:16px;margin:18px 0 8px;font-weight:700;">$1</h3>')
    .replace(/^## (.+)$/gm, '<h2 style="color:#1a1a2e;font-size:18px;margin:22px 0 10px;font-weight:700;">$1</h2>')
    .replace(/^# (.+)$/gm, '<h1 style="color:#1a1a2e;font-size:20px;margin:24px 0 12px;font-weight:700;">$1</h1>')
    .replace(/^- (.+)$/gm, '<li style="color:#444;margin:4px 0;line-height:1.6;">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li style="color:#444;margin:4px 0;line-height:1.6;">$2</li>')
    .replace(/(<li.*<\/li>\n?)+/g, '<ul style="padding-left:20px;margin:8px 0;">$&</ul>')
    .replace(/\n\n/g, '</p><p style="color:#333;line-height:1.8;margin:12px 0;">')
    .replace(/\n/g, '<br>');
}

async function sendSummaryEmail(to, summary) {
  const formattedSummary = markdownToHtml(summary);

  const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS_SERVICE_ID,
      template_id: EMAILJS_TEMPLATE_ID,
      user_id: EMAILJS_PUBLIC_KEY,
      template_params: {
        to_email: to,
        message: formattedSummary,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`EmailJS error: ${errorText}`);
  }
}

module.exports = { sendSummaryEmail };
