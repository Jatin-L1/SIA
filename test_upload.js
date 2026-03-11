const fs = require('fs');
const path = require('path');

async function testUpload() {
  const filePath = path.join(__dirname, 'test_data', 'sales_q1_2026.csv');
  const fileBuffer = fs.readFileSync(filePath);

  // Build multipart form data manually
  const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);
  const CRLF = '\r\n';

  let body = '';
  // File field
  body += `--${boundary}${CRLF}`;
  body += `Content-Disposition: form-data; name="file"; filename="sales_q1_2026.csv"${CRLF}`;
  body += `Content-Type: text/csv${CRLF}${CRLF}`;
  body += fileBuffer.toString() + CRLF;
  // Email field
  body += `--${boundary}${CRLF}`;
  body += `Content-Disposition: form-data; name="email"${CRLF}${CRLF}`;
  body += 'jatinsharmasm2435@gmail.com' + CRLF;
  body += `--${boundary}--${CRLF}`;

  console.log('1. Testing /health ...');
  const healthRes = await fetch('http://localhost:8000/health');
  const healthData = await healthRes.json();
  console.log('   ✅ Health:', JSON.stringify(healthData));

  console.log('\n2. Testing /upload with test CSV ...');
  console.log('   (This may take 10-20 seconds while AI analyzes the data)');
  const uploadRes = await fetch('http://localhost:8000/upload', {
    method: 'POST',
    headers: { 'Content-Type': `multipart/form-data; boundary=${boundary}` },
    body: body,
  });
  const uploadData = await uploadRes.json();
  console.log('   Status:', uploadRes.status);
  console.log('   Response:', JSON.stringify(uploadData, null, 2));

  if (uploadData.success) {
    console.log('\n🎉 SUCCESS! Check your email inbox for the AI summary.');
  } else {
    console.log('\n❌ Upload failed:', uploadData.error);
  }
}

testUpload().catch(err => console.error('Test error:', err.message));
