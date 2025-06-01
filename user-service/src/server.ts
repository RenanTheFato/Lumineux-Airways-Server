import { fastify } from "fastify";
import cors from "@fastify/cors"
import dotenv from "dotenv"
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, ZodTypeProvider } from "fastify-type-provider-zod";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";

dotenv.config()

const server = fastify({ logger: true }).withTypeProvider<ZodTypeProvider>()

async function start() {
  const HOST = process.env.HTTP_HOST
  const PORT = process.env.HTTP_PORT

  await server.register(cors)

  server.setValidatorCompiler(validatorCompiler)
  server.setSerializerCompiler(serializerCompiler)

  await server.register(fastifySwagger, {
    openapi: {
      openapi: "3.1.1",
      info: {
        title: "Lumineux Airways User Micro-Service",
        version: "1.0"
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT"
          },
        },
      },
    },
    transform: jsonSchemaTransform
  })

  await server.register(fastifySwaggerUi, {
    routePrefix: "/docs/user-service",
    theme: {
      title: "Lumineux Airways - User Micro-Service"
    }
  })

  await server.listen({
    host: HOST || '0.0.0.0',
    port: Number(PORT) || 3333
  }).then(() => {
    console.log(`HTTP server running on port: ${PORT}`)
  }).catch((error) => {
    console.log(`Error on trying running the HTTP server: ${error}`)
    process.exit(1)
  })
}

start()