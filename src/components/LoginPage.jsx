import { useState } from 'react'

export default function LoginPage({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (onLogin(password)) return
    setError(true)
    setShaking(true)
    setTimeout(() => setShaking(false), 400)
    setPassword('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">📅</div>
          <h1 className="text-2xl font-bold text-gray-800">Emploi du Temps</h1>
          <p className="text-gray-500 text-sm mt-1">Espace enseignant</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={shaking ? 'animate-[shake_0.4s_ease-in-out]' : ''}>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false) }}
              className={`w-full px-4 py-3 rounded-xl border-2 outline-none transition-colors text-gray-800
                ${error ? 'border-red-400 bg-red-50' : 'border-gray-200 focus:border-blue-400'}`}
              placeholder="••••••••••••"
              autoFocus
            />
            {error && (
              <p className="text-red-500 text-sm mt-1">Mot de passe incorrect</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Accéder
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-6">
          Mot de passe initial : <span className="font-mono font-medium text-gray-500">institutrice</span>
        </p>
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
