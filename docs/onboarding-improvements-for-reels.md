# Onboarding Improvements for Reels/Video Strategy

## New Fields to Add to Onboarding Flow

### **Step: Content Preferences** (New Step after "Preferred Platforms")

#### **1. Content Format Preference**
**Question:** "What type of content are you most comfortable creating?"

**Options:**
- [ ] Short-form video (Reels, TikTok, Shorts)
- [ ] Long-form video (YouTube)
- [ ] Written content (Blog posts, LinkedIn articles)
- [ ] Social media posts (Text + images)
- [ ] Mix of all formats

**Why:** Determines if we should suggest Reels tasks or text-based tasks

---

#### **2. Video Comfort Level**
**Question:** "How comfortable are you with creating video content?"

**Options:**
- Beginner (Never made videos)
- Intermediate (Made a few, need practice)
- Advanced (Comfortable on camera)
- Expert (Video is my strength)

**Why:** Adjusts task complexity (talking head vs screen recording vs B-roll)

---

#### **3. Content Creation Time**
**Question:** "How much time can you dedicate to content creation weekly?"

**Options:**
- 1-2 hours (batch on weekends)
- 3-5 hours (few times per week)
- 6-10 hours (daily creation)
- 10+ hours (content is priority)

**Why:** Determines batch creation suggestions vs daily posting

---

#### **4. Specific Audience Persona**
**Question:** "Who is your ideal customer? Be specific."

**Placeholder:** "e.g., Solopreneurs with 0-10 users who struggle with consistent marketing"

**Why:** Creates hyper-targeted Reels hooks and messaging

---

#### **5. Content Batching Preference**
**Question:** "Do you prefer to batch create content or create daily?"

**Options:**
- Batch (Create all content on one day)
- Daily (Create fresh content each day)
- Hybrid (Batch some, create some daily)

**Why:** Suggests Sunday batch recording vs daily posting tasks

---

## Updated Task Generation Context

### **Add to User Profile Schema:**
```typescript
{
  contentFormatPreference: 'short-form-video' | 'long-form-video' | 'written' | 'social-posts' | 'mix',
  videoComfortLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert',
  weeklyContentTime: '1-2' | '3-5' | '6-10' | '10+',
  specificAudiencePersona: string,
  contentBatchingPreference: 'batch' | 'daily' | 'hybrid'
}
```

### **Add to Task Generation Prompt:**
```
CONTENT CREATION PROFILE:
- Preferred Format: ${user.contentFormatPreference}
- Video Comfort: ${user.videoComfortLevel}
- Weekly Content Time: ${user.weeklyContentTime} hours
- Specific Audience: ${user.specificAudiencePersona}
- Batching Preference: ${user.contentBatchingPreference}

CONTENT TASK RULES:
1. If contentFormatPreference includes 'video', prioritize Reels/TikTok tasks
2. Match video complexity to comfort level:
   - Beginner: Screen recordings, B-roll with voiceover
   - Intermediate: Talking head with script
   - Advanced: Freestyle talking head, trends
   - Expert: Complex editing, storytelling
3. If batching preference is 'batch', suggest Sunday batch recording
4. Use specificAudiencePersona in every Reels hook
```

---

## Reels-Specific Task Templates

### **Beginner Video Tasks:**
```
**Task: Create Your First Reels Using Screen Recording**
Record a 30-second screen recording showing [specific feature] of ${productName} with voiceover explaining how it helps ${specificAudiencePersona}. Use CapCut to add captions.
- Category: content
- Platform: Instagram Reels
- Impact: Builds video creation confidence without being on camera
- Tips: 
  1. Use your phone's screen recorder
  2. Add trending audio in background (low volume)
  3. Post at 9am or 7pm for best reach
```

### **Intermediate Video Tasks:**
```
**Task: Record Talking Head Reel About Pain Point**
Record a 15-second talking head Reel: "POV: You're a ${specificAudiencePersona} trying to [pain point]". Show the struggle, then tease the solution (${productName}).
- Category: content
- Platform: Instagram Reels
- Impact: Builds relatability and positions you as understanding their struggle
- Tips:
  1. Use teleprompter app for script
  2. Natural lighting (face a window)
  3. Hook in first 1 second or viewers scroll
```

### **Batch Creation Tasks:**
```
**Task: Batch Record 7 Reels This Sunday**
Set aside 2 hours to record 7 Reels for the week. Use these hooks:
1. "POV: ${specificAudiencePersona}..."
2. "3 mistakes ${specificAudiencePersona} make..."
3. "How I went from [before] to [after]..."
4. "Stop [bad advice]. Start [good advice]..."
5. "This is why ${productName} exists..."
6. "Day in the life of ${specificAudiencePersona}..."
7. "Behind the scenes: Building ${productName}..."
- Category: content
- Platform: Instagram Reels
- Impact: Week's content done in one session, reduces daily pressure
- Tips:
  1. Wear same outfit for consistency
  2. Use same background/lighting
  3. Schedule all 7 in Meta Business Suite
```

---

## Platform Preference Logic Update

### **Current (Too Strict):**
```typescript
// Hard exclusion - if user picks LinkedIn, Instagram is BLOCKED
const disallowedNote = preferred.length > 0 ? 
  `DISALLOWED_PLATFORMS: ${['instagram','tiktok'...].filter(p => !preferred.includes(p))}`
```

### **Proposed (Weighted Preference):**
```typescript
// Weighted preference - suggest preferred platforms 70% of time, others 30%
const platformWeights = {
  preferred: 0.7,  // 70% of tasks use preferred platforms
  experimental: 0.3 // 30% explore new platforms
}

const platformNote = preferred.length > 0 
  ? `PLATFORM STRATEGY: Prioritize ${preferred.join(', ')} for 70% of tasks. Use remaining 30% to explore high-potential platforms like Instagram Reels, TikTok for ${specificAudiencePersona} reach.`
  : `PLATFORM STRATEGY: Suggest platforms where ${specificAudiencePersona} are most active.`
```

---

## Audience Specificity Improvement

### **Current (Too Generic):**
```
Target Audience: Small business owners, entrepreneurs, marketers
```

### **Improved (Specific Persona):**
```
Target Audience: Solopreneurs with 0-50 users who:
- Struggle with consistent marketing (spend <1hr/week)
- Have no marketing budget (<$100/month)
- Are technical founders (built product, hate marketing)
- Want simple, actionable daily tasks
- Prefer video content over reading
```

**Impact on Tasks:**
- Reels hooks reference specific pain points
- Time estimates match their availability
- Platforms match where they consume content
- Messaging addresses their exact struggle

---

## Example: Before vs After

### **Before (Generic):**
```
**Task: Post on Instagram**
Create an Instagram post about your product and share it with your audience.
```

### **After (Hyper-Specific):**
```
**Task: Record "POV: Solopreneur Marketing Struggle" Reel**
Record a 15-second Reel: "POV: You're a solopreneur with 5 users trying to do marketing". Show yourself overwhelmed at computer, then cut to you smiling using Marketing Buddy. Use trending audio "Calm Down" by Rema. Post at 7pm.
- Category: content
- Platform: Instagram Reels
- Impact: Reaches 500-2,000 solopreneurs who relate to the struggle
- Tips:
  1. Use CapCut template #trending
  2. Hashtags: #solopreneur #marketingtips #buildinpublic
  3. Pin comment: "Link in bio for free marketing plan"
- Type: exploit (proven format)
```

---

## Implementation Priority

### **Phase 1: Quick Wins (This Week)**
1. ✅ Add `specificAudiencePersona` field to onboarding
2. ✅ Update task generation prompt to use specific persona
3. ✅ Change platform logic from exclusion to weighted preference

### **Phase 2: Content Preferences (Next Week)**
1. Add `contentFormatPreference` to onboarding
2. Add `videoComfortLevel` to onboarding
3. Create Reels-specific task templates

### **Phase 3: Batching & Advanced (Week 3)**
1. Add `contentBatchingPreference` to onboarding
2. Add `weeklyContentTime` to onboarding
3. Implement batch creation task suggestions

---

## Success Metrics

**After implementing these changes, measure:**
- Task completion rate (should increase if tasks match user preference)
- Skip rate by platform (should decrease for preferred formats)
- User feedback on task relevance (survey after Week 1)
- Content creation consistency (are users posting more?)

**Target:**
- 80%+ task completion rate
- <10% skip rate for preferred platforms
- 90%+ users say tasks are "very relevant" to their business
