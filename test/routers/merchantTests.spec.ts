import { describe, it, beforeEach, expect } from 'vitest';
import request from 'supertest';
import { app } from '../../src/app.js';
import { Merchant } from '../../src/models/merchantModel.js';

const firstMerchant = {
  id: 19,
  name: 'MercaderPrueba',
  location: 'redania',
  merchantType: 'blacksmit',
}

beforeEach(async () => {
  await Merchant.deleteMany();
  await new Merchant(firstMerchant).save();
});

describe('Merchant API', () => {
  it('Should successfully create a new merchant', async () => {
    const response = await request(app)
      .post('/merchants')
      .send({
        id: 71,
        name: "MerchantOfRivia",
        location: "toussant",
        merchantType: "alchemist"
      }).expect(201);

    expect(response.body).to.include({
      id: 71,
      name: "MerchantOfRivia",
      location: "toussant",
      merchantType: "alchemist"
    });
  });

  it('Should send an error while create a new merchant', async () => {
    await request(app).post('/merchants')
      .send({
        name: "Merchant of Rivia",
        location: "toussant",
      }).expect(501);
  });

  it('Should find an existing merchant', async () => {
    await request(app).get('/merchants?name=MercaderPrueba').expect(200);
  });

  it('Should not find an existing merchant', async () => {
    await request(app).get('/merchants?name=Merchantnt').expect(404);
  });

  it('Should find an existing merchant by id', async () => {
    const example = await request(app)
      .post('/merchants')
      .send({
        id: 13,
        name: 'MercaderdeRivia',
        location: 'redania',
        merchantType: 'alchemist'
      })

    await request(app).get(`/merchants/${example.body._id}`).expect(200);
  });

  it('Should not find an existing merchant by id', async () => {
    await request(app).get('/merchants/123456789012345678901234').expect(404);
  });

  it('Should successfully modify an existing merchant', async () => {
    await request(app)
      .patch('/merchants?name=MercaderPrueba')
      .send({
        location: 'nilfgaard',
        merchantType: 'alchemist'
      }).expect(200);
  });

  it('Should send an error for not providing a name', async () => {
    await request(app)
      .patch('/merchants')
      .send({
        location: 'nilfgaard',
        merchantType: 'alchemist'
      }).expect(400);
  });

  it('Should send an error for not providing a body', async() => {
    await request(app)
      .patch('/merchants?name=MercaderPrueba')
      .send({}).expect(400);
  });

  it('Should unsuccessfully modify an existing merchant', async() => {
    await request(app)
    .patch('/merchants?name=MercaderPrueba')
    .send({
        id: 3,
        name: 'MercaderPrueba',
        location: 'nilfgaard',
        merchantType: 'alchemist'
      }).expect(400);
  });

  it('Should not find a merchant to modify it', async() => {
    await request(app)
      .patch('/merchants?name=MercaderDePrueba')
      .send({
        location: 'nilfgaard',
        merchantType: 'alchemist'
      }).expect(404);
  });

  it('Should successfully modify an existing merchant by his id', async () => {
    const exampleID = new Merchant({
      id: 13,
      name: 'MercaderDeRivia',
      location: 'redania',
      merchantType: 'alchemist'
    });

    const response = await exampleID.save();
    
    await request(app)
      .patch(`/merchants/${response._id}`)      
      .send({
        location: 'nilfgaard',
        merchantType: 'alchemist'
      }).expect(200);
  });
  

  it('Should send an error for not providing a body', async() => {
    const exampleID = new Merchant({
      id: 13,
      name: 'MercaderDeRivia',
      location: 'redania',
      merchantType: 'alchemist'
    });

    const response = await exampleID.save();

    await request(app)
      .patch(`/merchants/${response._id}`)
      .send({}).expect(400);
  });

  it('Should unsuccessfully modify an existing merchant by id', async() => {
    
    const exampleID = new Merchant({
      id: 13,
      name: 'MercaderDeRivia',
      location: 'redania',
      merchantType: 'alchemist'
    });

    const response = await exampleID.save();
    
    await request(app)
      .patch(`/merchants/${response._id}`)
      .send({
        id: 3,
        name: 'MercaderPrueba',
        location: 'nilfgaard',
        merchantType: 'alchemist'
      }).expect(400);
  });

  it('Should not find a merchant to modify it by id', async() => {
    await request(app)
      .patch('/merchants/123456789012345678901234')
      .send({
        location: 'nilfgaard',
        merchantType: 'alchemist'
      }).expect(404);
  });

  it('Should successfully delete an existing merchant', async() => {
    await request(app)
      .delete(`/merchants?name=MercaderPrueba`)
      .expect(200);
  });

  it('Should unsuccessfully delete an inexisting merchant', async () => {
    await request(app)
      .delete('/merchants?name=Merchant of Rivia')
      .expect(404);
  });

  it('Should not find a merchant to remove it', async() => {
    await request(app)
      .delete('/merchants')
      .expect(400);
  });

  it('Should successfully delete an existing merchant', async() => {
    
    const exampleID = new Merchant({
      id: 13,
      name: 'MercaderDeRivia',
      location: 'redania',
      merchantType: 'alchemist'
    });

    const response = await exampleID.save();

    await request(app)
      .delete(`/merchants/${response._id}`)
      .expect(200);
  });

  it('Should unsuccessfully delete an inexisting merchant', async() => {
    await request(app)
      .delete('/merchants/123456789012345678901234')
      .expect(404);
  });

});