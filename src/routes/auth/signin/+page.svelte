<script>
	import SignInForm from './SignInForm.svelte';
	import * as Card from '$lib/components/ui/card';
	export let data;
</script>

<div class="container flex items-center justify-center">
	<Card.Root class="flex w-[500px] flex-col items-center justify-center gap-2">
		<Card.Header class="text-4xl font-medium">Sign In</Card.Header>
		<Card.Content class="flex w-full flex-col gap-4">
			<SignInForm data={data.form} />
			<div class="flex justify-center gap-1">
				<span class="text-sm">Don't have an account?</span>
				<a href="/auth/signup" class="text-sm font-semibold">Sign up</a>
			</div>
			<a href="/auth/reset-password" class="text-center text-sm"> Forgot your password? </a>
		</Card.Content>
	</Card.Root>
</div>
