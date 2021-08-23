import {HistoryTransactions} from '../entity/HistoryTransactions'

export async function registerHistoryTransactions(data:any, type: string){

  try {
    console.log("=>histrory<=")
    if(!data){
      return new Error('Los datos son requeridos')
    }
    
    const dataTransaction = {
      before_coins: data.oldCoins,
      new_coins: data.newCantCoins,
      type_trasaction: type,
      medioPayment: 'PSE'
    }
    const record = HistoryTransactions.create(dataTransaction)
    await record.save()

  } catch (err) {
    console.log(err);
    return err
  }

}