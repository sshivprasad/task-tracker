import { useState } from 'react'
import { Phone, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { addCall, updateCall, deleteCall } from '@/db'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

function CallCard({ dayId, call }) {
  const [expanded, setExpanded] = useState(false)
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ title: call.title, time: call.time || '', participants: call.participants || '', notes: call.notes || '' })

  async function save() {
    await updateCall(dayId, call.id, form)
    setEditing(false)
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 border-l-4 border-l-sky-400 shadow-sm">
      <div className="flex items-center gap-3 p-3">
        <Phone size={14} className="shrink-0 text-sky-500" />
        {editing ? (
          <Input
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            className="h-7 text-sm"
            autoFocus
          />
        ) : (
          <p
            className="flex-1 text-sm font-medium cursor-text"
            onClick={() => setEditing(true)}
          >
            {call.title}
            {call.time && <span className="ml-2 text-xs text-slate-400">{call.time}</span>}
          </p>
        )}
        <button onClick={() => setExpanded(v => !v)} className="text-slate-400 hover:text-slate-600">
          {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
        <button onClick={() => deleteCall(dayId, call.id)} className="text-slate-400 hover:text-red-500">
          <Trash2 size={14} />
        </button>
      </div>

      {expanded && (
        <div className="px-3 pb-3 space-y-2 border-t border-slate-100 pt-2">
          {editing ? (
            <>
              <Input
                value={form.time}
                onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
                placeholder="Time (e.g. 10:00 AM)"
                className="h-7 text-sm"
              />
              <Input
                value={form.participants}
                onChange={e => setForm(f => ({ ...f, participants: e.target.value }))}
                placeholder="Participants"
                className="h-7 text-sm"
              />
              <Textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Notes from the call..."
                rows={3}
                className="text-sm resize-none"
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={save}>Save</Button>
                <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </>
          ) : (
            <div className="text-xs text-slate-500 space-y-1 cursor-pointer" onClick={() => setEditing(true)}>
              {call.participants && <p><span className="font-medium text-slate-600">With:</span> {call.participants}</p>}
              {call.notes
                ? <p className="whitespace-pre-wrap">{call.notes}</p>
                : <p className="italic text-slate-300">Click to add participants & notes…</p>
              }
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function CallsLog({ dayId, dayLog }) {
  const [adding, setAdding] = useState(false)
  const [form, setForm] = useState({ title: '', time: '' })

  async function handleAdd() {
    if (!form.title.trim()) return
    await addCall(dayId, { title: form.title.trim(), time: form.time.trim(), participants: '', notes: '' })
    setForm({ title: '', time: '' })
    setAdding(false)
  }

  const calls = dayLog?.calls || []

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
          <h2 className="text-sm font-semibold tracking-wide uppercase text-sky-600">Calls</h2>
          {calls.length > 0 && (
            <span className="text-xs text-muted-foreground bg-slate-100 rounded-full px-2 py-0.5">
              {calls.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setAdding(true)}
          className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg text-sky-500 hover:text-sky-700 hover:bg-sky-50 transition-colors"
        >
          <Plus size={13} /> Add
        </button>
      </div>

      {calls.length === 0 && !adding && (
        <p className="text-sm text-slate-400 italic py-2 pl-4">No calls logged yet…</p>
      )}

      <div className="space-y-2">
        {calls.map(call => (
          <CallCard key={call.id} dayId={dayId} call={call} />
        ))}
      </div>

      {adding && (
        <div className={cn('flex gap-2 items-center animate-fade-in-up')}>
          <Input
            autoFocus
            value={form.title}
            onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
            onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') setAdding(false) }}
            placeholder="Call title…"
            className="text-sm"
          />
          <Input
            value={form.time}
            onChange={e => setForm(f => ({ ...f, time: e.target.value }))}
            placeholder="Time"
            className="text-sm w-28"
          />
          <Button size="sm" onClick={handleAdd} className="shrink-0">Add</Button>
          <Button size="sm" variant="ghost" onClick={() => setAdding(false)} className="shrink-0">Cancel</Button>
        </div>
      )}
    </section>
  )
}
