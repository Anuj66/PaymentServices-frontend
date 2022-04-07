import React, { useState } from 'react';
import {
    useStripe, useElements,
    CardNumberElement, CardExpiryElement, CardCvcElement
} from '@stripe/react-stripe-js';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            lineHeight: "27px",
            color: "#212529",
            fontSize: "1.1rem",
            "::placeholder": {
                color: "#aab7c4",
            },
        },
        invalid: {
            color: "#fa755a",
            iconColor: "#fa755a",
        },
    },
};

export default function CheckoutForm(props) {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const stripe = useStripe();
    const elements = useElements();

    const API_ENDPOINT = 'http://localhost:8080/api';

    const stripePaymentMethodHandler = async (data, cb) => {
        const { amount, result } = data;
        if (result.error) {
            cb(result);
        } else {
            console.log(data)
            const paymentResponse = await stripePayment({
                payment_method_id: result.paymentMethod.id,
                name: result.paymentMethod.billing_details.name,
                email: result.paymentMethod.billing_details.email,
                amount: amount
            });
            cb(paymentResponse);
        }
    }

    const stripePayment = async data => {
        const res = await fetch(`${API_ENDPOINT}/pay`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        })
        return await res.json();
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);
        setErrorMsg('');

        const paymentMethodObj = {
            type: 'card',
            card: elements.getElement(CardNumberElement),
            billing_details: {
                name,
                email
            },
        };
        const paymentMethodResult = await stripe.createPaymentMethod(paymentMethodObj);

        await stripePaymentMethodHandler({
            result: paymentMethodResult,
            amount: props.amount
        }, handleResponse);
    };

    const handleResponse = response => {
        setLoading(false);
        if (response.error) {
            setErrorMsg(typeof response.error === 'string' ? response.error : response.error.message);
            return;
        }
        props.setPaymentCompleted(response.success ? true : false);
    };

    return (
        <React.Fragment>
            <h4 className="d-flex justify-content-between align-items-center mb-3">
                <span className="text-muted">Pay with card</span>
            </h4>
            <form onSubmit={handleSubmit}>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="cc-name">Name on card</label>
                        <input
                            id="cc-name"
                            type="text"
                            className="form-control"
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="cc-email">Email</label>
                        <input
                            id="cc-email"
                            type="text"
                            className="form-control"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12 mb-3">
                        <label htmlFor="cc-number">Card Number</label>
                        <CardNumberElement
                            id="cc-number"
                            className="form-control"
                            options={CARD_ELEMENT_OPTIONS}
                        />
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="expiry">Expiration Date</label>
                        <CardExpiryElement
                            id="expiry"
                            className="form-control"
                            options={CARD_ELEMENT_OPTIONS}
                        />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="cvc">CVC</label>
                        <CardCvcElement
                            id="cvc"
                            className="form-control"
                            options={CARD_ELEMENT_OPTIONS}
                        />
                    </div>
                </div>

                <hr className="mb-4" />
                <button className="btn btn-dark w-100" type="submit" disabled={loading}>
                    {loading ? <div className="spinner-border spinner-border-sm text-light" role="status"></div> : `PAY ₹${props.amount}`}
                </button>
                {errorMsg && <div className="text-danger mt-2">{errorMsg}</div>}
            </form>
        </React.Fragment>
    );
}