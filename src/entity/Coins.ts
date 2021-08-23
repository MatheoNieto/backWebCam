import { Field, ObjectType, ID } from 'type-graphql'
import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity
} from 'typeorm'

@ObjectType()
@Entity()
export class Coins extends BaseEntity{

  @Field(type=> ID)
  @ObjectIdColumn()
  _id!: ObjectID

  @Column()
  model?: string;

  @Column()
  client?: string;
  
  @Field()
  @Column()
  coins!: number

  @Field()
  @CreateDateColumn({ type: 'timestamp'})
  createdAt!: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamp'})
  updateAt!: Date
  
}