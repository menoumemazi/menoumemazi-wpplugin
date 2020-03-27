'use strict';
console.log("union loader");

const e = React.createElement;

class ReportFinder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            items: [],
            itemsSafe: [],
            fieldUnions: [],
            areaUnions: [],
            selectedField: '',
            selectedArea: ''
        };
    }
    componentDidMount() {
        //Get Unions
        fetch("https://wwwdev-solidcovid.sociality.gr/wp-json/wp/v2/union?_embed=1")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    result.forEach(
                        (item) => {
                            //Map Area Terms
                            item.areaTerms = item._embedded['wp:term'][0].filter(obj => {
                                return obj.taxonomy === 'area_union';
                            });
                            //Map Fields Terms
                            item.fieldTerms = item._embedded['wp:term'][1].filter(obj => {
                                return obj.taxonomy === 'field';
                            });
                        }
                    );
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        items: result,
                        itemsSafe: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

        //Get all Areas
        fetch("https://wwwdev-solidcovid.sociality.gr/wp-json/wp/v2/all-terms?term=area_union")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        areaUnions: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )

        //Get all Fields
        fetch("https://wwwdev-solidcovid.sociality.gr/wp-json/wp/v2/all-terms?term=field")
            .then(res => res.json())
            .then(
                (result) => {
                    console.log(result);
                    this.setState({
                        isLoaded: true,
                        fieldUnions: result
                    });
                },
                (error) => {
                    this.setState({
                        isLoaded: true,
                        error
                    });
                }
            )
    }
    //Filter Areas
    filterAreasSelect(areaTemp) {
        this.setState({
            selectedArea: areaTemp,
        });
        filterRefresh();
    }
    //Filter Fields
    filterFieldsSelect(fieldTemp) {
        this.setState({
            selectedField: fieldTemp,
        });
        filterRefresh();
    }
    //Refresh Fiels
    filterRefresh() {
        var tempItems = this.state.itemsSafe.filter(item => {
            var hasField = false;
            var hasArea = false;
            var tempArea = this.state.selectedArea;
            var tempField = this.state.selectedField;
            //Filter by Area
            if (tempArea.lentgh > 2) {
                item.fieldArea.map(term => {
                    if (term.name === tempArea) {
                        hasArea = true;
                    }
                })
            } else {
                hasArea = true;
            }
            //Filter by Field
            if (tempField.lentgh > 2) {
                item.fieldTerms.map(term => {
                    if (term.name === tempField) {
                        hasField = true;
                    }
                })
            } else {
                hasField = true;
            }
            //Check both
            if (hasField && hasArea) {
                return true;
            } else {
                return false;
            }
        });
        this.setState({
            items: tempItems,
        });
    }
    //Render
    render() {
        const { error, isLoaded, items, fieldUnions, areaUnions, selectedField, selectedArea } = this.state;
        if (error) {
            console.log(error);
            return ('Λάθος');
        } else if (!isLoaded) {
            return ('Φορτώνει');
        } else {
            return (
                <div className="finder-container union-finder-container row">
                    <div className="col-md-4 finder-filter">
                        <div className="row">
                            <div className="col-md-12">
                                <label>Επιλέξτε Κλάδο</label>
                                <div className="tag-container">
                                    <span className={selectedField === '' ? "active" : ""} onClick={this.filterFieldsSelect.bind(this, '')}>Όλοι</span>
                                    {fieldUnions.map(term =>
                                        (<span className={selectedField === term.name ? "active" : ""} onClick={this.filterFieldsSelect.bind(this, term.name)} key={term.term_id}>{term.name}</span>)
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12">
                                <label>Επιλέξτε Περιοχή</label>
                                <div className="tag-container">
                                    <span className={selectedArea === '' ? "active" : ""} onClick={this.filterAreasSelect.bind(this, '')}>Όλες</span>
                                    {areaUnions.map(term =>
                                        (<span className={selectedArea === term.name ? "active" : ""} onClick={this.filterAreasSelect.bind(this, term.name)} key={term.term_id}>{term.name}</span>)
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-8 finder-content unions">
                        <div className="row" >
                            {items.map(item => (
                                <div className="col-md-6" key={item.id}>
                                        <div className="union-item finder-item">
                                            <h4>{item.title.rendered}</h4>
                                            <div className="info">
                                                <span className="term field">{item.fieldTerms.map(term =>
                                                    (<span key={term.id} >{term.name}</span>)
                                                )}</span>
                                            </div>
                                            <div className="contact-details">
                                                <div className="contact-info tel">
                                                   {item.acf.mm_union_phone}
                                                </div>
                                                <div className="contact-info email">
                                                   {item.acf.mm_union_email}
                                                </div>
                                                <div className="contact-info website">
                                                    <a href={item.acf.mm_union_site} target="_blank">{item.acf.mm_union_site}</a>
                                                </div>
                                                <div className="contact-info adress">
                                                    {item.acf.mm_union_adress}
                                                </div>
                                            </div>
                                        </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            );
        }
    }
}

const domContainer = document.querySelector('#union-finder');
ReactDOM.render(e(ReportFinder), domContainer);