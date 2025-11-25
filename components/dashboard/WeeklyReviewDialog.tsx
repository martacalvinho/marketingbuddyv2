"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface WeeklyForm {
  tractionChannel: string
  wasteChannel: string
  focusNextWeek: string[]
  feeling: string
  notes: string
}

interface WeeklyReviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  weeklyForm: WeeklyForm
  onUpdateField: (field: keyof WeeklyForm, value: string) => void
  onSave: () => Promise<void> | void
}

export default function WeeklyReviewDialog({ open, onOpenChange, weeklyForm, onUpdateField, onSave }: WeeklyReviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Weekly Review</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>What got traction this week?</Label>
            <Input value={weeklyForm.tractionChannel} onChange={(e) => onUpdateField('tractionChannel', e.target.value)} placeholder="e.g., X, SEO, Newsletter" />
          </div>
          <div>
            <Label>What felt like a waste of time?</Label>
            <Input value={weeklyForm.wasteChannel} onChange={(e) => onUpdateField('wasteChannel', e.target.value)} placeholder="e.g., Reddit" />
          </div>
          <div>
            <Label>Focus next week (comma separated)</Label>
            <Input value={weeklyForm.focusNextWeek.join(', ')} onChange={(e) => onUpdateField('focusNextWeek', e.target.value)} placeholder="e.g., X threads, Cold outreach" />
          </div>
          <div>
            <Label>How are you feeling? (1-10)</Label>
            <Input type="number" min={1} max={10} value={weeklyForm.feeling} onChange={(e) => onUpdateField('feeling', e.target.value)} />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={weeklyForm.notes} onChange={(e) => onUpdateField('notes', e.target.value)} placeholder="Highlights, struggles, ideas" />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button onClick={() => void onSave()}>Save Review (+50 XP)</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
