import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
// import config from "../../../config.json";
import { User } from "../../entities/User";

const router: Router = Router();

interface RegisterSchema {
  username: string;
  phone: string;
  password: string;
}

router.post("/", async (req: Request, res: Response) => {
  let { username, password, phone }: RegisterSchema = req.body;



  // Validate the request body
  if (!username || !password || !phone) {
    return res.status(400).send({
      message: "Missing required fields",
      code: 0,
      status: 400,
    });   
  }

  if (password.length < 8) {
    return res.status(400).send({
      message: "Password too short (min. 8)",
      code: 0,
      status: 400,
    });
  }

  // Check if the username is taken
  const usernameTaken = await User.findOneBy({ username });

  if (usernameTaken) {
    return res.status(400).send({
      message: "Username taken",
      code: 0,
      status: 400,
    });
  }

  // Hash the password
  password = await bcrypt.hash(password, 10);

  // Create the user
  const user = await User.registerUser({ username, password, phone, req });
  // sendSMS(user.phone.toString(), "budzet ucierpial o 0,12zl. womp womp");
  // sendSMS('+48512658925', 'JSIOJOIFDSD');

  return res.status(200).send({
    message: "Successfully registered",
    code: 0,
    status: 200,
    data: {
      user,
    },
  });
});

export default router;