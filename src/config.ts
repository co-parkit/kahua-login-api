import { registerAs } from '@nestjs/config';

export default registerAs('config', () => {
  return {
    database: {
      HOST: process.env.HOST,
      PORT_DATABASE: parseInt(process.env.PORT_DATABASE),
      USER_DATABASE: process.env.USER_DATABASE,
      PASSWORD_DATABASE: process.env.PASSWORD_DATABASE,
      NAME_DATABASE: process.env.NAME_DATABASE,
    },
    apiKey: process.env.KEY,
  };
});
