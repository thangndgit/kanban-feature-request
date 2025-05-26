import { AdminService } from '../services/_index.js';
import HttpError from '../utils/HttpError';

class AdminController {
  constructor() {
    this.service = AdminService;
  }

  async login(req, res, next) {
    try {
      const { username, password } = req.body;

      if (!username || !password) {
        return next(new HttpError(400, 'Username and password are required'));
      }

      const admins = await this.service.findAll();

      if (admins.length === 0) {
        const defaultPassword = crypto.createHash('sha256').update('matitmui@123').digest('hex');

        await this.service.create({
          username: 'matitmui-admin',
          password: defaultPassword,
          token: crypto.randomBytes(16).toString('hex'),
          role: 'ADMIN',
        });

        return next(new HttpError(400, 'No admin found. Default admin has been created. Please try again.'));
      }

      const encryptedPassword = crypto.createHash('sha256').update(password).digest('hex');

      const admin = admins.find((admin) => admin.username === username && admin.password === encryptedPassword);

      if (!admin) {
        return next(new HttpError(401, 'Invalid username or password'));
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
  }
}

export default new AdminController();

