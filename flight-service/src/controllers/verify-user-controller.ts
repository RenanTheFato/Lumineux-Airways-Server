import { FastifyReply, FastifyRequest } from "fastify";

export class VerifyUserController{
  async handle(req: FastifyRequest, rep: FastifyReply){

    const user = req.user

    return rep.status(200).send({ message: "User Recived", user })

  }
}