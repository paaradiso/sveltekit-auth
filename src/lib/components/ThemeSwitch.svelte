<script>
	import { theme } from '$lib/stores/theme';
	import { Button } from '$lib/components/ui/button';
	import { Moon, Sun } from 'lucide-svelte';

	function handleSwitchDarkMode() {
		theme.toggleTheme();
	}
</script>

<Button
	variant="ghost"
	on:click={handleSwitchDarkMode}
	class="rounded-full px-2"
	aria-label="theme-switch"
>
	{#if $theme === 'dark'}
		<Sun />
	{:else}
		<Moon />
	{/if}
</Button>
