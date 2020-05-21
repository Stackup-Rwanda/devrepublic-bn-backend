/**
 * @swagger
 * definitions:
 *   setRoles:
 *     type: object
 *     properties:
 *       email:
 *         type: string
 *         format: email
 *       role:
 *         type: string
 *       required:
 *         - email
 *         - role
 */

/**
 * @swagger
 * /api/v1/users/setRoles:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     name: updateRoles
 *     summary: updates the roles of a user
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: token
 *         in: header
 *       - name: body
 *         in: body
 *         schema:
 *           $ref: '#/definitions/setRoles'
 *           type: object
 *           properties:
 *             email:
 *               type: string
 *             role:
 *               type: string
 *         required:
 *           - email
 *           - role
 *     responses:
 *       '200':
 *             description: User role successfully updated.
 *       '401':
 *             description: Unauthorized.
 *       '409':
 *             description: User roles already set.
 * */

/**
 * @swagger
 * definitions:
 *   profileSettings:
 *     type: object
 *     properties:
 *       language:
 *         type: string
 *       currency:
 *         type: string
 *       department:
 *         type: string
 *       birthdate:
 *         type: string
 *       residence:
 *         type: string
 *       required:
 *         - language
 *         - currency
 *         - department
 *         - birthdate
 *         - gender
 *         - residence
 */

/**
 * @swagger
 * /api/v1/users/edit-profile:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     name: Edit Profile settings
 *     summary: user can edit his/her profile page
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: token
 *         in: header
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *            language:
 *              type: string
 *            currency:
 *              type: string
 *            department:
 *              type: string
 *            birthdate:
 *              type: string
 *            residence:
 *              type: string
 *         required:
 *         - language
 *         - currency
 *         - department
 *         - birthdate
 *         - gender
 *         - residence
 *     responses:
 *       '200':
 *             description: Profile updated successfully.
 *       '401':
 *             description: Unauthorized.
 *       '409':
 *             description: Invalid token.
 * */
/**
 * @swagger
 * definitions:
 *   profile image:
 *     type: object
 *     properties:
 *       image:
 *         type: file
 *       required:
 *         - image
 */

/**
 * @swagger
 * /api/v1/users/edit-profile-image:
 *   post:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     name: upload Profile image
 *     summary: user can edit his/her profile image
 *     produces:
 *       - application/json
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - name: token
 *         in: header
 *       - in: formData
 *         name: image
 *         type: file
 *         schema:
 *           type: file
 *           properties:
 *            image:
 *              type: file
 *         required:
 *         - image
 *     responses:
 *       '200':
 *             description: Your image has been uploded successfully
 *       '401':
 *             description: No token provided.
 *       '400':
 *             description: Choose an a picture first.
 * */
/**
 * @swagger
 * /api/v1/users/view-profile:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     name: View Profile settings
 *     summary:  User can view his/her account Profile
 *     parameters:
 *       - name: token
 *         in: header
 *         schema:
 *           type: string
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     responses:
 *       '200':
 *         description: User profile details
 *       '401':
 *         description: No token provided
 */

/**
 * @swagger
 * definitions:
 *   assignManager:
 *     type: object
 *     properties:
 *       managerId:
 *         type: string
 *       id:
 *         type: string
 *       required:
 *         - managerId
 *         - id
 */

/**
 * @swagger
 * /api/v1/users/assign/manager:
 *   patch:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     name: Assign a Manager
 *     summary: super admin can assign a manager
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: token
 *         in: header
 *       - name: body
 *         in: body
 *         schema:
 *           type: object
 *           properties:
 *            id:
 *              type: string
 *            managerId:
 *              type: string
 *         required:
 *         - id
 *         - managerId
 *     responses:
 *       '200':
 *             description: Manager assigned successfully.
 *       '401':
 *             description: User does not exist or they are not a manager or they are both managers.
 *       '500':
 *             description: server error.
 * */

/**
 * @swagger
 * /api/v1/users/view:
 *   get:
 *     security:
 *       - bearerAuth: []
 *     tags:
 *       - User
 *     name: View all users
 *     summary: Super admininstrator can view all users
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     parameters:
 *       - name: token
 *         in: header
 *     responses:
 *       '200':
 *             description: Success
 *       '401':
 *             description: you are not authorised for this operation
 *       '500':
 *             description: server error.
 * */
