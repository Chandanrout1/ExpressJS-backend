import passport from "passport";
import { Strategy } from "passport-local";
import { mockUsers } from "../utils/constants.mjs";
import { User } from "../database/user.mjs";

passport.serializeUser((user, done) => {
  console.log(`Inside Serilize user`);
  console.log(user);
  done(null, user.id);
});

passport.deserializeUser(async(id, done) => {
  console.log(`Inside deserializer`);
  console.log(`Deserializing id ${id}`);
  try {
    const findUser = await User.findById(id);
    if (!findUser) throw new Error("User Not Found");
    done(null, findUser);
  } catch (error) {
    done(error, null);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const findUser = await User.findOne({ username });
      if (!findUser) throw new Error("User not Found");
      if (findUser.password !== password) throw new Error("Bad credential");
      done(null, findUser);
    } catch (error) {
      done(error, null);
    }
  })
);
