<script>
	import ResetPasswordEmailForm from './ResetPasswordEmailForm.svelte';
	import * as Card from '$lib/components/ui/card';
	export let data;
</script>

<div class="container flex items-center justify-center">
	<Card.Root class="flex w-[500px] flex-col items-center justify-center gap-2">
		<Card.Header class="text-4xl font-medium">Reset Password</Card.Header>
		<Card.Content class="flex w-full flex-col gap-4">
			<ResetPasswordEmailForm data={data.form} />
		</Card.Content>
	</Card.Root>
</div>
