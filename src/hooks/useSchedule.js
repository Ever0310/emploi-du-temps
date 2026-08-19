import { useState, useEffect } from 'react'

const STORAGE_KEY = 'edt_data'

const DEFAULT_SETTINGS = {
  startTime: '08:00',
  endTime: '17:30',
  title: 'Mon Emploi du Temps',
  subtitle: '',
}

const DEFAULT_EVENTS = [
  { id: 'e1',  day: 'monday',    subject: 'Français',        color: '#3B82F6', startTime: '08:30', duration: 90  },
  { id: 'e2',  day: 'monday',    subject: 'Récréation',      color: '#94A3B8', startTime: '10:00', duration: 15  },
  { id: 'e3',  day: 'monday',    subject: 'Mathématiques',   color: '#EF4444', startTime: '10:15', duration: 75  },
  { id: 'e4',  day: 'monday',    subject: 'Pause déjeuner',  color: '#CBD5E1', startTime: '11:30', duration: 90  },
  { id: 'e5',  day: 'monday',    subject: 'Histoire-Géo',    color: '#F97316', startTime: '13:30', duration: 60  },
  { id: 'e6',  day: 'monday',    subject: 'Récréation',      color: '#94A3B8', startTime: '14:30', duration: 15  },
  { id: 'e7',  day: 'monday',    subject: 'EPS',             color: '#22C55E', startTime: '14:45', duration: 60  },
  { id: 'e8',  day: 'tuesday',   subject: 'Mathématiques',   color: '#EF4444', startTime: '08:30', duration: 90  },
  { id: 'e9',  day: 'tuesday',   subject: 'Récréation',      color: '#94A3B8', startTime: '10:00', duration: 15  },
  { id: 'e10', day: 'tuesday',   subject: 'Français',        color: '#3B82F6', startTime: '10:15', duration: 75  },
  { id: 'e11', day: 'tuesday',   subject: 'Pause déjeuner',  color: '#CBD5E1', startTime: '11:30', duration: 90  },
  { id: 'e12', day: 'tuesday',   subject: 'Sciences',        color: '#10B981', startTime: '13:30', duration: 60  },
  { id: 'e13', day: 'tuesday',   subject: 'Récréation',      color: '#94A3B8', startTime: '14:30', duration: 15  },
  { id: 'e14', day: 'tuesday',   subject: 'Arts plastiques', color: '#A855F7', startTime: '14:45', duration: 60  },
  { id: 'e15', day: 'wednesday', subject: 'Français',        color: '#3B82F6', startTime: '08:30', duration: 60  },
  { id: 'e16', day: 'wednesday', subject: 'Mathématiques',   color: '#EF4444', startTime: '09:30', duration: 60  },
  { id: 'e17', day: 'wednesday', subject: 'Récréation',      color: '#94A3B8', startTime: '10:30', duration: 15  },
  { id: 'e18', day: 'wednesday', subject: 'Musique',         color: '#EC4899', startTime: '10:45', duration: 45  },
  { id: 'e19', day: 'thursday',  subject: 'Français',        color: '#3B82F6', startTime: '08:30', duration: 90  },
  { id: 'e20', day: 'thursday',  subject: 'Récréation',      color: '#94A3B8', startTime: '10:00', duration: 15  },
  { id: 'e21', day: 'thursday',  subject: 'Anglais',         color: '#06B6D4', startTime: '10:15', duration: 45  },
  { id: 'e22', day: 'thursday',  subject: 'Pause déjeuner',  color: '#CBD5E1', startTime: '11:30', duration: 90  },
  { id: 'e23', day: 'thursday',  subject: 'Mathématiques',   color: '#EF4444', startTime: '13:30', duration: 60  },
  { id: 'e24', day: 'thursday',  subject: 'Récréation',      color: '#94A3B8', startTime: '14:30', duration: 15  },
  { id: 'e25', day: 'thursday',  subject: 'Histoire-Géo',    color: '#F97316', startTime: '14:45', duration: 60  },
  { id: 'e26', day: 'friday',    subject: 'Mathématiques',   color: '#EF4444', startTime: '08:30', duration: 60  },
  { id: 'e27', day: 'friday',    subject: 'Français',        color: '#3B82F6', startTime: '09:30', duration: 60  },
  { id: 'e28', day: 'friday',    subject: 'Récréation',      color: '#94A3B8', startTime: '10:30', duration: 15  },
  { id: 'e29', day: 'friday',    subject: 'Sciences',        color: '#10B981', startTime: '10:45', duration: 45  },
  { id: 'e30', day: 'friday',    subject: 'Pause déjeuner',  color: '#CBD5E1', startTime: '11:30', duration: 90  },
  { id: 'e31', day: 'friday',    subject: 'EPS',             color: '#22C55E', startTime: '13:30', duration: 60  },
  { id: 'e32', day: 'friday',    subject: 'Récréation',      color: '#94A3B8', startTime: '14:30', duration: 15  },
  { id: 'e33', day: 'friday',    subject: 'Arts plastiques', color: '#A855F7', startTime: '14:45', duration: 45  },
]

export function useSchedule() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        return {
          settings: { ...DEFAULT_SETTINGS, ...parsed.settings },
          events: parsed.events || DEFAULT_EVENTS,
        }
      } catch { /* fall through */ }
    }
    return { settings: DEFAULT_SETTINGS, events: DEFAULT_EVENTS }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  }, [data])

  const addEvent = (event) => {
    setData(prev => ({
      ...prev,
      events: [...prev.events, { ...event, id: crypto.randomUUID() }],
    }))
  }

  const updateEvent = (id, updates) => {
    setData(prev => ({
      ...prev,
      events: prev.events.map(e => e.id === id ? { ...e, ...updates } : e),
    }))
  }

  const deleteEvent = (id) => {
    setData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== id),
    }))
  }

  const updateSettings = (settings) => {
    setData(prev => ({ ...prev, settings: { ...prev.settings, ...settings } }))
  }

  const resetData = () => {
    setData({ settings: DEFAULT_SETTINGS, events: DEFAULT_EVENTS })
  }

  return {
    events: data.events,
    settings: data.settings,
    addEvent,
    updateEvent,
    deleteEvent,
    updateSettings,
    resetData,
  }
}
