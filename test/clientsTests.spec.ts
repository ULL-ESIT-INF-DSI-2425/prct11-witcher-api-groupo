import { describe, it, beforeEach, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { Client } from '../src/models/clientModel.js';

const firstClient = {
  id: 9,
  name: 'ClientePrueba',
  race: 'halveling',
  location: 'redania',
}

beforeEach(async () => {
  await Client.deleteMany();
  await new Client(firstClient).save();
});

describe('Client API', () => {
  it('Should successfully create a new client', async () => {
    const response = await request(app)
    .post('/hunters')
    .send({
      id: 3,
      name: 'Geralt of Rivia',
      race: 'human',
      location: "redania"
    }).expect(201);

    expect(response.body).to.include({
      id: 3,
      name: 'Geralt of Rivia',
      race: 'human',
      location: "redania"
    });
  });

  it('Should send an error while create a new client', async () => {
    await request(app).post('/hunters')
      .send({
        name: 'Geralt of Rivia',
        location: "redania"
      }).expect(500);
  });

  it('Should find an existing client', async () => {
    await request(app).get('/hunters?name=ClientePrueba').expect(202);
  });

  it('Should not find an existing client', async () => {
    await request(app).get('/hunters?name=Garalt').expect(404);
  });

  it('Should find an existing client by id', async () => {
    const example = await request(app)
    .post('/hunters')
    .send({
      id: 13,
      name: 'Geraldo de Rovia',
      race: 'elf',
      location: "novigrad"
    })

    await request(app).get(`/hunters/${example.body._id}`).expect(202);
  });

  it('Should not find an existing client by id', async () => {
    await request(app).get('/hunters/6819e6be2fdd147e408e7b80').expect(404);
  });

  it('Should successfully modify an existing client', async () => {
    await request(app)
      .patch('/hunters?name=ClientePrueba')
      .send({
        id: 3,
        name: 'ClientePrueba',
        race: 'elf',
        location: "redania"
      }).expect(201);
  });

  it('Should send an error for not providing a name', async () => {
    await request(app)
      .patch('/hunters')
      .send({
        id: 3,
        name: 'ClientePrueba',
        race: 'elf',
        location: "redania"
      }).expect(400);
  });

  it('Should send an error for not providing a body', async () => {
    await request(app)
      .patch('/hunters?name=ClientePrueba')
      .send({})
      .expect(400);
  });

  it('Should unsuccessfully modify an existing client', async () => {
    await request(app)
      .patch('/hunters?name=ClientePrueba')
      .send({
        id: 3,
        name: 'ClientePrueba',
        race: 'dragon',
        location: "redania"
      }).expect(500);
  });

  it('Should not find a client to modify it', async () => {
    await request(app)
      .patch('/hunters?name=GaraltofRivia')
      .send({
        id: 3,
        name: 'Geralt of Rivia',
        race: 'dwarf',
        location: "redania"
      }).expect(404);
  });

  it('Should successfully delete an existing client', async () => {
    await request(app)
      .delete('/hunters?name=ClientePrueba')
      .expect(201);
  });

  it('Should unsuccessfully delete an inexisting client', async () => {
    await request(app)
      .delete('/hunters?name=Geralt of Rivia')
      .expect(404);
  });

  it('Should not find a client to remove it', async () => {
    await request(app)
      .delete('/hunters')
      .expect(400);
  });


});