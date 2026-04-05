import { useState } from 'react'
import { MessageSquare, FileText } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

const TABS = [
  { id: 'discussions', label: 'Discussions', icon: MessageSquare, placeholder: 'Key points, decisions, outcomes from discussions today…' },
  { id: 'generalNotes', label: 'Notes', icon: FileText, placeholder: 'General notes, reminders, anything else…' },
]

export default function NotesPanel({ dayId, dayLog, onUpdate }) {
  const [activeTab, setActiveTab] = useState('discussions')

  const tab = TABS.find(t => t.id === activeTab)
  const value = dayLog?.[activeTab] || ''

  function handleChange(e) {
    onUpdate({ [activeTab]: e.target.value })
  }

  return (
    <section className="space-y-3">
      <div className="flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
        <h2 className="text-sm font-semibold tracking-wide uppercase text-amber-600">Notes</h2>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        {TABS.map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-md transition-all',
                activeTab === t.id
                  ? 'bg-white shadow-sm text-slate-800'
                  : 'text-slate-500 hover:text-slate-700'
              )}
            >
              <Icon size={12} />
              {t.label}
            </button>
          )
        })}
      </div>

      <Textarea
        key={activeTab}
        value={value}
        onChange={handleChange}
        placeholder={tab.placeholder}
        rows={5}
        className="text-sm resize-none bg-white"
      />
    </section>
  )
}
