import type { Game, Platform, Trailer, Event } from '@prisma/client';

// ########################
// #
// # Game, Platform, Trailer und Event stammen aus dem Prisma-Schema
// #
// ########################
export type GameData = Game & { Platform: Platform[] } & {
	Trailer: Trailer[];
} & { Event: Event };

// ##################
// #
// # IGDB liefert Daten zu Game, Platform, Trailer teilweise in anderen
// # Formaten => eigene Typen
// #
// ##################

export type IGDBTrailer = {
	name: string;
	video_id: string;
};

type IGDBReleaseDate = {
	human: string;
};

type IGDBPlatform = {
	name: string;
};

type IGDBCover = {
	url: string;
};

type IGDBGame = {
	id: number;
	name: string;
};

export type IGDBGameData = IGDBGame & { videos: IGDBTrailer[] } & {
	release_dates: IGDBReleaseDate[];
} & { platforms: IGDBPlatform[] } & { cover: IGDBCover };
