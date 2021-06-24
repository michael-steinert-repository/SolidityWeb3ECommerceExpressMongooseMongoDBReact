import React, {Component} from 'react';
import Identicon from 'identicon.js';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
                <a
                    className="navbar-brand col-sm-3 col-md-2 mr-0"
                    href="#"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    &nbsp;
                    <small>Blockchain Ecommerce App</small>
                </a>
                <ul className="navbar-nav px-3">
                    <li className="nav-item text-nowrap d-none d-sm-block">
                        <small className="text-secondary">
                            <small id="account">{this.props.account}</small>
                            &nbsp;
                        </small>
                        {this.props.account
                            ? <img
                                alt="Identicon of Account Address"
                                className='ml-2'
                                width='45'
                                height='45'
                                src={`data:image/png;base64,${new Identicon(this.props.account, 45).toString()}`}
                            />
                            : <span/>
                        }
                    </li>
                </ul>
            </nav>
        );
    }
}

export default Navbar;