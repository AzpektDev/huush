import { Request } from "express";
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from "typeorm";
import { Snowflake } from "../util/Snowflake";
import { trimSpecial } from "../util/String";
import { BaseClass } from "./BaseClass";
import { Chat } from "./Chat";

function getRandomString(length) {
  const randomChars = "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
  }
  return result;
}

@Entity("users")
export class User extends BaseClass {
  @Column()
  username: string;

  @Column({nullable: true})
  display_name: string

  @Column()
  phone: string;

  @Column()
  phone_verified: boolean;

  @Column({ select: false })
  password: string;

  @Column()
  role: number;

  @Column()
  token: string;

  // ref to chats
  @OneToMany(() => Chat, chat => chat.author)
  chats: Chat[];

  @Column()
  created_at: Date;

  @Column()
  last_login: Date;

  @BeforeUpdate()
  @BeforeInsert()
  _do_validate() {
    if (!this.id) this.id = Snowflake.generate();
  }

  static async registerUser({ username, phone, password, req }: { username: string; password: string; email: string; phone: string; req?: Request }) {
    username = trimSpecial(username);

    // const settings = UserSettings.create();
    // await settings.save();

    const user = User.create({
      username: username,
      phone: phone,
      phone_verified: false,
      password: password,
      role: 0,
      token: getRandomString(32),
      // settings: settings,
      created_at: new Date(),
      last_login: new Date(),
    });

    await user.save();

    return user;
  }
}