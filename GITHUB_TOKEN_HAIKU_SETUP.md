# FT0 Widget - GitHub Token + Haiku 4.5 Setup Guide

## Overview

Your FT0 chat widget is configured to use:
- **Primary AI:** Haiku 4.5 (Claude 3.5 Haiku) - Cost optimized at **0.33x** vs Sonnet
- **API Integration:** Manifest API with Haiku 4.5
- **Authentication:** GitHub Personal Access Token (optional but recommended)
- **Fallback:** Claude API direct (if Manifest API fails)

---

## 💰 Cost Analysis: Why Haiku 4.5?

| Model | Input Cost | Output Cost | Speed | Use Case |
|-------|-----------|-----------|-------|----------|
| **Claude Sonnet** | $3/$15 per 1M | Standard | Fast | General purpose |
| **Claude Haiku 4.5** | $0.80/$2.40 per 1M | **0.33x cost** | Sub-second | ✅ Recruiter Q&A |
| **Difference** | **73% cheaper** | **84% cheaper** | **Faster** | Perfect fit |

**For 100 recruiter conversations/month:**
- Sonnet: ~$0.50-2.00
- Haiku: ~$0.15-0.50
- **Savings: 70%+ per month**

---

## 🔧 Setup Steps

### Step 1: Create GitHub Personal Access Token

GitHub tokens are optional but recommended for:
- Rate limiting protection
- Production deployments
- Future GitHub-specific features

**Create Token:**

1. Go to: https://github.com/settings/personal-access-tokens/new
2. Fill in:
   - **Token name:** `FT0-Widget-Production`
   - **Expiration:** 90 days
   - **Repository access:** "Only select repositories"
   - **Select:** `imKrisK-widget` repository
3. **Permissions** (set to minimal):
   - Repository permissions:
     - ✅ Contents: Read-only
     - ✅ Metadata: Read-only
   - (No account permissions needed)
4. Click **"Generate token"**
5. **COPY** the token (starts with `ghp_`)
6. ⚠️ **SAVE IT** - You won't see it again!

**Keep safe:** This is sensitive - treat like a password!

### Step 2: Set Up Local Environment

```bash
cd /Users/iamkrisk/Documents/imkrisk/imKrisK-widget

# Create .env.local with your tokens:
cat > .env.local << EOF
MANIFEST_API_KEY=mk-your-manifest-key
GITHUB_TOKEN=ghp_your-github-token
NODE_ENV=production
EOF

# Verify it exists (don't cat - it has secrets!)
ls -la .env.local
```

### Step 3: Verify .gitignore Protects Your Secrets

```bash
# Check that .env.local is ignored
git check-ignore .env.local
# Should output: .env.local

# Double-check it's not tracked
git status
# Should NOT show .env.local
```

### Step 4: Restart Dev Server

```bash
# Press Ctrl+C to stop the old server
# Then restart:
npm run dev
```

### Step 5: Test the Chat Widget

```bash
# Send a test message to the API
curl -X POST http://localhost:3000/api/ft0/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Can you code?"}],
    "conversationId": "test-123"
  }'
```

**Expected response:**
```json
{
  "response": "Yes, but contextually. I'm strong in TypeScript...",
  "recruiterType": "tech",
  "model": "haiku-4.5",
  "conversationId": "test-123"
}
```

---

## 📋 Configuration Files

### `.env.example` (✅ SAFE - Commit to Git)
Public template showing all available options

### `.env.local` (🔐 SECRET - Never commit)
Your actual API keys and tokens
```
MANIFEST_API_KEY=mk-...
GITHUB_TOKEN=ghp_...
NODE_ENV=production
```

### `.env.local.template` (📖 REFERENCE)
Detailed setup instructions with step-by-step token creation

### `.gitignore` (🛡️ PROTECTION)
Already includes `.env.local` - your secrets won't leak

---

## 🚀 API Route: How It Works

**File:** `app/api/ft0/chat/route.ts`

**Call Chain:**
```
User sends message in chat widget
           ↓
API detects recruiter type (keywords)
           ↓
PRIMARY: Try Manifest API with Haiku 4.5
    ├─ Uses MANIFEST_API_KEY
    ├─ Optional: Uses GITHUB_TOKEN for auth headers
    ├─ Model: claude-3-5-haiku-20241022
    └─ If success → return response
           ↓ (if fails)
FALLBACK: Try Claude API directly with Haiku 4.5
    ├─ Uses CLAUDE_API_KEY
    ├─ Model: claude-3-5-haiku-20241022
    └─ If success → return response
           ↓ (if both fail)
ERROR: Return error message with setup instructions
```

---

## 📊 Monitoring & Debugging

### Check API Response Includes Model Info

When you call the widget, response will include:
```json
{
  "response": "...",
  "recruiterType": "tech",
  "model": "haiku-4.5",  // ← Confirms Haiku is being used
  "conversationId": "..."
}
```

### Monitor Costs

Haiku 4.5 token usage:
- Input tokens: ~150-300 per message (system prompt + conversation)
- Output tokens: ~200-400 per response
- Cost per conversation: ~$0.001-0.005

**100 conversations/month = ~$0.15-0.50**

### Check Environment Variables

```bash
# Verify variables are loaded (DO NOT OUTPUT VALUES!)
node -e "console.log('MANIFEST_API_KEY set:', !!process.env.MANIFEST_API_KEY); console.log('GITHUB_TOKEN set:', !!process.env.GITHUB_TOKEN);"
```

---

## 🚢 Deployment to Cloudflare Pages

### Add Environment Variables

1. Go to: https://dash.cloudflare.com/
2. Navigate to: **Workers & Pages** → **imkrisk-widget** → **Settings** → **Environment variables**
3. Add **Production variables:**
   - Key: `MANIFEST_API_KEY`
   - Value: `mk-...` (your key)
   
   - Key: `GITHUB_TOKEN`
   - Value: `ghp_...` (your token)

4. Click **Save**
5. **Redeploy** (trigger new build)

### Verify Deployment

After deployment, test live:
```bash
curl -X POST https://imkrisk-widget.pages.dev/api/ft0/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Can you code?"}],
    "conversationId": "test"
  }'
```

---

## ⚠️ Security Best Practices

### DO ✅
- ✅ Keep tokens in `.env.local` (not committed)
- ✅ Use separate tokens for dev/prod
- ✅ Rotate tokens regularly (90-day expiration)
- ✅ Use minimal permissions (read-only)
- ✅ Store safely in Cloudflare environment
- ✅ Monitor token usage in logs

### DON'T ❌
- ❌ Commit `.env.local` to Git
- ❌ Share tokens in chat/email/code
- ❌ Use personal GitHub account token in production
- ❌ Store secrets in code comments
- ❌ Log token values
- ❌ Reuse tokens across projects

---

## 🐛 Troubleshooting

### "I need to be configured to respond" Error

**Cause:** MANIFEST_API_KEY or CLAUDE_API_KEY not set

**Fix:**
```bash
# Check .env.local exists
ls -la .env.local

# Verify variables are readable
cat .env.local  # (ONLY if testing locally!)

# Restart dev server
npm run dev
```

### Chat Widget Shows No Response

**Possible causes:**
1. API keys not loaded in environment
2. Manifest API endpoint unreachable
3. Token expired or invalid

**Debug:**
```bash
# Check Manifest API is accessible
curl -H "Authorization: Bearer mk-..." \
  https://manifest.conversationmine.ai/api/ft0/chat \
  -X POST

# Check Claude API is accessible (if using fallback)
curl -H "x-api-key: sk-ant-..." \
  https://api.anthropic.com/v1/messages \
  -X POST
```

### High Costs?

**Verify Haiku 4.5 is being used:**
```bash
# Check response includes model info
curl http://localhost:3000/api/ft0/chat ... | grep model

# Should show: "model": "haiku-4.5"
```

### Token Expiration?

GitHub tokens default to 90-day expiration.
- Set reminder to rotate 7 days before expiry
- Create new token, update in Cloudflare
- Delete old token

---

## 📚 Related Files

- `app/api/ft0/chat/route.ts` - Chat API (uses Haiku 4.5)
- `lib/recruiter-prompts.ts` - 6 system prompts
- `.env.example` - Public configuration template
- `.env.local` - Your local secrets (not committed)
- `.env.local.template` - Setup instructions
- `DEPLOYMENT_GUIDE.md` - Full deployment guide

---

## 🎯 Summary

| Item | Value |
|------|-------|
| **AI Model** | Claude 3.5 Haiku (Haiku 4.5) |
| **Cost Efficiency** | 0.33x vs Sonnet |
| **API** | Manifest + Claude fallback |
| **Auth** | GitHub Personal Access Token (optional) |
| **Local Setup** | `.env.local` with 2-3 environment variables |
| **Deployment** | Cloudflare environment variables |
| **Monitoring** | Response includes `"model": "haiku-4.5"` |

---

## ✅ Checklist

- [ ] Created GitHub Personal Access Token
- [ ] Created `.env.local` with MANIFEST_API_KEY and GITHUB_TOKEN
- [ ] Restarted dev server
- [ ] Tested chat widget locally (curl or browser)
- [ ] Verified response includes model info
- [ ] Added environment variables to Cloudflare
- [ ] Tested live deployment
- [ ] Verified costs are 0.33x vs Sonnet

---

**Status:** Ready to test with Haiku 4.5 at cost-optimized pricing!
**Next:** Provide your tokens and test the chat widget.
