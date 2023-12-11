import { TbDeviceGamepad } from 'react-icons/tb';
import { HiOutlineShare } from 'react-icons/hi';
import { GrUpdate } from 'react-icons/gr';
import { TbDeviceDesktop } from 'react-icons/tb';
import { RiCalendarEventLine } from 'react-icons/ri';
import { IconType } from 'react-icons';

export const menuItems = [
	{
		id: 1,
		name: 'Spiele',
		to: '/Spiele',
		// icon: 'Game.svg',
		icon: TbDeviceGamepad,
	},
	{
		id: 2,
		name: 'Reihenupdate',
		to: '/Reihenupdate',
		// icon: 'Update.svg',
		icon: GrUpdate,
	},
	{
		id: 3,
		name: 'Export',
		to: '/Export',
		// icon: 'Export.svg',
		icon: HiOutlineShare,
	},
	{
		id: 4,
		name: 'Plattformen',
		to: '/Plattformen',
		// icon: 'Platform.svg',
		icon: TbDeviceDesktop,
	},
	{
		id: 5,
		name: 'Events',
		to: '/Events',
		// icon: 'Event.svg',
		icon: RiCalendarEventLine,
	},
] as const satisfies readonly MenuItem[];

export type MenuItem = {
	id: number;
	name: string;
	to: string;
	icon: IconType;
};
