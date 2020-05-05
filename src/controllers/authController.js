import uuid from 'uuid/v4';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import localStorage from 'localStorage';
import db from '../models';
import { provideToken } from '../utils/tokenHandler';
import Response from '../utils/ResponseHandler';
import AuthService from '../services/authService';
import hashPassword from '../utils/hashPassword';
import sendMsg from '../utils/sendEmail';

dotenv.config();

/**
 *
 * @description AuthController Controller
 * @class AuthController
 */
export default class AuthController {
  /**
     * @description Sign up method
     * @static
     * @param {Object} req`
     * @param {Object} res
     * @returns {Object} User
     * @memberof authController
     */
  static async registerUser(req, res) {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body;
      const content = {
        intro: req.__('verification email welcome'),
        instruction: req.__('verification instruction email'),
        text: req.__('verification button'),
        signature: req.__('signature')
      };
      const existingUser = await db.User.findOne({
        where: { email }
      });

      if (existingUser) {
        return Response.errorResponse(res, 409, res.__('Email already exists'));
      }
      const hashedPassword = bcrypt.hashSync(password.trim(), Number(process.env.passwordHashSalt));
      const user = await db.User.create({
        id: uuid(),
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        email,
        password: hashedPassword,
        role: 'requester',
      });
      const token = provideToken(user.id, user.isVerified, email, user.role);
      const link = `http://${process.env.BASE_URL}/api/v1/auth/verification?token=${token}&email=${email}`;
      localStorage.setItem('token', token);
      await sendMsg(email, firstName, content, link);
      return Response.signupResponse(res, 201, res.__('User is successfully registered'), token);
    } catch (error) {
      return Response.errorResponse(res, 500, res.__(`${error.message}`));
    }
  }

  /**
     * @description login method
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} User
     * @memberof AuthController
     */
  static async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await db.User.findOne({
        where: {
          email,
        },
        attributes: ['id', 'email', 'password', 'isVerified', 'role'],
      });
      if (!user) {
        return Response.errorResponse(res, 401, res.__('Incorrect email or password'));
      }
      if (bcrypt.compareSync(password, user.password)) {
        const { id, isVerified, role } = user.dataValues;
        const token = provideToken(id, isVerified, email, role);
        localStorage.setItem('token', token);
        return Response.login(res, 200, res.__('User is successfully logged in'), token);
      }
      return Response.errorResponse(res, 401, res.__('Incorrect email or password'));
    } catch (error) {
      return Response.errorResponse(res, 500, res.__(error.message));
    }
  }

  /**
     * @description Google and Facebook authentication method
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} User is successfully logged in.
     * @returns {Object} User is scucessfilly created
     * @memberof authController
     */
  static async oAuthLogin(req, res) {
    try {
      const profile = { ...req.user };
      const method = profile.provider;
      const { id } = profile;
      const firstName = profile.name.givenName;
      const lastName = profile.name.familyName;
      const email = profile.emails ? profile.emails[0].value : '';

      const oAuthId = req.user.id;
      const isVerified = true;
      const password = 'null';

      const condition = { email: email || null, method: 'google' || 'facebook' };
      const existingUser = await db.User.findOne({
        where: { condition } && { oAuthId }
      });
      const token = provideToken(id, isVerified);
      if (existingUser) {
        return res.redirect(`http://${process.env.FRONTEND_LINK}?token=${token}`);
      }
      await db.User.create({
        id: uuid(),
        email,
        firstName: firstName.toLowerCase(),
        lastName: lastName.toLowerCase(),
        password,
        role: 'requester',
        signupMethod: method,
        oAuthId,
        isVerified: true
      });
      return res.redirect(`http://${process.env.FRONTEND_LINK}?token=${token}`);
    } catch (error) {
      return Response.errorResponse(res, 500, error.message);
    }
  }

  /**
     * @description logout method
     * @static
     * @param {Object} req
     * @param {Object} res
     * @returns {Object} User
     * @memberof AuthController
     */
  static async logout(req, res) {
    localStorage.removeItem('token');
    return Response.login(res, 200, res.__('User is successfully logged out'));
  }

  /**
     * @description forgot password method
     * @static
     * @param {object} req
     * @param {object} res
     * @returns {object} message
     * @memberof authController
     */
  static async forgotPassword(req, res) {
    const { email } = req.body;
    try {
      const user = await db.User.findOne({
        where: {
          email
        }
      });
      if (!user) {
        return Response.errorResponse(res, 404, res.__('user not found on reset'));
      }
      const content = {
        intro: req.__('email intro'),
        instruction: req.__('email instruction'),
        text: req.__('button text'),
        signature: req.__('email signature')
      };
      await AuthService.forgotPassword(user, content);
      return Response.success(res, 200, res.__('check your email to reset your password'));
    } catch (err) {
      return Response.errorResponse(res, 500, res.__('server error'));
    }
  }

  /**
     * @description Reset password controller
     * @static
     * @param {object} req
     * @param {object} res
     * @returns {object} message
     * @memberof authController
     */
  static async resetPassword(req, res) {
    try {
      const { user } = req;
      const { password } = req.body;
      const hashedPassword = hashPassword(password.trim());
      AuthService.resetPassword(user.id, hashedPassword);
      return Response.success(res, 200, res.__('password reset successfully'));
    } catch (err) {
      return Response.errorResponse(res, 500, res.__('server error'));
    }
  }
}
