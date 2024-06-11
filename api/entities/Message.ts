import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, RelationId, Index } from "typeorm";
import { Snowflake } from "../util/Snowflake";
import { trimSpecial } from "../util/String";
import { BaseClass } from "./BaseClass";
import { User } from "./User";
import { Chat } from "./Chat";

@Entity("messages")
export class Message extends BaseClass {
  @Column({ nullable: true })
	@RelationId((message: Message) => message.author)
	@Index()
	author_id?: string;

	@JoinColumn({ name: "author_id", referencedColumnName: "id" })
	@ManyToOne(() => User, {
		onDelete: "CASCADE",
	})
  author?: User;
  

	@Column({ nullable: true })
	@RelationId((message: Message) => message.chat)
	@Index()
	chat_id?: string;

	@JoinColumn({ name: "chat_id" })
	@ManyToOne(() => Chat, {
		onDelete: "CASCADE",
	})
  chat: Chat;


  @Column()
  content: string;

  // @Column()
  // type: string;

  @Column()
  created_at: Date;

  @BeforeUpdate()
  @BeforeInsert()
  _do_validate() {
    if (!this.id) this.id = Snowflake.generate();
  }

  static async new({ req, author, content, chat }:  any) {
    const message = Message.create({
      author_id: req?.user?.id || author,
      chat_id: req?.params?.id || chat,
      content: req?.body?.content || content,
      created_at: new Date(),
    });

    await message.save();

    return message;
  };
}