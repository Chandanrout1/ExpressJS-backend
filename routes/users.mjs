import { Router } from "express";
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
import { mockUsers } from "../utils/constants.mjs";
import { resolveIndexByUserId } from "../utils/middleWares.mjs";

const router = Router();

router.get("/", (req, res) => {
  res.status(201).send({ message: "Hello!" });
});

router.get("/api/users", checkSchema(queryValidateSchema), (req, res) => {
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

router.post("/api/users", checkSchema(userValidationSchema), (req, res) => {
  const result = validationResult(req);

  if (!result.isEmpty())
    return res.status(400).send({ errors: result.array() });

  const data = matchedData(req);

  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...data };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

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
