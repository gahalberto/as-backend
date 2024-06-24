// Function to get today's date formatted as 'dd/mm/yyyy'
export const getToday = () => Intl.DateTimeFormat('pt-BR').format(new Date());
