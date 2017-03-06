/**
 * Band model
 */

import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const AlbumSchema = new Schema({
  albumName: {
    type: String,
    trim: true,
    required: true
  },
  link: {
    type: String
  },
  type: {
    type: String,
    trim: true
  },
  year: {
    type: Number
  }
});

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
  },
  album: {
    type: [AlbumSchema],
    trim: true
  }
});

export const Band = mongoose.model('Band', BandSchema);
