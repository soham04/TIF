import { Request, Response } from 'express';
import User from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Community from '../../models/community';
import Member from '../../models/member';
import Role from '../../models/role';

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

export default async (req: Request, res: Response) => {
    try {
        const body = req.body;
        let communityId = body.community
        let roleId = body.role
        let userId = body.user

        const token = req.headers.authorization.split(' ')[1];
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

        // Check if community exists
        let community = await Community.findByPk(communityId);
        if (!community) {
            return res.status(400).json({
                status: false,
                errors: [{
                    param: 'community',
                    message: 'Community not found.',
                    code: 'RESOURCE_NOT_FOUND'
                }]
            });
        }

        // Check if user is authorised exists
        community = await Community.findByPk(communityId);
        console.log(decoded.id);
        console.log(community.ownerId);
        if (community.ownerId != decoded.id) {
            return res.status(400).json({
                status: false,
                errors: [{
                    message: 'You are not authorized to perform this action.',
                    code: 'NOT_ALLOWED_ACCESS'
                }]
            });
        }

        // Check if role exists
        const role = await Role.findByPk(roleId);
        if (!role) {
            return res.status(400).json({
                status: false,
                errors: [{
                    param: 'role',
                    message: 'Role not found.',
                    code: 'RESOURCE_NOT_FOUND'
                }]
            });
        }


        // Check if user exists
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        param: 'user',
                        message: 'User not found.',
                        code: 'RESOURCE_NOT_FOUND',
                    },
                ],
            });
        }

        // Check if member already exists
        const memberExists = await Member.findOne({
            where: { userId: userId, communityId: communityId },
        });
        if (memberExists) {
            return res.status(400).json({
                status: false,
                errors: [
                    {
                        message: 'User is already added in the community.',
                        code: 'RESOURCE_EXISTS',
                    },
                ],
            });
        }

        // Add member to community
        const member = await Member.create({
            roleId,
            userId,
            communityId,
        });

        return res.status(201).json({
            status: true,
            content: {
                data: {
                    id: member.id,
                    community: member.communityId,
                    user: member.userId,
                    role: member.roleId,
                    created_at: new Date(),
                },
            },
        });

    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                status: false,
                errors: [
                    {
                        message: 'Error with the to.',
                        code: 'SESSION_EXPIRED'
                    }
                ]
            });
        }

        console.error(error);
        return res.status(500).json({ message: 'Internal server Error.' });
    }
}