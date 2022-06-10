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
import {Controller, useForm } from 'react-hook-form';
import { InputMask } from 'primereact/inputmask'
import { classNames } from 'primereact/utils';
import {GiBodyHeight} from 'react-icons/gi'
import { createMesure } from '../services/MesureService';


const ClientCrud = () => {
const [selectedClients,setSelectedClients] = useState([])
const [globalFilter, setGlobalFilter] = useState('');
const [clientId,setClientId] = useState('');
const [isCreateMesure,setIsCreateMesure] = useState(false);
const [c,setC] = useState(false)
const toast = useRef(null);
const dt = useRef(null);
const qc = useQueryClient()


const defaultValues = {prenom:'',nom:'',tel:'',adresse:''}
const defaultValuesMesure = {lon:'',lar:'',cou:'',client: clientId}

const { control, handleSubmit, formState: {errors} } = useForm({defaultValues});

const { control: controlMesure, handleSubmit: handleSubmitMesure, formState:{errors:errorsMesure}} = useForm({defaultValues: defaultValuesMesure})

const getFormErrorMessage = (name) => {
    return errors[name] && <small className="p-error">{errors[name].message}</small>
};

const getFormErrorMessageMesure = (name) => {
    return errorsMesure[name] && <small className="p-error">{errorsMesure[name].message}</small>
};


const qk = ['getClients']
const { data } = useQuery(qk, () => getAllClients(), { 
    staleTime: 100_000,
})

const {mutate:mutateMesure,isLoading:isLoadingMesure} = useMutation((data) => createMesure(data),{
    onSuccess:(_) => {
        toast.current.show({ severity: 'info', summary: 'Creation Mesure', detail: 'Mesure crée !!', life: 3000 });
    },
    onError:(_) => {
        toast.current.show({ severity: 'warn', summary: 'Creation Mesure', detail: 'Une erreur !!', life: 3000 });
    }
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

const onSubmit = (data) => {
    mutate(data);
}

const onSubmitMesure = (data) => {
    
    mutateMesure(data);
}

const textEditor = (options) => {
    return <InputText type="text" className="text-sm font-medium text-gray-900 dark:text-gray-300 py-2" value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />;
}

const editMesure = ({_id}) => {
    setClientId(_id);
    setIsCreateMesure(true);
}

const actionBodyTemplate = (rowData) => {
    return (
        <>
            <Button icon={<GiBodyHeight />} className="p-button-rounded p-button-success mr-2" onClick={() => editMesure(rowData)} />
        </>
    );
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
        <Column field="adresse" editor={(options) => textEditor(options)} header="Adrese"></Column>
        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
        <Column  rowEditor headerStyle={{ width: '10%', minWidth: '8rem' }} bodyStyle={{ textAlign: 'center' }}></Column>
    </DataTable>
</div>
<Dialog header="Ajouter un client" visible={c} style={{ width: '50vw' }} onHide={() => cancelCClient()}>
<form onSubmit={handleSubmit(onSubmit)} className="p-fluid space-y-2">
                  <div className="field">               
                  <Controller control={control} name="prenom" rules={{required: 'Votre prénom est obligatoire'}} render={({field,fieldState}) => (
                    <InputText {...field} autoFocus className={classNames({ 'p-invalid': fieldState.error })} placeholder="Prenom*" />
                    )} />
                      {getFormErrorMessage('prenom')}
                  </div>
                  <div className="field">               
                  <Controller control={control} name="nom" rules={{required: 'Votre nom est obligatoire'}} render={({field,fieldState}) => (
                    <InputText {...field} autoFocus className={classNames({ 'p-invalid': fieldState.error })} placeholder="Nom*" />
                    )} />
                      {getFormErrorMessage('nom')}
                  </div>
                    <div className="field">
                        <Controller control={control} name="tel" rules={{required: 'Votre numéro de téléphone est obligatoire'}} render={({field,fieldState}) => (
                           <InputMask mask="999999999" {...field} className={classNames({ 'p-invalid': fieldState.error })} placeholder="Téléphone" ></InputMask>
                        )}/>
                         {getFormErrorMessage('tel')}
                     </div>
                    <div className="field">               
                  <Controller control={control} name="adresse" rules={{required: 'Votre adresse est obligatoire'}} render={({field,fieldState}) => (
                    <InputText {...field} autoFocus className={classNames({ 'p-invalid': fieldState.error })} placeholder="Adresse*" />
                    )} />
                      {getFormErrorMessage('adresse')}
                  </div>
        <Button type="submit" label="CREER CLIENT" loading={isLoading} className="mt-2 bg-blue-700" />
         </form>
</Dialog>
  <Dialog header="Ajouter Mesure" visible={isCreateMesure} style={{ width: '50vw' }} onHide={() => setIsCreateMesure(false)}>
  <form onSubmit={handleSubmitMesure(onSubmitMesure)} className="p-fluid space-y-2">
                  
                    <div className="field">
                        <Controller control={controlMesure} name="lon" rules={{required: 'Longueur est obligatoire'}} render={({field,fieldState}) => (
                           <InputMask mask="99" {...field} className={classNames({ 'p-invalid': fieldState.error })} placeholder="Longueur*" ></InputMask>
                        )}/>
                         {getFormErrorMessageMesure('lon')}
                     </div> 

                     <div className="field">
                        <Controller control={controlMesure} name="lar" rules={{required: 'Largeur est obligatoire'}} render={({field,fieldState}) => (
                           <InputMask mask="99" {...field} className={classNames({ 'p-invalid': fieldState.error })} placeholder="Largeur*" ></InputMask>
                        )}/>
                         {getFormErrorMessageMesure('lar')}
                     </div> 
                     <div className="field">
                        <Controller control={controlMesure} name="cou" rules={{required: 'Téléphone est obligatoire'}} render={({field,fieldState}) => (
                           <InputMask mask="99" {...field} className={classNames({ 'p-invalid': fieldState.error })} placeholder="Cou*" ></InputMask>
                        )}/>
                         {getFormErrorMessageMesure('tel')}
                     </div> 
                     <div className="field">
                        <Controller control={controlMesure} name="client" render={({field}) => (
                           <InputText {...field} hidden />
                        )}/>
                     </div> 
                   
                 <Button type="submit" label="CREER MESURE" loading={isLoadingMesure} className="mt-2 bg-blue-700" />
    </form>
  </Dialog>
   </div>
    </>
  )
}

export default ClientCrud