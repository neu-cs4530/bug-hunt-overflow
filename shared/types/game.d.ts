import { Request } from 'express';

/**
 * Type representing the possible game types as a literal.
 * This is derived from the GAME_TYPES constant.
 */
export type GameType = 'Nim' | 'BugHunt' | 'BugHuntDaily';

/**
 * Type representing the unique identifier for a game instance.
 */
export type GameInstanceID = string;

/**
 * Type representing the possible statuses of a game.
 * - `IN_PROGRESS`: The game is ongoing.
 * - `WAITING_TO_START`: The game is waiting for players to join or ready up.
 * - `OVER`: The game has finished.
 */
export type GameStatus = 'IN_PROGRESS' | 'WAITING_TO_START' | 'OVER' | 'DAILY';

/**
 * Type represents the possible log types in a game. Should describe the action.
 * - `CREATED_GAME`: A log indicating the game was created.
 * - `JOINED`: A log of who joined the game.
 * - `STARTED`: A log of who started the game.
 */
export type LogType = 'CREATED_GAME' | 'JOINED' | 'STARTED';

/**
 * Interface representing a buggy file for BugHunt, which includes:
 * code: The code which is partially buggy
 * description: A description of what the code is supposed to do
 * buggyLines: The line numbers where bugs are present
 */
export interface BuggyFile {
  _id: string;
  code: string;
  description: string;
  buggyLines: number[];
}

/**
 * Provides a BuggyFile without the buggyLines (answers).
 */
export type SafeBuggyFile = Omit<BuggyFile, 'buggyLines'> & {
  numberOfBugs: number;
};

/**
 * Interface representing the state of a game, which includes:
 * - `status`: The current status of the game.
 */
export interface GameState {
  status: GameStatus;
}

/**
 * Interface representing a game instance, which contains:
 * - `state`: The current state of the game, defined by `GameState`.
 * - `gameID`: The unique identifier for the game instance.
 * - `players`: An array of player IDs participating in the game.
 * - `gameType`: The type of game (e.g., 'Nim').
 */
export interface GameInstance<T extends GameState> {
  state: T;
  gameID: GameInstanceID;
  players: string[];
  gameType: GameType;
}

/**
 * Interface extending `GameState` to represent a game state that has winners.
 * - `winners`: An optional array of player IDs who have won the game.
 */
export interface WinnableGameState extends GameState {
  winners?: ReadonlyArray<string>;
}

/**
 * Interface representing a move in the game, which contains:
 * - `playerID`: The ID of the player making the move.
 * - `gameID`: The ID of the game where the move is being made.
 * - `move`: The actual move made by the player, which can vary depending on the game type.
 */
export interface GameMove<MoveType> {
  playerID: string;
  gameID: GameInstanceID;
  move: MoveType;
}

/**
 * Base interface for moves. Other game-specific move types should extend this.
 */
export interface BaseMove {}

/**
 * Interface representing a move in a Nim game.
 * - `numObjects`: The number of objects the player wants to remove from the game.
 */
export interface NimMove extends BaseMove {
  numObjects: number;
}

/**
 * Interface representing the state of a Nim game, which includes:
 * - `moves`: A list of moves made in the game.
 * - `player1`: The ID of the first player.
 * - `player2`: The ID of the second player.
 * - `remainingObjects`: The number of objects remaining in the game.
 */
export interface NimGameState extends WinnableGameState {
  moves: ReadonlyArray<NimMove>;
  player1?: string;
  player2?: string;
  remainingObjects: number;
}

/**
 * Interface representing a move in a BugHunt game.
 * - `selectedLines`: The lines selected by the user where
 *                    they think a bug is present
 */
export interface BugHuntMove extends BaseMove {
  selectedLines: number[];
  isHint?: boolean;
}

/**
 * Interface representing a log entry in a game.
 * - `player`: Username of who the log relates to.
 * - `createdAt`: When the log was created.
 * - `type`: Enum of what the type (or action) the log relates to.
 */
export interface GameLog {
  player: string;
  createdAt: Date;
  type: LogType;
}

/**
 * Inteface representing a score entry in a Bug Hunt game.
 * - `player`: Username of the player who scored.
 * - `timeMilliseconds`: The amount of time (in milliseconds) that it took the user to complete the game.
 * - `accuracy`: An accuracy percentage (0 - 100) denoting how many correct guesses the player made during the game.
 */
export interface BugHuntScore {
  player: string;
  timeMilliseconds: number;
  accuracy: number;
}

/**
 * Interface representing the state of a BugHunt game, which inludes:
 * - `moves`: A list of moves made in the game.
 * - `buggyFile`: The buggy file the users will play with.
 * - `createdAt`: When the game sate was initially created.
 * - `updatedAt`: When the game state was last updated.
 * - `logs`: A list of logs from player actions in the game.
 * - `scores`: A list of scores for players that have finished the game.
 */
export interface BugHuntGameState extends WinnableGameState {
  moves: ReadonlyArray<GameMove<BugHuntMove>>;
  buggyFile?: string;
  createdAt: Date;
  updatedAt: Date;
  logs: ReadonlyArray<GameLog>;
  scores: ReadonlyArray<BugHuntScore>;
}

/**
 * Interface extends the request body when validating line numbers of a buggy file.
 * - `body`
 *  - `lines`: The array of line numbers to validate
 */
export interface BuggyFileValidateRequest extends Request {
  body: {
    lines: number[];
  };
}

/**
 * Interface extending the request body when creating a game, which contains:
 * - `gameType`: The type of game to be created (e.g., 'Nim').
 */
export interface CreateGameRequest extends Request {
  body: {
    gameType: GameType;
  };
}

/**
 * Interface extending the request query parameters when retrieving games,
 * which contains:
 * - `gameType`: The type of game.
 * - `status`: The status of the game (e.g., 'IN_PROGRESS', 'WAITING_TO_START').
 */
export interface GetGamesRequest extends Request {
  query: {
    gameType: GameType;
    status: GameStatus;
  };
}

/**
 * Interface extending the request path params when retrieving a single game by ID,
 * which contains:
 * - `gameId`: The ID of the game to retrieve
 */
export interface GetGameByIdRequest extends Request {
  params: {
    gameId: string;
  };
}

/**
 * Interface extending the request body when performing a game-related action,
 * which contains:
 * - `gameID`: The ID of the game being interacted with.
 * - `playerID`: The ID of the player performing the action (e.g., making a move).
 */
export interface GameRequest extends Request {
  body: {
    gameID: GameInstanceID;
    playerID: string;
  };
}

/**
 * Interface for querying games based on game type and status.
 * - `gameType`: The type of game to query (e.g., 'Nim').
 * - `state.status`: The status of the game (e.g., 'IN_PROGRESS').
 */
export interface FindGameQuery {
  'gameType'?: GameType;
  'state.status'?: GameStatus;
}

/**
 * Type representing the list of game instances.
 * This is typically used in responses to return multiple games.
 */
export type GamesResponse = GameInstance<GameState>[];
