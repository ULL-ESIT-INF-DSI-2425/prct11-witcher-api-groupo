import { Document } from 'mongoose';
import { Races } from '../enums/races.js';
import { Locations } from '../enums/locations.js';

export interface ClientDocument extends Document {
  name: string;
  race: Races;
  location: Locations;
}