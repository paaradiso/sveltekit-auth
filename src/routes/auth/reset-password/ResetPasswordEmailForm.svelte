<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { theme } from '$lib/stores/theme';
	import { Turnstile } from 'svelte-turnstile';
	import { PUBLIC_CF_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { slide } from 'svelte/transition';

	export let data;
	const form = superForm(data, {
		validators: zodClient(formSchema)
	});
	const { form: formData, enhance, errors } = form;
</script>

<form method="POST" use:enhance class="flex flex-col gap-2">
	<div>
		{#if $errors.other}
			<p transition:slide={{ duration: 300 }} class="text-sm text-destructive">
				{$errors.other.join(', ')}
			</p>
		{/if}
	</div>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} type="email" bind:value={$formData.email} />
		</Form.Control>
		<Form.Description>Please enter the email you used to sign up.</Form.Description>
		<Form.FieldErrors>
			{#if $errors.email}
				<p transition:slide={{ duration: 300 }} class="text-sm text-destructive">
					{$errors.email}
				</p>
			{/if}
		</Form.FieldErrors>
	</Form.Field>
	<div class="my-2 flex items-center justify-center">
		<Turnstile siteKey={PUBLIC_CF_TURNSTILE_SITE_KEY} theme={$theme} />
	</div>
	<Form.Button>Submit</Form.Button>
</form>
