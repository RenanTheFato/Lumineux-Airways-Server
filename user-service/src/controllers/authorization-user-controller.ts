import { FastifyReply, FastifyRequest } from "fastify";
import { AuthorizationUserService } from "../services/authorization-user-service.js";
import { z } from "zod";

export class AuthorizationUserController {
  async handle(req: FastifyRequest, rep: FastifyReply) {

    const validateAuthSchema = z.object({
      email: z.string({ message: "The value entered isn't a string type." })
        .email({ message: "The value entered isn't an e-mail or the e-mail is invalid." }),
      password: z.string({ message: "The value entered isn't a string type." })
    })

    const { email, password } = req.body as z.infer<typeof validateAuthSchema>

    try {
      validateAuthSchema.parse(req.body)
    } catch (error) {
      if (error instanceof z.ZodError) {
        return rep.status(400).send({ error: error.errors })
      }
    }

    try {
      const authorizationUserService = new AuthorizationUserService()

      const token = await authorizationUserService.execute({ email, password })
      return rep.status(200).send({ token })
    } catch (error: any) {
      return rep.status(401).send({ error: error.message })
    }

  }
}