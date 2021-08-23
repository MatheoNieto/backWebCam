//  TypeGraphQL. This library automatically generates TS and GraphQL types for you (and I highly recommend taking a look at it).
import { Field, ObjectType, ID } from 'type-graphql'
import {
    Entity,
    ObjectID,
    ObjectIdColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity} from "typeorm";

@ObjectType()
@Entity()
export class Models extends BaseEntity {

    @Field(type => ID)
    @ObjectIdColumn()
    _id!: ObjectID;
    
    @Field()
    @Column()
    names!: string;
    
    @Field()
    @Column()
    lastname!: string;

    @Field()
    @Column()
    email!: string;

    @Field()
    @Column()
    gender!: string

    @Field()
    @Column()
    birthdate!: Date;

    @Field()
    @Column()
    type_document!: string;

    @Field()
    @Column()
    number_dni!: string;

    @Column({default: true})
    active!: boolean;

    @Field()
    @CreateDateColumn({ type: 'timestamp'})
    createdAt!: Date

    @Field()
    @UpdateDateColumn({ type: 'timestamp'})
    updateAt!: Date
    
}