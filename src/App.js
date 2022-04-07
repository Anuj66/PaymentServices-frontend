import './App.css';
import Home from "./components/home";
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Cart from "./components/Cart";
import {useState} from "react";
import PaymentSuccess from "./components/PaymentSuccess";

function App() {

    const [amount,setAmount] = useState(0)

  return (
    <div className="App">
        <BrowserRouter>
            <Routes>
                <Route exact path={'/'} element={<Home amount={amount} setAmount={setAmount}/>}/>
                <Route exact path={'/pay'} element={<Cart amount={amount}/>}/>
                <Route exact path={'/paymentsuccess'} element={<PaymentSuccess />}/>
            </Routes>
        </BrowserRouter>
    </div>
  );
}

export default App;
