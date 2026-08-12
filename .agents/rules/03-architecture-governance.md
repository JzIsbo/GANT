# GANTT — ARCHITECTURE GOVERNANCE

This document defines the official governance framework for proposing, reviewing, evaluating, approving, recording, changing, and freezing technical architecture decisions within the **GANTT** project.

This document defines **ARCHITECTURE GOVERNANCE PROCESSES ONLY**. It does NOT select or pre-determine any specific technology stack, framework, database engine, UI library, cloud vendor, or infrastructure configuration. All technical stack decisions remain **[OPEN]** until formally evaluated and approved through this governance process.

---

## 1. CORE GOVERNANCE PRINCIPLES & AUTHORITY ALIGNMENT

### 1.1 Final Architecture Authority (Rule 00 & Rule 02 Compliance)
Architecture governance strictly obeys the authority domain separation established in [.agents/rules/02-agent-roles.md](file:///c:/Users/Julius%20Wisnu/.gemini/antigravity/scratch/GANTT/.agents/rules/02-agent-roles.md):
- **Human / Client**: Supreme decision authority. Retains final approval authority for all consequential architecture decisions, high-risk technical proposals, schema changes, storage models, deployment designs, and infrastructure choices.
- **Principal Architect Role**: Responsible for technical architecture analysis, trade-off evaluations, alternative comparisons, architectural recommendations, and technical consistency reviews. *Does NOT possess unrestricted final decision authority.*
- **Senior Implementation Engineer Role**: Implements software strictly within approved, frozen architecture baselines.
- **Validation / QA Reviewer Role**: Independently verifies implementation compliance against approved architecture standards.
- **Antigravity Execution Environment**: Orchestrates context, tool calls, and execution of approved architecture plans.

### 1.2 No Silent Escalation to Fact
No AI agent may silently convert its own technical recommendation, proposal, or preference into an approved architecture decision. A technical design remains a candidate **[PROPOSAL]** until explicit Human / Client approval is recorded.

### 1.3 Strict Prohibition Against Premature Technology Decisions
The following technology choices are explicitly **NOT APPROVED** and MUST NOT be assumed, implemented, or treated as established facts prior to formal architecture discovery and Human / Client sign-off:
- Application frameworks (Laravel, Python/Django/FastAPI, Node.js, Spring, etc.) are **NOT APPROVED**.
- Database engines (PostgreSQL, MySQL, MariaDB, SQLite, MongoDB, etc.) are **NOT APPROVED**.
- Containerization and orchestration tools (Docker, Docker Compose, Kubernetes, etc.) are **NOT APPROVED**.
- Document storage implementations (NAS, SMB, S3, NFS, etc.) are **NOT APPROVED**.
- Caching, messaging, and queue services (Redis, RabbitMQ, Memcached, etc.) are **NOT APPROVED**.
- Frontend frameworks (Vue, React, Angular, Blade, Svelte, etc.) are **NOT APPROVED**.
- Cloud providers and deployment infrastructure are **NOT APPROVED**.

These technologies may be evaluated during future architecture discovery, but MUST remain **[OPEN]** until formally approved.

---

## 2. DECISION STATUS LIFECYCLE & TAGS

All architecture communications, proposals, ADRs, and baseline documents must strictly use the following explicit status tags:

- **[PROPOSAL]**: Candidate technical solution, design proposal, or architectural recommendation submitted for review (unapproved).
- **[ACKNOWLEDGED]**: Human / Client has acknowledged or reviewed the technical proposal, but has **NOT** formally approved the decision. *[ACKNOWLEDGED] MUST NEVER be interpreted as approval.*
- **[APPROVED ARCHITECTURE]**: Technical decision explicitly approved by Human / Client through the formal approval process.
- **[FROZEN]**: An approved architecture decision recorded in the official Architecture Baseline (`docs/architecture/architecture-baseline.md`) that may not be modified without formal change-control.
- **[FACT]**: Confirmed, previously approved architecture baseline or verified empirical technical evidence.
- **[OPEN]**: Known architectural concern or technology decision that has not yet been resolved.
- **[ASSUMPTION]**: Declared temporary technical assumption, which must **NEVER** silently become approved architecture.
- **[RISK]**: Identified technical, operational, maintainability, or security risk.
- **[BLOCKED]**: Implementation halted because required technical architecture is unresolved or unapproved.
- **[DECISION REQUIRED]**: Architectural decision requiring explicit Human / Client authorization.

---

## 3. ARCHITECTURE DECISION LIFECYCLE

Every technical architecture decision must progress sequentially through seven mandatory phases:

$$\text{1. Requirement Mapping} \rightarrow \text{2. Candidate Proposal} \rightarrow \text{3. Multi-Criteria Evaluation} \rightarrow \text{4. Technical Review} \rightarrow \text{5. Human Approval} \rightarrow \text{6. ADR Recording} \rightarrow \text{7. Baseline Freeze}$$

1. **Phase 1 — Requirement Mapping**: Trace the technical need directly to approved business requirements in [.agents/rules/01-project-constitution.md](file:///c:/Users/Julius%20Wisnu/.gemini/antigravity/scratch/GANTT/.agents/rules/01-project-constitution.md). Unmapped architecture proposals are prohibited.
2. **Phase 2 — Candidate Proposal**: Principal Architect drafts standardized proposal containing architectural options (`[PROPOSAL]`).
3. **Phase 3 — Multi-Criteria Evaluation**: Evaluate candidates against 10 mandatory architectural criteria (Section 5).
4. **Phase 4 — Technical Review**: Technical review by Principal Architect and Validation / QA roles.
5. **Phase 5 — Human Approval**: Submission of proposal to Human / Client for explicit authorization (`[DECISION REQUIRED]`). Review acknowledgment without explicit sign-off is tagged `[ACKNOWLEDGED]` and remains unapproved.
6. **Phase 6 — ADR Recording**: Documenting approved decision in an Architecture Decision Record (ADR) under `docs/architecture/adr/`.
7. **Phase 7 — Baseline Freeze**: Recording approved decision in the official Architecture Baseline (`docs/architecture/architecture-baseline.md`) and tagging as `[FROZEN]`.

---

## 4. STANDARDIZED ARCHITECTURE PROPOSAL FORMAT

All architecture proposals submitted for review MUST use the following standard structure:

1. **Title & Target Domain**: Descriptive name and affected system boundary.
2. **Traceability Mapping**: Direct link to target requirements in [01-project-constitution.md](file:///c:/Users/Julius%20Wisnu/.gemini/antigravity/scratch/GANTT/.agents/rules/01-project-constitution.md).
3. **Problem Statement**: Technical problem or design objective being addressed.
4. **Candidate Options**: Evaluation of Option A (Recommended), Option B (Alternative), and status quo.
5. **10-Criteria Trade-Off Analysis**: Structured assessment against Section 5 evaluation dimensions.
6. **Migration & Rollback Strategy**: Concrete steps for deployment, data migration, and emergency rollback.
7. **Risk Assessment**: Potential operational, security, or maintainability risks.
8. **Recommendation**: Explicit Principal Architect proposal tagged clearly as `[PROPOSAL]`.

---

## 5. MANDATORY 10-CRITERIA TECHNICAL EVALUATION

Every architecture proposal must be evaluated against the following 10 mandatory technical dimensions:

1. **Requirement Traceability**: Direct justification mapping candidate design to confirmed business rules.
2. **Alternative Comparison**: Evaluation of at least two viable technical options (or explicit justification if a single pattern is uniquely forced by constraints).
3. **Trade-Off Analysis**: Explicit balance of performance, complexity, developer velocity, and maintainability.
4. **Scalability & Data-Volume Assessment**: Ability to handle project data scaling, query volume, and historical activity growth over time.
5. **Reliability & Failure-Mode Assessment**: Fault tolerance, error isolation, data corruption prevention, and crash recovery.
6. **Maintainability & Client Handover Assessment**: Code clarity, standard industry patterns, transparent configuration, and ease of handover to the client IT team.
7. **Security & Data Safety**: Secret isolation, access boundaries, authentication/authorization safety, and protection against unauthorized data access.
8. **Operational Complexity**: Ease of deployment, monitoring, backup, logging, and infrastructure management.
9. **Total Cost of Ownership (TCO) & Licensing**: License compatibility, operational cost, third-party dependency overhead.
10. **Migration & Rollback Feasibility**: Low-risk deployment pathways, database migration safety, and zero-data-loss rollback plans.

---

## 6. ADR SEPARATION & ARCHITECTURE BASELINE

### 6.1 Architecture Decision Records (ADR) Separation
- Architecture Decision Records (ADRs) represent project architecture documentation, **NOT** agent operating rules.
- **Official ADR Location**: `docs/architecture/adr/`
- *Governance Rule*: ADR files and directories are project architecture assets. They MUST NOT be created or modified during governance-definition tasks.

### 6.2 Official Architecture Baseline Location
- **Official Baseline Location**: `docs/architecture/architecture-baseline.md`
- The Architecture Baseline represents the single source of truth for currently frozen technical architecture (`[FROZEN]`).
- *Governance Rule*: This file MUST NOT be created during governance-definition tasks. Until a decision is explicitly approved and recorded in the baseline file, all technical stack decisions remain **[OPEN]**.

---

## 7. HIGH-RISK ARCHITECTURE & PROGRESS PROTECTION

### 7.1 High-Risk Architecture Definition
Cross-referencing Rule 00 and Rule 02, the following technical domains are designated as **HIGH RISK**:
- Progress calculation engine and status determination logic.
- Database schema restructuring and destructive data migrations.
- Authentication and authorization architecture.
- Production storage and file-system access architecture.
- Management reporting and critical business data pipelines.
- Production deployment and infrastructure architecture.

### 7.2 Progress Protection Rule
Any architectural proposal affecting progress calculations, activity weighting, schedule variance/delay metrics, or historical data integrity MUST receive **HIGH-RISK** governance treatment:
1. Cannot be self-approved by any AI model.
2. Requires explicit validation review by the Validation / QA Reviewer role.
3. Requires explicit Human / Client authorization before implementation begins.

---

## 8. ARCHITECTURE CHANGE-CONTROL & CONFLICT RESOLUTION

### 8.1 Architecture Change-Control Process
To modify or supersede an approved, frozen architecture baseline (`[FROZEN]`):
1. **Change Request**: Submit formal change request explaining why the existing baseline is insufficient.
2. **Impact Assessment**: Evaluate impact on existing code, data schemas, API consumers, and client maintainability.
3. **Migration & Rollback Plan**: Detail backward compatibility and data migration steps.
4. **Human Re-Approval**: Submit to Human / Client for explicit authorization (`[DECISION REQUIRED]`).

### 8.2 Conflict Resolution Between Architecture Proposals
If two technical proposals or AI agent analyses conflict:

$$\text{Approved Requirements (01)} \rightarrow \text{Empirical Technical Evidence} \rightarrow \text{Principal Architect Review} \rightarrow \text{If Consequential / Unresolved} \rightarrow \text{Human / Client Decision}$$

1. Evaluate both options strictly against requirements in [01-project-constitution.md](file:///c:/Users/Julius%20Wisnu/.gemini/antigravity/scratch/GANTT/.agents/rules/01-project-constitution.md) and empirical benchmark evidence.
2. Principal Architect conducts technical review and issues a recommendation (`[PROPOSAL]`).
3. If the disagreement is consequential or unresolved, escalate immediately to **Human / Client** (`[DECISION REQUIRED]`).

---

## 9. TRACEABILITY FROM ARCHITECTURE TO IMPLEMENTATION

- **Pre-Implementation Check**: Implementation agents MUST verify that every planned code modification traces directly to an `[APPROVED ARCHITECTURE]` ADR recorded in `docs/architecture/architecture-baseline.md` (`[FROZEN]`).
- **Scope Boundary Enforcement**: Writing code for unapproved architecture designs is strictly forbidden.
- **Handover Standard**: All architectural implementations must be clean, predictable, standard, and fully maintainable by the client's IT team without requiring AI agent contextual knowledge.
