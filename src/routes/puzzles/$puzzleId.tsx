import { createFileRoute } from "@tanstack/react-router";
import { findPuzzleById } from "../../data/database";

import { PuzzleNotFound } from "../../components/PuzzleNotFound";
import { PuzzleComponent } from "../../components/Puzzle/Puzzle";

export const Route = createFileRoute("/puzzles/$puzzleId")({
  component: PuzzleWrapper,
  loader: async ({ params: { puzzleId } }) => findPuzzleById(puzzleId),
});

function PuzzleWrapper() {
  const puzzle = Route.useLoaderData();
  const { puzzleId } = Route.useParams();

  if (puzzle === undefined) return <PuzzleNotFound puzzleId={puzzleId} />;

  return (
    <div className="mt-20">
      <PuzzleComponent puzzle={puzzle} />
    </div>
  );
}

// TODO: add "one away..." support
// TODO: add blink before unselect
// TODO: animate transition
// TODO: default layout
