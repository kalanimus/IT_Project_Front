export function isTokenExpired(expiration) {
  if (!expiration) return true;
  try {
    const now = Math.floor(Date.now() / 1000);
    return expiration < now;
  } catch {
    return true; // если не смогли декодировать — считаем токен невалидным
  }
}