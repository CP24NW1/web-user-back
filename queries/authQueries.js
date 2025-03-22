export const getExistUser = `SELECT * FROM user WHERE email = ?`;
export const saveUser = `INSERT INTO user (firstname, lastname, email, DOB, password, is_verify, verification_code) VALUES (?, ?, ?, ?, ?, ?, ?)`;
export const verifyEmailSuccess = `UPDATE user SET is_verify = ? WHERE email = ?`;
export const getUserDetail = `SELECT user_id, firstname, lastname, email, create_at, update_at FROM user WHERE user_id = ?`;
export const getUserRoleQuery = `SELECT u.user_id, u.role_id, r.role FROM user u JOIN role r on u.role_id = r.role_id WHERE u.user_id = ?;`;
export const grantRoleToUser = `UPDATE user SET role_id = ? WHERE user_id = ?`;
