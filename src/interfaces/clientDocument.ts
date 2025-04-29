import { Document } from 'mongoose';
import { Races } from '../enums/races';
import { Locations } from '../enums/locations';

export interface ClientDocument extends Document {
  name: string;
  race: Races;
  location: Locations;
}