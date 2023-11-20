import type { LexicalEditor } from 'lexical';
import { getContext, setContext } from 'svelte';

export const setEditor = (editor: LexicalEditor) => {
	setContext('editor', editor);
};

export const getEditor = () => {
	return getContext<LexicalEditor>('editor');
};
