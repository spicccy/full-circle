export enum LocalStorageKey {
  SESSION_DATA = 'SESSION_DATA',
}

interface ISessionData {
  roomCode: string;
  roomId: string;
  clientId: string;
  isCurator: boolean;
}

type LocalStorageMap = {
  [LocalStorageKey.SESSION_DATA]: ISessionData;
};

export const getStorage = <TKey extends LocalStorageKey>(
  key: TKey
): LocalStorageMap[TKey] | null => {
  try {
    const json = localStorage.getItem(key);
    const data = json ? JSON.parse(json) : null;
    console.log(`[localStorage] get ${key}`, data);
    return data;
  } catch (e) {
    localStorage.removeItem(key);
    console.error(`[localStorage] get failed ${key}`, e);
    return null;
  }
};

export const setStorage = <TKey extends LocalStorageKey>(
  key: TKey,
  value: LocalStorageMap[TKey]
) => {
  try {
    console.log(`[localStorage] set ${key}`, value);
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error(`[localStorage] set failed ${key}`, e);
  }
};

export const removeStorage = (key: LocalStorageKey) => {
  console.log(`[localStorage] remove ${key}`);
  localStorage.removeItem(key);
};
