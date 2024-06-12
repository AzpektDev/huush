import { Request, Response, Router } from "express";
import { OTP } from "../../entities/OTP";
import { User } from "../../entities/User";

const router: Router = Router();

interface RegisterSchema {
  token: string;
}

router.post("/", async (req: Request, res: Response) => {
  let { token }: RegisterSchema = req.body;

  // Validate the request body
  if (!token) {
    return res.status(400).send({
      message: "Missing required fields",
      code: 0,
      status: 400,
    });
  }

  const user = await User.findOneBy({
    token,
  });

  if (!user) {
    return res.status(400).send({
      message: "Invalid token",
      code: 0,
      status: 400,
    });
  }

  return res.status(200).send({
    message: "Token valid",
    code: 0,
    status: 200,
  });
});

export default router;
