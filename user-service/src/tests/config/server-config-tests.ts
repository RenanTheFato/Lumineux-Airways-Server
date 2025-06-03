import { ZodTypeProvider } from "fastify-type-provider-zod";
import { fastify } from "fastify";

import dotenv from "dotenv";
dotenv.config({ path: "../../.env.test" })

export const app = fastify().withTypeProvider<ZodTypeProvider>()
