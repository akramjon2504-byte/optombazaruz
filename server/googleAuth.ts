import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Express } from "express";
import { storage } from "./storage";

export function setupGoogleAuth(app: Express) {
  // Google OAuth Strategy
  passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: process.env.NODE_ENV === 'production' 
      ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/api/auth/google/callback`
      : "http://localhost:5000/api/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(profile.emails?.[0]?.value || "");
      
      if (existingUser) {
        // Update user's Google profile data
        const updatedUser = await storage.updateUser(existingUser.id, {
          firstName: profile.name?.givenName || existingUser.firstName,
          lastName: profile.name?.familyName || existingUser.lastName,
          profileImageUrl: profile.photos?.[0]?.value || existingUser.profileImageUrl,
          authProvider: "google",
          lastLoginAt: new Date(),
        });
        return done(null, updatedUser);
      } else {
        // Create new user
        const newUser = await storage.createUser({
          email: profile.emails?.[0]?.value || "",
          firstName: profile.name?.givenName || "",
          lastName: profile.name?.familyName || "",
          profileImageUrl: profile.photos?.[0]?.value || "",
          authProvider: "google",
          preferredLanguage: "uz",
        });
        return done(null, newUser);
      }
    } catch (error) {
      return done(error, undefined);
    }
  }));

  // Google Auth Routes
  app.get("/api/auth/google", 
    passport.authenticate("google", { 
      scope: ["profile", "email"] 
    })
  );

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
      // Store user in session
      const user = req.user as any;
      if (user) {
        const session = req.session as any;
        session.userId = user.id;
        session.isAdmin = user.isAdmin;
        session.user = user;
      }
      
      // Successful authentication, redirect to home page
      res.redirect("/");
    }
  );
}