export const client = async (url, options = {}) => fetch(url, options).then(res => res.json());
