"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var music_platform_1 = require("./music_platform");
var artists = [
    new music_platform_1.Artist("Bob Dylan"),
    new music_platform_1.Artist("Joni Mitchell"),
    new music_platform_1.Artist("Neil Young")
];
var albums = [
    new music_platform_1.Album("Blood on the Tracks", artists[0]),
    new music_platform_1.Album("Blue", artists[1]),
    new music_platform_1.Album("Harvest", artists[2])
];
var songs = [
    new music_platform_1.Song("Tangled Up in Blue", 349, albums[0]),
    new music_platform_1.Song("All I Want", 307, albums[1]),
    new music_platform_1.Song("Heart of Gold", 204, albums[2]),
    new music_platform_1.Song("Idiot Wind", 458, albums[0]),
    new music_platform_1.Song("A Case of You", 282, albums[1]),
    new music_platform_1.Song("Old Man", 186, albums[2]),
    new music_platform_1.Song("Helpless", 216, albums[2])
];
// Create 2 variables, one to hold the number of albums and another one to hold the number of songs
var albumCount = albums.length;
var songCount = songs.length;
for (var i = 0; i < 10; i++) {
    // Select a random album from the albums array
    var albumIndex = Math.floor(Math.random() * albumCount);
    // Select a random song from the songs array
    var songIndex = Math.floor(Math.random() * songCount);
    // Get the album and song objects from the arrays using the indexes
    var album = albums[albumIndex];
    var song = songs[songIndex];
    // Select whether to add or remove the song from the album
    var operation = Math.random() < 0.5 ? "add" : "remove";
    // Try to add or remove the song from the album
    try {
        if (operation === "add") {
            console.log("Adding ".concat(song.title, " to ").concat(album.title));
            album.addSong(song);
        }
        else {
            console.log("Removing ".concat(song.title, " from ").concat(album.title));
            album.removeSong(song);
        }
    }
    catch (error) {
        // If there is an error, log it to the console
        console.error("An error occurred when trying to ".concat(operation, " Song '").concat(song.title, "' to/from Album '").concat(album.title, "': '").concat(error, "'\n"));
    }
}
