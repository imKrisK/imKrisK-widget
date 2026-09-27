# Abuse Prevention & Cost Protection Strategy

**Status:** ✅ LIVE  
**Date:** 2026-09-27  
**Cost Cap:** $0.18-1.80/month (with 5-10 question limits)

---

## 🎯 STRATEGIC OBJECTIVES

### 1. **Protect API Spend**
The Haiku 4.5 pricing model charges per token. Without limits, a single recruiter could:
- Ask 100+ questions in one conversation
- Use the widget for free consulting
- Consume $5+ in API credits on a single conversation

**Solution:** Cap conversations at 5-10 questions depending on conversation mode.

### 2. **Ensure Fair Access**
Multiple recruiters should be able to use the widget without one person monopolizing it.

**Solution:** Per-conversation limits force recruiters to prioritize their questions, leading to more intentional, valuable conversations.

### 3. **Distinguish Between Interaction Types**
Not all conversations are equal:
- **"Open to Work" Q&A:** Light, quick questions about availability/background → 5 questions max
- **"Hiring Interview":** Deeper technical discussion → 10 questions max

**Solution:** Auto-detect conversation mode and apply appropriate limits.

---

## 📊 ABUSE LIMIT TIERS

### Tier 1: "Open to Work" Mode ✅ 5 Questions Max

**Triggers When Recruiter Asks:**
- "Are you open to work?"
- "What's your availability?"
- "Tell me about yourself"
- "Where are you located?"
- "What salary are you looking for?"

**Estimated Cost:** $0.004-0.012 per conversation (5 Q&A exchanges)

**Use Case:** Screening calls, quick introductions

**Example Conversation:**
```
Q1: Are you open to work? → AI responds
Q2: What's your background? → AI responds
Q3: When can you start? → AI responds
Q4: Are you remote-friendly? → AI responds
Q5: Should I pass your info to hiring? → AI responds

🛑 LIMIT REACHED
Status: "Thanks for the questions! If you'd like to discuss further, 
reach out directly to Kristoffer."
```

---

### Tier 2: "Hiring Interview" Mode ✅ 10 Questions Max

**Triggers When Recruiter Asks:**
- "Walk me through your experience"
- "Tell me about a challenge you solved"
- "How would you approach this project?"
- "What's your technical architecture experience?"
- "Describe your team leadership style"

**Estimated Cost:** $0.012-0.036 per conversation (10 Q&A exchanges)

**Use Case:** Initial technical interviews, deeper assessment

**Example Conversation:**
```
Q1: Tell me about your ops background → AI responds
Q2: How did you cut that workflow time? → AI responds
Q3: What's your compliance experience? → AI responds
Q4: How do you handle team conflicts? → AI responds
Q5: What's your tech stack? → AI responds
Q6: Tell me about your automation work → AI responds
Q7: How do you scale operations? → AI responds
Q8: What's your leadership philosophy? → AI responds
Q9: How do you approach system design? → AI responds
Q10: What's your next career goal? → AI responds

🛑 LIMIT REACHED
Status: "Sounds like a great fit! Here's how to reach Kristoffer directly..."
```

---

## 🔍 HOW ABUSE PREVENTION WORKS

### Step 1: Detect Conversation Mode

When a recruiter sends their first message, the system analyzes keywords:

```typescript
const mode = detectConversationMode(userMessage);
// Returns: "open_to_work" | "hiring"

// Internal scoring:
// Open to work keywords: available, start date, location, remote, salary → +1 each
// Hiring keywords: interview, challenge, project, technical, leadership → +1 each
// Highest score wins
```

### Step 2: Count User Questions

Every time the recruiter sends a message, it's counted:

```typescript
const questionCount = messages.filter(msg => msg.role === 'user').length;

// Message #1 (user) = 1 question
// Message #2 (assistant) = (not counted)
// Message #3 (user) = 2 questions
// Message #4 (assistant) = (not counted)
// etc.
```

### Step 3: Compare Against Limit

```typescript
const limits = {
  open_to_work: 5,    // Max 5 user messages
  hiring: 10          // Max 10 user messages
};

if (questionCount > limits[mode]) {
  // Block conversation and show friendly message
}
```

### Step 4: Block or Proceed

**If within limit:** ✅ Send message to AI and respond normally

**If at limit:** 🛑 Return friendly message:
```
"This is a [interview-style conversation]. 
For fair access to the widget, conversations are limited to 10 questions.

If you'd like a deeper discussion, please reach out to Kristoffer directly:
- LinkedIn: https://linkedin.com/in/imkrisk
- GitHub: https://github.com/imKrisK
- Email: [Available in portfolio]

Thank you for understanding!"
```

---

## 💰 COST TRACKING & MONITORING

### Per-Conversation Cost Estimate

**System estimates tokens before each request:**

```typescript
function estimateTokens(messages: Message[]): number {
  // Rough estimate: ~4 characters = 1 token
  return messages.reduce((total, msg) => {
    return total + Math.ceil(msg.content.length / 4);
  }, 0);
}

// Example:
// User message: "Tell me about your ops background" (34 chars) = 9 tokens
// Assistant response: "I've led operations teams..." (250 chars) = 63 tokens
// Total: ~72 tokens per exchange
```

### Haiku 4.5 Pricing Model

| Scenario | Q&A Count | Est. Tokens | Est. Cost |
|----------|-----------|-------------|-----------|
| Open to work (5 Q) | 5 exchanges | ~5,000 | $0.012 |
| Hiring interview (10 Q) | 10 exchanges | ~12,000 | $0.029 |
| **Monthly (100 convos)** | **~500 Q** | **~500k** | **$1.20** |

---

## 🛡️ ABUSE SCENARIOS & RESPONSES

### Scenario 1: Recruiter Tries 20+ Questions

**What Happens:**
```
Q1-5: Recruiter in "open to work" mode, gets 5 questions
Q6: Tries to ask 6th question
→ System detects limit reached
→ Returns: "Conversation limit reached (5 questions). Direct contact: ..."
Q7-20: All blocked with same message
```

**Cost Impact:** $0.012 (capped at 5 Q, not 20)
**Savings:** Prevented $0.048 in unnecessary API spend

---

### Scenario 2: Recruiter Pivots from "Open to Work" → "Hiring"

**What Happens:**
```
Q1-3: Recruiter asks light questions about availability
Q4: Recruiter shifts tone: "Tell me about your technical architecture"
→ System re-evaluates: STILL "open_to_work" mode (first message determines mode)
→ Q4 is STILL counted toward the 5-question limit
→ Recruiter gets 1 more question before hitting limit
```

**Reason:** Conversation mode is locked on first message for consistency

---

### Scenario 3: Multiple Recruiters from Same Company

**What Happens:**
```
Recruiter A: Questions 1-5 (open to work mode) ✅
Recruiter B: Questions 1-10 (hiring mode) ✅
Recruiter C: Questions 1-5 (open to work mode) ✅
```

**Each recruiter gets their own conversation tracking.** No sharing of limits between users.

---

## 📈 METRICS & MONITORING

### Server-Side Logging

Every request is logged with cost data (visible to you in Railway):

```
[Cost Tracking] ConversationID: a1b2c3d, Mode: open_to_work, Tokens: 5234, Cost: $0.01254
[Cost Tracking] ConversationID: x9y8z7w, Mode: hiring, Tokens: 12891, Cost: $0.03099
[Cost Tracking] ConversationID: q1w2e3r, Mode: open_to_work, Tokens: 4987, Cost: $0.01197
```

### Tracking Questions

Each response includes:
```json
{
  "response": "...",
  "recruiterType": "tech",
  "conversationMode": "hiring",
  "questionCount": 3,
  "remainingQuestions": 7,
  "estimatedCost": "0.007231"
}
```

**Recruiter Sees:**
- Current question count
- Remaining questions allowed
- Conversation mode detected

---

## 🚨 EDGE CASES & HANDLING

### Edge Case 1: What if System Prompt Counts as a "Message"?

**Current Design:**
```typescript
const systemMessage = { role: 'system', content: recruiterProfile.systemPrompt };
const userQuestions = messages.filter(msg => msg.role === 'user').length;
```

System messages are **NEVER** counted toward the limit. Only `role: 'user'` counts.

---

### Edge Case 2: What if Recruiter Sends Very Long Question?

**Current Design:**
```typescript
// One very long message = 1 question
// System counts by message count, not character count
```

A recruiter could send 1,000-word question, but it still counts as 1 question.

**Mitigation:** Future version could add token-based limits instead of message-based.

---

### Edge Case 3: What if Widget Crashes Mid-Conversation?

**Current Design:**
- Conversation ID stored in browser `sessionStorage`
- If browser tab closes, conversation ID is lost
- Recruiter starting new tab = new conversation = new question limit
- **No conversation persistence** (stateless design)

**Benefit:** Widget stays stateless, no database needed
**Tradeoff:** Can't resume mid-conversation

---

## 📋 BEST PRACTICES FOR RECRUITERS

**Tip 1: Ask Your MOST IMPORTANT Questions First**
- Limited to 5-10 questions
- Don't waste them on information easily found on LinkedIn

**Tip 2: Read the Portfolio Tab First**
- Left side has all public info about Kristoffer
- Use chat to ask follow-up questions, not basics

**Tip 3: Know When to Pivot**
- 5 questions is usually enough for initial screening
- If you want to move to next round, ask for direct contact

**Tip 4: Respect the Limits**
- Limits exist to ensure fair access
- Direct outreach to Kristoffer shows genuine interest anyway

---

## 🔄 FUTURE ENHANCEMENTS

### v2: Token-Based Limits (Coming)
Instead of question count, limit by **total tokens**:
```
"open_to_work" mode: Max 5,000 tokens per conversation
"hiring" mode: Max 12,000 tokens per conversation
```

### v3: IP-Based Rate Limiting
Prevent same IP from sending 100+ conversations:
```
Max 10 conversations per IP per day
Max 50 conversations per IP per week
```

### v4: Conversation Analytics
Dashboard showing:
- Total conversations per day/week/month
- Average recruiter engagement duration
- Most common questions asked
- A/B testing system prompt effectiveness

### v5: Custom Limits per Recruiter Type
```
"Tech" recruiters: Longer limits (15 questions)
"Sales" recruiters: Shorter limits (3 questions)
"Internal" recruiters: Unlimited (whitelisted)
```

---

## ✅ VERIFICATION CHECKLIST

- [x] Abuse limits integrated into API route
- [x] Conversation mode detection working
- [x] Cost tracking logging per request
- [x] Friendly limit-reached message implemented
- [x] Remaining questions count returned to client
- [x] No database needed (stateless design)
- [x] Logs go to server only (not exposed to client)
- [x] Security audit confirms unmappability

---

## 📞 SUPPORT & TROUBLESHOOTING

**Q: Why is my conversation blocked after 5 questions?**
A: You're in "open to work" mode. Light Q&A is limited to 5 questions. For deeper discussion, reach out directly.

**Q: How do I get more questions?**
A: Direct outreach to Kristoffer shows genuine interest. Most hiring moves to email/phone after 5-10 questions anyway.

**Q: What if I need to discuss a specific project?**
A: Use the contact info in the portfolio. The widget is for initial screening only.

**Q: Can I close the chat and start fresh?**
A: Yes. New browser tab = new conversation = new 5-10 question limit.

---

**Last Updated:** 2026-09-27  
**Next Review:** 2026-12-27
