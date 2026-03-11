const express = require('express');
const router = express.Router();
const uploadLimiter = require('../middleware/rateLimiter');
const upload = require('../middleware/fileValidator');
const { parseFile } = require('../services/fileParser');
const { analyzeData } = require('../services/groqService');
const { sendSummaryEmail } = require('../services/emailService');

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * @swagger
 * /upload:
 *   post:
 *     summary: Upload a CSV/Excel file for AI analysis
 *     description: Accepts a CSV or XLSX file along with an email address. The file data is analyzed by AI and a summary is emailed to the provided address.
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - email
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: CSV or XLSX file (max 5MB)
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Recipient email address
 *     responses:
 *       200:
 *         description: Summary generated and emailed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Summary sent to user@example.com
 *       400:
 *         description: Invalid file type or bad request
 *       422:
 *         description: Missing file or email
 *       429:
 *         description: Rate limit exceeded
 *       500:
 *         description: Internal server error
 */
router.post('/', uploadLimiter, (req, res) => {
  upload.single('file')(req, res, async (err) => {
    try {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({ success: false, error: 'File too large. Maximum size is 5MB.' });
        }
        return res.status(400).json({ success: false, error: err.message });
      }

      if (!req.file) {
        return res.status(422).json({ success: false, error: 'No file uploaded. Please select a CSV or XLSX file.' });
      }

      const email = req.body.email;
      if (!email) {
        return res.status(422).json({ success: false, error: 'Email address is required.' });
      }

      if (!EMAIL_REGEX.test(email)) {
        return res.status(400).json({ success: false, error: 'Invalid email address format.' });
      }

      const { headers, rows } = parseFile(req.file.buffer, req.file.originalname);
      console.log(`Parsed file: ${headers.length} columns, ${rows.length} rows`);

      console.log('Calling Groq AI...');
      const summary = await analyzeData(headers, rows);
      console.log('Groq AI response received');

      // Send response immediately, email in background
      res.json({ success: true, message: `Summary sent to ${email}` });

      // Fire email in background (don't await)
      console.log('Sending email in background...');
      sendSummaryEmail(email, summary)
        .then(() => console.log('Email sent successfully to', email))
        .catch((emailErr) => console.error('Email failed:', emailErr.message));

    } catch (error) {
      console.error('Upload processing error:', error.message, error.stack);
      if (!res.headersSent) {
        res.status(500).json({ success: false, error: 'Something went wrong while processing your file. Please try again.' });
      }
    }
  });
});

module.exports = router;
