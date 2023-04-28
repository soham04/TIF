import { Request, Response } from 'express';
import User from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

interface TokenData {
    id: string;
    email: string;
}

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

// Get authenticated user details
export default async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded: TokenData = jwt.verify(token, process.env.JWT_SECRET) as TokenData;

        console.log(decoded);
        
        const user = await User.findOne({
            where: {
                id: decoded.id
            },
            attributes: ['id', 'name', 'email', 'created_at']
        });

        if (!user) {
            return res.status(401).json({
                status: false,
                errors: [
                    {
                        message: 'You need to sign in to proceed.',
                        code: 'NOT_SIGNEDIN'
                    }
                ]
            });
        }
        return res.status(200).json({
            status: true,
            content: {
                data: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    created_at: user.created_at
                }
            }
        });
    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                status: false,
                errors: [
                    {
                        message: 'Your session has expired. Please sign in again.',
                        code: 'SESSION_EXPIRED'
                    }
                ]
            });
        }

        console.error(error);
        return res.status(500).json({ message: 'Internal server Error.' });
    }
}

