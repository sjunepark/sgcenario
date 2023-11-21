<script lang="ts">
	import { getEditor } from '$lib/lexical/LexicalComposer/LexicalComposerContext';
	import { registerPlainText } from '@lexical/plain-text';
	import { onDestroy, onMount } from 'svelte';
	import { browser } from '$app/environment';

	const editor = getEditor();

	let unregisterPlainText: () => void;
	onMount(() => {
		unregisterPlainText = registerPlainText(editor);
	});
	onDestroy(() => {
		if (browser) unregisterPlainText();
	});
</script>
