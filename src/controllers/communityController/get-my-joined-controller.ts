import User from "../../models/user";
import Member from '../../models/member';
import Role from '../../models/role';
import jwt from 'jsonwebtoken';
import Community from '../../models/community';
import { NextFunction, Request, Response } from "express";

interface TokenData {
    id: string;
    email: string;
}

export default async (req: Request, res: Response, next: NextFunction) => {
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

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const members = await Member.findAll({
            where: { userId: decoded.id },
            attributes: ['communityId'],
            limit,
            offset,
        });

        const communityIds = members.map((m) => m.communityId);

        console.log(communityIds);

        const communities = await Community.findAndCountAll({
            where: { id: communityIds },
            limit,
            offset,
            include: [{ model: User, as: 'owner', attributes: ['id', 'name'] }],
        });

        const totalPages = Math.ceil(communities.count / limit);

        const response = {
            status: true,
            content: {
                meta: {
                    total: communities.count,
                    pages: totalPages,
                    page: page
                },
                data: communities.rows
            }
        };

        res.status(200).json(response);
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
};
