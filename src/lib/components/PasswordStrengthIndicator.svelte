<script>
	import z from 'zxcvbn';
	export let password;

	let bgColours = ['bg-red-400', 'bg-orange-400', 'bg-yellow-400', 'bg-green-400'];
	let textColours = ['text-red-400', 'text-orange-400', 'text-yellow-400', 'text-green-400'];
	let strengthText = ['Too Weak', 'Weak', 'Good', 'Strong'];

	$: score = z(password || 'a').score;
</script>

<div class="flex h-0 flex-col gap-1">
	<div class="flex gap-2">
		{#each Array(score).fill(0) as _}
			<div class="h-1 w-1/4 rounded-lg {bgColours[score - 1]}" />
		{/each}
		{#each Array(4 - score).fill(0) as _}
			<div class="h-1 w-1/4 rounded-lg bg-zinc-200 dark:bg-zinc-700" />
		{/each}
	</div>
	<div class="flex w-full justify-end text-sm {textColours[score - 1]}">
		{strengthText[score - 1] || ''}
	</div>
</div>
