# AI_Resume_Analyzer
An end-to-end AI-powered system that evaluates resumes against job descriptions using Retrieval-Augmented Generation (RAG), vector search, and LLMs to generate contextual insights, scoring, and improvement suggestions.


Overview

This project solves a real problem:
Most resume tools rely on keyword matching. This system instead uses semantic understanding + AI reasoning to:

Compare resumes with job descriptions
Identify missing skills and experience gaps
Generate actionable improvement suggestions
Provide contextual scoring using LLMs


Key Features

Resume parsing and structured text extraction
Semantic matching using embeddings + vector search
RAG pipeline for contextual AI responses
LLM-powered feedback (Ollama Phi-3 + OpenAI)
FastAPI backend with async endpoints
Modern UI using Next.js
Redis caching for performance optimization
Input validation and failure handling (prevents pipeline crashes)
