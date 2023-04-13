export class CustomCollection<T> {
  private items: T[];

  constructor(private minItems: number, private maxItems: number | null) {
    this.items = [];
  }

  add(item: T): boolean {
    if (this.maxItems === null || this.items.length < this.maxItems) {
      this.items.push(item);
      return true;
    } else {
      throw new Error(`Adding this item would violate the cardinality constraint: Album cannot have more than ${this.maxItems} Songs`);
    }
  }

  remove(item: T): boolean {
    const index = this.items.indexOf(item);
    if (index !== -1) {
      this.items.splice(index, 1);
      if (this.items.length < this.minItems) {
        throw new Error(`Removing this item would violate the cardinality constraint: Album cannot have less than ${this.minItems} Songs`);
      }
      return true;
    } else {
      throw new Error("The item you are trying to remove does not exist in the collection");
    }
  }

  getItems(): T[] {
    return this.items;
  }
}

export class Song {
  title: string;
  length: number;
  album: Album | null;

  constructor(title: string, length: number, album?: Album) {
    this.title = title;
    this.length = length;
    this.album = album || null;
  }
}

export class Artist {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

export class Album {
  title: string;
  artist: Artist;
  private _songs: CustomCollection<Song>;

  constructor(title: string, artist: Artist) {
    this.title = title;
    this.artist = artist;
    this._songs = new CustomCollection<Song>(1, null);
  }

  addSong(song: Song): boolean {
    return this._songs.add(song);
  }

  removeSong(song: Song): boolean {
    return this._songs.remove(song);
  }

  getSongs(): Song[] {
    return this._songs.getItems();
  }
}
