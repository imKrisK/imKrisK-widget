# FT0 Recruiter Widget - Cloudflare Pages Deployment Guide

## Overview

Your portfolio is now a **complete Next.js application** ready for deployment to Cloudflare Pages. The app includes:

- ✅ Portfolio showcase (HTML/CSS converted to React components)
- ✅ FT0 Chat Widget (React + TypeScript)
- ✅ 6 recruiter-specific system prompts with auto-detection
- ✅ API route for chat (`/api/ft0/chat`)
- ✅ Responsive design (split-view desktop, stacked mobile)
- ✅ Tailwind-style styling (no framework dependencies)

## Architecture

### File Structure
```
imKrisK-widget/
├── app/
│   ├── api/ft0/chat/
│   │   └── route.ts              # Chat API endpoint
│   ├── components/
│   │   ├── Portfolio.tsx         # Portfolio showcase
│   │   ├── Portfolio.module.css  # Portfolio styles
│   │   ├── FT0ChatWidget.tsx     # Chat widget
│   │   └── FT0ChatWidget.module.css # Chat styles
│   ├── layout.tsx                # Root layout
│   ├── globals.css               # Global styles
│   ├── page.tsx                  # Main page
│   └── page.module.css           # Main page layout
├── lib/
│   └── recruiter-prompts.ts      # System prompts + detection logic
├── public/
│   └── data/
│       └── telemetry-safe.json   # Profile data (fetched at runtime)
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
├── wrangler.toml                 # Cloudflare Pages config
└── .env.example                  # Environment template
```

### Key Components

**Portfolio Component** (`Portfolio.tsx`)
- Fetches `telemetry-safe.json` at runtime
- Displays business ops + technical credentials
- Responsive tabs for switching views
- Footer message: "This is my resume. I am a human who is open to work."

**FT0 Chat Widget** (`FT0ChatWidget.tsx`)
- Real-time chat interface
- Auto-scrolling message list
- Typing indicator
- Error handling
- Mobile-responsive design

**System Prompts** (`recruiter-prompts.ts`)
- 6 tailored prompts: tech, legal, startup, finance, founder, default
- Keyword-based recruiter auto-detection
- Each prompt positioned for specific audience
- Pre-answered Q&A library

**API Route** (`/api/ft0/chat`)
- Accepts POST requests with conversation history
- Detects recruiter type from user message
- Routes to Claude API or Manifest API
- Returns response + detected recruiter profile

## Setup & Deployment

### Phase 1: Add API Key (5 minutes)

You'll use either **Claude API** or **Manifest API**. Choose one:

#### Option A: Claude API (Recommended for control)
1. Get API key: https://console.anthropic.com/api_keys
2. Create `.env.local`:
   ```bash
   CLAUDE_API_KEY=sk-ant-your-key-here
   ```

#### Option B: Manifest API (Simpler)
1. Get API key: https://manifest.conversationmine.ai/api/keys
2. Create `.env.local`:
   ```bash
   MANIFEST_API_KEY=mk-your-key-here
   ```

### Phase 2: Deploy to Cloudflare Pages (10 minutes)

#### Step 1: Push to GitHub
```bash
cd /Users/iamkrisk/Documents/imkrisk/imKrisK-widget
git push origin main
```

#### Step 2: Connect to Cloudflare Pages
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select **Workers & Pages** → **Pages** → **Connect to Git**
3. Select **imKrisK/imKrisK-widget** repository
4. Configure build settings:
   - **Build command:** `npm run build`
   - **Build output directory:** `.next/standalone/public`
   - **Environment variables:** Add `CLAUDE_API_KEY` or `MANIFEST_API_KEY`

#### Step 3: Deploy
- Click **Save and Deploy**
- Cloudflare will automatically:
  1. Clone your repo
  2. Run `npm install`
  3. Run `npm run build`
  4. Deploy to Cloudflare Pages

#### Step 4: Verify
- Check deployment status in Cloudflare dashboard
- Visit: `https://imkrisk-widget.pages.dev` (or your custom domain)

## How It Works

### User Journey
1. **Visit portfolio** → Sees professional background + metrics
2. **Click "Ask FT0"** → Opens chat widget
3. **First message** → Widget analyzes keywords
4. **Recruiter profile detected** → System prompt switches
5. **Response generated** → AI responds with tailored positioning
6. **Conversation continues** → Widget maintains context

### Example Interactions

**Tech Recruiter:**
- Input: "Can you code?"
- System Prompt Detected: `tech`
- Response: "Yes, but contextually. I'm strong in TypeScript, React, Next.js, and Bash..."

**Legal Recruiter:**
- Input: "Compliance experience?"
- System Prompt Detected: `legal`
- Response: "Yes. Worked with municipal permitting systems (CERS, Accela), LAFD requirements..."

**Startup Founder:**
- Input: "Would you take equity?"
- System Prompt Detected: `startup`
- Response: "Absolutely. At this point in my career, I'm looking for ownership and building something..."

## System Prompts

All 6 prompts are in [FT0_RECRUITER_PROMPTS.md](../files/FT0_RECRUITER_PROMPTS.md) in your session files:

1. **tech** - Bridge between ops & engineering
2. **legal** - Compliance & litigation expertise
3. **startup** - Team building from scratch
4. **finance** - Audit-ready & cost optimization
5. **founder** - Non-technical cofounder positioning
6. **default** - General operations leader

Each includes:
- Professional identity statement
- 3-4 key talking points
- 5-6 common recruiter questions + optimal answers
- Honest positioning (what you're NOT)

## Environment Variables

### CLAUDE_API_KEY
- **Required if using Claude API**
- Get from: https://console.anthropic.com/api_keys
- Format: `sk-ant-...`
- Costs: ~$0.003 per response (Haiku model)

### MANIFEST_API_KEY
- **Required if using Manifest API**
- Get from: https://manifest.conversationmine.ai/api/keys
- Format: `mk-...`
- Costs: Depends on your Manifest plan

## Testing Locally

### Start dev server:
```bash
cd /Users/iamkrisk/Documents/imkrisk/imKrisK-widget
npm run dev
```

Visit: http://localhost:3000

### Test recruiter detection:
1. **Tech recruiter:**
   - Message: "Can you code?"
   - Should detect: `tech` profile

2. **Legal recruiter:**
   - Message: "Compliance background?"
   - Should detect: `legal` profile

3. **Startup recruiter:**
   - Message: "Would you consider equity?"
   - Should detect: `startup` profile

## API Route Reference

### POST /api/ft0/chat

**Request:**
```json
{
  "messages": [
    {
      "role": "user",
      "content": "Can you code?"
    }
  ],
  "conversationId": "abc123"
}
```

**Response:**
```json
{
  "response": "Yes, but contextually. I'm strong in TypeScript...",
  "recruiterType": "tech",
  "conversationId": "abc123"
}
```

**Error Handling:**
- Missing `messages` → 400 Bad Request
- API key not configured → 500 with message
- AI model error → 500 with message

## Customization

### Change System Prompts

Edit [`lib/recruiter-prompts.ts`](app/../lib/recruiter-prompts.ts):

```typescript
export const recruiterPrompts: RecruiterPrompt[] = [
  {
    type: 'tech',
    keywords: ['code', 'typescript', 'react', 'github'],
    systemPrompt: 'Your custom prompt here...',
  },
  // ...
];
```

### Add New Recruiter Profile

```typescript
{
  type: 'data-science',
  keywords: ['data', 'machine learning', 'python', 'ml'],
  systemPrompt: 'Your custom prompt...',
}
```

### Modify Portfolio Content

Edit [`public/data/telemetry-safe.json`](public/data/telemetry-safe.json) to update:
- Profile name/title/location
- Velocity metrics
- Professional experience
- Technical skills
- Portfolio projects

## Monitoring & Analytics

### View Cloudflare Analytics:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Select your Pages project
3. View: requests, errors, latency, bandwidth

### Monitor API Errors:
- Check browser DevTools → Network tab
- Errors returned as JSON: `{ "error": "message" }`
- Common issues:
  - API key not set → "Internal server error"
  - Message format wrong → "No messages provided"
  - API limit hit → Check rate limits in your API dashboard

## Cost Estimates

**Claude API:**
- ~$0.003-0.01 per response (depends on length)
- For 100 recruiter conversations/month: ~$0.30-1.00

**Cloudflare Pages:**
- Free tier: 500 builds/month, unlimited traffic
- Your contract: Already paid for 2 years

**Total Monthly Cost:**
- ~$0.30-1.00 (if using Claude API)
- $0 (if already paying Manifest subscription)

## Troubleshooting

### Widget not loading
- Check browser console for errors
- Verify API key is set in Cloudflare environment
- Check `/api/ft0/chat` returns 200 status

### API returns 500 error
- Ensure `CLAUDE_API_KEY` or `MANIFEST_API_KEY` is set
- Check Cloudflare dashboard for environment variables
- Try test API call from browser DevTools console

### Recruiter profile not detecting correctly
- Check `lib/recruiter-prompts.ts` keywords
- Add more keywords if needed
- Keyword matching is case-insensitive

### Portfolio data not loading
- Ensure `public/data/telemetry-safe.json` exists
- Check JSON is valid (use JSONLint)
- Verify fetch URL is correct: `/data/telemetry-safe.json`

## Next Steps

1. **Deploy** → Follow Phase 1 & 2 above
2. **Test locally** → `npm run dev`
3. **Add API key** → `.env.local` + Cloudflare env vars
4. **Verify live** → Visit deployed URL
5. **Test recruiter profiles** → Try different keywords
6. **Share with recruiters** → Include in job applications
7. **Monitor** → Check Cloudflare analytics

## Support

For issues:
1. Check browser DevTools console
2. Review `/api/ft0/chat` response
3. Verify environment variables are set
4. Check Cloudflare build logs
5. Review `recruiter-prompts.ts` for keyword detection

---

**Status:** ✅ Build complete, ready for deployment
**Next:** Push to GitHub → Connect Cloudflare Pages → Deploy
