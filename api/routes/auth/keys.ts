import { Request, Response, Router } from "express";
import { PublicKeyStore } from "../../entities/PublicKeyStore";
import * as libsignal from '@privacyresearch/libsignal-protocol-typescript';

const router: Router = Router();

router.post("/", async (req: Request, res: Response) => {
  const { user_id } = req.body;

  if (!user_id) {
    return res.status(400).send({
      message: "Missing required fields",
      code: 0,
      status: 400,
    });
  }

  const publicKeyStore = await PublicKeyStore.findOneBy({ user: { id: user_id } });

  if (!publicKeyStore) {
    return res.status(404).send({
      message: "Public key store not found",
      code: 0,
      status: 404,
    });
  }

  res.send({
    message: "Public key store found",
    code: 0,
    status: 200,
    data: {
      publicKeyStore
    }
  });
})

export default router;