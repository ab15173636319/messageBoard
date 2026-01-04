function setSession(key: string, value: any) {
  try {
    value = typeof value === "object" ? JSON.stringify(value) : value;
    sessionStorage.setItem(key, value);
  } catch (error) {
    console.error(error);
  }
}

function getSession<T>(key: string): T | null {
  try {
    const value = sessionStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : null;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export { setSession, getSession };
