import { Ignore } from '@tsed/schema';
import {Format, Property, Required} from '@tsed/schema';
import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {hashPassword} from '../utils/index'

@Entity({name: 'Users'})
export class Users {
    
    @Property()
    @PrimaryGeneratedColumn()
    id: number;

    @Property()
    @Column()
    firstName: string;

    @Property()
    @Column()
    middleName: string;
    
    @Property()
    @Column()
    lastName: string;
    
    @Property()
    @Column()
    @Required()
    userName: string;

    @Property()
    @Column()
    password: string;

    @Column()
    @Property()
    gender: string;

    @Column({type: "date"})
    @Format('date')
    @Property()
    dob: string;
    
    @Column()
    @Property()
    email: string;

    @Column()
    @Property()
    verified: boolean;

    @Column()
    @Property()
    address: string
    
    @Column()
    @Property()
    cellphone: string

    @Column({type: "datetime"})
    @Format('date-time')
    @Property()
    createdAt: string

    @Column({type: "datetime"})
    @Format('date-time')
    @Property()
    updatedAt: string

    @Column()
    @Property()
    cityId: number

    @Column()
    @Property()
    stateId: number

    @Column()
    @Property()
    countryId: string

    @Column()
    @Property()
    roleId: number

    @Ignore()
	async setPassword(newPassword: string) {
		if (!newPassword) {
			throw new Error('Password invalid');
		}

		// Hash the password first
		const hashedPassword = await hashPassword(newPassword);

		// Set the hashed password
		this.password = hashedPassword;
	}
}

@Entity()
export class UsersDataToUpdate {
    @PrimaryGeneratedColumn()
    id?: number;

    @Property()
    @Column()
    firstName?: string;

    @Property()
    @Column()
    middleName?: string;

    @Property()
    @Column()
    lastName?: string;

    @Property()
    @Column()
    gender?: string;

    @Property()
    @Column({type: "date"})
    dob?: string;
    
    @Property()
    @Column()
    address?: string
    
    @Property()
    @Column()
    cellphone?: string

    @Column({default: Date.now})
    updatedAt: Date = new Date()

    @Property()
    @Column()
    cityId?: number

    @Property()
    @Column()
    stateId?: number

    @Property()
    @Column()
    countryId?: string    
}
