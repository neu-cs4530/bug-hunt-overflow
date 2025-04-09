import NimModel from '../../models/nim.model';
import BugHuntModel from '../../models/bughunt.model';
import GameModel from '../../models/games.model';
import {
  BaseMove,
  BugHuntGameState,
  GameInstance,
  GameInstanceID,
  GameMove,
  GameState,
  GameType,
  NimGameState,
} from '../../types/types';
import Game from './game';
import NimGame from './nim';
import BugHuntGame from './bughunt';

/**
 * Manages the lifecycle of games, including creation, joining, and leaving games.
 *
 * This class is responsible for handling game instances and ensuring that the right game logic is
 * applied based on the game type. It provides methods for adding, removing, joining, and leaving
 * games, and it maintains a map of active game instances.
 */
class GameManager {
  private static _instance: GameManager | undefined;
  private _games: Map<string, Game<GameState, GameMove<unknown>>>;

  /**
   * Private constructor to initialize the games map.
   */
  private constructor() {
    this._games = new Map();
  }

  /**
   * Factory method to create a new game based on the provided game type.
   * @param gameType The type of the game to create.
   * @returns A promise resolving to the created game instance.
   * @throws an error for an unsupported game type
   */
  private async _gameFactory(gameType: GameType): Promise<Game<GameState, BaseMove>> {
    switch (gameType) {
      case 'Nim': {
        const newGame = new NimGame();
        await NimModel.create(newGame.toModel());

        return newGame;
      }
      case 'BugHunt':
      case 'BugHuntDaily': {
        const newGame = new BugHuntGame(gameType);
        await BugHuntModel.create(newGame.toModel());

        return newGame;
      }
      default: {
        throw new Error('Invalid game type');
      }
    }
  }

  /**
   * Factory method to create a new game object from the provided instance.
   * @param gameInstance The instance of the game to create.
   * @returns A promise resolving to the created game instance.
   * @throws an error for an unsupported game type
   */
  private _gameFactoryExisting(gameInstance: GameInstance<GameState>): Game<GameState, BaseMove> {
    const { gameType } = gameInstance;
    switch (gameInstance.gameType) {
      case 'Nim': {
        return new NimGame(gameInstance as GameInstance<NimGameState>);
      }
      case 'BugHunt':
      case 'BugHuntDaily': {
        return new BugHuntGame(gameType, gameInstance as GameInstance<BugHuntGameState>);
      }
      default: {
        throw new Error('Invalid game type');
      }
    }
  }

  /**
   * Singleton pattern to get the unique instance of the GameManager.
   * @returns The instance of GameManager.
   */
  public static getInstance(): GameManager {
    if (!GameManager._instance) {
      GameManager._instance = new GameManager();
    }

    return GameManager._instance;
  }

  /**
   * Creates and adds a new game to the manager games map.
   * @param gameType The type of the game to add.
   * @returns The game ID or an error message.
   */
  public async addGame(gameType: GameType): Promise<GameInstanceID | { error: string }> {
    try {
      const newGame = await this._gameFactory(gameType);
      this._games.set(newGame.id, newGame);

      return newGame.id;
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  /**
   * Removes a game from the manager by its ID.
   * @param gameID The ID of the game to remove.
   * @returns Whether the game was successfully removed.
   */
  public removeGame(gameID: string): boolean {
    return this._games.delete(gameID);
  }

  /**
   * Joins an existing game.
   * @param gameID The ID of the game to join.
   * @param playerID The ID of the player joining the game.
   * @returns The game instance or an error message.
   */
  public async joinGame(
    gameID: GameInstanceID,
    playerID: string,
  ): Promise<GameInstance<GameState> | { error: string }> {
    try {
      const gameToJoin = await this.getGame(gameID);

      if (gameToJoin === undefined) {
        throw new Error('Game requested does not exist.');
      }

      gameToJoin.join(playerID);
      await gameToJoin.saveGameState();

      return gameToJoin.toModel();
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  /**
   * Starts an existing game.
   * @param gameID The ID of the game to start.
   * @param playerID The ID of the player starting the game.
   * @returns The game instance or an error message.
   */
  public async startGame(
    gameID: GameInstanceID,
    playerID: string,
  ): Promise<GameInstance<GameState> | { error: string }> {
    try {
      const gameToStart = await this.getGame(gameID);

      if (gameToStart === undefined) {
        throw new Error('Game requested does not exist.');
      }

      await gameToStart.start(playerID);
      await gameToStart.saveGameState();

      return gameToStart.toModel();
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  /**
   * Allows a player to leave a game.
   * @param gameID The ID of the game to leave.
   * @param playerID The ID of the player leaving the game.
   * @returns The updated game state or an error message.
   */
  public async leaveGame(
    gameID: GameInstanceID,
    playerID: string,
  ): Promise<GameInstance<GameState> | { error: string }> {
    try {
      const gameToLeave = await this.getGame(gameID);

      if (gameToLeave === undefined) {
        throw new Error('Game requested does not exist.');
      }

      gameToLeave.leave(playerID);
      await gameToLeave.saveGameState();

      const leftGameState = gameToLeave.toModel();

      if (gameToLeave.state.status === 'OVER') {
        this.removeGame(gameID);
      }

      return leftGameState;
    } catch (error) {
      return { error: (error as Error).message };
    }
  }

  /**
   * Gets a game instance by its ID.
   * @param gameID The ID of the game.
   * @returns The game instance or undefined if not found.
   */
  public async getGame(gameID: GameInstanceID): Promise<Game<GameState, BaseMove> | undefined> {
    const game = this._games.get(gameID);
    if (game === undefined) {
      const dbGame: GameInstance<GameState> | null = await GameModel.findOne({ gameID }).lean();
      if (!dbGame) {
        return undefined;
      }

      const newGame = this._gameFactoryExisting(dbGame);
      this._games.set(newGame.id, newGame);
      return newGame;
    }
    return game;
  }

  /**
   * Retrieves all active game instances.
   * @returns An array of all active game instances.
   */
  public getActiveGameInstances(): Game<GameState, BaseMove>[] {
    return Array.from(this._games.values());
  }

  /**
   * Resets the GameManager instance, clearing all active games.
   */
  public static resetInstance(): void {
    GameManager._instance = undefined;
  }
}

export default GameManager;
