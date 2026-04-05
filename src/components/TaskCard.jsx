import { useState, useRef, useEffect } from 'react'
import { Trash2, ChevronDown, ChevronUp, Plus, Check, X } from 'lucide-react'
import { updateTask, deleteTask } from '@/db'
import { STATUS_CONFIG, PRIORITY_CONFIG } from '@/lib/constants'
import { cn } from '@/lib/utils'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
function SubtaskItem({ subtask, onToggle, onDelete, onRename }) {
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(subtask.title)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) inputRef.current.focus()
  }, [editing])

  function handleBlur() {
    setEditing(false)
    const trimmed = value.trim()
    if (trimmed && trimmed !== subtask.title) onRename(subtask.id, trimmed)
    else setValue(subtask.title)
  }

  return (
    <div className="group/sub flex items-center gap-2 py-0.5">
      <button
        onClick={() => onToggle(subtask.id)}
        className={cn(
          'w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-all duration-150',
          subtask.done
            ? 'bg-green-400 border-green-400 text-white'
            : 'border-slate-300 hover:border-green-400'
        )}
      >
        {subtask.done && <Check size={9} strokeWidth={3} />}
      </button>

      {editing ? (
        <input
          ref={inputRef}
          value={value}
          onChange={e => setValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={e => { if (e.key === 'Enter') handleBlur(); if (e.key === 'Escape') { setValue(subtask.title); setEditing(false) } }}
          className="flex-1 text-xs bg-transparent border-b border-violet-300 outline-none py-0.5"
        />
      ) : (
        <span
          onClick={() => setEditing(true)}
          className={cn(
            'flex-1 text-xs cursor-text select-none',
            subtask.done ? 'line-through text-slate-400' : 'text-slate-600'
          )}
        >
          {subtask.title}
        </span>
      )}

      <button
        onClick={() => onDelete(subtask.id)}
        className="opacity-0 group-hover/sub:opacity-100 transition-opacity text-slate-300 hover:text-red-400 shrink-0"
      >
        <X size={11} />
      </button>
    </div>
  )
}

export default function TaskCard({ task }) {
  const [expanded, setExpanded] = useState(false)
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleValue, setTitleValue] = useState(task.title)
  const [editingNotes, setEditingNotes] = useState(false)
  const [notesValue, setNotesValue] = useState(task.notes || '')
  const [justDone, setJustDone] = useState(false)
  const [addingSubtask, setAddingSubtask] = useState(false)
  const [newSubtask, setNewSubtask] = useState('')
  const titleRef = useRef(null)
  const subtaskInputRef = useRef(null)

  useEffect(() => { setTitleValue(task.title) }, [task.title])
  useEffect(() => { setNotesValue(task.notes || '') }, [task.notes])
  useEffect(() => {
    if (editingTitle && titleRef.current) titleRef.current.focus()
  }, [editingTitle])
  useEffect(() => {
    if (addingSubtask && subtaskInputRef.current) subtaskInputRef.current.focus()
  }, [addingSubtask])

  const subtasks = task.subtasks || []
  const doneCount = subtasks.filter(s => s.done).length

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

  async function handleAddSubtask() {
    const trimmed = newSubtask.trim()
    if (!trimmed) { setAddingSubtask(false); return }
    const updated = [...subtasks, { id: crypto.randomUUID(), title: trimmed, done: false }]
    await updateTask(task.id, { subtasks: updated })
    setNewSubtask('')
    setAddingSubtask(false)
  }

  async function handleToggleSubtask(id) {
    const updated = subtasks.map(s => s.id === id ? { ...s, done: !s.done } : s)
    await updateTask(task.id, { subtasks: updated })
  }

  async function handleDeleteSubtask(id) {
    await updateTask(task.id, { subtasks: subtasks.filter(s => s.id !== id) })
  }

  async function handleRenameSubtask(id, title) {
    await updateTask(task.id, { subtasks: subtasks.map(s => s.id === id ? { ...s, title } : s) })
  }

  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo
  const priority = PRIORITY_CONFIG[task.priority] || PRIORITY_CONFIG.medium
  const isDiscontinued = task.status === 'discontinued'

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
          <DropdownMenuTrigger
            className={cn(
              'mt-0.5 shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border cursor-pointer',
              'transition-colors whitespace-nowrap focus:outline-none',
              status.color
            )}
          >
            {status.label}
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

          {/* Subtask count badge (collapsed) */}
          {subtasks.length > 0 && !expanded && (
            <button
              onClick={() => setExpanded(true)}
              className="mt-1.5 flex items-center gap-1 text-xs text-slate-400 hover:text-violet-500 transition-colors"
            >
              <span className={cn(
                'inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full font-medium',
                doneCount === subtasks.length
                  ? 'bg-green-100 text-green-600'
                  : 'bg-slate-100 text-slate-500'
              )}>
                <Check size={9} strokeWidth={3} />
                {doneCount}/{subtasks.length}
              </span>
              <span className="text-slate-300">subtasks</span>
            </button>
          )}
        </div>

        {/* Priority */}
        <DropdownMenu>
          <DropdownMenuTrigger className="shrink-0 mt-0.5 focus:outline-none" title={`Priority: ${priority.label}`}>
            <span className={cn('w-2.5 h-2.5 rounded-full block border border-white shadow-sm', priority.dot)} />
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

      {/* Expanded panel */}
      {expanded && (
        <div className="px-3 pb-3 border-t border-slate-100 pt-2 space-y-3">

          {/* Subtasks */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">Subtasks</p>
              <button
                onClick={() => setAddingSubtask(true)}
                className="flex items-center gap-0.5 text-xs text-violet-400 hover:text-violet-600 transition-colors"
              >
                <Plus size={11} /> Add
              </button>
            </div>

            {subtasks.length === 0 && !addingSubtask && (
              <p className="text-xs text-slate-300 italic">No subtasks yet</p>
            )}

            <div className="space-y-0.5">
              {subtasks.map(sub => (
                <SubtaskItem
                  key={sub.id}
                  subtask={sub}
                  onToggle={handleToggleSubtask}
                  onDelete={handleDeleteSubtask}
                  onRename={handleRenameSubtask}
                />
              ))}
            </div>

            {addingSubtask && (
              <div className="flex items-center gap-2 mt-1.5">
                <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                <input
                  ref={subtaskInputRef}
                  value={newSubtask}
                  onChange={e => setNewSubtask(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddSubtask(); if (e.key === 'Escape') { setAddingSubtask(false); setNewSubtask('') } }}
                  onBlur={handleAddSubtask}
                  placeholder="Subtask title… (Enter to save)"
                  className="flex-1 text-xs bg-transparent border-b border-violet-300 outline-none py-0.5 text-slate-600 placeholder:text-slate-300"
                />
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1.5">Notes</p>
            {editingNotes ? (
              <textarea
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
        </div>
      )}
    </div>
  )
}
