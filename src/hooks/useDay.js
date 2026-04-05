import { useEffect } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, getOrCreateWorkday, getOrCreateDayLog } from '@/db'

export function useDayTasks(dayId) {
  useEffect(() => {
    if (dayId) {
      getOrCreateWorkday(dayId)
      getOrCreateDayLog(dayId)
    }
  }, [dayId])

  const tasks = useLiveQuery(
    () => dayId ? db.tasks.where('dayId').equals(dayId).toArray() : [],
    [dayId],
    []
  )

  // Pure read - creation is handled in the useEffect above
  const dayLog = useLiveQuery(
    () => dayId ? db.day_logs.get(dayId) : null,
    [dayId],
    null
  )

  const plannedTasks = tasks?.filter(t => t.type === 'planned') ?? []
  const unplannedTasks = tasks?.filter(t => t.type === 'unplanned') ?? []

  const doneTasks = tasks?.filter(t => t.status === 'done').length ?? 0
  const totalActiveTasks = tasks?.filter(t => t.status !== 'discontinued').length ?? 0
  const completionScore = totalActiveTasks > 0 ? Math.round((doneTasks / totalActiveTasks) * 100) : 0

  return { tasks, plannedTasks, unplannedTasks, dayLog, completionScore }
}
