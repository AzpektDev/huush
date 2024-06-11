import { BeforeInsert, BeforeUpdate, Column, Entity, Index, OneToOne, JoinColumn } from "typeorm";
import { Snowflake } from "../util/Snowflake";
import { BaseClass } from "./BaseClass";
import { User } from "./User";

@Entity("otps")
export class OTP extends BaseClass {
  @Column()
  @Index()
  user_id?: string;

  @JoinColumn({ name: "author_id", referencedColumnName: "id" })
  @OneToOne(() => User, {
    onDelete: "CASCADE",
  })
  user?: User;

  
  @Column()
  phone_number: string;

  @Column()
  otp: string;

  @Column()
  sent_at: Date;

  @BeforeUpdate()
  @BeforeInsert()
  _do_validate() {
    if (!this.id) this.id = Snowflake.generate();
  }
}