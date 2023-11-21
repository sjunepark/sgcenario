<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { getEditor } from '$lib/lexical/LexicalComposer/LexicalComposerContext';
	import { COMMAND_PRIORITY_HIGH } from 'lexical';
	import { browser, dev } from '$app/environment';
	import Portal from '$lib/components/Portal.svelte';

	// todo: show selection

	const editor = getEditor();

	let recentCommands: { type: string; payload: unknown }[] = [];
	const MAX_SIZE = 10;
	let unRegisterCommandListeners = new Set<() => void>();

	onMount(() => {
		const commands = editor._commands;

		for (const [command] of commands) {
			unRegisterCommandListeners.add(
				editor.registerCommand(
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
				)
			);
		}
	});
	onDestroy(() => {
		if (browser) unRegisterCommandListeners.forEach((unregister) => unregister());
	});
</script>

{#if dev && browser}
	<!--todo: render to container-->
	<Portal target={document.querySelector('body')}>
		<h2>Debugger</h2>
		{#each recentCommands as command, index (index)}
			<div class="command">
				{command.type}
				{#if command.payload}
					<pre>{JSON.stringify(command.payload, null)}</pre>
				{/if}
			</div>
		{/each}
		<button
			on:click={() => {
				console.log(recentCommands);
			}}
		>
			Log commands
		</button>
	</Portal>
{/if}
