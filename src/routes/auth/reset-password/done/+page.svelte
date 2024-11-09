<script>
	import { CircleCheck } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex h-full flex-col items-center gap-4">
	<CircleCheck size={100} class="text-green-400" />
	<span class="text-4xl font-medium">Password Reset</span>
	<p>Your password has successfully been reset.</p>
	<Button href="/">Home</Button>
</div>
