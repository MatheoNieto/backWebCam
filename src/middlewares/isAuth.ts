import { MiddlewareFn } from "type-graphql"
import {verify} from 'jsonwebtoken'
import {configAuth as config} from '../config/local_settings'
import { MyContext } from "../utils/MyContext"
import chalk from 'chalk'

// bearer 102930ajslkdaoq01
export const isAuth: MiddlewareFn<MyContext> = async ({ context }, next) => {

  const authorization = context.req.headers["authorization"];

  if (!authorization) {
    throw new Error("not authenticated");
  }


  try {
    const token = authorization.split(" ")[1];
    const payload = verify(token, config.access_token_secret!);
    context.payload = payload as any;
  } catch (err) {
    console.log(chalk.black.bgRed(`[ERROR ISAUTH]`));
    console.log(err);
    console.log(chalk.black.bgRed(`[ERROR ISAUTH]`));
    throw new Error("not authenticated");
  }

  return next();
};

