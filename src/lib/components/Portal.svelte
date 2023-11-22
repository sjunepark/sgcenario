<script lang="ts">
	import type { Action } from 'svelte/action';

	export let target: HTMLElement | null;

	const portal: Action<HTMLElement, HTMLElement | null> = (node, actionTarget) => {
		const update = async (actionTarget: HTMLElement | null) => {
			if (actionTarget) {
				actionTarget.appendChild(node);
			}
			// else just render in the current position
			node.hidden = false;
		};
		update(actionTarget);
		return {
			destroy() {},
			update
		};
	};
</script>

<!--todo: remove component and just create a action const in a separate .ts file-->
<div class="absolute" use:portal={target} hidden>
	<slot />
</div>
