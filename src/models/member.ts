import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/db';
import { Snowflake } from '@theinternetfolks/snowflake';

interface MemberAttributes {
    id: string;
    communityId: string;
    userId: string;
    roleId: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface MemberInput extends Optional<MemberAttributes, 'id'> { }

export interface MemberOutput extends Required<MemberAttributes> { }

class Member extends Model<MemberAttributes, MemberInput> implements MemberAttributes {
    public id!: string
    public communityId!: string
    public userId!: string
    public roleId!: string

    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}


Member.init({
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        defaultValue: () => Snowflake.generate().toString(),
    },
    communityId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'community',
            key: 'id',
        },
    },
    userId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'user',
            key: 'id',
        },
    },
    roleId: {
        type: DataTypes.STRING(20),
        allowNull: false,
        references: {
            model: 'role',
            key: 'id',
        },
    }
}, {
    tableName: 'member',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    sequelize: sequelize
});

export default Member;
