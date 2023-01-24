import { Router, Request, Response } from 'express';
import { User, UserStore } from '../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OrderStore } from '../models/order';
import { verifyAuthToken } from '../middlewares/verifyUser';

const store = new UserStore();
const userRouter = Router();

const papper = process.env.BCRYPT_PASSWORD;
const saltRounds = process.env.SALT_ROUNDS;

userRouter.get('/', verifyAuthToken, async (_req: Request, res: Response) => {
  try {
    const users = await store.getUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json(error);
  }
});

userRouter.get('/:id', verifyAuthToken, async (req: Request, res: Response) => {
  try {
    const user = await store.getSingleUser(+req.params.id);
    if (user) {
      return res.status(200).json(user);
    }
    return res
      .status(404)
      .json({ Error: `User with id ${req.params.id} not found.` });
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

userRouter.post('/', async (req: Request, res: Response) => {
  try {
    const user: User = req.body;

    // Check whether one of the required parameters are missed.
    if (!user.username || !user.password || !user.firstName) {
      return res
        .status(400)
        .json({ Error: 'username, firstName, and password must be provided' });
    }

    // Get all users from the database.
    const allUsers = await store.getUsers();
    // Get a user which was already registered with that username.
    const checkUser = allUsers.filter((u) => user.username === u.username);
    // Check if the user exists

    if (checkUser.length) {
      return res
        .status(400)
        .json({ Message: 'Username already taken, try another username' });
    }

    // Hash the password.
    const passwordDigest = await bcrypt.hashSync(
      (user.password as unknown as string) + papper,
      Number(saltRounds)
    );

    // Create a new user
    const newUser = await store.createUser({
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
      password: passwordDigest
    });

    let token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      String(process.env.JWT_SECRET)
    );
    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ Error: error });
  }
});

userRouter.delete(
  '/:id',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    const deletedUser = await store.deleteUser(+req.params.id);
    if (deletedUser) {
      return res.status(200).json({ DeletedUserId: deletedUser.id });
    }
    return res
      .status(404)
      .json({ Error: `User with id ${req.params.id} not found.` });
  }
);

// Get current orders made by a user.
userRouter.get(
  '/:id/orders',
  verifyAuthToken,
  async (req: Request, res: Response) => {
    try {
      const orders = await new OrderStore().getOrderByUser(+req.params.id);
      if (orders) {
        return res.status(200).json(orders);
      }
      return res
        .status(404)
        .json({ Error: `User with id ${req.params.id} not found.` });
    } catch (error) {
      res.status(500).json({ Error: error });
    }
  }
);

export default userRouter;
