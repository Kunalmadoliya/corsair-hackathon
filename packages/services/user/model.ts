import { z } from "zod";

export const getAuthenticationMethodOutputSchema = z.object({
  provider: z.enum(["GOOGLE_OAUTH", "GITHUB_OAUTH"]),
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

export const generateUserTokenPayload = z.object({
    id: z.string().describe("ID of the user"),
});

export type GenerateUserTokenPayloadType = z.infer<typeof generateUserTokenPayload>;


export const loginUserWithEmailAndPasswordInputModel = z.object({
  email: z.email().describe("Email of the user"),
  password: z.string().describe("Password of the user")
})

export type LoginUserWithEmailAndPasswordInputModelType = z.infer<
  typeof loginUserWithEmailAndPasswordInputModel
>

export const getUserWithTokenInputModel = z.object({
  token: z.string().describe("Token of the user")
})

export type GetUserWithTokenInputModelType = z.infer<
  typeof getUserWithTokenInputModel
>

export const loginUserWithEmailAndPasswordOutputModel = z.object({
  id: z.string().describe("Id of the user")
})

export type LoginUserWithEmailAndPasswordOutputModelType = z.infer<
  typeof loginUserWithEmailAndPasswordOutputModel
>

export const verifyEmailInput = z.object({
  token: z.string().describe("Token of the user")
})

export type VerifyEmailInputType = z.infer<
  typeof verifyEmailInput
>

export const logoutOutputModel = z.object({
  success: z.boolean().describe("Success status"),
  message: z.string().describe("Message")
})

export type LogoutOutputModelType = z.infer<
  typeof logoutOutputModel
>