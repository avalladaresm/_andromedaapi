import {Format, Property, Required} from '@tsed/schema';
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: 'Logs'})
export class Log {
    
    @Property()
    @PrimaryGeneratedColumn()
    id: number;
    
    @Property()
    @Column()
    @Required()
    userName: string;

    @Property()
    @Column()
    type: string;
    
    @Column({type: "datetime"})
    @Format('date-time')
    @Property()
    date: string
    
    @Property()
    @Column()
    description: string;
    
    @Property()
    @Column()
    data: string;
}
