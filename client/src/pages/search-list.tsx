import { useState } from "react";
import { MovieList } from "../components/movie-list";
import { Spinner } from "../components/spinner";
import type { IMovie } from "../types";

export function SearchList() {
  const [searchTitle, setSearchTitle] = useState("");
  const [movieList, setMovieList] = useState<IMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearchMovie = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/movie");
      const data = await response.json();

      const movies: IMovie[] = data.movies;

      const filteredMovies = movies.filter((movie) => {
        const title = searchTitle.toLowerCase();
        return (
          movie.name.toLowerCase().includes(title) ||
          (movie.description && movie.description.toLowerCase().includes(title))
        );
      });

      setMovieList(filteredMovies);
    } catch (err) {
      console.error(err);
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 text-center">
      <div className="mb-4 flex flex-col items-center gap-4">
        <div className="w-1/2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Movie Title
          </label>
          <input
            type="text"
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
          />
        </div>
        <button
          onClick={handleSearchMovie}
          disabled={isLoading}
          className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 disabled:opacity-50"
        >
          Search
        </button>
      </div>

      {isLoading ? <Spinner /> : <MovieList movieList={movieList} />}
    </div>
  );
}
