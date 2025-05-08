import { describe, it, beforeAll, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { Transaction } from "../../src/models/transactionModel.js";
import { Merchant } from "../../src/models/merchantModel.js";
import { Client } from "../../src/models/clientModel.js";
import { Good } from "../../src/models/goodModel.js";

const firstMerchant = {
  id: 1,
  name: "Pepe",
  location: "Novigrad",
  merchantType: "blacksmit"
}
const secondMerchant = {
  id: 2,
  name: "Juan",
  location: "Novigrad",
  merchantType: "alchemist"
}
const firstClient = {
  id: 1,
  name: "Manolo",
  race: "human",
  location: "velen"
}

const firstGood = {
  id: 1,
  name: "Griffin Witcher Gear - Steel Sword",
  quantity: 1,
  value: 500,
  material: "makaham steel",
  weight: 5,
  stock: 3, 
  description: "yea"
}
const secondGood = {
  id: 2,
  name: "Swallow Potion",
  description: "A good potion",
  material: "magic essence",
  weight: 7,
  stock: 3,
  value: 25,
}

const firstBuy = {
  id: 213,
  type: "buy",
  merchantName: "Pepe",
  items: [
      {
          id: 2429,
          name: "Swallow Potion",
          quantity: 2,
          value: 25,
          material: "magic essence",
          weight: 7,
          stock: 5,
          description: "yea2"
      },
      {
          id: 900,
          name: "Griffin Witcher Gear - Steel Sword",
          quantity: 1,
          value: 500,
          material: "makaham steel",
          weight: 5,
          stock: 3, 
          description: "yea"
      }
  ]
}
const firstSell = {
  id: 223,
  type: "sell",
  clientName: "Manolo",
  items: [
      {
          id: 2429,
          name: "Swallow Potion",
          quantity: 2,
          value: 25,
          material: "magic essence",
          weight: 7,
          stock: 5,
          description: "yea2"
      },
      {
          id: 900,
          name: "Griffin Witcher Gear - Steel Sword",
          quantity: 1,
          value: 500,
          material: "makaham steel",
          weight: 5,
          stock: 3, 
          description: "yea"
      }
  ]
}


beforeEach(async () => {
  await Transaction.deleteMany();
  await new Merchant(firstMerchant).save();
  await new Client(firstClient).save();
});

describe("Transactions API", () => {

  it("Should successfully create a new transaction", async () => {
    await request(app)
    .get("/merchants?name=Pepe")
    .expect(200);
    const response = await request(app)
      .post("/transactions/buy")
      .send(firstBuy)
      .expect(201);
  });

  it('Should successfully create a new transaction with a good previous created', async () => {
    await Good.deleteMany();
    await new Good(secondGood).save();
    const response = await request(app)
      .post("/transactions/buy")
      .send({
        id: 123,
        type: "buy",
        merchantName: "Pepe",
        items: [
          {
            id: 2,
            name: "Swallow Potion",
            quantity: 1,
            value: 25,
            material: "magic essence",
            weight: 7,
            stock: 3, 
            description: "yea"
          }
        ]
      })
      .expect(201);
    
    const updatedGood = await Good.findOne( { name: "Swallow Potion" } );
    expect(updatedGood).toBeDefined();
    expect(updatedGood?.stock).toBe(4);
  });

  it("Should send an error for no found the merchant of the transaction", async () => {
    await request(app)
    .post("/transactions/buy")
    .send({
      id: 123,
      type: "buy",
      merchantName: "Juan",
      items: [
        {
          id: 900,
          name: "Griffin Witcher Gear - Steel Sword",
          quantity: 1,
          value: 500,
          material: "makaham steel",
          weight: 5,
          stock: 3, 
          description: "yea"
        }
      ]
    })
    .expect(404);
  });

  it("Should send an error for no found the merchant of the transaction", async () => {
    await request(app)
    .post("/transactions/buy")
    .send({
      id: 123,
      type: "buy",
      merchantName: "Juan",
      items: []
    })
    .expect(404);
  });

  it ("Should delete a transaction", async () => {
    const transaction = await new Transaction(firstBuy).save();
    const response = await request(app)
      .delete(`/transactions/${transaction._id}`)
      .expect(200);
  })
  it("Should send an error for no found the transaction", async () => {
    await request(app)
      .delete("/transactions/1234567890")
      .expect(500);
  });
  it("Should get the transaction by name", async () => {
    const transaction = await new Transaction(firstBuy).save();
    const response = await request(app)
      .get(`/transactions?name=Pepe`)
      .expect(200);
  })
  it("Should get the transaction by id of the merchant", async () => {
    const transaction = await new Transaction(firstBuy).save();
    const idOfMerchant = transaction.merchantId;
    const response = await request(app)
      .get(`/transactions?merchantId=${idOfMerchant}`)
      .expect(200);
  });
  it ("Should get the transaction by id of the client", async () => {
    const transaction = await new Transaction(firstSell).save();
    const idOfClient = transaction.clientId;
    const response = await request(app)
      .get(`/transactions?clientId=${idOfClient}`)
      .expect(200);
  })
  it ("Should get the transaction by date", async () => {
    const transaction = await new Transaction(firstSell).save();
    const response = await request(app)
      .get(`/transactions?startDate=2025-05-08T00:00:00.000Z&endDate=2025-05-08T23:59:59.999Z`)
      .expect(200);
  })

  it ("Should modify a transaction", async () => {
    await new Merchant(secondMerchant).save();
    const transaction = await new Transaction(firstBuy).save();
    const merchant = await Merchant.findOne({ name: "Juan" });
    const idOfMerchant = merchant?._id;
    const responde = await request(app)
      .patch(`/transactions/${transaction._id}`)
      .send({
        
        merchant: idOfMerchant,
      })
      .expect(200);
  })
});