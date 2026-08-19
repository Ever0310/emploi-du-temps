import { timeToMinutes, minutesToTime } from '../utils/time'
import EventBlock from './EventBlock'

const DAYS = [
  { id: 'monday',    name: 'Lundi'    },
  { id: 'tuesday',   name: 'Mardi'    },
  { id: 'wednesday', name: 'Mercredi' },
  { id: 'thursday',  name: 'Jeudi'    },
  { id: 'friday',    name: 'Vendredi' },
]

const PPM = 1.5 // pixels per minute

export default function ScheduleGrid({ events, settings, onAddEvent, onEditEvent }) {
  const startMin = timeToMinutes(settings.startTime)
  const endMin = timeToMinutes(settings.endTime)
  const totalMin = endMin - startMin
  const gridHeight = totalMin * PPM

  const timeLabels = []
  for (let m = startMin; m <= endMin; m += 30) timeLabels.push(m)

  const handleColumnClick = (e, dayId) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const y = e.clientY - rect.top
    const clickedMin = Math.round(y / PPM / 15) * 15
    const absMin = Math.min(startMin + clickedMin, endMin - 30)
    onAddEvent(dayId, minutesToTime(absMin))
  }

  return (
    <div className="min-w-[600px]">
      {/* Day header row */}
      <div className="flex bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="w-14 flex-shrink-0" />
        {DAYS.map(day => (
          <div key={day.id} className="flex-1 text-center py-2.5 font-semibold text-sm text-gray-700 border-l border-gray-200">
            {day.name}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="flex bg-white">
        {/* Time column */}
        <div className="w-14 flex-shrink-0 relative" style={{ height: gridHeight }}>
          {timeLabels.map(m => (
            <div
              key={m}
              className="absolute right-2 text-xs text-gray-400 leading-none"
              style={{ top: (m - startMin) * PPM - 6 }}
            >
              {minutesToTime(m)}
            </div>
          ))}
        </div>

        {/* Day columns */}
        {DAYS.map(day => {
          const dayEvents = events.filter(e => e.day === day.id)
          return (
            <div
              key={day.id}
              className="flex-1 relative border-l border-gray-200 cursor-crosshair"
              style={{ height: gridHeight }}
              onClick={(e) => handleColumnClick(e, day.id)}
            >
              {/* Hour lines (solid) */}
              {timeLabels.filter((_, i) => i % 2 === 0).map(m => (
                <div
                  key={m}
                  className="absolute w-full border-t border-gray-200"
                  style={{ top: (m - startMin) * PPM }}
                />
              ))}
              {/* Half-hour lines (dashed) */}
              {timeLabels.filter((_, i) => i % 2 === 1).map(m => (
                <div
                  key={m}
                  className="absolute w-full border-t border-dashed border-gray-100"
                  style={{ top: (m - startMin) * PPM }}
                />
              ))}

              {/* Events */}
              {dayEvents.map(event => (
                <EventBlock
                  key={event.id}
                  event={event}
                  startMin={startMin}
                  ppm={PPM}
                  onClick={() => onEditEvent(event)}
                />
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
