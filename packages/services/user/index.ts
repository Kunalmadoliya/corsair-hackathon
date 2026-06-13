import { db, eq } from "@repo/database";
import { usersTable, emailVerificationsTable } from "@repo/database/schema";
import { env } from "../env";
import { googleOAuth2Client } from "../clients/google-oauth";
import {
  CreateUserWithEmailAndPasswordInputModelType,
  GetAuthenticationMethodOutputSchemaType,
  createUserWithEmailAndPasswordInputModel,
  loginUserWithEmailAndPasswordInputModel,
  LoginUserWithEmailAndPasswordInputModelType
} from "./model";

import { sendVerificationEmail } from "../email/index"

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

class UserService {
  public async getAuthenticationMethods(): Promise<
    ReadonlyArray<GetAuthenticationMethodOutputSchemaType>
  > {
    const supportedAuthenticationProviders: GetAuthenticationMethodOutputSchema[] = [];

    const isGoogleConfigured = !!(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET);

    if (isGoogleConfigured) {
      const url = googleOAuth2Client.generateAuthUrl();
      supportedAuthenticationProviders.push({
        provider: "GOOGLE_OAUTH",
        displayName: "Google",
        displayText: "Signin with Google",
        authUrl: url,
      });
    }

    return supportedAuthenticationProviders;
  }

  private async getUserWithEmail(email: string) {
    const result = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, email));

    return result[0] ?? null;
  }

  private async generateJwtToken(userId: string) {
    return jwt.sign(
      { userId },
      env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  }

  public async createUserWithEmailAndPassword(
    payload: CreateUserWithEmailAndPasswordInputModelType
  ) {
    try {
      const { email, fullname, password } =
        await createUserWithEmailAndPasswordInputModel.parseAsync(payload);

      const existingUser = await this.getUserWithEmail(email);

      if (existingUser) {
        throw new Error("User already exists");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = await db
        .insert(usersTable)
        .values({
          fullname,
          email,
          passwordHash,
          emailVerifiedAt: null,
        })
        .returning({
          id: usersTable.id,
        });

      const userId = user[0]?.id;

      if (!userId) {
        throw new Error("User creation failed");
      }

      const verificationToken =
        await this.generateJwtToken(userId);

      await db.insert(emailVerificationsTable).values({
        userId,
        token: verificationToken,
        expiresAt: new Date(
          Date.now() + 60 * 60 * 1000
        ),
      });

      await sendVerificationEmail(
        email,
        `${env.BASE_URL}/verify-email?token=${verificationToken}`
      );

      return {
        success: true,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async loginUserWithEmailAndPassword(payload: LoginUserWithEmailAndPasswordInputModelType) {

  }

  public async logoutUser() {

  }

}

export default UserService;
