// Utility functions for cookie management
export function setCookie(name: string, value: string, days: number = 7) {
  if (typeof document === 'undefined') return; // SSR check
  
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = `expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value};${expires};path=/;SameSite=Lax`;
}

export function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null; // SSR check
  
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

export function deleteCookie(name: string) {
  if (typeof document === 'undefined') return; // SSR check
  
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
}
