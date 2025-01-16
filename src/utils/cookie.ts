export function getCookie(name: string): string {
  const cookieString = document.cookie;
  const cookies = cookieString.split('; ');
  for (const cookie of cookies) {
    const [key, value] = cookie.split('=');
    if (key === name) {
      return value;
    }
  }
  return '';
}

export function deleteCookie(name: string) {
  document.cookie = `${name}=; Max-Age=0; path=/;`;
}
