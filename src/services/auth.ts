// Services are used to separate database requests from the controller,
// so that if the database type is changed in the future,
// only the service needs to be updated, not the entire controller.

import { getToday } from "../utils/getToday"

// Validate the password by comparing it with today's date
export const validatePassword = (password: string): boolean => {
    const currentPassword = getToday().split('/').join(''); // Convert today's date to a password format
    return password === currentPassword;
}

// Create a token using today's date
export const createToken = () => {
    const currentPassword = getToday().split('/').join(''); // Convert today's date to a password format
    return `${process.env.DEFAULT_TOKEN}${currentPassword}`; // Append the current password to the default token
}

// Validate the token by comparing it with the current token
export const validateToken = (token: string) => {
    const currentToken = createToken(); // Generate the current token
    return token === currentToken; // Compare the provided token with the current token
}
