export const parseSecondsToString = (seconds: number) => {
  if (seconds === Infinity) {
    return 'live';
  }

  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().substr(11, 8);
};
