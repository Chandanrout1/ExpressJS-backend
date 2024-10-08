import bcrypt from "bcrypt";

const saltRounds = 10;

export const hashpassword = (password) => {
    const salt = bcrypt.genSaltSync(saltRounds);
    bcrypt.hashSync(password, salt);
}