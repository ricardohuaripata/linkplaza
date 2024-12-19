import { AbstractControl } from '@angular/forms';

export function emailValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const email = control.value;
  const pattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (email && !pattern.test(email)) {
    return { invalidEmail: true };
  }
  return null;
}

export function passwordValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const password = control.value;
  // verifica al menos una letra minúscula, una letra mayúscula, un número y un carácter especial
  if (
    password &&
    (!/(?=.*[a-z])/.test(password) ||
      !/(?=.*[A-Z])/.test(password) ||
      !/(?=.*\d)/.test(password) ||
      !/(?=.*[!@#$%^&*()\-_=+{};:,<.>ยง?\\|[\]\/~`"'])/.test(password))
  ) {
    return { invalidPassword: true };
  }
  return null;
}
