# Deploy imKrisK-widget to Cloudflare Pages

## Overview
Your portfolio widget is ready to deploy to Cloudflare Pages using your existing 2-year paid plan. This guide takes you from your GitHub repo to a live, globally distributed site.

**Timeline:** 5-10 minutes  
**Cost:** $0 (already included in your plan)  
**Result:** Live URL like `imkrisk.pages.dev`

---

## Step 1: ✅ Log into Cloudflare Dashboard

Already done. You're logged in as `imkrisk@icloud.com`.

---

## Step 2: Go to Pages

1. Go directly to: **https://dash.cloudflare.com/[your-account-id]/workers-and-pages**
   - Or from sidebar: Click **"Workers & Pages"**
2. Click the blue **"Create application"** button (top-right)

---

## Step 3: Connect Your GitHub Repository

1. **Select Git provider:**
   - Click **Connect to Git**
   - Choose **GitHub**
   - You may be asked to authorize Cloudflare to access your GitHub repos

2. **Select the repository:**
   - Search for or select: **imKrisK/imKrisK-widget**
   - Click **Connect**

3. **Choose branch:**
   - Select **main** as the production branch
   - Click **Begin setup**

---

## Step 4: Configure Build Settings

You should now see the build configuration screen. Fill it in as follows:

| Field | Value | Notes |
|-------|-------|-------|
| **Project name** | `imKrisK-widget` | (auto-filled) |
| **Production branch** | `main` | (auto-filled) |
| **Build command** | *(leave blank)* | It's static HTML—no build needed |
| **Build output directory** | `/` (or leave blank) | Root of repo (where index.html lives) |
| **Environment variables** | *(leave blank)* | Not needed for this project |

---

## Step 5: Deploy

1. Click **Save and Deploy**
2. Cloudflare will:
   - Clone your repo
   - Detect the static HTML
   - Deploy to their global CDN
   - Generate a live URL

3. **Wait for deployment to complete** (~1-2 minutes)
   - You'll see status updates as it builds and deploys
   - When done, you'll see a ✓ (checkmark) next to your project

---

## Step 6: Access Your Live Site

Once deployed, your site will be live at:

**https://imkrisk-widget.pages.dev**

(Or a similar auto-generated subdomain if that name is taken)

You can also:
- Copy the live URL from the Cloudflare dashboard
- Share it immediately with recruiters
- Add a custom domain if you own one (optional)

---

## Step 7 (Optional): Add a Custom Domain

If you have a domain you want to use (e.g., `imkrisk.dev`):

1. In Cloudflare Pages project settings, click **Custom domains**
2. Add your domain
3. Follow the DNS setup instructions
4. Site will be live at your custom URL in ~5 minutes

---

## Automatic Deployments

From now on:
- Every time you push to the `main` branch on GitHub
- Cloudflare automatically rebuilds and redeploys
- Your live site updates instantly
- No manual steps needed

---

## Verify Everything Works

After deployment:

1. Open the live URL in your browser
2. Check:
   - ✓ Page loads cleanly
   - ✓ Your name and title appear
   - ✓ Profile summary displays
   - ✓ Metrics cards show 72→5 hours and 15+ team
   - ✓ Mobile view looks good (resize browser)

3. Open browser DevTools (F12) → Console
   - Should show no errors
   - May see a message about telemetry-safe.json loading (normal)

---

## If Something Goes Wrong

**Page shows 404 or blank:**
- Check that `index.html` is in the root of your repo ✓
- Verify build command is blank or `/` ✓
- Rebuild: Go to Deployments → click the latest → click "Retry build"

**Data doesn't load:**
- Ensure `telemetry-safe.json` is in the root ✓
- Check browser console for fetch errors
- Files are case-sensitive: `index.html`, `telemetry-safe.json` (lowercase)

**Custom domain not working:**
- Wait 5-10 minutes for DNS to propagate
- Check DNS records in Cloudflare for your domain
- Contact Cloudflare support if still stuck

---

## Your Next Steps

1. **Deploy now** using this guide
2. **Share the live URL** with recruiters, in LinkedIn, on your resume
3. **Update telemetry-safe.json** anytime and push to GitHub—live site updates instantly
4. **Monitor traffic** (optional): Cloudflare dashboard shows analytics

---

## Quick Reference: URLs After Deployment

- **Live portfolio:** https://imkrisk-widget.pages.dev (or custom domain)
- **GitHub repo:** https://github.com/imKrisK/imKrisK-widget
- **Cloudflare project:** https://dash.cloudflare.com/[account-id]/pages/view/imkrisk-widget

---

**You're ready. Go live.** 🚀
