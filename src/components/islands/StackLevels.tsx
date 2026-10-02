import { useState } from 'react';
import { onTabKey } from './tabs';
import { skills } from '../../data/job';
import { dict, type Lang } from '../../i18n';

// Honest levels: what I use every day, what I chose for my own projects, and what I used before or taught.
type Id = keyof typeof skills;

export default function StackLevels({ lang }: { lang: Lang }) {
	const t = dict(lang).about;
	const [id, setId] = useState<Id>('daily');
	const notes = t.notes as Record<string, string>;
	return (
		<div className="stack" style={{ ['--gap' as string]: '1.5rem' }}>
			<div className="seg" role="tablist" aria-label={t.knowLabel} style={{ alignSelf: 'flex-start' }}>
				{(Object.keys(skills) as Id[]).map((k, n, all) => (
					<button key={k} type="button" role="tab" aria-selected={k === id} tabIndex={k === id ? 0 : -1} onKeyDown={(e) => onTabKey(e, n, all.length, (m) => setId(all[m]))} onClick={() => setId(k)}>
						{t.levels[k].label}
					</button>
				))}
			</div>
			<p className="muted">{t.levels[id].text}</p>
			<ul className="skills" key={id} role="tabpanel">
				{skills[id].map((name) => (
					<li key={name}>
						<strong>{name}</strong>
						<span>{notes[name]}</span>
					</li>
				))}
			</ul>
		</div>
	);
}
