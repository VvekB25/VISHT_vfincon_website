import { complianceClockSettings, complianceDeadlines } from './complianceDeadlines.js'

const DAY_MS = 24 * 60 * 60 * 1000

function getIndiaDateParts(date) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: complianceClockSettings.timeZone,
    year: 'numeric', month: '2-digit', day: '2-digit',
  }).formatToParts(date)
  return Object.fromEntries(parts.filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, Number(value)]))
}

function getOrdinal(isoDate) {
  const [year, month, day] = isoDate.split('-').map(Number)
  return Date.UTC(year, month - 1, day) / DAY_MS
}

function makeIsoDate(year, month, day) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

export function getComplianceOccurrences(now = new Date(), deadlines = complianceDeadlines) {
  const { year, month, day } = getIndiaDateParts(now)
  const todayOrdinal = getOrdinal(makeIsoDate(year, month, day))
  const occurrences = []

  for (const deadline of deadlines) {
    if (deadline.recurrence.type === 'monthly') {
      for (let offset = -1; offset <= 4; offset += 1) {
        const date = new Date(Date.UTC(year, month - 1 + offset, 1))
        const dueYear = date.getUTCFullYear()
        const dueMonth = date.getUTCMonth() + 1
        const periodDate = new Date(Date.UTC(dueYear, dueMonth - 2, 1))
        const exception = deadline.recurrence.exceptions?.find((item) => item.month === dueMonth && item.periodMonth === periodDate.getUTCMonth() + 1)
        const dueDate = makeIsoDate(dueYear, dueMonth, exception?.day || deadline.recurrence.day)
        const daysRemaining = getOrdinal(dueDate) - todayOrdinal
        occurrences.push({
          ...deadline,
          dueDate,
          daysRemaining,
          periodLabel: `For ${new Intl.DateTimeFormat('en-IN', { month: 'long', timeZone: complianceClockSettings.timeZone }).format(periodDate)}`,
        })
      }
    }

    if (deadline.recurrence.type === 'quarterly') {
      for (let dueYear = year - 1; dueYear <= year + 1; dueYear += 1) {
        for (const date of deadline.recurrence.dates) {
          const dueDate = makeIsoDate(dueYear, date.month, date.day)
          const daysRemaining = getOrdinal(dueDate) - todayOrdinal
          occurrences.push({ ...deadline, dueDate, daysRemaining, periodLabel: date.period })
        }
      }
    }
  }

  return occurrences
    .filter(({ daysRemaining }) => daysRemaining >= -complianceClockSettings.lookBackDays && daysRemaining <= complianceClockSettings.lookAheadDays)
    .map((item) => ({ ...item, status: item.daysRemaining < 0 ? 'overdue' : item.daysRemaining === 0 ? 'today' : 'upcoming' }))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate) || a.title.localeCompare(b.title))
}

export function getNextIndiaMidnightDelay(now) {
  const { year, month, day } = getIndiaDateParts(now)
  const nextMidnightUtc = Date.UTC(year, month - 1, day + 1) - (5.5 * 60 * 60 * 1000)
  return Math.max(1000, nextMidnightUtc - now.getTime())
}

export function formatComplianceDate(isoDate) {
  return new Intl.DateTimeFormat('en-IN', {
    timeZone: complianceClockSettings.timeZone,
    day: '2-digit', month: 'short',
  }).format(new Date(`${isoDate}T00:00:00+05:30`))
}

export function getComplianceCountdown(daysRemaining) {
  if (daysRemaining < 0) return `Overdue by ${Math.abs(daysRemaining)} ${Math.abs(daysRemaining) === 1 ? 'day' : 'days'}`
  if (daysRemaining === 0) return 'Due today'
  return `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} left`
}
