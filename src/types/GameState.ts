export interface GameState {
  solvedGroups: SolvedGroup[];
  answers: GameAnswer[];
}

export interface SolvedGroup {
  answers: GameAnswer[];
  level: number;
  group: string;
}

export interface GameAnswer {
  memberText: string;
  level: number;
  group: string;
  isSelected: boolean;
  isAvailableToChoose: boolean;
}

// format of puzzles in "the archive" in data/connections.json
export interface Puzzle {
  id: number;
  date: string; // YYYY-MM-DD format
  answers: Answer[];
}

export interface Answer {
  level: number;
  group: string;
  members: string[];
}

export interface PuzzleIdReducerAction {
  type: "add_answer" | "complete_group" | "clear_selection";
  memberText?: string;
  completedGroup?: string;
}
