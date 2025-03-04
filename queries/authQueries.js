export const getExistUser = `SELECT * FROM user WHERE email = ?`;
export const saveUser = `INSERT INTO user (firstname, lastname, email, DOB, password, is_verify, verification_code) VALUES (?, ?, ?, ?, ?, ?, ?)`;
export const verifyEmailSuccess = `UPDATE user SET is_verify = ? WHERE email = ?`;
export const getUserDetail = `SELECT user_id, firstname, lastname, email, create_at, update_at FROM user WHERE user_id = ?`;
