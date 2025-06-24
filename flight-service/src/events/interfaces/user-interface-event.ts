export interface UserEvent {
  type: "USER_LOGGED" | "USER_UPDATED" | "USER_DELETED",
  data: {
    id: string;
    email: string;
    name: string;
    last_name: string;
    role: string;
    timestamp: string;
  }
}