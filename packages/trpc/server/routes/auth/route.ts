import type {} from "@trpc/server";
import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import {
  getAuthenticationMethodOutputSchema,


} from "@repo/services/user/model";
import { publicProcedure, authenticatedProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { env } from "@repo/services/env";
import {
  verifyEmailOutput,
  createUserWithEmailAndPasswordInputModel,
  createUserWithEmailAndPasswordOutputModel,
  verifyEmailInput,
  loginUserWithEmailAndPasswordInputModel,
  loginUserWithEmailAndPasswordOutputModel,
  logoutOutputModel,
  loginWithOAuthInputModel,
  loginWithOAuthOutputModel,
  getUserWithTokenInputModel,
  getUserWithTokenOutputModel


} from "./model";

const TAGS = ["Authentication"];
const getPath = generatePath("/authentication");

export const authRouter = router({
  getSupportedAuthenticationProviders: publicProcedure
    .meta({ openapi: { method: "GET", path: getPath("/supported-providers"), tags: TAGS } })
    .input(zodUndefinedModel)
    .output(z.readonly(z.array(getAuthenticationMethodOutputSchema)))
    .query(async () => {
      const supportedMethods = await userService.getAuthenticationMethods();
      return supportedMethods;
    }),

  createUserEmailAndPassword: publicProcedure.meta({
    openapi: { method: "POST", path: getPath("/createUserWithEmailAndPassword"), tags: TAGS }
  }).input(createUserWithEmailAndPasswordInputModel)
    .output(createUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input }) => {
      const { fullname, email, password } = input

      const { id } = await userService.createUserWithEmailAndPassword({
        fullname, email, password
      })

      return { id }
    }),


  verifyEmail: publicProcedure.meta({
    openapi: { method: "GET", path: getPath("/verify-email"), tags: TAGS }
  })
    .input(verifyEmailInput)
    .output(verifyEmailOutput)
    .query(async ({ input }) => {
      const { token } = input

      const { success, message } = await userService.verifyEmail({ token })

      return { success, message }
    }),

  loginUserEmailAndPassword: publicProcedure.meta({
    openapi: { method: "POST", path: getPath("/loginUserWithEmailAndPassword"), tags: TAGS }
  }).input(loginUserWithEmailAndPasswordInputModel)
    .output(loginUserWithEmailAndPasswordOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input

      const { id, token } = await userService.loginUserWithEmailAndPassword({
        email, password
      })

      ctx.setCookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production" || env.NODE_ENV === "prod",
        sameSite: env.NODE_ENV === "production" || env.NODE_ENV === "prod" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/"
      })

      return { id }
    }),

  loginWithOAuth: publicProcedure.meta({
    openapi: { method: "POST", path: getPath("/loginWithOAuth"), tags: TAGS }
  }).input(loginWithOAuthInputModel)
    .output(loginWithOAuthOutputModel)
    .mutation(async ({ input, ctx }) => {
      const { code, provider } = input

      const { id, token } = await userService.loginOrRegisterWithOAuth({
        code, provider
      })

      ctx.setCookie("token", token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production" || env.NODE_ENV === "prod",
        sameSite: env.NODE_ENV === "production" || env.NODE_ENV === "prod" ? "none" : "lax",
        maxAge: 1000 * 60 * 60 * 24 * 7,
        path: "/"
      })

      return { id }
    }),

  logoutUser: authenticatedProcedure.meta({
    openapi: { method: "POST", path: getPath("/logout"), tags: TAGS }
  }).input(z.object({}).optional())
    .output(logoutOutputModel)
    .mutation(async ({ ctx }) => {
      ctx.clearCookie("token")

      const { success, message } = await userService.logoutUser()

      return { success, message }
    }),

  getUserWithToken: authenticatedProcedure.meta({
    openapi: { method: "GET", path: getPath("/getUserWithToken"), tags: TAGS }
  })
    .input(getUserWithTokenInputModel)
    .output(getUserWithTokenOutputModel)
    .query(async ({ ctx }) => {
      const { id, email, fullname, profileImageUrl, isGmailConnected, isCalendarConnected, isDemoMode } =
        await userService.getMe(ctx.user.id)
      return { id, email, fullname, profileImageUrl, isGmailConnected, isCalendarConnected, isDemoMode }
    }),


});
