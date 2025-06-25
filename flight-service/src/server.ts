import { fastify } from "fastify";
import { routes } from "./routes.js";
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import cors from "@fastify/cors";
import dotenv from "dotenv";
import { UserEvents } from "./events/user-events.js";

dotenv.config()

const server = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()

async function start() {

  const HOST = process.env.HTTP_HOST
  const PORT = process.env.HTTP_PORT
  const userEvents = new UserEvents()

  server.setSerializerCompiler(serializerCompiler)
  server.setValidatorCompiler(validatorCompiler)

  await server.register(cors)
  await userEvents.listenEvents()
  await server.register(routes)

  await server.listen({
    host: HOST || '0.0.0.0',
    port: Number(PORT) || 3334,
  }).then(() => {
    console.log(`HTTP server running on port: ${PORT}`)
  }).catch((error) => {
    console.error(`Error on trying running the HTTP server: ${error}`)
    process.exit(1)
  })
}

start()