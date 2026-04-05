import Dexie from 'dexie'
import { format, subDays, parseISO } from 'date-fns'

export const db = new Dexie('WorkTracker')

db.version(1).stores({
  workdays: 'id, date',
  tasks: '++id, dayId, status, type, createdAt',
  day_logs: 'dayId',
})

export async function getOrCreateWorkday(dateStr) {
  let workday = await db.workdays.get(dateStr)
  if (!workday) {
    try {
      const prevDateStr = format(subDays(parseISO(dateStr), 1), 'yyyy-MM-dd')
      const carryForwardTasks = await db.tasks
        .where('dayId').equals(prevDateStr)
        .filter(t => t.status === 'carry_forward')
        .toArray()

      await db.workdays.add({ id: dateStr, date: new Date(dateStr) })

      for (const task of carryForwardTasks) {
        const { id: _id, ...rest } = task
        await db.tasks.add({
          ...rest,
          dayId: dateStr,
          status: 'todo',
          type: 'planned',
          createdAt: new Date(),
          updatedAt: new Date(),
          carriedFrom: prevDateStr,
        })
      }
    } catch (e) {
      // Another call already created the record - that's fine
      if (!e.name?.includes('Constraint')) throw e
    }

    workday = await db.workdays.get(dateStr)
  }
  return workday
}

export async function getOrCreateDayLog(dayId) {
  let log = await db.day_logs.get(dayId)
  if (!log) {
    try {
      await db.day_logs.add({ dayId, calls: [], discussions: '', generalNotes: '' })
    } catch (e) {
      if (!e.name?.includes('Constraint')) throw e
    }
    log = await db.day_logs.get(dayId)
  }
  return log
}

export async function addTask(dayId, fields, type = 'planned') {
  await getOrCreateWorkday(dayId)
  const { title, notes = '', priority = 'medium', tags = [] } =
    typeof fields === 'string' ? { title: fields } : fields
  return db.tasks.add({
    dayId,
    title,
    type,
    status: 'todo',
    priority,
    tags,
    notes,
    createdAt: new Date(),
    updatedAt: new Date(),
  })
}

export async function updateTask(id, changes) {
  return db.tasks.update(id, { ...changes, updatedAt: new Date() })
}

export async function deleteTask(id) {
  return db.tasks.delete(id)
}

export async function updateDayLog(dayId, changes) {
  const existing = await db.day_logs.get(dayId)
  if (existing) {
    return db.day_logs.update(dayId, changes)
  }
  return db.day_logs.add({ dayId, calls: [], discussions: '', generalNotes: '', ...changes })
}

export async function addCall(dayId, call) {
  const log = await getOrCreateDayLog(dayId)
  const calls = [...(log.calls || []), { ...call, id: crypto.randomUUID() }]
  return updateDayLog(dayId, { calls })
}

export async function updateCall(dayId, callId, changes) {
  const log = await getOrCreateDayLog(dayId)
  const calls = (log.calls || []).map(c => c.id === callId ? { ...c, ...changes } : c)
  return updateDayLog(dayId, { calls })
}

export async function deleteCall(dayId, callId) {
  const log = await getOrCreateDayLog(dayId)
  const calls = (log.calls || []).filter(c => c.id !== callId)
  return updateDayLog(dayId, { calls })
}

export async function computeStreak() {
  const allWorkdays = await db.workdays.orderBy('id').reverse().toArray()
  if (!allWorkdays.length) return 0

  let streak = 0
  let checkDate = format(new Date(), 'yyyy-MM-dd')

  for (const day of allWorkdays) {
    if (day.id === checkDate) {
      streak++
      checkDate = format(subDays(parseISO(checkDate), 1), 'yyyy-MM-dd')
    } else {
      break
    }
  }
  return streak
}

export async function exportAllData() {
  const [workdays, tasks, day_logs] = await Promise.all([
    db.workdays.toArray(),
    db.tasks.toArray(),
    db.day_logs.toArray(),
  ])
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    workdays,
    tasks,
    day_logs,
  }
}

export async function importAllData(data) {
  await db.transaction('rw', db.workdays, db.tasks, db.day_logs, async () => {
    await db.workdays.clear()
    await db.tasks.clear()
    await db.day_logs.clear()
    if (data.workdays?.length) await db.workdays.bulkPut(data.workdays)
    if (data.tasks?.length) await db.tasks.bulkPut(data.tasks)
    if (data.day_logs?.length) await db.day_logs.bulkPut(data.day_logs)
  })
}
