import { useState } from 'react'
import { getResetQuestion, checkResetAnswer, getPassword } from '../utils/auth'

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)
  const [view, setView] = useState('login') // 'login' | 'reset'
  const [answer, setAnswer] = useState('')
  const [resetError, setResetError] = useState(false)
  const [revealed, setRevealed] = useState(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onLogin(password)) return
    setError(true)
    setShaking(true)
    setTimeout(() => setShaking(false), 400)
    setPassword('')
  }

  const handleReset = (e) => {
    e.preventDefault()
    if (checkResetAnswer(answer)) {
      setRevealed(getPassword())
      setResetError(false)
    } else {
      setResetError(true)
      setAnswer('')
    }
  }

  const goBack = () => {
    setView('login')
    setAnswer('')
    setResetError(false)
    setRevealed(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">

        {view === 'login' ? (
          <>
            <div className="text-center mb-8">
              <div className="text-5xl mb-4">📅</div>
              <h1 className="text-2xl font-bold text-gray-800">Emploi du Temps</h1>
              <p className="text-gray-500 text-sm mt-1">Espace enseignant</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className={shaking ? 'animate-[shake_0.4s_ease-in-out]' : ''}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(false) }}
                  className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors text-gray-800
                    ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'}`}
                  placeholder="••••••••••••"
                  autoFocus
                />
                {error && <p className="text-red-500 text-sm mt-1">Mot de passe incorrect</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                Accéder
              </button>
            </form>

            <div className="text-center mt-5">
              <button
                onClick={() => setView('reset')}
                className="text-xs text-gray-400 hover:text-blue-500 transition-colors underline-offset-2 hover:underline"
              >
                Mot de passe oublié ?
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl mb-3">🔑</div>
              <h1 className="text-xl font-bold text-gray-800">Récupération</h1>
            </div>

            {!revealed ? (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">{getResetQuestion()}</p>
                  <input
                    type="text"
                    value={answer}
                    onChange={(e) => { setAnswer(e.target.value); setResetError(false) }}
                    className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors text-gray-800
                      ${resetError ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'}`}
                    placeholder="Votre réponse…"
                    autoFocus
                  />
                  {resetError && <p className="text-red-500 text-sm mt-1">Réponse incorrecte</p>}
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
                >
                  Vérifier
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-600 text-center">Votre mot de passe est :</p>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-xl px-5 py-4 text-center">
                  <span className="font-mono text-lg font-bold text-blue-700 select-all">{revealed}</span>
                </div>
              </div>
            )}

            <button
              onClick={goBack}
              className="mt-5 w-full text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              ← Retour à la connexion
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-5px); }
          80% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  )
}
