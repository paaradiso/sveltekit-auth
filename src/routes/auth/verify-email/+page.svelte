<script>
	import * as Card from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	export let data;
</script>

<div class="container flex items-center justify-center">
	<Card.Root class="flex w-[500px] flex-col items-center justify-center gap-2">
		<Card.Header class="text-4xl font-medium">Verify your email address</Card.Header>
		<Card.Content class="flex w-full flex-col gap-4">
			<div class="flex flex-col items-center justify-center gap-4 text-center">
				<p>
					We have sent a verification email to <span class="font-medium">{data.email}</span>.
				</p>
				<p>
					Please check your inbox and click the verification link to activate your account. The link
					will expire in 24 hours.
				</p>

				<div class="flex flex-col items-center justify-center gap-1">
					<p>Didn't receive the email?</p>
					<form action="?/resendEmail" method="POST">
						<Button type="submit">Resend email</Button>
					</form>
				</div>
			</div></Card.Content
		>
	</Card.Root>
</div>
