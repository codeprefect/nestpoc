module.exports = () => {
  process.env.NESTPOC_DB_STORE = 'nestpoc_test';
  process.env.NESTPOC_JWT_PRIVATE_KEY = 'justanylongrandomstring';
  process.env.NESTPOC_AFRICASTALKING_KEY = 'hello';
  process.env.NESTPOC_AFRICASTALKING_USERNAME = 'sandbox';
  process.env.NESTPOC_AFRICASTALKING_SMS_SENDER = 'nestpoc test';
  process.env.NODE_ENV = 'test';
  process.env.NESTPOC_DB_HOST = 'localhost';
  process.env.NESTPOC_PORT = '7000';
  process.env.NESTPOC_DB_USER = 'postgres';
};
