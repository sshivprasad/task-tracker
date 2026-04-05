import { useState } from 'react'
import { Plus } from 'lucide-react'
import TaskCard from './TaskCard'
import AddTaskDialog from './AddTaskDialog'
import { cn } from '@/lib/utils'

export default function TaskSection({ title, type, tasks, onAddTask, emptyMessage, accent = 'violet' }) {
  const [dialogOpen, setDialogOpen] = useState(false)

  async function handleAdd(fields) {
    await onAddTask(fields)
  }

  const accentMap = {
    violet: { header: 'text-violet-600', dot: 'bg-violet-400', button: 'text-violet-500 hover:text-violet-700 hover:bg-violet-50' },
    teal:   { header: 'text-teal-600',   dot: 'bg-teal-400',   button: 'text-teal-500   hover:text-teal-700   hover:bg-teal-50'   },
  }
  const colors = accentMap[accent] || accentMap.violet

  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={cn('w-2.5 h-2.5 rounded-full', colors.dot)} />
          <h2 className={cn('text-sm font-semibold tracking-wide uppercase', colors.header)}>
            {title}
          </h2>
          {tasks.length > 0 && (
            <span className="text-xs text-muted-foreground bg-slate-100 rounded-full px-2 py-0.5">
              {tasks.length}
            </span>
          )}
        </div>
        <button
          onClick={() => setDialogOpen(true)}
          className={cn('flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-lg transition-colors', colors.button)}
        >
          <Plus size={13} /> Add
        </button>
      </div>

      {tasks.length === 0 && (
        <p className="text-sm text-slate-400 italic py-2 pl-4">{emptyMessage}</p>
      )}

      <div className="space-y-2">
        {tasks.map(task => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>

      <AddTaskDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onAdd={handleAdd}
        type={type}
      />
    </section>
  )
}
