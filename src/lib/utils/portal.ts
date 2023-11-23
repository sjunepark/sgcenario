import type { Action } from 'svelte/action';

export const portal: Action<HTMLElement, HTMLElement | null> = (node, target) => {
	const update = (target: HTMLElement | null) => {
		if (target) {
			target.appendChild(node);
		}
		// else just render in the current position
		node.hidden = false;
	};
	update(target);
	return {
		destroy() {},
		update
	};
};
