import {
  GameType,
  GameMove,
  BugHuntGameState,
  BugHuntMove,
  GameLog,
  BuggyFile,
  BugHuntScore,
} from '../../types/types';
import BuggyFileModel from '../../models/buggyFile.model';
import { BUGHUNT_MAX_GUESSES, BUGHUNT_HINT_PENALTY } from '../../types/constants';
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
  public constructor(gameType: GameType) {
    super(
      {
        status: gameType === 'BugHunt' ? 'WAITING_TO_START' : 'DAILY',
        moves: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        logs: [],
        scores: [],
      },
      gameType,
    );
  }

  /**
   * Checks if the given playerID has already lost (guess the max number of times)
   * @param playerID the string ID of the player to check if they have lost
   * @returns true if the player has lost, false if the player has not lost
   */
  private _playerHasLost(playerID: string): boolean {
    return (
      this.state.moves.filter(move => move.playerID === playerID && !move.move.isHint).length >=
      BUGHUNT_MAX_GUESSES
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
    if (this._gameType !== 'BugHuntDaily' && this.state.status !== 'IN_PROGRESS') {
      throw new Error('Invalid move: game is not in progress');
    }

    if (!this._players.includes(playerID)) {
      throw new Error('Invalid move: player is not in the game');
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
      this._gameType !== 'BugHuntDaily' &&
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
    if (move.move.isHint) {
      return BUGHUNT_HINT_PENALTY;
    }
    let sum: number = 0;
    move.move.selectedLines.forEach(lineNum => {
      if (this._buggyLines.includes(lineNum)) {
        sum += 1;
      }
    });

    return sum / this._buggyLines.length;
  }

  /**
   * Get the score (time and accuracy) of the given player.
   * @param playerID the ID of the player to get the score of
   * @returns the players BugHunt score
   */
  private _getPlayerScore(playerID: string): BugHuntScore {
    const moves = this.state.moves.filter(move => move.playerID === playerID);
    const accuracy = Math.max(
      moves.reduce((acc, cur) => acc + this._getMoveCorrectness(cur), 0) /
        moves.filter(mv => !mv.move.isHint).length,
      0,
    );
    const currentTimeMS = new Date().getTime();
    let startTimeMS = this.state.logs.filter(log => log.type === 'STARTED')[0].createdAt.getTime();
    if (this._gameType === 'BugHuntDaily') {
      startTimeMS = this.state.logs
        .filter(log => log.type === 'JOINED' && log.player === playerID)[0]
        .createdAt.getTime();
    }
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
    if (
      this.state.moves.reduce((acc, cur) => {
        if (cur.move.isHint) {
          return acc;
        }
        return acc + this._getMoveCorrectness(cur);
      }, 0) >= 0.97
    ) {
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

  private _addGameLog(log: GameLog): void {
    this.state = {
      ...this.state,
      logs: [...this.state.logs, log],
    };
  }

  /**
   * Joins a player to the game. The game can only be joined if it is waiting to start.
   * @param playerID The ID of the player joining the game.
   * @throws Will throw an error if the player cannot join.
   */
  protected _join(playerID: string): void {
    if (this._players.includes(playerID)) {
      return;
    }

    if (this._gameType !== 'BugHuntDaily' && this.state.status !== 'WAITING_TO_START') {
      throw new Error('Cannot join game: already started');
    }

    const baseLog = {
      player: playerID,
      createdAt: new Date(),
    };

    const hasCreator = this.state.logs.find(log => log.type === 'CREATED_GAME');
    if (!hasCreator) {
      this._addGameLog({
        ...baseLog,
        type: 'CREATED_GAME',
      });
    }

    const playerAlreadyJoined = this.state.logs.find(
      log => log.type === 'JOINED' && log.player === playerID,
    );
    if (!playerAlreadyJoined) {
      this._addGameLog({
        ...baseLog,
        type: 'JOINED',
      });
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
   * Checks if it is valid for the player to start the game.
   * @param playerID the ID of the player starting the game
   */
  private _validateStart(playerID: string) {
    if (this._gameType === 'BugHuntDaily') {
      return;
    }
    if (this.state.status !== 'WAITING_TO_START') {
      throw new Error('Cannot start game: game already started');
    }

    if (this._players.length === 0) {
      throw new Error('Cannot start game: no players');
    }

    if (!this.state.logs.some(log => log.player === playerID && log.type === 'CREATED_GAME')) {
      throw new Error('Cannot start game: not game admin');
    }
  }

  /**
   * Starts the game. The game can only be started if it is waiting to start, unless it is DAILY.
   * @param playerID The ID of the player starting the game.
   * @throws Will throw an error if the game cannot be started successfully
   */
  protected async _start(playerID: string): Promise<void> {
    this._validateStart(playerID);
    await this._selectRandBuggyFile();
    this._addGameLog({
      player: playerID,
      createdAt: new Date(),
      type: 'STARTED',
    });
    this.state = {
      ...this.state,
      status: this._gameType !== 'BugHuntDaily' ? 'IN_PROGRESS' : 'DAILY',
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
  }
}

export default BugHuntGame;
