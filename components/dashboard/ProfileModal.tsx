"use client"

import { X } from "lucide-react"
import UserProfile from "@/components/user-profile"

interface ProfileModalProps {
  open: boolean
  onClose: () => void
  user: any
  onSignOut: () => void
  onUpdateProfile: (updates: any) => Promise<void> | void
}

export default function ProfileModal({ open, onClose, user, onSignOut, onUpdateProfile }: ProfileModalProps) {
  if (!open) return null
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Profile Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          <UserProfile 
            user={user}
            onSignOut={onSignOut}
            onUpdateProfile={onUpdateProfile}
          />
        </div>
      </div>
    </div>
  )
}
