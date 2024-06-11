import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { User } from "../../entities/User";

const router: Router = Router();

interface LoginSchema {
  username: string;
  password: string;
}

router.post("/", async (req: Request, res: Response) => {
  let { username, password}: LoginSchema = req.body;

  if (!username || !password ) {
    return res.status(400).send({
      message: "Missing required fields",
      code: 0,
      status: 400,
    });
  }

  username = username.toLowerCase();

  // Check if the user exists - querybuilder used to get password (its excluded)
  const user = await User.createQueryBuilder("user")
    .where("user.username = :username", { username })
    .addSelect("user.password")
    .getOne();
  
  
  if (!user) {
    return res.status(400).send({
      message: "Incorrect username or password",
      code: 0,
      status: 400,
    });
  }

  const passwordCorrect = await bcrypt.compare(password, user.password);
  if (!passwordCorrect) {
    return res.status(400).send({
      message: "Incorrect username or password",
      code: 0,
      status: 400,
    });
  }

  user.last_login = new Date();
  await user.save();

  res.send({
    message: "Login successful",
    code: 0,
    status: 200,
    data: {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        token: user.token,
      },
    }
  });
});

export default router;