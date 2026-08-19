import { useState } from 'react'
import { timeToMinutes, minutesToTime } from '../utils/time'

const DAYS = [
  { id: 'monday',    label: 'Lun' },
  { id: 'tuesday',   label: 'Mar' },
  { id: 'wednesday', label: 'Mer' },
  { id: 'thursday',  label: 'Jeu' },
  { id: 'friday',    label: 'Ven' },
]

const SUBJECTS = [
  { name: 'Français',       color: '#3B82F6' },
  { name: 'Mathématiques',  color: '#EF4444' },
  { name: 'Anglais',        color: '#06B6D4' },
  { name: 'Sciences',       color: '#10B981' },
  { name: 'Histoire',       color: '#F97316' },
  { name: 'EPS',            color: '#22C55E' },
  { name: 'Géographie',     color: '#8B5CF6' },
  { name: 'Musique',        color: '#EC4899' },
  { name: 'EMC',            color: '#F59E0B' },
]

const PRESET_COLORS = [
  '#3B82F6', '#EF4444', '#22C55E', '#F97316',
  '#A855F7', '#EC4899', '#06B6D4', '#EAB308',
  '#14B8A6', '#F43F5E', '#84CC16', '#94A3B8',
]

const DURATIONS = [
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '45 min', value: 45 },
  { label: '1h',     value: 60 },
  { label: '1h15',   value: 75 },
  { label: '1h30',   value: 90 },
  { label: '2h',     value: 120 },
  { label: '2h30',   value: 150 },
  { label: '3h',     value: 180 },
]

export default function EditEventModal({ event, defaultDay, defaultStartTime, settings, onSave, onDelete, onClose }) {
  const isEdit = !!event

  const getInitialSubjectMode = () => {
    if (!event?.subject) return 'list'
    return SUBJECTS.find(s => s.name === event.subject) ? 'list' : 'custom'
  }

  const [subjectMode, setSubjectMode] = useState(getInitialSubjectMode)
  const [subject, setSubject] = useState(event?.subject || '')
  const [customSubject, setCustomSubject] = useState(subjectMode === 'custom' ? event?.subject : '')
  const [color, setColor] = useState(event?.color || SUBJECTS[0].color)
  const [day, setDay] = useState(event?.day || defaultDay || 'monday')
  const [startTime, setStartTime] = useState(event?.startTime || defaultStartTime || settings.startTime)
  const [duration, setDuration] = useState(event?.duration || 60)
  const [customDuration, setCustomDuration] = useState(!DURATIONS.find(d => d.value === (event?.duration || 60)))
  const [error, setError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const endTime = minutesToTime(timeToMinutes(startTime) + duration)

  const handleSubjectSelect = (s) => {
    setSubject(s.name)
    setColor(s.color)
    setSubjectMode('list')
  }

  const handleSave = () => {
    const finalSubject = subjectMode === 'custom' ? customSubject.trim() : subject
    if (!finalSubject) { setError('Sélectionne ou saisis une matière.'); return }
    if (duration <= 0) { setError('La durée doit être supérieure à 0.'); return }
    onSave({ id: event?.id, subject: finalSubject, color, day, startTime, duration })
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-bold text-gray-800 text-lg">
            {isEdit ? 'Modifier le créneau' : 'Nouveau créneau'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 space-y-5">
          {/* Subject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Matière</label>

            {subjectMode === 'list' ? (
              <>
                <div className="grid grid-cols-3 gap-1.5">
                  {SUBJECTS.map(s => (
                    <button
                      key={s.name}
                      type="button"
                      onClick={() => handleSubjectSelect(s)}
                      className={`px-2 py-2 rounded-lg text-xs font-medium text-left transition-all border-2
                        ${subject === s.name
                          ? 'border-transparent text-white'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300 bg-white'}`}
                      style={subject === s.name ? { backgroundColor: s.color, borderColor: s.color } : {}}
                    >
                      {s.name}
                    </button>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => { setSubjectMode('custom'); setSubject('') }}
                  className="mt-2 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                >
                  + Saisir manuellement
                </button>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={customSubject}
                  onChange={e => setCustomSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-gray-800"
                  placeholder="Nom de la matière…"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => { setSubjectMode('list'); setCustomSubject('') }}
                  className="mt-1 text-xs text-blue-500 hover:text-blue-700 transition-colors"
                >
                  ← Choisir dans la liste
                </button>
              </>
            )}
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Couleur</label>
            <div className="flex flex-wrap gap-2 items-center">
              {PRESET_COLORS.map(c => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-7 h-7 rounded-full border-2 transition-transform hover:scale-110"
                  style={{
                    backgroundColor: c,
                    borderColor: color === c ? '#1D4ED8' : 'transparent',
                    outline: color === c ? '2px solid white' : 'none',
                    outlineOffset: '-3px',
                  }}
                />
              ))}
              <input
                type="color"
                value={color}
                onChange={e => setColor(e.target.value)}
                className="w-7 h-7 rounded-full cursor-pointer border-2 border-gray-300 p-0.5"
                title="Couleur personnalisée"
              />
            </div>
          </div>

          {/* Day */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Jour</label>
            <div className="flex gap-1">
              {DAYS.map(d => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => setDay(d.id)}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors
                    ${day === d.id ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time & Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Heure de début</label>
              <input
                type="time"
                value={startTime}
                step={900}
                onChange={e => setStartTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-gray-800"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fin : <span className="font-semibold text-blue-600">{endTime}</span>
              </label>
              <div className="px-3 py-2 border border-gray-100 bg-gray-50 rounded-xl text-sm text-gray-500">
                {Math.floor(duration / 60) > 0 && `${Math.floor(duration / 60)}h`}
                {duration % 60 > 0 && ` ${duration % 60} min`}
              </div>
            </div>
          </div>

          {/* Duration picker */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Durée</label>
            <div className="flex flex-wrap gap-1.5">
              {DURATIONS.map(d => (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => { setDuration(d.value); setCustomDuration(false) }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors
                    ${!customDuration && duration === d.value ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {d.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCustomDuration(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors
                  ${customDuration ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
              >
                Autre…
              </button>
            </div>
            {customDuration && (
              <div className="mt-2 flex items-center gap-2">
                <input
                  type="number"
                  min={5}
                  max={480}
                  step={5}
                  value={duration}
                  onChange={e => setDuration(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:border-blue-400 text-sm text-gray-800"
                />
                <span className="text-sm text-gray-500">minutes</span>
              </div>
            )}
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          {isEdit ? (
            confirmDelete ? (
              <div className="flex gap-2">
                <button
                  onClick={() => onDelete(event.id)}
                  className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-3 py-2 rounded-lg transition-colors"
                >
                  Confirmer la suppression
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="text-gray-600 text-sm px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Annuler
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmDelete(true)}
                className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 rounded-lg hover:bg-red-50 transition-colors"
              >
                Supprimer
              </button>
            )
          ) : <div />}
          <div className="flex gap-2">
            <button onClick={onClose} className="text-gray-600 hover:bg-gray-100 text-sm px-4 py-2 rounded-lg transition-colors">
              Annuler
            </button>
            <button
              onClick={handleSave}
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              {isEdit ? 'Enregistrer' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
