import create from 'zustand';
const defaultClient = {prenom:'',nom:'',adresse:'',tel:'' };
export const useStore = create(set => ({
    c: false,
    d: false,
    u:false,
    client: defaultClient,
    create: () => set(state =>({...state,c:true})),
    cancelCreate: () => set(state => ({...state,c:false})),
    del:() => set(state => ({...state,d:true})),
    cancelDel: () => set(state => ({...state,d:false})),
    update:(cl) => set(state => ({...state,u:true,client:{...cl}})),
    cancelUpdate: () => set(state => ({...state,u:false,client: defaultClient })),
}))