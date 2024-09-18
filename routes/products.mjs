import { Router } from "express";

const router = Router();

router.get("/api/products", (req, res) => {

  if (req.cookies.hello && req.cookies.hello === "chandan")
    return res.send([
      { id: 1, name: "table", price: 800 },
      { id: 2, name: "chair", price: 500 },
      { id: 3, name: "fan", price: 2000 },
      { id: 4, name: "shoe", price: 400 },
      { id: 5, name: "bucket", price: 150 },
    ]);

  return res.send({ msg: "Sorry. you need the correct cookie" });
});

export default router;
