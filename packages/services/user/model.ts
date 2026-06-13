import { z } from "zod";

export const getAuthenticationMethodOutputSchema = z.object({
  provider: z.enum(["GOOGLE_OAUTH"]),
  displayName: z.string().optional(),
  displayText: z.string().optional(),
  authUrl: z.string(),
});
export type GetAuthenticationMethodOutputSchemaType = z.infer<
  typeof getAuthenticationMethodOutputSchema
>;

export const createUserWithEmailAndPasswordInputModel = z.object({
  fullname: z.string().describe("Name of the user"),
  email: z.email().describe("Email of the user"),
  password: z.string().describe("Password of the user")
})

export type CreateUserWithEmailAndPasswordInputModelType = z.infer<
  typeof createUserWithEmailAndPasswordInputModel
>

export const createUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("Id of the user")
})

export type CreateUserWithEmailAndPasswordOutputModelType = z.infer<
  typeof createUserWithEmailAndPasswordOutputModel
>


export const loginUserWithEmailAndPasswordInputModel = z.object({
  email: z.email().describe("Email of the user"),
  password: z.string().describe("Password of the user")
})

export type LoginUserWithEmailAndPasswordInputModelType = z.infer<
  typeof loginUserWithEmailAndPasswordInputModel
>

export const loginUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("Id of the user")
})

export type LoginUserWithEmailAndPasswordOutputModelType = z.infer<
  typeof loginUserWithEmailAndPasswordOutputModel
>