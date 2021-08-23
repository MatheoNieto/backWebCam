// @ts-ignore
import Epayco from 'epayco-sdk-node'
import axios from 'axios'
import { configEpayco, config } from '../config/local_settings'

interface Datos {
  coins: number,
  methodPayment: string,
  bank: string,
  documento: string,
  nombres: string,
  apellidos: string,
  email: string,
  celular?: string
}

export function createTransaccion(data: Datos) {

  return new Promise(async (resolve, reject) => {

    const epayco = Epayco({
      apiKey: configEpayco.publicKey,
      privateKey: configEpayco.privateKey,
      lang: 'ES',
      test: true
    })

    const pse_info = {
      // bank: "1022", //Banco exclusivo para pruebas "Banco Union Colombiano"
      bank: `${data.bank}`, //Banco exclusivo para pruebas "Banco Union Colombiano"
      invoice: `${data.documento}`,
      description: `Compra de coins (${data.coins} coins)`,
      value: `${data.coins * config.priceCoin}`,
      tax: "0",
      tax_base: "0",
      currency: "USD",
      type_person: "0",
      doc_type: "CC",
      doc_number: `${data.documento}`,
      name: `${data.nombres}`,
      last_name: `${data.apellidos}`,
      email: `${data.email}`,
      country: "CO",
      cell_phone: `${(!data.celular) ? '3222368431' : data.celular}`,
      url_response: "https:/secure.payco.co/restpagos/testRest/endpagopse.php",
      url_confirmation: "https:/secure.payco.co/restpagos/testRest/endpagopse.php",
      method_confirmation: "GET",
      extra1: "",
      extra2: "",
      extra3: "",
      extra4: "",
      extra5: "",
      extra6: ""
    }

    epayco.bank.create(pse_info)
      .then(function (data: any) {
        console.log("=>success epayco=>", data);
        resolve(data)
      })
      .catch(function (err: any) {
        console.log("err: " + err);
        reject(err)
      });
  })
}