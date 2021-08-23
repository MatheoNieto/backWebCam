import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Field,
  InputType,
  ID} from 'type-graphql'
import {hash} from 'bcryptjs'
import chalk from 'chalk'

import {Users} from '../entity/Users'
import {Models} from '../entity/Models'

import {verifyMail} from '../utils/VerifyMail'



@InputType()
class ModelInput {
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
  type_document!: string

  @Field()
  number_dni!: string

  @Field()
  password!: string
}

@InputType()
class ModelUpdateInput {
  @Field(() => String, {nullable: true})
  names?: string;

  @Field(() => String, {nullable: true})
  lastname?: string;

  @Field(() => String, {nullable: true})
  email?: string

  @Field(() => Date, {nullable: true})
  birthdate?: Date

  @Field(() => String, {nullable: true})
  type_document?: string

  @Field(() => String, {nullable: true})
  number_dni?: string
}

@Resolver()
export class ModelsResolvers {
  
  // CREATE MODEL
  @Mutation(()=> Models)
  async createModel(
    @Arg('fields', ()=>ModelInput) fields: ModelInput
  ){
    try {
      const data = {
        ...fields, 
        active:true
      }

      const existModel =await  Models.findOne({
        where: {
          email: fields.email,
          number_dni:fields.number_dni
        }
      })
      
      if(existModel){
        throw new Error('Opps! Model ready exist')
      }
      
      const newModel = Models.create(data)
      console.log(chalk.black.bgCyan(`[CREATED MODEL]`));
      console.log(newModel);
      console.log(chalk.black.bgCyan(`[CREATED MODEL]`));
      
      verifyMail(fields.email)
        .catch((err:any)=>{
          throw new Error(`No es un correo valido ${err.message}`)
        })
      
      const modelcreate = await newModel.save()
      const hashedPassword = await hash(fields.password, 12)

      await Users.insert({
        names: fields.names,
        usermail: fields.email,
        password: hashedPassword,
        type_user: 'model',
        active: true
      })
      
      return modelcreate
      
    } catch (err) {
      console.log(chalk.black.bgRed(`[ERROR CREATED MODEL]`));
      console.log(err);
      console.log(chalk.black.bgRed(`[ERROR CREATED MODEL]`));
      return err
    }
  }
    
  // UPDATE MODEL
  @Mutation(() => Boolean)
  async updateModel(
    @Arg("id", () => ID) id: string,
    @Arg('fields', ()=>ModelUpdateInput) fields: ModelUpdateInput
  ){
    console.log(chalk.black.bgCyan(`[UPDATE MODEL]`));
    console.log(id, fields)
    console.log(chalk.black.bgCyan(`[UPDATE MODEL]`));
    await Models.update({_id:id}, fields )

    return true
  }
  
  // GETS MODELS
  @Query(()=>[Models])
  getModels(){
    return Models.find()
  }
  
  // GET MODEL
  @Query(()=>[Models])
  getModel(){
    return Models.find()
  }


}