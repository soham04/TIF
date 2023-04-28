import User from "../../models/user";
import Member from '../../models/member';
import Role from '../../models/role';
import { NextFunction, Request, Response } from "express";


export default  async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offset = (page - 1) * limit;

        const { count, rows } = await Member.findAndCountAll({
            where: { communityId: id },
            limit,
            offset,
            include: [
                { model: User, as: 'user', attributes: ['id', 'name', 'email'] },
                { model: Role, as: 'role', attributes: ['id', 'name'] }
            ],
            order: [['created_at', 'DESC']],
            attributes: ['id', 'communityId', 'created_at']
        });

        const totalPages = Math.ceil(count / limit);

        res.status(200).json({
            status: true,
            content: {
                meta: {
                    total: count,
                    pages: totalPages,
                    page,
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
