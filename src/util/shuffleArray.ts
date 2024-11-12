// https://dev.to/codebubb/how-to-shuffle-an-array-in-javascript-2ikj

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const shuffleArray = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
};
