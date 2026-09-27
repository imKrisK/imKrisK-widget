# imKrisK-Widget: Complete Build Plan & Phases

## Foundation (✅ COMPLETE)
**Phase 0: The Honest Path Foundation**

- Document: `FT0-HONEST-PATH-SYSTEM-PROMPT.md`
- Philosophy: Accurate profile, real achievements, clear boundaries, plain English
- Implementation: `lib/ft0-direct-prompts.ts` (6 recruiter-specific prompts)
- Architecture boundary: `lib/architecture-boundary.ts` (30+ keyword detection)
- Status: ✅ Implemented, deployed on Railway

### Current Live State
✅ Portfolio (left side): Kristoffer's achievements + experience  
✅ FT0 Chat (right side): Live responses, 6 recruiter types  
✅ Honest boundary: "I don't discuss architecture"  
✅ Zero cost: Ollama local  
✅ Railway deployed  
✅ Abuse prevention + injection detection  
✅ Response formatting to cards  

---

## Phase 1: Production Validation (1-2 weeks)
**Goal:** Get real recruiter feedback, identify issues before scaling

**Tasks:**
- [ ] Share URL with 5-10 tech recruiters (target: tech recruiting firms, startups)
- [ ] Request feedback: tone, quality, usefulness
- [ ] Monitor Railway logs for errors/edge cases
- [ ] Track: Which recruiter types triggering? Common questions?
- [ ] A/B test: Try 2-3 different opening messages

**Success Metrics:**
- 5+ recruiter responses
- Feedback score: 7+/10
- <2 bugs found
- Clear pattern in recruiter types

**Deliverable:**
- Feedback document from recruiters
- Usage analytics baseline
- Issue list + prioritization

---

## Phase 2: Response Quality Optimization (2-3 weeks)
**Goal:** Fine-tune FT0 to sound impressive and natural

**Tasks:**
- [ ] Test different Ollama models:
  - deepseek-r1:7b (current, reasoning-focused)
  - mistral-nemo:12b (faster, good quality)
  - llama3.2:3b (lightweight)
  - qwen2.5:32b (powerful, slow)
  
- [ ] Refine recruiter-specific prompts based on feedback
- [ ] Add follow-up question suggestions
- [ ] Test response lengths (concise vs detailed)
- [ ] Validate boundary detector (ask architecture questions)

**Success Metrics:**
- Response quality: 8+/10
- Response time: <30s average
- "Would hire" sentiment: 70%+

**Deliverable:**
- Optimized prompts document
- Recommended Ollama model with benchmark
- Personality/tone guide

---

## Phase 3: Analytics & Engagement (2-3 weeks)
**Goal:** Understand recruiter journey, optimize conversion

**Tasks:**
- [ ] Add analytics tracking:
  - Recruiter type frequency
  - Question categories
  - Conversation flow
  - Bounce rate
  
- [ ] Create dashboard:
  - Common questions
  - Success patterns
  - Conversion funnel
  
- [ ] Lead capture tracking:
  - Did they request info?
  - Did they ask for call?
  - How many → actual opportunities?

**Success Metrics:**
- Conversation completion: 20%+
- Average session: 3+ questions
- Engagement rate: 50%+

**Deliverable:**
- Analytics dashboard
- Engagement report
- Conversion funnel data

---

## Phase 4: UI/UX Polish (1-2 weeks)
**Goal:** Professional, shareable, mobile-ready

**Tasks:**
- [ ] Mobile optimization (responsive, touch-friendly)
- [ ] Animations (smooth transitions, loading states)
- [ ] Chat UI enhancements (timestamps, read receipts)
- [ ] Dark/light mode toggle
- [ ] Export: Copy transcript, download PDF
- [ ] Quick actions: "Book a call", "Send resume"
- [ ] Accessibility: ARIA labels, keyboard navigation

**Success Metrics:**
- Mobile usability: 80%+
- Shareability: 50%+ share on social

**Deliverable:**
- Production-ready UI
- Mobile-friendly experience
- Export/share features

---

## Phase 5: Advanced Features (3-4 weeks)
**Goal:** Richer interactions, better context

**Tasks:**
- [ ] Multi-turn context memory (remember earlier parts of conversation)
- [ ] Smart follow-ups (suggestions based on recruiter type)
- [ ] Export options:
  - PDF transcript
  - JSON summary
  - Email share
  
- [ ] Feedback collection ("Was this helpful?")
- [ ] "Open to work" signal prominently displayed

**Success Metrics:**
- Follow-up questions: 50%+
- Multi-turn completion: 80%+

**Deliverable:**
- Context-aware conversations
- Export/share system
- Feedback collection

---

## Phase 6: Scaling & Reliability (2-3 weeks)
**Goal:** Sustainable, reliable, cost-optimized

**Tasks:**
- [ ] Cost analysis:
  - Option A: Keep Ollama (free)
  - Option B: Add Claude API fallback ($0.41/mo per 100 convos)
  - Option C: Hybrid approach
  
- [ ] Load testing (100 concurrent chats?)
- [ ] Error recovery (graceful fallback if Ollama down)
- [ ] Uptime monitoring (alerts if Railway fails)
- [ ] Rate limiting (prevent abuse)

**Success Metrics:**
- Cost per engagement: <$0.50
- Uptime: 99%+
- Error rate: <1%

**Deliverable:**
- Cost-optimized architecture
- Fallback strategy
- Monitoring & alerts

---

## Phase 7: Recruitment Funnel (2-3 weeks)
**Goal:** Turn interest into actual opportunities

**Tasks:**
- [ ] Lead capture:
  - Optional name/email after 3 questions
  - "Want us to follow up?"
  - LinkedIn profile link
  
- [ ] Follow-up email:
  - Conversation summary
  - "Here's why you're a fit"
  - Calendar link to schedule
  
- [ ] CRM integration:
  - Airtable/Notion
  - Recruiter tracking
  - Pipeline visibility
  
- [ ] Success tracking:
  - Interview requests?
  - Offers?
  - Closed deals?

**Success Metrics:**
- Lead capture: 10%+
- Follow-up open rate: 30%+
- Calendar clicks: 20%+

**Deliverable:**
- Lead capture form
- Follow-up templates
- CRM integration
- Conversion tracking

---

## Phase 8: Multi-Channel Distribution (3-4 weeks)
**Goal:** Meet recruiters on their platforms

**Tasks:**
- [ ] LinkedIn:
  - Embed widget in profile
  - Link in post recommendation section
  - Share via LinkedIn message
  
- [ ] GitHub:
  - Link from GitHub profile
  - Embed in README
  - GitHub Actions badge
  
- [ ] Job boards:
  - Indeed profile link
  - LinkedIn Jobs link
  - Custom URL shortlinks
  
- [ ] Email:
  - Email signature link
  - Track opens/clicks

**Success Metrics:**
- Traffic from integrations: 30%+
- Channel attribution clear

**Deliverable:**
- Multiple entry points
- Per-channel tracking
- Custom URLs

---

## Phase 9: Content & Organic Growth (2-3 weeks)
**Goal:** Organic discovery, social proof

**Tasks:**
- [ ] Blog post: "Why I built this instead of LinkedIn"
- [ ] Tweet thread: FT0 conversations showcase
- [ ] GitHub README: Explain concept
- [ ] HackerNews: "AI portfolio widget" angle
- [ ] Product Hunt: Launch day
- [ ] Twitter: Regular updates with examples

**Success Metrics:**
- HN: 100+ upvotes
- Twitter reach: 10k+
- Product Hunt: Featured
- Organic traffic: 50+ week 1

**Deliverable:**
- Launch content
- Social proof (testimonials)
- Organic traffic

---

## Phase 10: Moat & Differentiation (Ongoing)
**Goal:** Defensible competitive advantage

**Tasks:**
- [ ] Proprietary recruiter detection (not just keywords)
- [ ] Industry-specific templates (not just 6 types)
- [ ] Domain expertise customization
- [ ] Personal brand integration
- [ ] Unique positioning: "AI that tells YOUR story"

**Success Metrics:**
- Time for competitors to replicate: 3+ months
- Patent/trademark opportunities: Evaluated
- Media mentions: 5+

**Deliverable:**
- Defensible moat
- Sustainable differentiation

---

## Timeline & Prioritization

### Quick Path (30 days - "Get Results Fast")
```
Week 1-2:  Phase 1 → Validation
Week 3-4:  Phase 2 → Quality  
Week 5+:   Phase 3 → Analytics

Outcome: Production-validated, optimized, metrics dashboard
Cost: $0
```

### Medium Path (60 days - "Polish & Optimize")
```
Quick Path (Weeks 1-5) + THEN:

Week 7-8:  Phase 4 → UI/UX Polish
Week 9-12: Phase 5 → Features

Outcome: Professional product, shareable, exportable
Cost: $0
```

### Long Path (6+ months - "Sustainable Business")
```
Medium Path + THEN:

Phase 6:  Scaling & Reliability
Phase 7:  Recruitment Funnel
Phase 8:  Multi-channel Distribution
Phase 9:  Organic Growth
Phase 10: Moat & Differentiation

Outcome: Sustainable product with scalable leads
Cost: $0-50/month
```

---

## Decision Matrix: Which Path for You?

| Goal | Choose | Timeline | Effort |
|------|--------|----------|--------|
| Quick win (interviews in 30d) | 🟢 Quick | 4 weeks | 10 hrs/week |
| Professional, polished product | 🟡 Medium | 8 weeks | 15 hrs/week |
| Sustainable business | 🔴 Long | 6+ months | 20 hrs/week |

---

## Success Criteria By Phase

| Phase | Metric | Target |
|-------|--------|--------|
| 0 | Foundation complete | ✅ Done |
| 1 | Recruiter feedback | 7+/10 |
| 2 | Response quality | 8+/10 |
| 3 | Completion rate | 20%+ |
| 4 | Mobile usability | 80%+ |
| 5 | Follow-up rate | 50%+ |
| 6 | Cost per engagement | <$0.50 |
| 7 | Lead capture | 10%+ |
| 8 | Traffic from channels | 30%+ |
| 9 | Organic reach | 50+ week 1 |
| 10 | Competitive moat | 3mo to replicate |

---

## Immediate Next Steps (THIS WEEK)

**Phase 1 Kickoff:**
1. List 10 tech recruiters to share with
2. Prepare feedback survey:
   - Tone (1-10)
   - Quality (1-10)
   - Would you hire? (Yes/No)
   - Any issues?
3. Set up basic logging
4. Share URL with first batch
5. Collect responses

**Your Timeline Decision:**
- [ ] Quick Path (30 days)
- [ ] Medium Path (60 days)
- [ ] Long Path (6+ months)

---

## Reference Documents

- `FT0-HONEST-PATH-SYSTEM-PROMPT.md` - Core philosophy & recruiter versions
- `RESPONSE-QUALITY-FIXES.md` - How we fixed generic responses
- `ISSUES-IDENTIFIED-FIXED.md` - What problems we solved
- `lib/ft0-direct-prompts.ts` - Implemented prompts
- `lib/architecture-boundary.ts` - Boundary detector

---

## Repository Status

✅ Phase 0: Foundation complete  
⏳ Phase 1: Ready to validate  
🚀 Production: Live on Railway at https://imkrisk-widget-production.up.railway.app

**Latest commits:**
```
5ff8faf - docs: Add FT0 Honest Path System Prompt (Phase 0 - Foundation)
30c1f9c - feat: Add honest architecture boundary detector
e52e8a4 - refactor: FT0 honest path with direct prompts
```

