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
  VerifyEmailInputType,
  GenerateUserTokenPayloadType,
} from "./model";

import { sendVerificationEmail } from "../email/index";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class UserService {
  public async getAuthenticationMethods(): Promise<
    ReadonlyArray<GetAuthenticationMethodOutputSchemaType>
  > {
    const supportedAuthenticationProviders: GetAuthenticationMethodOutputSchemaType[] = [];

    const isGoogleConfigured = !!(env.GOOGLE_OAUTH_CLIENT_ID && env.GOOGLE_OAUTH_CLIENT_SECRET);

    if (isGoogleConfigured) {
      const url = googleOAuth2Client.generateAuthUrl({
        access_type: "offline",
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email"
        ],
        redirect_uri: env.GOOGLE_OAUTH_REDIRECT_URI,
      });
      supportedAuthenticationProviders.push({
        provider: "GOOGLE_OAUTH",
        displayName: "Google",
        displayText: "Signin with Google",
        authUrl: url,
      });
    }

    const isGithubConfigured = !!(env.GITHUB_OAUTH_CLIENT_ID && env.GITHUB_OAUTH_CLIENT_SECRET);

    if (isGithubConfigured) {
      const url = `https://github.com/login/oauth/authorize?client_id=${env.GITHUB_OAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(env.GITHUB_OAUTH_REDIRECT_URI || "")}&scope=user:email`;
      supportedAuthenticationProviders.push({
        provider: "GITHUB_OAUTH",
        displayName: "GitHub",
        displayText: "Signin with GitHub",
        authUrl: url,
      });
    }

    return supportedAuthenticationProviders;
  }

  private async getUserWithEmail(email: string) {
    const result = await db.select().from(usersTable).where(eq(usersTable.email, email));

    return result[0] ?? null;
  }

  private async generateJwtToken(id: string) {
    return jwt.sign({ id }, env.JWT_SECRET, {
      expiresIn: "7d",
    });
  }

  public async createUserWithEmailAndPassword(
    payload: CreateUserWithEmailAndPasswordInputModelType,
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

      const generateVerificationToken = await this.generateJwtToken(userId);

      await db.insert(emailVerificationsTable).values({
        userId,
        token: generateVerificationToken,
        expiresAt: new Date(Date.now() + 60 * 60 * 1000),
      });

      await sendVerificationEmail(
        email,
        `${env.WEB_URL}/verify-email?token=${generateVerificationToken}`,
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
      const { email, password } = await loginUserWithEmailAndPasswordInputModel.parseAsync(payload);

      const existingUser = await this.getUserWithEmail(email);

      if (!existingUser) {
        throw new Error("Invalid email or password");
      }

      if (!existingUser.emailVerifiedAt) {
        throw new Error("Please verify your email before logging in");
      }

      if (!existingUser.passwordHash) {
        throw new Error("This account uses a different login method");
      }

      const isPasswordValid = await bcrypt.compare(password, existingUser.passwordHash);

      if (!isPasswordValid) {
        throw new Error("Invalid email or password");
      }

      const token = await this.generateJwtToken(existingUser.id);

      return {
        id: existingUser.id,
        token,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async logoutUser() {
    return {
      success: true,
      message: "Logged out successfully",
    };
  }

  public async getUserInfoById(id: string) {
    try {
      const user = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id));

      if (!user[0] || user.length === 0) {
        throw new Error("User not found");
      }

      return {
        id: user[0].id,
        email: user[0].email,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async getMe(id: string) {
    try {
      const result = await db
        .select({
          id: usersTable.id,
          email: usersTable.email,
          fullname: usersTable.fullname,
          profileImageUrl: usersTable.profileImageUrl,
          isGmailConnected: usersTable.isGmailConnected,
          isCalendarConnected: usersTable.isCalendarConnected,
          isDemoMode: usersTable.isDemoMode,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id));

      if (!result[0]) {
        throw new Error("User not found");
      }

      return {
        id: result[0].id,
        email: result[0].email,
        fullname: result[0].fullname,
        profileImageUrl: result[0].profileImageUrl,
        isGmailConnected: result[0].isGmailConnected,
        isCalendarConnected: result[0].isCalendarConnected,
        isDemoMode: result[0].isDemoMode,
      };
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  public async verifyAndDecodeUserToken(token: string) {
    try {
      const result = jwt.verify(token, env.JWT_SECRET) as GenerateUserTokenPayloadType;

      return result;
    } catch (err) {
      throw new Error("Invalid token");
    }
  }

  public async verifyEmail(payload: VerifyEmailInputType) {
    try {
      const { token } = await verifyEmailInput.parseAsync(payload);

      const decoded = jwt.verify(token, env.JWT_SECRET);

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
        .where(eq(usersTable.id, verificationRecord.id));

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
        .where(eq(usersTable.id, verificationRecord.id));

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

  public async loginOrRegisterWithOAuth(payload: {
    code: string;
    provider: "GOOGLE_OAUTH" | "GITHUB_OAUTH";
  }) {
    try {
      const { code, provider } = payload;
      let providerId = "";
      let email = "";
      let fullname = "";
      let profileImageUrl = "";

      if (provider === "GOOGLE_OAUTH") {
        const { tokens } = await googleOAuth2Client.getToken(code);
        if (!tokens.id_token) {
          throw new Error("No ID token returned from Google");
        }
        const ticket = await googleOAuth2Client.verifyIdToken({
          idToken: tokens.id_token,
          audience: env.GOOGLE_OAUTH_CLIENT_ID,
        });
        const googlePayload = ticket.getPayload();
        if (!googlePayload || !googlePayload.email) {
          throw new Error("Invalid Google token payload");
        }
        providerId = googlePayload.sub;
        email = googlePayload.email;
        fullname = googlePayload.name || googlePayload.given_name || "";
        profileImageUrl = googlePayload.picture || "";
      } else if (provider === "GITHUB_OAUTH") {
        const tokenResponse = await fetch("https://github.com/login/oauth/access_token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            client_id: env.GITHUB_OAUTH_CLIENT_ID,
            client_secret: env.GITHUB_OAUTH_CLIENT_SECRET,
            code,
            redirect_uri: env.GITHUB_OAUTH_REDIRECT_URI,
          }),
        });
        const tokenData = (await tokenResponse.json()) as { access_token?: string };
        const accessToken = tokenData.access_token;
        if (!accessToken) {
          throw new Error("Failed to retrieve access token from GitHub");
        }

        const userResponse = await fetch("https://api.github.com/user", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "trpc-monorepo-app",
          },
        });
        const userData = (await userResponse.json()) as {
          id: number;
          name?: string;
          login: string;
          email?: string;
          avatar_url?: string;
        };
        providerId = String(userData.id);
        fullname = userData.name || userData.login || "";
        profileImageUrl = userData.avatar_url || "";

        const emailsResponse = await fetch("https://api.github.com/user/emails", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "User-Agent": "trpc-monorepo-app",
          },
        });
        const emailsData = (await emailsResponse.json()) as Array<{
          email: string;
          primary: boolean;
          verified: boolean;
        }>;
        const primaryEmailObj = emailsData.find((e) => e.primary && e.verified);
        email = primaryEmailObj ? primaryEmailObj.email : userData.email || "";
        if (!email) {
          throw new Error("No verified email found for GitHub user");
        }
      } else {
        throw new Error("Unsupported authentication provider");
      }

      // Check if user already exists with this provider ID
      let user = null;
      if (provider === "GOOGLE_OAUTH") {
        const result = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.googleId, providerId));
        user = result[0] ?? null;
      } else {
        const result = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.githubId, providerId));
        user = result[0] ?? null;
      }

      let userId = "";

      if (user) {
        userId = user.id;
      } else {
        // Check if user exists with this email
        const existingUser = await this.getUserWithEmail(email);

        if (existingUser) {
          userId = existingUser.id;
          // Link the provider ID to existing account
          if (provider === "GOOGLE_OAUTH") {
            await db
              .update(usersTable)
              .set({
                googleId: providerId,
                profileImageUrl: existingUser.profileImageUrl || profileImageUrl,
              })
              .where(eq(usersTable.id, userId));
          } else {
            await db
              .update(usersTable)
              .set({
                githubId: providerId,
                profileImageUrl: existingUser.profileImageUrl || profileImageUrl,
              })
              .where(eq(usersTable.id, userId));
          }
        } else {
          // Register a new user
          const newUser = await db
            .insert(usersTable)
            .values({
              fullname,
              email,
              emailVerifiedAt: new Date(),
              googleId: provider === "GOOGLE_OAUTH" ? providerId : null,
              githubId: provider === "GITHUB_OAUTH" ? providerId : null,
              profileImageUrl,
            })
            .returning({
              id: usersTable.id,
            });
          userId = newUser[0]?.id!;
        }
      }

      const token = await this.generateJwtToken(userId);

      return {
        id: userId,
        token,
      };
    } catch (error) {
      console.error("OAuth login error:", error);
      throw error;
    }
  }
}

export default UserService;
