const { USER, PASSWORD, DB_NAME, SALT_ROUNDS } = process.env;
export default keys = {
  username: USER,
  password: PASSWORD,
  database: DB_NAME,
  salt: SALT_ROUNDS
}