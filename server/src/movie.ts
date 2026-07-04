import { readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { faker } from "@faker-js/faker";
import { newGroup, destroyGroup, type Group } from "@swifty.js/cache";

const GROUP_NAME = "movies";
const CACHE_KEY = "all";

export interface Movie {
  id: string;
  name: string;
  image: string;
  description: string;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const staticDir = join(__dirname, "../static");
const staticImages = readdirSync(staticDir).map((f) => `/static/${f}`);

let movieGroup: Group | null = null;
let moviesData: Movie[] = [];

function generateMovies(count: number): Movie[] {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    name: faker.lorem.words({ min: 2, max: 5 }),
    image: staticImages[Math.floor(Math.random() * staticImages.length)],
    description: faker.lorem.sentence(),
  }));
}

export function initMovieCache(): void {
  moviesData = generateMovies(1000);

  const payload = Buffer.from(JSON.stringify({ movies: moviesData }));

  movieGroup = newGroup(GROUP_NAME, 64 * 1024 * 1024, async () => payload);
}

export function destroyMovieCache(): void {
  destroyGroup(GROUP_NAME);
  movieGroup = null;
}

export async function getAllMovies(): Promise<Movie[]> {
  if (!movieGroup) return [];

  const view = await movieGroup.get(new AbortController().signal, CACHE_KEY);
  const data = JSON.parse(view.toString());
  return data.movies;
}
