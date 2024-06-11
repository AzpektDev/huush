import { Request } from "express";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, JoinColumn, Index } from "typeorm";
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
    
  @ManyToMany(() => User, user => user.chats, {
    cascade: true
  })
  @JoinTable({
    name: "chat_participants", // Name of the join table
    joinColumn: {
      name: "chat_id",
      referencedColumnName: "id"
    },
    inverseJoinColumn: {
      name: "user_id",
      referencedColumnName: "id"
    }
  })
  participants?: User[];

  @OneToMany(() => Message, message => message.chat)
  messages?: Message[];

  @Column()
  created_at: Date;

  @BeforeUpdate()
  @BeforeInsert()
  _do_validate() {
    if (!this.id) this.id = Snowflake.generate();
  }

  static async new({ req }: { req: Request }) {
    const chat = Chat.create({
      author_id: req.user.id,
      created_at: new Date(),
    });

    await chat.save();

    return chat;  
  }
}
