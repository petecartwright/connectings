export interface GameState {
	solvedThemes: SolvedTheme[];
	choices: Choice[];
}

export interface SolvedTheme {
	choices: Choice[];
	color: string;
	theme: string;
}

export interface Choice {
	choiceText: string;
	color: string;
	theme: string;
	isSelected: boolean;
	isAvailableToChoose: boolean;
}
