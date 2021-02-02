import { MaxLength } from '@tsed/schema';
import { Format, Property } from '@tsed/schema';
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Account' })
export class Account {

    @Property()
    @PrimaryGeneratedColumn()
    id: number;

    @Property()
    @Column()
    @MaxLength(255)
    username: string;

    @Property()
    @Column()
    @MaxLength(255)
    password: string;

    @Column()
    @Property()
    isVerified: boolean;

    @Column()
    @Property()
    isActive: boolean;

    @Column()
    @Property()
    profilePhotoUrl: string;

    @Column({ type: "datetime" })
    @Format('date-time')
    @Property()
    createdAt: string

    @Column({ type: "datetime" })
    @Format('date-time')
    @Property()
    updatedAt: string

    @Column({ type: "datetime" })
    @Format('date-time')
    @Property()
    lastlogin: string
}
