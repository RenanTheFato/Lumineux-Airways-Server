import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/prisma.js";

interface PayLoad {
  id: string,
}

export async function authorization(req: FastifyRequest, rep: FastifyReply) {

  const { authorization } = req.headers

  if (!authorization) {
    return rep.status(401).send({ error: "Bearer Token is missing." })
  }

  const token = authorization.split("")[1]

  try {
    const { id } = jwt.verify(token, String(process.env.JWT_SECRET)) as PayLoad

    const user = await prisma.users.findUnique({
      where: {
        id,
      },
      omit: {
        password: true
      }
    })

    if (!user) {
      return rep.status(401).send({ message: "Unauthorized" })
    }

    req.user = user

    return
    
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return rep.status(401).send({ message: 'Invalid token' })
    }
    if (error.name === 'TokenExpiredError') {
      return rep.status(401).send({ message: 'Token expired' })
    }
    return rep.status(500).send({ message: 'Authentication error' })
  }
}