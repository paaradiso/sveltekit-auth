<script>
	import SignUpForm from './SignUpForm.svelte';
	import * as Card from '$lib/components/ui/card';
	export let data;
</script>

<div class="container flex items-center justify-center">
	<Card.Root class="flex w-[500px] flex-col items-center justify-center gap-2">
		<Card.Header class="text-4xl font-semibold">Sign Up</Card.Header>
		<Card.Content class="flex w-full flex-col gap-4">
			<SignUpForm data={data.form} />
			<div class="flex justify-center gap-1">
				<span class="text-sm">Already have an account?</span>
				<a href="/auth/signin" class="text-sm font-semibold">Sign In</a>
			</div>
		</Card.Content>
	</Card.Root>
</div>
