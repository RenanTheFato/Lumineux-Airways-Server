import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyTypedInstance } from "./@types/types.js";
import { authorization } from "./middlewares/auth-middleware.js";
import { VerifyUserController } from "./controllers/verify-user-controller.js";

export async function routes(fastify: FastifyTypedInstance) {
  fastify.get("/ping", async(req: FastifyRequest, rep: FastifyReply) => {
    return rep.status(200).send({ message: "pong" })
  })

  fastify.get("/user", {  preHandler: [authorization] }, async(req: FastifyRequest, rep: FastifyReply) => {
    return new VerifyUserController().handle(req, rep)
  })
}