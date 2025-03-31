// eslint-disable-next-line import/prefer-default-export
export const orderTypeDisplayName = {
  newest: 'Newest',
  unanswered: 'Unanswered',
  active: 'Active',
  mostViewed: 'Most Viewed',
} as const;

/**
 * The maximum number of guesses a player can make in BugHunt.
 */
export const BUGHUNT_MAX_GUESSES = 3;

/**
 * The maximum number of players that can join a game of BugHunt.
 */
export const BUGHUNT_MAX_PLAYERS = 30;
