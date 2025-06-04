import { app } from "./config/server-config-tests.js";
import { routes } from "../routes.js";
import { prisma } from "../../config/prisma.js";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

describe("User Authentication", async () => {

  beforeAll(async () => {
    await app.register(routes)
  })

  afterAll(async () => {
    await app.close()
    await prisma.users.deleteMany()
    await prisma.$disconnect()
  })

  it("should create a test user for try to authenticate", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/create-user",
      payload: {
        "email": "test.auth@example.com",
        "password": "*Auth123",
        "name": "Auth",
        "last_name": "Test"
      }
    })

    expect(response.statusCode).toBe(201)
    const body = JSON.parse(response.body)
    expect(body).toEqual({ message: "User Created" })
  })

  it("should authenticate a user with correct credentials", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth-user",
      payload: {
        "email": "test.auth@example.com",
        "password": "*Auth123"
      }
    })

    expect(response.statusCode).toBe(200)
    const body = JSON.parse(response.body)
    expect(body).toHaveProperty("token")
  })

  it("should fail the authenticate with incorrect email", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth-user",
      payload: {
        "email": "test.@example.com",
        "password": "*Auth123"
      }
    })

    expect(response.statusCode).toBe(400)
    const body = JSON.parse(response.body)
    expect(body.error[0].message).toEqual("The value entered isn't an e-mail or the e-mail is invalid.")
  })

  it("should fail the authenticate with incorrect password", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth-user",
      payload: {
        "email": "test.auth@example.com",
        "password": "*123Auth"
      }
    })

    expect(response.statusCode).toBe(401)
    const body = JSON.parse(response.body)
    expect(body.error).toEqual("Invalid email or password.")
  })

  it("should fail with invalid email format", async () => {
    const response = await app.inject({
      method: "POST",
      url: "/auth-user",
      payload: {
        "email": "invalid-format",
        "password": "*123Auth"
      }
    })
    expect(response.statusCode).toBe(400)
    const body = JSON.parse(response.body)
    expect(body.error[0].message).toEqual("The value entered isn't an e-mail or the e-mail is invalid.")

  })

})