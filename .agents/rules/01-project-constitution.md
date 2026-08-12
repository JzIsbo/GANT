# GANTT — PROJECT CONSTITUTION

This document defines the official business and product constitution for the **GANTT** project.
It establishes what GANTT is, its primary purpose, functional boundaries, user roles, business lifecycle, conceptual domains, and explicit open business decisions.

This document defines **PRODUCT / BUSINESS CONSTITUTION ONLY**. It does NOT define technical architecture, database schemas, API contracts, or UI layouts.

---

## 1. PRODUCT DEFINITION & PRIMARY PURPOSE

[FACT]
**Product Name**: GANTT
**Definition**: Project Progress, Activity & Commissioning Timeline Management System.

GANTT exists to serve two primary business purposes:
1. **Activity / Data Management**: Capturing, validating, and tracking project activity data over time.
2. **Project Timeline / Progress Analysis**: Analyzing project timelines, commissioning phases, planned vs. actual progress, variance, and schedule position.

---

## 2. STATUS CLASSIFICATION TAGS

Throughout this constitution, information is classified strictly using the following tags:
- **[FACT]**: Confirmed project information.
- **[OPEN]**: Known requirement or domain that requires an explicit client business decision.
- **[PROPOSAL]**: Suggested interpretation or candidate solution (NOT an approved rule).
- **[OUT OF SCOPE]**: Explicitly excluded functionality.

---

## 3. ACTIVITY & DATA MANAGEMENT

[FACT]
GANTT must support:
- Daily Activity management
- Weekly Activity management
- Actual activity data capture
- Activity status management
- Activity date management
- Activity data validation
- Project activity history

[OPEN]
The exact methodology for converting activity data into project progress is NOT currently defined.

---

## 4. PROJECT TIMELINE & PROGRESS ANALYSIS

[FACT]
GANTT must support analysis of:
- Overall project lifecycle
- Project position
- Project duration
- Commissioning phases
- Planned progress
- Actual progress
- Planned vs. Actual comparison
- Progress variance
- Schedule delay
- CxL relationships
- CxL2–CxL3 overlap
- CxL3–CxL4 overlap

[OPEN]
Exact calculation formulas and rules for progress, variance, delay, and overlap remain open until explicitly approved by the client/business authority.

---

## 5. PROJECT COMMISSIONING LIFECYCLE

[FACT]
The conceptual commissioning lifecycle consists of five primary phases:
$$\text{Delivery} \longrightarrow \text{CxL2} \longrightarrow \text{CxL3} \longrightarrow \text{CxL4} \longrightarrow \text{CxL5}$$

Known phase overlap areas:
- CxL2 – CxL3 overlap
- CxL3 – CxL4 overlap

[OPEN]
The following lifecycle rules remain open:
- Exact phase semantics and definitions
- Mandatory start/end trigger conditions
- Fixed vs. dynamic phase durations
- Percentage weight or progress contribution of each phase
- Sequential execution requirements vs. parallel execution
- Overlap calculation logic for CxL2–CxL3 and CxL3–CxL4
- Phase skipping rules and conditions

---

## 6. USER ROLES & ACCESS

[FACT]
The identified user roles are:
1. **Superadmin**
2. **Admin**
3. **Staff / Employee**
4. **Project Head**

[OPEN]
The detailed Role Permission Matrix, authorization hierarchy, and field/feature-level access controls are not yet defined.

---

## 7. CORE CONCEPTUAL FUNCTIONAL DOMAINS

[FACT]
The core conceptual product domains are:
- Project Management
- Project Phase / CxL Management
- Activity Management
- Daily Activity
- Weekly Activity
- Project Timeline / Gantt Chart
- Progress Analysis
- Project Dashboard
- Reporting
- Data Validation
- Document / Attachment Management
- Audit Trail
- System Administration

*Note: These domains are functional concepts only and do not imply specific software packages, database structures, or API designs.*

---

## 8. CONCEPTUAL DATA DOMAINS

### 8.1 Project Domain
[FACT]
A project represents a company project managed within GANTT. Conceptually, it encapsulates project identity, general information, lifecycle phases, activities, planned schedule, actual activity data, progress information, documents, and audit history.

[OPEN]
The complete set of official project attributes and metadata remains open.

### 8.2 Activity Domain
[FACT]
An Activity is a core business entity representing work done, associated with a project, having status, planned and actual dates/conditions, and supporting progress analysis.

[OPEN]
Activity fields, activity hierarchy (WBS/sub-activities), activity dependencies, activity weighting, completion criteria, activity ownership, approval workflows, post-approval editing rules, and historical revision behavior remain open.

### 8.3 Daily Activity and Weekly Activity
[FACT]
Both Daily Activity and Weekly Activity are core components of GANTT.

[OPEN]
The exact business relationship between Daily Activity and Weekly Activity is open.
*Rule*: Do NOT assume $\text{Weekly Activity} = \sum(\text{Daily Activity})$ unless explicitly approved.
*Rule*: Do NOT assume Daily Activity entry automatically alters overall project progress without an approved business formula.

---

## 9. PLANNED VS. ACTUAL COMPARISON

[FACT]
GANTT must support comparison between **Planned** metrics and **Actual** metrics.

[OPEN]
Definitions, metrics, and thresholds for planned progress, actual progress, planned schedule, actual schedule, variance, and delay remain open.

---

## 10. PROGRESS CALCULATION METHODOLOGY

[FACT]
**Status**: UNDEFINED / PENDING CLIENT BUSINESS RULE.

[OPEN]
The official progress calculation formula is not yet established. No formula (weighted average, milestone percentage, quantity-based, duration-based, manual percentage, completion ratio, etc.) is assumed.

[PROPOSAL]
Any candidate progress formula discussed during design is strictly a `[PROPOSAL]` and must receive formal business sign-off before implementation.

---

## 11. PROJECT POSITION, DURATION, VARIANCE & DELAY

### 11.1 Current Project Position
[OPEN]
The business logic defining "current project position" (e.g., date-based, activity-based, milestone-based, CxL-based) remains open.

### 11.2 Duration Rules
[OPEN]
Start/end date sources, working days vs. calendar days, holiday calendar handling, missing date handling, and treatment of incomplete or overlapping phases remain open.

### 11.3 Delay vs. Variance
[FACT]
Progress variance (work accomplished vs. planned) and Schedule delay (time elapsed vs. planned timeline) are distinct concepts and MUST NOT automatically be treated as identical.

[OPEN]
Definitions, mathematical logic, and tolerance thresholds for variance and delay remain open.

---

## 12. SUPPORTING DOMAINS: DOCUMENTS & AUDITABILITY

### 12.1 Document & Attachment Management
[FACT]
Document management supports associating attachments with projects, activities, reports, and approved business entities.

[OPEN]
Document types, versioning strategy, approval/rejection workflows, retention policies, deletion rules, and file-level access controls remain open.

### 12.2 Auditability
[FACT]
GANTT must maintain auditability for business-critical changes and operational actions.

[OPEN]
The detailed scope of audit logging, historical versioning depth, and retention requirements remain open.

---

## 13. PRODUCT BOUNDARIES & OUT OF SCOPE

[FACT]
**In Scope**:
$$\text{Project Activity Capture} + \text{Timeline Analysis} + \text{Progress Analysis} + \text{Commissioning Lifecycle Management}$$

[OUT OF SCOPE]
Unless explicitly approved, GANTT excludes:
- ERP (Enterprise Resource Planning)
- Finance & Accounting
- HR & Payroll Management
- Procurement & Purchasing
- CRM (Customer Relationship Management)
- General Team Chat & Instant Messaging
- AI Predictive Analytics
- IoT (Internet of Things) integration
- Unrelated enterprise modules and external workflow engines

Any feature requested outside the core product boundary must be classified as `[POTENTIAL SCOPE CHANGE]`.

---

## 14. EXPLICIT OPEN BUSINESS DECISIONS

The following 21 business decisions are explicitly unresolved and require client/management approval:

1. Official progress calculation methodology formula.
2. Activity weighting methodology.
3. Daily Activity $\rightarrow$ Weekly Activity relationship & aggregation rules.
4. Activity completion $\rightarrow$ project progress contribution relationship.
5. Planned progress formal definition.
6. Actual progress formal definition.
7. Progress variance definition and formula.
8. Schedule delay definition and formula.
9. Delay and variance alert/tolerance thresholds.
10. Current project position calculation rule.
11. Exact CxL phase semantics and completion criteria.
12. CxL2–CxL3 and CxL3–CxL4 overlap calculation rules.
13. Working-day vs. calendar-day calculation rules.
14. Company holiday calendar and non-working day handling.
15. Detailed Role Permission Matrix (Superadmin, Admin, Staff, Project Head).
16. Activity submission and approval workflow.
17. Document approval and rejection workflow.
18. Document versioning and storage strategy.
19. Historical data revision and retroactive edit policies.
20. Enterprise audit trail depth and retention requirements.
21. Official management reports and key performance indicator (KPI) definitions.

---

## 15. VALIDATION & COMPLIANCE

[FACT]
This constitution has been validated against [.agents/rules/00-agent-operating-protocol.md](file:///c:/Users/Julius%20Wisnu/.gemini/antigravity/scratch/GANTT/.agents/rules/00-agent-operating-protocol.md):
- **Rule Precedence**: Preserved.
- **No Guessing Discipline**: Preserved by explicitly marking unresolved decisions as `[OPEN]`.
- **Progress Calculation Protection**: Preserved by designating calculation formulas as `[OPEN]`.
- **Architecture Separation**: Technical architecture, code, and DB schemas are excluded.
- **Scope Boundaries**: Preserved by explicitly marking non-core capabilities as `[OUT OF SCOPE]`.
