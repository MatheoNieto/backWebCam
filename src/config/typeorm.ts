import {createConnection} from "typeorm";
import {configDb} from './local_settings'
import path from 'path'
import chalk from 'chalk'

// export const connection: Connection = await createConnection({
// url: `mongodb://mongodb/${configDb.database}`, edsto era una conexion usando lo de docker pero no funciono
export  async function connect(){
  await createConnection({
      // url: `mongodb://admin:adminpass@localhost:27017/dulsex`,
      url: `mongodb+srv://${configDb.user_db}:${configDb.password_db}@${configDb.host_db}/${configDb.database}`,
      type: "mongodb",
      useNewUrlParser: true,
      synchronize: true,
      useUnifiedTopology: true,
      logging: true,
      entities:[
        path.join(__dirname, '/../entity/**/**.ts')
      ],
  })
  .then(()=>{
    console.log(chalk.black.bgMagenta(`[DATABASE] Database is connected`));
  })
  .catch((err)=>{
    console.log(chalk.black.bgMagenta(`[DATABASE] Database is not connected error=> ${err}`));
  })

}
