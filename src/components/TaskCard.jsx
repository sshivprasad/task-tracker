import { useState, useRef, useEffect } from 'react'
import { Trash2, ChevronDown, ChevronUp, Tag } from 'lucide-react'
import { updateTask, deleteTask } from '@/db'
import { STATUS_CONFIG, PRIORITY_CONFIG, TAG_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
export default function TaskCard({ task }) {
  const [expanded, setExpanded] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(task.title)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState(task.notes || '')
  const [justDone, setJustDone] = useState(false)
  const titleRef = useRef(null)
  const notesRef = useRef(null)

  useEffect(() => { setTitleValue(task.title) }, [task.title])
  useEffect(() => { setNotesValue(task.notes || '') }, [task.notes])

  useEffect(() => {
    if (editingTitle && titleRef.current) titleRef.current.focus()
  }, [editingTitle])

  async function handleStatusChange(status) {
    if (status === 'done' && task.status !== 'done') {
      setJustDone(true)
      setTimeout(() => setJustDone(false), 400)
    }
    await updateTask(task.id, { status })
  }

  async function handleTitleBlur() {
    setEditingTitle(false)
    if (titleValue.trim() && titleValue.trim() !== task.title) {
      await updateTask(task.id, { title: titleValue.trim() })
    } else {
      setTitleValue(task.title)
    }
  }

  async function handleNotesBlur() {
    setEditingNotes(false)
    if (notesValue !== task.notes) {
      await updateTask(task.id, { notes: notesValue })
    }
  }

  async function handlePriorityChange(priority) {
    await updateTask(task.id, { priority })
  }

  async function handleTagToggle(tagId) {
    const current = task.tags || []
    const tags = current.includes(tagId)
      ? current.filter(t => t !== tagId)
      : [...current, tagId]
    await updateTask(task.id, { tags })
  }

  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
  const isDiscontinued = task.status === 'discontinued'
  const activeTags = TAG_COLORS.filter(t => task.tags?.includes(t.id))

  return (
    <div
      className={cn(
        'group bg-white rounded-xl border border-slate-200 border-l-4 shadow-sm',
        'transition-all duration-200 hover:shadow-md animate-fade-in-up',
        status.border,
        justDone && 'animate-task-done',
        isDiscontinued && 'opacity-60'
      )}
    >
      <div className="flex items-start gap-3 p-3">
        {/* Status badge */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={cn(
                'mt-0.5 shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border cursor-pointer',
                'transition-colors whitespace-nowrap',
                status.color
              )}
            >
              {status.label}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <DropdownMenuItem
                key={key}
                onClick={() => handleStatusChange(key)}
                className="cursor-pointer gap-2"
              >
                <span className={cn('w-2 h-2 rounded-full shrink-0', cfg.dot)} />
                {cfg.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Title */}
        <div className="flex-1 min-w-0">
          {editingTitle ? (
            <input
              ref={titleRef}
              value={titleValue}
              onChange={e => setTitleValue(e.target.value)}
              onBlur={handleTitleBlur}
              onKeyDown={e => { if (e.key === 'Enter') handleTitleBlur() }}
              className="w-full text-sm font-medium bg-transparent border-b border-violet-300 outline-none py-0.5"
            />
          ) : (
            <p
              className={cn(
                'text-sm font-medium cursor-text leading-snug',
                isDiscontinued && 'line-through text-slate-400',
                task.carriedFrom && 'italic'
              )}
              onClick={() => setEditingTitle(true)}
              title="Click to edit"
            >
              {task.title}
              {task.carriedFrom && (
                <span className="ml-1.5 text-xs text-violet-400 font-normal not-italic">↩ carried</span>
              )}
            </p>
          )}

          {/* Tags */}
          {activeTags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1.5">
              {activeTags.map(tag => (
                <span
                  key={tag.id}
                  className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full border font-medium',
                    tag.bg, tag.text, tag.border
                  )}
                >
                  {tag.label}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Priority */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="shrink-0 mt-0.5">
              <span
                className={cn('w-2.5 h-2.5 rounded-full block border border-white shadow-sm', priority.dot)}
                title={`Priority: ${priority.label}`}
              />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
              <DropdownMenuItem key={key} onClick={() => handlePriorityChange(key)} className="cursor-pointer gap-2">
                <span className={cn('w-2 h-2 rounded-full shrink-0', cfg.dot)} />
                {cfg.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Tag picker */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-violet-500">
              <Tag size={14} />
            </button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-48 p-2">
            <p className="text-xs text-muted-foreground mb-2 font-medium">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {TAG_COLORS.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => handleTagToggle(tag.id)}
                  className={cn(
                    'text-xs px-2 py-0.5 rounded-full border font-medium transition-all',
                    tag.bg, tag.text, tag.border,
                    task.tags?.includes(tag.id) ? 'ring-2 ring-offset-1 ring-violet-400' : 'opacity-60 hover:opacity-100'
                  )}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        {/* Expand / delete */}
        <button
          onClick={() => setExpanded(v => !v)}
          className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-slate-600"
        >
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>

        <button
          onClick={() => deleteTask(task.id)}
          className="shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-slate-400 hover:text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {/* Expanded notes */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-slate-100 pt-2">
          {editingNotes ? (
            <textarea
              ref={notesRef}
              value={notesValue}
              onChange={e => setNotesValue(e.target.value)}
              onBlur={handleNotesBlur}
              autoFocus
              rows={3}
              placeholder="Add notes..."
              className="w-full text-xs text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-200 outline-none resize-none focus:border-violet-300"
            />
          ) : (
            <p
              className="text-xs text-slate-500 cursor-text min-h-[2rem] rounded-lg p-2 hover:bg-slate-50"
              onClick={() => setEditingNotes(true)}
            >
              {notesValue || <span className="italic text-slate-300">Add notes...</span>}
            </p>
          )}
        </div>
      )}
    </div>
  )
}
