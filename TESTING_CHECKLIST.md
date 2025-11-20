# Testing Checklist: Hyper-Targeted Tasks & Calendar Bug

## What Was Fixed

### 1. Target Audience Not Being Used ✅
**Problem**: The `targetAudience` data wasn't being passed to the task generation API, so tasks were falling back to generic templates.

**Fixed**:
- Added `targetAudience: user.targetAudience` to both API calls in `dashboard-view.tsx` (lines 288 and 511)
- Added `targetAudience` to API route destructured parameters (line 347)
- Updated prompt logic to use `targetAudience` parameter (line 525)

### 2. Calendar Navigation Bug ✅
**Problem**: After leaving the tab and returning, day navigation would show the wrong day's tasks.

**Fixed**:
- Added `latestDayRef.current = currentDay` in the `useEffect` (line 59) to ensure the ref is always in sync
- Existing `latestDayRef` checks in `loadTasksForDay` now work correctly

## Testing Steps

### Test 1: Verify Target Audience is Saved
```sql
-- Run in Supabase SQL Editor
SELECT 
  user_id,
  product_name,
  target_audience,
  website_analysis
FROM onboarding 
WHERE user_id = '<your-user-id>';
```

**Expected**: 
- `target_audience` should be a JSON object with demographics, painPoints, goals, psychographics, etc.
- If NULL, you need to run the migration and complete onboarding again

### Test 2: Verify API is Receiving Target Audience
1. Open browser DevTools (F12)
2. Go to Network tab
3. Navigate to dashboard
4. Click next/previous day to trigger task generation
5. Find the `generate-enhanced-daily-tasks` request
6. Check the Request Payload

**Expected Payload**:
```json
{
  "user": { ... },
  "day": 1,
  "websiteAnalysis": { ... },
  "targetAudience": {
    "demographics": {
      "professions": ["SaaS founders", "indie hackers"],
      "ageRange": "25-45",
      "locations": ["US", "Europe"]
    },
    "painPoints": ["..."],
    "goals": ["..."],
    "psychographics": { ... }
  },
  ...
}
```

### Test 3: Check Generated Tasks Quality
1. Go to dashboard
2. Look at Day 1-7 tasks
3. Check if tasks mention:
   - ✅ Specific professions (e.g., "SaaS founders", "indie hackers")
   - ✅ Actual pain points (e.g., "struggling with consistent content")
   - ✅ Real interests/hangouts (e.g., "in r/SaaS", "on Indie Hackers")
   - ✅ Natural, conversational tone
   - ✅ Short titles without numbers

**Bad Example (Generic Fallback)**:
```
Title: Twitter/X thread #3 on Real-time MRR leaderboard
Description: Draft a 4-tweet thread breaking down Real-time, self-reported MRR leaderboard...
```

**Good Example (Hyper-Targeted)**:
```
Title: Share a quick story about how SaaS founders track MRR
Description: Write a 5-line LinkedIn post about how BuildtoSk helps indie hackers and SaaS founders who are tired of spreadsheet hell track their MRR in real-time. Mention one founder who went from "guessing revenue" to "seeing it live" and ask "How are you tracking yours right now?"
```

### Test 4: Calendar Navigation Bug
1. Open dashboard
2. Navigate to Day 2 or Day 3
3. **Leave the browser tab** (switch to another tab or app)
4. Wait 10-30 seconds
5. **Return to the dashboard tab**
6. Click the "Previous Day" button
7. Click the "Next Day" button multiple times

**Expected**: 
- ✅ Tasks should update correctly for each day
- ✅ Day number should match the tasks shown
- ❌ Should NOT show the same tasks repeatedly

### Test 5: Console Logging (Debug)
Add this temporarily to `app/api/generate-enhanced-daily-tasks/route.ts` after line 525:

```typescript
console.log('🎯 TARGET AUDIENCE DATA:', {
  hasTargetAudience: !!targetAudienceData,
  professions: targetAudienceData?.demographics?.professions,
  painPoints: targetAudienceData?.painPoints?.slice(0, 2),
  audienceDeepDive: audienceDeepDive.substring(0, 200)
})
```

Then check your terminal/server logs when generating tasks.

**Expected**:
```
🎯 TARGET AUDIENCE DATA: {
  hasTargetAudience: true,
  professions: ['SaaS founders', 'indie hackers', 'bootstrapped entrepreneurs'],
  painPoints: ['Inconsistent marketing', 'No time for content'],
  audienceDeepDive: '\n\nTARGET AUDIENCE DEEP DIVE (Use these specifics in every task):\n- Professions: SaaS founders, indie hackers, bootstrapped entrepreneurs\n- Pain Points: Inconsistent marketing; No time for content...'
}
```

## Troubleshooting

### Tasks Still Generic?

**Check 1**: Is `target_audience` column added?
```sql
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'onboarding' 
AND column_name = 'target_audience';
```

**Check 2**: Is data actually saved?
```sql
SELECT target_audience 
FROM onboarding 
WHERE user_id = '<your-user-id>';
```

**Check 3**: Is it being passed to API?
- Check Network tab → Request Payload → `targetAudience` field

**Check 4**: Is the prompt using it?
- Add console.log in API route (see Test 5 above)

### Calendar Bug Still Happening?

**Check 1**: Is `latestDayRef` being updated?
Add this to `dashboard-view.tsx` line 60:
```typescript
console.log('🔄 useEffect triggered:', { currentDay, latestDayRef: latestDayRef.current })
```

**Check 2**: Are tasks being set correctly?
Add this to `loadTasksForDay` after line 371:
```typescript
console.log('✅ Setting tasks for day:', day, 'latestDayRef:', latestDayRef.current, 'match:', latestDayRef.current === day)
```

### Migration Not Applied?

If you get a database error about `target_audience` column not existing:

1. Open Supabase SQL Editor
2. Run the migration:
```sql
ALTER TABLE public.onboarding 
ADD COLUMN IF NOT EXISTS target_audience jsonb NULL;

CREATE INDEX IF NOT EXISTS idx_onboarding_target_audience 
ON public.onboarding USING gin (target_audience jsonb_path_ops);
```

3. Verify:
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'onboarding' 
AND column_name = 'target_audience';
```

## Success Criteria

✅ **Target Audience Working**:
- Tasks mention specific professions from your ICP
- Tasks reference actual pain points
- Tasks feel personalized to your business
- No more "[Target Audience]" placeholders

✅ **Calendar Working**:
- Can navigate days smoothly
- Leaving tab and returning doesn't break navigation
- Each day shows correct tasks

✅ **Overall Quality**:
- Tasks are conversational and friendly
- Titles are short and natural (no "#1", "#2", etc.)
- Tasks feel doable in 15 minutes
- Mix of proven channels and experiments

## Next Steps

If everything works:
1. Remove debug console.logs
2. Test with a fresh onboarding flow
3. Monitor task quality over Week 1-4
4. Adjust prompt rules if needed

If issues persist:
1. Share the console logs from Test 5
2. Share a screenshot of the Network request payload
3. Share an example of a "bad" task that was generated
