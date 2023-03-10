import { Router } from "express";
import session from "express-session";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bCrypt from "bcrypt";
import { User } from "../models/usuario.js";
import MongoStore from "connect-mongo";
import dotenv from "dotenv";
const router = Router();

dotenv.config();

const MONGO_DB_URI = process.env.URL_MONGO;

passport.use(
  "register",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    function (req, username, password, done) {
      const { direccion } = req.body;
      const findOrCreateUser = function () {
        User.findOne({ username: username }, async function (err, user) {
          if (err) {
            console.log("Error in SignUp: " + err);
            return done(err);
          }
          if (user) {
            console.log("User already exists");
            done(null, false);
          } else {
            var newUser = new User();
            newUser.username = username;
            newUser.password = createHash(password);
            newUser.direccion = direccion;
            newUser = await newUser.save();
            done(null, newUser);
          }
        });
      };
      process.nextTick(findOrCreateUser);
    }
  )
);

passport.use(
  "login",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) return done(err);
        if (!user) {
          console.log("User Not Found with username " + username);
          return done(null, false);
        }
        if (!validatePassword(user, password)) {
          console.log("Invalid Password");
          return done(null, false);
        }
        return done(null, user);
      });
    }
  )
);

const validatePassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

var createHash = function (password) {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

// //SESSION

const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };

router.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_DB_URI,
      mongoOptions: advancedOptions,
    }),
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000,
    },
    rolling: true,
  })
);

router.use(passport.initialize());
router.use(passport.session());

export default router;
