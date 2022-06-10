import Api from './Api';
export const createMesure = (data) => Api.post('/mesure', data).then(res =>  res.data.data);