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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#0A0F0C] border border-white/10 rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-[#0A0F0C]/95 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-white">Profile Settings</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 rounded hover:bg-white/10"
          >
            <X className="h-5 w-5" />
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
