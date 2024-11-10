import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { shuffleArray } from "../../util/shuffleArray";
import type { Choice, GameState, SolvedTheme } from "../../types/GameState";

const BACKGROUND_COLOR_TO_TAILWIND_CLASS = {
	violet: "bg-violet-400",
	amber: "bg-amber-400",
	teal: "bg-teal-400",
	blue: "bg-blue-400",
};

export const Route = createFileRoute("/puzzles/$puzzleId")({
	component: RouteComponent,
});

const createInitialState = (): GameState => {
	const allChoices: Choice[] = [];

	for (const group of fakePuzzle.choices) {
		for (const choice of group.choices) {
			allChoices.push({
				theme: group.theme,
				color: group.color,
				choiceText: choice,
				isSelected: false,
				isAvailableToChoose: true,
			});
		}
	}
	shuffleArray(allChoices);

	return { solvedThemes: [], choices: allChoices };
};

const allChoicesOnTheme = (choices: Choice[]): boolean => {
	// shouldn't get here with non-4 choices but let's be sure i guess?
	if (choices.length !== 4) return false;
	const theme = choices[0].theme;
	return choices.every((choice) => choice.theme === theme);
};

// TODO: type the action
const reducer = (state: GameState, action): GameState => {
	switch (action.type) {
		case "add_choice": {
			const newChoices = state.choices.map((choice) => {
				if (choice.choiceText === action.choiceText) {
					choice.isSelected = !choice.isSelected;
				}
				return choice;
			});

			return {
				...state,
				choices: newChoices,
			};
		}
		case "complete_theme": {
			// remove the on-theme choices from the array of options
			const newChoices = state.choices.filter(
				(choice) => choice.theme !== action.completedTheme,
			);
			const solvedChoices = state.choices.filter(
				(choice) => choice.theme === action.completedTheme,
			);

			// add the theme to solvedThemes
			const newSolvedThemes = state.solvedThemes;
			newSolvedThemes.push({
				color: solvedChoices[0].color,
				theme: action.completedTheme,
				choices: solvedChoices,
			});

			return {
				...state,
				solvedThemes: newSolvedThemes,
				choices: newChoices,
			};
		}
		case "clear_selection": {
			const choicesNoSelections = state.choices.map((choice) => ({
				...choice,
				isSelected: false,
			}));

			return {
				...state,
				choices: choicesNoSelections,
			};
		}
	}
	throw Error(`Unknown action: ${action.type}`);
};

function RouteComponent() {
	const [state, dispatch] = React.useReducer(reducer, createInitialState());

	React.useEffect(() => {
		const selectedChoices = state.choices.filter((choice) => choice.isSelected);
		if (selectedChoices.length === 4) {
			// check for a match
			const choicesCompleteTheme = allChoicesOnTheme(selectedChoices);

			if (!choicesCompleteTheme) {
				setTimeout(() => {
					dispatch({ type: "clear_selection" });
				}, 400);
			} else {
				const completedTheme = selectedChoices[0].theme;
				setTimeout(() => {
					dispatch({ type: "complete_theme", completedTheme });
					dispatch({ type: "clear_selection" });
				}, 400);
			}
		}
	}, [state]);

	const onClickAnswer = (event: React.MouseEvent<HTMLDivElement>) => {
		if (!event.currentTarget.innerText) return;
		const choiceText = event.currentTarget.innerText;
		dispatch({
			type: "add_choice",
			choiceText,
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
				{state.solvedThemes.length > 0
					? state.solvedThemes.map((solvedTheme) => (
							<div
								key={solvedTheme.theme}
								// @ts-ignore
								className={`p-4 ${BACKGROUND_COLOR_TO_TAILWIND_CLASS[solvedTheme.color]} rounded-lg mb-4 `}
							>
								<h1>{solvedTheme.theme}</h1>
								<h2>
									{solvedTheme.choices
										.map((choice) => choice.choiceText)
										.join(", ")}
								</h2>
							</div>
						))
					: null}

				<div
					className="grid grid-cols-4 gap-4 
        "
				>
					{state.choices
						.filter((choice) => choice.isAvailableToChoose)
						.map((choice) => {
							// TODO: consistent styling for these? standardize height somehow
							return (
								<div
									className={`
              p-4 rounded-lg 
              transition
              duration-400
              ${choice.isSelected ? "bg-green-400" : "bg-blue-400"}
              `}
									key={choice.choiceText}
									onKeyUp={() => {
										//TODO: this
									}}
									onClick={onClickAnswer}
								>
									{choice.choiceText}
								</div>
							);
						})}
				</div>
			</div>
		</>
	);
}

interface ChoiceButtonProps {
	choiceText: string;
	selected: boolean;
	onSelect: React.MouseEventHandler<HTMLDivElement>;
}

const fakePuzzle = {
	id: 1234,
	name: "My first puzz",
	creator: "Pete",
	date: "2024-11-09T04:07:02.407Z",
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
