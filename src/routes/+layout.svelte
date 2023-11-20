<script lang="ts">
	import '../app.css';
	import 'overlayscrollbars/overlayscrollbars.css';
	import NavHeader from './NavHeader.svelte';
	import { OverlayScrollbars } from 'overlayscrollbars';
	import { onDestroy, onMount } from 'svelte';
	import { scrollbarStyle } from '$lib/configs/configs';

	let osInstance: OverlayScrollbars;
	onMount(() => {
		osInstance = OverlayScrollbars(document.body, scrollbarStyle);
	});
	onDestroy(() => {
		osInstance && osInstance.destroy();
	});
</script>

<div>
	<NavHeader />
	<main class="global-container relative mt-28">
		<slot />
	</main>
</div>
