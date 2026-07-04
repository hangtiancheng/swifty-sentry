import { MovieCard } from "./movie-card";
import type { IMovie } from "../types";

interface MovieListProps {
  movieList: IMovie[];
}

export function MovieList({ movieList }: MovieListProps) {
  if (movieList.length === 0) {
    return <h1 className="mt-4 text-center text-2xl">Empty Movie List</h1>;
  }

  return (
    <div className="mx-auto grid max-w-2xl grid-cols-1 gap-4 p-4">
      {movieList.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
}
