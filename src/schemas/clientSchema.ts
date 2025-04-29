import { Schema } from 'mongoose';
import { Locations } from '../enums/locations.js';
import { Races } from '../enums/races.js';
import { ClientDocument } from '../interfaces/clientDocument.js';

const ClientSchema = new Schema<ClientDocument>({
  name: {
    type: String,
  },
  race: {
    type: String,
    enum: Object.values(Races)
  },
  location: {
    type: String,
    enum: Object.values(Locations),
  }

})