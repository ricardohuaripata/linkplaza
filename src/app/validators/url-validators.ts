import { AbstractControl } from '@angular/forms';

export function characterPatternValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const url = control.value;
  const pattern = /^[a-zA-Z0-9_.]+$/;
  if (url && !pattern.test(url)) {
    return { invalidCharacterPattern: true };
  }
  return null;
}

export function noDotAtEdgesValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const url = control.value;

  if (url && (url.startsWith('.') || url.endsWith('.'))) {
    return { invalidDotAtEdges: true };
  }
  return null;
}

export function urlValidator(
  control: AbstractControl
): { [key: string]: boolean } | null {
  const url = control.value;
  if (url && url.trim() !== url) {
    return { invalidUrl: true };
  }
  return null;
}
