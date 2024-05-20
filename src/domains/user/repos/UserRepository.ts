import db from '../../../infra/db';
import { UserRepository } from '../domains/User';

const userRepository: UserRepository = {
    findByUsername: (username) => db('users').where({ username }).first(),
    create: (user) => db('users').insert(user).returning('*').then(([newUser]) => newUser),
    updateToAdmin: (username) => db('users').where({ username }).update({ isAdmin: true }).returning('*').then(([updatedUser]) => updatedUser)
};

export default userRepository;
