import { Circle } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

import type { MilestoneDraft } from "./types"

interface AddMilestoneModalProps {
  open: boolean
  value: MilestoneDraft
  onChange: (value: MilestoneDraft) => void
  onSubmit: () => void
  onClose: () => void
}

const EMOJI_OPTIONS = [
  '🚀', '🎯', '💰', '👥', '💵', '🏅', '⭐', '🔥', '💎', '🎉',
  '✨', '🌟', '🏆', '📈', '💪', '🎊', '🌈', '🎁', '🔔', '📱',
  '💻', '🌍', '🎨', '📝', '✅', '🎓', '🏃', '🚴', '🎸', '📚'
]

const AddMilestoneModal = ({ open, value, onChange, onSubmit, onClose }: AddMilestoneModalProps) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  
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
            <div className="w-24 relative">
              <label className="mb-1 block text-sm font-medium text-gray-700">Emoji</label>
              <button
                type="button"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-2xl hover:bg-gray-50 transition-colors"
              >
                {value.emoji || '🚀'}
              </button>
              
              {showEmojiPicker && (
                <div className="absolute z-50 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-lg p-3">
                  <div className="grid grid-cols-6 gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={() => {
                          onChange({ ...value, emoji })
                          setShowEmojiPicker(false)
                        }}
                        className="text-2xl hover:bg-gray-100 rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
            <label className="mb-1 block text-sm font-medium text-gray-700">Status</label>
            <div className="flex gap-4 mb-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={value.isCompleted === true}
                  onChange={() => onChange({ ...value, isCompleted: true, date: new Date().toISOString().slice(0, 10) })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Completed (with date)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  checked={value.isCompleted === false}
                  onChange={() => onChange({ ...value, isCompleted: false, date: '' })}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-sm text-gray-700">Goal (not yet achieved)</span>
              </label>
            </div>
            {value.isCompleted && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Date Achieved</label>
                <input
                  type="date"
                  value={value.date}
                  onChange={(event) => onChange({ ...value, date: event.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            )}
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
