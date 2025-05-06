import { describe, it, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { Client } from '../src/models/clientModel.js';

beforeAll(async () => {
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
  });

  it('Should send an error while create a new client', async () => {
    await request(app)
      .post('/hunters')
      .send({
        name: 'Geralt of Rivia',
        location: "redania"
      }).expect(500);
  });

  it('Should find an existing client', async () => {
    await request(app).get('/hunters?name=Geralt of Rivia').expect(201);
  });

  it('Should not find an existing client', async () => {
    await request(app).get('/hunters?name=Garalt').expect(404);
  });

  // it('Should find an existing client by id', async () => {
  //   await request(app).get('/hunters/68194df25ce1f68d22aa0c63').expect(201);
  // });

  it('Should not find an existing client by id', async () => {
    await request(app).get('/hunters/68194df25ce1f68d22aa0d63').expect(404);
  });

  it('Should successfully modify an existing client', async () => {
    await request(app)
      .patch('/hunters?name=Geralt of Rivia')
      .send({
        id: 3,
        name: 'Geralt of Rivia',
        race: 'elf',
        location: "redania"
      }).expect(201);
  });

  it('Should unsuccessfully modify an existing client', async () => {
    await request(app)
      .post('/hunters?name=Geralt of Rovia')
      .send({
        id: 3,
        name: 'Geralt of Rivia',
        race: 'dragon',
        location: "redania"
      }).expect(500);
  });

  it('Should successfully delete an existing client', async () => {
    await request(app)
      .delete('/hunters?name=Geralt of Rivia')
      .expect(201);
  });

  it('Should unsuccessfully delete an existing client', async () => {
    await request(app)
      .delete('/hunters?name=Garalt of Rivia')
      .expect(404);
  });

  it('Should unsuccessfully delete an existing client', async () => {
    await request(app)
      .delete('/hunters')
      .expect(400);
  });
});