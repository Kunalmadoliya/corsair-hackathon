import { z, zodUndefinedModel } from "../../schema";
import { userService } from "../../services";
import {
  getAuthenticationMethodOutputSchema,


} from "@repo/services/user/model";
import { publicProcedure, router } from "../../trpc";
import { generatePath } from "../../utils/path-generator";
import { env } from "@repo/services/env";
import { verifyEmailOutput, createUserWithEmailAndPasswordInputModel, createUserWithEmailAndPasswordOutputModel, verifyEmailInput } from "./model";

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
    .mutation(async ({ input, ctx }) => {
      const { fullname, email, password } = input

      const { id, generateVerificationToken } = await userService.createUserWithEmailAndPassword({
        fullname, email, password
      })

      ctx.setCookie("token", generateVerificationToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "dev" ? false : true,
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
      })

      return { id }
    }),


  verifyEmail: publicProcedure.meta({
    openapi: { method: "GET", path: getPath("/verify-email"), tags: TAGS }
  })
    .input(verifyEmailInput)
    .output(verifyEmailOutput)
    .query(async ({ input, ctx }) => {
      const { token } = input

      const { success, message } = await userService.verifyEmail({ token })

      return { success, message }
    })
});
