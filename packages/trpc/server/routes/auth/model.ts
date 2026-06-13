import { z } from "zod"

//TODO: DO THIS FOR ALL 
export const createUserWithEmailAndPasswordInputModel = z.object({
    fullname: z.string().describe("Name of the user"),
    email: z.email().describe("Email of the user"),
    password: z.string().describe("Password of the user")
})

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("Id of the user"),
})

export const verifyEmailInput = z.object({
    token: z.string().describe("Token of the user")
})

export const verifyEmailOutput = z.object({
    success: z.boolean().describe("Success status"),
    message: z.string().describe("Message")
})

export const loginUserWithEmailAndPasswordInputModel = z.object({
    email: z.email().describe("Email of the user"),
    password: z.string().describe("Password of the user")
})

export const loginUserWithEmailAndPasswordOutputModel = z.object({
    id: z.string().describe("Id of the user"),
})

export const logoutOutputModel = z.object({
    success: z.boolean().describe("Success status"),
    message: z.string().describe("Message")
})
