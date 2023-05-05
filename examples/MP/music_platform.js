"use strict";
// The custom selection is used for providing an interface that is capable of enforcing a cardinality constraint, as well as some other eventual  constraints.
// We will use this implementation to create a collection of songs for an album
// A collection can have a minimum number of items and a maximum number of items.
Object.defineProperty(exports, "__esModule", { value: true });
exports.Album = exports.Artist = exports.Song = void 0;
// The generic type (T) will be used to specify the type of item that can be added to the collection. Must not be exported.
var CustomCollection = /** @class */ (function () {
    // The constructor takes the minimum number of items and the maximum number of items as parameters.
    // The maxItems parameter is optional and can be null, meaning that there is no maximum number of items.
    function CustomCollection(minItems, maxItems) {
        this.minItems = minItems;
        this.maxItems = maxItems;
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
    CustomCollection.prototype.add = function (item) {
        // If the collection has no maximum number of items, or the number of items in the collection is less than the maxItems ('not full'),
        if (this.maxItems === null || this.items.length < this.maxItems) {
            // The item is added to the items array.
            this.items.push(item);
            // The method returns true to indicate that the item was added to the collection.
            return true;
            // If the maxItems is not null and the number of items in the collection is greater than or equal to the maxItems, the item cannot be added to the collection.
        }
        else {
            // An error is thrown to indicate that the item could not be added to the collection due to the cardinality constraint.
            throw new Error("Adding this item would violate the cardinality constraint: Collection cannot have more than ".concat(this.maxItems, " items."));
        }
    };
    /**
     * Remove an item from the collection.
     *
     * @param item The item to remove
     * @returns true if the item was removed; false otherwise
     * @throws An error if the cardinality constraint is violated (i.e. the collection would have less than the minimum number of items)
     */
    CustomCollection.prototype.remove = function (item) {
        // Search for the item in the items array.
        var index = this.items.indexOf(item);
        // If the index is not -1, the item was found in the collection.
        if (index !== -1) {
            // The item is removed from this collection's items array.
            this.items.splice(index, 1);
            // If the number of items in the collection is less than the minItems, the item cannot be removed from the collection.
            if (this.items.length < this.minItems) {
                // An error is thrown to indicate that the item could not be removed from the collection, due to the cardinality constraint.
                throw new Error("Removing this ".concat(typeof item, " would violate the cardinality constraint: ").concat(this.constructor.name, " cannot have less than ").concat(this.minItems, " items."));
                // If the number of items in the collection is greater than or equal to the minItems, the item can be removed from the collection.
            }
            else {
                // The method returns true to indicate that the item was removed from the collection.
                return true;
            }
            // If the index is -1, the item was not even found in the collection.
        }
        else {
            // An error is thrown to indicate that the item could not be removed from the collection.
            throw new Error("The ".concat(typeof item, " to be removed does not exist in the collection, so it cannot be removed."));
        }
    };
    // This method returns the items in the collection.
    CustomCollection.prototype.getItems = function () {
        return this.items;
    };
    return CustomCollection;
}());
// Declare the Song class
var Song = /** @class */ (function () {
    /**
     * Create a new Song.
     *
     * @param title The title of the song
     * @param duration The duration/length of the song in seconds
     * @param album The album that the song is on, if any
     */
    function Song(title, duration, album) {
        this.title = title;
        this.duration = duration;
        this.album = album || null; // if album is undefined/falsy, assign null
    }
    return Song;
}());
exports.Song = Song;
// Declare a class
var Artist = /** @class */ (function () {
    // Define a constructor
    function Artist(name) {
        this.name = name;
    }
    /**
     * Get the name of the artist.
     *
     * @returns The name of the artist
     */
    Artist.prototype.getName = function () {
        return this.name;
    };
    return Artist;
}());
exports.Artist = Artist;
/**
 * Class for the Album object.
 *
 * An album has a title, an artist, and a collection of songs.
 */
var Album = /** @class */ (function () {
    /**
     * Create a new album.
     *
     * @param title The title of the album
     * @param artist The artist that is credited for the album
     */
    function Album(title, artist) {
        this.title = title;
        this.artist = artist;
        // Establish the cardinality constraint for the songs collection, i.e. an album must have at least 1 song (but no maximum)
        this._songs = new CustomCollection(1, null);
    }
    /**
     * Add a song to the album.
     *
     * @param song The song to add
     * @returns true if the song was added; false otherwise;
     */
    Album.prototype.addSong = function (song) {
        return this._songs.add(song);
    };
    /**
     * Remove a song from the album.
     *
     * @param song The song to remove
     * @returns true if the song was removed; false otherwise; throws an error if the cardinality constraint is violated (i.e. the album would have less than 1 song)
     */
    Album.prototype.removeSong = function (song) {
        return this._songs.remove(song);
    };
    /**
     * Get the songs in this album.
     *
     * @returns The songs in this album
     */
    Album.prototype.getSongs = function () {
        // Use the CustomCollection.getItems() method to polymorphically get the items in the collection
        return this._songs.getItems();
    };
    return Album;
}());
exports.Album = Album;
