import { useEffect } from "react"
import { Link } from "react-router-dom"
import StepWizard from "react-step-wizard";

const Planes = props => {
    useEffect(() => {
        document.querySelector('.left-side').style.display = 'none';
    })
    return (
        <div className="main-container">
            <div className="main-header">
                <Link className="menu-link-main" href="#">Planes 📚</Link>
            </div>
            <div className={`content-wrapper`}>
                <div className="content-section">
                    <StepWizard>
                        <CardPlanes />
                        <DetalleBuy />
                    </StepWizard>
                </div>
            </div>
        </div>
    );
};

export default Planes;

const CardPlanes = props => {
    return (
        <div className="container">

            <div className="card">
                <div className="face face1">
                    <div className="content">
                        <span className="stars"></span>
                        <h2 className="java">Java</h2>
                        <p className="java">Java is a className-based, object-oriented programming language that is designed to have as few implementation dependencies as possible.</p>
                    </div>
                </div>
                <div className="face face2" onClick={() => { props.nextStep(); document.querySelector('.rjii').classList.add('wide'); }}>
                    <h2>1 Mes</h2>
                    <div className="arrow"></div>
                    <div className="arrow2"></div>
                    <div className="arrow3"></div>
                </div>
            </div>

            <div className="card">
                <div className="face face1">
                    <div className="content">
                        <span className="stars"></span>
                        <h2 className="python">Python</h2>
                        <p className="python">Python is an interpreted, high-level and general-purpose programming language.</p>
                    </div>
                </div>
                <div className="face face2" onClick={() => { props.nextStep(); document.querySelector('.rjii').classList.add('wide'); }}>
                    <h2>3 Meses</h2>
                    <div className="arrow"></div>
                    <div className="arrow2"></div>
                    <div className="arrow3"></div>
                </div>
            </div>

            <div className="card">
                <div className="face face1">
                    <div className="content">
                        <span className="stars"></span>
                        <h2 className="cSharp">C#</h2>
                        <p className="cSharp">C# is a general-purpose, multi-paradigm programming language encompassing static typing, strong typing, lexically scoped and component-oriented programming disciplines.</p>
                    </div>
                </div>
                <div className="face face2" onClick={() => { props.nextStep(); document.querySelector('.rjii').classList.add('wide'); }}>
                    <h2>12 Meses</h2>
                    <div className="arrow"></div>
                    <div className="arrow2"></div>
                    <div className="arrow3"></div>
                </div>
            </div>
        </div>
    );
}
const DetalleBuy = props => {
    return (
        <div className="iphone">
            <header className="header">
                <h1 className="header-menu">Checkout 💳</h1>
            </header>

            <form className="">
                <div>
                    <h2>Dirreción 📌</h2>

                    <div className="content-wrapper-header">
                        <div className="content-wrapper-context">
                            <address>
                                Adam Johnson<br />
                                403 Oakland Ave Street, A city, Florida, 32104,<br />
                                United States of America
                            </address>
                        </div>
                    </div>
                </div>
                <br />
                <fieldset>
                    <legend>Metodo de Pago 💳</legend>

                    <div className="form__radios">
                        <div className="form__radio">
                            <label htmlFor="visa"><i className="icon fa-brands fa-cc-visa"></i> Visa Payment</label>
                            <input checked id="visa" name="payment-method" type="radio" />
                        </div>

                        <div className="form__radio">
                            <label htmlFor="paypal"><i className="icon fa-brands fa-cc-paypal"></i> PayPal</label>
                            <input id="paypal" name="payment-method" type="radio" />
                        </div>

                        <div className="form__radio">
                            <label htmlFor="mastercard"><i className="icon fa-brands fa-cc-mastercard"></i> Master Card</label>
                            <input id="mastercard" name="payment-method" type="radio" />
                        </div>
                    </div>
                </fieldset>

                <div>
                    <h2>Detalle de Compra</h2>

                    <table>
                        <tbody>
                            <tr>
                                <td>Shipping fee</td>
                                <td align="right">$5.43</td>
                            </tr>
                            <tr>
                                <td>Discount 10%</td>
                                <td align="right">-$1.89</td>
                            </tr>
                            <tr>
                                <td>Price Total</td>
                                <td align="right">$84.82</td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td>Total</td>
                                <td align="right">$88.36</td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
                <br />
                <div>
                    <button className="button button--full" type="button" onClick={() => { props.nextStep(); document.querySelector('.rjii').classList.remove('wide'); }}><i className="fa-solid fa-cart-shopping"></i> Buy Now</button>
                </div>
            </form>
        </div>
    )
}