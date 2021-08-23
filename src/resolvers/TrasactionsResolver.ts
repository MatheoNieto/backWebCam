import {
  Resolver,
  Query,
  Mutation,
  Arg,
  Field,
  InputType,
  ID, 
  UseMiddleware,
  ObjectType,
  Ctx
} from 'type-graphql'

import {isAuth} from '../middlewares/isAuth'
import {ObjectID} from 'mongodb'

import { Coins } from '../entity/Coins'
import { PaymentMethod } from '../entity/PaymentMethod'
import { MyContext } from '../utils/MyContext'
import {registerHistoryTransactions} from '../utils/historyTransactions'

import axios from 'axios'
import {configEpayco} from '../config/local_settings'

import {createTransaccion} from '../utils/createTransaccion'

@InputType()
class BuyCoinInput {

  @Field()
  coins!: number

  @Field()
  methodPayment!: string

  @Field()
  bank!: string
  @Field()

  documento!: string
  @Field()

  nombres!: string

  @Field()
  apellidos!: string

  @Field()
  email!: string

  @Field()
  celular?: string

}

@InputType()
class methodTranstionInput{

  @Field()
  methodPayment!: string
}

@ObjectType()
class Banks {

  @Field()
  bankCode!: string

  @Field()
  bankName!: string
}

@Resolver()
export class TrasactionsResolver{
  
  @Mutation(()=> Coins )
  @UseMiddleware(isAuth)
  async BuyCoins(
    @Arg('fields', ()=> BuyCoinInput) fields: BuyCoinInput,
    @Ctx() { payload }: MyContext
  ){

    try {
        const query = {
          [`${payload!.typeUser}`]: payload!.userId
        }

        await createTransaccion(fields)

        const getCoins = await Coins.findOne({where: query})

        if(!getCoins){

          const data = {
            [`${payload!.typeUser}`]: payload!.userId,
            coins: fields.coins
          }

          const newCoins = Coins.create(data)
          const coinsCreated = await newCoins.save()

          registerHistoryTransactions({
            [`${payload!.typeUser}`]: payload!.userId,
            oldCoins: 0,
            newCantCoins: fields.coins
          }, 'Compra')
          
          return coinsCreated
        }

        const oldCoins = getCoins.coins
        const newCantCoins = oldCoins + fields.coins

        await Coins.update({_id: getCoins._id }, {
          coins: newCantCoins,
          updateAt: new Date()
        })

        registerHistoryTransactions({
          [`${payload!.typeUser}`]: payload!.userId,
          oldCoins: oldCoins,
          newCantCoins: newCantCoins
        }, 'Compra')
        
        return await Coins.findOne({where: {_id: getCoins._id}})
      
    } catch (err) {
      console.log(err);
      return err
    }
  }

  
  @Mutation(()=> PaymentMethod)
  @UseMiddleware(isAuth)
  async createMethodTransitions(
    @Arg('fields', ()=> methodTranstionInput) fields: methodTranstionInput,
    @Ctx() { payload }: MyContext
  ){
    try {

      const data = {
        ...fields,
        active: true,
        [`${payload!.typeUser}`]: payload!.userId
      }
     
      const newPaymentMethod = PaymentMethod.create(data)
      const paymentMethod = await newPaymentMethod.save()

      return paymentMethod

    } catch (err) {
      console.log(err);
      return err
    }

  }

  @Query(()=>[Banks])
  async getBanks(){
    try {
     const getBancos = await axios.get(`${configEpayco.hostName}pse/bancos.json`,{
        params: {
          public_key: configEpayco.publicKey
        }
      })
      
      return getBancos.data.data
      
    } catch (err) {
      console.log(err);
      return err
    }
  }

  
}