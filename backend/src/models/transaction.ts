import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const Transaction = sequelize.define(
    "Transaction",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        payer_bank_account_id: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        payee_bank_account_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payer_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payer_email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payee_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        payee_email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        invoiceId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        transaction_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.ENUM("pending", "completed", "failed", "cancelled"),
            allowNull: false,
            defaultValue: "pending",
        },
    },
    {
        tableName: "transactions",
        timestamps: true,
    }
)

export { Transaction };

// Made with Bob