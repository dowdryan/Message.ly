const ExpressError = require("../ExpressError");
const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db")
const bcrypt = require("bcrypt")

/** User class for message.ly */
/** User of the site. */
class User {
  constructor({username, password, first_name, last_name, phone}) {
    this.username = username;
    this.password = password;
    this.first_name = first_name;
    this.last_name = last_name;
    this.phone = phone;
  }

  /** register new user -- returns
   *    {username, password, first_name, last_name, phone}
   */
  static async register({ username, password, first_name, last_name, phone }) {
    let hashedPassword = await bcrypt.hash(password, BCRYPT_WORK_FACTOR);
    const results = await db.query(
      `INSERT INTO users (username, password, first_name, last_name, phone, join_at, last_login_at)
      VALUES ($1, $2, $3, $4, $5, current_timestamp, current_timestamp)
      RETURNING username, password, first_name, last_name, phone`,
      [username, hashedPassword, first_name, last_name, phone]
    );
    return results.rows[0];
  }


  /** Authenticate: is this username/password valid? Returns boolean. */
  static async authenticate(username, password) { //, password 
    const results = await db.query(
      `SELECT password FROM users
      WHERE username=$1`,
      [username])
    let user = results.rows[0]
    return user && await bcrypt.compare(password, user.password)
  }


  /** Update last_login_at for user */
  static async updateLoginTimestamp(username) {
    const results = await db.query(
      `UPDATE users
        SET last_login_at = current_timestamp
        WHERE username=$1
        RETURNING username`,
        [username]);
    if (!results.rows[0]) {
      throw new ExpressError(`No such user: ${username}`, 404);
    }
  }


  /** All: basic info on all users:
   * [{username, first_name, last_name, phone}, ...] */
  static async all() { 
    const results = await db.query(
      `SELECT * FROM users;
      `)
    return results.rows.map(u => new User(u));
  }

  
  /** Get: get user by username
   *
   * returns {username,
   *          first_name,
   *          last_name,
   *          phone,
   *          join_at,
   *          last_login_at } */
  static async get(username) {
    const results = await db.query(
      `SELECT * FROM users
      WHERE username = $1`,
      [username]);
      return results
  }


  /** Return messages from this user.
   *
   * [{id, to_user, body, sent_at, read_at}]
   *
   * where to_user is
   *   {username, first_name, last_name, phone}
   */
  static async messagesFrom(username) {
    const results = await db.query(
      `SELECT * FROM messages
      WHERE from_username=$1`,
      [username]);
      return results
  }

  
  /** Return messages to this user.
   *
   * [{id, from_user, body, sent_at, read_at}]
   *
   * where from_user is
   *   {username, first_name, last_name, phone}
   */
  static async messagesTo(username) {
    const results = await db.query(
      `SELECT * FROM messages
      WHERE to_username=$1`,
      [username]);
      return results
  }
}


module.exports = User;