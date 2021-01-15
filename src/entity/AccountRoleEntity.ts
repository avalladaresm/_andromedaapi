import { Property } from '@tsed/schema';
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'AccountRole' })
export class AccountRole {

  @Property()
  @PrimaryGeneratedColumn()
  id: number;
  
  @Property()
  @Column()
  roleId: number;

  @Property()
  @Column()
  acccountId: number;
}
