import { createFileRoute } from "@tanstack/react-router";
import * as React from "react";
import { findPuzzleById } from "../../data/database";
import type {
  GameAnswer,
  GameState,
  Puzzle,
  PuzzleIdReducerAction,
} from "../../types/GameState";
import { shuffleArray } from "../../util/shuffleArray";

const BACKGROUND_COLOR_TO_TAILWIND_CLASS = {
  0: "bg-blue-400",
  1: "bg-teal-400",
  2: "bg-amber-400",
  3: "bg-violet-400",
};

export const Route = createFileRoute("/puzzles/$puzzleId")({
  component: RouteComponent,
  loader: async ({ params: { puzzleId } }) => findPuzzleById(puzzleId),
});

const createInitialState = (puzzle: Puzzle | undefined): GameState => {
  if (puzzle === undefined) throw Error("puzzle is undefined");

  const allAnswers: GameAnswer[] = [];

  for (const answer of puzzle.answers) {
    for (const member of answer.members) {
      allAnswers.push({
        group: answer.group,
        level: answer.level,
        memberText: member,
        isSelected: false,
        isAvailableToChoose: true,
      });
    }
  }
  shuffleArray(allAnswers);

  return { solvedGroups: [], answers: allAnswers };
};

const allAnswersInGroup = (answers: GameAnswer[]): boolean => {
  // shouldn't get here with non-4 choices but let's be sure i guess?
  if (answers.length !== 4) return false;
  const group = answers[0].group;
  return answers.every((answer) => answer.group === group);
};

const reducer = (
  state: GameState,
  action: PuzzleIdReducerAction,
): GameState => {
  switch (action.type) {
    case "add_answer": {
      const newAnswers = state.answers.map((answer) => {
        if (answer.memberText === action.memberText) {
          answer.isSelected = !answer.isSelected;
        }
        return answer;
      });

      return {
        ...state,
        answers: newAnswers,
      };
    }
    case "complete_group": {
      if (action.completedGroup === undefined) throw Error("group required");

      // remove the on-theme choices from the array of options
      const newAnswers = state.answers.filter(
        (choice) => choice.group !== action.completedGroup,
      );
      const solvedAnswers = state.answers.filter(
        (choice) => choice.group === action.completedGroup,
      );

      const newSolvedGroups = state.solvedGroups;
      newSolvedGroups.push({
        level: solvedAnswers[0].level,
        group: action.completedGroup,
        answers: solvedAnswers,
      });

      return {
        ...state,
        solvedGroups: newSolvedGroups,
        answers: newAnswers,
      };
    }
    case "clear_selection": {
      const answersNoSelections = state.answers.map((answer) => ({
        ...answer,
        isSelected: false,
      }));

      return {
        ...state,
        answers: answersNoSelections,
      };
    }
  }
};

function RouteComponent() {
  const puzzle = Route.useLoaderData();

  if (puzzle === undefined) return <div> uhoh </div>;

  const [state, dispatch] = React.useReducer(
    reducer,
    createInitialState(puzzle),
  );

  React.useEffect(() => {
    const selectedAnswers = state.answers.filter((answer) => answer.isSelected);
    if (selectedAnswers.length === 4) {
      // check for a match
      const doAnswersCompleteGroup = allAnswersInGroup(selectedAnswers);

      if (!doAnswersCompleteGroup) {
        setTimeout(() => {
          dispatch({ type: "clear_selection" });
        }, 400);
      } else {
        const completedGroup = selectedAnswers[0].group;
        setTimeout(() => {
          dispatch({ type: "complete_group", completedGroup });
          dispatch({ type: "clear_selection" });
        }, 400);
      }
    }
  }, [state]);

  const onClickAnswer = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!event.currentTarget.innerText) return;
    const memberText = event.currentTarget.innerText;
    dispatch({
      type: "add_answer",
      memberText,
    });
  };

  return (
    <>
      <div
        className="game
        pl-4 pr-4 pt-4
        w-9/12
        m-auto
        text-lg text-slate-800 text-center font-bold"
      >
        {state.solvedGroups.length > 0
          ? state.solvedGroups.map((solvedGroup) => (
              <div
                key={solvedGroup.group}
                // @ts-ignore
                className={`p-4 ${BACKGROUND_COLOR_TO_TAILWIND_CLASS[solvedGroup.level]} rounded-lg mb-4 `}
              >
                <h1>{solvedGroup.group}</h1>
                <h2>
                  {solvedGroup.answers
                    .map((answer) => answer.memberText)
                    .join(", ")}
                </h2>
              </div>
            ))
          : null}

        <div
          className="grid grid-cols-4 gap-4 
        "
        >
          {state.answers
            .filter((answer) => answer.isAvailableToChoose)
            .map((answer) => {
              // TODO: consistent styling for these? standardize height somehow
              return (
                <div
                  className={`
              p-4 rounded-lg 
              transition
              duration-400
              active:scale-90
              ${answer.isSelected ? "bg-green-400" : "bg-blue-400"}
              `}
                  key={answer.memberText}
                  onKeyUp={() => {
                    //TODO: this
                  }}
                  onClick={onClickAnswer}
                >
                  {answer.memberText}
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

const fakePuzzle = {
  id: 1234,
  name: "My first puzz",
  creator: "Pete",
  date: "2024-11-09",
  choices: [
    {
      theme: "Bug Sounds",
      choices: ["bzz", "ssss", "cricket sound", "buzz"],
      color: "teal",
    },
    {
      theme: "Crimes",
      choices: ["regicide", "moida", "larceny", "plagiarism"],
      color: "violet",
    },
    {
      theme: "70's years",
      choices: ["1973", "1974", "1971", "1975"],
      color: "amber",
    },
    {
      theme: "Letters",
      choices: ["A", "Z", "J", "O"],
      color: "blue",
    },
  ],
};

// TODO: add "one away..." support
// TODO: add blink before unselect
// TODO: animate transition

// TODO: convert the fakePuzzle to match the data from the "Database"
