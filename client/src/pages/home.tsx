import { useState, useEffect } from "react";
import { MovieList } from "../components/movie-list";
import { Spinner } from "../components/spinner";
import type { IMovie } from "../types";

export function Home() {
  const [movieList, setMovieList] = useState<IMovie[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchMovieList = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/movie");
        const data = await response.json();

        if (data.movies && data.movies.length > 0) {
          const randomIndex = Math.floor(Math.random() * data.movies.length);
          const count = Math.min(20, data.movies.length);
          const movies = data.movies.slice(randomIndex, randomIndex + count);
          setMovieList(movies);
        }
      } catch (err) {
        console.error(err);
        setMovieList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieList();
  }, []);

  if (isLoading) {
    return <Spinner />;
  }

  return <MovieList movieList={movieList} />;
}
