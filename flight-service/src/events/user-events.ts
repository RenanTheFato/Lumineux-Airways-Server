import { UserEvent } from "./interfaces/user-interface-event.js";
import { redis } from "../config/redis.js";
import { UserCachedEvents } from "./cache-user-events.js";

export class UserEvents {
  async listenEvents() {
    await redis.subscribe("user.events")

    redis.on("message", async (channel, message) => {
      try {
        if (channel === "user.events") {
          await this.handleUserEvent(JSON.parse(message))
        }
      } catch (error) {
        console.error(`Error when trying to process the event: ${error}`)
      }
    })
  }

  private async handleUserEvent(event: UserEvent) {

    const userCachedEvents = new UserCachedEvents()

    switch (event.type) {
      case "USER_LOGGED":
        await userCachedEvents.CacheUserEvent(event.data)
        console.log(`User cached successfully: ${event.data.name}`)
        break

      case "USER_UPDATED":
        await userCachedEvents.CacheUserEvent(event.data)
        console.log(`User updated successfully: ${event.data.name}`)
        break

      case "USER_DELETED":
        await userCachedEvents.RejectUserEvent(event.data.id)
        console.log(`User rejected successfully: ${event.data.name}`)
        break
      
      default:
        console.log(`Invalid event type: ${event.type}`)
    }
  }

}