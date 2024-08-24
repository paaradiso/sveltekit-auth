import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function createThemeStore() {
	const { subscribe, set, update } = writable('light');

	if (browser) {
		const storedTheme = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

		if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
			set('dark');
		}
	}

	return {
		subscribe,
		toggleTheme: () =>
			update((theme) => {
				const newTheme = theme === 'light' ? 'dark' : 'light';
				if (browser) {
					localStorage.setItem('theme', newTheme);
					document.documentElement.classList.toggle('dark', newTheme === 'dark');
					const meta = document.querySelector('meta[name="color-scheme"]');
					if (meta) meta.content = newTheme;
				}
				return newTheme;
			})
	};
}

export const theme = createThemeStore();
