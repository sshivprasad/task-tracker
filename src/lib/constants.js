export const STATUS_CONFIG = {
  todo: {
    label: 'To Do',
    color: 'bg-amber-100 text-amber-700 border-amber-300 hover:bg-amber-200',
    dot: 'bg-amber-400',
    border: 'border-l-amber-400',
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200',
    dot: 'bg-blue-400',
    border: 'border-l-blue-400',
  },
  done: {
    label: 'Done',
    color: 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200',
    dot: 'bg-green-400',
    border: 'border-l-green-400',
  },
  carry_forward: {
    label: 'Carry Forward',
    color: 'bg-violet-100 text-violet-700 border-violet-300 hover:bg-violet-200',
    dot: 'bg-violet-400',
    border: 'border-l-violet-400',
  },
  discontinued: {
    label: 'Discontinued',
    color: 'bg-red-100 text-red-400 border-red-200 hover:bg-red-200',
    dot: 'bg-red-300',
    border: 'border-l-red-300',
  },
}

export const PRIORITY_CONFIG = {
  low: { label: 'Low', color: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' },
  medium: { label: 'Medium', color: 'bg-sky-100 text-sky-600', dot: 'bg-sky-400' },
  high: { label: 'High', color: 'bg-orange-100 text-orange-600', dot: 'bg-orange-400' },
}

export const TAG_COLORS = [
  { id: 'violet', label: 'Violet', bg: 'bg-violet-100', text: 'text-violet-700', border: 'border-violet-300' },
  { id: 'teal', label: 'Teal', bg: 'bg-teal-100', text: 'text-teal-700', border: 'border-teal-300' },
  { id: 'orange', label: 'Orange', bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-300' },
  { id: 'pink', label: 'Pink', bg: 'bg-pink-100', text: 'text-pink-700', border: 'border-pink-300' },
  { id: 'cyan', label: 'Cyan', bg: 'bg-cyan-100', text: 'text-cyan-700', border: 'border-cyan-300' },
  { id: 'yellow', label: 'Yellow', bg: 'bg-yellow-100', text: 'text-yellow-700', border: 'border-yellow-300' },
  { id: 'green', label: 'Green', bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' },
  { id: 'blue', label: 'Blue', bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' },
]
