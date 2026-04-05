import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { format, parseISO, isToday, subDays, isFuture } from 'date-fns'
import { useLiveQuery } from 'dexie-react-hooks'
import { CalendarDays, Flame, Download, ChevronLeft, ChevronRight } from 'lucide-react'
import { db, computeStreak } from '@/db'
import { cn } from '@/lib/utils'
import ExportImport from './ExportImport'

function DayRow({ dateStr, isSelected, onClick }) {
  const parsed = parseISO(dateStr)
  const label = isToday(parsed) ? 'Today' : format(parsed, 'EEE, MMM d')

  const tasks = useLiveQuery(
    () => db.tasks.where('dayId').equals(dateStr).toArray(),
    [dateStr],
    []
  )

  const done = tasks?.filter(t => t.status === 'done').length ?? 0
  const total = tasks?.filter(t => t.status !== 'discontinued').length ?? 0
  const pct = total > 0 ? Math.round((done / total) * 100) : 0

  const dotColor =
    total === 0   ? 'bg-slate-200' :
    pct === 100   ? 'bg-green-400' :
    pct >= 50     ? 'bg-blue-400'  :
    pct > 0       ? 'bg-amber-400' :
    'bg-slate-300'

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-all',
        isSelected
          ? 'bg-violet-100 text-violet-800 font-medium'
          : 'text-slate-600 hover:bg-slate-100'
      )}
    >
      <span className={cn('w-2 h-2 rounded-full shrink-0', dotColor)} />
      <span className="flex-1 text-sm">{label}</span>
      {total > 0 && (
        <span className="text-xs text-slate-400">{done}/{total}</span>
      )}
    </button>
  )
}

export default function Sidebar() {
  const navigate = useNavigate()
  const { date: currentDate } = useParams()
  const [exportOpen, setExportOpen] = useState(false)
  const [weekOffset, setWeekOffset] = useState(0)

  const streak = useLiveQuery(() => computeStreak(), [], 0)

  const today = format(new Date(), 'yyyy-MM-dd')
  const baseDate = subDays(new Date(), weekOffset * 7)

  const days = Array.from({ length: 14 }, (_, i) => {
    const d = subDays(baseDate, i)
    return format(d, 'yyyy-MM-dd')
  }).filter(d => !isFuture(parseISO(d)))

  return (
    <>
      <aside className="w-60 shrink-0 h-screen flex flex-col bg-white border-r border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-violet-500 flex items-center justify-center">
              <CalendarDays size={16} className="text-white" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">Work Tracker</p>
              <p className="text-xs text-slate-400">Daily Journal</p>
            </div>
          </div>
        </div>

        {/* Streak */}
        {streak > 0 && (
          <div className="mx-3 mt-3 flex items-center gap-2 px-3 py-2 bg-orange-50 rounded-lg border border-orange-100">
            <Flame size={15} className="text-orange-400" />
            <p className="text-sm font-medium text-orange-600">
              {streak} day streak!
            </p>
          </div>
        )}

        {/* Today button */}
        <div className="px-3 pt-3">
          <button
            onClick={() => navigate(`/day/${today}`)}
            className={cn(
              'w-full text-sm font-medium py-2 px-3 rounded-lg transition-colors',
              currentDate === today
                ? 'bg-violet-500 text-white'
                : 'bg-violet-50 text-violet-600 hover:bg-violet-100'
            )}
          >
            Go to Today
          </button>
        </div>

        {/* Day list */}
        <div className="flex-1 overflow-y-auto px-2 py-2">
          <div className="flex items-center justify-between px-1 mb-1">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">Recent Days</p>
            <div className="flex items-center">
              <button
                onClick={() => setWeekOffset(o => o + 1)}
                className="p-0.5 text-slate-400 hover:text-slate-600"
              >
                <ChevronLeft size={13} />
              </button>
              <button
                onClick={() => setWeekOffset(o => Math.max(0, o - 1))}
                disabled={weekOffset === 0}
                className="p-0.5 text-slate-400 hover:text-slate-600 disabled:opacity-30"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
          <div className="space-y-0.5">
            {days.map(d => (
              <DayRow
                key={d}
                dateStr={d}
                isSelected={currentDate === d}
                onClick={() => navigate(`/day/${d}`)}
              />
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-100">
          <button
            onClick={() => setExportOpen(true)}
            className="w-full flex items-center gap-2 text-sm text-slate-500 hover:text-violet-600 px-3 py-2 rounded-lg hover:bg-violet-50 transition-colors"
          >
            <Download size={14} />
            Export / Import
          </button>
        </div>
      </aside>

      <ExportImport open={exportOpen} onClose={() => setExportOpen(false)} />
    </>
  )
}
