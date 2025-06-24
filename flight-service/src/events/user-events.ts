import { UserEvent } from "./interfaces/user-interface-event.js";
import { redis } from "../config/redis.js";

export class UserEvents {
  async listenEvents(){
    await redis.subscribe("user.events")

    redis.on("message", async(channel, message) =>{
      try {
        if (channel === "user.events") {
          await this.handleUserEvent(JSON.parse(message))
        }
      } catch (error) {
        console.error(`Error when trying to process the event: ${error}`)
      }
    })
  }

  private async handleUserEvent(event: UserEvent){
    switch (event.type){
      case "USER_LOGGED":
    }
  }

}