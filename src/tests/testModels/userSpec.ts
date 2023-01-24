import { User, UserStore } from '../../models/user';

const userStore = new UserStore();

describe('Test suite for UserStore model', () => {
  it('Expect the getUsers method to be defined', () => {
    expect(userStore.getUsers).toBeDefined();
  });
  it('Expect the getSignleUser method to be defined', () => {
    expect(userStore.getSingleUser).toBeDefined();
  });
  it('Expect the deleteUser method to be defined', () => {
    expect(userStore.deleteUser).toBeDefined();
  });
  it('Expect the creatseUser method to be defined', () => {
    expect(userStore.createUser).toBeDefined();
  });
  it('getUsers method should get all users from the database', async () => {
    const allUsers = await userStore.getUsers();
    expect(allUsers.length).toEqual(1);
  });
  it('createUser method should create a new user', async () => {
    const user: User = {
      username: 'eleccrazy',
      firstName: 'Jhon',
      lastName: 'Doe',
      password: 'password'
    };
    const newUser: User = await userStore.createUser(user);
    expect(newUser.id).toEqual(2);
  });
  it('getSingleUser method should retrieve a single user from the database based on its id', async () => {
    const user: User = await userStore.getSingleUser(1);
    expect(user.id).toBe(1);
  });
  it('deleteUser method should delete a user from the database based on its id', async () => {
    await userStore.deleteUser(2);
    const allUsers: User[] = await userStore.getUsers();
    expect(allUsers.length).toEqual(1);
  });
});
