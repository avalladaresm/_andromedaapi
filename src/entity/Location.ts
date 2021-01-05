import { Property, Required } from '@tsed/schema';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Countries' })
export class Country {

  @Property()
  @PrimaryGeneratedColumn()
  id: string;

  @Property()
  @Column()
  @Required()
  name: string;
}

@Entity({ name: 'States' })
export class State {

  @Property()
  @PrimaryGeneratedColumn()
  id: number;

  @Property()
  @Column()
  @Required()
  name: string;

  @Property()
  @OneToOne(() => Country)
  @JoinColumn()
  country: Country;
}


@Entity({ name: 'Cities' })
export class City {

  @Property()
  @PrimaryGeneratedColumn()
  id: number;

  @Property()
  @Column()
  @Required()
  name: string;

  @Property()
  @OneToOne(() => State)
  @JoinColumn()
  state: State;
}