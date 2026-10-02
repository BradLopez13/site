import type { KeyboardEvent } from 'react';

// Arrow keys, Home and End move between tabs and select them, as in the WAI-ARIA tabs pattern.
// Pair it with tabIndex={selected ? 0 : -1} so Tab enters the list once and leaves it.
const moves: Record<string, (i: number, n: number) => number> = {
	ArrowRight: (i) => i + 1,
	ArrowDown: (i) => i + 1,
	ArrowLeft: (i) => i - 1,
	ArrowUp: (i) => i - 1,
	Home: () => 0,
	End: (_, n) => n - 1,
};

export function onTabKey(e: KeyboardEvent<HTMLElement>, index: number, count: number, select: (next: number) => void) {
	const move = moves[e.key];
	if (!move) return;
	e.preventDefault();
	const next = (move(index, count) + count) % count;
	select(next);
	const tabs = e.currentTarget.closest('[role="tablist"]')?.querySelectorAll<HTMLElement>('[role="tab"]');
	tabs?.[next]?.focus();
}
