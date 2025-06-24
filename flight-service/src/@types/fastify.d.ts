import "fastify";

declare module "fastify" {
  export interface FastifyRequest {
    user: Partial<{
    id: string;
    email: string;
    name: string;
    last_name: string;
    role: string;
    timestamp: string;
    }>
  }
}