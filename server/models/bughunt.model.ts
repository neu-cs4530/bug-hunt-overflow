import { Model } from 'mongoose';
import { GameInstance, BugHuntGameState } from '../types/types';
import GameModel from './games.model';
import bugHuntSchema from './schema/bughunt.schema';

/**
 * Mongoose model for the `BugHunt` game, extending the `Game` model using a discriminator.
 *
 * This model adds specific fields from the `bugHuntSchema` to the `Game` collection, enabling operations
 * specific to the `BugHunt` game type while sharing the same collection.
 */
const BugHuntModel: Model<GameInstance<BugHuntGameState>> = GameModel.discriminator(
  'BugHunt',
  bugHuntSchema,
);

export default BugHuntModel;
