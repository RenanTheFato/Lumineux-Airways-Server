import { redis } from "../../config/redis.js";
import { User } from "../@types/user-types.js";
import { UserEventData } from "./interfaces/user-interface.js";

export class UserEventPublisher {
  private async publishUserEvent(type: string, data: UserEventData) {
    const event = { type, data }

    try {
      await redis.publish("user.events", JSON.stringify(event))
      console.log(`Event type: ${type} has been published by user: ${data.id}`)
    } catch (error) {
      console.error(`Error when trying publish the event: ${error}`)
    }
  }

  async userLogged(user: Omit<User, 'password'>): Promise<void> {
    await this.publishUserEvent("USER_LOGGED", {
      id: user.id,
      email: user.email,
      name: user.name,
      last_name: user.last_name,
      role: user.role,
      timestamp: new Date().toISOString(),
    })
  }

  async userUpdated(user: Omit<User, 'password'>): Promise<void> {
    await this.publishUserEvent("USER_UPDATED", {
      id: user.id,
      email: user.email,
      name: user.name,
      last_name: user.last_name,
      role: user.role,
      timestamp: new Date().toISOString(),
    })
  }

  async userDeleted(userId: string): Promise<void> {
    await this.publishUserEvent('USER_DELETED', {
      id: userId,
      email: '',
      name: '',
      last_name: '',
      role: '',
      timestamp: new Date().toISOString(),
    })
  }

}