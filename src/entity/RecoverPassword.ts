import {Field, ObjectType, ID} from 'type-graphql'
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
export class RecoverPassword extends BaseEntity {

  @Field(type=>ID)
  @ObjectIdColumn()
  _id!: ObjectID

  @Field()
  @Column()
  usermail!:string
  
  @Field()
  @Column()
  code_recover!:string

  @Field()
  @CreateDateColumn({ type: 'timestamp'})
  createdAt!: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamp'})
  updateAt!: Date

}