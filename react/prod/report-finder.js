'use strict';

var e = React.createElement;

class ReportFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoadedItems: false,
      isLoadedTerms: false,
      items: [],
      itemsSafe: [],
      input: '',
      fieldComplaints: [],
      selectedField: ''
    };
    this.filterFieldsClear = this.filterFieldsClear.bind(this);
  }
  componentDidMount() {
    //Get Local Groups
    fetch("https://menoumemazi.org/wp-json/wp/v2/complaint?per_page=100&_embed=1")
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
            isLoadedItems: true,
            items: result,
            itemsSafe: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoadedItems: true,
            error
          });
        }
      )

    //Get all Field compaints
    fetch("https://menoumemazi.org/wp-json/wp/v2/all-terms?term=fieldcomplaint")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoadedTerms: true,
            fieldComplaints: result
          });
        },
        // Note: it's important to handle errors here
        // instead of a catch() block so that we don't swallow
        // exceptions from actual bugs in components.
        (error) => {
          this.setState({
            isLoadedTerms: true,
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
    const { error, isLoadedItems, isLoadedTerms, items, fieldComplaints, selectedField } = this.state;
    if (error) {
      console.log(error);
      return ('Λαθος');
    } else if (!isLoadedItems || !isLoadedTerms) {
      return ('Φορτώνει');
    } else {
      //Map Terms to array from Object
      var arrayFieldCompaints = [];
      Object.keys(fieldComplaints).forEach(function (key) {
        arrayFieldCompaints.push(fieldComplaints[key]);
      });
      //Render
      return (
        e("div", {
          className: "finder-container complaints-finder-container row"
        }, e("div", {
          className: "col-md-4 finder-filter"
        }, e("div", {
          className: "row"
        }, e("div", {
          className: "col-md-12"
        }, e("span", {
          className: "clear",
          onClick: this.filterFieldsClear
        }, "X Επαναφορά"))), e("div", {
          className: "row"
        }, e("div", {
          className: "col-md-12"
        }, e("label", null, "Αναζητήστε Εταιρία"), e("input", {
          value: this.state.input,
          type: "text",
          onChange: this.filterItemsbyCompany.bind(this)
        }))), e("div", {
          className: "row"
        }, e("div", {
          className: "col-md-12"
        }, e("label", null, "Επιλέξτε Κλάδο"), e("div", {
          className: "tag-container"
        }, arrayFieldCompaints.map((term) => {
          return e("span", {
            className: selectedField === term.name ? "active" : "",
            onClick: this.filterFieldsSelect.bind(this, term.name),
            key: term.term_id
          }, term.name);
        }))))), e("div", {
          className: "col-md-8 finder-content complaints"
        }, items.map(function (item) {
          return e("div", {
            className: "row",
            key: item.id
          }, e("div", {
            className: "col-md-12"
          }, e("a", {
            href: item.link,
            target: "_blank",
            title: item.title.rendered
          }, e("div", {
            className: "complaint-item finder-item"
          }, e("h4", null, item.title.rendered), e("div", {
            className: "info"
          }, e("span", {
            className: "date"
          }, item.formattedDate), e("span", {
            className: "term company"
          }, item.companyTerms.map(function (term) {
            return e("span", {
              key: term.id
            }, term.name);
          })), e("span", {
            className: "term field"
          }, item.fieldTerms.map(function (term) {
            return e("span", {
              key: term.id
            }, term.name);
          }))), e("div", {
            className: "desc",
            dangerouslySetInnerHTML: {
              __html: item.excerpt.rendered
            }
          })))));
        })))
      );
    }
  }
}

const domContainer = document.querySelector('#reportfinder');
ReactDOM.render(e(ReportFinder), domContainer);