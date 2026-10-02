// Copied from the reservas repository. If the code there changes, update it here too.
// The words around each step live in src/i18n/*.json under backend.steps.<id>.

export const backendSteps = [
	{
		id: 'http' as const,
		file: 'apps/api/src/modules/reservas/infra/http/rutas.ts',
		code: "app.post('/api/reservas', privada, crearReserva(ctx));\napp.get('/api/reservas/mias', privada, misReservas(ctx));\napp.delete('/api/reservas/:id', privada, cancelarReserva(ctx));",
	},
	{
		id: 'contract' as const,
		file: 'packages/contracts/src/reservas.ts',
		code: 'export const CrearReservaBodySchema = z.object({\n  pistaId: z.uuid(),\n  inicio: z.iso.datetime(),\n});',
	},
	{
		id: 'idempotency' as const,
		file: 'apps/api/src/modules/reservas/infra/http/idempotencia.ts',
		code: "const clave = z.uuid().parse(req.headers['idempotency-key']);",
	},
	{
		id: 'repository' as const,
		file: 'apps/api/src/modules/reservas/infra/persistence/reservas/exclude.ts',
		code: "async crear(tx, d) {\n  try {\n    return await insertar(tx, d);\n  } catch (e) {\n    if (codigoPg(e) === '23P01') throw new PistaOcupadaError();\n    throw e;\n  }\n},",
	},
	{
		id: 'postgres' as const,
		file: 'apps/api/drizzle/0001_exclude_solape.sql',
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
