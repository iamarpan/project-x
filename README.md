# AI Interview Assistant

A modern AI-powered interview assistant designed to automate and enhance the hiring process. The system provides recruiters with structured interview workflows, AI-driven assessments, and seamless candidate interactions.

## Features

### For Recruiters
- **Interview Template Builder:** Create custom interview templates with text inputs, multiple-choice questions, and video responses
- **Automated Candidate Screening:** AI-powered scoring and evaluation of candidate responses
- **Scheduling & Invitations:** Calendar integration and automated invitations
- **Candidate Review Dashboard:** Review responses, watch videos, and compare candidates side-by-side
- **Data Analytics:** Visualize hiring metrics and gain insights

### For Candidates
- **Automated Interview Interface:** Submit text, multiple-choice, and video responses
- **Progress Tracking:** Monitor interview status and receive updates
- **User-Friendly Experience:** Mobile-responsive UI with real-time validation

## Tech Stack

- **Frontend:** React.js with Tailwind CSS
- **Backend:** Python FastAPI 
- **Database:** PostgreSQL (SQLite for development)
- **AI Integration:** OpenAI API
- **Authentication:** JWT/OAuth2

## Project Structure

```
project-x/
├── frontend/              # React frontend app
│   ├── public/            # Static files
│   └── src/               # React source code
│       ├── components/    # Reusable components
│       ├── context/       # Global state management
│       ├── hooks/         # Custom React hooks
│       ├── layouts/       # Page layouts
│       ├── pages/         # Page components
│       ├── styles/        # CSS/Tailwind styles
│       └── utils/         # Utility functions
├── backend/               # Python FastAPI backend
│   ├── app/               # Application code
│   │   ├── routers/       # API endpoint routers
│   │   ├── models.py      # Database models
│   │   ├── schemas.py     # Pydantic schemas
│   │   ├── crud.py        # Database operations
│   │   ├── auth.py        # Authentication logic
│   │   ├── ai_engine.py   # AI analysis logic
│   │   ├── database.py    # Database connection
│   │   ├── utils.py       # Utility functions
│   │   └── main.py        # FastAPI application
│   └── requirements.txt   # Python dependencies
├── docker-compose.yml     # Docker Compose configuration
├── README.md              # Project documentation
└── .env.example           # Example environment variables
```

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Python 3.10+
- PostgreSQL (optional for local development)
- Docker and Docker Compose (for containerized setup)

## Running Locally

### Frontend Setup
```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm start
```

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# On Windows:
.venv\Scripts\activate
# On macOS/Linux:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Copy .env.example to .env and configure as needed
cp .env.example .env

# Start the backend server
uvicorn app.main:app --reload
```

### Running with Docker Compose

The easiest way to run the entire application stack is using Docker Compose:

```bash
# Build and start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

### Configuration

To configure the application, you can modify these files:
- Backend: `.env` file in the backend directory (copy from `.env.example`)
- Frontend: No configuration needed for development

### Demo Credentials

For demo purposes, you can use:
- Recruiter: recruiter@example.com (any password)
- Candidate: candidate@example.com (any password)

## Development Workflow

### Backend Development

The backend is built with FastAPI and follows this structure:
- `app/main.py`: Main application entry point
- `app/routers/`: API endpoint definitions 
- `app/models.py`: SQLAlchemy ORM models
- `app/schemas.py`: Pydantic validation schemas
- `app/crud.py`: Database operations
- `app/ai_engine.py`: AI integration for response analysis

To add a new API endpoint, create or modify files in the `app/routers/` directory.

### Frontend Development

The frontend is built with React.js and uses:
- React Router for navigation
- Tailwind CSS for styling
- Zustand for state management
- Formik for form handling

## Key Components

### Recruiter Features
- **Template Builder:** Create, edit, and manage interview templates with different question types
- **Scheduler:** Set up interviews, send invitations, and track candidate progress
- **Review Dashboard:** Evaluate candidate responses with AI-assisted scoring and analysis
- **Analytics:** Track hiring metrics, conversion rates, and performance indicators

### Candidate Features
- **Interview Portal:** Take interviews, submit responses, and track progress
- **Dashboard:** View pending and completed interviews
- **Feedback:** Review performance feedback and AI-generated suggestions

## License
MIT 