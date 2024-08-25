<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import PasswordStrengthIndicator from '$lib/components/PasswordStrengthIndicator.svelte';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { formSchema } from './schema';
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { theme } from '$lib/stores/theme';
	import { Turnstile } from 'svelte-turnstile';
	import { PUBLIC_CF_TURNSTILE_SITE_KEY } from '$env/static/public';
	import { slide, fade } from 'svelte/transition';

	export let data;
	const form = superForm(data, {
		validators: zodClient(formSchema)
	});
	let showPassword = false;
	let showConfirmPassword = false;
	const { form: formData, enhance, errors } = form;
</script>

<div>
	<form method="POST" use:enhance class="flex flex-col gap-2">
		<div>
			{#if $errors.other}
				<p transition:slide={{ duration: 300 }} class="text-sm text-destructive">
					{$errors.other.join(', ')}
				</p>
			{/if}
		</div>
		<Form.Field {form} name="username">
			<Form.Control let:attrs>
				<Form.Label>Username</Form.Label>
				<Input {...attrs} bind:value={$formData.username} />
			</Form.Control>
			<Form.Description
				>Choose a unique username that will identify you on our site.</Form.Description
			>
			<Form.FieldErrors>
				{#if $errors.username}
					<p transition:slide={{ duration: 300 }} class="text-sm text-destructive">
						{$errors.username}
					</p>
				{/if}
			</Form.FieldErrors>
		</Form.Field>
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>Email</Form.Label>
				<Input {...attrs} type="email" bind:value={$formData.email} />
			</Form.Control>
			<Form.Description>We'll never share your email with anyone else.</Form.Description>
			<Form.FieldErrors>
				{#if $errors.email}
					<p transition:slide={{ duration: 300 }} class="text-sm text-destructive">
						{$errors.email}
					</p>
				{/if}
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
			<PasswordStrengthIndicator password={$formData.password} />
			<Form.Description>Choose a strong password with at least 8 characters.</Form.Description>
			<Form.FieldErrors>
				{#if $errors.password}
					<p transition:slide={{ duration: 300 }} class="text-sm text-destructive">
						{$errors.password}
					</p>
				{/if}
			</Form.FieldErrors>
		</Form.Field>
		<Form.Field {form} name="confirmPassword">
			<Form.Control let:attrs>
				<Form.Label>Confirm Password</Form.Label>
				<div class="flex">
					<Input
						type={showConfirmPassword ? 'text' : 'password'}
						{...attrs}
						bind:value={$formData.confirmPassword}
					/>
					<button
						on:click={() => (showConfirmPassword = !showConfirmPassword)}
						type="button"
						class="-ml-8"
					>
						{#if showConfirmPassword}
							<EyeOff size={20} />
						{:else}
							<Eye size={20} />
						{/if}
					</button>
				</div>
			</Form.Control>
			<Form.Description>Re-enter your password to ensure it's correct.</Form.Description>
			<Form.FieldErrors class="flex flex-col">
				{#each $errors.confirmPassword || [] as error}
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
</div>
