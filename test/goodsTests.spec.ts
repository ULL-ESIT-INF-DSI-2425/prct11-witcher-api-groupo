import { describe, it, beforeAll, expect } from 'vitest';
import request from 'supertest';
import { app } from '../src/app.js';
import { Good } from '../src/models/goodModel.js';

const firstGood = {
  id: 9,
  name: 'A wonderful good',
  description: 'This is a good',
  material: 'makaham steel',
  weight: 12.54,
  value: 100,
  stock: 10
}

beforeAll(async () => {
  await Good.deleteMany();
  await new Good(firstGood).save();
});


describe('Good API', () => {
  it('Should successfully create a new good', async () => {
    const response = await request(app)
      .post('/goods')
      .send({
        id: 3,
        name: 'Awful good',
        description: 'This is a an awful good',
        material: 'resin',
        weight: 0.3,
        value: 1,
        stock: 2
      }).expect(201);

    expect(response.body).to.include({
      id: 3,
      name: 'Awful good',
      description: 'This is a an awful good',
      material: 'resin',
      weight: 0.3,
      value: 1,
      stock: 2
    });
  });

  it('Should send an error while create a new good', async () => {
    await request(app).post('/goods')
      .send({
        description: 'This is a good',
        material: 'makaham steel',
        weight: 12.54,
        value: 100
      }).expect(400);
  });

  it('Update the stock of an existing good while creating it', async () => {
    const response = await request(app)
      .post('/goods')
      .send({
        id: 9,
        name: 'A wonderful good',
        description: 'This is a good',
        material: 'makaham steel',
        weight: 12.54,
        value: 100,
        stock: 10
      }).expect(200);
    expect(response.body).to.include({
      id: 9,
      name: 'A wonderful good',
      description: 'This is a good',
      material: 'makaham steel',
      weight: 12.54,
      value: 100,
      stock: 20
    });
    const response2 = await request(app)
      .post('/goods')
      .send({
        id: 9,
        name: 'A wonderful good',
        description: 'This is a good',
        material: 'makaham steel',
        weight: 12.54,
        value: 100,
        stock: 10
      }).expect(200);
    expect(response2.body).to.include({
      id: 9,
      name: 'A wonderful good', 
      description: 'This is a good',
      material: 'makaham steel',
      weight: 12.54,
      value: 100,
      stock: 30
    });
  });

  it('Should find an existing good', async () => {
    await request(app).get('/goods?name=A wonderful good').expect(200);
  });

  it('Should not find an non-existing good', async () => {
    await request(app).get('/goods?name=Garalt').expect(404);
  });

  it('Should send an error while find an existing good', async () => {
    await request(app).get('/goods?name= ').expect(404);
  });

  it('Should find an existing good by id', async () => {
    const example = await request(app)
      .post('/goods')
      .send({
        id: 13,
        name: 'A wonderful good',
        description: 'This is a good',
        material: 'makaham steel',
        weight: 12.54,
        value: 100,
        stock: 10
      })

    await request(app).get(`/goods/${example.body._id}`).expect(200);
  });

  it('Should not find an existing good by id', async () => {
    await request(app).get('/goods/123456789012345678901234').expect(404);
  });

  it('Should successfully modify an existing good', async () => {
    await request(app)
      .patch('/goods?name=A wonderful good')
      .send({
        id: 31,
        name: 'A wonderful good',
        description: 'This is a good',
        material: 'makaham steel',
        weight:
          12.54,
        value: 100,
        stock: 10
      }).expect(200);
  });

  // it('Should unsuccessfully modify an existing good', async () => {
  //   await request(app)
  //     .post('/goods?name=A wonderful good')
  //     .send({
  //       id: 3,
  //       name: 'A wonderful good',
  //       description: 'This is a good',
  //       material: 'makaham steel',
  //       weight: 12.54,
  //       value: 100,
  //       stock: 10
  //     }).expect(500);
  // });

  it('Should successfully delete an existing good', async () => {
    await request(app)
      .delete('/goods?name=A wonderful good')
      .expect(200);
  } );

  // it('Should unsuccessfully delete an existing good', async () => {
  //   await request(app)
  //     .delete('/goods?name=Garalt')
  //     .expect(404);
  // }
  // );
  // it('Should unsuccessfully delete an existing good', async () => {
  //   await request(app)
  //     .delete('/goods')
  //     .expect(400);
  // }
  // );
  // it('Should send an error while find an existing good', async () => {
  //   await request(app).get('/goods?name= ').expect(500);
  // }
  // );

});