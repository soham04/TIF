import { Request, Response, NextFunction } from 'express';
import Role from '../../models/role';

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page: number = parseInt(req.query.page as string) || 1;
        const limit: number = parseInt(req.query.limit as string) || 10;
        const offset: number = (page - 1) * limit;

        const { count, rows } = await Role.findAndCountAll({
            limit,
            offset,
            attributes: ['id', 'name', 'created_at', 'updated_at'],
        });

        const totalPages: number = Math.ceil(count / limit);

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
    } catch (err: any) {
        console.error(err);
        res.status(500).json({
            status: false,
            message: 'Internal server error',
        });
    }
};
