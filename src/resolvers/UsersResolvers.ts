import {
  Resolver,
  Query,
  Arg,
  Mutation,
  Field,
  InputType,
  ObjectType,
  Ctx,
  UseMiddleware} from 'type-graphql'

import {compare, hash} from 'bcryptjs'
import moment from 'moment'
import chalk from 'chalk'
import { getConnection, getManager } from "typeorm"
import { ObjectID } from 'mongodb'
import {verify} from 'jsonwebtoken'


import {Users} from '../entity/Users'
import {RecoverPassword} from '../entity/RecoverPassword'

import {MyContext} from '../utils/MyContext'
import { createRefreshToken, createAccessToken } from '../utils/auth'
import { isAuth } from '../middlewares/isAuth'
import { sendRefreshToken } from '../utils/sendRefreshToken'
import { sendMail } from '../utils/sendMail'
import { configAuth } from '../config/local_settings'



@InputType()
class LoginInput {
  
  @Field()
  usermail!: string

  @Field()
  password!: string
}

@InputType()
class generateCodeInput {
  
  @Field()
  usermail!: string

}

@InputType()
class recoverPasswordInput {
  
  @Field()
  usermail!: string

  @Field()
  code_validation!: string

  @Field()
  password!: string

}

@ObjectType()
class LoginResponse {
  @Field()
  accessToken!: string
}

@Resolver()
export class UsersResolvers{

  // INGRESAR O LOGIN
  @Mutation(()=> LoginResponse)
  async login(
    @Arg('fields', ()=>LoginInput) fields: LoginInput,
    @Ctx() { res }: MyContext
  ): Promise<LoginResponse> {
    
    const user = await Users.findOne({where: {usermail: fields.usermail}})

    if(!user){
      throw new Error('El usuario no fue encontrado')
    }

    const valid = await compare(fields.password, user.password)

    if(!valid){
      throw new Error('Contraseña incorrecta')
    }

    // login successful
    // esto es para crear el token de la session en la cookie
    sendRefreshToken(res, createRefreshToken(user))
    
    return {
      accessToken: createAccessToken(user)
    }
  }

  // ACTUALIZAR EL TOKEN
  @Mutation(()=> Boolean)
  async revokeRefreshTokensForUser(
    @Arg('userId',()=>String) userId: string
  ){
    await getConnection()
    .getRepository(Users)
    .increment({_id: new ObjectID(userId) }, "tokenVersion", 1);

    return true

  }

  // GENERAR EL CODE PARA RECUPERAR LA CONTRASEÑA
    @Mutation(()=> RecoverPassword)
    async generateCoderRecover(
      @Arg('fields',()=>generateCodeInput) fields: generateCodeInput
    ){
      try{
        
        const user = await Users.findOne({where: {usermail: fields.usermail}})

        if(!user){
          throw new Error('Usuario no encontrado')
        }

        const code_recover = Math.random().toString(36).substring(7);

        const data={
          ...fields,
          code_recover,
        }

        sendMail(data, 'codeValidation')
          .catch((err)=>{
            throw new Error(err)
          })

        const newCoder = RecoverPassword.create(data)
        const coderCreate = await newCoder.save()

        return coderCreate
        
      }catch(err){
        console.log(chalk.black.bgRed(`[ERROR GENERATE CODE]`));
        console.log(err);
        console.log(chalk.black.bgRed(`[ERROR GENERATE CODE]`));
        return err
      }
    }

  // GENERAR EL CODE PARA RECUPERAR LA CONTRASEÑA
  @Mutation(()=> LoginResponse)
  async RecoverPassword(
    @Arg('fields', ()=>recoverPasswordInput) fields: recoverPasswordInput,
    @Ctx() { res }: MyContext
  ) {
      const userRepository = getManager().getRepository(Users);
      
      const recoverCoder = await RecoverPassword.findOne({where: {
        usermail: fields.usermail,
        code_recover: fields.code_validation
      }})

      if(!recoverCoder){
        throw new Error('Bad code')
      }

      const diferencia = moment().diff(moment(recoverCoder.createdAt), 'm')

      if (diferencia> 30){
        throw new Error('The code expiration')
      }

      const hashedPassword = await hash(fields.password, 12)


      const data = {
        password: hashedPassword
      }
      
      await userRepository.update({usermail: fields.usermail }, data)
      
      const user = await userRepository.findOne({where: {usermail: fields.usermail}})


      sendRefreshToken(res, createRefreshToken(user))
      
      return {
        accessToken: createAccessToken(user)
      }

      
    }

    @Query(() => Users, { nullable: true })
    me(@Ctx() context: MyContext) {
      const authorization = context.req.headers["authorization"];
  
      if (!authorization) {
        return null;
      }
  
      try {
        const token = authorization.split(" ")[1];
        const payload: any = verify(token, configAuth.access_token_secret!);
        return Users.findOne(payload.userId);
      } catch (err) {
        console.log(err);
        return null;
      }
    }


  @Query(()=>String)
  @UseMiddleware(isAuth)
  bye(
    @Ctx() { payload }: MyContext
  ){
    console.log(chalk.black.bgCyan(`[PAYLOAD]`));
    console.log(payload);
    console.log(chalk.black.bgCyan(`[PAYLOAD]`));
    return `Your user id is: ${payload!.userId}`
  }

}