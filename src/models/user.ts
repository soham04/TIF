import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import bcrypt from 'bcrypt';
import { Snowflake } from '@theinternetfolks/snowflake';

interface UserAttributes {
    id: string;
    name: string;
    email: string;
    password: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface UserInput extends Optional<UserAttributes, 'id'> { }

export interface UserOutput extends Required<UserAttributes> { }

class User extends Model<UserAttributes, UserInput> implements UserAttributes {
    public id!: string
    public name!: string
    public email!: string
    public password!: string

    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
    checkPassword: (password: string) => Promise<boolean>;
}

User.init({
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        defaultValue: () => Snowflake.generate().toString(),
    },
    name: {
        type: DataTypes.STRING(64),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: {
            isEmail: true,
        },
    },
    password: {
        type: DataTypes.STRING(64),
        allowNull: false,
        set(password: string) {
            const saltRounds = 10;
            const salt = bcrypt.genSaltSync(saltRounds);
            const hashedPassword = bcrypt.hashSync(password, salt);
            this.setDataValue('password', hashedPassword);
        },
    },
}, {
    tableName: 'user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    sequelize: sequelize
});

User.prototype.checkPassword = async function (password: string) {
    return bcrypt.compare(password, this.password);
}

export default User;
