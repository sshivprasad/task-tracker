import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { PRIORITY_CONFIG, TAG_COLORS } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function AddTaskDialog({ open, onClose, onAdd, type }) {
  const [title, setTitle] = useState('')
  const [notes, setNotes] = useState('')
  const [priority, setPriority] = useState('medium')
  const [tags, setTags] = useState([])

  function reset() {
    setTitle('')
    setNotes('')
    setPriority('medium')
    setTags([])
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    await onAdd({ title: title.trim(), notes, priority, tags })
    reset()
    onClose()
  }

  function handleClose() {
    reset()
    onClose()
  }

  function toggleTag(id) {
    setTags(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {type === 'planned' ? 'Add Planned Task' : 'Add Unplanned Task'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Title *</label>
            <Input
              autoFocus
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              className="text-sm"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Notes</label>
            <Textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Any details, context, or links…"
              rows={3}
              className="text-sm resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Priority</label>
            <div className="flex gap-2">
              {Object.entries(PRIORITY_CONFIG).map(([key, cfg]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPriority(key)}
                  className={cn(
                    'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full border transition-all',
                    cfg.color,
                    priority === key
                      ? 'ring-2 ring-offset-1 ring-violet-400 opacity-100'
                      : 'opacity-50 hover:opacity-80'
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full', cfg.dot)} />
                  {cfg.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Tags</label>
            <div className="flex flex-wrap gap-1.5">
              {TAG_COLORS.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    'text-xs px-2.5 py-1 rounded-full border font-medium transition-all',
                    tag.bg, tag.text, tag.border,
                    tags.includes(tag.id)
                      ? 'ring-2 ring-offset-1 ring-violet-400 opacity-100'
                      : 'opacity-50 hover:opacity-80'
                  )}
                >
                  {tag.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button type="submit" disabled={!title.trim()} className="flex-1">
              Add Task
            </Button>
            <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
