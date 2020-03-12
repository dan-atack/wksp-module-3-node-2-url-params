'use strict';

const express = require('express');

const morgan = require('morgan');

// Importing the notorious song sorter function here since it's very
// messy and long:

const { sorter, bookSorter } = require('./data/song_sorter');

const { top50 } = require('./data/top50');

const { books } = require('./data/books');

const PORT = process.env.PORT || 8000;

const app = express();


    // Create variable from the output of the song sorter function.
let artistes = sorter(top50);

// Upgraded from songs to general entities, the find by rank function
// Generates a solo page for an individual song (or book!)
// Added a default value for what key to search for, since books use id and songs use rank:
function findByRank(list, rank, rankKey = "rank") {
    let hit = "";
    list.forEach(work => {
        if (work[rankKey] == rank) {
            hit = work;
        }
    })
    return hit;
};

express()

    app.use(morgan('dev'));
    app.use(express.static('public'));
    app.use(express.urlencoded({extended: false}));
    app.set('view engine', 'ejs');

    // endpoints here

    // Basic top 50:
    app.get('/top50', (req, res) => res.render('pages/top50', {
        title: "Top 50 Spotify Songs Featuring 3 Good Ones",
        list: top50
    }));

    // Top ARtist page:
    app.get('/topartist', (req, res) => res.render('pages/topartist', {
        title: "Most Popular Artist: Canada\'s Favourite Son :O",
        list: artistes
    }));

    // Redirect larger or smaller numbers to 404 page (Part 1.7):

    app.get(`/top50/song/:number`, (req, res) => { 
        if ((req.params.number > 0) && (req.params.number <= 50)) {
            res.render(`pages/song`, {
                title: `Song # ${findByRank(top50, req.params.number).rank}`,
                trackname: findByRank(top50, req.params.number).title,
                trackartist: findByRank(top50, req.params.number).artist,
                trackstreams: findByRank(top50, req.params.number).streams,
                rank: req.params.number
            })
        } else {
                res.status(404);
                res.render('pages/fourOhFour', {
                    title: 'I got nothing',
                    path: req.originalUrl
                });
        }
    });

    // Exercise 2: Ends for Books AKA Bookends. God I love a good pun!

    app.get('/bookends', (req, res) => {
        res.render('pages/books', {
            title: "Top 25 Books",
            books: books
            });
        }
    );

    // Post method for sorting books by genre:
    app.post('/sortByGenre', (req, res) => {
        const genre = req.body.genre;
        const genreRender = genre.charAt(0).toUpperCase() + genre.slice(1);
        res.render('pages/books', {
            title: `Top ${genreRender} Books:`,
            books: bookSorter(books, genre)
        })
    })

    // Ends for individual books:
    app.get('/bookends/book/:number', (req, res) => {
        if ((req.params.number > 100) && (req.params.number <= 125)) {
            // Didn't do this for songs, but saving the req params number as a much shorter variable name saves unnecessary typing (more than off set by this lengthy comment tho)
            let id = req.params.number;
            res.render('pages/solobook', {
                title: findByRank(books, id, "id").title,
                cover: findByRank(books, id, "id").imgUrl,
                author: findByRank(books, id, "id").author,
                genre: findByRank(books, id, "id").type,
                description: findByRank(books, id, "id").description,
                id: Number(id)
            })
        } else {
            res.status(404);
            res.render('pages/fourOhFour', {
                title: 'No books here muh friend',
                path: req.originalUrl
            });
        }
    })

    // handle 404s
    app.get('*', (req, res) => {
        res.status(404);
        res.render('pages/fourOhFour', {
            title: 'I got nothing',
            path: req.originalUrl
        });
    });

    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
