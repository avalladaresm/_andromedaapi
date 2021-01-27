import { MaxLength } from '@tsed/schema';
import { Format, Property } from '@tsed/schema';
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Employee' })
export class Employee {

    @Property()
    @PrimaryGeneratedColumn()
    id: number;

    @Property()
    @Column()
    @MaxLength(255)
    name: string;

    @Property()
    @Column()
    @MaxLength(255)
    surname: string;

    @Column({ type: "date" })
    @Format('date')
    @Property()
    dob: string

    @Property()
    @Column()
    @MaxLength(25)
    gender: string;

    @Property()
    @Column()
    @MaxLength(255)
    position: string;

    @Column({ type: "date" })
    @Format('date')
    @Property()
    hiredOn: string

    @Column({ type: "date" })
    @Format('date')
    @Property()
    firedOn: string

    @Property()
    @Column()
    @MaxLength(25)
    contractType: string;

    @Property()
    @Column({type:'money'})
    salary: number;

    @Property()
    @Column()
    availableLeaveDays: number;
}
