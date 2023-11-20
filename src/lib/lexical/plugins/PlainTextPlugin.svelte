<script lang="ts">
	import { getEditor } from '$lib/lexical/LexicalComposer/LexicalComposerContext';
	import { registerPlainText } from '@lexical/plain-text';

	const editor = getEditor();

	$: registerPlainText(editor);
</script>
