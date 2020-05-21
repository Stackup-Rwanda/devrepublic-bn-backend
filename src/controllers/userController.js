import db from '../models';
import Response from '../utils/ResponseHandler';
import uploadImage from '../services/uploadImageService';

/**
 * @description User Controller
 * @class UserController
 */
export default class UserController {
  /**
    * @description allows admin  to assign roles
    * @static
    * @param {Object} req
    * @param {Object} res
    * @returns {Object} User
    * @memberof UserController
    * @memberof userController
  */
  static async setRoles(req, res) {
    try {
      const { email, role } = req.body;
      const admin = req.payload;
      const avaiableAdmins = await db.User.findAll({
        where: { role: 'super administrator' }
      });
      if (admin.role !== 'super administrator' || (avaiableAdmins.length === 2 && role === 'super administrator')) {
        return Response.errorResponse(res, 401, res.__('you are not authorised for this operation'));
      }
      const existingUser = await db.User.findOne({
        where: { email }
      });
      if (!existingUser) {
        return Response.errorResponse(res, 404, res.__('The user doesn\'t exist'));
      }
      if (existingUser.role === role) {
        return Response.errorResponse(res, 409, res.__('The user is already a %s', role));
      }

      await db.User.update({ role }, { where: { email }, attributes: ['email', 'role'] });
      return Response.success(res, 200, res.__('User roles updated successfully'));
    } catch (error) {
      return Response.errorResponse(res, 500, res.__(error.message));
    }
  }

  /**
    * @description allows admin  to assign manager to Requester
    * @static
    * @param {Object} req
    * @param {Object} res
    * @returns {Object} User
    * @memberof UserController
    * @memberof userController
  */
  static async assignManager(req, res) {
    try {
      const { id, managerId } = req.body;
      const admin = req.payload;
      if (admin.role !== 'super administrator' || null) {
        return Response.errorResponse(res, 401, res.__('you are not authorised for this operation'));
      }
      const existingUser = await db.User.findOne({
        where: { id }
      });
      const existingManager = await db.User.findOne({
        where: { id: managerId }
      });
      if (!existingUser || !existingManager) {
        return Response.errorResponse(res, 401, res.__('One or both user ID\'s do not exist'));
      }
      if (existingManager.role === 'manager' && existingUser.role !== 'manager') {
        await db.User.update(
          { managerId: existingManager.id, managerName: `${existingManager.firstName} ${existingManager.lastName}` },
          { where: { id }, attributes: ['managerId', 'managerName'] }
        );
        return Response.success(res, 200, res.__('Manager assigned successfully.'));
      }
      return Response.errorResponse(res, 401, res.__('User does not exist or they are not a manager or they are both managers'));
    } catch (error) {
      return Response.errorResponse(res, 500, res.__(error.message));
    }
  }

  /**
    * @description allows user to edit his profile
    * @static
    * @param {Object} req
    * @param {Object} res
    * @returns {Object} User
    * @memberof UserController
  */
  static async editProfile(req, res) {
    try {
      const { email } = req.payload;
      const {
        currency, language, department, birthdate, gender, residence
      } = req.body;
      await db.User.update({
        language,
        currency,
        department,
        birthdate,
        gender,
        residence: residence.toLowerCase(),
      }, {
        where: {
          email
        }
      });
      return Response.success(res, 200, res.__('Profile updated successfully'));
    } catch (error) {
      return Response.errorResponse(res, 500, error.message);
    }
  }

  /**
    * @description allows user to view his profile details
    * @static
    * @param {Object} req
    * @param {Object} res
    * @returns {Object} User
    * @memberof UserController
  */
  static async viewProfile(req, res) {
    try {
      const { id } = req.payload;
      const userProfileData = await db.User.findOne({
        where: { id }, attributes: ['id', 'firstName', 'lastName', 'email', 'emailNotifications', 'isVerified', 'role', 'language', 'currency', 'department', 'gender', 'residence', 'birthdate', 'image']
      });
      return Response.success(res, 200, res.__('User profile details'), userProfileData);
    } catch (error) {
      return Response.errorResponse(res, 500, error.message);
    }
  }

  /**
    * @description allows user to view his profile details
    * @static
    * @param {Object} req
    * @param {Object} res
    * @returns {Object} User
    * @memberof UserController
  */
  static async uploadProfileImage(req, res) {
    try {
      const { email } = req.payload;
      if (!req.file) {
        return Response.errorResponse(res, 400, res.__('Choose an a picture first'));
      }
      const image = req.file;
      const output = await uploadImage(image, req);
      await db.User.update({
        image: output
      }, {
        where: {
          email
        }
      });
      return Response.success(res, 200, res.__('Your image has been uploded successfully'), output);
    } catch (error) {
      return Response.errorResponse(res, 500, error.message);
    }
  }

  /**
    * @description allows admin  to view all users
    * @static
    * @param {Object} req
    * @param {Object} res
    * @returns {Object} User
    * @memberof UserController
  */
  static async getUsers(req, res) {
    try {
      const admin = req.payload;
      if (admin.role !== 'super administrator') {
        return Response.errorResponse(res, 401, res.__('you are not authorised for this operation'));
      }
      const Users = await db.User.findAll({
        attributes: {exclude: ['password'] }});
      return Response.success(res, 200, res.__('Success'), Users);
    } catch (error) {
      return Response.errorResponse(res, 500, res.__(error.message));
    }
  }
}
