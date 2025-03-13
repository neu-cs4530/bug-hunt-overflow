import { Schema } from 'mongoose';

/**
 * Mongoose schema for the BugHunt buggy file.
 *
 * This schema defines the structure of a buggy file. It includes the following fields:
 * - `code`: A string containing the contents of the buggy file
 * - `description`: A string description of the buggy file's intended purpose
 * - `buggyLines`: An array of numbers representing the line numbers where the bugs are
 */
const buggyFileSchema = new Schema({
  code: { type: String, require: true },
  description: { type: String, require: true },
  buggyLines: [{ type: Number }],
});

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
const bughuntGameStateSchema = new Schema({
  moves: [{ selectedLines: [{ type: Number, required: true }] }],
  winners: [{ type: String }],
  status: { type: String, enum: ['IN_PROGRESS', 'WAITING_TO_START', 'OVER'], required: true },
  buggyFile: { type: buggyFileSchema },
});

const bugHuntSchema = new Schema({
  state: { type: bughuntGameStateSchema, required: true },
});

export default bugHuntSchema;
