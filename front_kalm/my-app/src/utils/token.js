export function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    if (!payload.exp) return false; // если нет exp, считаем токен вечным
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return true; // если не смогли декодировать — считаем токен невалидным
  }
}