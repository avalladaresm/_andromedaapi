import { MaxLength } from '@tsed/schema';
import { Property } from '@tsed/schema';
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Email' })
export class Email {

  @Property()
  @PrimaryGeneratedColumn()
  id: number;

  @Property()
  @Column()
  @MaxLength(255)
  email: string;

  @Property()
  @Column()
  type: string;
}
