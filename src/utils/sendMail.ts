import aws from 'aws-sdk'
import { configAmazon, config as configeneral } from '../config/local_settings'

import { emailCodeValidations } from '../templates/emailCodeValidation'

// aws.config.accessKeyId = config.accessKeyId
aws.config.update(configAmazon)
const ses = new aws.SES();
const sender = `Dulsex <${configeneral.default_from_email}>`;


export function sendMail(data: any, typeMail: string) {

  const recipient = "payomatheo@gmail.com";
  let body_html: any
  let subject: any
  

  return new Promise((resolve, reject)=>{
   
    switch(typeMail){

      case 'codeValidation': 
        body_html = emailCodeValidations(data);
        subject= `Verificación de codigo`
        break

      default:
        body_html= false
        subject= false
    }

    if(!body_html || !subject){
      reject('El tipo de correo no existe')
    }

    const params: any = {
      Source: sender,
      Destination: { ToAddresses: [recipient] },
      Message: {
        Subject: {
          Data: subject,
          Charset: configeneral.charset
        },
        Body: {
          Html: {
            Data: body_html,
            Charset: configeneral.charset
          }
        }
      },
    };

    ses.sendEmail(params, function (err, data) {
      if (err) {
        reject(err.message);
      } else {
        resolve(`Email sent! Message ID: ${data.MessageId}`);
      }

    });

  })


}
