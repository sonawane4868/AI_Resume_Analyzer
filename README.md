# 🚀 AI Resume Analyzer

An end-to-end AI-powered system that evaluates resumes against job descriptions using **Retrieval-Augmented Generation (RAG)**, vector search, and LLMs to generate contextual insights, scoring, and improvement suggestions.

---

## 🔥 Overview

This project solves a real problem:
Most resume tools rely on keyword matching. This system instead uses **semantic understanding + AI reasoning** to:

* Compare resumes with job descriptions
* Identify missing skills and experience gaps
* Generate actionable improvement suggestions
* Provide contextual scoring using LLMs

---

## 🧠 Key Features

* 📄 Resume parsing and structured text extraction
* 🔍 Semantic matching using embeddings + vector search
* 🧩 RAG pipeline for contextual AI responses
* 🤖 LLM-powered feedback (Ollama Phi-3 + OpenAI)
* ⚡ FastAPI backend with async endpoints
* 🌐 Modern UI using Next.js
* 🚀 Redis caching for performance optimization
* 🛡️ Input validation and failure handling (prevents pipeline crashes)

---

## 🏗️ System Architecture

```
Client (Next.js)
      │
      ▼
FastAPI Backend (API Layer)
      │
      ▼
Resume Processing Pipeline
      ├── Text Extraction
      ├── Chunking (Recursive Splitter)
      ├── Embedding Generation
      │
      ▼
Vector Store (FAISS)
      │
      ▼
Similarity Retrieval (RAG)
      │
      ▼
LLM Layer (Phi-3 / OpenAI)
      │
      ▼
Response (Score, Insights, Suggestions)
```

---

## ⚙️ Tech Stack

### Frontend

* Next.js
* Tailwind CSS

### Backend

* FastAPI
* Python

### AI / ML

* RAG (Retrieval-Augmented Generation)
* Embeddings + Cosine Similarity
* FAISS (Vector Database)
* Scikit-learn

### LLM Integration

* Ollama (Phi-3)
* OpenAI API
* Gemini API

### Performance & Infra

* Redis (Caching layer)

---

## 🔍 Core Flow (Detailed)

1. User uploads resume + job description
2. Resume text is extracted and cleaned
3. Text is split into overlapping chunks
4. Embeddings are generated for each chunk
5. Stored in FAISS vector index
6. Relevant chunks retrieved using similarity search
7. Context passed to LLM
8. LLM generates:

   * Resume score
   * Skill gap analysis
   * Improvement suggestions

---

## ⚠️ Engineering Challenges & Solutions

### 1. FAISS Crash (Empty Input)

**Problem:**
Empty or malformed resume → no embeddings → FAISS failure

**Solution:**

* Added input validation
* Guard checks before vector store creation
* Graceful error handling

---

### 2. LLM Latency & Cost

**Problem:**
Repeated queries increased response time

**Solution:**

* Implemented Redis caching for repeated requests
* Reduced redundant LLM calls

---

### 3. RAG Context Quality

**Problem:**
Irrelevant chunks reduce LLM accuracy

**Solution:**

* Optimized chunk size & overlap
* Used cosine similarity for better retrieval

---

## 🚀 Setup & Installation

### 1. Clone Repository

```bash
git clone https://github.com/sonawane4868/ai-resume-analyzer.git
cd ai-resume-analyzer
```

---

### 2. Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate   # Windows

pip install -r requirements.txt
uvicorn app.main:app --reload
```

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create `.env` in backend:

```env
OPENROUTER_API_KEY=your_key
GEMINI_API_KEY=your_key
APP_URL=your_server_url
```

---

## 📈 Future Improvements

* User authentication & dashboard
* Resume history tracking
* Deployment using Docker + AWS
* Streaming LLM responses
* Fine-tuned models for better scoring accuracy

---

## 📊 What Makes This Project Strong

* Not just CRUD → includes **AI system design**
* Uses **RAG pipeline (industry-relevant)**
* Handles **real-world edge cases (failures, caching)**
* Combines **full-stack + AI + backend engineering**

---


## ⭐ Final Note

This project demonstrates practical implementation of:

* Full-stack engineering
* AI system design (RAG + LLMs)
* Backend robustness & failure handling
