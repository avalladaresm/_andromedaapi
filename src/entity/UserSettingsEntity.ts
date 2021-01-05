import {Format, Property} from '@tsed/schema';
import {Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from 'typeorm';
import { Users } from './UsersEntity';

/*
* When in PascalCase, typeorm tranforms the entity name to snake_case,
* so a 'name' property has to be set to the name of the table in 
* the database that is being referenced.
*/
@Entity({name: 'UserSettings'})
export class UserSettings {

    @PrimaryGeneratedColumn()
    id: number;
    
    @Property()
    @Column({length: 2})
    language: string;

    @Property()
    @OneToOne(() => Users)
    @JoinColumn()
    user: Users;

    @Column({type: 'datetime'})
    @Format('date-time')
    @Property()
    updatedAt: string
}

export class UserSettingsToUpdate {

    @PrimaryGeneratedColumn()
    id?: number;
    
    @Property()
    @Column({length: 2})
    language?: string;

    @Column({default: Date.now, type: 'datetime'})
    updatedAt: Date = new Date()
}