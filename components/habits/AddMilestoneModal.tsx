import { Circle } from "lucide-react"

import { Button } from "@/components/ui/button"

import type { MilestoneDraft } from "./types"

interface AddMilestoneModalProps {
  open: boolean
  value: MilestoneDraft
  onChange: (value: MilestoneDraft) => void
  onSubmit: () => void
  onClose: () => void
}

const AddMilestoneModal = ({ open, value, onChange, onSubmit, onClose }: AddMilestoneModalProps) => {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Add New Milestone</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <Circle className="h-6 w-6" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Milestone Title</label>
            <input
              type="text"
              value={value.title}
              onChange={(event) => onChange({ ...value, title: event.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Reached 500 followers"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="w-24">
              <label className="mb-1 block text-sm font-medium text-gray-700">Emoji</label>
              <input
                type="text"
                maxLength={2}
                value={value.emoji}
                onChange={(event) => onChange({ ...value, emoji: event.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="🚀"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={value.description}
                onChange={(event) => onChange({ ...value, description: event.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2"
                placeholder="Short blurb for context"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Date Achieved</label>
            <input
              type="date"
              value={value.date}
              onChange={(event) => onChange({ ...value, date: event.target.value })}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Progress (optional)</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                inputMode="decimal"
                value={value.current}
                onChange={(event) => onChange({ ...value, current: event.target.value })}
                className="w-24 rounded-md border border-gray-300 px-3 py-2"
                placeholder="0"
              />
              <span className="text-sm text-gray-500">/</span>
              <input
                type="number"
                inputMode="decimal"
                value={value.target}
                onChange={(event) => onChange({ ...value, target: event.target.value })}
                className="w-28 rounded-md border border-gray-300 px-3 py-2"
                placeholder="100"
              />
              <input
                type="text"
                value={value.unit}
                onChange={(event) => onChange({ ...value, unit: event.target.value })}
                className="w-24 rounded-md border border-gray-300 px-3 py-2"
                placeholder="unit (e.g. users, $ MRR)"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={onSubmit}>Add Milestone</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddMilestoneModal
