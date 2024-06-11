import { Request, Response, Router } from "express";
import { Chat } from "../../../entities/Chat";
import { Authorization } from "../../../middlewares/Authorization";
const router: Router = Router();

router.get("/", Authorization, async (req: Request, res: Response) => {
  const chat = await Chat.findOneBy({ id: req.params.id });

  res.json({
    message: "Successfully fetched",
    data: {
      chat,
    },
  });
});

export default router;
