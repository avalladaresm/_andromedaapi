import { Property, Required } from '@tsed/schema';
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Country' })
export class Country {

  @Property()
  @PrimaryGeneratedColumn()
  id: number;

  @Property()
  @Column()
  @Required()
  iso2: string;

  @Property()
  @Column()
  @Required()
  name: string;
}

@Entity({ name: 'State' })
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


@Entity({ name: 'City' })
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