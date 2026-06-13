import { z } from "zod"

//TODO: DO THIS FOR ALL 
export const createUserWithEmailAndPasswordInputModel = z.object({
    fullname: z.string().describe("Name of the user"),
    email: z.email().describe("Email of the user"),
    password: z.string().describe("Password of the user")
})

export const createUserWithEmailAndPasswordOutputModel = z.object({
    id : z.string().describe("Id of the user")
})