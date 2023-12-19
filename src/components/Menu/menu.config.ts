import { TbDeviceGamepad } from 'react-icons/tb';
import { HiOutlineShare } from 'react-icons/hi';
import { RxUpdate } from 'react-icons/rx';
import { RiCalendarEventLine } from 'react-icons/ri';
import { IconType } from 'react-icons';
import { GiPlatform } from 'react-icons/gi';

export const menuItems = [
	{
		id: 1,
		name: 'Spiele',
		to: '/Spiele',
		icon: TbDeviceGamepad,
	},
	{
		id: 2,
		name: 'Reihenupdate',
		to: '/Reihenupdate',
		icon: RxUpdate,
	},
	{
		id: 3,
		name: 'Export',
		to: '/Export',
		icon: HiOutlineShare,
	},
	{
		id: 4,
		name: 'Plattformen',
		to: '/Plattformen',
		icon: GiPlatform,
	},
	{
		id: 5,
		name: 'Events',
		to: '/Events',
		icon: RiCalendarEventLine,
	},
] as const satisfies readonly MenuItem[];

export type MenuItem = {
	id: number;
	name: string;
	to: string;
	icon: IconType;
};
