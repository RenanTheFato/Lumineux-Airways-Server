import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyTypedInstance } from "./@types/types.js";
import { CreateUserController } from "./controllers/create-user-controller.js";

export async function routes(fastify: FastifyTypedInstance){
  
  fastify.get("/ping", async(req: FastifyRequest, rep: FastifyReply) => {
    return rep.status(200).send({ message: "pong" })
  })

  fastify.post("/create-user", async(req: FastifyRequest, rep: FastifyReply) => {
    return new CreateUserController().handle(req, rep)
  })
  
}