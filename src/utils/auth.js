const PASSWORD_KEY = 'edt_password'
const DEFAULT_PASSWORD = 'institutrice'

export function checkPassword(input) {
  const stored = localStorage.getItem(PASSWORD_KEY) || DEFAULT_PASSWORD
  return input === stored
}

export function updatePassword(newPassword) {
  localStorage.setItem(PASSWORD_KEY, newPassword)
}
