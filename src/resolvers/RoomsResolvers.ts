import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
  ID,
  InputType } from "type-graphql";
import {ObjectID} from 'mongodb'

import chalk from 'chalk'

import {Rooms} from '../entity/Rooms'
import {getManager} from 'typeorm'

import {generateToken} from '../utils/generateTokenSala'
import {isAuth} from '../middlewares/isAuth'
import {MyContext} from '../utils/MyContext'


@InputType()
class RoomInput {
  @Field()
  name!: string

  @Field()
  categories!: string

  @Field()
  type_room!: string

  @Field()
  priceperminute?: string

}

@InputType()
class EndCallInput {
  
  @Field()
  id!: string

}

@ObjectType()
class RoomResponse {
  @Field(type=>ID)
  _id!: ObjectID

  @Field()
  token!:string
  
  @Field()
  name!:string

  @Field()
  categories!:string

  @Field()
  type_room!:string
}

@Resolver()
export class RoomsResolvers{

  // CREATE ROOM
  @Mutation(()=> RoomResponse)
  @UseMiddleware(isAuth)
  async createRoom(
    @Arg('fields',()=>RoomInput) fields: RoomInput,
    @Ctx()  { payload }: MyContext
  ): Promise<RoomResponse>{
    
    try{

    const getRoom = await Rooms.findOne({where: {
      active:true,
      model: payload!.userId
    }})

    if(getRoom){
      throw new Error("Ya tiene una sala creada")
    }
      
      const tokenRoom = await generateToken(fields.name)

      const data = {
        ...fields, 
        model: payload!.userId,
        token: tokenRoom,
        active:true,
      }
      
      const newRoom = Rooms.create(data)

      const roomCreate = await newRoom.save()

      console.log(chalk.black.bgCyan(`[CREATED ROOM]`));
      console.log(newRoom);
      console.log(chalk.black.bgCyan(`[CREATED ROOM]`));

      return roomCreate

    } catch(err){
      console.log(chalk.black.bgRed(`[ERROR CREATED ROOM]`));
      console.log(err);
      console.log(chalk.black.bgRed(`[ERROR CREATED ROOM]`));
      return err
    }
  }

  // END ROOMS
  @Mutation(()=> Boolean)
  async endRoom(
    @Arg('fields', ()=>EndCallInput) fields: EndCallInput
  ){
    try {
      const roomsRepository = getManager().getRepository(Rooms);
      
      const getRoom = await roomsRepository.findOne({where: {
        _id: new ObjectID(fields.id) 
      }})

      if(!getRoom){
        throw new Error('Sala no encontrada')
      }
      getRoom.active = false

      await roomsRepository.save(getRoom);
      
      return true

    } catch (err) {
      console.log(chalk.black.bgRed(`[ERROR END ROOM]`));
      console.log(err);
      console.log(chalk.black.bgRed(`[ERROR END ROOM]`));
      return err
    }
  }
  
  // GET ROOMS
  @Query(()=>[Rooms])
  getRooms(){
    const roomsRepository = getManager().getRepository(Rooms);

    return roomsRepository.find({where: { active: true}})
  }
}