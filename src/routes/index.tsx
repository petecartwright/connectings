import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { getNewestPuzzle } from "../data/database";
import { PuzzleComponent } from "../components/Puzzle/Puzzle";

export const Route = createFileRoute("/")({
  component: HomeComponent,
  loader: getNewestPuzzle,
});

function HomeComponent() {
  const puzzle = Route.useLoaderData();

  if (!puzzle) return <div>No puzzle today! Go home!</div>;

  return (
    <div className="">
      <PuzzleComponent puzzle={puzzle} />
    </div>
  );
}
