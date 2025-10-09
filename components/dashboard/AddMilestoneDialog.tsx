"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Milestone</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="text-sm font-medium text-gray-700">Milestone Title</label>
            <input
              type="text"
              value={newMilestone.title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              placeholder="e.g., Reached 500 followers"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700">Date Achieved</label>
            <input
              type="date"
              value={newMilestone.date}
              onChange={(e) => onDateChange(e.target.value)}
              className="w-full mt-1 p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={onAdd}>
              Add Milestone
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
