<script>
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import { Moon, Sun } from 'lucide-svelte';

	let darkMode = true;

	async function handleSwitchDarkMode() {
		darkMode = !darkMode;

		localStorage.setItem('theme', darkMode ? 'dark' : 'light');

		darkMode
			? document.documentElement.classList.add('dark')
			: document.documentElement.classList.remove('dark');

		let meta = Array.from(document.getElementsByTagName('meta')).find(
			(m) => m.name === 'color-scheme'
		);
		meta.content = darkMode ? 'dark' : 'light';
	}

	if (browser) {
		if (
			localStorage.theme === 'dark' ||
			(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
		) {
			document.documentElement.classList.add('dark');
			darkMode = true;
		} else {
			document.documentElement.classList.remove('dark');
			darkMode = false;
		}
	}
</script>

<Button
	variant="ghost"
	on:click={handleSwitchDarkMode}
	class="rounded-full px-2"
	aria-label="theme-switch"
>
	{#if darkMode}
		<Sun />
	{:else}
		<Moon />
	{/if}
</Button>
