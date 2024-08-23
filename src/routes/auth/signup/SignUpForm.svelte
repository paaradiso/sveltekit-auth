<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import PasswordStrengthIndicator from '$lib/components/PasswordStrengthIndicator.svelte';
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';

	export let data;

	const form = superForm(data, {
		validators: zodClient(formSchema)
	});

	const { form: formData, enhance } = form;
</script>

<form method="POST" use:enhance class="flex flex-col gap-2">
	<Form.Field {form} name="username">
		<Form.Control let:attrs>
			<Form.Label>Username</Form.Label>
			<Input {...attrs} bind:value={$formData.username} />
		</Form.Control>
		<Form.Description>Choose a unique username that will identify you on our site.</Form.Description
		>
		<Form.FieldErrors class="h-4" />
	</Form.Field>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>Email</Form.Label>
			<Input {...attrs} type="email" bind:value={$formData.email} />
		</Form.Control>
		<Form.Description>We'll never share your email with anyone else.</Form.Description>
		<Form.FieldErrors class="h-4" />
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<Input type="password" {...attrs} bind:value={$formData.password} />
		</Form.Control>
		<PasswordStrengthIndicator password={$formData.password} />
		<Form.Description>Choose a strong password with at least 8 characters.</Form.Description>
		<Form.FieldErrors class="h-4" />
	</Form.Field>
	<Form.Field {form} name="confirmPassword">
		<Form.Control let:attrs>
			<Form.Label>Confirm Password</Form.Label>
			<Input type="password" {...attrs} bind:value={$formData.confirmPassword} />
		</Form.Control>
		<Form.Description>Re-enter your password to ensure it's correct.</Form.Description>
		<Form.FieldErrors class="h-4" />
	</Form.Field>

	<Form.Button>Submit</Form.Button>
</form>
