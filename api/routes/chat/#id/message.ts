import { Request, Response, Router } from "express";
import { Chat } from "../../../entities/Chat";
import { Message } from "../../../entities/Message";
import { Authorization } from "../../../middlewares/Authorization";
// import WebSocket from "ws";
const router: Router = Router();

  router.post("/", Authorization, async (req: Request, res: Response) => {
    // const wss = req.wss;

    const chat = await Chat.findOneBy({ id: req.params.id });
    const content = req.body.content;
  
    if (!content) return res.status(400).send({
      message: "Missing required fields",
      code: 0,
      status: 400,
    });


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

    const message = await Message.new({ req }).catch((e) => {
      console.error(e);
      return res.status(500).send({
        message: "Internal server error",
        code: 0,
        status: 500,
      });
    });

    // wss.clients.forEach((client) => {
    //   if (client.readyState === WebSocket.OPEN) {
    //     client.send(JSON.stringify({
    //       type: "message",
    //       content: content,
    //       chatId: chat.id,
    //       auth: {
    //         token: req.user.token,
    //       }
    //     })
    //     );
    //   }
    // });

    res.json({
      message: "message sent",
      code: 0,
      status: 200,
      data: {
        chat,
        message
      },
    });
  })

export default router;
