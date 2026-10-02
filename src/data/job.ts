// Work at my current job, told without code, clients or figures. The words live in
// src/i18n/*.json under job.themes.<id>; this file keeps what does not change with the language.

export type JobId = 'integration' | 'standards' | 'product' | 'cloud' | 'people';

export const jobThemes: { id: JobId; stack: string[]; hasCase?: boolean }[] = [
	{ id: 'integration', stack: ['TypeScript', 'Node.js', 'Express'], hasCase: true },
	{ id: 'standards', stack: ['ESLint', 'GitHub Actions', 'Husky', 'Commitlint'] },
	{ id: 'product', stack: ['React', 'Vite', 'Express', 'MongoDB'] },
	{ id: 'cloud', stack: ['Azure Cosmos DB', 'Azure Storage'] },
	{ id: 'people', stack: ['Mentoring', 'Code review'] },
];

export const caseSlug = 'invoicing-integration';

export const stackDaily = ['TypeScript', 'React', 'Vite', 'Node.js', 'Express', 'REST APIs', 'MongoDB', 'Azure Cosmos DB', 'Azure Storage', 'GitHub Actions', 'Docker'];

// Illustrative lint rule names shown next to each layer in the standards diagram.
export const layerRules = [
	['max-lines', 'max-lines-per-function'],
	['max-lines', 'complexity'],
	['max-lines', 'no-restricted-imports'],
	['no-explicit-any', 'strict TypeScript'],
];

export const skills = {
	daily: ['TypeScript', 'React', 'Node.js', 'REST APIs', 'MongoDB', 'Cosmos DB', 'Azure Storage', 'GitHub Actions', 'Docker', 'Jest', 'ESLint', 'Husky, Commitlint'],
	own: ['Fastify', 'PostgreSQL', 'Drizzle', 'Zod', 'Vitest', 'Testcontainers', 'Playwright', 'Angular 19', 'Firebase', 'Vercel'],
	before: ['Java', 'Python', 'PHP', 'MySQL', 'Power BI', 'Android Studio'],
} as const;

export const pathStops = ['dam', 'daw', 'delogica', 'mrgates', 'now'] as const;
export const pathTags: Record<(typeof pathStops)[number], string[]> = {
	dam: ['Java', 'SQL', 'Android'],
	daw: ['Angular', 'Firebase', 'Java', 'Python'],
	delogica: ['Python', 'ADB', 'Scrum'],
	mrgates: ['PHP', 'MySQL', 'Docker'],
	now: ['TypeScript', 'React', 'Node.js', 'Azure'],
};
