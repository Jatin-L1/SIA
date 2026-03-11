# Rabbitt AI - Sales Insight Automator

A full-stack web application that lets you upload any CSV or Excel file, analyzes the data using AI (Groq LLM), and emails you a professional executive summary. The AI reads column headers and automatically figures out what the data is about -- sales, inventory, HR, finance, anything.

---

## Live Demo

| Service | URL |
|---------|-----|
| Frontend | https://sia-cyan.vercel.app |
| Backend API | https://rabbit-backend-fst9.onrender.com |
| Swagger Docs | https://rabbit-backend-fst9.onrender.com/api-docs |
| Health Check | https://rabbit-backend-fst9.onrender.com/health |

---

## Docker Hub Images

| Image | Pull Command |
|-------|-------------|
| Backend | `docker pull jatinsharma2435/rabbitt-backend:latest` |
| Frontend | `docker pull jatinsharma2435/rabbitt-frontend:latest` |

- Backend: [hub.docker.com/r/jatinsharma2435/rabbitt-backend](https://hub.docker.com/r/jatinsharma2435/rabbitt-backend)
- Frontend: [hub.docker.com/r/jatinsharma2435/rabbitt-frontend](https://hub.docker.com/r/jatinsharma2435/rabbitt-frontend)

---

## Architecture

```
                         +------------------+
                         |   User (Browser) |
                         +--------+---------+
                                  |
                          Upload CSV/XLSX
                          + enter email
                                  |
                                  v
                     +------------+------------+
                     |   Next.js Frontend      |
                     |   (Port 3000)           |
                     +------------+------------+
                                  |
                            POST /upload
                         (multipart/form-data)
                                  |
                                  v
                     +------------+------------+
                     |   Express.js Backend    |
                     |   (Port 8000)           |
                     +---+----------------+----+
                         |                |
                         v                v
                  +------+------+  +------+------+
                  |  Groq AI    |  |   EmailJS   |
                  |  (LLM API)  |  |  (HTTP API) |
                  +------+------+  +------+------+
                         |                |
                    AI Summary       Email sent
                    generated        to your inbox
```

### Data Flow
1. User uploads a CSV/XLSX file and enters email address on the frontend
2. Frontend sends a `POST /upload` request with the file and email
3. Backend parses the file (CSV via `csv-parse`, XLSX via `xlsx` library)
4. Data is sent to Groq AI (llama-3.1-8b-instant) for analysis
5. AI generates a professional executive summary
6. Summary is formatted to HTML and emailed via EmailJS API
7. User receives the summary in their inbox

---

## Features

- Upload any CSV or XLSX file (up to 5MB)
- Universal data support -- sales, students, inventory, HR, finance, etc.
- AI auto-detects data type from column headers and content
- Smart sampling for large files (1000+ rows) with representative data selection
- Professional HTML email with formatted summary
- Swagger/OpenAPI documentation at `/api-docs`
- Rate limiting (10 requests per 15 minutes per IP)
- File validation (type + size + MIME check)
- Security headers via Helmet.js
- Docker multi-stage builds with docker-compose
- CI/CD pipeline with GitHub Actions
- Non-root Docker containers

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 14, React 18 | Server-side rendered UI |
| Backend | Node.js, Express.js | REST API server |
| AI Engine | Groq API (llama-3.1-8b-instant) | Data analysis and summary generation |
| Email | EmailJS (HTTP API) | Email delivery service |
| File Parsing | csv-parse, xlsx | CSV and Excel file processing |
| Security | Helmet.js, express-rate-limit, CORS | HTTP security headers, rate limiting |
| Containerization | Docker, docker-compose | Multi-stage builds, orchestration |
| CI/CD | GitHub Actions | Automated lint, build, test, Docker verify |
| API Docs | Swagger UI (swagger-jsdoc) | Interactive API documentation |
| Deployment | Render (backend), Vercel (frontend) | Cloud hosting |

---

## Project Structure

```
rabbitt-sales-automator/
|
+-- backend/
|   +-- src/
|   |   +-- index.js                  # Express app entry point, CORS, Helmet, Swagger
|   |   +-- routes/
|   |   |   +-- upload.js             # POST /upload with Swagger JSDoc annotations
|   |   +-- services/
|   |   |   +-- groqService.js        # Groq AI integration + smart data sampling
|   |   |   +-- emailService.js       # EmailJS HTTP API + markdown-to-HTML converter
|   |   |   +-- fileParser.js         # CSV and XLSX parser
|   |   +-- middleware/
|   |       +-- rateLimiter.js        # 10 req / 15 min rate limiter
|   |       +-- fileValidator.js      # Multer config: type, MIME, size validation
|   +-- swagger.js                    # Swagger/OpenAPI spec config
|   +-- package.json
|   +-- Dockerfile                    # Multi-stage production build
|   +-- .dockerignore
|   +-- .env.example                  # Environment variable template
|   +-- .eslintrc.json                # ESLint configuration
|
+-- frontend/
|   +-- pages/
|   |   +-- index.js                  # Main UI: drag-drop, upload flow, states
|   |   +-- _app.js                   # App wrapper with global styles
|   +-- styles/
|   |   +-- globals.css               # Dark theme UI with animations
|   +-- package.json
|   +-- Dockerfile                    # Multi-stage standalone build
|   +-- .dockerignore
|   +-- next.config.js                # Standalone output mode
|
+-- docker-compose.yml                # Orchestrates both services
+-- .github/workflows/ci.yml          # CI/CD: lint, build, test, Docker
+-- test_data/sales_q1_2026.csv       # Sample test file
+-- .gitignore
+-- README.md
```

---

## Prerequisites

- **Node.js 18+** -- https://nodejs.org
- **Git** -- https://git-scm.com
- **Docker Desktop** (for Docker setup) -- https://docker.com/products/docker-desktop
- **Groq API Key** (free) -- https://console.groq.com
- **EmailJS Account** (free) -- https://www.emailjs.com

---

## Environment Variables

Create a `backend/.env` file using `backend/.env.example` as a template:

| Variable | Required | Description |
|----------|----------|-------------|
| `GROQ_API_KEY` | Yes | Groq API key (starts with `gsk_`) |
| `EMAILJS_SERVICE_ID` | Yes | EmailJS service ID |
| `EMAILJS_TEMPLATE_ID` | Yes | EmailJS email template ID |
| `EMAILJS_PUBLIC_KEY` | Yes | EmailJS public key |
| `EMAILJS_PRIVATE_KEY` | Yes | EmailJS private/access key |
| `FRONTEND_URL` | Yes | Frontend URL for CORS allowed origin |
| `PORT` | No | Backend port (default: 8000) |

```env
# backend/.env
GROQ_API_KEY=gsk_your_key_here
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
FRONTEND_URL=http://localhost:3000
PORT=8000
```

---

## Quick Start (Local Development)

### 1. Clone the repository
```bash
git clone https://github.com/Jatin-L1/SIA.git
cd SIA
```

### 2. Set up the backend
```bash
cd backend
cp .env.example .env
# Edit .env with your actual API keys
npm install
npm start
```

### 3. Set up the frontend (new terminal)
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
- **Frontend**: http://localhost:3000
- **Health Check**: http://localhost:8000/health
- **Swagger Docs**: http://localhost:8000/api-docs

---

## Quick Start (Docker)

### Option A: Pull pre-built images from Docker Hub (Fastest)

```bash
# 1. Pull both images
docker pull jatinsharma2435/rabbitt-backend:latest
docker pull jatinsharma2435/rabbitt-frontend:latest

# 2. Create a backend .env file with your API keys
cat > backend.env << EOF
GROQ_API_KEY=your_groq_key
EMAILJS_SERVICE_ID=your_service_id
EMAILJS_TEMPLATE_ID=your_template_id
EMAILJS_PUBLIC_KEY=your_public_key
EMAILJS_PRIVATE_KEY=your_private_key
FRONTEND_URL=http://localhost:3000
PORT=8000
EOF

# 3. Run the backend
docker run -d --name rabbitt-backend -p 8000:8000 --env-file backend.env jatinsharma2435/rabbitt-backend:latest

# 4. Run the frontend
docker run -d --name rabbitt-frontend -p 3000:3000 -e NEXT_PUBLIC_API_URL=http://localhost:8000 jatinsharma2435/rabbitt-frontend:latest
```

Open http://localhost:3000 in your browser.

To stop:
```bash
docker stop rabbitt-backend rabbitt-frontend
docker rm rabbitt-backend rabbitt-frontend
```

### Option B: Build from source with docker-compose

### 1. Ensure Docker Desktop is running

### 2. Configure environment
```bash
cd backend
cp .env.example .env
# Edit .env with your actual API keys
cd ..
```

### 3. Build and run both services
```bash
docker-compose up --build
```

Wait until you see:
```
backend-1  | Server running on port 8000
```

### 4. Access the application
- **Frontend**: http://localhost:3000
- **Health Check**: http://localhost:8000/health
- **Swagger Docs**: http://localhost:8000/api-docs

### 5. Stop the application
```bash
docker-compose down
```

### Docker Details
- **Backend image**: Multi-stage build on `node:18-alpine`, production dependencies only, non-root user, built-in healthcheck
- **Frontend image**: Multi-stage build on `node:18-alpine`, Next.js standalone output, non-root user
- **Orchestration**: `docker-compose.yml` manages both services with health-check dependency ordering
- `.dockerignore` files prevent `node_modules` and `.env` from being copied into images

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/upload` | Upload CSV/XLSX file for AI analysis and email summary |
| `GET` | `/health` | Health check endpoint |
| `GET` | `/api-docs` | Interactive Swagger UI documentation |

### POST /upload

**Request**: `multipart/form-data` with fields:
- `file` (required): CSV or XLSX file, max 5MB
- `email` (required): Recipient email address

**Example**:
```bash
curl -X POST http://localhost:8000/upload \
  -F "file=@test_data/sales_q1_2026.csv" \
  -F "email=you@example.com"
```

**Success Response** (200):
```json
{
  "success": true,
  "message": "Summary sent to you@example.com"
}
```

**Error Responses**:
- `400` - Invalid file type or format
- `422` - Missing file or email
- `429` - Rate limit exceeded
- `500` - Internal server error

---

## Security Overview

| # | Measure | Implementation | Details |
|---|---------|---------------|---------|
| 1 | HTTP Security Headers | Helmet.js | Protects against XSS, clickjacking, MIME sniffing, and other common attacks |
| 2 | Rate Limiting | express-rate-limit | 10 requests per 15 minutes per IP address to prevent abuse |
| 3 | CORS | Dynamic origin validation | Only allows requests from configured frontend URL |
| 4 | File Type Validation | Multer + custom filter | Checks both file extension (.csv/.xlsx) and MIME type |
| 5 | File Size Limit | Multer | Maximum 5MB per upload |
| 6 | Input Validation | Email regex | Validates email format before processing |
| 7 | Memory-Only Storage | Multer memoryStorage | Files are processed in memory, never written to disk |
| 8 | Non-Root Containers | Dockerfile USER | Docker containers run as unprivileged user (UID 1001) |
| 9 | Reverse Proxy Support | trust proxy | Proper client IP resolution behind load balancers |
| 10 | Environment Secrets | dotenv + .gitignore | API keys stored in .env, excluded from version control |

---

## Large File Handling

When a CSV/XLSX file has too many rows to fit in the AI token limit:

1. The system calculates an even sampling interval across all rows
2. Selects up to 80 representative rows spread across the full dataset
3. Always includes the last row for completeness
4. Tells the AI the total row count so it can extrapolate trends
5. Enforces a 12,000 character limit to stay within token bounds

This allows files with 10,000+ rows to be analyzed without errors.

---

## CI/CD Pipeline

The GitHub Actions workflow (`.github/workflows/ci.yml`) runs on every push and PR to `main`:

| Job | What It Does |
|-----|-------------|
| **Lint Backend** | Runs ESLint on all backend source files |
| **Build & Test Backend** | Installs deps, starts the server, hits `/health` endpoint |
| **Build Frontend** | Runs `next build` to verify the frontend compiles |
| **Docker Build** | Builds both Docker images and verifies the backend container starts correctly |

---

## Deployment

### Backend on Render
1. Go to https://render.com, connect GitHub
2. Create a new **Web Service** from the repo
3. Root Directory: `backend`
4. Build Command: `npm install`
5. Start Command: `node src/index.js`
6. Add all environment variables from `.env.example`
7. Deploy

### Frontend on Vercel
1. Go to https://vercel.com, connect GitHub
2. Import the repo
3. Root Directory: `frontend`
4. Add env variable: `NEXT_PUBLIC_API_URL` = your Render backend URL
5. Deploy

After both are deployed, update `FRONTEND_URL` on Render to match your Vercel URL.

---

## License

MIT
