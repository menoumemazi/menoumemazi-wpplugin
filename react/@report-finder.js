'use strict';

const e = React.createElement;

class ReportFinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            itemsSafe: [],
            input: '',
            fieldComplaints: [],
            selectedField: ''
        };
        this.filterFieldsClear = this.filterFieldsClear.bind(this);
        //this.filterFieldsSelect = this.filterFieldsSelect.bind(this);
    }
    componentDidMount() {
        //Get Local Groups
        fetch("https://wwwdev-solidcovid.sociality.gr/wp-json/wp/v2/complaint?_embed=1")
            .then(res => res.json())
            .then(
                (result) => {
                    result.forEach(
                        (item) => {
                            //Map Company Terms
                            item.companyTerms = item._embedded['wp:term'][0].filter(obj => {
                                return obj.taxonomy === 'company';
                            });

                            //Map Fields
                            item.fieldTerms = item._embedded['wp:term'][1].filter(obj => {
                                return obj.taxonomy === 'fieldcomplaint';
                            });
                            //Format date
                            var dateTemp = new Date(item.date);
                            item.formattedDate = Intl.DateTimeFormat('en-GB', {
                                day: '2-digit',
                                month: 'numeric',
                                year: 'numeric',
                            }).format(dateTemp);
                        }
                    );
                    this.setState({
                        isLoaded: true,
                        items: result,
                        itemsSafe: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

        //Get all Field compaints
        fetch("https://wwwdev-solidcovid.sociality.gr/wp-json/wp/v2/all-terms?term=fieldcomplaint")
            .then(res => res.json())
            .then(
                (result) => {
                    this.setState({
                        isLoaded: true,
                        fieldComplaints: result
                    });
                },
                // Note: it's important to handle errors here
                // instead of a catch() block so that we don't swallow
                // exceptions from actual bugs in components.
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    //Handle Filter
    filterItemsbyCompany(e) {
        var companyTermInput = e.target.value;
        if (companyTermInput.length > 3) {
            var tempItems = this.state.itemsSafe.filter(item => {
                var hasCompany = false;
                item.companyTerms.map(term => {
                    var termName_norm = term.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    var companyTermInput_norm = companyTermInput.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
                    if (termName_norm.includes(companyTermInput_norm)) {
                        hasCompany = true;
                    }
                })
                return hasCompany;
            });
            this.setState({
                input: companyTermInput,
                items: tempItems,
                selectedField: ''
            });
        } else {
            this.setState({
                items: this.state.itemsSafe,
                input: companyTermInput
            });
        }
    }
    //Filter Fields
    filterFieldsClear() {
        this.setState({
            items: this.state.itemsSafe,
            selectedField: '',
            input: ''
        });
    }
    filterFieldsSelect(fieldTemp) {
        var tempItems = this.state.itemsSafe.filter(item => {
            var hasField = false;
            item.fieldTerms.map(term => {
                if (term.name === fieldTemp) {
                    hasField = true;
                }
            })
            return hasField;
        });
        this.setState({
            items: tempItems,
            selectedField: fieldTemp,
            input: ''
        });
    }
    //Render
    render() {
        const { error, isLoaded, items, fieldComplaints,selectedField } = this.state;
        if (error) {
            return <div>Error: {error.message}</div>;
        } else if (!isLoaded) {
            return <div>Loading...</div>;
        } else {
            return (
                <div className="finder-container complaints-finder-container row">
                    <div className="col-md-4 finder-filter">
                        <div className="row">
                            <div className="col-md-12">
                                <span className="clear" onClick={this.filterFieldsClear}>
                                   X Επαναφορά
                                </span>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <label>Αναζητήστε Εταιρία</label>
                                <input value={this.state.input} type="text" onChange={this.filterItemsbyCompany.bind(this)}></input>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <label>Επιλέξτε Κλάδο</label>
                                <div className="tag-container">
                                    {this.state.fieldComplaints.map(term =>
                                        (<span className={ selectedField===term.name ? "active" : ""} onClick={this.filterFieldsSelect.bind(this, term.name)} key={term.term_id}>{term.name}</span>)
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 finder-content complaints">
                        {items.map(item => (
                            <div className="row" key={item.id}>
                                <div className="col-md-12">
                                    <a href={item.link} target="_blank" title={item.title.rendered} >
                                        <div className="complaint-item finder-item">
                                            <h4>{item.title.rendered}</h4>
                                            <div className="info">
                                                <span className="date">{item.formattedDate}</span>
                                                <span className="term company">{item.companyTerms.map(term =>
                                                    (<span key={term.id} >{term.name}</span>)
                                                )}</span>
                                                <span className="term field">{item.fieldTerms.map(term =>
                                                    (<span key={term.id} >{term.name}</span>)
                                                )}</span>
                                            </div>
                                            <div className="desc" dangerouslySetInnerHTML={{ __html: item.excerpt.rendered }}></div>
                                        </div>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            );
        }
    }
}

const domContainer = document.querySelector('#reportfinder');
ReactDOM.render(e(ReportFinder), domContainer);