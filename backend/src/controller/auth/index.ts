import { Request, Response, NextFunction } from "express";
import { throwCustomError } from "../../utils/error";
import { Otp, User } from "../../models";
import { comparePassword, hashPassword } from "../../utils/bcrypt";
import { generateOTP } from "../../utils/generate-otp";
import { sequelize } from "../../config/db";
import { sendEmail } from "../../services/smtp";
import { generateToken } from "../../utils/jwt";

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return throwCustomError(400, "Email and password are required!");
        }

        const user = await User.findOne({ where: { email: email.toLowerCase() }, transaction});

        if (!user) {
            return throwCustomError(400, "Invalid email or password");
        }

        const isPasswordValid = comparePassword(password, user.dataValues.password);

        if (!isPasswordValid) {
            return throwCustomError(400, "Invalid email or password");
        }

        const otp = generateOTP();

        await Otp.create({
            otp,
            email: user.dataValues.email,
            phone: user.dataValues.phone,
            expireAt: new Date(Date.now() + 1000 * 60 * 5),
        },
        { transaction }
        );

        await transaction.commit();

        await sendEmail({
            to: user.dataValues.email,
            subject: "Verify User",
            template: "auth/login",
            context: {
                name: user.dataValues.name,
                otp,
            }
        })

        res.status(200).json({ message: "Please check your email for verification" });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const loginVerify = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { email, otp } = req.body;

        if (!otp) {
            return throwCustomError(400, "OTP is required!");
        }

        if (!email) {
            return throwCustomError(400, "Email is required!");
        }

        const query: Record<string, unknown> = {
            otp,
        }
        if (email) {
            query.email = email.trim().toLowerCase();
        }

        const otpRecord = await Otp.findOne({ where: query, transaction });

        if (!otpRecord) {
            return throwCustomError(400, "Invalid OTP");
        }

        if (otpRecord.dataValues.expireAt < new Date()) {
            return throwCustomError(400, "OTP expired!");
        }

        const userRecord = await User.findOne({ 
            where: { email: otpRecord.dataValues.email },
            transaction
        });

        if (!userRecord) {
            return throwCustomError(400, "Email record not found!");
        }

        await otpRecord.destroy({ transaction });

        await transaction.commit();
        
        const token = generateToken({ id: userRecord.dataValues.id });

        res.status(200).json({
            message: "Login Successfully!",
            data: {
                token
            }
        })
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { name, email, password, phone } = req.body;

        if (!name || !email || !password || !phone) {
            return throwCustomError(400, "All fields are required!");
        }

        const existingUser = await User.findOne({
            where: { email: email.toLowerCase() },
            transaction
        });

        if (existingUser) {
            return throwCustomError(400, "User with this email already exists!");
        }

        const hashedPassword = hashPassword(password);

        const otp = generateOTP();

        await User.create({
            name,
            email: email.toLowerCase(),
            password: hashedPassword,
            phone,
            isVerify: false,
        }, { transaction });

        await Otp.create({
            otp,
            email: email.toLowerCase(),
            phone,
            expireAt: new Date(Date.now() + 1000 * 60 * 5),
        }, { transaction });

        await transaction.commit();

        await sendEmail({
            to: email.toLowerCase(),
            subject: "Verify Your Account",
            template: "auth/signup",
            context: {
                name,
                otp,
            }
        });

        res.status(201).json({ message: "Please check your email for verification" });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const signUpVerify = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { email, otp } = req.body;

        if (!otp) {
            return throwCustomError(400, "OTP is required!");
        }

        if (!email) {
            return throwCustomError(400, "Email is required!");
        }

        const query: Record<string, unknown> = {
            otp,
            email: email.trim().toLowerCase(),
        };

        const otpRecord = await Otp.findOne({ where: query, transaction });

        if (!otpRecord) {
            return throwCustomError(400, "Invalid OTP");
        }

        if (otpRecord.dataValues.expireAt < new Date()) {
            return throwCustomError(400, "OTP expired!");
        }

        const userRecord = await User.findOne({
            where: { email: otpRecord.dataValues.email },
            transaction
        });

        if (!userRecord) {
            return throwCustomError(400, "User not found!");
        }

        await userRecord.update({ isVerify: true }, { transaction });

        await otpRecord.destroy({ transaction });

        await transaction.commit();
        
        const token = generateToken({ id: userRecord.dataValues.id });

        res.status(200).json({
            message: "Account verified successfully!",
            data: {
                token
            }
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const signUpResendOtp = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { email } = req.body;

        if (!email) {
            return throwCustomError(400, "Email is required!");
        }

        const user = await User.findOne({
            where: { email: email.toLowerCase() },
            transaction
        });

        if (!user) {
            return throwCustomError(400, "User not found!");
        }

        if (user.dataValues.isVerify) {
            return throwCustomError(400, "User is already verified!");
        }

        // Delete any existing OTPs for this email
        await Otp.destroy({
            where: { email: email.toLowerCase() },
            transaction
        });

        const otp = generateOTP();

        await Otp.create({
            otp,
            email: user.dataValues.email,
            phone: user.dataValues.phone,
            expireAt: new Date(Date.now() + 1000 * 60 * 5),
        }, { transaction });

        await transaction.commit();

        await sendEmail({
            to: user.dataValues.email,
            subject: "Verify Your Account",
            template: "auth/signup",
            context: {
                name: user.dataValues.name,
                otp,
            }
        });

        res.status(200).json({ message: "OTP resent successfully. Please check your email." });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const forgetEmail = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { email } = req.body;

        if (!email) {
            return throwCustomError(400, "Email is required!");
        }

        const user = await User.findOne({
            where: { email: email.toLowerCase() },
            transaction
        });

        if (!user) {
            return throwCustomError(400, "User not found!");
        }

        if (!user.dataValues.isVerify) {
            return throwCustomError(400, "Email is not verify!");
        }

        // Delete any existing OTPs for this email
        await Otp.destroy({
            where: { email: email.toLowerCase() },
            transaction
        });

        const otp = generateOTP();

        await Otp.create({
            otp,
            email: user.dataValues.email,
            phone: user.dataValues.phone,
            expireAt: new Date(Date.now() + 1000 * 60 * 5),
        }, { transaction });

        await transaction.commit();

        await sendEmail({
            to: user.dataValues.email,
            subject: "Reset Your Password",
            template: "auth/forgot-password",
            context: {
                name: user.dataValues.name,
                otp,
            }
        });

        res.status(200).json({ message: "Please check your email for password reset instructions" });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const forgetVerifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { email, otp } = req.body;

        if (!otp) {
            return throwCustomError(400, "OTP is required!");
        }

        if (!email) {
            return throwCustomError(400, "Email is required!");
        }

        const query: Record<string, unknown> = {
            otp,
            email: email.trim().toLowerCase(),
        };

        const otpRecord = await Otp.findOne({ where: query, transaction });

        if (!otpRecord) {
            return throwCustomError(400, "Invalid OTP");
        }

        if (otpRecord.dataValues.expireAt < new Date()) {
            return throwCustomError(400, "OTP expired!");
        }

        const userRecord = await User.findOne({
            where: { email: otpRecord.dataValues.email },
            transaction
        });

        if (!userRecord) {
            return throwCustomError(400, "User not found!");
        }

        await transaction.commit();

        res.status(200).json({
            message: "OTP verified successfully. You can now reset your password.",
            data: {
                email: userRecord.dataValues.email
            }
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}

export const forgetVerify = async (req: Request, res: Response, next: NextFunction) => {
    const transaction = await sequelize.transaction();
    try {
        const { email, otp, newPassword } = req.body;

        if (!email) {
            return throwCustomError(400, "Email is required!");
        }

        if (!otp) {
            return throwCustomError(400, "OTP is required!");
        }

        if (!newPassword) {
            return throwCustomError(400, "New password is required!");
        }

        const query: Record<string, unknown> = {
            otp,
            email: email.trim().toLowerCase(),
        };

        const otpRecord = await Otp.findOne({ where: query, transaction });

        if (!otpRecord) {
            return throwCustomError(400, "Invalid OTP");
        }

        if (otpRecord.dataValues.expireAt < new Date()) {
            return throwCustomError(400, "OTP expired!");
        }

        const userRecord = await User.findOne({
            where: { email: otpRecord.dataValues.email },
            transaction
        });

        if (!userRecord) {
            return throwCustomError(400, "User not found!");
        }

        const hashedPassword = hashPassword(newPassword);

        await userRecord.update({ password: hashedPassword }, { transaction });

        await otpRecord.destroy({ transaction });

        await transaction.commit();

        res.status(200).json({
            message: "Password reset successfully!"
        });
    }
    catch (err) {
        await transaction.rollback();
        next(err);
    }
}