# READABLE — IMPLEMENTATION PLAN & AUDIT REPORT (PHASE 0)

> **Version:** 0.1.0  
> **Status:** Implementation Plan & Repository Audit  
> **Product:** ReadAble — Universal Accessible Document Converter  
> **Approach:** Rule-based document transformation & accessibility — **NO AI/ML/LLM/Vector DB/AI OCR**  

---

## 1. REPOSITORY AUDIT

### 1.1 Document & Specification Summary
- **PRD.md**: Defines product vision, core pipeline (Upload -> Parse -> Structure -> Analyze -> Reflow -> Personalize -> Read -> Export), features, accessibility accommodations, and strict non-AI rule.
- **DESIGN.md**: Outlines visual design system, calm/editorial aesthetic, typography (OpenDyslexic, Inter), color palette (`--cream-bg`, `--taupe-accent`), component hierarchy, and tabbed reader UI layout.
- **ERD.md**: Defines 9 core database entities (`users`, `documents`, `document_sections`, `processing_jobs`, `reading_profiles`, `reading_progress`, `accessibility_reports`, `accessibility_issues`, `export_jobs`) for PostgreSQL + SQLAlchemy 2.0.

### 1.2 Prototype v0 vs Target System Gap Analysis

| Component | v0 Prototype State | Phase 0 Target State |
| :--- | :--- | :--- |
| **Backend API** | None (Client-side mock logic) | FastAPI (Python 3.12+) with modular routes |
| **Database** | `sessionStorage` mock persistence | PostgreSQL + SQLAlchemy 2.0 ORM + Alembic |
| **Authentication** | None | JWT-based Auth (`/auth/register`, `/auth/login`, `/auth/me`) |
| **Document Storage**| None | Abstracted `StorageService` (Local dev, S3 prod ready) |
| **Processing Pipeline** | Fake 12s countdown timer & hardcoded 74% score | Life-cycle state engine (`UPLOADED` -> `QUEUED`) |
| **Routing** | Generic hardcoded `/reader` | Document-centric `/documents/[documentId]/reader` |

---

## 2. PHASE 0 ARCHITECTURE PLAN

```text
                                  READABLE ARCHITECTURE (PHASE 0)
┌─────────────────────────────────────────────────────────────────────────────────────────────┐
│ Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 + Lucide React                      │
│ Routes: / (Landing), /login, /register, /documents, /documents/[id]/[processing|reader]     │
└───────────────────────────────┬─────────────────────────────────────────────────────────────┘
                                │ REST API (JWT Bearer Token)
┌───────────────────────────────▼─────────────────────────────────────────────────────────────┐
│ FastAPI (Python 3.12+) Backend Service                                                      │
│ app/api (auth, documents, profiles, health)                                                 │
│ app/core (config, security, storage)                                                        │
│ app/models & app/schemas & app/repositories                                                 │
└───────┬──────────────────────────────────────────────┬──────────────────────────────────────┘
        │ SQLAlchemy 2.0 / Alembic                      │ StorageService Abstraction
┌───────▼──────────────────────┐             ┌─────────▼──────────────────────────┐
│ PostgreSQL Database          │             │ Local Storage (`./storage/uploads`)│
│ (9 ERD Tables & Models)      │             │ S3-compatible ready interface      │
└──────────────────────────────┘             └────────────────────────────────────┘
```

---

## 3. IMPLEMENTATION SEQUENCE

1. **Cleanups & Config Fixes**: Update `next.config.mjs` to remove deprecated `eslint` option warnings.
2. **Backend Foundation**: Set up FastAPI service, configuration management (`pydantic-settings`), password security (bcrypt), and JWT auth utilities.
3. **Database Foundation**: Implement 9 SQLAlchemy models from ERD.md, configure Alembic migrations, and write initial migration script.
4. **File Storage Abstraction**: Implement `StorageService` and `LocalStorageService` with strict file validation (MIME, extension, size limit, path traversal defense).
5. **API Endpoints**:
   - `GET /health`, `GET /health/db`
   - `POST /auth/register`, `POST /auth/login`, `POST /auth/logout`, `GET /auth/me`
   - `POST /documents`, `GET /documents`, `GET /documents/{id}`, `DELETE /documents/{id}`
6. **Frontend API & Routing**: Centralized API client (`lib/api/client.ts`), authentication pages, document dashboard, and document-centric reader routes.
7. **Environment & Docker**: Prepare `.env.example` and `docker-compose.yml` for local execution (PostgreSQL, Redis, FastAPI, Next.js).
8. **Automated Testing**: Pytest suite for health check, authentication flow, file upload validation, and document ownership security checks.

---

## 4. ACCEPTANCE CHECKLIST (PHASE 0)

- [x] Repository architecture documented
- [x] IMPLEMENTATION_PLAN.md created
- [x] v0 prototype preserved in `prototype/v0` branch
- [ ] Frontend foundation working
- [ ] FastAPI running
- [ ] PostgreSQL running
- [ ] SQLAlchemy configured
- [ ] Alembic configured
- [ ] All 9 models exist
- [ ] Initial migration works
- [ ] Auth foundation works (Register, Login, Protected routes)
- [ ] PDF upload & file storage abstraction working
- [ ] Document record & Processing job created (`QUEUED`)
- [ ] Document ownership enforced
- [ ] API client exists
- [ ] Environment configuration exists
- [ ] Basic automated tests pass
- [ ] No fake processing or fake scores presented as real
- [ ] Strict non-AI rule enforced
