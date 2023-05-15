// The custom selection is used for providing an interface that is capable of enforcing a cardinality constraint, as well as some other eventual  constraints.
// We will use this implementation to create a collection of songs for an album
// A collection can have a minimum number of items and a maximum number of items.

// The generic type (T) will be used to specify the type of item that can be added to the collection. Must not be exported.
class CustomCollection<T> {
  // The items in the collection are stored in an array.
  private items: T[];

  // The constructor takes the minimum number of items and the maximum number of items as parameters.
  // The maxItems parameter is optional and can be null, meaning that there is no maximum number of items.
  constructor(private minItems: number, private maxItems: number | null) {
    // The items array is initialized to an empty array.
    this.items = [];
  }

  /**
   * Add an item to the collection.
   *
   * @param item The item to add
   * @return true if the item was added; false otherwise
   * @throws An error if the cardinality constraint is violated (i.e. the collection would have more than the maximum number of items)
   */
  add(item: T): boolean {
    // If the collection has no maximum number of items, or the number of items in the collection is less than the maxItems ('not full'),
    if (this.maxItems === null || this.items.length < this.maxItems) {
      // The item is added to the items array.
      this.items.push(item);
      // The method returns true to indicate that the item was added to the collection.
      return true;
      // If the maxItems is not null and the number of items in the collection is greater than or equal to the maxItems, the item cannot be added to the collection.
    } else {
      // An error is thrown to indicate that the item could not be added to the collection due to the cardinality constraint.
      throw new Error(
        `Adding this item would violate the cardinality constraint: Collection cannot have more than ${this.maxItems} items.`
      );
    }
  }

  /**
   * Remove an item from the collection.
   *
   * @param item The item to remove
   * @returns true if the item was removed; false otherwise
   * @throws An error if the cardinality constraint is violated (i.e. the collection would have less than the minimum number of items)
   */
  remove(item: T): boolean {
    // Search for the item in the items array.
    const index = this.items.indexOf(item);
    // If the index is not -1, the item was found in the collection.
    if (index !== -1) {
      // The item is removed from this collection's items array.
      this.items.splice(index, 1);
      // If the number of items in the collection is less than the minItems, the item cannot be removed from the collection.
      if (this.items.length < this.minItems) {
        // An error is thrown to indicate that the item could not be removed from the collection, due to the cardinality constraint.
        throw new Error(
          `Removing this ${typeof item} would violate the cardinality constraint: ${this.constructor.name} cannot have less than ${this.minItems} items.`
        );
        // If the number of items in the collection is greater than or equal to the minItems, the item can be removed from the collection.
      } else {
      // The method returns true to indicate that the item was removed from the collection.
      return true;
      }
      // If the index is -1, the item was not even found in the collection.
    } else {
      // An error is thrown to indicate that the item could not be removed from the collection.
      throw new Error(
        `The ${typeof item} to be removed does not exist in the collection, so it cannot be removed.`
      );
    }
  }

  // This method returns the items in the collection.
  getItems(): T[] {
    return this.items;
  }
}

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
  constructor(title: string, duration: number, album?: Album) {
    this.title = title;
    this.duration = duration;
    this.album = album || null; // if album is undefined/falsy, assign null
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

  constructor(name: string) {
    this.name = name;
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
  private _songs: CustomCollection<Song>;

  /**
   * Create a new album.
   *
   * @param title The title of the album
   * @param artist The artist that is credited for the album
   */
  constructor(title: string, artist: Artist) {
    this.title = title;
    this.artist = artist;
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
