import { formatDuration, getTextColor } from '../utils/time'

export default function SubjectSummary({ events }) {
  const totals = {}
  events.forEach(e => {
    if (!totals[e.subject]) totals[e.subject] = { name: e.subject, color: e.color, minutes: 0 }
    totals[e.subject].minutes += e.duration
  })

  const subjects = Object.values(totals).sort((a, b) => b.minutes - a.minutes)

  if (subjects.length === 0) return null

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-3">
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
        Répartition hebdomadaire
      </p>
      <div className="flex flex-wrap gap-2">
        {subjects.map(s => {
          const textColor = getTextColor(s.color)
          return (
            <div
              key={s.name}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium"
              style={{ backgroundColor: s.color, color: textColor }}
            >
              <span>{s.name}</span>
              <span className="opacity-70">·</span>
              <span className="font-normal opacity-90">{formatDuration(s.minutes)}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
