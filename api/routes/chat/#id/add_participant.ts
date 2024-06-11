import { Request, Response, Router } from "express";
import { Chat } from "../../../entities/Chat";
import { Authorization } from "../../../middlewares/Authorization";
import { User } from "../../../entities/User";
const router: Router = Router();

router.post("/", Authorization, async (req: Request, res: Response) => {
  const chat = await Chat.findOneBy({ id: req.params.id });

  const { participants } = req.body;

  if (!participants) {
    return res.status(400).json({
      message: "Missing participants",
      code: 0,
      status: 400,
    });
  }

  // check if the user is the author of the chat
  if (chat.author_id !== req.user.id) {
    return res.status(403).json({
      message: "You are not the author of this chat",
      code: 0,
      status: 403,
    });
  }

  // check if the participants are valid users
  const users = await User.findByIds(participants);

  if (users.length !== participants.length) {
    return res.status(400).json({
      message: "Invalid participants",
      code: 0,
      status: 400,
    });
  }

  chat.participant_ids = [...chat.participant_ids, ...participants]; 

  await chat.save();

  res.json({
    message: "Successfully added participants",
    data: {
      chat,
    },
  });
});

export default router;
