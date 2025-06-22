import { prisma } from "../../config/prisma.js";
import { User } from "../@types/user-types.js";

export class FetchUserService{
  async execute({ id }: Pick<User, 'id'>){
    if (!id) {
      throw new Error("The id has not provided.")
    }

    const userData = await prisma.users.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    })

    if (!userData) {
      throw new Error("Unable to fetch user data.")
    }

    return userData

  }
}