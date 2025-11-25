import { useState, useRef, useEffect } from "react"
import { 
  Calendar, 
  CheckCircle2, 
  ChevronLeft, 
  ChevronRight, 
  Circle, 
  Zap, 
  MoreVertical, 
  PenLine, 
  Trash2, 
  SkipForward, 
  StickyNote, 
  Plus,
  X,
  Sparkles,
  GripVertical
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import type { HabitTask } from "./types"
import { detectPlatformId, getCategoryColor, getPlatformIcon } from "./task-utils"
import { cn } from "@/lib/utils"

interface TaskPanelProps {
  tasks: HabitTask[]
  currentDay: number
  streak: number
  onDayChange?: (day: number) => void
  onCompleteTask: (taskId: string | number) => void
  onDeleteTask?: (taskId: string | number) => void
  onAddTask?: (title: string, description: string) => void
  onUpdateTask?: (taskId: string | number, updates: Partial<HabitTask>) => void
  onReorderTasks?: (newOrder: HabitTask[]) => void
  onAddTaskNote?: (taskId: string | number, note: string) => void
  onSkipTask?: (taskId: string | number) => void
  onSuggestContent?: (platformId: string, task: HabitTask) => void
  onTaskUpdate?: () => void
}

// --- Sub-component: Individual Task Card ---
const TaskItem = ({ 
  task, 
  index, 
  isEditing, 
  isNoteEditing, 
  noteDraft,
  onEditStart, 
  onNoteStart, 
  onSaveEdit, 
  onCancelEdit, 
  onSaveNote, 
  onCancelNote,
  onNoteChange,
  editTitle,
  editDesc,
  setEditTitle,
  setEditDesc,
  actions 
}: any) => {
  const platformId = detectPlatformId(task)
  const PlatformIcon: any = platformId ? getPlatformIcon(platformId) : null
  
  // Drag handlers
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("taskId", String(task.id))
    actions.onDragStart(e, task)
  }

  return (
    <div
      draggable={!isEditing && !isNoteEditing}
      onDragStart={handleDragStart}
      onDragOver={actions.onDragOver}
      onDrop={(e) => actions.onDrop(e, task)}
      className={cn(
        "group relative flex gap-4 rounded-xl border p-4 transition-all duration-300",
        task.completed ? "border-zinc-800/50 bg-zinc-900/20 opacity-60 hover:opacity-100" 
        : task.skipped ? "border-dashed border-zinc-800 bg-zinc-950/20 opacity-50"
        : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 shadow-sm hover:shadow-md hover:translate-x-0.5"
      )}
    >
      {/* 1. Drag Handle (Hover only) */}
      {!task.completed && !isEditing && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 p-1 cursor-grab text-zinc-600 opacity-0 group-hover:opacity-100 transition-opacity hover:text-zinc-400">
          <GripVertical size={14} />
        </div>
      )}

      {/* 2. Checkbox / Status */}
      <div className="pt-1 flex-shrink-0 relative z-10 pl-2">
        <button
          onClick={() => !task.completed && !task.skipped && actions.handleCompleteTask(task.id)}
          disabled={task.completed || task.skipped}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-300",
            task.completed ? "border-lime-500 bg-lime-500 text-black shadow-[0_0_10px_rgba(163,230,53,0.4)]" 
            : task.skipped ? "border-zinc-700 bg-transparent text-zinc-700"
            : "border-zinc-700 bg-transparent text-transparent hover:border-lime-400 hover:text-lime-400/20"
          )}
        >
          {task.completed ? <CheckCircle2 size={16} /> : task.skipped ? <SkipForward size={14} /> : <Circle size={16} />}
        </button>
      </div>

      {/* 3. Main Content */}
      <div className="flex-1 min-w-0">
        {isEditing ? (
          <div className="space-y-3 animate-in fade-in zoom-in-95">
            <Input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="bg-black/40 border-zinc-800 text-white font-medium focus:border-lime-500/50"
              placeholder="Task title"
              autoFocus
            />
            <Input
              value={editDesc}
              onChange={(e) => setEditDesc(e.target.value)}
              className="bg-black/40 border-zinc-800 text-zinc-400 text-sm focus:border-lime-500/50"
              placeholder="Description"
            />
            <div className="flex gap-2">
              <Button size="sm" onClick={onSaveEdit} className="h-7 bg-lime-400 text-black hover:bg-lime-300 font-medium">Save</Button>
              <Button size="sm" variant="ghost" onClick={onCancelEdit} className="h-7 text-zinc-400 hover:text-white">Cancel</Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-1">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h4 className={cn(
                  "font-medium leading-tight transition-all",
                  task.completed ? "text-zinc-500 line-through decoration-zinc-700" : "text-zinc-200"
                )}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-sm text-zinc-500 mt-1.5 line-clamp-2 leading-relaxed">{task.description}</p>
                )}
              </div>
              
              {/* Reward Badge (Right Side) */}
              {!task.completed && !task.skipped && (
                 <div className="flex flex-col items-end gap-1.5">
                    <Badge variant="outline" className="border-yellow-500/20 bg-yellow-500/5 text-yellow-500 text-[10px] px-1.5 py-0.5 h-5 gap-1 font-mono">
                      <Zap size={10} /> {task.xp || 10}XP
                    </Badge>
                    <Badge variant="outline" className="border-zinc-800 bg-zinc-900 text-zinc-500 text-[10px] px-1.5 py-0.5 h-5">
                      {task.estimatedTime || "15m"}
                    </Badge>
                 </div>
              )}
            </div>
            
            {/* Tags & Notes */}
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {(task.platform || platformId) && (
                <Badge variant="secondary" className="bg-white/5 border border-white/5 text-zinc-400 hover:bg-white/10 text-[10px] h-5 px-1.5">
                  {PlatformIcon && <PlatformIcon size={10} className="mr-1" />}
                  {String(task.platform || platformId).split(" ")[0]}
                </Badge>
              )}
              {task.category && (
                <Badge className={cn("text-[10px] h-5 px-1.5 border-0 font-normal", getCategoryColor(task.category))}>
                  {task.category}
                </Badge>
              )}
              {task.note && !isNoteEditing && (
                <div className="flex items-center gap-1.5 text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                   <StickyNote size={10} />
                   <span className="truncate max-w-[200px]">{task.note}</span>
                </div>
              )}
            </div>
            
            {/* Note Editor */}
            {isNoteEditing && (
               <div className="mt-3 bg-black/40 p-3 rounded-lg border border-zinc-800 animate-in slide-in-from-top-2">
                 <Textarea 
                    value={noteDraft}
                    onChange={(e) => onNoteChange(e.target.value)}
                    className="bg-transparent border-0 p-0 text-sm focus-visible:ring-0 min-h-[60px] resize-none text-zinc-200 placeholder:text-zinc-600"
                    placeholder="Jot down some thoughts..."
                    autoFocus
                 />
                 <div className="flex justify-end gap-2 mt-2">
                    <Button size="sm" variant="ghost" onClick={onCancelNote} className="h-6 text-xs text-zinc-500 hover:text-white">Cancel</Button>
                    <Button size="sm" onClick={onSaveNote} className="h-6 text-xs bg-white text-black hover:bg-zinc-200">Save Note</Button>
                 </div>
               </div>
            )}

            {/* Action Bar (Only visible if active) */}
            {!task.completed && !task.skipped && !isEditing && !isNoteEditing && (
              <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Primary Action */}
                {actions.onSuggestContent && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => actions.onSuggestContent(platformId || "freestyle", task)}
                    className="h-7 text-xs border-lime-500/20 text-lime-400 hover:bg-lime-500/10 hover:text-lime-300 bg-transparent hover:border-lime-500/30 transition-colors"
                  >
                    <Sparkles size={12} className="mr-1.5" />
                    Create Content
                  </Button>
                )}

                <div className="flex-1" />

                {/* Secondary Actions Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white hover:bg-white/10 rounded-lg">
                      <MoreVertical size={14} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-200 p-1">
                    <DropdownMenuItem onClick={onEditStart} className="text-xs cursor-pointer focus:bg-zinc-800 focus:text-white rounded-md">
                      <PenLine size={14} className="mr-2" /> Edit Task
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={onNoteStart} className="text-xs cursor-pointer focus:bg-zinc-800 focus:text-white rounded-md">
                      <StickyNote size={14} className="mr-2" /> {task.note ? "Edit Note" : "Add Note"}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => actions.handleSkipTask(task.id)} className="text-xs cursor-pointer focus:bg-zinc-800 focus:text-white rounded-md">
                      <SkipForward size={14} className="mr-2" /> Skip for Now
                    </DropdownMenuItem>
                    {actions.onDeleteTask && (
                      <>
                        <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                        <DropdownMenuItem onClick={() => actions.handleDeleteTask(task.id)} className="text-xs cursor-pointer text-red-400 focus:bg-red-900/20 focus:text-red-300 rounded-md">
                          <Trash2 size={14} className="mr-2" /> Delete
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


const TaskPanel = ({
  tasks,
  currentDay,
  streak,
  onDayChange,
  onCompleteTask,
  onDeleteTask,
  onAddTask,
  onUpdateTask,
  onReorderTasks,
  onAddTaskNote,
  onSkipTask,
  onSuggestContent,
  onTaskUpdate,
}: TaskPanelProps) => {
  const [addingTask, setAddingTask] = useState(false)
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  
  // Edit States
  const [editingTaskId, setEditingTaskId] = useState<string | number | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [editDesc, setEditDesc] = useState("")
  
  // Note States
  const [noteEditingTaskId, setNoteEditingTaskId] = useState<string | number | null>(null)
  const [noteDraft, setNoteDraft] = useState("")
  
  // Drag State
  const [draggedTask, setDraggedTask] = useState<HabitTask | null>(null)

  const completedCount = tasks.filter((t) => t.completed).length
  const totalCount = tasks.length
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0

  // --- Handlers ---

  const handleCompleteTask = (id: string | number) => {
    onCompleteTask(id)
    onTaskUpdate?.()
  }

  const handleDeleteTask = (id: string | number) => {
    onDeleteTask?.(id)
    onTaskUpdate?.()
  }

  const handleAddTaskSubmit = () => {
    if (!newTitle.trim() || !onAddTask) return
    onAddTask(newTitle.trim(), newDesc.trim())
    setNewTitle("")
    setNewDesc("")
    setAddingTask(false)
    onTaskUpdate?.()
  }

  const handleSaveEdit = () => {
    if (!editingTaskId || !onUpdateTask) return
    onUpdateTask(editingTaskId, { title: editTitle, description: editDesc })
    setEditingTaskId(null)
    onTaskUpdate?.()
  }

  const handleSaveNote = () => {
    if (!noteEditingTaskId || !onAddTaskNote) return
    onAddTaskNote(noteEditingTaskId, noteDraft)
    setNoteEditingTaskId(null)
    onTaskUpdate?.()
  }

  // Drag Handlers
  const handleDragStart = (e: React.DragEvent, task: HabitTask) => {
    setDraggedTask(task)
    e.dataTransfer.effectAllowed = "move"
  }
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }
  const handleDrop = (e: React.DragEvent, target: HabitTask) => {
    e.preventDefault()
    if (!draggedTask || !onReorderTasks || draggedTask.id === target.id) return
    const newOrder = [...tasks]
    const dIdx = newOrder.findIndex(t => t.id === draggedTask.id)
    const tIdx = newOrder.findIndex(t => t.id === target.id)
    if (dIdx === -1 || tIdx === -1) return
    const [removed] = newOrder.splice(dIdx, 1)
    newOrder.splice(tIdx, 0, removed)
    onReorderTasks(newOrder)
    setDraggedTask(null)
  }

  const handleSkipTask = (id: string | number) => {
    onSkipTask?.(id)
    onTaskUpdate?.()
  }

  // Grouped Actions for Child Component
  const taskActions = {
    handleCompleteTask,
    handleDeleteTask,
    handleSkipTask,
    onSuggestContent,
    onDeleteTask,
    onDragStart: handleDragStart,
    onDragOver: handleDragOver,
    onDrop: handleDrop
  }

  return (
    <Card className="border-white/5 bg-black/20 shadow-lg backdrop-blur-sm">
      {/* Header Section */}
      <CardHeader className="pb-4 border-b border-white/5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/5">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDayChange?.(Math.max(1, currentDay - 1))}
                disabled={currentDay <= 1}
                className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"
              >
                <ChevronLeft size={16} />
              </Button>
              <div className="px-3 flex flex-col items-center min-w-[3rem]">
                 <span className="text-[10px] text-zinc-500 uppercase font-bold tracking-wider">Day</span>
                 <span className="text-sm font-bold text-white leading-none">{currentDay}</span>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onDayChange?.(currentDay + 1)}
                className="h-8 w-8 text-zinc-500 hover:text-white hover:bg-white/5"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
            
            <div>
               <CardTitle className="text-lg text-white tracking-tight">Daily Quests</CardTitle>
               <p className="text-xs text-zinc-400">Complete tasks to earn XP & streak.</p>
            </div>
          </div>

          <div className="text-right">
             <div className="text-2xl font-bold text-white tracking-tight">{Math.round(progress)}%</div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-zinc-800/50 rounded-full overflow-hidden">
           <div className="h-full bg-gradient-to-r from-blue-500 to-lime-500 shadow-[0_0_10px_rgba(163,230,53,0.4)] transition-all duration-700 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-0">
        
        {/* Task List */}
        <div className="space-y-3">
          {tasks.length === 0 ? (
            <div className="py-16 flex flex-col items-center justify-center text-center border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
              <div className="h-14 w-14 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-600 mb-4">
                <Calendar size={24} />
              </div>
              <h3 className="text-zinc-300 font-medium">All Clear</h3>
              <p className="text-sm text-zinc-500 max-w-[200px] mt-1">No tasks scheduled for today. Enjoy the break or add a custom task.</p>
            </div>
          ) : (
            tasks.map((task, index) => (
              <TaskItem
                key={task.id}
                index={index}
                task={task}
                isEditing={editingTaskId === task.id}
                isNoteEditing={noteEditingTaskId === task.id}
                noteDraft={noteDraft}
                editTitle={editTitle}
                editDesc={editDesc}
                setEditTitle={setEditTitle}
                setEditDesc={setEditDesc}
                onNoteChange={setNoteDraft}
                onEditStart={() => {
                  setEditingTaskId(task.id)
                  setEditTitle(task.title)
                  setEditDesc(task.description)
                  setNoteEditingTaskId(null)
                }}
                onNoteStart={() => {
                   setNoteEditingTaskId(task.id)
                   setNoteDraft((task.note as string) || "")
                   setEditingTaskId(null)
                }}
                onSaveEdit={handleSaveEdit}
                onCancelEdit={() => setEditingTaskId(null)}
                onSaveNote={handleSaveNote}
                onCancelNote={() => setNoteEditingTaskId(null)}
                actions={taskActions}
              />
            ))
          )}
        </div>

        {/* Add Task Area */}
        {onAddTask && (
          <div className="pt-2">
            {!addingTask ? (
              <Button 
                variant="ghost" 
                onClick={() => setAddingTask(true)}
                className="w-full border border-dashed border-zinc-800 text-zinc-500 hover:text-white hover:bg-white/5 hover:border-zinc-700 h-12 transition-all"
              >
                <Plus size={16} className="mr-2" /> Add Custom Task
              </Button>
            ) : (
              <div className="bg-black/40 border border-white/10 p-4 rounded-xl space-y-3 animate-in fade-in slide-in-from-bottom-2 backdrop-blur-sm">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">New Task</span>
                    <button onClick={() => setAddingTask(false)} className="text-zinc-500 hover:text-white transition-colors"><X size={14}/></button>
                 </div>
                 <Input 
                   autoFocus
                   placeholder="What needs to be done?"
                   value={newTitle}
                   onChange={(e) => setNewTitle(e.target.value)}
                   className="bg-white/5 border-white/10 text-white placeholder:text-zinc-600 focus:border-lime-500/50"
                 />
                 <Textarea 
                   placeholder="Add details (optional)..."
                   value={newDesc}
                   onChange={(e) => setNewDesc(e.target.value)}
                   className="bg-white/5 border-white/10 text-sm min-h-[60px] text-zinc-300 placeholder:text-zinc-600 focus:border-lime-500/50"
                 />
                 <div className="flex justify-end gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setAddingTask(false)} className="text-zinc-400 hover:text-white">Cancel</Button>
                    <Button size="sm" onClick={handleAddTaskSubmit} className="bg-white text-black hover:bg-zinc-200 font-medium">Add Task</Button>
                 </div>
              </div>
            )}
          </div>
        )}

        {/* Success State */}
        {completedCount === totalCount && totalCount > 0 && (
          <div className="relative overflow-hidden rounded-xl border border-lime-500/20 bg-lime-500/5 p-6 text-center">
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-lime-500/50 to-transparent opacity-50" />
             <div className="flex justify-center mb-3">
                <div className="h-12 w-12 bg-lime-500 rounded-full flex items-center justify-center text-black shadow-[0_0_20px_rgba(132,204,22,0.4)]">
                   <CheckCircle2 size={24} />
                </div>
             </div>
             <h3 className="text-lg font-bold text-white mb-1 tracking-tight">Mission Complete!</h3>
             <p className="text-sm text-zinc-400">
               All tasks finished. Your streak is safe at <span className="text-lime-400 font-bold">{streak} days</span>.
             </p>
          </div>
        )}

      </CardContent>
    </Card>
  )
}

export default TaskPanel