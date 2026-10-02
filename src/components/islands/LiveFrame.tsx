import { useState } from 'react';

// Shows a screenshot until the visitor asks for the real app, so the page stays light.
// Session cookies are SameSite=Lax, so signing in only works in the app's own tab.
export default function LiveFrame({ url, shot, alt, width, height }: { url: string; shot: string; alt: string; width: number; height: number }) {
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
					Open in a new tab
				</a>
			</div>
			<div className="live">
				{live ? (
					<iframe src={url} title={`${host}, the live app`} loading="lazy" />
				) : (
					<>
						<img src={shot} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
						<div className="live-cover">
							<button type="button" className="btn btn-primary" onClick={() => setLive(true)}>
								Load the live app here
							</button>
						</div>
					</>
				)}
			</div>
			<p className="live-note">
				{live
					? 'This is the deployed app. Browsing works here; to sign in and book, open it in a new tab.'
					: 'Loads the deployed app only when you ask for it, so this page stays fast.'}
			</p>
		</div>
	);
}
