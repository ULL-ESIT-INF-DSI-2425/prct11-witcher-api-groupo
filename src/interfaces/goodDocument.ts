import { Document } from 'mongoose';
import { Materials } from '../enums/materials.js';

export interface GoodDocument extends Document {
  id: number;
  name: string;
  description: string;
  material: Materials;
  weight: number;
  value: number;
}