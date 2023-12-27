export {};

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE: string;
      JWT_SECRET: string;
      PORT: string;
    }
  }
}
