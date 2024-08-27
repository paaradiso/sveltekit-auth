<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { Eye, EyeOff } from 'lucide-svelte';
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

	let showPassword = false;
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
	<Form.Field {form} name="usernameOrEmail">
		<Form.Control let:attrs>
			<Form.Label>Username or Email</Form.Label>
			<Input {...attrs} bind:value={$formData.usernameOrEmail} />
		</Form.Control>
		<Form.Description>Enter your username or email address to sign in.</Form.Description>
		<Form.FieldErrors class="flex flex-col">
			{#each $errors.usernameOrEmail || [] as error}
				<p
					transition:slide={{ duration: 300 }}
					class="whitespace-pre-line text-sm text-destructive"
				>
					{error}
				</p>
			{/each}
		</Form.FieldErrors>
	</Form.Field>
	<Form.Field {form} name="password">
		<Form.Control let:attrs>
			<Form.Label>Password</Form.Label>
			<div class="flex">
				<Input
					type={showPassword ? 'text' : 'password'}
					{...attrs}
					bind:value={$formData.password}
				/>
				<button on:click={() => (showPassword = !showPassword)} type="button" class="-ml-8">
					{#if showPassword}
						<EyeOff size={20} />
					{:else}
						<Eye size={20} />
					{/if}
				</button>
			</div>
		</Form.Control>
		<Form.Description>Enter your account password.</Form.Description>
		<Form.FieldErrors class="flex flex-col">
			{#each $errors.password || [] as error}
				<p
					transition:slide={{ duration: 300 }}
					class="whitespace-pre-line text-sm text-destructive"
				>
					{error}
				</p>
			{/each}
		</Form.FieldErrors>
	</Form.Field>
	<div class="my-2 flex items-center justify-center">
		<Turnstile siteKey={PUBLIC_CF_TURNSTILE_SITE_KEY} theme={$theme} />
	</div>
	<Form.Button>Submit</Form.Button>
</form>
