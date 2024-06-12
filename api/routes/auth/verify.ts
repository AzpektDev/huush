import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { User } from "../../entities/User";
import { sendOTP } from "../../util/SMS";
import { OTP } from "../../entities/OTP";

const router: Router = Router();

interface RegisterSchema {
  code: string;
}

router.post("/", async (req: Request, res: Response) => {
  let { code }: RegisterSchema = req.body;

  // Validate the request body
  if (!code) {
    return res.status(400).send({
      message: "Missing required fields",
      code: 0,
      status: 400,
    });   
  }

  const otp = await OTP.findOneBy({
    otp: code,
  });

  if (!otp) {
    return res.status(400).send({
      message: "Invalid code",
      code: 0,
      status: 400,
    });
  }

  // delete the otp
  await OTP.delete(otp.id);

  const user = await User.findOneBy({
    id: otp.user_id,
  });

  if (!user) {
    return res.status(400).send({
      message: "Invalid user",
      code: 0,
      status: 400,
    });
  }

  user.phone_verified = true;
  await user.save();

  return res.status(200).send({
    message: "Successfully verified",
    code: 0,
    status: 200,
    data: {
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        token: user.token,
      }
    }
  });
});

export default router;