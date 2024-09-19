import { response, Router } from "express";
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middleWares.mjs";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import mongoose from "mongoose";
import "../strategies/local-strategy.mjs";
import { User } from "../database/user.mjs";

import {
  query,
  validationResult,
  body,
  matchedData,
  checkSchema,
} from "express-validator";

import {
  queryValidateSchema,
  userValidationSchema,
} from "../utils/validationSchema.mjs";
import { hashpassword } from "../utils/helpers.mjs";

const router = Router();

mongoose
  .connect("mongodb://localhost/express-backend")
  .then(() => console.log("connected to database"))
  .catch((err) => console.log(`Error ${err}`));

router.use(cookieParser());
router.use(
  session({
    secret: "chandan the dev",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 60000 * 60,
    },
  })
);
router.use(passport.initialize());
router.use(passport.session());

router.get("/", (req, res) => {
  // console.log(req.session);
  // console.log(req.session.id);
  req.session.visited = true;

  res.cookie("hello", "chandan", { maxAge: 20000 });
  res.status(201).send({ message: "Hello!" });
});

// router.post("/api/auth", (req, res) => {
//   const {
//     body: { email, password },
//   } = req;

//   const findUser = mockUsers.find((user) => user.email === email);
//   if (!findUser || findUser.password !== password)
//     return res.status(401).send({ message: "Bad Credentials" });

//   req.session.user = findUser;
//   return res.status(200).send(findUser);
// });

router.post("/api/auth", passport.authenticate("local"), (req, res) => {
  res.sendStatus(200);
});

router.get("/api/auth/status", (req, res) => {
  console.log("Inside /auth/status endpoint");
  console.log(req.user);
  console.log(req.session);
  return req.user ? res.send(req.user) : res.sendStatus(401);
});

router.post("/api/auth/logout", (req, res) => {
  if (!req.user) return res.sendStatus(401);
  req.logOut((err) => {
    if (err) return response.sendStatus(400);
    res.sendStatus(200);
  });
});

router.get("/api/auth/status", (req, res) => {
  req.sessionStore.get(req.sessionID, (err, session) => {
    console.log(session);
  });
  return req.session.user
    ? res.status(200).send(req.session.user)
    : res.status(401).send({ message: "Not Authenticated" });
});

router.post("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  const { body: item } = req;
  const { cart } = req.session;

  if (cart) {
    cart.push(item);
  } else {
    req.session.cart = [item];
  }
  return res.status(201).send(item);
});

router.get("/api/cart", (req, res) => {
  if (!req.session.user) return res.sendStatus(401);
  return res.send(req.session.cart ?? []);
});

router.get("/api/users", checkSchema(queryValidateSchema), (req, res) => {
  // console.log(req.session);
  // console.log(req.session.id);
  const result = validationResult(req);
  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));

  return res.send(mockUsers);
});

router.get("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;
  const findUser = mockUsers[findUserIndex];

  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

router.post(
  "/api/users",
  checkSchema(userValidationSchema),
  async (req, res) => {
    const result = validationResult(req);
    if(!result.isEmpty()) return res.send(result.array());

    const { body } = req;
    console.log(body);
    body.password = hashpassword(body.password)
    console.log(body);
    const newuser = new User(body);
    try {
      const saveduser = await newuser.save();
      return res.status(201).send(saveduser);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
  }
);

router.put("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { id: mockUsers[findUserIndex].id, ...body };
  return res.sendStatus(200);
});

router.patch("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { body, findUserIndex } = req;

  mockUsers[findUserIndex] = { ...mockUsers[findUserIndex], ...body };
  return res.sendStatus(200);
});

//delete request

router.delete("/api/users/:id", resolveIndexByUserId, (req, res) => {
  const { findUserIndex } = req;

  mockUsers.splice(findUserIndex, 1);
  return res.sendStatus(200);
});

export default router;
