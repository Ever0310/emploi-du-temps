import { useState } from 'react'
import { useSchedule } from '../hooks/useSchedule'
import Header from './Header'
import ScheduleGrid from './ScheduleGrid'
import SubjectSummary from './SubjectSummary'
import EditEventModal from './EditEventModal'
import SettingsModal from './SettingsModal'

export default function MainSchedule({ onLogout }) {
  const { events, settings, addEvent, updateEvent, deleteEvent, updateSettings, resetData } = useSchedule()
  const [editModal, setEditModal] = useState(null) // null | { event } | { day, startTime }
  const [showSettings, setShowSettings] = useState(false)

  const openAdd = (day, startTime) => setEditModal({ day, startTime })
  const openEdit = (event) => setEditModal({ event })
  const closeModal = () => setEditModal(null)

  const handleSave = (formData) => {
    if (formData.id) {
      updateEvent(formData.id, formData)
    } else {
      addEvent(formData)
    }
    closeModal()
  }

  const handleDelete = (id) => {
    deleteEvent(id)
    closeModal()
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        title={settings.title}
        onSettings={() => setShowSettings(true)}
        onLogout={onLogout}
        onAdd={() => openAdd('monday', settings.startTime)}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-auto schedule-scroll">
          <ScheduleGrid
            events={events}
            settings={settings}
            onAddEvent={openAdd}
            onEditEvent={openEdit}
          />
        </div>
        <SubjectSummary events={events} />
      </main>

      {editModal && (
        <EditEventModal
          event={editModal.event}
          defaultDay={editModal.day}
          defaultStartTime={editModal.startTime}
          settings={settings}
          existingSubjects={[...new Set(events.map(e => ({ name: e.subject, color: e.color })).map(s => JSON.stringify(s)))].map(s => JSON.parse(s))}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={closeModal}
        />
      )}

      {showSettings && (
        <SettingsModal
          settings={settings}
          onSave={updateSettings}
          onReset={resetData}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
