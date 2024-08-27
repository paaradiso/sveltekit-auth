<script>
	import { CircleCheck } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
</script>

<div class="flex h-full flex-col items-center gap-4">
	<CircleCheck size={100} class="text-green-400" />
	<span class="text-4xl font-medium"> Verified </span>
	<p>Your email has successfully been verified. You can now sign in to your account.</p>
	<Button href="/auth/signin">Sign In</Button>
</div>
