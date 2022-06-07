import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ClientCrud from "./components/ClientCrud";
import './App.css';
function App() {

 return (
   <>
   <BrowserRouter>
    <Routes>
        <Route path="/" element={<ClientCrud />}/>
    </Routes>
   </BrowserRouter>
   </>
 );
 }
 

export default App;
