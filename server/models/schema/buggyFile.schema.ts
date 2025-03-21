import { Schema } from 'mongoose';

/**
 * Mongoose schema for the BugHunt buggy file.
 *
 * This schema defines the structure of a buggy file. It includes the following fields:
 * - `code`: A string containing the contents of the buggy file
 * - `description`: A string description of the buggy file's intended purpose
 * - `buggyLines`: An array of numbers representing the line numbers where the bugs are
 */
const buggyFileSchema = new Schema(
  {
    code: { type: String, require: true },
    description: { type: String, require: true },
    buggyLines: [{ type: Number }],
  },
  { collection: 'BuggyFile' },
);

export default buggyFileSchema;
