import { Request, Response } from 'express';
import User from '../../models/user';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Community from '../../models/community';
import Member from '../../models/member';
import Role from '../../models/role';
const uid = require("../../config/snowflake").uid

interface TokenData {
    id: string;
    email: string;
}

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);

export default async (req: Request, res: Response) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded: TokenData = jwt.verify(token, process.env.JWT_SECRET) as TokenData;
        const memberId = req.params.id;

        const member = await Member.findByPk(memberId, {
            include: [
                { model: Community, as: 'community', attributes: ['id', 'name', 'ownerId'] },
                { model: Role, as: 'role', attributes: ['id', 'name'] }
            ]
        });

        if (!member) {
            return res.status(400).json({
                status: false,
                errors: [{ message: 'Member not found.', code: 'RESOURCE_NOT_FOUND' }]
            });
        }
        console.log(decoded.id);
        const admin = await Member.findOne({ where: { userId: decoded.id } });

        if (!(admin.roleId == '7057403484213289414' || admin.roleId == "7055289088085136384")) {
            return res.status(400).json({
                status: false,
                errors: [{
                    message: 'You are not authorized to perform this action.',
                    code: 'NOT_ALLOWED_ACCESS'
                }]
            });
        }

        await member.destroy();

        return res.status(200).json({
            status: true,
        });
    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).json({
                status: false,
                errors: [
                    {
                        message: 'You are not authorized to perform this action.',
                        code: 'SESSION_EXPIRED'
                    }
                ]
            });
        }

        console.error(error);
        return res.status(500).json({ message: 'Internal server Error.' });
    }
}

