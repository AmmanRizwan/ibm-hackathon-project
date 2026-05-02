import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const BillingDetail = sequelize.define(
    "BillingDetail",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        pin: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        isVerify: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            }
        }
    },
    {
        tableName: "billing_details",
        timestamps: true,
    }
)

export { BillingDetail };

// Made with Bob
