import { describe, it, beforeAll, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";
import { Transaction } from "../../src/models/transactionModel.js";
import { Merchant } from "../../src/models/merchantModel.js";
import { Client } from "../../src/models/clientModel.js";
import { Good } from "../../src/models/goodModel.js";


const firstBuy = {
  id: 243,
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
          stock: 3, // Stock inicial del bien que el mercader vende
          description: "yea"
      }
  ]
}

const firstMerchant = {
  id: 1,
  name: "Pepe",
  location: "Novigrad",
  merchantType: "blacksmit"
}
  

// const firstSale = {
//   id: 2312343,
//   clientName: "Manolo",
//   items: [
//       {
//           id: 2429,
//           name: "Swallow Potion",
//           quantity: 2,
//           value: 25,
//           material: "magic essence",
//           weight: 7,
//           stock: 5,
//           description: "yea2"
//       },
//       {
//           id: 900,
//           name: "Griffin Witcher Gear - Steel Sword",
//           quantity: 1,
//           value: 500,
//           material: "makaham steel",
//           weight: 5,
//           stock: 3,
//           description: "yea"
//       }
//   ]
// }


beforeEach(async () => {
  await Transaction.deleteMany();
  await Merchant.deleteMany();
  //await new Transaction(firstSale).save();
  //await new Merchant(firstMerchant).save();
});

describe("Transactions API", () => {

  it("Should successfully create a new transaction", async () => {
    await request(app)
      .post("/merchants")
      .send(firstMerchant)
      .expect(201);
    const response = await request(app)
      .post("/transactions/buy")
      .send(firstBuy)
      .expect(201);
      console.log(response.body);
  });

  // it("Should send an error while create a new transaction", async () => {
  //   await request(app)
  //     .post("/transactions/sell")
  //     .send({
  //       goodId: 20,
  //       quantity: 5,
  //       totalValue: 5000,
  //       date: new Date("2023-10-02T10:00:00Z"),
  //       type: "sell",
  //     })
  //     .expect(500);
  // });

  // it("Should find an existing transaction", async () => {
  //   await request(app).get("/transactions?id=1").expect(202);
  // });

  // it("Should not find an existing transaction", async () => {
  //   await request(app).get("/transactions?id=100").expect(404);
  // });
});

// describe("Transaction API", () => {
//   it("Should successfully create a new transaction", async () => {
//     expect(true).toBe(true);
//   });
// });