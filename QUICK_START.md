# 🚀 FT0 Widget - Quick Start Checklist

## ✅ Build Status
- [x] Next.js project initialized
- [x] Portfolio component created (React conversion)
- [x] FT0 Chat Widget implemented
- [x] 6 system prompts configured (tech, legal, startup, finance, founder, default)
- [x] API route `/api/ft0/chat` implemented
- [x] Recruiter auto-detection logic built
- [x] Responsive design (desktop split-view, mobile stacked)
- [x] TypeScript build successful
- [x] Git repository ready

## 🔧 Before Deployment (Choose ONE API)

### Claude API Setup (5 min)
- [ ] Get API key: https://console.anthropic.com/api_keys
- [ ] Create `.env.local` with `CLAUDE_API_KEY=sk-ant-...`
- [ ] Test locally: `npm run dev`
- [ ] Send test message in widget
- [ ] Verify response appears with recruiter profile

### Manifest API Setup (5 min)
- [ ] Get API key: https://manifest.conversationmine.ai/api/keys
- [ ] Create `.env.local` with `MANIFEST_API_KEY=mk-...`
- [ ] Test locally: `npm run dev`
- [ ] Send test message in widget
- [ ] Verify response appears with recruiter profile

## 🌐 Deploy to Cloudflare Pages (10 min)

### Step 1: Push Code
```bash
cd /Users/iamskrisk/Documents/imkrisk/imKrisK-widget
git push origin main
```
- [ ] Code pushed to GitHub

### Step 2: Cloudflare Configuration
1. Go to https://dash.cloudflare.com/
2. Select **Workers & Pages** → **Pages**
3. Click **Connect to Git**
4. Select **imKrisK/imKrisK-widget** repo
5. Build settings:
   - Build command: `npm run build`
   - Output directory: `.next/standalone/public`
6. Environment variables:
   - Add `CLAUDE_API_KEY` or `MANIFEST_API_KEY`
7. Deploy!

- [ ] Cloudflare Pages connected
- [ ] Build command configured
- [ ] Environment variable added
- [ ] Deployment initiated

### Step 3: Verify Deployment
- [ ] Build succeeds in Cloudflare dashboard
- [ ] Visit deployed URL
- [ ] Portfolio loads correctly
- [ ] Chat widget appears on right
- [ ] Test message in chat widget
- [ ] Receive AI response with recruiter profile

## 🎯 Test Recruiter Profiles

In the live widget, send these test messages to verify auto-detection:

### Tech Recruiter Test
- [ ] Send: "Can you code?"
- [ ] Expected profile: `tech`
- [ ] Response mentions: TypeScript, React, Bash

### Legal Recruiter Test
- [ ] Send: "Compliance experience?"
- [ ] Expected profile: `legal`
- [ ] Response mentions: 99%+ accuracy, CERS, Accela

### Startup Recruiter Test
- [ ] Send: "Would you consider equity?"
- [ ] Expected profile: `startup`
- [ ] Response mentions: Built team, scaled from 0→15

### Finance Recruiter Test
- [ ] Send: "Cost reduction?"
- [ ] Expected profile: `finance`
- [ ] Response mentions: 72→5 hours, ROI, audit-ready

### Founder Recruiter Test
- [ ] Send: "What's your CTO role?"
- [ ] Expected profile: `founder`
- [ ] Response mentions: You build product, I build company

### Default Test
- [ ] Send: "Tell me about yourself"
- [ ] Expected profile: `default`
- [ ] Response: General operations positioning

## 📋 Final Checks

- [ ] Portfolio section displays all content correctly
- [ ] Chat widget responsive on mobile
- [ ] API errors handled gracefully
- [ ] All 6 recruiter profiles auto-detect correctly
- [ ] System prompts are natural and honest
- [ ] Footer message visible: "This is my resume. I am a human who is open to work."
- [ ] Site loads fast (<2s)
- [ ] No console errors in DevTools

## 🔗 Share & Market

Once live, update these:

### LinkedIn
- [ ] Add link to portfolio widget in headline
- [ ] Update About section with widget URL
- [ ] Mention: "AI-powered portfolio that adapts to your questions"

### Resume & Cover Letters
- [ ] Include widget URL in cover letters
- [ ] Add to LinkedIn headline
- [ ] Mention in job application notes

### Job Applications
- [ ] Include widget link instead of just resume PDF
- [ ] Use subject line like: "Interactive portfolio + AI Q&A"

### Personal Network
- [ ] Share with recruiting contacts
- [ ] Mention: "Try asking FT0 about my background"
- [ ] Quick blurb: "I built an AI assistant trained on my experience—it adapts to what you ask about (ops, tech, legal, startup mindset, etc.)"

## 📊 Monitoring

After deployment, track:
- [ ] Cloudflare analytics dashboard
- [ ] Number of widget conversations
- [ ] Which recruiter profiles are most common
- [ ] Average response time
- [ ] Error rate (target: <1%)

## 🐛 Troubleshooting

If widget doesn't work:

1. **Check Cloudflare build logs**
   - Go to Pages → imkrisk-widget → Deployments
   - Click latest deployment → View build logs
   - Look for errors

2. **Check browser console**
   - F12 → Console tab
   - Look for red errors
   - Check Network tab for `/api/ft0/chat` requests

3. **Verify environment variable**
   - Cloudflare Pages → Settings → Environment variables
   - Confirm `CLAUDE_API_KEY` or `MANIFEST_API_KEY` is set
   - Redeploy if recently changed

4. **Test API directly**
   - Open browser DevTools console
   - Run: 
   ```javascript
   fetch('/api/ft0/chat', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({
       messages: [{ role: 'user', content: 'Hello' }],
       conversationId: 'test'
     })
   }).then(r => r.json()).then(console.log)
   ```
   - Should see response with AI answer

## 📚 Documentation

For more details, see:
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Full deployment walkthrough
- [FT0_RECRUITER_PROMPTS.md](../files/FT0_RECRUITER_PROMPTS.md) - All 6 system prompts + Q&A
- [FT0_DEPLOYMENT_CODE.md](../files/FT0_DEPLOYMENT_CODE.md) - Implementation details
- [FT0_WIDGET_ANALYSIS.md](../files/FT0_WIDGET_ANALYSIS.md) - Architecture overview

---

**Estimated Time to Live:** 20-30 minutes  
**Current Status:** ✅ Ready for deployment  
**Next Action:** Add API key & deploy to Cloudflare Pages
