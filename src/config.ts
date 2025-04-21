import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    development: {
      HOST: process.env.HOST,
      PORT: process.env.PORT,
      PORT_DATABASE: parseInt(process.env.PORT_DATABASE),
      USER_DATABASE: process.env.USER_DATABASE,
      PASSWORD_DATABASE: process.env.PASSWORD_DATABASE,
      NAME_DATABASE: process.env.NAME_DATABASE,
    },
    apiKey: process.env.KEY,
    jwtSecret: process.env.JWT_SECRET,
    getApi: {
      kahuaNotification: process.env.KAHUA_NOTIFICATION_API,
    },
  };
});
