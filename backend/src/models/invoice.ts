import { DataTypes } from "sequelize";
import { sequelize } from "../config/db";

const Invoice = sequelize.define(
    "Invoice",
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        invoice_number: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        invoice_date: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
        customer_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        customer_email: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        customer_phone: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        total_amount: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
        payment_status: {
            type: DataTypes.ENUM("pending", "partial", "paid", "overdue", "cancelled"),
            allowNull: false,
            defaultValue: "pending",
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM("draft", "sent", "viewed", "paid", "cancelled"),
            allowNull: false,
            defaultValue: "draft",
        },
        userId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: "users",
                key: "id",
            }
        },
    },
    {
        tableName: "invoices",
        timestamps: true,
    }
);

export { Invoice };

// Made with Bob