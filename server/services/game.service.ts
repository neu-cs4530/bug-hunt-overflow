import GameModel from '../models/games.model';
import {
  FindGameQuery,
  GameInstance,
  GameInstanceID,
  GamesResponse,
  GameState,
  GameStatus,
  GameType,
} from '../types/types';

const formatGameInstance = (game: GameInstance<GameState>) => ({
  state: game.state as GameState,
  gameID: game.gameID as GameInstanceID,
  players: game.players as string[],
  gameType: game.gameType as GameType,
});

/**
 * Retrieves games from the database based on the specified game type and status.
 * @param {GameType | undefined} gameType - The type of the game to filter by (e.g., 'Nim').
 * @param {GameStatus | undefined} status - The status of the game to filter by (e.g., 'IN_PROGRESS').
 * @returns {Promise<GamesResponse>} - A promise resolving to a list of games matching the query.
 */
export const findGames = async (
  gameType: GameType | undefined,
  status: GameStatus | undefined,
): Promise<GamesResponse> => {
  const query: FindGameQuery = {};

  // Build database query based on provided filters
  if (gameType) {
    query.gameType = gameType;
  }

  if (status) {
    query['state.status'] = status;
  }

  try {
    const games: GameInstance<GameState>[] = await GameModel.find(query).lean();

    if (games === null) {
      throw new Error('No games found');
    }

    // Format and return the games in reverse order (most recent first)
    return games.map(formatGameInstance).reverse();
  } catch (error) {
    return [];
  }
};

/**
 * Retrieves a game from the database based on the specified ID.
 * @param {GameType | undefined} gameId - The ID of the game to retrieve.
 * @returns {Promise<GamesResponse>} - A promise resolving to a the game with the specified ID.
 */
export const findGameById = async (
  gameId: string,
): Promise<GameInstance<GameState> | undefined> => {
  if (!gameId) {
    return undefined;
  }

  try {
    const game = await GameModel.findOne({ gameID: gameId }).lean();

    if (game === null) {
      return undefined;
    }

    return formatGameInstance(game);
  } catch (error) {
    console.error(error);
    throw new Error('Database error while finding game ID');
  }
};

export default findGames;
