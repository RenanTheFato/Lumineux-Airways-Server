import { FastifyReply, FastifyRequest } from "fastify";
import { FetchUserService } from "../services/fetch-user-service.js";
import { User } from "../@types/user-types.js";

export class FetchUserController{
  async handle(req: FastifyRequest, rep: FastifyReply){

    const id = req.user.id as string

    try {
      const fetchUserService = new FetchUserService()
      const userData = await fetchUserService.execute({ id })
      
      return rep.status(200).send({ userData })
    } catch (error: any) {
      return rep.status(400).send({ error: error.message })
    }

  }
}