import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { Client } from '../src/models/clientModel.js';

beforeEach(async () => {
  await Client.deleteMany();
});

describe('Client API', () => {
  it('Should successfully create a new client', async () => {
    await request(app)
      .post('/hunters')
      .send({
        id: 3,
        name: 'Geralt of Rivia',
        race: 'human',
        location: "redania"
      }).expect(201);
  })
});