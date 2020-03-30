'use strict';

var e = React.createElement;

class UnionFinder extends React.Component {
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
        fetch("https://menoumemazi.org/wp-json/wp/v2/union?per_page=100&_embed=1")
            .then(res => res.json())
            .then(
                (result) => {
                    //console.log(result);
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
                            //Map Type Terms
                            item.typeTerms = item._embedded['wp:term'][2].filter(obj => {
                                return obj.taxonomy === 'union_type';
                            });
                        }
                    );
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
        fetch("https://menoumemazi.org/wp-json/wp/v2/all-terms?term=area_union")
            .then(res => res.json())
            .then(
                (result) => {
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
        fetch("https://menoumemazi.org/wp-json/wp/v2/all-terms?term=field")
            .then(res => res.json())
            .then(
                (result) => {
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
        this.filterRefresh(this.state.selectedField, areaTemp);
    }
    //Filter Fields
    filterFieldsSelect(fieldTemp) {
        this.setState({
            selectedField: fieldTemp,
        });
        this.filterRefresh(fieldTemp, this.state.selectedArea);
    }
    //Refresh Fiels
    filterRefresh(field, area) {
        var tempItems = this.state.itemsSafe.filter(item => {
            var hasField = false;
            var hasArea = false;
            var tempArea = area;
            var tempField = field;
            //Filter by Area
            if (tempArea != '') {
                item.areaTerms.map(term => {
                    if (term.name === tempArea) {
                        hasArea = true;
                    }
                })
            } else {
                hasArea = true;
            }
            //Filter by Field
            if (tempField != '') {
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
                e("div", {
                    className: "finder-container union-finder-container row"
                }, e("div", {
                    className: "col-md-4 finder-filter"
                }, e("div", {
                    className: "row"
                }, e("div", {
                    className: "col-md-12"
                }, e("label", null, "Επιλέξτε Κλάδο"), e("div", {
                    className: "tag-container"
                }, e("span", {
                    className: selectedField === '' ? "active" : "",
                    onClick: this.filterFieldsSelect.bind(this, '')
                }, "Όλοι"),
                    fieldUnions.map(term => {
                        return e("span", {
                            className: selectedField === term.name ? "active" : "",
                            onClick: this.filterFieldsSelect.bind(this, term.name),
                            key: term.term_id
                        }, term.name);
                    })))), e("div", {
                        className: "row"
                    }, e("div", {
                        className: "col-md-12"
                    }, e("label", null, "Επιλέξτε Περιοχή"), e("div", {
                        className: "tag-container"
                    }, e("span", {
                        className: selectedArea === '' ? "active" : "",
                        onClick: this.filterAreasSelect.bind(this, '')
                    }, "Όλες"), areaUnions.map(term => {
                        return e("span", {
                            className: selectedArea === term.name ? "active" : "",
                            onClick: this.filterAreasSelect.bind(this, term.name),
                            key: term.term_id
                        }, term.name);
                    }))))), e("div", {
                        className: "col-md-8 finder-content unions"
                    }, e("div", {
                        className: "masonry"
                    }, items.map(function (item) {
                        return e("div", {
                            className: "masonry-item",
                            key: item.id
                        }, e("div", {
                            className: "union-item finder-item"
                        }, e("h4", null, item.title.rendered), e("div", {
                            className: "info"
                        }, e("span", {
                            className: "term field"
                        }, item.fieldTerms.map(function (term) {
                            return e("span", {
                                key: term.id
                            }, term.name);
                        }))
                            , e("span", {
                                className: "term field"
                            }, item.areaTerms.map(function (term) {
                                return e("span", {
                                    key: term.id
                                }, term.name);
                            })),
                            e("span", {
                                className: "term field"
                            }, item.typeTerms.map(function (term) {
                                return e("span", {
                                    key: term.id
                                }, term.name);
                            }))
                        ), e("div", {
                            className: "contact-details"
                        }, e("div", {
                            className: "contact-info tel"
                        }, item.acf.mm_union_phone), e("div", {
                            className: "contact-info email"
                        }, item.acf.mm_union_email), e("div", {
                            className: "contact-info website"
                        }, e("a", {
                            href: item.acf.mm_union_site,
                            target: "_blank"
                        }, "Website")), e("div", {
                            className: "contact-info adress"
                        }, item.acf.mm_union_adress))));
                    }))))
            );
        }
    }
}

const domContainer2 = document.querySelector('#union-finder');
ReactDOM.render(e(UnionFinder), domContainer2);