import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../config/db';
import { Snowflake } from '@theinternetfolks/snowflake';

interface CommunityAttributes {
    id: string;
    name: string;
    slug: string;
    ownerId: string;
    created_at?: Date;
    updated_at?: Date;
}

export interface CommunityInput extends Optional<CommunityAttributes, 'id'> { }

export interface CommunityOutput extends Required<CommunityAttributes> { }

class Community extends Model<CommunityAttributes, CommunityInput> implements CommunityAttributes {
    public id!: string
    public name!: string
    public slug!: string
    public ownerId!: string

    // timestamps!
    public readonly created_at!: Date;
    public readonly updated_at!: Date;
}

Community.init({
    id: {
        type: DataTypes.STRING(20),
        primaryKey: true,
        allowNull: false,
        defaultValue: () => Snowflake.generate().toString(),
    },
    name: {
        type: DataTypes.STRING(128),
        allowNull: false,
        validate: {
            isUnique: async function (value: string) {
                const user = await Community.findOne({ where: { name: value } });
                if (user) {
                    throw new Error('Community with given name already added');
                }
            },
        },
    },

    slug: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    ownerId: {
        type: DataTypes.STRING(20),
        allowNull: false,
    },
}, {
    tableName: 'community',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    sequelize: sequelize
});

export default Community;
