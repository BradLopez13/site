import { useState } from 'react';
import { dict, fmt, type Lang } from '../../i18n';

// Shows a screenshot until the visitor asks for the real app, so the page stays light.
// Session cookies are SameSite=Lax, so signing in only works in the app's own tab.
export default function LiveFrame({ lang, url, shot, alt, width, height }: { lang: Lang; url: string; shot: string; alt: string; width: number; height: number }) {
	const t = dict(lang).common;
	const [live, setLive] = useState(false);
	const host = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
	return (
		<div className="frame">
			<div className="frame-bar">
				<span className="frame-dots" aria-hidden="true">
					<i />
					<i />
					<i />
				</span>
				<span className="frame-url">{host}</span>
				<a className="frame-live" href={url} target="_blank" rel="noopener">
					{t.openNewTab}
				</a>
			</div>
			<div className="live">
				{live ? (
					<iframe src={url} title={fmt(t.liveTitle, { host })} loading="lazy" />
				) : (
					<>
						<img src={shot} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
						<div className="live-cover">
							<button type="button" className="btn btn-primary" onClick={() => setLive(true)}>
								{t.loadLive}
							</button>
						</div>
					</>
				)}
			</div>
			<p className="live-note">
				{live ? t.liveOn : t.liveIdle}
			</p>
		</div>
	);
}
