import { DataTypes, Optional, Model } from 'sequelize';
import sequelize from '../config/db';
import { Snowflake } from '@theinternetfolks/snowflake';
import { log } from 'console';

export interface RoleAttributes {
    id: string;
    name: string;
    scopes: string;
}

export interface RoleInput extends Optional<RoleAttributes, 'id'> { }

export interface RoleOutput extends Required<RoleAttributes> { }

class Role extends Model<RoleAttributes, RoleInput> implements RoleAttributes {
    public id!: string
    public name!: string
    public scopes!: string;

    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;

    // // Getter for scopes
    // public get scopes(): string[] {
    //     return this._scopes.split('|');
    // }

    // // Setter for scopes
    // public set scopes(scopes: string[]) {
    //     this._scopes = scopes.join('|');
    // }
}

Role.init({
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        defaultValue: () => Snowflake.generate().toString(),
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
        unique: true,
        validate: {
            isUnique: async function (value: string) {
                const user = await Role.findOne({ where: { name: value } });
                if (user) {
                    throw new Error('Role already added');
                }
            },
        },
    },
    scopes: {
        type: DataTypes.STRING(100),
        allowNull: false,
        // defaultValue: [],
        // get(): string[] {
        //     const scopesString = this.getDataValue('scopes') as unknown as string;
        //     return scopesString.split('|');
        // }
        // ,
        // set(scopes: string[]) {
        //     return scopes.join('|');
        // }
    },
}, {
    tableName: 'role',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    sequelize: sequelize
});

export default Role;
