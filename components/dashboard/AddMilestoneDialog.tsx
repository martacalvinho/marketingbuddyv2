"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trophy } from "lucide-react"

interface AddMilestoneDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  newMilestone: { title: string; date: string }
  onTitleChange: (value: string) => void
  onDateChange: (value: string) => void
  onAdd: () => void
}

export default function AddMilestoneDialog({ open, onOpenChange, newMilestone, onTitleChange, onDateChange, onAdd }: AddMilestoneDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-zinc-950 border-zinc-800 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Trophy className="h-5 w-5 text-amber-400" />
            Log a Win
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Record an achievement or milestone you've reached. This will appear in your Journey timeline.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-zinc-300">What did you achieve?</label>
            <input
              type="text"
              value={newMilestone.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full mt-1 p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white placeholder:text-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
              placeholder="e.g., Reached 500 followers, First paying customer, Launched beta..."
            />
          </div>
          <div>
            <label className="text-sm font-medium text-zinc-300">When did it happen? <span className="text-zinc-500 font-normal">(optional)</span></label>
            <input
              type="date"
              value={newMilestone.date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full mt-1 p-3 bg-zinc-900 border border-zinc-700 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
            />
            <p className="text-xs text-zinc-500 mt-1">Leave empty to use today's date</p>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white">
              Cancel
            </Button>
            <Button onClick={onAdd} className="bg-amber-500 text-black hover:bg-amber-400 font-semibold">
              🎉 Log Win
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
