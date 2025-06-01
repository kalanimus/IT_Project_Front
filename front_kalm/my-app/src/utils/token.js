export function isTokenExpired(expiration) {
  if (!expiration) return true;
  try {
    console.log(expiration);
    // const payload = JSON.parse(atob(token.split('.')[1]));
    // if (!payload.exp) return false; // если нет exp, считаем токен вечным
    const now = Math.floor(Date.now() / 1000);
    return expiration < now;
  } catch {
    return true; // если не смогли декодировать — считаем токен невалидным
  }
}