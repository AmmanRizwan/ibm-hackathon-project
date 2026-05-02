import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const PaymentMethod = sequelize.define(
    "PaymentMethod",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        bank_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_holder_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        ifsc: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        account_number: {
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
        tableName: "payment_methods",
        timestamps: true,
    }
)

export { PaymentMethod };

// Made with Bob
