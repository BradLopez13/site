// Copied from the reservas repository. If the code there changes, update it here too.

export const backendSteps = [
	{
		label: 'HTTP',
		title: 'The request arrives',
		file: 'apps/api/src/modules/reservas/infra/http/rutas.ts',
		text: 'Only signed-in users can book. The session is an opaque cookie, checked before the handler runs.',
		code: "app.post('/api/reservas', privada, crearReserva(ctx));\napp.get('/api/reservas/mias', privada, misReservas(ctx));\napp.delete('/api/reservas/:id', privada, cancelarReserva(ctx));",
	},
	{
		label: 'Contract',
		title: 'One schema, both ends',
		file: 'packages/contracts/src/reservas.ts',
		text: 'The same Zod schema validates this body on the server and types the form on the client.',
		code: 'export const CrearReservaBodySchema = z.object({\n  pistaId: z.uuid(),\n  inicio: z.iso.datetime(),\n});',
	},
	{
		label: 'Idempotency',
		title: 'Retries do not book twice',
		file: 'apps/api/src/modules/reservas/infra/http/idempotencia.ts',
		text: 'A repeated request with the same key and body gets the stored response instead of running again.',
		code: "const clave = z.uuid().parse(req.headers['idempotency-key']);",
	},
	{
		label: 'Repository',
		title: 'Translate the database',
		file: 'apps/api/src/modules/reservas/infra/persistence/reservas/exclude.ts',
		text: 'The insert either works or PostgreSQL refuses it with 23P01, which becomes a domain error: the court is taken.',
		code: "async crear(tx, d) {\n  try {\n    return await insertar(tx, d);\n  } catch (e) {\n    if (codigoPg(e) === '23P01') throw new PistaOcupadaError();\n    throw e;\n  }\n},",
	},
	{
		label: 'PostgreSQL',
		title: 'The database decides',
		file: 'apps/api/drizzle/0001_exclude_solape.sql',
		text: 'No two confirmed bookings for the same court may overlap in time. Whatever route inserts tomorrow, this still holds.',
		code: 'EXCLUDE USING gist ("pista_id" WITH =, "periodo" WITH &&)\n  WHERE ("estado" = \'confirmada\');',
	},
];

// Shapes from packages/contracts (ReservaSchema, ErrorRespuestaSchema) and the real message
// of PistaOcupadaError. Pádel 1 opens 09:00-22:00 in 90-minute slots, so 19:30 is a real slot.
export const pista = { id: '7e515718-c54a-49a2-8f40-d6a43116247b', nombre: 'Pádel 1', franja: '19:30' };

export const created = {
	id: 'b8e1c2d4-5f60-4a7b-8c9d-0e1f2a3b4c5d',
	pistaId: pista.id,
	pistaNombre: pista.nombre,
	deporte: 'padel',
	inicio: '2026-10-02T17:30:00.000Z',
	fin: '2026-10-02T19:00:00.000Z',
	estado: 'confirmada',
};

export const occupied = { error: { code: 'PISTA_OCUPADA', message: 'Esa franja ya está reservada' } };

export const requestBody = { pistaId: pista.id, inicio: created.inicio };
