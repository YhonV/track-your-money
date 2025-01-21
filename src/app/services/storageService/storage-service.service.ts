import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

interface StorageItem {
  key: string;
  value: string;
}


@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setName = async (item: StorageItem): Promise<void> => {
    await Preferences.set({
      key: item.key,
      value: item.value,
    });
  };
  
  async getName(key: string): Promise<string | null> {
    const { value } = await Preferences.get({ key });
    return value;
  }
  
  async removeName(key: string): Promise<void> {
    await Preferences.remove({ key });
  }
  
  async clearStorage(): Promise<void> {
    await Preferences.clear();
  }
  
  
}
