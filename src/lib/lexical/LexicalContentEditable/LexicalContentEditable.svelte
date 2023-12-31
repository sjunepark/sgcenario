<script lang="ts">
	import type { AriaAttributes } from 'svelte/elements';
	import { onDestroy, onMount } from 'svelte';
	import { getEditor } from '$lib/lexical/LexicalComposer/LexicalComposerContext';
	import { twMerge } from 'tailwind-merge';

	let { class: classProps, ...restProps } = $$restProps;

	export let ariaActiveDescendant: AriaAttributes['aria-activedescendant'] = undefined;
	export let ariaAutoComplete: AriaAttributes['aria-autocomplete'] = undefined;
	export let ariaControls: AriaAttributes['aria-controls'] = undefined;
	export let ariaDescribedBy: AriaAttributes['aria-describedby'] = undefined;
	export let ariaExpanded: AriaAttributes['aria-expanded'] = undefined;
	export let ariaLabel: AriaAttributes['aria-label'] = undefined;
	export let ariaLabelledBy: AriaAttributes['aria-labelledby'] = undefined;
	export let ariaMultiline: AriaAttributes['aria-multiline'] = undefined;
	export let ariaOwns: AriaAttributes['aria-owns'] = undefined;
	export let ariaRequired: AriaAttributes['aria-required'] = undefined;
	export let autocapitalize: HTMLDivElement['autocapitalize'] = 'off';
	export let dataTestid: string | null | undefined = undefined;

	export let role: HTMLDivElement['role'] = null;

	let isEditable = true;
	let contentEditableElement: HTMLDivElement;

	const editor = getEditor();

	let cleanup: ReturnType<typeof editor.registerEditableListener> = () => {};
	onMount(() => {
		editor.setRootElement(contentEditableElement);
		isEditable = editor.isEditable();
		cleanup = editor.registerEditableListener((currentIsEditable) => {
			isEditable = currentIsEditable;
		});
	});
	onDestroy(() => {
		cleanup();
	});
</script>

<!-- svelte-ignore a11y-aria-activedescendant-has-tabindex -->
<div
	class={twMerge(classProps, 'h-full min-h-[inherit] w-full')}
	bind:this={contentEditableElement}
	{...restProps}
	aria-activedescendant={!isEditable ? undefined : ariaActiveDescendant}
	aria-autocomplete={!isEditable ? 'none' : ariaAutoComplete}
	aria-controls={!isEditable ? undefined : ariaControls}
	aria-describedby={ariaDescribedBy}
	aria-expanded={!isEditable ? undefined : role === 'combobox' ? !!ariaExpanded : undefined}
	aria-label={ariaLabel}
	aria-labelledby={ariaLabelledBy}
	aria-multiline={ariaMultiline}
	aria-owns={!isEditable ? undefined : ariaOwns}
	aria-readonly={!isEditable ? true : undefined}
	aria-required={ariaRequired}
	{autocapitalize}
	contentEditable={isEditable}
	data-testid={dataTestid}
/>
