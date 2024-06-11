import { Request } from "express";
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, OneToMany, OneToOne, ManyToOne, ManyToMany, RelationId, Index } from "typeorm";
import { Snowflake } from "../util/Snowflake";
import { trimSpecial } from "../util/String";
import { BaseClass } from "./BaseClass";
import { Message } from "./Message";
import { User } from "./User";
import { get } from "http";

@Entity("chats")
export class Chat extends BaseClass {
  @Column()
	@RelationId((chat: Chat) => chat.author)
	@Index()
	author_id?: string;

	@JoinColumn({ name: "author_id", referencedColumnName: "id" })
	@ManyToOne(() => User, {
		onDelete: "CASCADE",
  })
  author?: User;
    
    
  @Column({ nullable: true })
  @RelationId((chat: Chat) => chat.participants)
  @Index()
  participants_ids?: string[];

  @JoinColumn({ name: "participants_ids", referencedColumnName: "id" })
  @ManyToMany(() => User, {
    onDelete: "CASCADE",
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