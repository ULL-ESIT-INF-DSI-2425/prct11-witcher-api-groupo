import { Schema } from 'mongoose';
import { Locations } from '../enums/locations.js';
import { Materials } from '../enums/materials.js';
import { GoodDocument } from '../interfaces/goodDocument.js';

const GoodSchema = new Schema<GoodDocument>({
  name: {
    type: String,
  },
  material: {
    type: String,
    enum: Object.values(Materials)
  },


})