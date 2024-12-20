import * as React from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { getAllPuzzles, getPuzzleCount } from "../../data/database";
import { getSolvedPuzzles } from "../../util/localStorage";
import { CircleCheck } from "lucide-react";

export const Route = createFileRoute("/puzzles/")({
  component: RouteComponent,
  loader: getAllPuzzles,
});

function RouteComponent() {
  const puzzles = Route.useLoaderData();

  const solvedPuzzles = getSolvedPuzzles();

  return (
    <div
      className="
        grid 
        grid-cols-2
        md:grid-cols-3 
        lg:grid-cols-4

        gap-4 

        w-4/5 
        mx-auto 
        mt-10
        "
    >
      {puzzles.map((puzz) => (
        <Link to={`${puzz.id}`} key={puzz.id}>
          <div
            className="
        flex 
        flex-row 
        items-center 
        justify-center
        
        gap-1
        
        rounded-md

        font-bold
        text-xs
        lg:text-sm

        bg-fuchsia-300

        p-4
        "
          >
            #{puzz.id}: {puzz.date}
            {solvedPuzzles.includes(puzz.id.toString()) ? (
              <CircleCheck color="#000000" size={18} />
            ) : null}
          </div>
        </Link>
      ))}
    </div>
  );
}
