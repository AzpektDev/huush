import { Request, Response, Router } from "express";
const router: Router = Router();

router.get("/", async (req: Request, res: Response) => {
  res.json({ message: "haii :3" });
})

export default router;