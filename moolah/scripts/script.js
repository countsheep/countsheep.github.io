var CommentBox = React.createClass({
  render: function() {
    return (
      <div className="title ui center align container">
        <h1>Hello, world! I am a CommentBox.</h1>
      </div>
    );
  }
});
ReactDOM.render(
  <Title />,
  document.getElementById('content')
);