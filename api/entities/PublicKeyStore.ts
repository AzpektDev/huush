import { Entity, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, BeforeUpdate, BeforeInsert } from "typeorm";
import { BaseClass } from "./BaseClass";
import { Snowflake } from "../util/Snowflake";
import { User } from "./User";

@Entity()
export class PublicKeyStore extends BaseClass {
  @ManyToOne(() => User, user => user.id, { nullable: false, onDelete: "CASCADE" })
  user: User;

  @Column({ type: "text" })
  identity_key: string;

  @Column({ type: "integer" })
  registration_id: number;

  @Column({ type: "jsonb" })
  pre_keys: { keyId: number, publicKey: string }[];

  @Column({ type: "text" })
  signed_pre_key: string;

  @Column({ type: "text" })
  signed_pre_key_signature: string;

  @CreateDateColumn()
  created_at: Date;

  @BeforeUpdate()
  @BeforeInsert()
  _do_validate() {
    if (!this.id) this.id = Snowflake.generate();
  }
}
