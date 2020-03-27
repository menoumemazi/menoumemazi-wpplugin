'use strict';

const e = React.createElement;

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
		fetch("https://wwwdev-solidcovid.sociality.gr/wp-json/wp/v2/localgroup?_embed=1")
			.then(res => res.json())
			.then(
				(result) => {
					console.log(result);
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
		console.log(e.target.value);
		var areaTermInput = e.target.value;
		if (areaTermInput.length > 3) {
			console.log(areaTermInput);
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
			console.log(tempItems);
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
			return <div>Error: {error.message}</div>;
		} else if (!isLoaded) {
			return <div>Loading...</div>;
		} else {
			return (
				<div class="finder-container group-finder-container">
					<div class="row finder-filter">
						<div class="col-md-12">
							<label>Αναζητήστε Περιοχή</label>
							<input value={this.state.input} type="text" onChange={this.filterItemsbyArea.bind(this)}></input>
						</div>
					</div>
					<div class="row finder-content groups">
						{items.map(item => (
							<div class="col-md-4" key={item.id}>
								<div class="group-item finder-item">
									<h4>{item.title.rendered}</h4>
									<span class="term area">{item.areaTerms.map(term =>
										(<span key={term.id} >{term.name}</span>)
									)}</span>
									<a class="fb-link" target="_blank" href={item.acf.mm_groups_facebook_link}>Μπες στο Facebook Group</a>
									{item.acf.mm_groups_phone ? <a class="phone" href={'tel:' + item.acf.mm_groups_phone}>{item.acf.mm_groups_phone}</a> : ''}
									<div class="desc" dangerouslySetInnerHTML={{ __html: item.content.rendered }}></div>
								</div>
							</div>
						))}
					</div>
				</div>
			);
		}
	}
}

const domContainer = document.querySelector('#localgroup-finder');
ReactDOM.render(e(GroupFinder), domContainer);