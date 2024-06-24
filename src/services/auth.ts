// Service servem para separar as requisiçoes ao banco de dados 
// do controller, para que caso no futuro seja mudado o tipo de banco de dados
// não precise mudar todo o controler senao somente o service

import { getToday } from "../utils/getToday"

export const validatePassword = (password: string): boolean => {
    const currentPassword = getToday().split('/').join('');
    return password === currentPassword;
}

export const createToken = () => {
    const currentPassword = getToday().split('/').join('');
    return `${process.env.DEFAULT_TOKEN}${currentPassword}`;
}

export const validateToken = (token: string) => {
    const currentToken = createToken();
    return token === currentToken;
}