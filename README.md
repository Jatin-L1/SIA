# Rabbitt AI -- Sales Insight Automator

A full-stack web application that analyzes CSV/Excel data using AI (Groq LLM) and emails professional summaries to users.

## Architecture

```
┌──────────┐     ┌──────────────┐     ┌──────────┐
│          │     │              │     │          │
│  User    │────▶│  Next.js     │────▶│ Express  │
│ Browser  │◀────│  Frontend    │◀────│ Backend  │
│          │     │  (Vercel)    │     │ (Render) │
└──────────┘     └──────────────┘     └────┬─────┘
                                           │
                                     ┌─────┴─────┐
                                     │           │
                                ┌────▼───┐  ┌───▼────┐
                                │ Groq   │  │ Gmail  │
                                │ AI API │  │ SMTP   │
                                └────────┘  └────────┘
```

## Features

- Upload any CSV or XLSX file (up to 5MB)
- AI analyzes data dynamically regardless of column structure
- Professional executive summary emailed via Gmail
- Swagger API documentation at /api-docs
- Rate limiting, file validation, and security headers
- Docker support with docker-compose
- CI/CD with GitHub Actions

## Prerequisites

- Node.js 18+
- Docker Desktop (optional, for containerized setup)
- Git
- Groq API key (free at console.groq.com)
- Gmail account with App Password enabled

## Quick Start (Docker)

```bash
git clone https://github.com/YOUR_USERNAME/rabbitt-sales-automator.git
cd rabbitt-sales-automator
# Create backend/.env with your credentials (see Environment Variables below)
docker-compose up --build
```

- Frontend: http://localhost:3000
- Backend Health: http://localhost:8000/health
- API Docs: http://localhost:8000/api-docs

## Quick Start (Local)

```bash
# Backend
cd backend
npm install
# Create .env file (see Environment Variables below)
npm start

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

## Environment Variables

| Variable | Description | Example |
|---|---|---|
| GROQ_API_KEY | Groq API key from console.groq.com | gsk_... |
| GMAIL_USER | Gmail address for sending emails | you@gmail.com |
| GMAIL_APP_PASSWORD | Gmail App Password (16 chars) | abcdefghijklmnop |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:3000 |
| PORT | Backend port | 8000 |
| NEXT_PUBLIC_API_URL | Backend URL for frontend | http://localhost:8000 |

## API Endpoints

| Method | Path | Description |
|---|---|---|
| POST | /upload | Upload CSV/XLSX file for AI analysis |
| GET | /health | Health check endpoint |
| GET | /api-docs | Swagger UI documentation |

## Security

1. Helmet.js for secure HTTP headers
2. Rate limiting -- 10 requests per 15 minutes per IP
3. File type validation -- only .csv and .xlsx accepted
4. File size limit -- maximum 5MB
5. CORS -- restricted to frontend origin
6. Email format validation via regex
7. Memory storage -- files never written to disk

## Tech Stack

- **Frontend:** Next.js 14, React 18, Custom CSS
- **Backend:** Node.js, Express.js
- **AI:** Groq API (llama3-8b-8192)
- **Email:** Nodemailer + Gmail SMTP
- **DevOps:** Docker, GitHub Actions

## License

MIT
