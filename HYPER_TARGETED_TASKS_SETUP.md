# Hyper-Targeted Task Generation Setup

## What Changed

You're absolutely right—**website analysis and target audience are the secret weapon** for hyper-targeted tasks. I've now wired everything up so tasks are generated from the actual ICP and analysis data saved during onboarding.

## Changes Made

### 1. Database Schema
- **Added `target_audience` jsonb column** to `onboarding` table
- **Added index** for efficient querying
- **Migration file created**: `add-target-audience-column.sql`

### 2. Onboarding Flow
- **Added Launch Date field** to Step 2 (Basic Info) with date picker
- **Updated save logic** to persist `targetAudience` to the new column
- Launch date was already being saved, now it's visible in the UI

### 3. Dashboard Data Loading
- **Updated `app/dashboard/page.tsx`** to pull `target_audience` from the onboarding table
- Passes full `targetAudience` object to `DashboardView` and task generation API

### 4. Task Generation API (`app/api/generate-enhanced-daily-tasks/route.ts`)
- **Added TARGET AUDIENCE DEEP DIVE section** to the AI prompt that extracts:
  - Professions
  - Age range
  - Locations
  - Pain points (top 3)
  - Goals/aspirations (top 3)
  - Interests (top 4)
  - Values (top 3)
  - Behaviors (top 3)
  - Where they hang out (top 4)
- **New prompt rule #15**: Explicitly tells the AI to weave these specifics into every task description
- **Already using**: Website analysis strengths, opportunities, industry, business model, value props

### 5. Improved Tone & Titles
- Removed "GOOD/BAD EXAMPLES" block that was causing generic output
- Added tone guidance: "experienced marketing coach talking to a busy founder"
- Emphasized natural, short titles (no "Task 1" or "#3" labels)
- Updated fallback templates to be more conversational
- Fixed objection task to lead into concrete marketing action

### 6. Fixed Calendar Bug
- Added `latestDayRef` to prevent stale async responses from overwriting tasks after tab switching
- Day navigation should now work consistently even after leaving/returning to tab

## How to Test

### Step 1: Run the Migration
```sql
-- In Supabase SQL Editor, run:
ALTER TABLE public.onboarding 
ADD COLUMN IF NOT EXISTS target_audience jsonb NULL;

CREATE INDEX IF NOT EXISTS idx_onboarding_target_audience 
ON public.onboarding USING gin (target_audience jsonb_path_ops);
```

Or just run the file: `add-target-audience-column.sql`

### Step 2: Complete Onboarding Fresh
1. Go to `/onboarding` (or `/onboarding?reseed=1` if you want to regenerate Week 1)
2. Complete all steps including:
   - Website analysis
   - Basic info (now includes **Launch Date**)
   - Target audience generation
   - Platform selection
3. Finish onboarding

### Step 3: Check the Database
```sql
SELECT 
  product_name,
  target_audience,
  website_analysis,
  launch_date
FROM onboarding 
WHERE user_id = '<your-user-id>';
```

You should see:
- `target_audience`: Full ICP object with demographics, psychographics, pain points, etc.
- `website_analysis`: Full analysis with strengths, opportunities, recommendations
- `launch_date`: The date you entered

### Step 4: Check Generated Tasks
1. Open dashboard
2. Navigate through Day 1-7
3. Look for tasks that:
   - Reference specific **professions** from your ICP (e.g., "SaaS founders", "indie hackers")
   - Mention actual **pain points** (e.g., "struggling with consistent content")
   - Use real **interests** or **hangout spots** (e.g., "in r/SaaS", "on Indie Hackers")
   - Feel **conversational** and natural, not robotic
   - Have **short, human titles** without numbers

## Example of Good vs Bad Tasks

### ❌ Before (Generic)
- Title: `X thread #3 on Real-time, self-reported MRR leaderboard`
- Description: Draft a 4-tweet thread breaking down Real-time, self-reported MRR leaderboard...

### ✅ After (Hyper-Targeted)
- Title: `Share a quick story about how SaaS founders track MRR`
- Description: Write a 5-line LinkedIn post about how BuildtoSk helps indie hackers and SaaS founders who are tired of spreadsheet hell track their MRR in real-time. Mention one founder who went from "guessing revenue" to "seeing it live" and ask "How are you tracking yours right now?"

## What Makes Tasks Hyper-Targeted Now

1. **Actual ICP data** from `target_audience` column
2. **Website analysis insights** from `website_analysis` column
3. **Launch date context** for stage-appropriate tasks
4. **AI prompt explicitly instructed** to use these specifics in every task
5. **Conversational tone** that feels like a coach, not a template

## Troubleshooting

### Tasks still feel generic?
- Check if `target_audience` is actually saved in DB
- Verify the AI prompt is receiving the data (check API logs)
- Make sure you completed the audience generation step in onboarding

### Target audience not saving?
- Run the migration to add the column
- Check that `formData.targetAudience` has data in the onboarding component
- Verify the upsert in `app/onboarding/page.tsx` line 80

### Launch date not showing?
- It's in Step 2 (Basic Info) now
- Should save to `onboarding.launch_date`
- Check `app/dashboard/page.tsx` line 55 for how it's loaded

## Next Steps

If you want tasks to be **even more specific**, you can:
1. Add more fields to the `target_audience` object during ICP generation
2. Expand the "TARGET AUDIENCE DEEP DIVE" section in the prompt
3. Create task templates that explicitly use certain ICP fields
4. Add "example task" snippets to the prompt that show how to weave in audience details

The foundation is now in place for truly hyper-targeted, analysis-driven tasks!
