// Song Sorter Function lives here now:

const sorter = (list) => {
    // Names will be the master list of names only. It exists to prevent duplicate names from being created when we make hits
  let names = [];
      // Artists will be an array of 2-part arrays containing a name and a number of streams
  let artists = [];
  list.forEach(song => {
      // Start by splitting along 'featuring' to include artists featured in other artists' tracks:
      let performers = song.artist.split(" featuring ");
      // For contributor to a song,
      performers.forEach(name => {
          // We'll contain this tuple and call it 'act':
          let act = [];
          // each act will contain a name and number of hits, and then is pushed to the artists list for sorting,
          // And the name of the artists is pushed to the names list. If you're a one hit wonder this is where the story ends for you.
          act.push(name);
          act.push(song.streams);
          // But if you're an artist whose name is already in the names list, you must have another song that's already in the list,
          // in which case we need to find your name and add to your total hits..
          if (names.includes(name)) {
              // find index position of this artist in the artists list
              let idx = artists.findIndex(element => element[0] === name)
              // and use that to increase your hits by the amount associated with the current song
              artists[idx][1] += song.streams;
              // If you're not already in the list then this is your first song, so we just add you normally:
          } else {
              artists.push(act);
              names.push(name);
          }
      })
  })
  // Next we calculate the artist with the most hits by sorting all the numbers associated with names in the artists' list:
  let nos = [];
  artists.forEach(artist => {
      nos.push(artist[1]);
  })
  let sorted = nos.sort((a, b) => {
      return b - a;
  });
  // Time to declare a winner: Get the name of the artists associated with the highest number of streams:
  let winner = "";
  // First index place in the sorted list of number of streams corresponds to the number of hits for an artist. Find that artist's name:
  for (let i = 0; i < artists.length; i++) {
      if (sorted[0] === artists[i][1]) {
          winner = artists[i][0];
      }
  }
  // Then let's get all the songs with the winner's name included in the song object:
  let bieberSongs = [];
  list.forEach(song => {
      if (song.artist.includes(winner)) {
          bieberSongs.push(song);
      }
  })
  // Return all songs that pass the criteria:
  // PS I named the variable after I suspected who would be the winner:
  return bieberSongs;
};

bookSorter = (list, genre) => {
    let wanted = [];
    list.forEach(book => {
        if (book.type === genre) {
            wanted.push(book)
        }
    });
    return wanted;
};

module.exports = { 
    sorter,
    bookSorter
};