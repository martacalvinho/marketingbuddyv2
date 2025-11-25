import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { 
  ChevronRight, 
  ChevronLeft,
  GripVertical, 
  Plus, 
  Users, 
  Banknote, 
  Flame, 
  Rocket,
  CheckCircle2,
  Lock,
  Edit2,
  X,
  Save,
  Share2,
  Trophy,
  Target,
  Calendar,
  Flag,
  Trash2,
  MoreHorizontal
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import type { Milestone } from "@/hooks/use-milestones"
import { cn } from "@/lib/utils"

import ShareJourneyDialog from "./ShareJourneyDialog"
import type { MilestoneDraft } from "./types"

// --- Types ---

interface JourneyPanelProps {
  streak: number
  xp: number
  currentDay: number
  user?: any
  weekStats: { total: number; done: number; goals: string[] }[]
  milestones: Milestone[]
  applyMilestonesChange: (updater: (prev: Milestone[]) => Milestone[]) => void
  onRefreshMilestones?: () => Promise<void>
  completedTasks: number
  totalTasks: number
}

const defaultMilestoneDraft: MilestoneDraft = {
  title: "", emoji: "🚩", description: "", date: "", current: "", target: "", unit: "",
}

const EMOJI_OPTIONS = [
  '🚀', '🎯', '💰', '👥', '💵', '🏅', '⭐', '🔥', '💎', '🎉',
  '✨', '🌟', '🏆', '📈', '💪', '🎊', '🌈', '🎁', '🔔', '📱',
  '💻', '🌍', '🎨', '📝', '✅', '🎓', '🏃', '🚴', '🎸', '📚'
]

// --- NEW: Improved Add Milestone Modal (Story Only) ---

const CreateMilestoneModal = ({ open, onClose, onSubmit }: any) => {
  const [data, setData] = useState(defaultMilestoneDraft)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  useEffect(() => {
    if (open) {
       setData({ ...defaultMilestoneDraft, emoji: '🚩' })
    }
  }, [open])

  const handleSubmit = () => {
    onSubmit({ ...data, mode: 'story' })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Log a Win</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          {/* Emoji & Title Row */}
          <div className="flex gap-3">
             <div className="w-16 relative">
               <Label className="text-xs text-zinc-500">Icon</Label>
               <Button
                  variant="outline"
                  className="w-full h-10 bg-zinc-900 border-zinc-800 text-xl p-0 hover:bg-zinc-800 hover:text-white"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
               >
                  {data.emoji}
               </Button>
               
               {showEmojiPicker && (
                 <div className="absolute z-50 mt-1 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg p-3 left-0">
                   <div className="grid grid-cols-6 gap-2">
                     {EMOJI_OPTIONS.map((emoji) => (
                       <button
                         key={emoji}
                         onClick={() => {
                           setData({ ...data, emoji })
                           setShowEmojiPicker(false)
                         }}
                         className="text-2xl hover:bg-zinc-800 rounded p-1 transition-colors"
                       >
                         {emoji}
                       </button>
                     ))}
                   </div>
                 </div>
               )}
             </div>
             <div className="flex-1">
               <Label className="text-xs text-zinc-500">Title</Label>
               <Input 
                  className="bg-zinc-900 border-zinc-800" 
                  placeholder="e.g., First Viral Tweet"
                  value={data.title}
                  onChange={e => setData({...data, title: e.target.value})}
               />
             </div>
          </div>

          <div className="space-y-1">
             <Label className="text-xs text-zinc-500">Description</Label>
             <Textarea 
                className="bg-zinc-900 border-zinc-800 resize-none" 
                placeholder="Add a little context..."
                value={data.description}
                onChange={e => setData({...data, description: e.target.value})}
             />
          </div>

          <div className="pt-2 border-t border-zinc-800">
             <Label className="text-xs text-zinc-500">Date</Label>
             <Input 
                type="date"
                className="bg-zinc-900 border-zinc-800" 
                value={data.date || new Date().toISOString().slice(0, 10)}
                onChange={e => setData({...data, date: e.target.value})}
             />
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-white/10">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-white text-black hover:bg-zinc-200">
            Add to Story
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// --- NEW: Set Goal Modal ---

const SetGoalModal = ({ open, onClose, onSubmit, category }: any) => {
  const [data, setData] = useState(defaultMilestoneDraft)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)

  useEffect(() => {
    if (open) {
       setData({ 
         ...defaultMilestoneDraft, 
         emoji: '🎯',
         unit: category === 'mrr' ? 'MRR' : 'users'
       })
    }
  }, [open, category])

  const handleSubmit = () => {
    onSubmit({ ...data, mode: 'goal' })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Set {category === 'mrr' ? 'Revenue' : 'User'} Target</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
             <div>
               <Label className="text-xs text-zinc-500">Target Number</Label>
               <Input 
                  type="number"
                  className="bg-zinc-900 border-zinc-800 text-lg" 
                  placeholder="100"
                  value={data.target}
                  onChange={e => setData({...data, target: e.target.value})}
                  autoFocus
               />
             </div>
             <div>
               <Label className="text-xs text-zinc-500">Unit</Label>
               <Input 
                  className="bg-zinc-900 border-zinc-800" 
                  placeholder="users"
                  value={data.unit}
                  onChange={e => setData({...data, unit: e.target.value})}
               />
             </div>
          </div>

          <div className="space-y-1">
             <Label className="text-xs text-zinc-500">Goal Title</Label>
             <Input 
                className="bg-zinc-900 border-zinc-800" 
                placeholder={category === 'mrr' ? "e.g., Reach $1k MRR" : "e.g., Reach 100 Users"}
                value={data.title}
                onChange={e => setData({...data, title: e.target.value})}
             />
          </div>
          
          <div>
               <Label className="text-xs text-zinc-500">Icon</Label>
               <div className="relative">
                 <Button
                    variant="outline"
                    className="w-16 h-10 bg-zinc-900 border-zinc-800 text-xl p-0 hover:bg-zinc-800 hover:text-white"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                 >
                    {data.emoji}
                 </Button>
                 
                 {showEmojiPicker && (
                   <div className="absolute z-50 mt-1 w-64 bg-zinc-900 border border-zinc-800 rounded-lg shadow-lg p-3">
                     <div className="grid grid-cols-6 gap-2">
                       {EMOJI_OPTIONS.map((emoji) => (
                         <button
                           key={emoji}
                           onClick={() => {
                             setData({ ...data, emoji })
                             setShowEmojiPicker(false)
                           }}
                           className="text-2xl hover:bg-zinc-800 rounded p-1 transition-colors"
                         >
                           {emoji}
                         </button>
                       ))}
                     </div>
                   </div>
                 )}
               </div>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-white/10">Cancel</Button>
          <Button onClick={handleSubmit} className="bg-white text-black hover:bg-zinc-200">
            Set Goal
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}


// --- NEW: Goal Carousel Component ---

const GoalCarousel = ({ title, icon: Icon, goals, currentVal, onAddGoal, onCompleteGoal, colorClass }: any) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const amount = 200
      scrollRef.current.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
    }
  }

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-zinc-400">
          <Icon size={16} className={colorClass} />
          <span className="text-sm font-medium uppercase tracking-wider">{title} Roadmap</span>
        </div>
        <div className="flex gap-1">
          <button onClick={() => scroll('left')} className="p-1 rounded-md hover:bg-white/5 text-zinc-500 hover:text-white"><ChevronLeft size={16} /></button>
          <button onClick={() => scroll('right')} className="p-1 rounded-md hover:bg-white/5 text-zinc-500 hover:text-white"><ChevronRight size={16} /></button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide snap-x"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {/* Add Button */}
        <button 
          onClick={onAddGoal}
          className="snap-start flex-shrink-0 w-[140px] h-[160px] rounded-xl border border-dashed border-zinc-800 bg-zinc-900/20 flex flex-col items-center justify-center gap-2 text-zinc-500 hover:text-white hover:border-zinc-600 hover:bg-zinc-900/40 transition-all group"
        >
          <div className="p-2 rounded-full bg-zinc-900 group-hover:bg-zinc-800"><Plus size={20} /></div>
          <span className="text-xs font-medium">Set Target</span>
        </button>

        {/* Goal Cards */}
        {goals.map((goal: any, idx: number) => {
           const progress = Math.min(100, Math.max(0, (currentVal / goal.target) * 100))
           const isNext = idx === 0 // Highlight the immediate next goal

           return (
             <div 
               key={goal.id || idx} 
               className={cn(
                 "snap-start flex-shrink-0 w-[200px] h-[160px] rounded-xl border p-4 flex flex-col justify-between transition-all relative overflow-hidden cursor-pointer group",
                 isNext ? "border-zinc-700 bg-zinc-900" : "border-zinc-800 bg-zinc-950/50 opacity-70 hover:opacity-100"
               )}
               onClick={() => onCompleteGoal(goal)}
             >
                {isNext && <div className={`absolute top-0 left-0 right-0 h-1 ${colorClass.replace('text-', 'bg-')}`} />}
                
                <div className="flex justify-between items-start">
                  <div className="p-2 rounded-lg bg-zinc-950 border border-zinc-800 text-2xl">{goal.emoji}</div>
                  <div className="text-zinc-600 group-hover:text-white transition-colors">
                    {goal.type === 'users' || goal.type === 'mrr' ? (
                       <Lock size={14} />
                    ) : (
                       <CheckCircle2 size={14} />
                    )}
                  </div>
                </div>

                <div>
                   <div className="text-xs text-zinc-500 font-medium uppercase mb-1">{goal.type === 'mrr' ? 'MRR Goal' : 'User Goal'}</div>
                   <div className="text-lg font-bold text-white leading-tight">{goal.title}</div>
                </div>

                <div className="space-y-1.5">
                   <div className="flex justify-between text-[10px] text-zinc-500">
                      <span>{Math.round(progress)}%</span>
                      <span>{goal.target.toLocaleString()}</span>
                   </div>
                   <Progress value={progress} className="h-1 bg-zinc-800" indicatorClassName={colorClass.replace('text-', 'bg-')} />
                </div>
             </div>
           )
        })}
      </div>
    </div>
  )
}


// --- Main Panel ---

const JourneyPanel = ({ streak, currentDay, user, weekStats, milestones, applyMilestonesChange, onRefreshMilestones, completedTasks, totalTasks }: JourneyPanelProps) => {
  
  // State
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareTemplate, setShareTemplate] = useState<"journey" | "milestone" | "weekly">("journey")
  
  const [modalOpen, setModalOpen] = useState(false)
  const [goalModalOpen, setGoalModalOpen] = useState(false)
  const [goalCategory, setGoalCategory] = useState<'users' | 'mrr' | null>(null)
  
  const [draggedMilestone, setDraggedMilestone] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const shareCardRef = useRef<HTMLDivElement>(null)

  const [currentUsers, setCurrentUsers] = useState(() => parseInt(user?.currentUsers || "0", 10) || 0)
  const [currentRevenue, setCurrentRevenue] = useState(() => parseFloat(user?.currentMrr || "0") || 0)

  // Calculation Helpers
  const weekDone = useMemo(() => (weekStats || []).reduce((acc, item) => acc + (item?.done || 0), 0), [weekStats])
  const weekTotal = useMemo(() => (weekStats || []).reduce((acc, item) => acc + (item?.total || 0), 0), [weekStats])
  const consistencyPercent = totalTasks > 0 ? Math.min(100, Math.round((completedTasks / totalTasks) * 100)) : 0

  // --- Handling Milestones ---

  const handleCreateMilestone = async (data: any) => {
    if (!data.title.trim() || !user?.id) return

    // Prepare Payload
    let payload: any = {
      user_id: user.id,
      title: data.title,
      description: data.description,
      emoji: data.emoji || (data.mode === 'goal' ? "🎯" : "🚩"),
      type: "user_added",
      unlocked: false,
      date: null
    }

    if (data.mode === 'goal') {
       // It's a numeric target
       const target = parseFloat(data.target || "0")
       // If adding via carousel, force the type
       const goalType = goalCategory || (data.title.toLowerCase().includes('mrr') ? 'revenue' : 'users')
       const current = goalType === 'revenue' || goalType === 'mrr' ? currentRevenue : currentUsers
       
       payload.goal_type = goalType === 'revenue' ? 'revenue' : (goalType === 'mrr' ? 'mrr' : 'users')
       payload.progress_target = target
       payload.progress_current = current
       payload.unit = data.unit || (goalType === 'users' ? 'users' : 'mrr')
       payload.unlocked = current >= target
       payload.date = payload.unlocked ? new Date().toISOString().slice(0, 10) : null
    } else {
       // It's a story moment
       payload.unlocked = true
       payload.completed = true // Custom flag often used
       payload.date = data.date || new Date().toISOString().slice(0, 10)
    }

    const { data: newRow } = await supabase.from("milestones").insert([payload]).select("*").maybeSingle()
    
    if (newRow) {
      applyMilestonesChange((prev) => [...prev, newRow as unknown as Milestone])
    }
    if (onRefreshMilestones) await onRefreshMilestones()
    setModalOpen(false)
    setGoalModalOpen(false)
  }

  const handleDeleteMilestone = async (milestoneId: string) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return

    const { error } = await supabase.from("milestones").delete().eq('id', milestoneId)
    
    if (!error) {
      applyMilestonesChange((prev) => prev.filter(m => m.id !== milestoneId))
      if (onRefreshMilestones) await onRefreshMilestones()
    }
  }

  const handleCompleteGoal = async (goal: any) => {
    if (goal.isPreset) {
      alert("Preset system goals cannot be manually completed. They will unlock automatically when you reach the target.")
      return
    }
    
    if (!confirm(`Mark "${goal.title}" as completed today?`)) return
    
    const payload = {
      unlocked: true,
      date: new Date().toISOString().slice(0, 10)
    }
    
    const { error } = await supabase.from("milestones").update(payload).eq('id', goal.id)
    
    if (!error) {
      // Optimistic update
      applyMilestonesChange((prev) => prev.map(m => m.id === goal.id ? { ...m, ...payload } : m))
      if (onRefreshMilestones) await onRefreshMilestones()
    }
  }

  const handleDrop = async (index: number) => {
      if (!draggedMilestone) return
      const draggedIndex = pendingStory.findIndex(m => m.id === draggedMilestone)
      if (draggedIndex === -1) return
      const reordered = [...pendingStory]
      const [removed] = reordered.splice(draggedIndex, 1)
      reordered.splice(index, 0, removed)
      for (let i = 0; i < reordered.length; i++) {
         const m = reordered[i]
         if (!m.isPreset && m.milestoneData?.id) { await supabase.from('milestones').update({ sort_order: i }).eq('id', m.milestoneData.id) }
      }
      setDraggedMilestone(null)
      setDragOverIndex(null)
      if (onRefreshMilestones) await onRefreshMilestones()
  }

  // --- Filtering Logic (Carousel vs Timeline) ---

  const { pendingStory, historyStory, lockedUserGoals, lockedRevenueGoals } = useMemo(() => {
    // 1. Define Base System Presets
    const presets = [
      { id: 'p-u-1', emoji: '👤', title: 'First User', target: 1, type: 'users' },
      { id: 'p-u-10', emoji: '👥', title: '10 Users', target: 10, type: 'users' },
      { id: 'p-u-50', emoji: '👨‍👩‍👧', title: '50 Users', target: 50, type: 'users' },
      { id: 'p-u-100', emoji: '🎯', title: '100 Users', target: 100, type: 'users' },
      { id: 'p-u-500', emoji: '🚀', title: '500 Users', target: 500, type: 'users' },
      { id: 'p-u-1000', emoji: '⚡️', title: '1,000 Users', target: 1000, type: 'users' },
      
      { id: 'p-m-1', emoji: '💵', title: 'First Dollar', target: 1, type: 'mrr' },
      { id: 'p-m-100', emoji: '💰', title: '$100 MRR', target: 100, type: 'mrr' },
      { id: 'p-m-500', emoji: '💸', title: '$500 MRR', target: 500, type: 'mrr' },
      { id: 'p-m-1000', emoji: '💎', title: '$1k MRR', target: 1000, type: 'mrr' },
      { id: 'p-m-5000', emoji: '🏛️', title: '$5k MRR', target: 5000, type: 'mrr' },
    ]

    const pendingStoryItems: any[] = []
    const historyItems: any[] = []
    const userGoals: any[] = []
    const revGoals: any[] = []

    // 2. Process Presets
    presets.forEach(preset => {
      const current = preset.type === 'users' ? currentUsers : currentRevenue
      const achieved = current >= preset.target
      const existing = milestones.find(m => m.title.toLowerCase().includes(preset.title.toLowerCase()) || (m.type === 'goal_achieved' && m.goal_type === preset.type && achieved))
      
      if (achieved && existing?.unlocked) {
        // If achieved, it goes to the HISTORY wall (Trophy)
        historyItems.push({ ...preset, date: existing.date || new Date().toISOString(), isPreset: true, milestoneData: existing })
      } else {
        // If NOT achieved, it stays in the CAROUSEL (Locked Goal)
        const item = { ...preset, current: current }
        if (preset.type === 'users') userGoals.push(item)
        else revGoals.push(item)
      }
    })

    // 3. Process Custom Milestones
    milestones.forEach(m => {
       const isStory = m.type === 'user_added' && !m.goal_type // Just a story moment
       const isGoal = m.goal_type === 'users' || m.goal_type === 'revenue' || m.goal_type === 'mrr'

       if (isStory) {
          const item = {
             id: m.id, emoji: m.emoji || '🚩', title: m.title, description: m.description,
             date: m.date, isPreset: false, sortOrder: (m as any).sortOrder ?? 999, milestoneData: m
          }
          if (m.unlocked || (m as any).completed) historyItems.push(item)
          else pendingStoryItems.push(item)
       } else if (isGoal && !m.unlocked) {
          // Custom Locked Goal -> Add to Carousel
          const current = (m.goal_type === 'users') ? currentUsers : currentRevenue
          const item = {
             id: m.id, emoji: m.emoji || '🎯', title: m.title, target: m.progressTarget || 0,
             current: current, type: m.goal_type === 'users' ? 'users' : 'mrr', isPreset: false
          }
          if (m.goal_type === 'users') userGoals.push(item)
          else revGoals.push(item)
       } else if (isGoal && m.unlocked) {
          // Custom Goal Achieved -> Add to History
          historyItems.push({
             id: m.id, emoji: m.emoji || '🏆', title: m.title, date: m.date, isPreset: false, milestoneData: m
          })
       }
    })

    // Sorting
    historyItems.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    pendingStoryItems.sort((a, b) => (a.sortOrder ?? 999) - (b.sortOrder ?? 999))
    userGoals.sort((a, b) => a.target - b.target)
    revGoals.sort((a, b) => a.target - b.target)

    return { pendingStory: pendingStoryItems, historyStory: historyItems, lockedUserGoals: userGoals, lockedRevenueGoals: revGoals }
  }, [currentUsers, currentRevenue, milestones])


  return (
    <>
      <div className="space-y-8">
        
        {/* --- 1. Dashboard HUD --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           {/* Users Card */}
           <div className="bg-black/20 border border-white/5 backdrop-blur-sm rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity scale-125 rotate-12"><Users size={64} /></div>
              <div className="relative z-10">
                 <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Total Users</div>
                 <div className="text-3xl font-bold text-white tracking-tight">{currentUsers.toLocaleString()}</div>
                 <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 w-1/2 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${currentUsers > 0 ? Math.min(100, (currentUsers / (lockedUserGoals[0]?.target || 100)) * 100) : 0}%` }} />
                 </div>
                 <div className="text-[10px] text-zinc-500 mt-2 flex justify-between font-medium">
                    <span>Current</span>
                    <span>Next: {lockedUserGoals[0]?.target || '∞'}</span>
                 </div>
              </div>
           </div>

           {/* MRR Card */}
           <div className="bg-black/20 border border-white/5 backdrop-blur-sm rounded-2xl p-5 relative overflow-hidden group hover:border-white/10 transition-colors">
              <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity scale-125 rotate-12"><Banknote size={64} /></div>
              <div className="relative z-10">
                 <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">Monthly Revenue</div>
                 <div className="text-3xl font-bold text-white tracking-tight">${currentRevenue.toLocaleString()}</div>
                 <div className="mt-4 h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-lime-500 w-1/2 shadow-[0_0_10px_rgba(132,204,22,0.5)]" style={{ width: `${currentRevenue > 0 ? Math.min(100, (currentRevenue / (lockedRevenueGoals[0]?.target || 100)) * 100) : 0}%` }} />
                 </div>
                 <div className="text-[10px] text-zinc-500 mt-2 flex justify-between font-medium">
                    <span>Current</span>
                    <span>Next: ${lockedRevenueGoals[0]?.target || '∞'}</span>
                 </div>
              </div>
           </div>

           {/* Enhanced Streak Card */}
           <div className="bg-black/20 border border-white/5 backdrop-blur-sm rounded-2xl p-5 relative overflow-hidden group hover:border-orange-500/20 transition-all">
              {/* Animated fire glow background */}
              {streak > 0 && (
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 via-transparent to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              )}
              
              <div className="relative flex items-center gap-5">
                <div className={`h-16 w-16 rounded-full flex items-center justify-center border shadow-lg transition-all group-hover:scale-110 ${
                  streak >= 30 
                    ? 'bg-gradient-to-br from-orange-500 to-red-600 border-orange-400 shadow-orange-500/30' 
                    : streak >= 7 
                      ? 'bg-orange-500/20 border-orange-500/40 text-orange-400 shadow-orange-500/20'
                      : streak > 0
                        ? 'bg-orange-500/10 border-orange-500/20 text-orange-500 shadow-orange-500/10'
                        : 'bg-zinc-800/50 border-zinc-700 text-zinc-500'
                }`}>
                   <Flame size={streak >= 30 ? 32 : 28} className={streak >= 30 ? 'text-white' : ''} />
                </div>
                
                <div className="flex-1">
                   <div className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-1">
                     {streak >= 30 ? '🔥 On Fire!' : streak >= 7 ? '💪 Building Momentum' : streak > 0 ? 'Keep Going!' : 'Start Your Streak'}
                   </div>
                   <div className="text-3xl font-bold text-white tracking-tight flex items-baseline gap-2">
                     {streak} <span className="text-lg text-zinc-400 font-normal">day{streak !== 1 ? 's' : ''}</span>
                   </div>
                   
                   {/* Motivational message based on streak */}
                   <div className="text-xs mt-2 font-medium">
                     {streak === 0 && (
                       <span className="text-zinc-500">Complete a task to start your streak!</span>
                     )}
                     {streak > 0 && streak < 3 && (
                       <span className="text-orange-400/80">Great start! 3 days builds a habit.</span>
                     )}
                     {streak >= 3 && streak < 7 && (
                       <span className="text-orange-400">Nice! {7 - streak} more days to hit a week!</span>
                     )}
                     {streak >= 7 && streak < 14 && (
                       <span className="text-orange-400">One week strong! You're building real momentum.</span>
                     )}
                     {streak >= 14 && streak < 30 && (
                       <span className="text-orange-400">Two weeks! {30 - streak} days to legendary status.</span>
                     )}
                     {streak >= 30 && streak < 60 && (
                       <span className="text-orange-300">🏆 Legendary! You're in the top 5% of marketers.</span>
                     )}
                     {streak >= 60 && (
                       <span className="text-orange-200">👑 Marketing master! {streak} days of pure consistency.</span>
                     )}
                   </div>
                   
                   {/* Weekly progress bar */}
                   <div className="mt-3 flex items-center gap-2">
                     <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-orange-500 to-orange-400 rounded-full transition-all"
                         style={{ width: `${weekTotal > 0 ? (weekDone / weekTotal) * 100 : 0}%` }}
                       />
                     </div>
                     <span className="text-xs text-zinc-500 font-medium">{weekDone}/{weekTotal}</span>
                   </div>
                </div>
                
                {/* Streak milestone badges */}
                {streak >= 7 && (
                  <div className="absolute top-2 right-2 flex gap-1">
                    {streak >= 7 && <div className="h-5 w-5 rounded-full bg-orange-500/20 flex items-center justify-center text-[10px]">7</div>}
                    {streak >= 14 && <div className="h-5 w-5 rounded-full bg-orange-500/30 flex items-center justify-center text-[10px]">14</div>}
                    {streak >= 30 && <div className="h-5 w-5 rounded-full bg-orange-500/50 flex items-center justify-center text-[10px]">30</div>}
                    {streak >= 60 && <div className="h-5 w-5 rounded-full bg-orange-500/70 flex items-center justify-center text-[10px]">60</div>}
                  </div>
                )}
              </div>
           </div>
        </div>

        {/* --- 2. Goal Carousels --- */}
        <div className="space-y-8">
           <GoalCarousel 
              title="User Growth" 
              icon={Users} 
              colorClass="text-blue-500" 
              goals={lockedUserGoals} 
              currentVal={currentUsers} 
              onAddGoal={() => { setGoalCategory('users'); setGoalModalOpen(true) }}
              onCompleteGoal={handleCompleteGoal}
           />
           <GoalCarousel 
              title="Revenue Growth" 
              icon={Banknote} 
              colorClass="text-lime-500" 
              goals={lockedRevenueGoals} 
              currentVal={currentRevenue}
              onAddGoal={() => { setGoalCategory('mrr'); setGoalModalOpen(true) }}
              onCompleteGoal={handleCompleteGoal}
           />
        </div>

        {/* --- 3. The Story Timeline --- */}
        <div className="border-t border-white/5 pt-10">
           <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">The Founder's Story</h3>
                <p className="text-sm text-zinc-400 mt-1">A log of your wins, launches, and unlocked trophies.</p>
              </div>
              <Button 
                variant="default" 
                onClick={() => setModalOpen(true)} 
                className="bg-white text-black hover:bg-zinc-200 border-0"
              >
                 <Edit2 size={14} className="mr-2" /> Log Entry
              </Button>
           </div>

           <div className="relative max-w-3xl mx-auto">
              
              {/* Next Chapter (Pending Story Items) */}
              {pendingStory.length > 0 && (
                 <div className="mb-12">
                    <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 pl-16">Next Chapter</div>
                    {pendingStory.map((item, i) => (
                      <div 
                        key={item.id}
                        draggable
                        onDragStart={() => setDraggedMilestone(item.id)}
                        onDragOver={(e) => { e.preventDefault(); setDragOverIndex(i) }}
                        onDrop={(e) => { e.preventDefault(); handleDrop(i) }}
                        onDragEnd={() => { setDraggedMilestone(null); setDragOverIndex(null) }}
                        className={cn(
                           "relative flex gap-6 py-2 group transition-all",
                           dragOverIndex === i ? "translate-y-2" : ""
                        )}
                      >
                         <div className="absolute left-[27px] top-0 bottom-0 w-0.5 border-l-2 border-dashed border-zinc-800" />
                         <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-[#020604] border-4 border-zinc-900 flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform">
                            {item.emoji}
                         </div>
                         <div className="flex-1 bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:bg-white/[0.04] hover:border-white/10 transition-all cursor-move shadow-sm relative">
                            {/* Delete Action for Pending Items */}
                            {!item.isPreset && (
                              <button 
                                onClick={() => handleDeleteMilestone(item.id)}
                                className="absolute top-2 right-2 p-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                            
                            <div className="flex items-start gap-3">
                               <GripVertical className="text-zinc-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity" size={14} />
                               <div>
                                 <div className="font-bold text-zinc-200 tracking-tight">{item.title}</div>
                                 {item.description && <div className="text-sm text-zinc-500 mt-1">{item.description}</div>}
                               </div>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>
              )}

              {/* History (Completed) */}
              <div>
                 <div className="text-xs font-bold text-zinc-500 uppercase tracking-widest mb-6 pl-16">Chronicles</div>
                 
                 {historyStory.map((item, i) => (
                    <div key={item.id || i} className="relative flex gap-6 py-6 group">
                       <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-zinc-800" />
                       
                       {/* Icon Node */}
                       <div className={cn(
                          "relative z-10 flex-shrink-0 w-14 h-14 rounded-full border-4 border-[#020604] flex items-center justify-center text-2xl shadow-lg transition-transform group-hover:scale-110",
                          item.isPreset ? "bg-lime-500/10 text-lime-500 border-lime-500/20" : "bg-zinc-800 text-zinc-300"
                       )}>
                          {item.emoji}
                       </div>

                       {/* Card */}
                       <div className="flex-1 relative">
                          <div className="flex items-baseline justify-between mb-2">
                             <div className="text-xs font-mono text-zinc-500">{new Date(item.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                             {item.isPreset && <Badge className="bg-lime-500/10 text-lime-400 border-0 text-[10px] uppercase tracking-wider px-2 font-bold shadow-[0_0_10px_rgba(163,230,53,0.2)]">Trophy Unlocked</Badge>}
                          </div>
                          <div className={cn(
                             "rounded-xl border p-6 transition-all relative group/card",
                             item.isPreset ? "bg-gradient-to-br from-lime-900/10 to-black/40 border-lime-500/20 backdrop-blur-sm" : "bg-black/20 border-white/5 backdrop-blur-sm"
                          )}>
                             {/* Delete for Custom History Items */}
                             {!item.isPreset && (
                                <button 
                                  onClick={() => handleDeleteMilestone(item.id)}
                                  className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-500 opacity-0 group-hover/card:opacity-100 transition-opacity"
                                >
                                  <Trash2 size={14} />
                                </button>
                             )}

                             <h4 className={cn("font-bold text-lg tracking-tight", item.isPreset ? "text-white" : "text-zinc-200")}>{item.title}</h4>
                             {item.description && <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{item.description}</p>}
                          </div>
                       </div>
                    </div>
                 ))}
                 
                 {/* Launch Node */}
                 {user?.launchDate && (
                    <div className="relative flex gap-6 py-6">
                       <div className="relative z-10 flex-shrink-0 w-14 h-14 rounded-full bg-purple-500/10 text-purple-500 border-4 border-[#020604] flex items-center justify-center text-2xl shadow-lg">🚀</div>
                       <div className="flex-1 pt-2">
                          <div className="text-xs font-mono text-zinc-500 mb-1">{new Date(user.launchDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                          <div className="text-xl font-bold text-zinc-300 tracking-tight">Launch Day</div>
                          <div className="text-sm text-zinc-500">The journey began.</div>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </div>

      </div>

      <CreateMilestoneModal 
         open={modalOpen} 
         onClose={() => setModalOpen(false)} 
         onSubmit={handleCreateMilestone}
      />

      <SetGoalModal 
         open={goalModalOpen}
         onClose={() => setGoalModalOpen(false)}
         onSubmit={handleCreateMilestone}
         category={goalCategory}
      />
      
      <ShareJourneyDialog 
         open={showShareModal} 
         template={shareTemplate} 
         onTemplateChange={setShareTemplate} 
         onOpenChange={setShowShareModal} 
         shareCardRef={shareCardRef} 
         currentDay={currentDay} 
         currentUsers={currentUsers} 
         userGoal={lockedUserGoals[0]?.target || 0} 
         currentRevenue={currentRevenue} 
         revenueGoal={lockedRevenueGoals[0]?.target || 0} 
         streak={streak} 
         weekDone={weekDone} 
         weekTotal={weekTotal} 
         userProductName={user?.productName} 
         milestones={milestones} 
         launchDate={user?.launchDate} 
         winsGoals={[]} 
         currentWeekGoals={[]} 
         achievementPresets={[]}
         currentWeek={Math.ceil(currentDay / 7)}
         onDownload={() => console.log("Download functionality not yet implemented")}
      />
    </>
  )
}

export default JourneyPanel