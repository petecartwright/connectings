import type { GameAnswer, Puzzle } from "../../types/GameState";
import * as React from "react";
import {
  PuzzleReducer,
  createInitialState,
} from "../../components/Puzzle/reducer";
import { addSolvedPuzzle } from "../../util/localStorage";

const BACKGROUND_COLOR_TO_TAILWIND_CLASS = {
  0: "bg-yellow-400",
  1: "bg-green-400",
  2: "bg-blue-400",
  3: "bg-violet-400",
};

const allAnswersInGroup = (answers: GameAnswer[]): boolean => {
  // shouldn't get here with non-4 choices but let's be sure i guess?
  if (answers.length !== 4) return false;
  const group = answers[0].group;
  return answers.every((answer) => answer.group === group);
};

interface PuzzleComponentProps {
  puzzle: Puzzle;
}

export const PuzzleComponent = ({
  puzzle,
}: PuzzleComponentProps): React.ReactElement => {
  const [state, dispatch] = React.useReducer(
    PuzzleReducer,
    createInitialState(puzzle),
  );

  const onClickAnswer = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!event.currentTarget.innerText) return;
    const memberText = event.currentTarget.innerText;
    dispatch({
      type: "add_answer",
      memberText,
    });
  };

  const onClickClear = () => {
    dispatch({ type: "clear_selection" });
  };

  const onClickShuffle = () => {
    dispatch({ type: "shuffle" });
  };

  const onClickSubmit = () => {
    if (selectedAnswers.length !== 4) return;

    // check for a match
    const doAnswersCompleteGroup = allAnswersInGroup(selectedAnswers);

    if (!doAnswersCompleteGroup) {
      setTimeout(() => {
        dispatch({ type: "increment_missed_guess" });
        dispatch({ type: "clear_selection" });
      }, 400);
    } else {
      const completedGroup = selectedAnswers[0].group;
      setTimeout(() => {
        dispatch({ type: "complete_group", completedGroup });
        dispatch({ type: "clear_selection" });
      }, 400);
    }
  };

  const date = new Date(puzzle.date);
  const niceMonth = date.toLocaleString("en", { month: "long" }).toString();
  const niceDateString = `${niceMonth} ${date.getUTCDate()}, ${date.getUTCFullYear()}`;

  const selectedAnswers = state.answers.filter((answer) => answer.isSelected);
  const allowedGuesses = 4;
  const guessesRemaining = allowedGuesses - state.missedGuesses;

  const puzzleSolved = state.solvedGroups.length === 4;

  // is there a better way to do this????
  React.useEffect(() => {
    if (puzzleSolved) {
      addSolvedPuzzle(puzzle.id.toString());
    }
  }, [puzzleSolved, puzzle]);

  return (
    // TODO: add something to do on completiong
    // TODO: nav to previous and next puzz?
    // TODO: write solve history to localstorage
    <>
      <div className="flex justify-center items-center text-5xl font-bold mt-8 mb-8">
        #{puzzle.id}: {niceDateString}
      </div>

      <div
        className="game

        w-11/12
        md:w-2/3
        lg:w-1/2

        flex
        flex-col
        gap-4

        m-auto
        text-center 
        text-sm
        text-slate-800 
        font-bold

        sm:text-lg 

        transition-all
        duration-400
        
        "
      >
        {state.solvedGroups.length > 0
          ? state.solvedGroups.map((solvedGroup) => (
              <div
                key={solvedGroup.group}
                className={`
                  p-4 ${BACKGROUND_COLOR_TO_TAILWIND_CLASS[solvedGroup.level]} rounded-lg `}
              >
                <h1
                  className="
                  text-md
                  sm:text-xl 
                  font-bold
                "
                >
                  {solvedGroup.group}
                </h1>
                <h2 className="font-normal">
                  {solvedGroup.answers
                    .map((answer) => answer.memberText)
                    .join(", ")}
                </h2>
              </div>
            ))
          : null}
        {!puzzleSolved ? (
          <div className="grid grid-cols-4 gap-4">
            {state.answers
              .filter((answer) => answer.isAvailableToChoose)
              .map((answer) => {
                return (
                  // TODO: fix this
                  // biome-ignore lint/a11y/useKeyWithClickEvents: will fix later i hope
                  <div
                    className={`
                    flex
                    justify-center
                    p-4
                    rounded-md 
                    transition-all
                    duration-400
                    active:scale-90
                    text-xs
                    lg:text-sm
                    ${answer.isSelected ? "bg-green-400" : "bg-blue-400"}
                    `}
                    key={answer.memberText}
                    onClick={onClickAnswer}
                  >
                    {answer.memberText}
                  </div>
                );
              })}
          </div>
        ) : null}

        <div>
          {puzzleSolved ? (
            <div> Great job!!!!!! </div>
          ) : (
            <div
              className="
            text-base
            font-semibold
            "
            >
              Guesses Remaining:
              <span className="font-normal">
                &nbsp; {guessesRemaining.toString()}
              </span>
            </div>
          )}
        </div>
        <div
          className="
            puzzle-button-container
            flex
            justify-between
            pl-4
            pr-4
          "
        >
          <div className="flex gap-6">
            <PuzzleButton
              disabled={!selectedAnswers || puzzleSolved}
              onClick={onClickClear}
            >
              Clear
            </PuzzleButton>
            <PuzzleButton disabled={puzzleSolved} onClick={onClickShuffle}>
              Shuffle
            </PuzzleButton>
          </div>
          <PuzzleButton
            disabled={selectedAnswers.length !== 4 || puzzleSolved}
            onClick={onClickSubmit}
          >
            Submit
          </PuzzleButton>
        </div>
      </div>
    </>
  );
};

interface PuzzleButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

const PuzzleButton = (props: React.PropsWithChildren<PuzzleButtonProps>) => {
  const { disabled = false, onClick, children } = props;
  return (
    <button
      className="
    bg-slate-200

    font-medium
    text-base
    text-slate-600

    py-1
    px-6 

    border
    border-slate-300 
    rounded-full 

    disabled:text-slate-300
    disabled:scale-100
    disabled:bg-slate-200
    disabled:border-slate-300 

    hover:text-slate-200
    hover:border-transparent
    hover:bg-slate-400

    active:scale-90
    
    transition-all
    duration-400
    "
      disabled={disabled}
      type="button"
      onClick={onClick}
    >
      {children}
    </button>
  );
};
