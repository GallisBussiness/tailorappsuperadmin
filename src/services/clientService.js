import Api from './Api';
export const getAllClients = () => Api.get('/client').then(res => res.data.data);

