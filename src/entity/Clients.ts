
import {Field, ObjectType, ID} from 'type-graphql'
import { 
  BaseEntity,
  ObjectIdColumn,
  ObjectID,
  Column,
  CreateDateColumn,
  UpdateDateColumn, 
  Entity} from 'typeorm'

@ObjectType()
@Entity()
export class Clients extends BaseEntity {

  @Field(type=> ID)
  @ObjectIdColumn()
  _id!: ObjectID;

  @Field()
  @Column()
  names!: string

  @Field()
  @Column()
  lastname!: string

  @Field()
  @Column()
  email!: string

  @Field()
  @Column()
  gender!: string

  @Field()
  @Column()
  birthdate!: Date

  @Column({default: true})
  active!: boolean

  @Field()
  @CreateDateColumn({type: 'timestamp'})
  createAt!: Date

  @Field()
  @UpdateDateColumn({type:'timestamp'})
  updateAt!: Date
}