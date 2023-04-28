import Community from '../../models/community';
import { Request, Response } from 'express';
import Member from '../../models/member';
import jwt from 'jsonwebtoken';
var Validator = require('validatorjs');

interface TokenData {
    id: string;
    email: string;
}

// Signup user
export default async (req: Request, res: Response) => {
    const { name, slug, owner } = req.body;
    const token = req.headers.authorization.split(' ')[1];

    // Define validation rules
    const rules = {
        name: 'required|string|min:2',
    };

    // Define custom error messages
    const messages = {
        'required.name': 'Name should be at least 2 characters.',
        'min.name': 'Name should be at least 2 characters.',
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
        console.log(token);

        const decoded: TokenData = jwt.verify(token, process.env.JWT_SECRET) as TokenData;
        console.log(decoded);

        if (decoded.id != owner) {
            return res.status(401).json({
                status: false,
                errors: [
                    {
                        message: 'You need to sign in to proceed.',
                        code: 'NOT_SIGNEDIN'
                    }
                ]
            })
        }

        const newCommunity = {
            name,
            slug,
            ownerId: owner,
        };

        console.log(newCommunity);

        const community = await Community.create(newCommunity);

        await Member.create({
            communityId: community.id,
            userId: owner,
            roleId: '7057403484213289414',
        });

        return res.status(200).json({
            status: true,
            content: {
                data: {
                    id: community.id,
                    name: community.name,
                    slug: community.slug,
                    owner: community.ownerId,
                    created_at: community.created_at,
                    updated_at: community.updated_at,
                },
            },
        });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                errors: [
                    {
                        message: 'Your session has expired. Please sign in again.',
                        code: 'SESSION_EXPIRED'
                    }
                ]
            })
        }
        return res.status(500).json({
            status: false,
            errors: [{ message: err.message }]
        });

    }
};

