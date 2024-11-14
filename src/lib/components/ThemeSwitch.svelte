<script>
	import { theme } from '$lib/state/theme.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Moon, Sun } from 'lucide-svelte';
</script>

<Button
	variant="ghost"
	onclick={() => theme.toggleTheme()}
	class="rounded-full px-3"
	aria-label="theme-switch"
>
	{#if theme.value === 'dark'}
		<Sun />
	{:else}
		<Moon />
	{/if}
</Button>
