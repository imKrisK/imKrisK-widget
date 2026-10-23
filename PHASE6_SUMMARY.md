# Phase 6: Business Operations Repositioning & Career Narrative

## Overview
Transformed the Business Operations tab from generic metrics display into a strategic career progression narrative that positions your 10+ year operations background as a **5-10 year commitment** to scale, not an exit strategy.

## Key Changes

### 1. **Business Operations Tab - Complete Reposition**
**Old Approach:** Velocity metrics cards (generic performance indicators)
**New Approach:** Integrated career narrative with 4-part structure

#### Structure:
1. **Career Headline & Cover Letter**
   - Headline: "Building Systems. Leading Teams. Staying to Scale Them."
   - Cover letter framing that directly addresses recruiter fears about job-hopping
   - Positions CSEP as a "permanent performance upgrade" not a bridge to leave operations

2. **Core Competencies Grid**
   - Workflow & Process Design (93% cycle-time reduction example)
   - Compliance & Permitting (CERS, Accela, LAFD expertise)
   - Team Leadership & Scaling (15+ staff management)
   - Data & Systems Integration (invoice processing, portfolio management)

3. **Career Progression Path Visualization**
   - Current Level: Data Moderator & Operations Foundation
   - Progression Ladder (3 steps):
     1. Chat Customer Service (client interaction)
     2. Chat Moderator (quality control & governance)
     3. Chat Developer (technical implementation)
   - Each step includes business rationale

4. **CSEP Value Proposition**
   - Frames certification as commitment signal
   - Emphasizes combined expertise (10+ years operations + technical credentials)
   - Positions candidate as "builder" who understands constraints

5. **Professional Background**
   - Existing experience cards (Operations Manager, Permit Specialist)
   - Same detailed bullets, now contextual to career narrative

### 2. **Technical Credentials Tab Updates**
- **Removed:** "Notable Projects" became "Notable Projects & Systems"
- **Added FT0 Widget** as a notable project with link to live implementation
- **Added ABSOLUTE-ZERO: Live Decision Engine** as strategic project
- **Updated Legal Operations:** Marked as "Pipeline Architecture Visualization" (pipeline diagram, not description)
- Link support for projects with external URLs

### 3. **Floating FT0 Widget Implementation**
New prop: `isFloating` enables draggable, minimizable chat widget

**Features:**
- **Floating Position:** Fixed viewport positioning (bottom-right default)
- **Draggable Header:** Grab header to move around page
- **Minimize/Expand:** Toggle button preserves conversation state
- **Persistent State:** localStorage saves position and minimize state across sessions
- **Smart Positioning:** Calculates safe boundaries (420px width @ bottom-right default)

**CSS Updates:**
- `.widget.floating` - position: fixed styling
- `.headerControls` - minimize button area
- `.controlButton` - interactive control styling
- `.dragging` - visual feedback during drag

### 4. **Data Structure Changes**

**Removed:**
- `velocity_metrics` section (no longer frontline for Business Operations tab)

**Added:**
```json
"business_operations": {
  "headline": string,
  "cover_letter": string,
  "core_competencies": [...],
  "career_path": {
    "current": { level, description },
    "progression": [{ level, description }, ...]
  },
  "csep_value": string
}
```

**Updated Portfolio:**
```json
"portfolio": [
  { name, scope, isVisualized?: true, link?: string },
  ...
]
```

### 5. **CSS Styling**
Added comprehensive styles for new components:
- `.narrativeSection` - gradient background, cover letter formatting
- `.competenciesGrid` / `.competencyCard` - 3-4 column grid with hover effects
- `.careerPathSection` - progression visualization
- `.currentRoleCard` - dark background for current foundation
- `.progressionSteps` / `.progressionCard` - numbered steps with arrows
- `.stepNumber` - circular number badges
- `.csepSection` - green accent box for CSEP messaging
- `.experienceHistorySection` - context for past roles

## Strategic Positioning

### Message Shift:
**From:** "I did X things, here are my metrics"
**To:** "I'm building a 5-10 year career roadmap: operations → customer interface → quality control → technical implementation"

### Recruiter Reassurance:
- Explicitly addresses the "5/10-year plan that recruiters fear"
- Frames progression as intentional, not desperate
- Uses "permanent performance upgrade" language to combat imposter syndrome
- Connects technical credential (CSEP) to operations discipline

### CSEP Positioning:
- NOT a bridge to leave operations
- A certification that proves commitment to excellence in business systems
- Combined with 10+ years of hands-on experience = rare skillset
- Signals builder/systems-thinker, not job-hopper

## Deployment
- ✅ Committed to GitHub (commit: 060c3d8)
- ✅ Pushed to origin/main
- ✅ Railway auto-deployment triggered
- ✅ Live at https://imkrisk-widget-production.up.railway.app/

## Technical Notes
- TypeScript updated to handle optional `business_operations` field
- Backward compatible: falls back to basic experience view if data missing
- FT0 widget floating feature gated behind `isFloating` prop
- localStorage handles widget state across page reloads
- Drag-to-move uses mouse event listeners on header

## Next Steps (Optional)
1. Customize Legal Operations section with actual pipeline diagram
2. Populate Absolute-Zero project details with tech stack + impact
3. Enable floating FT0 widget on all tabs (currently embedded)
4. Add animations to career progression timeline
5. Create recruiter-specific view that highlights CSEP + legal operations background
