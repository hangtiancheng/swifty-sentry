import { useFavorite } from "../context/favorite-context";
import { MovieList } from "../components/movie-list";

export function FavoriteList() {
  const { movieList } = useFavorite();
  return <MovieList movieList={movieList} />;
}
