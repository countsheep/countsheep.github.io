var Title = React.createClass({
  render: function() {
    return (
      <div className="title ui center align container">
        <h1 class="ui center align header">Euro Exchange</h1>
      </div>
    );
  }
});
var Rate = React.createClass({
  render: function() {
    return(<div>
    	<Title />
    </div>
    );
    
  }
});

ReactDOM.render(
  <Rate />,
  document.getElementById('content')
);