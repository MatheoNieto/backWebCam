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
export class Users extends BaseEntity {

  @Field(type=>ID)
  @ObjectIdColumn()
  _id!: ObjectID

  @Field()
  @Column()
  names!:string

  @Field()
  @Column()
  usermail!:string

  @Column()
  password!:string

  @Field()
  @Column()
  type_user!:string

  @Column({default: true})
  active!: boolean;

  @Column({default: 0})
  tokenVersion!: number

  @Field()
  @CreateDateColumn({ type: 'timestamp'})
  createdAt!: Date

  @Field()
  @UpdateDateColumn({ type: 'timestamp'})
  updateAt!: Date

}