# Rabbitt AI - Sales Insight Automator

A full-stack web application that lets you upload any CSV or Excel file, analyzes the data using AI, and emails you a professional executive summary. No matter what your data looks like -- sales, students, inventory, anything -- the AI reads the columns and figures it out.

---

## How It Works

```
                         +------------------+
                         |   You (Browser)  |
                         +--------+---------+
                                  |
                          Upload CSV/XLSX
                          + enter email
                                  |
                                  v
                     +------------+------------+
                     |   Next.js Frontend      |
                     |   (localhost:3000)       |
                     +------------+------------+
                                  |
                            POST /upload
                        (file + email)
                                  |
                                  v
                     +------------+------------+
                     |   Express Backend       |
                     |   (localhost:8000)       |
                     +---+----------------+----+
                         |                |
                         v                v
                  +------+------+  +------+------+
                  |  Groq AI    |  |  Gmail SMTP |
                  |  (LLM API)  |  | (Nodemailer)|
                  +------+------+  +------+------+
                         |                |
                    AI Summary       Email sent
                    generated        to your inbox
```

---

## Features

- Upload any CSV or XLSX file (up to 5MB)
- Works with ANY data -- sales, students, inventory, HR, finance, etc.
- AI reads column headers and figures out what your data is about
- Handles large files (1000+ rows) by smart sampling
- Professional email with formatted summary
- Swagger API docs at /api-docs
- Rate limiting (10 requests per 15 min)
- File validation (only .csv and .xlsx, max 5MB)
- Security headers with Helmet.js
- Docker support with docker-compose
- CI/CD pipeline with GitHub Actions

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, Custom CSS |
| Backend | Node.js, Express.js |
| AI | Groq API (llama-3.1-8b-instant) |
| Email | Nodemailer + Gmail SMTP |
| Containerization | Docker + docker-compose |
| CI/CD | GitHub Actions |
| API Docs | Swagger UI |

---

## Project Structure

```
rabbitt-sales-automator/
|
+-- backend/
|   +-- src/
|   |   +-- index.js                # Express app entry point
|   |   +-- routes/
|   |   |   +-- upload.js           # POST /upload route
|   |   +-- services/
|   |   |   +-- groqService.js      # Groq AI analysis (handles large files)
|   |   |   +-- emailService.js     # Nodemailer email sender
|   |   |   +-- fileParser.js       # CSV and XLSX parser
|   |   +-- middleware/
|   |       +-- rateLimiter.js      # 10 req / 15 min per IP
|   |       +-- fileValidator.js    # File type and size check
|   +-- swagger.js                  # Swagger API config
|   +-- package.json
|   +-- Dockerfile
|   +-- .env                        # Your credentials (not committed)
|   +-- .env.example                # Template for .env
|
+-- frontend/
|   +-- pages/
|   |   +-- index.js                # Main UI page
|   |   +-- _app.js                 # App wrapper
|   +-- styles/
|   |   +-- globals.css             # All styles
|   +-- package.json
|   +-- Dockerfile
|   +-- next.config.js
|
+-- docker-compose.yml              # Run both with one command
+-- .github/workflows/ci.yml        # CI pipeline
+-- test_data/sales_q1_2026.csv     # Sample test file
+-- .gitignore
+-- README.md
```

---

## Prerequisites

Before you start, make sure you have:

1. **Node.js 18+** -- Download from https://nodejs.org
2. **Git** -- Download from https://git-scm.com
3. **Docker Desktop** (optional) -- Download from https://docker.com/products/docker-desktop
4. **Groq API Key** (free) -- Get from https://console.groq.com
5. **Gmail App Password** -- Get from https://myaccount.google.com/apppasswords

---

## Getting Your API Keys

### Groq API Key (Free)
1. Go to https://console.groq.com
2. Sign up with Google
3. Click "API Keys" in the left sidebar
4. Click "Create API Key", name it anything
5. Copy the key (starts with `gsk_...`)

### Gmail App Password
1. Go to https://myaccount.google.com
2. Click Security > 2-Step Verification (turn it ON)
3. Go to https://myaccount.google.com/apppasswords
4. Type app name: `rabbitt`, click Create
5. Copy the 16-character password (remove spaces)

---

## Quick Start (Local - No Docker)

### Step 1: Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/rabbitt-sales-automator.git
cd rabbitt-sales-automator
```

### Step 2: Set up backend
```bash
cd backend
npm install
```

Create a `.env` file in the backend folder:
```
GROQ_API_KEY=gsk_your_key_here
GMAIL_USER=your_email@gmail.com
GMAIL_APP_PASSWORD=your16charpassword
FRONTEND_URL=http://localhost:3000
PORT=8000
```

Start the backend:
```bash
npm start
```

### Step 3: Set up frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### Step 4: Open and test
- Frontend: http://localhost:3000
- Backend Health: http://localhost:8000/health
- API Docs: http://localhost:8000/api-docs

---

## Quick Start (Docker)

### Step 1: Make sure Docker Desktop is running

### Step 2: Create your .env file
Create `backend/.env` with your credentials (see above).

### Step 3: Build and run
```bash
cd rabbitt-sales-automator
docker-compose up --build
```

This builds both images and starts both containers. Wait until you see:
```
backend  | Server running on port 8000
```

### Step 4: Open and test
- Frontend: http://localhost:3000
- Backend Health: http://localhost:8000/health
- API Docs: http://localhost:8000/api-docs

### Stop everything
```bash
docker-compose down
```

---

## Environment Variables

| Variable | Where | Required | Description |
|----------|-------|----------|-------------|
| `GROQ_API_KEY` | Backend .env | Yes | Your Groq API key (starts with gsk_) |
| `GMAIL_USER` | Backend .env | Yes | Gmail address for sending emails |
| `GMAIL_APP_PASSWORD` | Backend .env | Yes | 16-char Gmail App Password |
| `FRONTEND_URL` | Backend .env | Yes | Frontend URL for CORS (http://localhost:3000) |
| `PORT` | Backend .env | No | Backend port (default: 8000) |
| `NEXT_PUBLIC_API_URL` | Frontend env | Yes | Backend URL (http://localhost:8000) |

---

## API Endpoints

| Method | Path | Description | Request |
|--------|------|-------------|---------|
| `POST` | `/upload` | Upload file for AI analysis | multipart/form-data: `file` + `email` |
| `GET` | `/health` | Health check | None |
| `GET` | `/api-docs` | Swagger UI documentation | None |

### POST /upload Example

```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@test_data/sales_q1_2026.csv" \
  -F "email=you@gmail.com"
```

Success Response:
```json
{
  "success": true,
  "message": "Summary sent to you@gmail.com"
}
```

Error Response:
```json
{
  "success": false,
  "error": "Invalid file type. Only .csv and .xlsx files are allowed."
}
```

---

## Security Measures

| # | Protection | Details |
|---|-----------|---------|
| 1 | Helmet.js | Secure HTTP headers (XSS, clickjacking, etc.) |
| 2 | Rate Limiting | 10 requests per 15 minutes per IP address |
| 3 | File Type Check | Only .csv and .xlsx files accepted |
| 4 | File Size Limit | Maximum 5MB per upload |
| 5 | CORS | Only allows requests from frontend URL |
| 6 | Email Validation | Regex check before sending |
| 7 | Memory Storage | Files are never saved to disk |

---

## How Large Files Are Handled

When a CSV/XLSX file has too many rows to fit in the AI context window:
1. The system takes a representative sample (up to 80 evenly-spaced rows)
2. Tells the AI the total row count so it can extrapolate
3. Always includes the first and last rows for trend detection
4. This means even a 10,000-row file works without errors

---

## Deployment

### Backend on Render (Free)
1. Go to https://render.com, sign up with GitHub
2. Click "New +" > "Web Service"
3. Connect your GitHub repo
4. Root Directory: `backend`
5. Build Command: `npm install`
6. Start Command: `node src/index.js`
7. Add environment variables (GROQ_API_KEY, GMAIL_USER, GMAIL_APP_PASSWORD, FRONTEND_URL, PORT=8000)
8. Click Deploy

### Frontend on Vercel (Free)
1. Go to https://vercel.com, sign up with GitHub
2. Click "Add New Project"
3. Import your repo
4. Root Directory: `frontend`
5. Add env variable: `NEXT_PUBLIC_API_URL` = your Render backend URL
6. Click Deploy

After both are deployed, go back to Render and set `FRONTEND_URL` to your Vercel URL.

---

## License

MIT
