import {RtcTokenBuilder, RtcRole} from 'agora-access-token'
import { configAgora } from '../config/local_settings'


export function generateToken(nameCanal:string){

  try {

    const appID = configAgora.appId;
    const appCertificate = configAgora.appCertificate;
    const uid = 0;
    const role = RtcRole.PUBLISHER;

    const expirationTimeInSeconds = 3600
    const currentTimestamp = Math.floor(Date.now() / 1000)
    const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds
    
    if(!nameCanal){
      throw new Error('El nombre de la sala es requerido.')
    }
    
    const token = RtcTokenBuilder.buildTokenWithUid(appID, appCertificate, nameCanal, uid, role, privilegeExpiredTs);
  
    return token

  } catch (err) {
    return err
  }
 



}