import { Document, Schema, model } from 'mongoose';

interface FunkoInterface extends Document {
  id: number,
  name: string,
  description: string,
  typefunko: 'Pop!' | 'Pop! Rides' | 'Vynil Soda' | 'Vynil Gold',
  genre: 'Animation' | 'Movies' | 'Videogames' | 'Sports' | 'Music' | 'Anime',
  franchise: string,
  num: number,
  exclusive: boolean,
  specs: string,
  value: number
}

const FunkoSchema = new Schema<FunkoInterface>({
  id: {
    type: Number,
    unique: true,
    required: true,
    validate: (value: number) => {
      if (value < 0 || !Number.isInteger(value)) {
        throw new Error('ID must be a positive integer');
      }
    },
  },
  name: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    validate: (value: string) => {
      if (!value.match(/^[A-Z]/)) {
        throw new Error('Funko name must start with a capital letter');
      }
    },
  },
  description: {
    type: String,
    required: true,
    trim: false,
  },
  typefunko: {
    type: String,
    trim: true,
    default: 'Pop!',
    enum: ['Pop!', 'Pop! Rides', 'Vynil Soda', 'Vynil Gold'],
  },
  genre: {
    type: String,
    trim: true,
    default: 'Movies',
    enum: ['Animation', 'Movies', 'Videogames', 'Sports', 'Music', 'Anime'],
  },
  franchise: {
    type: String,
    required: true,
    trim: true,
  },
  num: {
    type: Number,
    unique: false,
    required: true,
    validate: (value: number) => {
      if (value < 0 || !Number.isInteger(value)) {
        throw new Error('Number of the funko must be a positive integer');
      }
    },
  },
  exclusive: {
    type: Boolean,
    required: true,
    default: false
  },
  specs: {
    type: String,
    required: true,
    trim: false,
  },
  value: {
    type: Number,
    unique: false,
    required: true,
    validate: (valor: number) => {
      if (valor < 0) {
        throw new Error('Value of the funko must be a positive number');
      }
    },
  }
});

export const Funko = model<FunkoInterface>('Funko', FunkoSchema);