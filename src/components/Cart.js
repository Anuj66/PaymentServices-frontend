import CheckoutForm from "./Checkoutform";
import {useState} from "react";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe("pk_test_51Klp7WSAhOyX2rjMTKJGFcaPF9628sinF1IR8ogjUwBxTjUjoCyn53gVv4YBCh6piVHdK7k4zjR35X7vky5BxFKg00UCPOhcbM");

const successMessage = () => {
    return (
        <div className="success-msg">
            <svg width="1em" height="1em" viewBox="0 0 16 16" className="bi bi-check2" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z" />
            </svg>
            <div className="title">Payment Successful</div>
        </div>
    )
}

const Cart = (props) => {

    const [paymentCompleted, setPaymentCompleted] = useState(false)

    return (
        <div className={'container'}>

            <div className="row s-box">
                {paymentCompleted ? successMessage() : <div>
                    <div className="col-md-7 order-md-1">
                        <Elements stripe={stripePromise}>
                            <CheckoutForm amount={props.amount} setPaymentCompleted={setPaymentCompleted}/>
                        </Elements>
                    </div>
                </div>}
            </div>

        </div>
    )
}

export default Cart