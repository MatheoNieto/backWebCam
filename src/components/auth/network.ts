import express from 'express'
import chalk from 'chalk'
import {verify} from 'jsonwebtoken'
import {configAuth} from '../../config/local_settings'
import {Users} from '../../entity/Users'
import { createAccessToken, createRefreshToken } from '../../utils/auth'
import { ObjectID } from 'mongodb'
import { sendRefreshToken } from '../../utils/sendRefreshToken'

const Router = express.Router()

Router.get('/', async (req, res)=>{
  res.send("hellow world")
})

Router.post('/refresh_token', async (req, res)=>{
  const token = req.cookies.fr
  if(!token){
    return res.send({ok: false, accessToken: ''})
  }

  let payload: any = null
  try {
    payload= verify(token, configAuth.refress_token_secret!)

  } catch (err) {
    console.log(chalk.black.bgRed(`[ERROR REFRESH TOKEN]`));
    console.log(err);
    console.log(chalk.black.bgRed(`[ERROR REFRESH TOKEN]`));
    return res.send({ok: false, accessToken: ''})
  }

  // token is valid and we can send back an access
  const user = await Users.findOne({ where: { _id: new ObjectID(payload.userId) } })
  
  if(!user){
    return res.send({ok: false, accessToken: ''})
  }

  if(user.tokenVersion !== payload.tokenVersion){
    return res.send({ok: false, accessToken: ''})
  }

  sendRefreshToken(res, createRefreshToken(user))

  return res.send({ok: true, accessToken: createAccessToken(user)})
  
})

export default Router