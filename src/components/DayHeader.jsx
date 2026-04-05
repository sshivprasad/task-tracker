import { format, parseISO, isToday } from 'date-fns'

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export default function DayHeader({ date, completionScore }) {
  const parsed = parseISO(date)
  const isCurrentDay = isToday(parsed)
  const dayName = format(parsed, 'EEEE')
  const dayDate = format(parsed, 'MMMM d, yyyy')

  const strokeDash = (completionScore / 100) * CIRCUMFERENCE
  const scoreColor =
    completionScore === 100 ? '#22c55e' :
    completionScore >= 50  ? '#3b82f6' :
    completionScore > 0    ? '#f59e0b' :
    '#e2e8f0'

  return (
    <div className="flex items-center justify-between pb-4 border-b border-slate-200">
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-slate-800">{dayName}</h1>
          {isCurrentDay && (
            <span className="text-xs font-semibold bg-violet-100 text-violet-600 px-2 py-0.5 rounded-full">
              Today
            </span>
          )}
        </div>
        <p className="text-sm text-slate-500 mt-0.5">{dayDate}</p>
      </div>

      {/* Completion ring */}
      <div className="flex items-center gap-3">
        <div className="text-right">
          <p className="text-2xl font-bold text-slate-800">{completionScore}%</p>
          <p className="text-xs text-slate-400">complete</p>
        </div>
        <div className="relative w-14 h-14">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 50 50">
            <circle
              cx="25" cy="25" r={RADIUS}
              fill="none" stroke="#f1f5f9" strokeWidth="4"
            />
            <circle
              cx="25" cy="25" r={RADIUS}
              fill="none"
              stroke={scoreColor}
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={`${strokeDash} ${CIRCUMFERENCE}`}
              style={{ transition: 'stroke-dasharray 0.5s ease' }}
            />
          </svg>
          {completionScore === 100 && (
            <span className="absolute inset-0 flex items-center justify-center text-lg">
              🎉
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
