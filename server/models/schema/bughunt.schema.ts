import { Schema } from 'mongoose';

/**
 * Mongoose schema for the BugHunt game state.
 *
 * This schema defines the structure of the game state specific to the BugHunt game. It includes the following fields:
 * - `moves`: An array of moves made by the players. Each move contains:
 *    - `selectedLines`: The lines selected by the user that they think contain bugs
 * - `winners`: An array of usernames of the players who won the game.
 * - `status`: The current game status, which can be one of the following values:
 *    - `'IN_PROGRESS'`: The game is ongoing.
 *    - `'WAITING_TO_START'`: The game is waiting to start.
 *    - `'OVER'`: The game is finished.
 * - `logs`: A log of who created, joined, or started a game and when. It includes:
 *    - `player`: The player whose event was logged
 *    - `createdAt`: The time the event was logged
 *    - `type`: The type of event which can be one of:
 *       - `'CREATED_GAME'`: The game was created
 *       - `'JOINED'`: The game was joined
 *       - `'STARTED'`: The game was started
 * - `scores`: An array of players who finished and their play time / accuracy. It includes:
 *    - `player`: The player whose scored these metrics
 *    - `timeMilliseconds`: The time in ms it took for the player to finish
 *    - `accuracy`: The accuracy of the player's guesses
 * - `buggyFile`: The ID of the buggy file users are finding the bugs in
 */
const bughuntGameStateSchema = new Schema(
  {
    moves: [
      {
        gameID: { type: Schema.Types.ObjectId },
        playerID: { type: String },
        move: { selectedLines: [{ type: Number, required: true }] },
      },
    ],
    winners: [{ type: String }],
    status: {
      type: String,
      enum: ['IN_PROGRESS', 'WAITING_TO_START', 'OVER', 'DAILY'],
      required: true,
    },
    logs: [
      {
        player: { type: String },
        createdAt: { type: Date },
        type: {
          type: String,
          enum: ['CREATED_GAME', 'JOINED', 'STARTED'],
          required: true,
        },
      },
    ],
    scores: [
      {
        player: { type: String },
        timeMilliseconds: { type: Number },
        accuracy: { type: Number },
      },
    ],
    buggyFile: Schema.Types.ObjectId,
  },
  {
    timestamps: true,
  },
);

const bugHuntSchema = new Schema({
  state: { type: bughuntGameStateSchema, required: true },
});

export default bugHuntSchema;
