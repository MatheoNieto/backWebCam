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
export class HistoryTransactions extends BaseEntity{

  @Field(type => ID)
  @ObjectIdColumn()
  _id!: ObjectID

  @Field()
  @Column()
  client?: string;

  @Field()
  @Column()
  model?: string;
  
  @Field()
  @Column({default: 0})
  before_coins!: number

  @Field()
  @Column({default: 0})
  new_coins!: number

  @Field()
  @Column()
  type_trasaction!: string

  @Field()
  @Column()
  medioPayment!: string

  @Field()
  @CreateDateColumn({ type: 'timestamp'})
  createdAt!: Date

  @UpdateDateColumn({ type: 'timestamp'})
  updateAt!: Date
}