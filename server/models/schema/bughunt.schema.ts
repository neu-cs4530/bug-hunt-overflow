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
 * - `buggyFile`: The buggy file users are finding the bugs in
 */
const bughuntGameStateSchema = new Schema(
  {
    moves: [
      {
        gameID: { type: Schema.Types.ObjectId },
        player: { type: String },
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
        sentAt: { type: Date },
        joinType: {
          type: String,
          enum: ['CREATED_GAME', 'JOINED'],
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
