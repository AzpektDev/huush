import bcrypt from "bcrypt";
import { Request, Response, Router } from "express";
import { OTP } from "../../entities/OTP";
import { PublicKeyStore } from "../../entities/PublicKeyStore";
import { User } from "../../entities/User";
import { sendOTP } from "../../util/SMS";

const router: Router = Router();

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

interface RegisterSchema {
  username: string;
  phone: string;
  password: string;

  identityKey: string;
  registrationId: number;
  preKeys: { keyId: number; publicKey: string }[];
  signedPreKey: string;
  signedPreKeySignature: string;
}

router.post("/", async (req: Request, res: Response) => {
  let { username, password, phone, identityKey, registrationId, preKeys, signedPreKey, signedPreKeySignature }: RegisterSchema = req.body;

  // Validate the request body
  if (!username || !password || !phone || !identityKey || !registrationId || !preKeys || !signedPreKey || !signedPreKeySignature) {
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

  const user = await User.registerUser({ username, password, phone, req });

  const publicKeyStore = new PublicKeyStore();
  publicKeyStore.user = user;
  publicKeyStore.identity_key = Buffer.from(identityKey, "base64").toString("hex");
  publicKeyStore.registration_id = registrationId;
  publicKeyStore.pre_keys = preKeys.map((key) => ({
    keyId: key.keyId,
    publicKey: Buffer.from(key.publicKey, "base64").toString("hex"),
  }));
  publicKeyStore.signed_pre_key = Buffer.from(signedPreKey, "base64").toString("hex");
  publicKeyStore.signed_pre_key_signature = Buffer.from(signedPreKeySignature, "base64").toString("hex");
  await publicKeyStore.save();

  // const onetimePassword = generateOTP();
  // await OTP.create({
  //   user_id: user.id,
  //   phone_number: user.phone,
  //   otp: onetimePassword,
  //   sent_at: new Date(),
  // }).save();

  // await sendOTP(user.phone, onetimePassword);

  delete user.password;
  delete user.token;

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
