import type { GameAnswer, GameState, Puzzle } from "../../types/GameState";
import { shuffleArray } from "../../util/shuffleArray";

export interface PuzzleIdReducerAction {
  type:
    | "add_answer"
    | "complete_group"
    | "clear_selection"
    | "increment_missed_guess"
    | "shuffle";
  memberText?: string;
  completedGroup?: string;
}

export const createInitialState = (puzzle: Puzzle | undefined): GameState => {
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

  return { solvedGroups: [], answers: allAnswers, missedGuesses: 0 };
};

export const PuzzleReducer = (
  state: GameState,
  action: PuzzleIdReducerAction,
): GameState => {
  switch (action.type) {
    case "add_answer": {
      const selectedAnswers = state.answers.filter(
        (answer) => answer.isSelected,
      );
      if (selectedAnswers.length >= 4) return state;

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

    case "shuffle": {
      const answersNoSelections = state.answers.map((answer) => ({
        ...answer,
        isSelected: false,
      }));

      shuffleArray(answersNoSelections);
      console.log("\t post shuffle", answersNoSelections);
      return {
        ...state,
        answers: answersNoSelections,
      };
    }

    case "increment_missed_guess": {
      return {
        ...state,
        missedGuesses: state.missedGuesses + 1,
      };
    }
  }
};
