<script lang="ts">
	import LexicalComposer from '$lib/lexical/LexicalComposer/LexicalComposer.svelte';
	import type { CreateEditorArgs } from 'lexical';
	import PlainTextPlugin from '$lib/lexical/plugins/PlainTextPlugin.svelte';
	import ContentEditable from './ContentEditable.svelte';
	import LexicalDebugger from '$lib/lexical/LexicalDebugger/LexicalDebugger.svelte';

	const editorConfig: CreateEditorArgs = {
		namespace: 'editor',
		onError: (error: Error) => {
			throw error;
		}
	};
</script>

<LexicalComposer {editorConfig}>
	<ContentEditable />
	<PlainTextPlugin />
	<LexicalDebugger />
</LexicalComposer>
