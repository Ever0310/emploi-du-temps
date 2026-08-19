import { useState } from 'react'
import { updatePassword, checkPassword } from '../utils/auth'

export default function SettingsModal({ settings, onSave, onReset, onClose }) {
  const [title, setTitle] = useState(settings.title || 'Mon Emploi du Temps')
  const [subtitle, setSubtitle] = useState(settings.subtitle || '')
  const [startTime, setStartTime] = useState(settings.startTime)
  const [endTime, setEndTime] = useState(settings.endTime)
  const [currentPwd, setCurrentPwd] = useState('')
  const [newPwd, setNewPwd] = useState('')
  const [confirmPwd, setConfirmPwd] = useState('')
  const [pwdMsg, setPwdMsg] = useState(null) // { type: 'success'|'error', text }
  const [confirmReset, setConfirmReset] = useState(false)
  const [timeError, setTimeError] = useState('')

  const handleSave = () => {
    if (startTime >= endTime) {
      setTimeError("L'heure de fin doit être après l'heure de début.")
      return
    }
    setTimeError('')
    onSave({ title, subtitle, startTime, endTime })
    onClose()
  }

  const handlePasswordChange = () => {
    if (!checkPassword(currentPwd)) {
      setPwdMsg({ type: 'error', text: 'Mot de passe actuel incorrect.' }); return
    }
    if (newPwd.length < 4) {
      setPwdMsg({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 4 caractères.' }); return
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: 'error', text: 'Les mots de passe ne correspondent pas.' }); return
    }
    updatePassword(newPwd)
    setPwdMsg({ type: 'success', text: 'Mot de passe mis à jour !' })
    setCurrentPwd(''); setNewPwd(''); setConfirmPwd('')
  }

  const handleReset = () => {
    onReset()
    setConfirmReset(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
          <h2 className="font-bold text-gray-800 text-lg">Réglages</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {/* General */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Général</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-gray-800"
                  placeholder="Mon Emploi du Temps"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sous-titre <span className="font-normal text-gray-400">(optionnel)</span></label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={e => setSubtitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-gray-800"
                  placeholder="ex. Classe de CE2 · 2024–2025"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Début de journée</label>
                  <input
                    type="time"
                    value={startTime}
                    onChange={e => setStartTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin de journée</label>
                  <input
                    type="time"
                    value={endTime}
                    onChange={e => setEndTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-gray-800"
                  />
                </div>
              </div>
              {timeError && <p className="text-red-500 text-sm">{timeError}</p>}
            </div>
          </section>

          {/* Password */}
          <section>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Mot de passe</h3>
            <div className="space-y-2">
              <input
                type="password"
                value={currentPwd}
                onChange={e => { setCurrentPwd(e.target.value); setPwdMsg(null) }}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-gray-800 text-sm"
                placeholder="Mot de passe actuel"
              />
              <input
                type="password"
                value={newPwd}
                onChange={e => { setNewPwd(e.target.value); setPwdMsg(null) }}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-gray-800 text-sm"
                placeholder="Nouveau mot de passe"
              />
              <input
                type="password"
                value={confirmPwd}
                onChange={e => { setConfirmPwd(e.target.value); setPwdMsg(null) }}
                className="w-full px-3 py-2 border border-gray-200 rounded-xl outline-none focus:border-blue-400 text-gray-800 text-sm"
                placeholder="Confirmer le nouveau mot de passe"
              />
              {pwdMsg && (
                <p className={`text-sm ${pwdMsg.type === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                  {pwdMsg.text}
                </p>
              )}
              <button
                onClick={handlePasswordChange}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-xl transition-colors"
              >
                Changer le mot de passe
              </button>
            </div>
          </section>

          {/* Danger zone */}
          <section>
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide mb-3">Zone danger</h3>
            {confirmReset ? (
              <div className="bg-red-50 rounded-xl p-4 space-y-3">
                <p className="text-sm text-red-700 font-medium">
                  Cela va effacer tout l'emploi du temps et restaurer l'exemple par défaut. Cette action est irréversible.
                </p>
                <div className="flex gap-2">
                  <button onClick={handleReset} className="bg-red-500 hover:bg-red-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    Oui, réinitialiser
                  </button>
                  <button onClick={() => setConfirmReset(false)} className="text-gray-600 text-sm px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors">
                    Annuler
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setConfirmReset(true)}
                className="w-full border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium py-2 rounded-xl transition-colors"
              >
                Réinitialiser l'emploi du temps
              </button>
            )}
          </section>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-2">
          <button onClick={onClose} className="text-gray-600 hover:bg-gray-100 text-sm px-4 py-2 rounded-lg transition-colors">
            Annuler
          </button>
          <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  )
}
