import dayjs from 'dayjs';

import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

/**
 * Formats the provided milliseconds into a formatted duration string.
 * @param timeMilliseconds the duration in milliseconds.
 * @returns the formatted duration string.
 */
// eslint-disable-next-line import/prefer-default-export
export const formatDuration = (timeMilliseconds: number) => {
  const dur = dayjs.duration(timeMilliseconds);
  const hours = dur.hours();
  const minutes = dur.minutes();
  const seconds = dur.seconds();

  let durationStr = '';

  if (hours) {
    durationStr += `${hours}h `;
  }

  if (minutes) {
    durationStr += `${minutes}m `;
  }

  durationStr += `${seconds}s`;
  return durationStr;
};
