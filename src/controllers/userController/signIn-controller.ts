import { Request, Response, NextFunction } from 'express';
import User from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// Signin user
export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        // Check if user with given email exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: 'email',
                        message: 'Please provide a valid email address.',
                        code: 'INVALID_INPUT'
                    }
                ]
            });
        }

        // Check if the password matches the hashed password in the database
        const passwordMatch = await user.checkPassword(password);
        console.log(passwordMatch);
        if (!passwordMatch) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: 'password',
                        message: 'The credentials you provided are invalid.',
                        code: 'INVALID_CREDENTIALS'
                    }
                ]
            });
        }

        // Generate a JWT token and send it back in the response
        const jwt_token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            status: true,
            content: {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at,
                },
                meta: {
                    access_token: jwt_token
                }
            }
        });
    } catch (err) {
        next(err);
    }
};

