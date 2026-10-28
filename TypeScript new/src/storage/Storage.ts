// storage.ts

export const storage = {
	/**
	 * Сохранить данные в localStorage (автоматически переводит в JSON)
	 */
	set<T>(key: string, value: T): void {
		try {
			if (typeof window === 'undefined') return;
			const serializedValue = JSON.stringify(value);
			localStorage.setItem(key, serializedValue);
		} catch (error) {
			console.error(`Ошибка записи в localStorage [${key}]:`, error);
		}
	},

	/**
	 * Получить данные из localStorage (автоматически парсит JSON и возвращает тип <T>)
	 */
	get<T>(key: string): T | null {
		try {
			if (typeof window === 'undefined') return null;
			const serializedValue = localStorage.getItem(key);
			if (serializedValue === null) {
				return null;
			}
			return JSON.parse(serializedValue) as T;
		} catch (error) {
			console.error(`Ошибка чтения из localStorage [${key}]:`, error);
			return null;
		}
	},

	/**
	 * Удалить конкретный ключ
	 */
	remove(key: string): void {
		try {
			if (typeof window === 'undefined') return;
			localStorage.removeItem(key);
		} catch (error) {
			console.error(`Ошибка удаления из localStorage [${key}]:`, error);
		}
	},

	/**
	 * Полностью очистить хранилище
	 */
	clear(): void {
		try {
			if (typeof window === 'undefined') return;
			localStorage.clear();
		} catch (error) {
			console.error('Ошибка очистки localStorage:', error);
		}
	},
};





// // someComponent.ts (или .tsx)
// import { storage } from './storage';

// // Интерфейс для примера
// interface UserSettings {
//   theme: 'dark' | 'light';
//   notifications: boolean;
// }

// // 1. Сохранение данных
// const settings: UserSettings = { theme: 'dark', notifications: true };
// storage.set('userSettings', settings);

// // 2. Чтение данных (указываем тип в угловых скобках)
// const currentSettings = storage.get<UserSettings>('userSettings');

// if (currentSettings) {
//   console.log(currentSettings.theme); // TypeScript подскажет доступные поля
// }

// // 3. Удаление элемента
// storage.remove('userSettings');

// // 4. Очистка всего хранилища
// // storage.clear();

// ПРИМЕР ИСПОЛЬЗОВАНИЯ В ДРУГИХ КОМПОНЕНТАХ 