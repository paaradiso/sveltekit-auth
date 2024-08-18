<script>
	function signOut() {
		fetch('/auth/signout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({})
		})
			.then(() => {
				window.location.href = '/';
			})
			.catch(() => {
				console.log('Error signing out');
			});
	}

	export let data;
</script>

<h1>{data.user?.username}</h1>
<a href="/auth/signup">Sign Up</a>
<a href="/auth/signin">Sign In</a>
<a on:click={signOut} class="hover:cursor-pointer">Sign Out</a>
<a href="/auth/reset-password">Reset Password</a>
