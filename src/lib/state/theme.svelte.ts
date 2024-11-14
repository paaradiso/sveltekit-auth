class Theme {
	value = $state('light');

	contructor() {
		$effect.root(() => {
			$effect(() => {
				const storedTheme = localStorage.getItem('theme');
				const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

				if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
					this.value = 'dark';
				}
			});
		});
	}

	toggleTheme() {
		this.value = this.value === 'light' ? 'dark' : 'light';

		localStorage.setItem('theme', this.value);
		document.documentElement.classList.toggle('dark', this.value === 'dark');

		const meta = document.querySelector('meta[name="color-scheme"]') as HTMLMetaElement;
		if (meta) meta.content = this.value;

		return this.value;
	}
}

export const theme = new Theme();
