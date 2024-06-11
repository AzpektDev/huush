import { Request, Response, Router } from "express";
import { Chat } from "../../entities/Chat";
import { Authorization } from "../../middlewares/Authorization";
const router: Router = Router();

router.post("/", Authorization, async (req: Request, res: Response) => {
  const chat = await Chat.new({ participants: ["12835228582273028"], req });

  res.json({
    message: "Chat created",
    data: {
      chat,
    },
  });
});

export default router;
