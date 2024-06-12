import { Request, Response, Router } from "express";
import { Chat } from "../../entities/Chat";
import { Authorization } from "../../middlewares/Authorization";
import { User } from "../../entities/User";
const router: Router = Router();

router.post("/", Authorization, async (req: Request, res: Response) => {
  const { participants } = req.body;

  if (!participants) {
    return res.status(400).send({
      message: "Missing required fields",
      code: 0,
      status: 400,
    });
  }

  const users = []

  for (const participant of participants) {
    const user = await User.findOne({ where: { id: participant } });

    users.push(user);

    if (!user) {
      return res.status(404).send({
        message: "User not found",
        code: 0,
        status: 404,
      });
    }
  }

  if (participants.includes(req.user.id)) return res.status(400).send({
    message: "You can't create a chat with yourself",
    code: 0,
    status: 400,
  });

  participants.push(req.user.id);

  const name = `@${users[0].username}`

  const chat = await Chat.new({ participants, name, req });

  res.json({
    message: "Chat created",
    data: {
      chat,
    },
  });
});

export default router;
