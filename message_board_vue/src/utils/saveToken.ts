/**
 * 保存数据到本地存储
 * @param data 要保存的数据
 * @param key 存储键名
 * @param remember 是否长期保存（true = 长期 = 当前会话）
 */
function saveData<T>(data: T, key: string, remember: boolean = true) {
  try {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error("保存数据失败:", err);
  }
}

/**
 * 从本地存储读取数据
 * @param key 存储键名
 * @param storageType 存储类型（'local' 或 'session'）
 * @returns 解析后的数据，如果不存在或解析失败返回 null
 */
function getData<T = unknown>(
  key: string,
  storageType: "local" | "session" = "local"
): T | null {
  const storage = storageType === "local" ? localStorage : sessionStorage;
  const data = storage.getItem(key);
  if (!data) return null;

  try {
    return JSON.parse(data) as T;
  } catch (err) {
    console.error("读取数据失败:", err);
    return null;
  }
}

export { saveData, getData };
