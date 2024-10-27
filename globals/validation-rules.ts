export function requiredRule(value: string) {
  if (!value) return 'Feld darf nicht leer sein';
  return true;
}

export function emailRule(value: string) {
  if (!/^.+@.+\..+$/.test(value)) return 'E-Mail ist ungültig';
  return true;
}

export function minLengthRule(value: string, minLength: number) {
  if (value.length < minLength) return `Mindestens ${minLength} Zeichen benötigt`;
  return true;
}

export function maxLengthRule(value: string, maxLength: number) {
  if (value.length > maxLength) return `Maximal ${maxLength} Zeichen erlaubt`;
  return true;
}

export function containsNumberRule(value: string) {
  if (!/\d/.test(value)) return 'Mindestens eine Zahl benötigt';
  return true;
}

export function containsSpecialCharacterRule(value: string) {
  if (!/[!-/:-@[-`{-ÿ]/.test(value)) return 'Mindestens ein Sonderzeichen benötigt';
  return true;
}

export function containsUppercaseRule(value: string) {
  if (!/[A-Z]/.test(value)) return 'Mindestens ein Großbuchstabe benötigt';
  return true;
}

export function containsLowercaseRule(value: string) {
  if (!/[a-z]/.test(value)) return 'Mindestens ein Kleinbuchstabe benötigt';
  return true;
}

export function equalsRule(value: string, compareValue: string) {
  if (value !== compareValue) return 'Werte stimmen nicht überein';
  return true;
}

export function validDateRule(value: string) {
  // validate DD.MM.YYYY or D.M.YYYY
  if (!/^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/.test(value)) return 'Ungültiges Datum';
  return true;
}
