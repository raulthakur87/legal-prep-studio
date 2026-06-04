# Legal Prep Studio - Complete Setup & Documentation

A comprehensive AI-powered legal study material generation platform designed for law professionals preparing for AI annotation jobs, judiciary exams, and professional development.

## 🎯 Project Overview

Legal Prep Studio generates high-quality, contextually relevant legal study materials using Claude AI or OpenAI. It supports 20 Indian law subjects with 6 different generation modes and 4 depth levels, tailored to different user backgrounds and experience levels.

### Key Features

✅ **6 Generation Modes:**
- Study Notes - Comprehensive with bare acts, case law, and practical insights
- Practice Worksheet - Hypotheticals, Q&A with model answers
- Interview Q&A - Expert-level answers for AI annotation and judiciary interviews
- Bare Act Summary - Section-wise analysis of Indian statutes
- Case Analysis - Landmark judgments with ratio and practical significance
- Comparative Analysis - Compare concepts across Indian laws

✅ **4 Depth Levels:**
- Beginner - Simple language, foundational concepts
- Practitioner - 8-10 years legal practice perspective
- Expert - Advanced jurisprudence, complex case law
- Judicial - High Court judge-level analysis

✅ **20 Indian Law Subjects:**
- Core Acts: IPC, CrPC, IEA, ICA, NI, Tort
- Constitutional & Admin: Constitutional Law, Administrative Law
- Specialized: Family, Labor, Property, Cyber, Environmental, Corporate, Tax, Patent Law
- New Laws: BNS, BNSS, BSA

## 📋 Technology Stack

### Backend
- **Runtime:** Node.js (TypeScript/ES6 Modules)
- **Framework:** Express.js
- **Database:** MongoDB with Mongoose ODM
- **AI:** Claude API (Anthropic) / OpenAI API (configurable)
- **Auth:** JWT (jsonwebtoken)
- **Security:** bcryptjs for password hashing

### Frontend (Coming Next)
- **Framework:** React 18+ / Next.js
- **Styling:** Tailwind CSS
- **State:** React Query / Redux
- **HTTP Client:** Axios

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or cloud instance)
- Claude API key OR OpenAI API key

### Installation

1. **Clone Repository**
```bash
git clone https://github.com/raulthakur87/legal-prep-studio.git
cd legal-prep-studio
```

2. **Setup Server**
```bash
cd server
npm install
cp .env.example .env
```

3. **Configure Environment Variables**
```bash
# Edit server/.env
MONGO_URI=mongodb://localhost:27017/legal-prep-studio
PORT=5000
NODE_ENV=development

# Choose AI Provider
AI_PROVIDER=claude  # or openai
CLAUDE_API_KEY=your_key_here
OPENAI_API_KEY=your_key_here

# JWT
JWT_SECRET=your_secret_key_change_in_production
JWT_EXPIRE=7d

# Client
CLIENT_URL=http://localhost:3000
```

4. **Start Server**
```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm run start
```

Server will run on `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

**Register User**
```
POST /api/auth/register
Body: {
  "name": "John Lawyer",
  "email": "john@example.com",
  "password": "securepass123",
  "background": "practicing-lawyer",
  "targetExams": ["Scale AI", "Higher Judiciary"],
  "aiProvider": "claude"
}
Response: { success: true, token: "jwt...", user: {...} }
```

**Login**
```
POST /api/auth/login
Body: { "email": "john@example.com", "password": "securepass123" }
Response: { success: true, token: "jwt...", user: {...} }
```

**Get Current User**
```
GET /api/auth/me
Headers: { "Authorization": "Bearer token..." }
```

**Update Profile**
```
PUT /api/auth/profile
Headers: { "Authorization": "Bearer token..." }
Body: { "name": "...", "background": "...", "aiProvider": "..." }
```

### Content Generation Endpoints

**Generate Study Material**
```
POST /api/content/generate
Headers: { "Authorization": "Bearer token..." }
Body: {
  "subject": "IPC",
  "topic": "General Principles of Criminal Law",
  "mode": "study-notes",
  "depthLevel": "practitioner",
  "customTopic": "Mens Rea in Criminal Liability (optional)"
}
Response: {
  success: true,
  data: {
    id: "material_id",
    subject: "IPC",
    topic: "...",
    mode: "study-notes",
    depthLevel: "practitioner",
    content: "Generated content...",
    metadata: {
      bareActSections: [...],
      relatedCases: [...],
      keywords: [...]
    },
    createdAt: "2026-06-04T..."
  }
}
```

### Material Management Endpoints

**Get Subjects**
```
GET /api/materials/subjects
Response: [
  { id: "IPC", name: "Indian Penal Code, 1860", topicsCount: 7 },
  { id: "CrPC", name: "Code of Criminal Procedure, 1973", topicsCount: 7 },
  ...
]
```

**Get Topics for Subject**
```
GET /api/materials/subjects/IPC/topics
Response: {
  subject: "IPC",
  name: "Indian Penal Code, 1860",
  topics: ["General Principles...", "Punishment...", ...]
}
```

**Get Generation Modes**
```
GET /api/materials/modes
Response: [
  {
    id: "study-notes",
    name: "Study Notes",
    description: "..."
  },
  ...
]
```

**Get Depth Levels**
```
GET /api/materials/depth-levels
Response: [
  { id: "beginner", name: "Beginner", description: "..." },
  ...
]
```

**Get User Materials**
```
GET /api/materials/user-materials?subject=IPC&mode=study-notes&skip=0&limit=20
Headers: { "Authorization": "Bearer token..." }
Response: {
  success: true,
  data: [...],
  pagination: { total: 50, skip: 0, limit: 20, pages: 3 }
}
```

**Get Single Material**
```
GET /api/materials/:id
Headers: { "Authorization": "Bearer token..." }
```

**Update Material**
```
PUT /api/materials/:id
Headers: { "Authorization": "Bearer token..." }
Body: { "content": "Updated content..." }
```

**Delete Material**
```
DELETE /api/materials/:id
Headers: { "Authorization": "Bearer token..." }
```

## 📁 Project Structure

```
legal-prep-studio/
├── server/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MongoDB connection
│   │   ├── models/
│   │   │   ├── User.ts             # User schema with authentication
│   │   │   └── GeneratedMaterial.ts # Material storage schema
│   │   ├── services/
│   │   │   └── aiService.ts        # Claude/OpenAI integration
│   │   ├── routes/
│   │   │   ├── authRoutes.ts       # Auth endpoints
│   │   │   ├── contentRoutes.ts    # Generation endpoints
│   │   │   └── materialRoutes.ts   # Material management
│   │   ├── data/
│   │   │   └── subjects.ts         # Subject/topic reference data
│   │   ├── utils/
│   │   │   └── auth.ts             # JWT middleware
│   │   └── index.ts                # Server entry point
│   ├── .env.example                # Environment template
│   ├── .gitignore
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/                       # Compiled JS (build only)
├── client/                         # React frontend (coming next)
├── .gitignore
└── README.md
```

## 🔐 Security Considerations

- JWT tokens expire after 7 days (configurable)
- Passwords hashed with bcryptjs (salt rounds: 10)
- Environment variables for sensitive data
- CORS configured for authorized origins
- Input validation on all routes
- Protected routes require authentication

## 🚦 Development vs Production

### Development
```bash
cd server
npm run dev
# Runs with ts-node for instant feedback
```

### Production
```bash
cd server
npm run build
npm run start
# Runs compiled JavaScript
```

## 📝 Environment Variables Reference

```
MONGO_URI              MongoDB connection string
PORT                   Server port (default: 5000)
NODE_ENV              'development' or 'production'
AI_PROVIDER           'claude' or 'openai'
CLAUDE_API_KEY        Anthropic Claude API key
OPENAI_API_KEY        OpenAI API key
JWT_SECRET            Secret key for JWT signing
JWT_EXPIRE            Token expiration (e.g., '7d')
CLIENT_URL            Frontend URL for CORS
```

## 🧪 Testing the API

Use Postman or cURL:

```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Lawyer",
    "email": "test@example.com",
    "password": "testpass123",
    "background": "practicing-lawyer",
    "targetExams": ["Scale AI"],
    "aiProvider": "claude"
  }'

# Get token from response, then generate content
curl -X POST http://localhost:5000/api/content/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "subject": "IPC",
    "topic": "General Principles of Criminal Law",
    "mode": "study-notes",
    "depthLevel": "practitioner"
  }'
```

## 🎓 Target Users

- **Law Graduates** preparing for competitive exams
- **Practicing Lawyers** upskilling for AI annotation jobs (Scale AI, Outlier)
- **Judiciary Aspirants** preparing for Higher Judiciary exams
- **Civil Service Aspirants** focusing on legal subjects
- **Law Students** seeking comprehensive study materials

## 🤝 Supported AI Providers

### Claude (Anthropic)
- Model: claude-3-5-sonnet-20241022
- Max Tokens: 4000
- More nuanced legal analysis

### OpenAI
- Model: gpt-4o-mini
- Max Tokens: 4000
- Cost-effective alternative

Switch providers in `.env` file or user preferences.

## 📊 Subjects & Topics Coverage

Each subject includes 5-8 detailed topics:

- **Criminal Law:** IPC, CrPC, BNS, BNSS
- **Evidence & Procedure:** IEA, BSA
- **Civil Law:** ICA, NI, Property, Tort
- **Constitutional & Admin:** Constitutional Law, Administrative Law
- **Specialized:** Family, Labor, Corporate, Tax, Environmental, Cyber, Patent

## 🔄 Data Flow

```
User Request
    ↓
Authentication (JWT)
    ↓
Validation (Subject, Topic, Mode)
    ↓
AI Service (Claude/OpenAI)
    ↓
Generate Content (4000 tokens max)
    ↓
Extract Metadata (Sections, Cases, Keywords)
    ↓
Save to MongoDB
    ↓
Return to Client
```

## 📖 Next Steps

1. **Setup Frontend** - React/Next.js dashboard
2. **Add Caching** - Redis for frequent requests
3. **Implement Analytics** - Track user activity
4. **Add Export Features** - PDF, DOCX generation
5. **Create Admin Panel** - Content moderation
6. **Add Collaboration** - Share materials between users

## 🐛 Troubleshooting

**MongoDB Connection Error**
```
Check MONGO_URI in .env
Ensure MongoDB service is running
```

**API Key Error**
```
Verify CLAUDE_API_KEY or OPENAI_API_KEY in .env
Test key with provider's dashboard
```

**CORS Issues**
```
Update CLIENT_URL in .env
Restart server
```

**Port Already in Use**
```
Change PORT in .env
Or kill process: lsof -ti:5000 | xargs kill -9
```

## 📞 Support

For issues, questions, or contributions:
- Create a GitHub Issue
- Check existing documentation
- Review API examples

## 📄 License

MIT License - Feel free to use and modify

---

**Built for legal professionals by legal professionals** ⚖️
