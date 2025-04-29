import { Schema } from 'mongoose';
import { Locations } from '../enums/locations';
import { Races } from '../enums/races';
import { ClientDocument } from '../interfaces/clientDocument';

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