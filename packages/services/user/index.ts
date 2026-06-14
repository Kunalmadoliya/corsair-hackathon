import { db, eq } from "@repo/database";

import { usersTable, emailVerificationsTable } from "@repo/database/schema";
import { env } from "../env";
import { googleOAuth2Client } from "../clients/google-oauth";
import {
  CreateUserWithEmailAndPasswordInputModelType,
  GetAuthenticationMethodOutputSchemaType,
  createUserWithEmailAndPasswordInputModel,
  loginUserWithEmailAndPasswordInputModel,
  LoginUserWithEmailAndPasswordInputModelType,
  verifyEmailInput,
  VerifyEmailInputType
} from "./model";

import { sendVerificationEmail } from "../email/index"

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

class UserService {
  public async getAuthenticationMethods(): Promise<
    ReadonlyArray<GetAuthenticationMethodOutputSchemaType>
  > {
    const supportedAuthenticationProviders: GetAuthenticationMethodOutputSchemaType[] = [];

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

      const generateVerificationToken =
        await this.generateJwtToken(userId);

      await db.insert(emailVerificationsTable).values({
        userId,
        token: generateVerificationToken,
        expiresAt: new Date(
          Date.now() + 60 * 60 * 1000
        ),
      });

      await sendVerificationEmail(
        email,
        `${env.WEB_URL}/verify-email?token=${generateVerificationToken}`
      );

      return {
        success: true,
        id: userId,
        message: "Verification email sent successfully",
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async loginUserWithEmailAndPassword(payload: LoginUserWithEmailAndPasswordInputModelType) {
    try {
      const { email, password } = await loginUserWithEmailAndPasswordInputModel.parseAsync(payload)

      const existingUser = await this.getUserWithEmail(email)

      if (!existingUser) {
        throw new Error("Invalid email or password")
      }

      if (!existingUser.emailVerifiedAt) {
        throw new Error("Please verify your email before logging in")
      }

      if (!existingUser.passwordHash) {
        throw new Error("This account uses a different login method")
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash)

      if (!isPasswordValid) {
        throw new Error("Invalid email or password")
      }

      const token = await this.generateJwtToken(existingUser.id)

      return {
        id: existingUser.id,
        token,
      }
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  public async logoutUser() {
    return {
      success: true,
      message: "Logged out successfully",
    }
  }

public async verifyEmail(payload: VerifyEmailInputType) {
  try {
    const { token } = await verifyEmailInput.parseAsync(payload);

    const decoded = jwt.verify(
      token,
      env.JWT_SECRET
    ) as { userId: string };

    const verification = await db
      .select()
      .from(emailVerificationsTable)
      .where(eq(emailVerificationsTable.token, token));

    const verificationRecord = verification[0];

    if (!verificationRecord) {
      throw new Error("Verification token not found");
    }

    if (verificationRecord.verifiedAt) {
      throw new Error("Email already verified");
    }

    if (verificationRecord.expiresAt < new Date()) {
      throw new Error("Verification token expired");
    }

    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, verificationRecord.userId));

    if (!user[0]) {
      throw new Error("User not found");
    }

    if (user[0].emailVerifiedAt) {
      throw new Error("Email already verified");
    }

    await db
      .update(usersTable)
      .set({
        emailVerifiedAt: new Date(),
      })
      .where(eq(usersTable.id, verificationRecord.userId));

    await db
      .update(emailVerificationsTable)
      .set({
        verifiedAt: new Date(),
      })
      .where(eq(emailVerificationsTable.id, verificationRecord.id));

    return {
      success: true,
      message: "Email verified successfully",
    };
  } catch (error) {
    console.error("Verify Email Error:", error);
    throw error;
  }
}

}

export default UserService;
