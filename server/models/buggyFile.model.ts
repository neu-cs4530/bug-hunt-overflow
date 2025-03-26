import mongoose, { Model } from 'mongoose';
import { BuggyFile } from '../types/types';
import buggyFileSchema from './schema/buggyFile.schema';

/**
 * Mongoose model for the `BuggyFile` collection.
 *
 * This model is created using the `BuggyFile` interface and the `buggyFileSchema`, representing the
 * `BuggyFile` collection in the MongoDB database, and provides an interface for interacting with
 * the stored buggy files.
 *
 * @type {Model<BuggyFile>}
 */
const BuggyFileModel: Model<BuggyFile> = mongoose.model<BuggyFile>('BuggyFile', buggyFileSchema);

export default BuggyFileModel;
