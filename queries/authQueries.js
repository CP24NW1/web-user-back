export const getExistUser = `SELECT * FROM user WHERE email = ?`;
export const saveUser = `INSERT INTO user (firstname, lastname, email, DOB, password, is_verify, verification_code) VALUES (?, ?, ?, ?, ?, ?, ?)`;
export const verifyEmailSuccess = `UPDATE user SET is_verify = ? WHERE email = ?`;
