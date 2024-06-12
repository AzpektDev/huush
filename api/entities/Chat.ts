import { Request } from "express";
import { BeforeInsert, BeforeUpdate, Column, Entity, Index, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { Snowflake } from "../util/Snowflake";
import { BaseClass } from "./BaseClass";
import { Message } from "./Message";
import { User } from "./User";

@Entity("chats")
export class Chat extends BaseClass {
  @Column()
  @Index()
  author_id?: string;

  @JoinColumn({ name: "author_id", referencedColumnName: "id" })
  @ManyToOne(() => User, {
    onDelete: "CASCADE",
  })
  author?: User;

  @Column()
  name: string;

  @Column("text", { array: true })
  participant_ids?: string[]; // Comma-separated list of user IDs

  @OneToMany(() => Message, (message) => message.chat)
  messages?: Message[];

  @Column()
  created_at: Date;

  @BeforeUpdate()
  @BeforeInsert()
  _do_validate() {
    if (!this.id) this.id = Snowflake.generate();
  }

  static async new({ participants, name, req }: { participants: string[]; name: string; req: Request }) {
    // const participantIds = participants.join(',');

    const chat = Chat.create({
      author_id: req.user.id,
      name,
      participant_ids: participants,
      created_at: new Date(),
    });

    await chat.save();

    return chat;
  }
}
