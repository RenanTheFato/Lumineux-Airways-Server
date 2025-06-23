import "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    user: Partial<{
      id: string,
      email: string,
      password: string,
      name: string,
      last_name: string,
      role: string,
      created_at: Date,
      updated_at: Date,
    }>
  }
}