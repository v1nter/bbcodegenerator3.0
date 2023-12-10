export const menuItems = [
	{
		id: 1,
		name: 'Spiele',
		to: '/',
		icon: 'Game.svg',
	},
	{
		id: 2,
		name: 'Reihenupdate',
		to: '/Reihenupdate',
		icon: 'Update.svg',
	},
	{
		id: 3,
		name: 'Export',
		to: '/Export',
		icon: 'Export.svg',
	},
	{
		id: 4,
		name: 'Plattformen',
		to: '/Plattformen',
		icon: 'Platform.svg',
	},
	{
		id: 5,
		name: 'Events',
		to: '/Events',
		icon: 'Event.svg',
	},
] as const satisfies readonly MenuItem[];

export type MenuItem = {
	id: number;
	name: string;
	to: string;
	icon: string;
};
