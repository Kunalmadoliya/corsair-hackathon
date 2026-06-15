import type { CookieOptions } from "express"
import { getCookies as getCookieUtils, setCookie as setCookieUtils, clearCookie as clearCookieUtils } from "./utils/cookie"

import { CreateExpressContextOptions } from "@trpc/server/adapters/express"

export interface TRPCContextUser {
    id: string
}

export interface TRPCContext {
    setCookie: (name: string, value: string, opts: CookieOptions) => void
    getCookie: (name: string) => string | undefined
    clearCookie: (name: string) => void

    user?: TRPCContextUser
}


export async function createContext({ req, res }: CreateExpressContextOptions) {
     console.log("req.cookies =", req.cookies);
  console.log("req.headers.cookie =", req.headers.cookie);
    const ctx: TRPCContext = {
        setCookie(name: string, value: string, opts: CookieOptions) {
            
            return setCookieUtils(res, name, value, opts)

        },
        getCookie(name: string) {
            return getCookieUtils(req, name)
        },
        clearCookie(name: string) {
            return clearCookieUtils(res, name)
        },
        user: undefined
    }

    return ctx
}
export type Context = Awaited<ReturnType<typeof createContext>>;

