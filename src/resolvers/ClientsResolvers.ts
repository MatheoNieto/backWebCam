import { 
  Resolver,
  Query,
  Mutation,
  Arg,
  Field,
  InputType,
  ID } from "type-graphql";
import chalk from "chalk";
import { hash } from "bcryptjs";

import { Clients } from "../entity/Clients";
import { Users } from "../entity/Users";
import {verifyMail} from '../utils/VerifyMail'


@InputType()
class ClientInput{
  @Field()
  names!: string

  @Field()
  lastname!: string

  @Field()
  email!: string

  @Field()
  gender!: string

  @Field()
  birthdate!: string

  @Field()
  password!: string
}


@InputType()
class ClientUpdateInput{
  @Field(()=> String, {nullable: true})
  names?: string

  @Field(()=> String, {nullable: true})
  lastname?: string

  @Field(()=> String, {nullable: true})
  email?: string

  @Field(()=> String, {nullable: true})
  birthdate?: string

}

@Resolver()
export class ClientsResolvers{

  // CREATE CLIENT
  @Mutation(()=>Clients)
  async createClient(
    @Arg('fields', ()=>ClientInput) fields:ClientInput
  ){
    try {
      const data = {
        ...fields,
        active: true
      }
      
      const existClient = await Clients.findOne({
        where: {
          email: fields.email
        }
      })

      if(existClient){
        throw new Error('Opps! Client ready exist')
      }

      const newClient = Clients.create(data)

      verifyMail(fields.email)
        .catch((err:any)=>{
          throw new Error(`No es un correo valido ${err.message}`)
        })

      const  clientcreate = await newClient.save()
      const hashedPassword = await hash(fields.password, 12)

      await Users.insert({
        names: fields.names,
        usermail: fields.email,
        password: hashedPassword,
        type_user: 'client',
        active: true
      })

      return clientcreate

    } catch (err) {
        console.log(chalk.black.bgRed(`[ERROR CREATE CLIENT]`))
        console.log(err)
        console.log(chalk.black.bgRed(`[ERROR CREATE CLIENT]`))
        return err
    }
  }

  // UPDATE CLIENT
  @Mutation(()=>Boolean)
  async updateClient(
    @Arg('id',()=>ID) id:string,
    @Arg('fields', ()=>ClientUpdateInput) fields: ClientUpdateInput
  ){
    console.log(chalk.black.bgCyan(`[UPDATE CLIENT]`));
    console.log(id, fields)
    console.log(chalk.black.bgCyan(`[UPDATE CLIENT]`));
    await Clients.update({_id:id}, fields )

    return true
  }

  // GETS CLIENTS
  @Query(()=>[Clients])
  getClients(){
    return Clients.find()
  }

  // GET CLIENTS
   @Query(()=>[Clients])
   getClient(){
     return Clients.find()
   }
}

