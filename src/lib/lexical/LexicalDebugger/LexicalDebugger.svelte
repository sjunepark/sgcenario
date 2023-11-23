<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getEditor } from '$lib/lexical/LexicalComposer/LexicalComposerContext';
	import { COMMAND_PRIORITY_HIGH } from 'lexical';
	import { browser, dev } from '$app/environment';
	import { portal } from '$lib/utils/portal';

	// todo: show selection

	const editor = getEditor();

	let recentCommands: { type: string; payload: unknown }[] = [];
	const MAX_SIZE = 10;
	let unRegisterCommandListeners = new Set<() => void>();

	let target: HTMLElement | null;

	onMount(() => {
		target = document.querySelector('#main');

		const commands = editor._commands;

		for (const [command] of commands) {
			console.log(`Registering ${JSON.stringify(command)}`);
			const unRegisterCommandListener = editor.registerCommand(
				command,
				(payload) => {
					console.log(`${command.type}`);
					if (recentCommands.length >= MAX_SIZE) {
						recentCommands.shift();
					}
					recentCommands = [...recentCommands, { type: command.type ?? 'UNKNOWN', payload }];
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
	<div use:portal={target} class="absolute left-0 top-0">
		<h2>Debugger</h2>
		{#each recentCommands as command, index (index)}
			<div class="command">
				{JSON.stringify(command, null, 2)}
			</div>
		{/each}
		<button
			on:click={() => {
				console.log(recentCommands);
			}}
		>
			Log commands
		</button>
	</div>
{/if}
