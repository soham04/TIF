import { NextFunction, Request, Response } from 'express';
import Community from '../../models/community';
import User from '../../models/user';

export default async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string, 10) || 1;
        const limit = parseInt(req.query.limit as string, 10) || 10;
        const offset = (page - 1) * limit;
        const { count, rows } = await Community.findAndCountAll({
            limit,
            offset,
            attributes: ['id', 'name', 'slug', 'created_at', 'updated_at'],
            include: [
                {
                    model: User,
                    as: 'owner',
                    attributes: ['id', 'name'],
                },
            ],
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: totalPages,
                    page: page,
                },
                data: rows,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};