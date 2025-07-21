export enum Env {
  local = 'local',
  dev = 'development',
  stg = 'staging',
  prd = 'production',
}

export const ENV: Env = (process.env.NEXT_PUBLIC_MODE as Env) || Env.dev;

export const isLocal = ENV === Env.local;
export const isDev = ENV === Env.dev;
export const isStg = ENV === Env.stg;
export const isPrd = ENV === Env.prd;
