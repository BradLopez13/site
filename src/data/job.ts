// Work at my current job, told without code, clients or figures.
// Nothing here may name a client, a vendor or an internal number.

export type JobTheme = {
	id: 'integration' | 'standards' | 'product' | 'cloud' | 'people';
	tag: string;
	title: string;
	headline: string;
	text: string;
	stack: string[];
	href?: string;
};

export const jobThemes: JobTheme[] = [
	{
		id: 'integration',
		tag: 'Integration',
		title: 'Bookings in, invoices out',
		headline: 'Event bookings in, invoices an accountant accepts out',
		text: 'A mapping and normalisation layer between an events platform and an invoicing ERP: simplified invoices, management expenses and VAT. I learned the accounting domain from scratch to model it correctly.',
		stack: ['TypeScript', 'Node.js', 'Express'],
		href: '/work/invoicing-integration/',
	},
	{
		id: 'standards',
		tag: 'Engineering',
		title: 'A standard the linter enforces',
		headline: 'A code standard nobody has to remember',
		text: 'There were no conventions. I wrote a layered architecture as lint rules, with size limits per layer, complexity limits and no any, plus the branching strategy, CI, Husky, Commitlint and pre-merge checks. Written for two developers; six work on it today.',
		stack: ['ESLint', 'GitHub Actions', 'Husky', 'Commitlint'],
	},
	{
		id: 'product',
		tag: 'Product',
		title: 'A multi-tenant events platform',
		headline: 'One platform, every company its own',
		text: 'Role-based permissions, theming per company and department, itineraries, budgets and cost modules driven by formulas. In production and growing.',
		stack: ['React', 'Vite', 'Express', 'MongoDB'],
	},
	{
		id: 'cloud',
		tag: 'Cloud',
		title: 'Travel management on Azure',
		headline: 'A travel app, modelled from zero on Azure',
		text: 'An application for an external client. I designed its NoSQL data model from scratch on Cosmos DB, with files in Azure Storage.',
		stack: ['Azure Cosmos DB', 'Azure Storage'],
	},
	{
		id: 'people',
		tag: 'People',
		title: 'Two interns, now juniors',
		headline: 'From intern to junior developer',
		text: 'Onboarding, task breakdown, code reviews and incident resolution, day to day, until both could work on their own on top of the team’s standard.',
		stack: ['Mentoring', 'Code review'],
	},
];

export const stackDaily = ['TypeScript', 'React', 'Vite', 'Node.js', 'Express', 'REST APIs', 'MongoDB', 'Azure Cosmos DB', 'Azure Storage', 'GitHub Actions', 'Docker'];
