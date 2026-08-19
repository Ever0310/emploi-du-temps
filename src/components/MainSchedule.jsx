import { useState } from 'react'
import { useSchedule } from '../hooks/useSchedule'
import Header from './Header'
import ScheduleGrid from './ScheduleGrid'
import SubjectSummary from './SubjectSummary'
import EditEventModal from './EditEventModal'
import SettingsModal from './SettingsModal'

export default function MainSchedule({ onLogout }) {
  const { events, settings, addEvent, updateEvent, deleteEvent, updateSettings, resetData } = useSchedule()
  const [editModal, setEditModal] = useState(null)
  const [showSettings, setShowSettings] = useState(false)
  const [exporting, setExporting] = useState(false)

  const openAdd = (day, startTime) => setEditModal({ day, startTime })
  const openEdit = (event) => setEditModal({ event })
  const closeModal = () => setEditModal(null)

  const handleSave = (formData) => {
    if (formData.id) updateEvent(formData.id, formData)
    else addEvent(formData)
    closeModal()
  }

  const handleDelete = (id) => {
    deleteEvent(id)
    closeModal()
  }

  const handleExportPDF = async () => {
    if (exporting) return
    setExporting(true)

    const scrollEl = document.querySelector('.schedule-scroll')
    const mainEl = document.querySelector('main')

    // Expand overflow for full capture
    const prev = {
      scrollOverflow: scrollEl?.style.overflow,
      scrollHeight: scrollEl?.style.height,
      scrollMax: scrollEl?.style.maxHeight,
      scrollFlex: scrollEl?.style.flex,
      mainOverflow: mainEl?.style.overflow,
    }

    if (scrollEl) {
      scrollEl.style.setProperty('overflow', 'visible', 'important')
      scrollEl.style.setProperty('height', 'auto', 'important')
      scrollEl.style.setProperty('max-height', 'none', 'important')
      scrollEl.style.setProperty('flex', 'none', 'important')
    }
    if (mainEl) {
      mainEl.style.setProperty('overflow', 'visible', 'important')
    }

    // Wait for reflow
    await new Promise(r => setTimeout(r, 80))

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ])

      const captureEl = document.getElementById('schedule-capture')
      const canvas = await html2canvas(captureEl, {
        scale: 2,
        logging: false,
        useCORS: true,
        backgroundColor: '#F8FAFC',
      })

      const imgData = canvas.toDataURL('image/jpeg', 0.92)
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      const m = 8
      const pw = pdf.internal.pageSize.getWidth() - 2 * m
      const ph = pdf.internal.pageSize.getHeight() - 2 * m

      // Add title text
      pdf.setFontSize(13)
      pdf.setFont('helvetica', 'bold')
      pdf.setTextColor(31, 41, 55)
      pdf.text(settings.title || 'Emploi du Temps', m, m + 4)

      let titleOffset = 8
      if (settings.subtitle) {
        pdf.setFontSize(9)
        pdf.setFont('helvetica', 'normal')
        pdf.setTextColor(107, 114, 128)
        pdf.text(settings.subtitle, m, m + 8)
        titleOffset = 13
      }

      const availH = ph - titleOffset
      const aspect = canvas.height / canvas.width
      let imgW = pw
      let imgH = imgW * aspect
      if (imgH > availH) { imgH = availH; imgW = imgH / aspect }

      pdf.addImage(imgData, 'JPEG', m, m + titleOffset, imgW, imgH)
      pdf.save('emploi-du-temps.pdf')
    } catch (err) {
      console.error('PDF export failed', err)
    } finally {
      // Restore styles
      if (scrollEl) {
        scrollEl.style.overflow = prev.scrollOverflow ?? ''
        scrollEl.style.height = prev.scrollHeight ?? ''
        scrollEl.style.maxHeight = prev.scrollMax ?? ''
        scrollEl.style.flex = prev.scrollFlex ?? ''
      }
      if (mainEl) mainEl.style.overflow = prev.mainOverflow ?? ''
      setExporting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header
        title={settings.title}
        subtitle={settings.subtitle}
        onSettings={() => setShowSettings(true)}
        onLogout={onLogout}
        onAdd={() => openAdd('monday', settings.startTime)}
        onExportPDF={handleExportPDF}
      />

      {exporting && (
        <div className="fixed inset-0 z-50 bg-white/70 flex items-center justify-center no-print">
          <div className="bg-white rounded-xl shadow-lg px-6 py-4 flex items-center gap-3">
            <svg className="w-5 h-5 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            <span className="text-sm text-gray-700">Génération du PDF…</span>
          </div>
        </div>
      )}

      <main id="schedule-capture" className="flex-1 flex flex-col overflow-hidden">
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
