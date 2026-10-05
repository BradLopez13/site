import { useRef, useState } from 'react';
import { dict, type Lang } from '../../i18n';
import { Btn, fill, hex, Lab, type Entry, type Tone } from './Lab';

// Sessions in reservas: an opaque token in an HttpOnly cookie, only its hash on the server,
// 7 days without activity and 30 days from login at most. Changing the password keeps the
// current session and revokes the others; closing every session revokes the current one too.
const IDLE = 7;
const MAX = 30;

type Device = 'laptop' | 'phone';
interface Session {
	id: number;
	device: Device;
	created: number;
	last: number;
}

const expiry = (s: Session) => Math.min(s.last + IDLE, s.created + MAX);

export default function SessionsLab({ lang }: { lang: Lang }) {
	const t = dict(lang).labs;
	const s = t.sessions;
	const [day, setDay] = useState(0);
	const [sessions, setSessions] = useState<Session[]>([]);
	const [cookies, setCookies] = useState<Partial<Record<Device, number>>>({});
	const [log, setLog] = useState<Entry[]>([]);
	const [pulse, setPulse] = useState({ n: 0, tone: 'info' as Tone });
	const seq = useRef(0);

	const name = (d: Device) => s[d];
	const say = (status: string, tone: Tone, text: string) => {
		seq.current += 1;
		const id = seq.current;
		setLog((l) => [{ id, status, tone, text }, ...l].slice(0, 5));
		setPulse({ n: id, tone });
	};
	const valid = (x: Session | undefined, now = day) => !!x && now <= expiry(x);

	const login = (d: Device) => {
		seq.current += 1;
		const id = seq.current;
		setSessions((all) => [...all, { id, device: d, created: day, last: day }]);
		setCookies((c) => ({ ...c, [d]: id }));
		say('200', 'ok', fill(s.loggedIn, { device: name(d) }));
	};

	const request = (d: Device) => {
		const id = cookies[d];
		if (id == null) return say('401', 'bad', fill(s.noCookie, { device: name(d) }));
		const found = sessions.find((x) => x.id === id);
		if (!valid(found)) return say('401', 'bad', fill(s.rejected, { device: name(d) }));
		const next = { ...found!, last: day };
		setSessions((all) => all.map((x) => (x.id === id ? next : x)));
		const capped = next.last + IDLE > next.created + MAX;
		say('200', 'ok', fill(capped ? s.okCapped : s.ok, { device: name(d), n: expiry(next) }));
	};

	const logout = (d: Device) => {
		const id = cookies[d];
		setSessions((all) => all.filter((x) => x.id !== id));
		setCookies((c) => ({ ...c, [d]: undefined }));
		say('204', 'info', fill(s.loggedOut, { device: name(d) }));
	};

	const laptopSession = () => sessions.find((x) => x.id === cookies.laptop);

	const changePassword = () => {
		const own = laptopSession();
		if (!valid(own)) return say('401', 'bad', s.needsSession);
		setSessions((all) => all.filter((x) => x.id === own!.id));
		say('204', 'info', s.pwChanged);
	};

	const closeAll = () => {
		if (!valid(laptopSession())) return say('401', 'bad', s.needsSession);
		setSessions([]);
		say('204', 'info', s.allClosed);
	};

	const idle = () => {
		setDay((n) => n + 8);
		say('+8', 'warn', s.idleDone);
	};

	const active = () => {
		const now = day + 6;
		setDay(now);
		// Every device that still has a valid session keeps using it during those days.
		setSessions((all) =>
			all.map((x) => {
				if (!Object.values(cookies).includes(x.id)) return x;
				let last = x.last;
				for (let d = day + 1; d <= now; d++) if (d <= Math.min(last + IDLE, x.created + MAX)) last = d;
				return { ...x, last };
			}),
		);
		say('+6', 'info', s.activeDone);
	};

	const readJs = () => say('""', 'info', s.readJs);

	const reset = () => {
		setDay(0);
		setSessions([]);
		setCookies({});
		setLog([]);
		setPulse({ n: 0, tone: 'info' });
	};

	const devices: Device[] = ['laptop', 'phone'];

	return (
		<Lab
			title={s.title}
			pulse={pulse.n}
			tone={pulse.tone}
			log={log}
			logTitle={t.log}
			empty={t.empty}
			note={t.note}
			controls={
				<>
					<Btn onClick={changePassword}>{s.changePw}</Btn>
					<Btn onClick={closeAll}>{s.closeAll}</Btn>
					<Btn onClick={active}>{s.active}</Btn>
					<Btn onClick={idle}>{s.idle}</Btn>
					<Btn onClick={readJs}>{s.readJsBtn}</Btn>
					<Btn onClick={reset}>{t.reset}</Btn>
				</>
			}
			left={
				<>
					<h4>
						{t.browsers} <span className="lab-day">{fill(s.day, { n: day })}</span>
					</h4>
					{devices.map((d) => (
						<div key={d} className="lab-device">
							<b>{name(d)}</b>
							<code className={cookies[d] != null ? 'has' : ''}>{cookies[d] != null ? s.cookieSet : s.cookieNone}</code>
							<div className="lab-mini">
								<Btn onClick={() => login(d)} disabled={cookies[d] != null}>
									{s.login}
								</Btn>
								<Btn onClick={() => request(d)}>{s.request}</Btn>
								<Btn onClick={() => logout(d)} disabled={cookies[d] == null}>
									{s.logout}
								</Btn>
							</div>
						</div>
					))}
				</>
			}
			right={
				<>
					<h4>{s.serverTitle}</h4>
					{sessions.length === 0 ? (
						<p className="lab-empty">{s.none}</p>
					) : (
						<table className="lab-table">
							<thead>
								<tr>
									<th>{s.device}</th>
									<th>{s.stored}</th>
									<th>{s.expires}</th>
								</tr>
							</thead>
							<tbody>
								{sessions.map((x) => (
									<tr key={x.id} className={valid(x) ? '' : 'dead'}>
										<td>{name(x.device)}</td>
										<td>
											<code>sha256 {hex(x.id, 10)}…</code>
										</td>
										<td>{valid(x) ? fill(s.dayN, { n: expiry(x) }) : s.expired}</td>
									</tr>
								))}
							</tbody>
						</table>
					)}
				</>
			}
		/>
	);
}
