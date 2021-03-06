const bcrypt = require('bcrypt')
const uuid = require('uuid/v4');

module.exports = {
  up: (queryInterface) => queryInterface.bulkInsert(
    'Users',
    [
      {
        id: uuid(),
        firstName: 'Bienjee',
        lastName: 'Bieio',
        email: 'jean@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: false,
        role: 'super administrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        firstName: 'devrepubli',
        lastName: 'devrpo',
        email: 'jdev@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'requester',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        firstName: 'devrepubli',
        lastName: 'devrpo',
        email: 'jeanne@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'requester',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        firstName: 'devrepublicc',
        lastName: 'devrpore',
        email: 'jeannette@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: false,
        role: 'requester',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '0119b84a-99a4-41c0-8a0e-6e0b6c385165',
        firstName: 'Muhoza',
        lastName: 'devrpore',
        email: 'umuhozad@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: false,
        role: 'manager',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuid(),
        firstName: 'devrepubli',
        lastName: 'devrpo',
        email: 'jim@andela.com',
        password: bcrypt.hashSync('Bien@BAR789', Number(process.env.passwordHashSalt)),
        isVerified: true,
        role: 'travel administrator',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    {},
  ),

  down: (queryInterface) => queryInterface.bulkDelete('Users', null, {}),
};
