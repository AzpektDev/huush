import { Request, Response, Router } from "express";
import { User } from "../../entities/User";
import { Authorization } from "../../middlewares/Authorization";
const router: Router = Router();

router.get("/", Authorization, async (req: Request, res: Response) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).send({
      message: "Missing required fields",
      code: 0,
      status: 400,
    });
  }

  const user = await User.createQueryBuilder("user")
    .where("user.username LIKE :name", { name: `%${query}%` })
    .getMany();
  
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