# 🎯 Widget Modernization Plan - October 2026

## Executive Summary
Comprehensive modernization of the imKrisK widget from operations-focused to AI-builder technical showcase. Includes error fixes, responsiveness improvements, new features, and dual-profile system.

---

## Phase 1: Bug Fixes & Performance (PRIORITY 1)

### 1.1 Fix React Error #418 ❌➡️✅
**Issue:** Minified React error related to `text` component
**Root Cause:** Likely serialization issue with Date objects in messages
**Fix:**
- [ ] Convert `Date` objects to ISO strings before serialization
- [ ] Add error boundary component
- [ ] Fix timestamp display logic
- [ ] Test in production build

**Files to Update:**
- `app/components/FT0ChatWidget.tsx` - Date serialization
- `app/components/Portfolio.tsx` - Add ErrorBoundary
- `app/layout.tsx` - Wrap with error boundary

### 1.2 Performance Audit & Optimization
**Metrics to Target:**
- Lighthouse Score: >90
- Load Time: <2s
- Core Web Vitals: All green

**Actions:**
- [ ] Run Lighthouse audit
- [ ] Optimize image sizes
- [ ] Implement code splitting
- [ ] Add lazy loading for below-fold sections

---

## Phase 2: Responsiveness & FT0 Widget (PRIORITY 2)

### 2.1 Fix FT0 Responsiveness
**Target:** Mobile-first design for all screen sizes

**Breakpoints:**
- Mobile: <640px ✅
- Tablet: 640px-1024px
- Desktop: >1024px

**Files to Update:**
- `app/components/FT0ChatWidget.module.css`
- `app/components/Portfolio.module.css`
- `app/page.module.css`

**Key Changes:**
- [ ] Flexible chat widget height
- [ ] Stack on mobile
- [ ] Touch-friendly input (44px+ buttons)
- [ ] Responsive font sizes
- [ ] Proper viewport meta tags

### 2.2 UX/UI Polish
- [ ] Dark mode refinements
- [ ] Loading states
- [ ] Error messaging
- [ ] Accessibility (WCAG 2.1 AA)

---

## Phase 3: Content Expansion (PRIORITY 3)

### 3.1 Add Technical Projects Section
**New Section:** "Technical Innovation"

Projects to showcase:
- **FT0 Widget** - AI-trained decision engine for recruiting
- **ACIL** (mentioned in bio) - Client-side LLM governance
- **Absolute-Zero** - Sovereign AI development OS
- **NIT-IN** - Hardware-attested identity protocol (patented)

**Data Structure:**
```typescript
technical_projects: {
  name: string;
  tagline: string;
  description: string;
  technologies: string[];
  impact: string;
  link?: string;
}[]
```

### 3.2 GitHub Contribution Graph Integration
**Display:** Interactive GitHub stats widget
- Contribution graph (past year)
- Streak information
- Languages used
- Top repositories

**Implementation:**
- Use GitHub API (authenticated)
- Cache data (60min TTL)
- Fallback to static display

### 3.3 AI/ML Capabilities Section
**Content:**
- Prompt engineering expertise
- Multi-tenant architecture knowledge
- Governance layer design
- System prompt crafting

### 3.4 Innovation Metrics Dashboard
**Metrics to Display:**
- Patents filed (1: NIT-IN)
- Open source projects (15+)
- Followers/community (45+)
- Technical artifacts shipped

---

## Phase 4: Dual Profile System (PRIORITY 4)

### 4.1 Profile Toggle Implementation
**Options:**
1. **Operations Profile** (Current)
   - Focus: Legal operations, compliance, automation
   - Audience: Operations hiring managers
   - Metrics: Velocity, team scale, process improvement

2. **Technical Builder Profile** (New)
   - Focus: AI systems, tooling, architecture
   - Audience: Technical leads, founders, investors
   - Metrics: Patents, open source, innovation

**UI/UX:**
- Toggle switch at top of portfolio
- Smooth transition between profiles
- Persist selection in localStorage
- Both profiles share FT0 widget

### 4.2 Data Architecture
**Single Data Source** - Enhanced telemetry-safe.json:
```json
{
  "profile": {...},
  "profiles": {
    "operations": {...},
    "technical": {...}
  },
  "shared": {
    "ai_ml_capabilities": [...],
    "innovation_metrics": {...],
    "github_stats": {...}
  }
}
```

---

## Phase 5: Performance Audit & Deployment (PRIORITY 5)

### 5.1 Comprehensive Testing
- [ ] Unit tests for components
- [ ] E2E tests for chat flow
- [ ] Lighthouse audit
- [ ] Mobile device testing (iOS/Android)
- [ ] Browser compatibility (Chrome, Firefox, Safari)

### 5.2 Security Review
- [ ] Input sanitization
- [ ] API endpoint security
- [ ] Rate limiting
- [ ] CORS configuration
- [ ] Environment variables

### 5.3 Deployment Checklist
- [ ] Build passes with zero errors
- [ ] All environment variables configured
- [ ] Railway deployment tested
- [ ] DNS/SSL verified
- [ ] Monitoring enabled

### 5.4 Post-Launch Monitoring
- [ ] Error tracking (Sentry)
- [ ] Analytics (GA4)
- [ ] Performance monitoring
- [ ] User feedback collection

---

## Implementation Roadmap

### Week 1 (Oct 22-29)
- ✅ Phase 1: Bug fixes & performance
- ✅ Phase 2: Responsiveness fixes

### Week 2 (Oct 29 - Nov 5)
- ✅ Phase 3: Content expansion (sections 1-2)
- ⏱️ Phase 4: Begin profile system design

### Week 3 (Nov 5-12)
- ✅ Phase 3: Complete all sections
- ✅ Phase 4: Dual profile implementation
- ✅ Phase 5: Full testing & audit

### Week 4+ (Nov 12+)
- ✅ Deployment to production
- ✅ Monitoring & optimization
- ✅ Community feedback integration

---

## Success Criteria

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| React Errors | 0 | 1 (#418) | ❌ |
| Mobile Score (Lighthouse) | >85 | TBD | ⏳ |
| Load Time | <2s | TBD | ⏳ |
| Dual Profiles | Yes | No | ❌ |
| Tech Projects Shown | 4+ | 0 | ❌ |
| GitHub Integration | Yes | No | ❌ |

---

## Technical Debt to Address
1. React version outdated (19.3.0) - stay current
2. TypeScript strict mode enforcement
3. ESLint configuration modernization
4. Add Jest for unit testing
5. Add Playwright for E2E testing

---

**Last Updated:** October 22, 2026  
**Status:** Ready for Implementation  
**Owner:** Kristoffer Kelly (imKrisK)
