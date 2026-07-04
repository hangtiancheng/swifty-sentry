import { useFavorite } from "../context/favorite-context";
import type { IMovie } from "../types";

interface MovieCardProps {
  movie: IMovie;
}

export function MovieCard({ movie }: MovieCardProps) {
  const { has, add, remove } = useFavorite();
  const isFavored = has(movie);

  const handleLike = () => {
    if (isFavored) {
      remove(movie);
    } else {
      add(movie);
    }
  };

  return (
    <div className="mt-4 w-full rounded-lg border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-4">
        <h3 className="text-xl font-semibold">{movie.name}</h3>
      </div>
      <img
        src={movie.image}
        alt={movie.name}
        className="h-50 w-full object-fill"
      />
      <div className="p-4">
        <p className="text-gray-600">{movie.description}</p>
      </div>
      <div className="flex justify-end border-t border-gray-200 p-4">
        <button
          onClick={handleLike}
          className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
        >
          {isFavored ? "Dislike" : "Like"}
        </button>
      </div>
    </div>
  );
}
