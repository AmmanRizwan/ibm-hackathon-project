import { User } from "./user";
import { BillingDetail } from "./billing_detail";
import { PaymentMethod } from "./payment_method";
import { Invoice } from "./invoice";
import { Transaction } from "./transaction";

// User <-> BillingDetail (One-to-Many)
User.hasMany(BillingDetail, {
    foreignKey: "userId",
    as: "billingDetails",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

BillingDetail.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

// User <-> PaymentMethod (One-to-Many)
User.hasMany(PaymentMethod, {
    foreignKey: "userId",
    as: "paymentMethods",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

PaymentMethod.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

// User <-> Invoice (One-to-Many)
User.hasMany(Invoice, {
    foreignKey: "userId",
    as: "invoices",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Invoice.belongsTo(User, {
    foreignKey: "userId",
    as: "user",
});

// Invoice <-> Transaction (One-to-Many)
Invoice.hasMany(Transaction, {
    foreignKey: "invoiceId",
    as: "transactions",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
});

Transaction.belongsTo(Invoice, {
    foreignKey: "invoiceId",
    as: "invoice",
});

// PaymentMethod <-> Transaction (One-to-Many for Payer)
PaymentMethod.hasMany(Transaction, {
    foreignKey: "payer_bank_account_id",
    as: "payerTransactions",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
});

Transaction.belongsTo(PaymentMethod, {
    foreignKey: "payer_bank_account_id",
    as: "payerBankAccount",
});

// PaymentMethod <-> Transaction (One-to-Many for Payee)
PaymentMethod.hasMany(Transaction, {
    foreignKey: "payee_bank_account_id",
    as: "payeeTransactions",
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
});

Transaction.belongsTo(PaymentMethod, {
    foreignKey: "payee_bank_account_id",
    as: "payeeBankAccount",
});

export { User, BillingDetail, PaymentMethod, Invoice, Transaction };

// Made with Bob
