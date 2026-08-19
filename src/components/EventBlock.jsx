import { timeToMinutes, minutesToTime, getTextColor } from '../utils/time'

export default function EventBlock({ event, startMin, ppm, onClick }) {
  const top = (timeToMinutes(event.startTime) - startMin) * ppm
  const height = Math.max(event.duration * ppm, 22)
  const textColor = getTextColor(event.color)
  const endTime = minutesToTime(timeToMinutes(event.startTime) + event.duration)

  return (
    <div
      className="absolute left-0.5 right-0.5 rounded overflow-hidden cursor-pointer select-none
                 hover:opacity-90 hover:ring-2 ring-white/60 transition-all z-10"
      style={{
        top: top + 1,
        height: height - 2,
        backgroundColor: event.color,
        color: textColor,
      }}
      onClick={(e) => { e.stopPropagation(); onClick() }}
      title={`${event.subject} · ${event.startTime}–${endTime}`}
    >
      <div className="px-1.5 py-0.5 h-full overflow-hidden flex flex-col justify-center">
        <div className="font-semibold text-xs leading-tight truncate">{event.subject}</div>
        {height > 42 && (
          <div className="text-xs leading-tight opacity-80">
            {event.startTime}–{endTime}
          </div>
        )}
      </div>
    </div>
  )
}
