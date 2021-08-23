import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import path from 'path'
import router from './network/routes'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import { configHost } from './config/local_settings'

// MIDDLEWARES
import { MyContext } from './utils/MyContext'

export async function startServer() {
  const app = express()

  // middlewares
  app.use(cookieParser())
  // esta en produccion ?
  if (configHost.dev) {
    app.use(morgan('combined'))
  }

  // RUTAS DE LA API CON EXPRESS
  router(app)

  const schema = await buildSchema({
    resolvers: [
      path.join(__dirname, '/resolvers/**/**.ts')
    ],
    validate: false,
  })

  const server = new ApolloServer({
    schema,
    // formatError:(error)=>{
    //   return{
    //     codigo: 'A43',
    //     name: error.name,
    //     message: error.message
    //   }
    // },
    context: ({req, res}) => {
      const ctx: MyContext = {
        req,
        res
      }

      return ctx
      
    },


  })

  server.applyMiddleware({ app, path: '/graphql' })

  return app
}

