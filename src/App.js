import { useEffect, useRef, useState } from "react";
import StartRating from './StarRating.js'
import { useMovies } from './useMovies'
import { useLocalStorage } from "./useLocalStorage.js";
import { useKey } from "./useKey.js";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

// const average = (arr) => {
//   const numericValues = arr.filter(value => !isNaN(value));
//   if (numericValues.length === 0) return 0; // Return 0 if no numeric values
//   return numericValues.reduce((acc, cur) => acc + cur, 0) / numericValues.length;
// };

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);


const KEY = '578ac5ee'

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("")
  // const tempQuery = 'tiger'
  // const [watched, setWatched] = useState([])
  const { movies, isLoading, error } = useMovies(query, handleCloseMovie)
  const [watched, setWatched] = useLocalStorage([], 'watched')


  function handleSelectedId(id) {
    setSelectedId((selectedId) => id === selectedId ? null : id)
  }

  function handleCloseMovie() {
    setSelectedId(null)
  }

  function handleAddWatched(movie) {
    setWatched(watched => [...watched, movie])
    // 1.using this func. 
    // localStorage.setItem('watched', JSON.stringify([...watched, movie]))
  }

  function handleDeleteWatched(id) {

    setWatched(watched => watched.filter(movie => movie.imdbId !== id));
  }

  // useEffect(() => {
  //   const savedWatched = JSON.parse(localStorage.getItem("watched"));
  //   if (savedWatched) {
  //     setWatched(savedWatched);
  //   }
  // }, []);

  // 2. using effect




  return (
    <>

      <Navbar movies={movies} >
        <Logo />
        <Search query={query} setQuery={setQuery} />
        <NumResult movies={movies} />
      </Navbar>
      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error &&
            <MovieList
              movies={movies}
              onSelectMovie={handleSelectedId}
            />}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedId ?
            <MovieDetails
              selectedId={selectedId}
              handleCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            /> :
            <>
              <WatchedSummary watched={watched} />
              <WatchedList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          }
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return (
    <p className="error">{message}</p>
  )
}

function Loader() {
  return <p className="loader">Loading...</p>
}
function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      {children}
    </nav>
  )
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  )
}

function NumResult({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies?.length}</strong> results
    </p>
  )
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null)

  useKey('Enter', function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus()
    setQuery("")
  })
  //use instead of autoFocus property
  // useEffect(function () {
  //   const el = document.querySelector(".search")
  //   el.focus()
  // }, [])

  return (
    <input
      // autoFocus
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  )
}

function Main({ children }) {
  return (
    <main className="main">
      {children}
    </main>
  )
}

function Box({ children }) {

  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  )
}

function MovieList({ movies, onSelectMovie }) {

  return (
    <ul className="list">
      {movies?.map((movie) => (
        <Movie movie={movie} key={movie.imdbID} onSelectMovie={onSelectMovie} />
      ))}
    </ul>
  )
}

function Movie({ movie, onSelectMovie }) {
  return (
    <li onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  )
}

function MovieDetails({ selectedId, handleCloseMovie, onAddWatched,
  watched }) {

  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [userRating, setUserRating] = useState('')
  // console.log(watched)

  const countRef = useRef(0)

  useEffect(
    function () {
      if (userRating) countRef.current++
    }, [userRating]
  )

  const isWatched = watched.map(movie => movie.imdbId).includes(selectedId);
  // console.log(isWatched)

  const watchedUserRating = watched.find(
    movie => movie.imdbId === selectedId)?.userRating;

  const { Title: title, Year: year, Poster: poster, Runtime: runtime,
    imdbRating, Plot: plot, Released: released, Actors: actors, Director: director, Genre: genre } = movie

  const isTop = imdbRating > 8
  console.log(isTop)

  function handleAdd() {
    const newWatchedMovie = {
      imdbId: selectedId,
      title,
      year,
      poster,
      imdbRating: Number(imdbRating),
      runtime: Number(runtime.split(' ').at(0)),
      userRating,
      countratingDecision: countRef.current
    }

    onAddWatched(newWatchedMovie)
    handleCloseMovie()
  }

  useKey('Escape', handleCloseMovie)

  useEffect(function () {
    async function getMovieDetails() {
      setIsLoading(true)
      const res = await fetch
        (`http://www.omdbapi.com/?apikey=${KEY}&i=${selectedId}`)
      const data = await res.json()
      // console.log(data)
      setMovie(data)
      setIsLoading(false)
    }
    getMovieDetails()
  }, [selectedId])

  useEffect(function () {
    if (!title) return

    document.title = `Movie | ${title}`

    return function () {
      document.title = 'usePopcorn'
    }
  }, [title])

  return (
    <div className="details">
      {isLoading ? <Loader /> :
        <>
          <header>
            <button className="btn-back" onClick={handleCloseMovie}>&larr;</button>
            <img src={poster} alt="poster" />
            <div className=" details-overview">
              <h2>{title}</h2>
              <p>{released} &bull; {runtime}</p>
              <p>{genre}</p>
              <p><span>🌟</span>{imdbRating} IMDB rating</p>
            </div>
          </header>

          <section>
            <div className="rating">
              {!isWatched ?
                <>
                  <StartRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />

                  {userRating > 0 && <button className="btn-add"
                    onClick={handleAdd}>Add To List</button>
                  }
                </>
                :
                <p>YOu rated This movie: {watchedUserRating} </p>
              }
            </div>

            <p><em>{plot}</em></p>
            <p>Starring : {actors}</p>
            <p>Directed By : {director}</p>
          </section>

        </>
      }
    </div>
  )
}

// function WatchedBox() {


//   const [isOpen2, setIsOpen2] = useState(true);



//   return (
//     <div className="box">
//       <button
//         className="btn-toggle"
//         onClick={() => setIsOpen2((open) => !open)}
//       >
//         {isOpen2 ? "–" : "+"}
//       </button>
//       {isOpen2 && (
//         <>
//           <WatchedSummary watched={watched} />

//           <WatchedList watched={watched} />
//         </>
//       )}
//     </div>
//   )
// }

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(1)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(1)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(0)} min</span>
        </p>
      </div>
    </div>
  )
}

function WatchedList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbId}
          onDeleteWatched={onDeleteWatched} />
      ))}
    </ul>
  )
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li >
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
        {console.log(movie.imdbId)}
        <button className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbId)}>X</button>
      </div>
    </li>
  )
}