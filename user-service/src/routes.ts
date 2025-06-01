import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyTypedInstance } from "./@types/types.js";

export async function routes(fastify: FastifyTypedInstance){
  
  fastify.get("/ping", async(req: FastifyRequest, rep: FastifyReply) => {
    return rep.status(200).send({ message: "pong" })
  })
  
}