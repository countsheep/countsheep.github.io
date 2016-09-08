var Title = React.createClass({
  	render: function() {
    	return (
    		<div className="title ui center aligned container">
        		<h1 class="ui center align header">Euro Exchange</h1>
      		</div>
    	);
  	}
});
var CurrentRate = React.createClass({
  	render: function() {
    	return (
    		<div>
        		Exchange Rate is {this.props.data}.
      		</div>
    	);
  	}
});

var Exchange = React.createClass({
	getInitialState: function() {
    	return {data: 0};
  	},
  	componentsDidMount: function(){
  		$.ajax({
  			url: "http://api.fixer.io/latest?base=USD",
  			dataType: "json",
  			success: function(data){
  				this.setState({data: data.EUR});
  			}.bind(this),
  			error: function(xhr, status, err) {
  				console.error(status, err.toString());
  			}.bind(this)

  		});
  	},
  	render: function(){
  		return (
  			<div>
  				<Title />
  				<CurrentRate data={this.state.data} />
  			</div>
  		);
  	}

});

ReactDOM.render(
  	<Exchange url="http://api.fixer.io/" />,
  	document.getElementById('content')
);