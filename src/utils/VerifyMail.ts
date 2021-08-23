import aws from 'aws-sdk'
import { configAmazon, config as configeneral } from '../config/local_settings'

aws.config.update(configAmazon)
const ses = new aws.SES();

export function verifyMail(correo: any) {

  return new Promise((resolve, reject) => {
    const params = {
      EmailAddress: correo
    };

    ses.verifyEmailAddress(params, function (err, data) {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    });

  })
}
