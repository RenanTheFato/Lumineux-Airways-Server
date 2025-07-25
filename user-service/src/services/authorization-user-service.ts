import { compare } from "bcryptjs";
import { prisma } from "../../config/prisma.js";
import { User } from "../@types/user-types.js";
import jwt from "jsonwebtoken";
import { UserEventPublisher } from "../events/event-publisher.js";

export class AuthorizationUserService {
  async execute({ email, password }: Pick<User, 'email' | 'password'>) {

    const isUserExists = await prisma.users.findFirst({
      where: {
        email,
      }
    })

    if (!isUserExists) {
      throw new Error("Invalid email or password.")
    }

    const isPasswordCorrect = await compare(password, isUserExists.password)

    if (!isPasswordCorrect) {
      throw new Error("Invalid email or password.")
    }

    const token = jwt.sign({ id: isUserExists.id }, String(process.env.JWT_SECRET), { expiresIn: '2h' })

    const { password: _, ...user } = isUserExists

    const userEventPublisher = new UserEventPublisher()
    
    userEventPublisher.userLogged(user).catch((error) => {
      console.error(`Error when trying publish login event: `, error)
    })

    return token
  }
}