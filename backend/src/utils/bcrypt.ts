import bcrypt from "bcrypt";

const hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(12);
    return bcrypt.hashSync(password, salt);
}

const comparePassword = (password: string, hash: string): boolean => {
    return bcrypt.compareSync(password, hash);
}

export {
    hashPassword,
    comparePassword
}