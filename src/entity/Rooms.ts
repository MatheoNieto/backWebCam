import {Field, ObjectType, ID} from 'type-graphql'
import {
  Entity,
  ObjectID,
  ObjectIdColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from 'typeorm'

import {Models} from './Models'

@ObjectType()
@Entity()
export class Rooms extends BaseEntity {

  @Field(type=>ID)
  @ObjectIdColumn()
  _id!: ObjectID

  @Field()
  @Column()
  token!:string
  
  @Field()
  @Column()
  name!:string

  @Field()
  @Column()
  categories!:string

  @Field()
  @Column()
  type_room!:string

  @Field()
  @Column({default: '0.00'})
  priceperminute?:string

  @Field()
  @Column()
  model!: string;

  @Column({default: true})
  active!: boolean;

  @Field()
  @CreateDateColumn({ type: 'timestamp'})
  createdAt!: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamp'})
  updateAt!: Date

}