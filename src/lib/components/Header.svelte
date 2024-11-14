<script lang="ts">
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import ThemeSwitch from '$lib/components/ThemeSwitch.svelte';
	import { User } from 'lucide-svelte';
	import { page } from '$app/stores';
	$: user = $page.data.user;
	const avatarURL = ``;
	let signOutButton: HTMLButtonElement;
</script>

<div class="mb-10 border-b shadow dark:border-neutral-800">
	<div class="container flex h-14 items-center justify-between">
		<div class="flex flex-row items-center gap-4">
			<a href="/" class="text-sm">Home</a>
		</div>
		<div class="flex flex-row items-center gap-4">
			{#if user}
				<a href="/profile/{user.id}"><span class="text-sm">{user.username}</span></a>
			{:else}
				<a href="/auth/signin" class="text-sm">Sign In</a>
				<Button href="/auth/signup" class="h-8 text-sm">Sign Up</Button>
			{/if}
			<div class="hidden sm:block">
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						<Avatar.Root>
							<Avatar.Image src={avatarURL} alt={`@{user.username}`} />
							<Avatar.Fallback><User /></Avatar.Fallback>
						</Avatar.Root></DropdownMenu.Trigger
					>
					<DropdownMenu.Content>
						<DropdownMenu.Group>
							{#if user}
								<a href="/profile/{user.userId}"><DropdownMenu.Item>Profile</DropdownMenu.Item></a>
								<form action="/auth/signout" method="POST" id="signout"></form>
								<button
									type="submit"
									form="signout"
									class="hidden"
									bind:this={signOutButton}
									aria-label="sign-out-button"
								></button>
								<DropdownMenu.Item
									onclick={() => {
										signOutButton.click();
									}}>Sign Out</DropdownMenu.Item
								>
							{:else}
								<a href="/auth/signin"><DropdownMenu.Item>Sign In</DropdownMenu.Item></a>
								<a href="/auth/signup"><DropdownMenu.Item>Sign Up</DropdownMenu.Item></a>
							{/if}
						</DropdownMenu.Group>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</div>
			<ThemeSwitch />
		</div>
	</div>
</div>
