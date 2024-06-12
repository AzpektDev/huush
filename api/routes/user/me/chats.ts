import { Request, Response, Router } from "express";
import { Chat } from "../../../entities/Chat";
import { Authorization } from "../../../middlewares/Authorization";
const router: Router = Router();

router.get("/", Authorization, async (req: Request, res: Response) => {
  const chats = await Chat.createQueryBuilder("chat")
    .where("chat.participant_ids @> :participantId", { participantId: [req.user.id] })
    .getMany();

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
