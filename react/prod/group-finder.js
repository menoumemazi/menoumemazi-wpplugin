'use strict';


var e = React.createElement;

class GroupFinder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      items: [],
      itemsSafe: [],
      input: '',
    };
  }
  componentDidMount() {
    //Get Local Groups
    fetch("https://menoumemazi.org/wp-json/wp/v2/localgroup?per_page=100&_embed=1")
      .then(res => res.json())
      .then(
        (result) => {
          //Map Areas Terms
          result.forEach(
            (item) => {
              item.areaTerms = item._embedded['wp:term'][0].filter(obj => {
                return obj.taxonomy === 'area';
              })
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
  }
  //Handle Filter
  filterItemsbyArea(e) {
    var areaTermInput = e.target.value;
    if (areaTermInput.length > 3) {
      var tempItems = this.state.itemsSafe.filter(item => {
        var hasArea = false;
        item.areaTerms.map(term => {
          var termName_norm = term.name.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
          var areaTermInput_norm = areaTermInput.normalize('NFD').replace(/[\u0300-\u036f]/g, "").toLowerCase();
          if (termName_norm.includes(areaTermInput_norm)) {
            hasArea = true;
          }
        })
        return hasArea;
      });
      this.setState({
        input: areaTermInput,
        items: tempItems
      });
    } else {
      this.setState({
        items: this.state.itemsSafe,
        input: areaTermInput
      });
    }
  }
  //Render
  render() {
    const { error, isLoaded, items } = this.state;
    if (error) {
      console.log(error);
      return ('Λαθος');
    } else if (!isLoaded) {
      return ('Φορτώνει');
    } else {
      return (
        e("div", {
          class: "finder-container group-finder-container"
        }, e("div", {
          class: "row finder-filter"
        }, e("div", {
          class: "col-md-12"
        }, e("label", null, "Αναζητήστε Περιοχή"), e("input", {
          value: this.state.input,
          type: "text",
          onChange: this.filterItemsbyArea.bind(this)
        }))), e("div", {
          class: "masonry finder-content groups"
        }, items.map(function (item) {
          return e("div", {
            class: "masonry-item",
            key: item.id
          }, e("div", {
            class: "group-item finder-item"
          }, e("h4", null, item.title.rendered), e("span", {
            class: "term area"
          }, item.areaTerms.map(function (term) {
            return e("span", {
              key: term.id
            }, term.name);
          })), e("a", {
            class: "fb-link",
            target: "_blank",
            href: item.acf.mm_groups_facebook_link
          }, "Μπες στο Facebook Group"), item.acf.mm_groups_phone ? e("a", {
            class: "phone",
            href: 'tel:' + item.acf.mm_groups_phone
          }, item.acf.mm_groups_phone) : '', e("div", {
            class: "desc",
            dangerouslySetInnerHTML: {
              __html: item.content.rendered
            }
          })));
        })))
			);
    }
  }
}

const domContainerGroup = document.querySelector('#localgroup-finder');
ReactDOM.render(e(GroupFinder), domContainerGroup);