interface Props {
  puzzleId: string;
}

export const PuzzleNotFound = ({ puzzleId }: Props): React.ReactElement => {
  return (
    <div className="flex justify-center items-center h-80">
      Puzzle {puzzleId} not found!
    </div>
  );
};
