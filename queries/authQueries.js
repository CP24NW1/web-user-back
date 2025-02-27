export const getExistUser = `SELECT * FROM user WHERE email = ?`;
export const saveUser = `INSERT INTO user (firstname, lastname, email, DOB, password) VALUES (?, ?, ?, ?, ?)`;
