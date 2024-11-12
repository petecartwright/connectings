import type { Puzzle } from "../types/GameState";
import puzzles from "./connections.json" with { type: "json" };

export const findPuzzleById = (puzzleId: string): Puzzle | undefined => {
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
