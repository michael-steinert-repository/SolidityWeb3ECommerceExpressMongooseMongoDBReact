import React, {Component} from 'react';

class Main extends Component {

    render() {
        return (
            <div className="container-fluid mt-5 text-center">
                <div className="row">
                    <main role="main" className="col-lg-12 ml-auto mr-auto" style={{maxWidth: '1024px'}}>
                        <div className="content">
                            {this.props.items.map((item, key) => {
                                return (
                                    <div className="card mb-4" key={key}>
                                        <div className="card-header">
                                            <small className="text-muted">{item.name}</small>
                                        </div>

                                        <button
                                            className="btn btn-link btn-sm float-right pt-0"
                                            name={item.id}
                                            onClick={(event) => {
                                                this.props.buyItem(item);
                                            }}
                                        >
                                            <small className="text-muted">Buy</small>
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}

export default Main;