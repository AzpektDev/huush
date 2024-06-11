import { Request, Response, Router } from "express";
import { User } from "../../../entities/User";
import { Authorization } from "../../../middlewares/Authorization";
const router: Router = Router();

router.get("/", Authorization, async (req: Request, res: Response) => {
  if (req.user.role < 1 && req.user.id !== req.params.id) return res.status(403).send({
    message: "User not authorized",
    code: 0,
    status: 403,
  });

  const user = await User.findOneBy({ id: req.params.id });

  if (!user) {
    return res.status(404).send({
      message: "User not found",
      code: 0,
      status: 404,
    });
  }

  res.json({
    message: "Successfully fetched user",
    code: 0,
    status: 200,
    data: {
      user,
    },
  });
})

export default router;