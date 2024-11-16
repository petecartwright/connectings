import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getAllPuzzles, getPuzzleCount } from "../../data/database";
import { getSolvedPuzzles } from "../../util/localStorage";
import { CircleCheck } from "lucide-react";

export const Route = createFileRoute("/puzzles/")({
  component: RouteComponent,
  // TODO: this should prob only fetch the count and most recent N puzzles
  loader: getAllPuzzles,
});

function RouteComponent() {
  const puzzles = Route.useLoaderData();

  const solvedPuzzles = getSolvedPuzzles();

  return (
    <div>
      {puzzles.map((puzz) => (
        <div className="flex flex-row items-center gap-1" key={puzz.id}>
          <Link to={`${puzz.id}`}>
            #{puzz.id}: {puzz.date}
          </Link>
          {solvedPuzzles.includes(puzz.id.toString()) ? (
            <CircleCheck color="#2ad636" size={16} />
          ) : null}
        </div>
      ))}
    </div>
  );
}
