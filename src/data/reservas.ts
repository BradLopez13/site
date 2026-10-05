// Copied from the reservas repository, pinned to the last commit that touched each file, with the
// lines they come from (line breaks added where a line is too long to read). If the code there
// changes, update it here too. The words around each step live in src/i18n/*.json under backend.steps.<id>.

export const backendSteps = [
	{
		id: 'http' as const,
		file: 'apps/api/src/modules/reservas/infra/http/rutas.ts',
		commit: '5ad058d',
		lines: [11, 13],
		code: "app.post('/api/reservas', privada, crearReserva(ctx));\napp.get('/api/reservas/mias', privada, misReservas(ctx));\napp.delete('/api/reservas/:id', privada, cancelarReserva(ctx));",
	},
	{
		id: 'contract' as const,
		file: 'packages/contracts/src/reservas.ts',
		commit: '95e7cdf',
		lines: [6, 6],
		code: 'export const CrearReservaBodySchema = z.object({\n  pistaId: z.uuid(),\n  inicio: z.iso.datetime(),\n});',
	},
	{
		id: 'idempotency' as const,
		file: 'apps/api/src/modules/reservas/infra/http/idempotencia.ts',
		commit: 'debed11',
		lines: [16, 24],
		code: "const clave = z.uuid().parse(req.headers['idempotency-key']);\nconst usuarioId = req.sesion!.usuario.id;\nconst hashPeticion = createHash('sha256').update(JSON.stringify(req.body)).digest('hex');\nconst registro = { usuarioId, clave };\n\nconst inicio = await ctx.db.transaction((tx) => ctx.repos.idempotencia.iniciar(tx, { ...registro, hashPeticion, ahora: ctx.ahora() }));\nif (inicio.estado === 'en_curso') throw new IdempotenciaEnCurso();\nif (inicio.estado === 'conflicto') throw new IdempotenciaConflicto();\nif (inicio.estado === 'terminada') return reply.status(inicio.estadoHttp).send(inicio.respuesta);",
	},
	{
		id: 'repository' as const,
		file: 'apps/api/src/modules/reservas/infra/persistence/reservas/exclude.ts',
		commit: '5ad058d',
		lines: [10, 17],
		code: "async crear(tx, d) {\n  try {\n    return await insertar(tx, d);\n  } catch (e) {\n    if (codigoPg(e) === '23P01') throw new PistaOcupadaError();\n    throw e;\n  }\n},",
	},
	{
		id: 'postgres' as const,
		file: 'apps/api/drizzle/0001_exclude_solape.sql',
		commit: '4385119',
		lines: [4, 4],
		code: 'EXCLUDE USING gist ("pista_id" WITH =, "periodo" WITH &&)\n  WHERE ("estado" = \'confirmada\');',
	},
];

// Shapes from packages/contracts (ReservaSchema, ErrorRespuestaSchema) and the real message
// of PistaOcupadaError. Pádel 1 opens 09:00-22:00 in 90-minute slots, so 19:30 is a real slot.
export const pista = { id: '7e515718-c54a-49a2-8f40-d6a43116247b', nombre: 'Pádel 1', franja: '19:30' };

// The slot is always tomorrow at pista.franja, Madrid time, so the demo never books the past.
// Madrid is UTC+1 or UTC+2 depending on the date; the offset is read for that day.
export function slotTimes(now = new Date()) {
	const [h, m] = pista.franja.split(':').map(Number);
	const day = new Date(now.getTime() + 864e5);
	const ymd = new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(day).split('-').map(Number);
	const guess = Date.UTC(ymd[0], ymd[1] - 1, ymd[2], h, m);
	const name = new Intl.DateTimeFormat('en-US', { timeZone: 'Europe/Madrid', timeZoneName: 'longOffset' }).formatToParts(guess).find((p) => p.type === 'timeZoneName')?.value ?? 'GMT+01:00';
	const [, sign, oh, om] = name.match(/([+-])(\d{2}):?(\d{2})?/) ?? ['', '+', '01', '00'];
	const offset = (sign === '-' ? -1 : 1) * (Number(oh) * 60 + Number(om ?? 0)) * 6e4;
	const start = guess - offset;
	return { inicio: new Date(start).toISOString(), fin: new Date(start + 90 * 6e4).toISOString() };
}

export const created = (slot: ReturnType<typeof slotTimes>) => ({
	id: 'b8e1c2d4-5f60-4a7b-8c9d-0e1f2a3b4c5d',
	pistaId: pista.id,
	pistaNombre: pista.nombre,
	deporte: 'padel',
	...slot,
	estado: 'confirmada',
});

export const occupied = { error: { code: 'PISTA_OCUPADA', message: 'Esa franja ya está reservada' } };

export const requestBody = (slot: ReturnType<typeof slotTimes>) => ({ pistaId: pista.id, inicio: slot.inicio });
