import { Request, Response, NextFunction } from 'express';
import Role, { RoleInput } from '../../models/role';
import Validator from 'validatorjs';

export default async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;

        const scopes: string[] = ['Admin', 'Manage Community'];

        // Define validation rules
        const rules = {
            name: 'required|string|min:2',
        };

        // Define custom error messages
        const messages = {
            'required.name': 'Name should be at least 2 characters',
            'min.name': 'Name should be at least 2 characters',
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

        console.log((scopes as string[]).join('|'));

        const tmp = (scopes as string[]).join('|')


        const role: RoleInput = {
            name,
            scopes: tmp,
        };

        console.log(role);

        const newRole = await Role.create(role);

        return res.status(200).json({
            status: true,
            content: {
                data: {
                    id: newRole.id,
                    name: newRole.name,
                    created_at: new Date(),
                    updated_at: new Date()
                }
            }
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            status: false,
            errors: [{ message: err.message }]
        });
    }
};
