import { describe, it, beforeAll, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { Good } from "../src/models/goodModel.js";

const firstGood = {
  id: 9,
  name: "A wonderful good",
  description: "This is a good",
  material: "makaham steel",
  weight: 12.54,
  value: 100,
  stock: 10,
};

const secondGood = {
  id: 10,
  name: "Golden sword",
  description: "This is a golden sword that is very powerful",
  material: "gold",
  weight: 20.5,
  value: 1060,
  stock: 2,
};

const thirdGood = {
  id: 11,
  name: "Silver ring",
  description: "This is a silver ring that costs a lot of money",
  material: "silver",
  weight: 20.5,
  value: 2500,
  stock: 1,
};

const fourthGood = {
  id: 12,
  name: "Wooden plank",
  description: "This is a wooden plank that is very useful",
  material: "wood",
  weight: 0.5,
  value: 5,
  stock: 100,
};

let goods = [firstGood, secondGood, thirdGood, fourthGood];

beforeAll(async () => {
  await Good.deleteMany();
  await Good.insertMany(goods);
});

describe("Good API", () => {
  it("Should successfully create a new good", async () => {
    const response = await request(app)
      .post("/goods")
      .send({
        id: 3,
        name: "Awful good",
        description: "This is a an awful good",
        material: "resin",
        weight: 0.3,
        value: 1,
        stock: 2,
      })
      .expect(201);

    expect(response.body).to.include({
      id: 3,
      name: "Awful good",
      description: "This is a an awful good",
      material: "resin",
      weight: 0.3,
      value: 1,
      stock: 2,
    });
  });

  it("Should send an error while create a new good", async () => {
    // Test with missing fields
    await request(app)
      .post("/goods")
      .send({
        description: "This is a good",
        material: "makaham steel",
        weight: 12.54,
        value: 100,
      })
      .expect(400);
    // Test with invalid fields
    // no stock
    await request(app)
      .post("/goods")
      .send({
        id: 99,
        name: "Undefined good",
        description: "There is no stock from this good",
        material: "gold",
        weight: 12.54,
        value: 1,
        stock: 0,
      })
      .expect(400);
    // negative weight
    await request(app)
      .post("/goods")
      .send({
        id: 99,
        name: "Undefined good",
        description: "There is no stock from this good",
        material: "gold",
        weight: -12,
        value: 1,
        stock: 1,
      })
      .expect(400);
    // negative value
    await request(app)
      .post("/goods")
      .send({
        id: 99,
        name: "Undefined good",
        description: "There is no stock from this good",
        material: "gold",
        weight: 12.54,
        value: -12.6,
        stock: 1,
      })
      .expect(400);
    // no description
    await request(app)
      .post("/goods")
      .send({
        id: 99,
        name: "Undefined good",
        description: "",
        material: "gold",
        weight: 12.54,
        value: 1,
        stock: 1,
      })
      .expect(400);
    // lower case name
    await request(app)
      .post("/goods")
      .send({
        id: 99,
        name: "undefined good",
        description: "There is no stock from this good",
        material: "gold",
        weight: 12.54,
        value: 1,
        stock: 1,
      })
      .expect(400);
  });

  it("Update the stock of an existing good while creating it", async () => {
    const response = await request(app)
      .post("/goods")
      .send({
        id: 9,
        name: "A wonderful good",
        description: "This is a good",
        material: "makaham steel",
        weight: 12.54,
        value: 100,
        stock: 10,
      })
      .expect(200);
    expect(response.body).to.include({
      id: 9,
      name: "A wonderful good",
      description: "This is a good",
      material: "makaham steel",
      weight: 12.54,
      value: 100,
      stock: 20,
    });
    const response2 = await request(app)
      .post("/goods")
      .send({
        id: 9,
        name: "A wonderful good",
        description: "This is a good",
        material: "makaham steel",
        weight: 12.54,
        value: 100,
        stock: 10,
      })
      .expect(200);
    expect(response2.body).to.include({
      id: 9,
      name: "A wonderful good",
      description: "This is a good",
      material: "makaham steel",
      weight: 12.54,
      value: 100,
      stock: 30,
    });
  });

  it("Should find an existing good", async () => {
    await request(app).get("/goods?name=A wonderful good").expect(200);
    await request(app)
      .get("/goods?description=This is a wooden plank that is very useful")
      .expect(200);
    await request(app).get("/goods?material=wood").expect(200);
    await request(app).get("/goods?weight=0.5").expect(200);
    await request(app).get("/goods?value=5").expect(200);
    await request(app).get("/goods?stock=100").expect(200);
    await request(app)
      .get("/goods?name=A wonderful good&description=This is a good")
      .expect(200);
    await request(app)
      .get("/goods?name=A wonderful good&material=makaham steel")
      .expect(200);
    await request(app)
      .get("/goods?name=A wonderful good&weight=12.54")
      .expect(200);
    await request(app)
      .get(
        "/goods?name=Golden sword&description=This is a golden sword that is very powerful&material=gold&weight=20.5&value=1060&stock=2",
      )
      .expect(200);
  });

  it("Should not find an non-existing good", async () => {
    await request(app).get("/goods?name=Garalt").expect(404);
    await request(app)
      .get(
        "/goods?description=This is a golden sword that is not very powerful",
      )
      .expect(404);
  });

  it("Should send an error while find an existing good", async () => {
    await request(app).get("/goods?name= ").expect(404);
  });

  it("Should find an existing good by id", async () => {
    const example = await request(app).post("/goods").send({
      id: 13,
      name: "A wonderful good",
      description: "This is a good",
      material: "makaham steel",
      weight: 12.54,
      value: 100,
      stock: 10,
    });

    await request(app).get(`/goods/${example.body._id}`).expect(200);
  });

  it("Should not find an existing good by id", async () => {
    await request(app).get("/goods/123456789012345678901234").expect(404);
  });

  it("Should successfully modify an existing good", async () => {
    await request(app)
      .patch("/goods?name=A wonderful good")
      .send({
        id: 31,
        name: "A wonderful good",
        description: "This is a good",
        material: "makaham steel",
        weight: 12.54,
        value: 100,
        stock: 10,
      })
      .expect(200);
    const response = await request(app)
      .patch("/goods?name=A wonderful good")
      .send({
        id: 31,
        name: "Changed good",
        description: "This is a changed good",
        material: "makaham steel",
        weight: 12.54,
        value: 100,
        stock: 10,
      });
    expect(response.body[0]).to.include({
      id: 31,
      name: "Changed good",
      description: "This is a changed good",
      material: "makaham steel",
      weight: 12.54,
      value: 100,
      stock: 10,
    });
  });

  it("Should unsuccessfully modify an existing good", async () => {
    await request(app)
      .post("/goods?name=A wonderful good")
      .send({
        id: 3,
        name: "lower case name",
        description: "This is a good",
        material: "makaham steel",
        weight: 12.54,
        value: 100,
        stock: 10,
      })
      .expect(400);
  });

  it("Should successfully modify an existing good by id", async () => {
    const example = await request(app).post("/goods").send({
      id: 66,
      name: "A magnificent good",
      description: "This is a magnificent good",
      material: "makaham steel",
      weight: 12.54,
      value: 100,
      stock: 10,
    });

    await request(app)
      .patch(`/goods/${example.body._id}`)
      .send({
        name: "Changed good by id",
        description: "This is a changed good by id",
        material: "gold",
      })
      .expect(200);
    const response = await request(app)
      .get(`/goods/${example.body._id}`)
      .expect(200);
    expect(response.body).to.include({
      id: 66,
      name: "Changed good by id",
      description: "This is a changed good by id",
      material: "gold",
      weight: 12.54,
      value: 100,
      stock: 10,
    });
  });

  it("Should successfully delete an existing good", async () => {
    await request(app).delete("/goods?name=Silver ring").expect(200);
    await request(app)
      .delete(
        "/goods?id=12&name=Wooden plank&description=This is a wooden plank that is very useful&material=wood&weight=0.5&value=5&stock=100",
      )
      .expect(200);
    await request(app)
      .delete("/goods?weight=20.5&value=1060&stock=2")
      .expect(200);
  });

  it('Should unsuccessfully delete an existing good', async () => {
    await request(app)
      .delete('/goods?name=Garalt')
      .expect(404);

    await request(app)
      .delete(
        '/goods?id=12&name=Wooden plank&description=This is a wooden plank that is very useful&material=wood&weight=0.5&value=5&stock=100',
      )
      .expect(404);
  });

  it("Should successfully delete an existing good by id", async () => {
    const example = await request(app).post("/goods").send({
      id: 13,
      name: "A wonderful good",
      description: "This is a good",
      material: "makaham steel",
      weight: 12.54,
      value: 100,
      stock: 10,
    });

    await request(app)
      .delete(`/goods/${example.body._id}`)
      .expect(200);
    await request(app)
      .get(`/goods/${example.body._id}`)
      .expect(404);
  });

  it("Should unsuccessfully delete an existing good by id", async () => {
    await request(app)
      .delete("/goods/123456789012345678901234")
      .expect(404);
  });

  it('Not implemented', async () => {
    await request(app)
      .delete('/god')
      .expect(501);
    await request(app)
      .patch('/goos')
      .expect(501);
    await request(app)
      .get('/god')
      .expect(501);
    await request(app)
      .post('/god')
      .expect(501);
    await request(app)
      .post('/god')
      .expect(501);
      await request(app)
      .put('/goods')
      .expect(501);
  });
});
