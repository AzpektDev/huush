import { Request, Response, Router } from "express";
import { Chat } from "../../../entities/Chat";
import { Authorization } from "../../../middlewares/Authorization";
import { Message } from "../../../entities/Message";
const router: Router = Router();

router.get("/", Authorization, async (req: Request, res: Response) => {
  const chats = await Chat.createQueryBuilder("chat")
    .where("chat.participant_ids @> :participantId", { participantId: [req.user.id] })
    .getMany();

  for (const chat of chats) {
    const lastMessage = await Message.createQueryBuilder("message")
      .where("message.chat_id = :chatId", { chatId: chat.id })
      .orderBy("message.created_at", "DESC")
      .getOne();

    if (lastMessage) {
      chat["last_message"] = lastMessage.content;
    } else {
      chat["last_message"] = "No messages yet...";
    }
  }
  
  
  res.json({
    message: "Successfully fetched chats",
    code: 0,
    status: 200,
    data: {
      chats,
    },
  });
});

export default router;
