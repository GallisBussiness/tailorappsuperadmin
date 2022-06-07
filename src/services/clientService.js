import Api from './Api';
export const getAllClients = () => Api.get('/client').then(res => res.data.data);
export const createClient = (data) => Api.post('/client', data).then(res => res.data.data);
export const updateClient = (data) => {
    const {_id,...rest} = data;
    return Api.patch('/client/' + _id, rest ).then(res => res.data.data);
}

export const deleteClient = (id) => Api.delete('/client/' + id).then(res => res.data.data);

