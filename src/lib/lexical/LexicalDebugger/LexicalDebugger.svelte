<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getEditor } from '$lib/lexical/LexicalComposer/LexicalComposerContext';
	import {
		$getSelection as _$getSelection,
		$isRangeSelection as _$isRangeSelection,
		$isNodeSelection as _$isNodeSelection,
		COMMAND_PRIORITY_HIGH,
		SELECTION_CHANGE_COMMAND
	} from 'lexical';
	import { browser, dev } from '$app/environment';
	import { portal } from '$lib/utils/portal';
	import { BugPlay } from 'lucide-svelte';
	import { createPopover } from '@melt-ui/svelte';

	// todo: show selection

	let target: HTMLElement | null;

	const {
		elements: { trigger, content },
		states: { open }
	} = createPopover({
		defaultOpen: true,
		closeOnOutsideClick: false,
		positioning: {
			placement: 'bottom',
			gutter: 10
		}
	});

	const editor = getEditor();

	let recentCommands: { time: string; type: string; payload: unknown }[] = [];
	const MAX_SIZE = 10;
	let unRegisterCommandListeners = new Set<() => void>();
	let currentSelection: {
		type: string;
		textContent: string;
	} = { type: '', textContent: '' };

	onMount(() => {
		target = document.querySelector('#main');

		const commands = editor._commands;

		for (const [command] of commands) {
			console.log(`Registering ${JSON.stringify(command)}`);
			unRegisterCommandListeners.add(
				editor.registerCommand(
					SELECTION_CHANGE_COMMAND,
					() => {
						const selection = _$getSelection();
						const type =
							selection === null
								? 'null'
								: _$isRangeSelection(selection)
								  ? 'RangeSelection'
								  : _$isNodeSelection(selection)
								    ? 'NodeSelection'
								    : 'UNKNOWN';
						currentSelection = { type: type, textContent: selection?.getTextContent() ?? 'N/A' };
						return false;
					},
					COMMAND_PRIORITY_HIGH
				)
			);

			const unRegisterCommandListener = editor.registerCommand(
				command,
				(payload) => {
					if (recentCommands.length >= MAX_SIZE) {
						recentCommands.shift();
					}
					recentCommands = [
						...recentCommands,
						{
							time: Intl.DateTimeFormat('default', {
								hour: '2-digit',
								minute: '2-digit',
								second: '2-digit',
								hour12: false
							}).format(Date.now()),
							type: command.type ?? 'UNKNOWN',
							payload
						}
					];
					return false;
				},
				COMMAND_PRIORITY_HIGH
			);

			unRegisterCommandListeners.add(unRegisterCommandListener);
		}
	});
	onDestroy(() => {
		if (browser) unRegisterCommandListeners.forEach((unregister) => unregister());
	});
</script>

{#if dev && browser}
	<div use:portal={target}>
		<button {...$trigger} use:trigger class="absolute right-0 top-0">
			<BugPlay />
		</button>
		{#if $open}
			<div {...$content} use:content class="max-w-2xl bg-white/90 p-2 text-xs ring-1 ring-gray-500">
				<h2 class="text-base">Debugger</h2>
				<pre>{#each recentCommands as command, index (index)}{JSON.stringify(
							{ ...command },
							null
						)}<br />{/each}</pre>
				<h3 class="text-base">Selection</h3>
				<pre>{JSON.stringify(currentSelection, null)}</pre>
			</div>
		{/if}
	</div>
{/if}
