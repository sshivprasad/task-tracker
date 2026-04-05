import { useParams } from 'react-router-dom'
import DayHeader from '@/components/DayHeader'
import TaskSection from '@/components/TaskSection'
import CallsLog from '@/components/CallsLog'
import NotesPanel from '@/components/NotesPanel'
import { useDayTasks } from '@/hooks/useDay'
import { addTask, updateDayLog } from '@/db'

export default function DayView() {
  const { date } = useParams()
  const { plannedTasks, unplannedTasks, dayLog, completionScore } = useDayTasks(date)

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <DayHeader date={date} completionScore={completionScore} />

      <TaskSection
        title="Planned Tasks"
        type="planned"
        tasks={plannedTasks}
        onAddTask={fields => addTask(date, fields, 'planned')}
        emptyMessage="What do you plan to accomplish today?"
        accent="violet"
      />

      <TaskSection
        title="Unplanned"
        type="unplanned"
        tasks={unplannedTasks}
        onAddTask={fields => addTask(date, fields, 'unplanned')}
        emptyMessage="Tasks that came up during the day…"
        accent="teal"
      />

      <CallsLog dayId={date} dayLog={dayLog} />

      <NotesPanel
        dayId={date}
        dayLog={dayLog}
        onUpdate={changes => updateDayLog(date, changes)}
      />

      <div className="h-10" />
    </div>
  )
}
