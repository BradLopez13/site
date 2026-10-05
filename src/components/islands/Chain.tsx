// A left-to-right chain diagram: each node is [title, detail]; `me` marks the steps that are Brad's own.
// Used by the work tabs (React) and rendered statically from Astro pages, where data-i18n keys keep its words translatable.
export default function Chain({ nodes, label, me = [], keyBase, draw }: { nodes: string[][]; label: string; me?: number[]; keyBase?: string; draw?: boolean }) {
	const w = 640, gap = 36, nw = (w - gap * (nodes.length - 1)) / nodes.length, h = 104;
	return (
		<svg className="diagram" viewBox={`-4 0 ${w + 8} ${h}`} role="img" aria-label={label} data-draw={draw ? '' : undefined}>
			{nodes.slice(0, -1).map((_, i) => {
				const x = i * (nw + gap);
				return <path key={`w${i}`} className="wire" d={`M${x + nw + 2} ${h / 2} H${x + nw + gap - 2}`} />;
			})}
			{nodes.map(([t, s], i) => {
				const x = i * (nw + gap);
				return (
					<g key={i} className={me.includes(i) ? 'node me' : 'node'}>
						<rect x={x} y={8} width={nw} height={h - 16} rx={10} />
						<text x={x + 14} y={44} data-i18n={keyBase ? `${keyBase}.${i}.0` : undefined}>
							{t}
						</text>
						<text className="s" x={x + 14} y={68} data-i18n={keyBase ? `${keyBase}.${i}.1` : undefined}>
							{s}
						</text>
					</g>
				);
			})}
		</svg>
	);
}
