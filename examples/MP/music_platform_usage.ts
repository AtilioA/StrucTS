import { Album, Artist, Song } from "./music_platform";

const artists = [
  new Artist("Bob Dylan"),
  new Artist("Joni Mitchell"),
  new Artist("Neil Young")
];

const albums = [
  new Album("Blood on the Tracks", artists[0]),
  new Album("Blue", artists[1]),
  new Album("Harvest", artists[2])
];

const songs = [
  new Song("Tangled Up in Blue", 349, albums[0]),
  new Song("All I Want", 307, albums[1]),
  new Song("Heart of Gold", 204, albums[2]),
  new Song("Idiot Wind", 458, albums[0]),
  new Song("A Case of You", 282, albums[1]),
  new Song("Old Man", 186, albums[2]),
  new Song("Helpless", 216, albums[2])
];

// Create 2 variables, one to hold the number of albums and another one to hold the number of songs
const albumCount = albums.length;
const songCount = songs.length;

for (let i = 0; i < 10; i++) {
  // Select a random album from the albums array
  const albumIndex = Math.floor(Math.random() * albumCount);
  // Select a random song from the songs array
  const songIndex = Math.floor(Math.random() * songCount);
  // Get the album and song objects from the arrays using the indexes
  const album = albums[albumIndex];
  const song = songs[songIndex];

  // Select whether to add or remove the song from the album
  const operation = Math.random() < 0.5 ? "add" : "remove";

  // Try to add or remove the song from the album
  try {
    if (operation === "add") {
      console.log(`Adding ${song.title} to ${album.title}`);
      album.addSong(song);
    } else {
      console.log(`Removing ${song.title} from ${album.title}`);
      album.removeSong(song);
    }
  } catch (error) {
    // If there is an error, log it to the console
    console.error(`An error occurred when trying to ${operation} Song '${song.title}' to/from Album '${album.title}': '${error}'\n`);
  }
}
