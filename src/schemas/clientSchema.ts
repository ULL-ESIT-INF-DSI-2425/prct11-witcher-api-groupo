import { Schema } from 'mongoose';
import { Races } from '../enums/races';
import { Locations } from '../enums/locations';
import { ClientDocument } from '../interfaces/clientDocument';

const ClientSchema = new Schema<ClientDocument>({
  name: {
    type: String,
  },
  race: {
    type: Races,
  },
  location: {
    type: Locations,
  }

})