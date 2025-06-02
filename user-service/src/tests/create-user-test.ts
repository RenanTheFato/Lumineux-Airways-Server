import { fastify } from "fastify";
import { routes } from "../routes.js";
import { prisma } from "../../config/prisma.js";
import { describe, it, beforeEach, afterAll, expect } from "vitest";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import dotenv from "dotenv";

dotenv.config({ path: "../../.env.test" })


async function userTests() {
  const app = fastify().withTypeProvider<ZodTypeProvider>()

  await app.register(routes)
  return app
}

describe('Create User', () => {
  const app = userTests()

  beforeEach(async () => {
    await prisma.users.deleteMany()
  })

  afterAll(async () => {
    (await app).close()
    await prisma.$disconnect()
  })

  it('should create a user successfully', async () => {
    const response = (await app).inject({
      method: "POST",
      url: "/create-user",
      payload: {
        "email": "test@example.com",
        "password": "*PasswordTest1",
        "name": "Test",
        "last_name": "Example"
      }
    })

    expect((await response).statusCode).toBe(201)
    const body = JSON.parse((await response).body)
    expect(body).toEqual({ message: "User Created" })
  })

  it("should fail with email is invalid", async () => {
    const response = (await app).inject({
      method: "POST",
      url: "/create-user",
      payload: {
        email: "not-an-email",
        password: "ValidPass123!",
        name: "John",
        lastName: "Doe"
      }
    })

    expect((await response).statusCode).toBe(400)
    const body = JSON.parse((await response).body)

    expect(body.error).toEqual("Bad Request")
  })


  it('should fail when password is weak', async () => {
    const response = (await app).inject({
      method: 'POST',
      url: "/create-user",
      payload: {
        email: 'weak@example.com',
        password: '1234',
        name: 'John',
        last_name: 'Doe'
      }
    })

    expect((await response).statusCode).toBe(400)
    const body = JSON.parse((await response).body)
    expect(body.error).toBe('Bad Request')
  })

  it('should fail when email is already in use', async () => {
    await prisma.users.create({
      data: {
        email: 'exists@example.com',
        password: 'hashedpassword',
        name: 'Jane',
        last_name: 'Doe'
      }
    })

    const response = (await app).inject({
      method: 'POST',
      url: "/create-user",
      payload: {
        email: 'exists@example.com',
        password: 'Password@1',
        name: 'Jane',
        last_name: 'Doe'
      }
    })

    expect((await response).statusCode).toBe(400)
    const body = JSON.parse((await response).body)
    expect(body.error).toBe('The email is already in use')
  })

  it('should fail when name and last name are the same', async () => {
    const response = (await app).inject({
      method: 'POST',
      url: "/create-user",
      payload: {
        email: 'same@example.com',
        password: 'Password@1',
        name: 'John',
        last_name: 'john'
      }
    })

    expect((await response).statusCode).toBe(400)
    const body = JSON.parse((await response).body)
    expect(body.error).toBe('Bad Request')
    expect(body.message).toBe("The name and last name mustn't be the same.")
  })

})