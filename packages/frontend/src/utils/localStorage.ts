export enum LocalStorageKey {
  USERNAME = 'username',
  SESSION_ID = 'session_id',
  ROOM_ID = 'room_id',
}

type LocalStorageMap = {
  [LocalStorageKey.USERNAME]: string;
  [LocalStorageKey.ROOM_ID]: string;
  [LocalStorageKey.SESSION_ID]: string;
};

export const getStorage = <TKey extends LocalStorageKey>(
  key: TKey
): LocalStorageMap[TKey] | null => {
  try {
    const json = localStorage.getItem(key);
    return json ? JSON.parse(json) : null;
  } catch (e) {
    localStorage.removeItem(key);
    console.error(`Failed to retrieve ${key}: ${e.message}`);
    return null;
  }
};

export const setStorage = <TKey extends LocalStorageKey>(
  key: TKey,
  value: LocalStorageMap[TKey]
) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`Failed to set ${key}: ${e.message}`);
  }
};

export const removeStorage = (key: LocalStorageKey) => {
  localStorage.removeItem(key);
};
