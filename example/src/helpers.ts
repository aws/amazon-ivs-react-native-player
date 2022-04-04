export const parseSecondsToString = (seconds: number) => {
  if (seconds === Infinity || Number.isNaN(seconds) || seconds < 0) {
    return 'live';
  }

  const date = new Date(0);
  date.setSeconds(seconds);
  return date.toISOString().slice(11, 19);
};
