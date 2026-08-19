const PASSWORD_KEY = 'edt_password'
const DEFAULT_PASSWORD = 'ClasseClémence'
const RESET_QUESTION = 'Nom du premier chat de tes parents'
const RESET_ANSWER = 'bombito'

export function checkPassword(input) {
  const stored = localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD
  return input === stored
}

export function updatePassword(newPassword) {
  localStorage.setItem(PASSWORD_KEY, newPassword)
}

export function getPassword() {
  return localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD
}

export function getResetQuestion() {
  return RESET_QUESTION
}

export function checkResetAnswer(answer) {
  return answer.trim().toLowerCase() === RESET_ANSWER
}
