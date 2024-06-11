import { Request, Response, Router } from "express";
import { Chat } from "../../../entities/Chat";
import { Message } from "../../../entities/Message";
import { Authorization } from "../../../middlewares/Authorization";
const router: Router = Router();

router.get("/", Authorization, async (req: Request, res: Response) => {
  const chat = await Chat.findOneBy({ id: req.params.id });

  if (!chat) {
    return res.status(404).send({
      message: "Chat not found",
      code: 0,
      status: 404,
    });
  }

  if (chat.author_id !== req.user.id && !chat.participant_ids.includes((req.user.id).toString())) return res.status(403).json({
    message: "User not authorized",
    code: 0,
    status: 403,
  });

  const messages = await Message.find({ where: { chat_id: chat.id } });

  res.json({
    message: "Successfully fetched history",
    code: 0,
    status: 200,
    data: {
      messages,
    },
  });
})

export default router;