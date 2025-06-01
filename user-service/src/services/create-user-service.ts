import { prisma } from "../../config/prisma.js";
import { User } from "../@types/user-types.js";

export class CreateUserService {
  async execute({ email, password, name, last_name }: Pick<User, 'email' | 'password' | 'name' | 'last_name'>) {

    const isEmailAlreadyExists = await prisma.users.count({
      where: {
        email,
      },
    })

    if (isEmailAlreadyExists > 0) {
      throw new Error("The email is already in use")
    }

    await prisma.users.create({
      data: {
        email,
        password,
        name,
        last_name,
      }
    })

  }
}