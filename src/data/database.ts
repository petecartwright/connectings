import type { Puzzle } from "../types/GameState";
import puzzles from "./connections.json" with { type: "json" };

export const findPuzzleById = (puzzleId: string): Puzzle | undefined => {
  // TODO: make this a singleton so it's not so slow on every fetch
  // TODO: uhhhh also make it a database and not a json file

  if (Number.isNaN(Number(puzzleId))) {
    throw Error(`${puzzleId} is an invalid puzzleId`);
  }

  const matchingPuzzle = puzzles.filter(
    (puzzle) => puzzle.id === Number(puzzleId),
  );

  if (matchingPuzzle.length === 0) {
    return undefined;
  }

  if (matchingPuzzle.length > 1) {
    throw Error(`Multiple puzzles in database with id ${puzzleId}`);
  }

  return matchingPuzzle[0];
};

export const getPuzzleCount = () => {
  return puzzles.length;
};

export const getAllPuzzles = () => {
  return [...puzzles].reverse();
};

export const getNewestPuzzle = () => {
  return [...puzzles][puzzles.length - 1];
};
