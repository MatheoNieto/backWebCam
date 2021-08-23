import 'dotenv/config'

// CONFIGURACION GENERAL
export const config: any = {
  default_from_email: process.env.DEFAULT_FROM_EMAIL || 'dulsex68@gmail.com',
  charset: 'UTF-8',
  priceCoin: process.env.PRICECOIN || 0.10
}

// PARA EL SERVIDOR
export const configHost: any = {
  dev: process.env.NODE_ENV == 'production',
  port: process.env.PORT || 3000,
  host: process.env.HOST_NAME || 'http://localhost',
  cors: process.env.CORS,
}

// BASE DE DATOS
export const configDb: any = {
  host_db: process.env.HOST_DB || 'localhost',
  port_db: process.env.PORT_DB || 27017,
  user_db: process.env.USER_DB || 'root',
  password_db: process.env.PASSWORD_DB || '',
  database: process.env.DATABASE || 'db',
}

// PARA LAS AUTHENTICACIONES
export const configAuth:any = {
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
  refress_token_secret: process.env.REFRESS_TOKEN_SECRET,
}

// AMAZON SES
export const configAmazon: any = {
  accessKeyId: process.env.ACCESSKEYID || 'ACCESS_KEY',
  secretAccessKey: process.env.SECRETACCESSKEY || 'SECRET_KEY',
  region: process.env.REGION || 'us-east-1'
}

// AGORA
export const configAgora: any = {
  appId: process.env.APPIDAGORA || 'APP_ID',
  appCertificate: process.env.APPCERTIFICADE || 'CERTIFACATE_AGORA'
}

// EAPAYCO
export const configEpayco: any = {
  publicKey: process.env.PUBLICKEYEPAYCO,
  privateKey: process.env.PRIVATEKEYEPAYCO,
  hostName: process.env.HOSTNAMEEPAYCO,
}

