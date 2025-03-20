import {
  GameMove,
  BugHuntGameState,
  BugHuntMove,
  LogType,
  GameLog,
  BuggyFile,
} from '../../types/types';
import BuggyFileModel from '../../models/buggyFile.model';
import { MAX_BUGHUNT_GUESSES, MAX_BUGHUNT_PLAYERS } from '../../types/constants';
import Game from './game';

/**
 * Represents a game of BugHunt, extending fthe generic Game class.
 *
 * This class contains the game logic for playing a game of BugHunt
 */
class BugHuntGame extends Game<BugHuntGameState, BugHuntMove> {
  private _buggyLines: number[] = [];
  /**
   * Constructor for the BugHunt class, initializes the game state and type.
   */
  public constructor() {
    super(
      {
        status: 'WAITING_TO_START',
        moves: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        logs: [],
        scores: [],
      },
      'BugHunt',
    );
  }

  /**
   * Checks if the given playerID has already lost (guess the max number of times)
   * @param playerID the string ID of the player to check if they have lost
   * @returns true if the player has lost, false if the player has not lost
   */
  private _playerHasLost(playerID: string): boolean {
    return (
      this.state.moves.filter(move => move.playerID === playerID).length >= MAX_BUGHUNT_GUESSES
    );
  }

  /**
   * Checks if the given playerID has already won (correctly guessed all of the buggy lines)
   * @param playerID the string ID of the player to check if they have won
   * @returns true if the player has won, false if the player has not won
   */
  private _playerHasWon(playerID: string): boolean {
    return this.state.winners !== undefined && this.state.winners.includes(playerID);
  }

  /**
   * Validates the move based on if the player has any turns remaining, the status of the
   * game and the number of lines they selected.
   * @param gameMove The BugHunt GameMove that was played
   */
  private _validateMove(gameMove: GameMove<BugHuntMove>): void {
    const { playerID, move } = gameMove;

    // Ensure the game is in progress.
    if (this.state.status !== 'IN_PROGRESS') {
      throw new Error('Invalid move: game is not in progress');
    }

    if (this._playerHasLost(playerID)) {
      throw new Error('Invalid move: player already guessed the maximum number of times');
    }

    if (this._playerHasWon(playerID)) {
      throw new Error('Invalid move: player has already won');
    }

    if (!this.state.buggyFile) {
      throw new Error('Game error: Buggy file was never chosen');
    }

    if (move.selectedLines.length !== this._buggyLines.length) {
      throw new Error(
        'Invalid move: number of lines selected does not match the number of bugs in the file',
      );
    }
  }

  /**
   * Checks if the game is over (all players have either won or lost). If over, sets the game
   * state to OVER.
   */
  private _checkGameOver(): void {
    if (
      this._players.every(playerID => this._playerHasLost(playerID) || this._playerHasWon(playerID))
    ) {
      this.state = {
        ...this.state,
        status: 'OVER',
      };
    }
  }

  /**
   * Based on the given move, add the player to the winners list if they correctly guessed all
   * of the buggy lines of code.
   * @param move The BugHunt GameMove that was played
   * @returns an updated list of winners based on the move
   */
  private _addWinners(move: GameMove<BugHuntMove>): readonly string[] | undefined {
    if (!this.state.buggyFile) {
      throw new Error('Game error: Buggy file was never selected');
    }
    const guessedLines = [...move.move.selectedLines].sort();
    const correctLines = [...this._buggyLines].sort();
    for (let i = 0; i < guessedLines.length; ++i) {
      if (guessedLines[i] !== correctLines[i]) {
        return this.state.winners;
      }
    }
    if (this.state.winners === undefined) {
      return [move.playerID];
    }
    return [...this.state.winners, move.playerID];
  }

  /**
   * Applies a move to the game, validating it and updating the state.
   * @param move The BugHunt GameMove to apply
   */
  public applyMove(move: GameMove<BugHuntMove>): void {
    this._validateMove(move);

    const updatedMoves = [...this.state.moves, move];

    this.state = {
      ...this.state,
      moves: updatedMoves,
      winners: this._addWinners(move),
    };

    this._checkGameOver();
  }

  /**
   * Joins a player to the game. The game can only be joined if it is waiting to start.
   * @param playerID The ID of the player joining the game.
   * @throws Will throw an error if the player cannot join.
   */
  protected _join(playerID: string): void {
    if (this.state.status !== 'WAITING_TO_START') {
      throw new Error('Cannot join game: already started');
    }

    if (this._players.includes(playerID)) {
      throw new Error('Cannot join game: player already in game');
    }

    if (this._players.length >= MAX_BUGHUNT_PLAYERS) {
      throw new Error('Cannot join game: max number of players already in game');
    }

    let logType: LogType;
    if (this._players.length === 0) {
      logType = 'CREATED_GAME';
    } else {
      logType = 'JOINED';
    }

    const playerJoinedLog: GameLog = {
      player: playerID,
      createdAt: new Date(),
      type: logType,
    };

    this.state = {
      ...this.state,
      logs: [...this.state.logs, playerJoinedLog],
    };

    if (this._players.length === MAX_BUGHUNT_PLAYERS - 1) {
      this.state = {
        ...this.state,
        status: 'IN_PROGRESS',
      };
    }
  }

  /**
   * Selects a random buggy file from the DB and updates the state with its id.
   */
  private async _selectRandBuggyFile(): Promise<void> {
    const buggyFiles: BuggyFile[] = await BuggyFileModel.find();
    if (buggyFiles.length === 0) {
      throw new Error('Cannot select buggy file: no files found');
    }
    const randI = Math.floor(Math.random() * buggyFiles.length);
    this._buggyLines = [...buggyFiles[randI].buggyLines];
    this.state = { ...this.state, buggyFile: buggyFiles[randI]._id };
  }

  /**
   * Starts the game. The game can only be started if it is waiting to start.
   * @param playerID The ID of the player starting the game.
   * @throws Will throw an error if the game cannot be started successfully
   */
  protected async _start(playerID: string): Promise<void> {
    if (this.state.status !== 'WAITING_TO_START') {
      throw new Error('Cannot start game: game already started');
    }

    if (this._players.length === 0) {
      throw new Error('Cannot start game: no players');
    }

    if (!this.state.logs.some(log => log.player === playerID && log.type === 'CREATED_GAME')) {
      throw new Error('Cannot start game: not game admin');
    }
    await this._selectRandBuggyFile();
    const gameStartedLog: GameLog = {
      player: playerID,
      createdAt: new Date(),
      type: 'STARTED',
    };

    this.state = {
      ...this.state,
      status: 'IN_PROGRESS',
      logs: [...this.state.logs, gameStartedLog],
    };
  }

  /**
   * Removes a player from the game. If a player leaves during an ongoing game, the game ends.
   * @param playerID The ID of the player leaving the game.
   * @throws Will throw an error if the player is not in the game.
   */
  protected _leave(playerID: string): void {
    if (!this._players.includes(playerID)) {
      throw new Error(`Cannot leave game: player ${playerID} is not in the game.`);
    }

    if (this.state.status === 'IN_PROGRESS') {
      if (this._players.length === 0) {
        this.state = {
          ...this.state,
          status: 'OVER',
        };
      } else {
        this._checkGameOver();
      }
    }
  }
}

export default BugHuntGame;
