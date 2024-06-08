import { BaseEntity, BeforeInsert, BeforeUpdate, PrimaryColumn } from "typeorm";
import { Snowflake } from "../util/Snowflake";

export class BaseClassWithoutId extends BaseEntity {}

export class BaseClass extends BaseClassWithoutId {
  @PrimaryColumn()
  id: string = Snowflake.generate();

  @BeforeUpdate()
  @BeforeInsert()
  _do_validate() {
    if (!this.id) this.id = Snowflake.generate();
  }
}