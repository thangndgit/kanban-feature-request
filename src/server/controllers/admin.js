import crypto from 'crypto';
import { Admin } from '../models/index.js';
import HttpError from '../utils/HttpError.js';

export default {
  login: async (req, res, next) => {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(new HttpError(400, 'Username and password are required'));
    }

    const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex');

    try {
      const admins = await Admin.find();

      if (admins.length === 0) {
        const defaultPassword = crypto.createHash('sha256').update('matitmui@123').digest('hex');
        const newAdmin = new Admin({
          username: 'matitmui-admin',
          password: defaultPassword,
          token: crypto.randomBytes(16).toString('hex'),
          role: 'ADMIN',
        });

        await newAdmin.save();
        throw new HttpError(400, 'No admin found. Default admin has been created. Please try again.');
      }

      const admin = admins.find((admin) => admin.username === username && admin.password === encryptedPassword);

      if (!admin) {
        throw new HttpError(401, 'Invalid username or password');
      }

      res.status(200).json({
        status: 'OK',
        message: 'Login successful',
        data: {
          username: admin.username,
          token: admin.token,
          role: admin.role,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
