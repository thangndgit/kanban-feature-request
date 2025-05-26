import { AdminModel } from '../models/_index.js';
import { HttpError } from '../utils/_index.js';

export const requireRoles = (...roles) => {
  return async (req, res, next) => {
    try {
      const token = req.headers['x-admin-token'];

      if (!token) throw new HttpError(401, 'Unauthorized: Token is missing');

      const matchAdmin = await AdminModel.findOne({ token });

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

