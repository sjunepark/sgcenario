<script lang="ts">
	import { createEditor, type CreateEditorArgs } from 'lexical';
	import { getEditor, setEditor } from '$lib/lexical/LexicalComposer/LexicalComposerContext';

	export let editorConfig: CreateEditorArgs;

	if (getEditor()) {
		throw new Error('There is already an editor in the context');
	}

	const editor = createEditor(editorConfig);
	setEditor(editor);
</script>

<slot />
