import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { signJWT } from "../helpers/jwt.js";
import User from "../models/User.js";


export function configurePassport(passport) {
  // Verifica presenza delle ENV
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    console.error("Missing Google OAuth credentials in environment variables.");
    process.exit(1);
  }

  const callbackURL = `${process.env.BACKEND_HOST}${process.env.GOOGLE_CALLBACK_PATH}`;
  console.log("Google Strategy configuration:");
  console.log("GOOGLE_CLIENT_ID:", process.env.GOOGLE_CLIENT_ID);
  console.log("CALLBACK URL:", callbackURL);

  // Inizializza strategia Google
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          let user = await User.findOne({ googleId: profile.id });

          if (!user) {
            const fullName = profile.displayName || "No Name";
            const email = profile.emails?.[0]?.value || "no-email@bakeapp.com";

            user = await User.create({
              name: fullName,
              email,
              googleId: profile.id,
              role: "CUSTOMER",
            });
          }

          const jwt = signJWT({ id: user._id, role: user.role });
          done(null, { user, jwt });
        } catch (error) {
          done(error, null);
        }
      }
    )
  );

  console.log("GoogleStrategy successfully initialized.");
}
