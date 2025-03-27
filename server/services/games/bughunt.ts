import {
  GameMove,
  BugHuntGameState,
  BugHuntMove,
  LogType,
  GameLog,
  BuggyFile,
  BugHuntScore,
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
    const { playerID } = gameMove;

    // Ensure the game is in progress.
    if (this.state.status !== 'IN_PROGRESS') {
      throw new Error('Invalid move: game is not in progress');
    }

    if (!this.state.buggyFile) {
      throw new Error('Game error: Buggy file was never chosen');
    }

    if (this._playerHasLost(playerID)) {
      throw new Error('Invalid move: player already guessed the maximum number of times');
    }

    if (this._playerHasWon(playerID)) {
      throw new Error('Invalid move: player has already won');
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
   * Get the accuracy of the given Bug Hunt move
   * @param move the BugHuntMove to check the accuracy of
   * @returns a float between 0-1 of the move correctness
   *          (0 being all wrong, 1 being all correct)
   */
  private _getMoveCorrectness(move: GameMove<BugHuntMove>): number {
    let sum: number = 0;
    move.move.selectedLines.forEach(lineNum => {
      if (this._buggyLines.includes(lineNum)) {
        sum += 1;
      }
    });
    return sum / move.move.selectedLines.length;
  }

  /**
   * Get the score (time and accuracy) of the given player.
   * @param playerID the ID of the player to get the score of
   * @returns the players BugHunt score
   */
  private _getPlayerScore(playerID: string): BugHuntScore {
    const moves = this.state.moves.filter(move => move.playerID === playerID);
    const accuracy =
      moves.reduce((acc, cur) => acc + this._getMoveCorrectness(cur), 0) / moves.length;
    const currentTimeMS = new Date().getMilliseconds();
    const startTimeMS = this.state.logs
      .filter(log => log.type === 'STARTED')[0]
      .createdAt.getMilliseconds();
    const timeMilliseconds = currentTimeMS - startTimeMS;
    return {
      player: playerID,
      accuracy,
      timeMilliseconds,
    };
  }

  /**
   * Check if this move causes a player to win/lose, then update the score/winners accordingly.
   * @param move the BugHuntMove to check for a win or loss.
   */
  private _updateScore(move: GameMove<BugHuntMove>): void {
    if (this._getMoveCorrectness(move) === 1) {
      let updatedWinners: readonly string[] = [move.playerID];
      if (this.state.winners !== undefined) {
        updatedWinners = [...this.state.winners, move.playerID];
      }
      this.state = {
        ...this.state,
        winners: updatedWinners,
        scores: [...this.state.scores, this._getPlayerScore(move.playerID)],
      };
    } else if (this._playerHasLost(move.playerID)) {
      this.state = {
        ...this.state,
        scores: [...this.state.scores, this._getPlayerScore(move.playerID)],
      };
    }
  }

  /**
   * Applies a move to the game, validating it and updating the state.
   * @param move The BugHunt GameMove to apply
   */
  public applyMove(move: GameMove<BugHuntMove>): void {
    this._validateMove(move);

    this.state = {
      ...this.state,
      moves: [...this.state.moves, move],
    };

    this._updateScore(move);
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
