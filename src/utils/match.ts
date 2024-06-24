// Function to encrypt a match ID by embedding it within a token
export const encryptMatch = (id: number): string => {
    return `${process.env.DEFAULT_TOKEN}${id}${process.env.DEFAULT_TOKEN}`;
}

// Function to decrypt a match ID by removing the token parts
export const decryptMatch = (match: string): number => {
    const idString: string = match
        .replace(`${process.env.DEFAULT_TOKEN}`, '')
        .replace(`${process.env.DEFAULT_TOKEN}`, '');

    return parseInt(idString);
}
