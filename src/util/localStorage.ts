export const getSolvedPuzzles = (): string[] => {
  return window.localStorage.getItem("solvedPuzzles")?.split(",") ?? [];
};

export const addSolvedPuzzle = (puzzleId: string): void => {
  const solvedPuzzles = getSolvedPuzzles();

  if (solvedPuzzles.includes(puzzleId)) return;

  solvedPuzzles.push(puzzleId);

  window.localStorage.setItem("solvedPuzzles", solvedPuzzles.join(","));
};
