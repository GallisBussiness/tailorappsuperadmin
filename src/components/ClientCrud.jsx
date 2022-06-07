import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { Dialog } from 'primereact/dialog';
import {ConfirmDialog,confirmDialog } from 'primereact/confirmdialog';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createClient, deleteClient, getAllClients, updateClient } from '../services/clientService'
import { useForm } from 'react-hook-form';


const ClientCrud = () => {
const [selectedClients,setSelectedClients] = useState([])
const [globalFilter, setGlobalFilter] = useState('');
const [c,setC] = useState(false)
const toast = useRef(null);
const dt = useRef(null);
const qc = useQueryClient()
const { register, handleSubmit } = useForm();

const qk = ['getClients']
const { data } = useQuery(qk, () => getAllClients(), { 
    staleTime: 100_000,
    onSuccess:(_) => {}
})

const cClient = () => setC(true);

const cancelCClient = () => setC(false);

const { mutate,isLoading } = useMutation((data) => createClient(data), {
    onSuccess:(_) => {
        toast.current.show({ severity: 'info', summary: 'Creation Client', detail: 'Client crée !!', life: 3000 });
        setC(false);
      qc.invalidateQueries(qk);
    },
    onError:(_) => {
        toast.current.show({ severity: 'warn', summary: 'Creation client', detail: 'Une erreur !!', life: 3000 });
    }
})

const {mutate:doUpdate} = useMutation((data) => updateClient(data), {
    onSuccess:(_) => {
        toast.current.show({ severity: 'info', summary: 'Mise à jour Client', detail: 'Client modifié !!', life: 3000 });
      qc.invalidateQueries(qk);
    },
    onError:(_) => {
        toast.current.show({ severity: 'warn', summary: 'Mise à jour client', detail: 'Une erreur !!', life: 3000 });
    }
})

const {mutate:del} = useMutation((id) => deleteClient(id), {
    onSuccess:(_) => {
    toast.current.show({ severity: 'info', summary: 'Suppression Client', detail: `Client ${_.prenom} ${_.nom} supprimé !!`, life: 3000 });
      qc.invalidateQueries(qk);
    },
    onError:(_) => {
        toast.current.show({ severity: 'warn', summary: 'Suppression client', detail: 'Une erreur !!', life: 3000 });
    }
});

const onSubmit = (data) => mutate(data);

const textEditor = (options) => {
    return <InputText type="text" className="text-sm font-medium text-gray-900 dark:text-gray-300 py-2" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
}

const onRowEditComplete = (e) => {
    const {newData: {prenom,nom,tel,_id}} = e;

    doUpdate({prenom,nom,tel,_id});
} 

const accept = () => {
    selectedClients.forEach(c => del(c._id));
}

const reject = () => {
    toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'Suppression rejetée', life: 3000 });
}

const ConfirmDelete = (position) => {
    confirmDialog({
        message: 'Voulez-vous vraiment supprimer cette enrégistrement?',
        header: 'Confirmation de suppression',
        icon: 'pi pi-info-circle',
        position,
        accept,
        reject
    });
}


const exportCSV = () => {
    dt.current.exportCSV();
}



const leftToolbarTemplate = () => {
    return (
        <>
            <Button label="Creer" icon="pi pi-plus" className="p-button-success mr-2" onClick={() => cClient()} />
            <Button label="Supprimer" icon="pi pi-trash" className="p-button-danger" onClick={() => ConfirmDelete('top-right')} />
        </>
    )
}

const rightToolbarTemplate = () => {
    return (
        <>
            <FileUpload mode="basic" name="demo[]" auto url="https://primefaces.org/primereact/showcase/upload.php" accept=".csv" chooseLabel="Import" className="mr-2 inline-block" />
            <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
        </>
    )
}


const header =  () => (
    <div className="table-header">
        <h5 className="mx-0 my-1">Gestion des Clients</h5>
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" className="py-2" value={globalFilter}  onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Rechercher..." />
        </span>
    </div>
);

  return (
    <>
<div className="datatable-crud">
     <Toast ref={toast} />
     <ConfirmDialog />
<div className="card">
    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

    <DataTable ref={dt} value={data} editMode="row" onRowEditComplete={onRowEditComplete} size="small" selection={selectedClients} onSelectionChange={(e) => setSelectedClients(e.value)}
        dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Voir {first} to {last} of {totalRecords} clients"
        globalFilter={globalFilter} header={header} responsiveLayout="scroll">
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
        <Column field="prenom" header="Prenom" editor={(options) => textEditor(options)}  sortable style={{ minWidth: '12rem' }}></Column>
        <Column field="nom" header="Nom" editor={(options) => textEditor(options)}  sortable style={{ minWidth: '16rem' }}></Column>
        <Column field="tel" editor={(options) => textEditor(options)} header="Telephone"></Column>
        <Column  rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
    </DataTable>
</div>
<Dialog header="Ajouter un client" visible={c} style={{ width: '50vw' }} onHide={() => cancelCClient()}>
    <form onSubmit={handleSubmit(onSubmit)} >
    <div className="field flex flex-col space-y-2">
        <label htmlFor="prenom" className="block">Prenom</label>
        <InputText id="prenom" {...register('prenom', {required: true})} aria-describedby="prenom" placeholder="Prenom"
         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
    </div>
    <div className="field flex flex-col space-y-2">
        <label htmlFor="nom" className="block">Nom</label>
        <InputText id="nom" {...register('nom', {required: true})} aria-describedby="nom" placeholder="Nom"
         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
    </div>
    <div className="field flex flex-col space-y-2">
        <label htmlFor="tel" className="block">Telephone</label>
        <InputText id="tel" {...register('tel', {required: true})} aria-describedby="tel" placeholder="Numéro de telephone"
         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
    </div>
    <div className="field flex flex-col space-y-2">
        <label htmlFor="adresse" className="block">Adresse</label>
        <InputText id="adresse" {...register('adresse', {required: true})} aria-describedby="adresse" placeholder="Adresse"
         className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
    </div>
    <Button  label="Sauvegarder" loading={isLoading} className="p-button-success my-4" />
    </form>
</Dialog>

   </div>
    </>
  )
}

export default ClientCrud