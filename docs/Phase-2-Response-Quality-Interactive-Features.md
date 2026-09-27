# Phase 2: Response Quality & Interactive Features (Weeks 5-9)

**Goal:** Transform FT0 from passive responder → interactive consultant

**Timeline:** 2-3 weeks (after Phase 1 feedback)  
**Effort:** 10-15 hrs/week  
**Success Metric:** 8+/10 response quality + recruiter engagement

---

## What Phase 1 Learned (Input)

By October 13, you'll have:
- ✅ Recruiter feedback scores (tone, quality)
- ✅ Common questions recruiters ask
- ✅ Patterns (what resonates, what doesn't)
- ✅ Specific requests ("Can you compare with our stack?")

Phase 2 uses this data to improve.

---

## Phase 2: Three Parallel Workstreams

### WORKSTREAM 1: Response Quality Optimization (Week 1-2)

**Goal:** Improve FT0 answer quality based on Phase 1 feedback

**Tasks:**
- [ ] Test different Ollama models:
  - [ ] deepseek-r1:7b (current)
  - [ ] mistral-nemo:12b (faster, good quality)
  - [ ] llama3.2:3b (lightweight)
  - [ ] qwen2.5:32b (powerful, slower)

- [ ] Benchmark each model:
  - Response time (target: <30 sec)
  - Quality (target: 8+/10)
  - Personality (recruiter feedback)

- [ ] Refine prompts based on Phase 1 feedback:
  - More personality? Add warmth
  - Too technical? Simplify
  - Missing achievements? Highlight more
  - Any wrong info? Correct

- [ ] Test recruiter-specific versions:
  - Does tech recruiter prompt work?
  - Does legal version work?
  - Adjust based on feedback

**Deliverable:** 
- Recommended Ollama model with benchmark
- Updated prompts document
- A/B test results

---

### WORKSTREAM 2: Interactive Branching (Week 2-3)

**Goal:** Transform linear conversations into choices + paths

**Feature: Conversation Branching**

Current flow:
```
Recruiter: "What did you build?"
FT0: [Answers]
[End]
```

New flow:
```
Recruiter: "What did you build?"
FT0: [Answers] + "Would you like to:
1. Deeper dive into how I architected it?
2. Compare my approach with your tech stack?
3. Understand why I made specific decisions?

What interests you most?"

[Recruiter picks → Different conversation path]
```

**Tasks:**
- [ ] Update FT0 prompts with choice logic:
  ```typescript
  "After your answer, always offer 2-3 choices:
  - Recruiter can ask follow-up about YOUR approach
  - Recruiter can request COMPARISON with their stack
  - Recruiter can ask for CONTEXT/REASONING
  
  Wait for response before continuing."
  ```

- [ ] Implement conversation state tracking:
  - Track which path recruiter chose
  - Remember context (don't repeat)
  - Personalize follow-ups

- [ ] Test with sample conversations:
  - Does FT0 remember previous answers?
  - Do choices make sense?
  - Do conversations feel natural?

**Deliverable:**
- Updated FT0 prompts with branching
- Conversation flow documentation
- Test results (5+ sample conversations)

**Effort:** 4-5 hours

---

### WORKSTREAM 3: Repository Analyzer (Week 2-3)

**Goal:** Enable side-by-side comparisons of architectures

**Feature: Safe Repository Analysis**

When recruiter provides a GitHub URL:
```
Recruiter: "Can you compare with our stack? 
Github.com/acme/platform"

FT0: [Analyzes repo safely]

Returns:
✅ Your stack: React + Node + PostgreSQL
✅ Their stack: React + Go + MySQL + Kubernetes
✅ Key differences: Monorepo vs. Microservices approach
✅ Why your approach fits their use case...
❌ (NO file dumps, NO secrets, NO paths, NO sensitive data)
```

**Components to Build:**

1. **Repository Scanner** (`lib/repo-analyzer.ts`)
   - Accept GitHub/GitLab URLs
   - Fetch public files (README, package.json, docker-compose.yml)
   - Scan for: Tech stack, architecture patterns, main services
   - Create summary (NO raw code)
   - Redact sensitive data automatically

   **Example Analysis:**
   ```json
   {
     "repo": "github.com/acme/platform",
     "tech_stack": {
       "frontend": ["React", "Next.js"],
       "backend": ["Go", "gRPC"],
       "data": ["PostgreSQL", "Redis"],
       "infra": ["Kubernetes", "Docker"]
     },
     "architecture": {
       "pattern": "Microservices",
       "services": ["auth", "api", "worker"],
       "deployment": "Kubernetes"
     },
     "key_insights": [
       "Event-driven architecture",
       "Polyglot services (Go backend, React frontend)",
       "Heavy containerization"
     ]
   }
   ```

2. **Comparison Engine** (`lib/comparison-builder.ts`)
   - Compare two architectures:
     - Your imKrisK widget (known)
     - Their repository (scanned)
   - Return narrative comparison:
     - Architectural similarities
     - Key differences
     - Why your approach would/wouldn't fit
     - Relevant achievements

   **Example Output:**
   ```
   ARCHITECTURE COMPARISON
   
   Their Stack: Go + React + Kubernetes + PostgreSQL
   Your Approach: Next.js + Ollama + Railway + Stateless
   
   Similarities:
   - Both use React frontend ✅
   - Both prioritize scalability
   
   Differences:
   - Their backend: Go (compiled, fast, stateless)
   - Your approach: Node.js + Ollama (AI-native)
   
   How Your Approach Differs:
   - You chose Ollama for zero-cost AI
   - They chose distributed microservices
   - Your approach: Fewer moving parts, faster iteration
   - Their approach: Battle-tested at scale
   
   Why This Matters:
   You demonstrated the ability to:
   ✅ Compress 72-hour workflow → 5 hours (automation focus)
   ✅ Choose tech for constraints (free tier first)
   ✅ Ship quickly (ACIL to marketplace in X weeks)
   
   This aligns with: Fast iteration + smart constraints
   ```

3. **Safe Context Guard** (`lib/context-guard.ts`)
   - Automatic redaction rules:
     - Block: Environment variables
     - Block: Database credentials
     - Block: Internal API keys
     - Block: File paths
     - Block: Deployment URLs
   - Safe: Tech stack names
   - Safe: Architecture patterns
   - Safe: Design decisions
   - Safe: Open-source libraries

**Tasks:**
- [ ] Build repo-analyzer.ts:
  - [ ] GitHub API integration (public data only)
  - [ ] Parse README for tech stack
  - [ ] Parse package.json/requirements.txt
  - [ ] Detect architecture patterns
  - Effort: 3 hours

- [ ] Build comparison-builder.ts:
  - [ ] Compare two architecture summaries
  - [ ] Generate narrative comparison
  - [ ] Highlight relevant achievements
  - Effort: 2 hours

- [ ] Build context-guard.ts:
  - [ ] Redaction rules (what to block)
  - [ ] Safe-list (what to allow)
  - [ ] Automatic filtering
  - Effort: 1 hour

- [ ] Test thoroughly:
  - [ ] Test with public repos (GitHub, GitLab)
  - [ ] Verify: No sensitive data leakage
  - [ ] Verify: Comparisons are accurate
  - Effort: 2 hours

**Deliverable:**
- Three new modules (repo-analyzer, comparison-builder, context-guard)
- Test suite with 5+ repositories
- Security audit results

**Total Effort:** 8 hours

---

## Phase 2 Timeline

### Week 1: Foundation (Days 1-7)
```
Mon-Tue: Model testing (deepseek vs mistral vs llama vs qwen)
Wed-Thu: Prompt refinement based on Phase 1 feedback
Fri: Benchmark results + model recommendation
```

**Outcome:** Best-performing model selected + updated prompts

### Week 2: Interactivity + Analysis (Days 8-14)
```
Mon-Tue: Interactive branching implementation
Wed-Thu: Repository analyzer build
Fri: Integration testing
```

**Outcome:** FT0 can branch conversations + safely analyze repos

### Week 3: Polish + Validation (Days 15-21)
```
Mon-Tue: Side-by-side comparison engine
Wed-Thu: Security audit + safe context testing
Fri: End-to-end testing + documentation
```

**Outcome:** Full interactive FT0 ready for recruiters

---

## Success Criteria (End of Phase 2)

✅ **Response Quality:** 8+/10 (up from 6.5+/10)  
✅ **Response Time:** <30 seconds average  
✅ **Conversation Depth:** Recruiters go 5+ turns (vs 2-3 now)  
✅ **Interactive Features:** Branching + comparison working  
✅ **Security:** Zero sensitive data leakage  
✅ **Recruiter Feedback:** "This is impressive" + "I want to talk"  

---

## Decision Tree (After Phase 1)

### If Phase 1 Feedback ≥7/10:
→ **Proceed with Phase 2 full steam**
- Build all three workstreams
- Timeline: 3 weeks

### If Phase 1 Feedback 5-7/10:
→ **Prioritize Response Quality first**
- Workstream 1 only (Week 1-2)
- Skip Workstream 2-3 for now
- Re-evaluate based on improved feedback

### If Phase 1 Feedback <5/10:
→ **Investigate root cause**
- Is it tone? (Fix prompts)
- Is it responses too generic? (Fix Ollama model)
- Is it too technical? (Simplify language)
- Phase 2 adjusts based on diagnosis

---

## Cost & Infrastructure

**Phase 2 Costs:**
- Ollama model testing: $0 (local)
- Repository API access: $0 (GitHub public API)
- Additional Railway resources: $0-10/month (minimal)
- Total: **$0-10/month**

---

## What This Enables (Long-term Vision)

By end of Phase 2, FT0 becomes:

✅ **Smart Interviewer:** Asks targeted questions
✅ **Analyst:** Can analyze recruiter's tech stack
✅ **Advisor:** Compares approaches thoughtfully
✅ **Consultant:** Understands their constraints
✅ **Negotiator:** Can speak their language (Go vs Node, etc)

---

## Reference: How Recruiter Would Use Phase 2 Features

```
Recruiter: "We're building a real-time platform.
We use Go backend + React frontend.
We're hiring for a technical ops role.
Can you tell me about your experience?"

FT0: "I have 10+ years in Technical Operations.
I've automated 72-hour workflows into 5-hour loops.
I've scaled teams from 0→15+ people.

Would you like to:
1. Understand how I approached automation?
2. See how your Go+React stack compares with approaches I've taken?
3. Discuss what I'd bring to your team?

What's most interesting to you?"

Recruiter: "2. Here's our repo: github.com/realtime-platform"

FT0: [Analyzes repo safely]
"I see. You're using Go for the backend (smart choice for 
real-time). You've got React frontend with WebSocket support.

Here's how I'd approach this role:
- My 72→5h automation shows I understand deployment loops
  (which matters for Go + Kubernetes pipelines)
- My team scaling (0→15+) applies to your ops needs
- I've worked with similar async patterns

The key difference: You're optimizing for reliability at scale.
I've optimized for velocity + constraints.
Both matter for a growing team."

Recruiter: "Interesting. When can we talk?"
```

---

## Files to Create/Update (Phase 2)

```
lib/
├── repo-analyzer.ts           (NEW - 200 lines)
├── comparison-builder.ts      (NEW - 150 lines)
├── context-guard.ts           (NEW - 100 lines)
├── ft0-direct-prompts.ts      (UPDATE - add branching logic)
└── ft0-interactive-modes.ts   (NEW - handle conversation states)

docs/
├── Phase-2-Optimization.md    (Detailed playbook)
└── Architecture-Comparison-Guide.md (How comparison works)

tests/
├── repo-analyzer.test.ts
├── comparison-builder.test.ts
└── context-guard.test.ts
```

---

## Next Steps (After Phase 1: Oct 13)

1. Analyze Phase 1 feedback
2. Decide Phase 2 scope:
   - Full speed (all 3 workstreams)?
   - Response quality first (Workstream 1)?
   - Custom based on feedback?
3. Start Phase 2 (mid-late October)
4. Launch enhanced FT0 by early November

---

## Why Phase 2 Wins

Most recruiters:
- Talk AT candidates (one-way)
- Don't understand their tech
- Can't compare approaches

You (Phase 2):
- Talk WITH recruiters (dialogue)
- Understand their tech stack
- Compare intelligently
- Adapt conversation to their needs

This is genuinely differentiated.

