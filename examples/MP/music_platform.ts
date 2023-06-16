// The custom selection is used for providing an interface that is capable of enforcing a cardinality constraint, as well as some other eventual  constraints.
// We will use this implementation to create a collection of songs for an album
// A collection can have a minimum number of items and a maximum number of items.

import { CustomCollection } from '../../generated/strucTS_core/custom_collection';

// Declare the Song class
export class Song {
	// The title of the song
	title: string;
	// The duration/length of the song in seconds, considered an integer (but not enforced as of yet, not by TypeScript either, since there is no integer type)
	duration: number;
	// The reference to the album that the song is on, if any
	album: Album | null;

	/**
   * Create a new Song.
   *
   * @param title The title of the song
   * @param duration The duration/length of the song in seconds
   * @param album The album that the song is on, if any
   */
	constructor(parameterTitle: string, parameterDuration: number, album?: Album) {
		this.title = parameterTitle;
		this.duration = parameterDuration;
		this.album = album ?? null; // If album is undefined/falsy, assign null
	}
}

/**
 * Class for the AlbumFactory. It is responsible for creating new Album instances.
 */
class ArtistFactory {
	/**
   * Creates an artist
   * @param {string} name - The name of the artist
   */

	createArtist(title: string): Artist {
		return new Artist(title);
	}
}

export class Artist {
	name: string;

	constructor(parameterName: string) {
		this.name = parameterName;
	}

	/**
   * Get the name of the artist.
   *
   * @returns The name of the artist
   */
	getName(): string {
		return this.name;
	}
}

/**
 * Class for the Album object.
 *
 * An album has a title, an artist, and a collection of songs.
 */
export class Album {
	// The title of the album
	title: string;

	// The artist that is credited for the album
	artist: Artist;

	// The CustomCollection instance for songs in this album
	private readonly _songs: CustomCollection<Song>;

	/**
   * Create a new album.
   *
   * @param title The title of the album
   * @param artist The artist that is credited for the album
   */
	constructor(parameterTitle: string, parameterArtist: Artist) {
		this.title = parameterTitle;
		this.artist = parameterArtist;
		// Establish the cardinality constraint for the songs collection, i.e. an album must have at least 1 song (but no maximum)
		this._songs = new CustomCollection<Song>(1, null);
	}

	/**
   * Add a song to the album.
   *
   * @param song The song to add
   * @returns true if the song was added; false otherwise;
   */
	addSong(song: Song): boolean {
		return this._songs.add(song);
	}

	/**
   * Remove a song from the album.
   *
   * @param song The song to remove
   * @returns true if the song was removed; false otherwise; throws an error if the cardinality constraint is violated (i.e. the album would have less than 1 song)
   */
	removeSong(song: Song): boolean {
		return this._songs.remove(song);
	}

	/**
   * Get the songs in this album.
   *
   * @returns The songs in this album
   */
	getSongs(): Song[] {
		// Use the CustomCollection.getItems() method to polymorphically get the items in the collection
		return this._songs.getItems();
	}
}

export class Playlist {
	name: string;
	songs: CustomCollection<Song>;

	constructor() {
		this.name = '';
		this.songs = new CustomCollection<Song>(0, null);
	}

	/**
	 * Add a song to the playlist.
	 * @param song The song to add
	 * @returns true if the song was added; false otherwise;
	 */
	addSong(song: Song): boolean {
		return this.songs.add(song);
	}

	/**
	 * Remove a song from the playlist.
	 * @param song The song to remove
	 * @returns true if the song was removed; false otherwise; throws an error if cardinality constraint is violated)
	 */
	removeSong(song: Song): boolean {
		return this.songs.remove(song);
	}

	/**
	 * Get the songs in this playlist.
	 * @returns The CustomCollection for songs in this playlist
	 */
	getSongs(): CustomCollection<Song> {
		return this.songs;
	}
}

/**
 * Builder class for Playlist objects.
 * This class is able to build objects of type Playlist by setting its properties one by one.
 */
export class PlaylistBuilder {
	private playlist: Playlist;

	constructor() {
		this.reset();
	}

	public reset(): void {
		this.playlist = new Playlist();
	}

	public setName(name: string): this {
		this.playlist.name = name;
		return this;
	}

	public addSong(song: Song): this {
		this.playlist.addSong(song);
		return this;
	}

	public build(): Playlist {
		const result = this.playlist;
		this.reset();
		return result;
	}
}
