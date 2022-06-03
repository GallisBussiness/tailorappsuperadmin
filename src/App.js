import { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import './App.css';
import { useQuery } from 'react-query';
import { getAllClients } from './services/clientService'

function App() {

const [selectedClients,setSelectedClients] = useState([])
const [globalFilter, setGlobalFilter] = useState(null);
const toast = useRef(null);
const dt = useRef(null);

const qk = ['getClients']
const { data } = useQuery(qk, () => getAllClients(), { 
    onSuccess:(_) => console.log(_)
})


// const importCSV = (e) => {
//     const file = e.files[0];
//     const reader = new FileReader();
//     reader.onload = (e) => {
//         const csv = e.target.result;
//         const data = csv.split('\n');

//         // Prepare DataTable
//         const cols = data[0].replace(/['"]+/g, '').split(',');
//         data.shift();

//         const importedData = data.map(d => {
//             d = d.split(',');
//             const processedData = cols.reduce((obj, c, i) => {
//                 c = c === 'Status' ? 'inventoryStatus' : (c === 'Reviews' ? 'rating' : c.toLowerCase());
//                 obj[c] = d[i].replace(/['"]+/g, '');
//                 (c === 'price' || c === 'rating') && (obj[c] = parseFloat(obj[c]));
//                 return obj;
//             }, {});

//             processedData['id'] = createId();
//             return processedData;
//         });

//         const _clients = [...clients, ...importedData];

//         setClients(_clients);
//     };

//     reader.readAsText(file, 'UTF-8');
// }

const exportCSV = () => {
    dt.current.exportCSV();
}



const leftToolbarTemplate = () => {
    return (
        <>
            <Button label="New" icon="pi pi-plus" className="p-button-success mr-2"  />
            <Button label="Delete" icon="pi pi-trash" className="p-button-danger" />
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


const actionBodyTemplate = (rowData) => {
    return (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-4" />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" />
        </>
    );
}

const header =  () => (
    <div className="table-header">
        <h5 className="mx-0 my-1">Gestion des Clients</h5>
        <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
        </span>
    </div>
);
// const clientDialogFooter = () => (
//     <>
//         <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
//         <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveClient} />
//     </>
// );
// const deleteClientDialogFooter = (
//     <>
//         <Button label="No" icon="pi pi-times" className="p-button-text"  />
//         <Button label="Yes" icon="pi pi-check" className="p-button-text" />
//     </>
// );
// const deleteClientsDialogFooter = (
//     <>
//         <Button label="No" icon="pi pi-times" className="p-button-text" />
//         <Button label="Yes" icon="pi pi-check" className="p-button-text" />
//     </>
// );

 return (
   <div className="datatable-crud">
     <Toast ref={toast} />

<div className="card">
    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

    <DataTable ref={dt} value={data} selection={selectedClients} onSelectionChange={(e) => setSelectedClients(e.value)}
        dataKey="_id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        currentPageReportTemplate="Voir {first} to {last} of {totalRecords} clients"
        globalFilter={globalFilter} header={header} responsiveLayout="scroll">
        <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} exportable={false}></Column>
        <Column field="prenom" header="Prenom" sortable style={{ minWidth: '12rem' }}></Column>
        <Column field="nom" header="Nom" sortable style={{ minWidth: '16rem' }}></Column>
        <Column field="tel" header="Telephone"></Column>
        <Column body={actionBodyTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
    </DataTable>
</div>

{/* <Dialog visible={clientDialog} style={{ width: '450px' }} header="client Details" modal className="p-fluid" footer={clientDialogFooter} onHide={hideDialog}>
    {client.image && <img src={`images/client/${client.image}`} onError={(e) => e.target.src='https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={client.image} className="client-image block m-auto pb-3" />}
    <div className="field">
        <label htmlFor="name">Name</label>
        <InputText id="name" value={client.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus className={classNames({ 'p-invalid': submitted && !client.name })} />
        {submitted && !client.name && <small className="p-error">Name is required.</small>}
    </div>
    <div className="field">
        <label htmlFor="description">Description</label>
        <InputTextarea id="description" value={client.description} onChange={(e) => onInputChange(e, 'description')} required rows={3} cols={20} />
    </div>

    <div className="field">
        <label className="mb-3">Category</label>
        <div className="formgrid grid">
            <div className="field-radiobutton col-6">
                <RadioButton inputId="category1" name="category" value="Accessories" onChange={onCategoryChange} checked={client.category === 'Accessories'} />
                <label htmlFor="category1">Accessories</label>
            </div>
            <div className="field-radiobutton col-6">
                <RadioButton inputId="category2" name="category" value="Clothing" onChange={onCategoryChange} checked={client.category === 'Clothing'} />
                <label htmlFor="category2">Clothing</label>
            </div>
            <div className="field-radiobutton col-6">
                <RadioButton inputId="category3" name="category" value="Electronics" onChange={onCategoryChange} checked={client.category === 'Electronics'} />
                <label htmlFor="category3">Electronics</label>
            </div>
            <div className="field-radiobutton col-6">
                <RadioButton inputId="category4" name="category" value="Fitness" onChange={onCategoryChange} checked={client.category === 'Fitness'} />
                <label htmlFor="category4">Fitness</label>
            </div>
        </div>
    </div>

    <div className="formgrid grid">
        <div className="field col">
            <label htmlFor="price">Price</label>
            <InputNumber id="price" value={client.price} onValueChange={(e) => onInputNumberChange(e, 'price')} mode="currency" currency="USD" locale="en-US" />
        </div>
        <div className="field col">
            <label htmlFor="quantity">Quantity</label>
            <InputNumber id="quantity" value={client.quantity} onValueChange={(e) => onInputNumberChange(e, 'quantity')} integeronly />
        </div>
    </div>
</Dialog> */}
   </div>
 );
 }
 

export default App;
