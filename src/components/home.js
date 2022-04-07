import {products} from "../datasource";
import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

const Home = (props) => {

    const {amount, setAmount} = props
    const navigator = useNavigate()

    useEffect(() => {
        let data = 0
        products.forEach((product) => {
            data = data + product.amount
        })
        setAmount(data)
    }, [amount])

    const handleClick = () => {
        navigator('/pay')
    }

    return (
        <div>
            <table className="table">
                <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Product</th>
                    <th scope="col">Customer</th>
                    <th scope="col">Amount</th>
                </tr>
                </thead>
                <tbody>
                {products.map((product, index) => {
                    return <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{product.product}</td>
                        <td>{product.customer}</td>
                        <td>{product.amount}</td>
                    </tr>
                })}

                </tbody>
            </table>
            <hr/>
            <div>
                Amount: {amount}
                <span>
                    <button className={'btn btn-primary mx-3'} onClick={handleClick}>Proceed to Payment</button>
                </span>
            </div>

        </div>
    )
}

export default Home