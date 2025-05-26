import { Admin } from '../models/index.js';
import HttpError from '../utils/HttpError.js';

export const requireRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers['auth-token'];

      if (!token) throw new HttpError(401, 'Unauthorized: Token is missing');

      const matchAdmin = await Admin.findOne({ token });

      if (!matchAdmin) throw new HttpError(401, 'Unauthorized: Invalid token or session');

      if (!roles.includes(matchAdmin.role))
        throw new HttpError(401, `Forbidden: Your token must have one of the following roles: ${roles.join(', ')}`);

      req.admin = matchAdmin;

      next();
      //
    } catch (error) {
      console.error('Verify request failed: ', error);
      return res.status(500).json({ message: error?.message || 'Internal Server Error' });
    }
  };
};

