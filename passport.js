import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { query } from "./server.js";

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "275668049629-6m0b9sjlh04tnk37bbat2gdh85s6ukj2.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:1000/login/google/callback",
    },
    async function (accessToken, refreshToken, profile, done) {
      try {
        console.log(profile);
        const sql = `SELECT * FROM shopping.userdata WHERE googleID=${profile.id}`;
        const check = await query(sql);
        if(check.err) throw check.err;
        else{
          if(check.length===0){
            const sql1=`INSERT INTO shopping.userdata(userName,googleID,accessToken,refreshToken) VALUE('${profile.displayName}',${profile.id},'${accessToken}','${refreshToken}')`;
            const result=await query(sql1);
            if(result.err) throw result.err;
          }
          else{
            const sql2=`UPDATE shopping.userdata SET accessToken='${accessToken}',refreshToken='${refreshToken}' WHERE googleID=${profile.id}`;
            const result=await query(sql2);
            if(result.err) throw result.err;
          }
        }
      } catch (error) {
        console.log(error);
      }
      return done(null, profile);
    }
  )
);
