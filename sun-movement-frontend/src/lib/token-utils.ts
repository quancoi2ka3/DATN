export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  
  try {
    // JWT consists of three parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) return true;
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token has expiration time
    if (!payload.exp) return false; // If no exp claim, consider it valid
    
    // Compare with current time (exp is in seconds, Date.now() is in milliseconds)
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error checking token expiration:', error);
    return true; // If we can't parse it, consider it expired
  }
}

export function getTokenExpirationTime(token: string): Date | null {
  if (!token) return null;
  
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(atob(parts[1]));
    if (!payload.exp) return null;
    
    return new Date(payload.exp * 1000); // Convert from seconds to milliseconds
  } catch (error) {
    console.error('Error getting token expiration time:', error);
    return null;
  }
}

export function timeUntilTokenExpires(token: string): number {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return 0;
  
  return Math.max(0, expirationTime.getTime() - Date.now());
}
