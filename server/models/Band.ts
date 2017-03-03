/**
 * Band model
 */

import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const BandSchema = new Schema({
  bandId: {
    type: Number,
    required: true,
    unique: true
  },
  bandName: {
    type: String,
    trim: true,
    required: true
  },
  genre: {
    type: [String]
  },
  country: {
    type: String,
    trim: true
  },
  genreText: {
    type: String,
    trim: true
  },
  link: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  },
  theme: {
    type: [String],
    trim: true
  }
});

export const Band = mongoose.model('Band', BandSchema);
