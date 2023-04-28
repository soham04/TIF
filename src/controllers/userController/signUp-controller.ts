import { Request, Response } from 'express';
import User from '../../models/user';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import Validator from 'validatorjs';


// Signup user
export default async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // Define validation rules
    const rules = {
        name: 'required|string|min:2',
        email: 'required|email',
        password: 'required|min:6'
    };

    // Define custom error messages
    const messages = {
        'required.name': 'Please provide a name.',
        'required.email': 'Please provide an email address.',
        'email.email': 'Please provide a valid email address.',
        'required.password': 'Please provide a password.',
        'min.name': 'Name should be at least 2 characters',
        'min.password': 'Password should be at least 2 characters.'
    };

    // Validate request data
    const validation = new Validator(req.body, rules, messages);

    if (validation.fails()) {
        const errors = validation.errors.all();

        return res.status(400).json({
            status: false,
            errors: Object.keys(errors).map(field => ({
                param: field,
                message: errors[field][0],
                code: 'INVALID_INPUT'
            }))
        });
    }

    try {
        // Check if user with provided email already exists
        const existingUser = await User.findOne({
            where: {
                email: { [Op.eq]: email }
            }
        });

        if (existingUser) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: 'email',
                        message: 'User with this email already exists.',
                        code: 'RESOURCE_EXISTS'
                    }
                ]
            });
        }

        // Create new user
        const newUser = await User.create({
            name,
            email,
            password
        });

        const jwt_token = jwt.sign(
            { id: newUser.id, email: newUser.email },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        return res.status(200).json({
            status: true,
            content: {
                data: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email,
                    created_at: new Date()
                },
                meta: {
                    access_token: jwt_token
                }
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            errors: [{ message: 'Internal Server Error.' }]
        });
    }
};

