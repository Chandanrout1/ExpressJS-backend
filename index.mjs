import express, { response } from "express";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;

const mockUsers = [
  { id: 1, username: "chandan", email: "crout7@gmail.com" },
  { id: 2, username: "aman", email: "aman02@gmail.com" },
  { id: 4, username: "ram", email: "ram@gmail.com" },
  { id: 5, username: "hari", email: "hari@gmail.com" },
  { id: 6, username: "ravi", email: "ravi@gmail.com" },
  { id: 7, username: "suresh", email: "suresh@gmail.com" },
  { id: 8, username: "lucky", email: "lucky@gmail.com" },
  { id: 9, username: "chinu", email: "chinu@gmail.com" },
  { id: 10, username: "champa", email: "champa@gmail.com" },
];

app.get("/", (req, res) => {
  res.status(201).send({ message: "Hello!" });
});

app.get("/api/users", (req, res) => {
  const {
    query: { filter, value },
  } = req;

  if (filter && value)
    return res.send(mockUsers.filter((user) => user[filter].includes(value)));

  return res.send(mockUsers);
});

app.post("/api/users", (req, res) => {
  const { body } = req;
  const newUser = { id: mockUsers[mockUsers.length - 1].id + 1, ...body };
  mockUsers.push(newUser);
  return res.status(201).send(newUser);
});

app.get("/api/users/:id", (req, res) => {
  // console.log(req.params)
  const parsedId = parseInt(req.params.id);

  if (isNaN(parsedId))
    return res.status(400).send({ msg: "Bad request. Invalid Id" });

  const findUser = mockUsers.find((user) => user.id === parsedId);

  if (!findUser) return res.sendStatus(404);
  return res.send(findUser);
});

app.get("/api/products", (req, res) => {
  res.send([
    { id: 1, name: "table", price: 800 },
    { id: 2, name: "chair", price: 500 },
    { id: 3, name: "fan", price: 2000 },
    { id: 4, name: "shoe", price: 400 },
    { id: 5, name: "bucket", price: 150 },
  ]);
});

app.put("/api/users/:id", (req, res) => {
  const {
    body,
    params: { id },
  } = req;

  const parsedId = parseInt(id);
  if (isNaN(parsedId)) return res.sendStatus(400);

  const findUserIndex = mockUsers.findIndex((user) => user.id === parsedId);

  if (findUserIndex === -1) return res.sendStatus(404);
  mockUsers[findUserIndex] = { id: parsedId, ...body };
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Running on Port ${PORT}`);
});
