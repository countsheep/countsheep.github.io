var Currency = React.createClass({
	update:function(){
		var modifiedValue=this.refs.inputValue.value;
		this.props.updateValue(modifiedValue);
	},
	
	render: function() {
		return (
			<div className="ui large labeled input">
				<div className={"ui label "+this.props.color}>{this.props.symbol}</div>
				<input
				type="number"
				step="0.01"
				ref="inputValue"
				value={this.props.value}
				onChange={this.update} />
			</div>
		);
	}
});

var CurrentRate = React.createClass({
	updateEUR: function(nUSD){
		var fUSD = parseFloat(nUSD);

		if (fUSD || fUSD==0)

		this.setState({EUR: fUSD*this.state.eRate, USD: fUSD, eRate: this.state.eRate, uRate: this.state.uRate});

	},
	updateUSD: function(nEUR){
		var fEUR = parseFloat(nEUR);

		if (fEUR || fEUR==0)

		this.setState({EUR: fEUR, USD: fEUR*this.state.uRate, eRate: this.state.eRate, uRate: this.state.uRate});
	},
	getInitialState: function() {
		return {EUR: 0, USD: 0, eRate: 1, uRate: 1};
	},
  	render: function() {
  		if (this.props.data.length > 0){
  			this.state.eRate = this.props.data[0].today[0].rate;
  			this.state.uRate = 1.0/this.state.eRate;
  			return (
	    		<div className="ui six column centered row">
		    		<div className="ui title container">
	        			<h1 className="ui center aligned">Today&#39;s exchange rate:</h1>
	        			<h1 className="ui center massive labels">
	        				<span className="ui label aqua" id="left-icon">&#36;1.00000</span>
	        				<i className="resize big horizontal icon"></i>
	        				<span className="ui label mandarin">&#8364;{this.state.eRate}</span>
	        			</h1>
	      			</div>
	        		
	        		<Currency value={this.state.USD} color="aqua" updateValue={this.updateEUR} symbol="&#36;"/>
	        		<i className="resize huge horizontal icon"></i>
	        		<Currency value={this.state.EUR} color="mandarin" updateValue={this.updateUSD} symbol="&#8364;"/>
	      		</div>
    		);
  		}
  		else{
  			return(
  				<div>
	        		Exchange Rate is unavailable.
	      		</div>
  			);
  		}
    	
  	}
});

var Dots=React.createClass({
    propTypes: {
        data:React.PropTypes.array,
        x:React.PropTypes.func,
        y:React.PropTypes.func
 
    },
    render:function(){
 
        var _self=this;
 
        //remove last & first point
        var data=this.props.data.splice(1);
        
 
        var circles=data.map(function(d,i){
 
            // return (<circle className="dot" r="7" cx={_self.props.x(d.day)} cy={_self.props.y(d.rate)} fill="#7dc7f4"
            //                 stroke="#fff" strokeWidth="2px" key={i} />
            //         );
        	return (<circle className="dot" r="8" cx={_self.props.x(d.day)} cy={_self.props.y(d.rate)} fill="#88F2DA"
                     key={i} strokeWidth="2px"
                    onMouseOver={_self.props.showToolTip} onMouseOut={_self.props.hideToolTip}
                    data-key={d3.time.format("%b %d %Y")(d.day)} data-value={d.rate}/>
              		);
        });
 
        return(
            <g>
                {circles}
            </g>
        );
    }
});

var Axis=React.createClass({
    propTypes: {
        h:React.PropTypes.number,
        axis:React.PropTypes.func,
        axisType:React.PropTypes.oneOf(['x','y'])
 
    },
 
    componentDidUpdate: function () { this.renderAxis(); },
    componentDidMount: function () { this.renderAxis(); },
    renderAxis: function () {
        var node = ReactDOM.findDOMNode(this);
        if (this.props.axisType === "x")
	        d3.select(node).call(this.props.axis)
	            .selectAll("text")  
	            .style("text-anchor", "end")
	            .attr("dx", "-.8em")
	            .attr("dy", ".15em")
	            .attr("transform", "rotate(-35)" );
        else
        	d3.select(node).call(this.props.axis);
 
    },
    render: function () {
 
        var translate = "translate(0,"+(this.props.h)+")";
 
        return (
            <g className="axis" transform={this.props.axisType=='x'?translate:""} >
            </g>
        );
    }
 
});
 
var Grid=React.createClass({
    propTypes: {
        h:React.PropTypes.number,
        grid:React.PropTypes.func,
        gridType:React.PropTypes.oneOf(['x','y'])
    },
 
    componentDidUpdate: function () { this.renderGrid(); },
    componentDidMount: function () { this.renderGrid(); },
    renderGrid: function () {
        var node = ReactDOM.findDOMNode(this);
        d3.select(node).call(this.props.grid);
 
    },
    render: function () {
        var translate = "translate(0,"+(this.props.h)+")";
        return (
            <g className="y-grid" transform={this.props.gridType=='x'?translate:""}>
            </g>
        );
    }
 
});

var ToolTip=React.createClass({
    propTypes: {
        tooltip:React.PropTypes.object
    },
    render:function(){
        var visibility="hidden";
        var transform="";
        var x=0;
        var y=0;
        var width=150,height=70;
        var transformText='translate('+width/2+','+(height/2-5)+')';
        var transformArrow="";

        if(this.props.tooltip.display==true){
            var position = this.props.tooltip.pos;

            x= position.x;
            y= position.y;
            visibility="visible";


            if(y>height){
                transform='translate(' + (x-width/2) + ',' + (y-height-20) + ')';
                transformArrow='translate('+(width/2-20)+','+(height-2)+')';
            }else if(y<height){

                transform='translate(' + (x-width/2) + ',' + (Math.round(y)+20) + ')';
                transformArrow='translate('+(width/2-20)+','+0+') rotate(180,20,0)';
            }

        }else{
            visibility="hidden"
        }

        return (
            <g transform={transform}>
                <rect is width={width} height={height} rx="3" ry="3" visibility={visibility} fill="#FFB54F" opacity=".9" />
                <polygon is points="10,0  30,0  20,10" transform={transformArrow}
                         fill="#FFB54F" opacity=".9" visibility={visibility}/>
                <text is visibility={visibility} transform={transformText}>
                    <tspan is x="0" text-anchor="middle" font-size="15px" fill="#fff" opacity=".7">{this.props.tooltip.data.key}</tspan>
                    <tspan is x="0" text-anchor="middle" dy="25" font-size="20px" fill="#fff">&#8364;{this.props.tooltip.data.value}</tspan>
                </text>
            </g>
        );
    }
});

var Graph = React.createClass({
 
    propTypes: {
        width:React.PropTypes.number,
        height:React.PropTypes.number,
        ticks:React.PropTypes.number,
        timeFormat:React.PropTypes.string,
        dataType: React.PropTypes.string,
        chartId:React.PropTypes.string
    },
 
    getDefaultProps: function() {
        return {
            width: 800,
            height: 500,
            ticks: 7,
            timeFormat: "%b %d",
            dataType: "week",
            chartId: 'week',
        };
    },
    getInitialState:function(){
        return {
        	tooltip:{ display:false,data:{key:'',value:''}},
            width:this.props.width,
            data: []
        };
    },
    showToolTip:function(e){
	    e.target.setAttribute('fill', '#BFFFE5');
	    e.target.setAttribute('stroke', '#88F2DA');

	    this.setState({tooltip:{
	        display:true,
	        data: {
	            key:e.target.getAttribute('data-key'),
	            value:e.target.getAttribute('data-value')
	            },
	        pos:{
	            x:e.target.getAttribute('cx'),
	            y:e.target.getAttribute('cy')
	        }

	        }
	    });
	},
	hideToolTip:function(e){
	    e.target.setAttribute('fill', '#88F2DA');
	    e.target.setAttribute('stroke', 'none');
	    this.setState({tooltip:{ display:false,data:{key:'',value:''}}});
	},
    render:function(){
 		if (this.props.data.length < 1){
 			return (
 				<div></div>
 			);

 		}
 		else{
 			var date = {}
 			var data = []
 			for (var i = 0; i < this.props.data[0][this.props.dataType].length; i++){
 				if (!date[this.props.data[0][this.props.dataType][i].date]){
 					date[this.props.data[0][this.props.dataType][i].date] = true;
 					data.push(this.props.data[0][this.props.dataType][i]);
 				}
 			}

 			var margin = {top: 20, right: 75, bottom: 50, left: 75},
            w = this.state.width - (margin.left + margin.right),
            h = this.props.height - (margin.top + margin.bottom);

	 		var parseDate = d3.time.format("%Y-%m-%d").parse;
 
	        data.forEach(function (d) {
	            d.day = parseDate(d.date);
	        });

	        data.sort(function(a,b){
			  return a.day-b.day;
			});

	        var x = d3.time.scale()
	            .domain(d3.extent(data, function (d) {
	                return d.day;
	            }))
	            .rangeRound([0, w]);
	        var ymin = d3.min(data,function(d){
	                return d.rate;
	            });
	        var ymax = d3.max(data,function(d){
	                return d.rate;
	            })
	        var pad = (ymax - ymin)*.1
	 
	        var y = d3.scale.linear()
	            .domain([ymin - pad, ymax+pad])
	            .range([h, 0]);
	 
	        var line = d3.svg.line()
	            .x(function (d) {
	                return x(d.day);
	            })
	            .y(function (d) {
	                return y(d.rate);
	            }).interpolate('cardinal');
	 
	        var transform='translate(' + margin.left + ',' + margin.top + ')';

	        var timeFormat = d3.time.format(this.props.timeFormat);
	        var yAxis = d3.svg.axis()
            .scale(y)
            .orient('left')
            .ticks(5);
 
			var xAxis = d3.svg.axis()
			   .scale(x)
			   .orient('bottom')
			   .tickFormat(timeFormat)
			   // .tickValues(data.map(function(d,i){
			   //     return d.day;
			   // }).splice(1))
			   .ticks(this.props.ticks);
			 
			var yGrid = d3.svg.axis()
			   .scale(y)
			   .orient('left')
			   .ticks(5)
			   .tickSize(-w, 0, 0)
			   .tickFormat("");
	 
	        return (
	            <div>
	                <svg id={this.props.chartId} width={this.state.width} height={this.props.height}>
	 					<defs>
						    <filter id="dropshadow" height="130%">
						      <feGaussianBlur in="SourceAlpha" stdDeviation="3"/> 
						      <feOffset dx="2" dy="2" result="offsetblur"/>
						      <feComponentTransfer>
						        <feFuncA type="linear" slope="0.2"/>
						      </feComponentTransfer>
						      <feMerge> 
						        <feMergeNode/>
						        <feMergeNode in="SourceGraphic"/> 
						      </feMerge>
						    </filter>
						  </defs>
	                    <g transform={transform}>
	                    	<Grid h={h} grid={yGrid} gridType="y"/>
							<Axis h={h} axis={yAxis} axisType="y" />
							<Axis h={h} axis={xAxis} axisType="x"/>
	                        <path className="line" d={line(data)} strokeLinecap="round" />
	                        <Dots data={data} x={x} y={y} showToolTip={this.showToolTip} hideToolTip={this.hideToolTip}/>
	                        <ToolTip tooltip={this.state.tooltip}/>
	                        
	                    </g>
	                </svg>
	            </div>
	        );

 		}
        
    }
});

var Exchange = React.createClass({
	getInitialState: function() {
    	return {data: [], visibility:false};
  	},
  	componentDidMount: function(){
  		// $.ajax({
  		// 	url: "http://api.fixer.io/latest?base=USD",
  		// 	dataType: "json",
  		// 	success: function(data){
  		// 		this.setState({data: data.rates.EUR});
  		// 	}.bind(this),
  		// 	error: function(xhr, status, err) {
  		// 		console.error(status, err.toString());
  		// 	}.bind(this)

  		// });
		var deferred = [];
		var week = []; //{date, rate}
		var month = [];
		var year = [];
		var decade = [];
		var today = [];

		var w = new Date();
		var m = new Date();
		var y = new Date();
		var d = new Date();

		var i = 0;

		deferred.push(
				$.ajax({
		  			url: "http://api.fixer.io/latest?base=USD",
		  			dataType: "json",
		  			success: function(data, stat){
		  				var rate = data.rates.EUR;
						today.push({date: this.url.slice(20,30), rate: rate});
		  			},
		  			error: function(xhr, status, err) {
		  				console.error(status, err.toString());
		  			}
		  		})
			);

		while (i < 8){
			var date = w.toISOString().slice(0,10);
			deferred.push(
				$.ajax({
		  			url: "http://api.fixer.io/"+date+"?base=USD",
		  			dataType: "json",
		  			success: function(data, stat){
		  				var rate = data.rates.EUR;
						week.push({date: this.url.slice(20,30), rate: rate});
		  			},
		  			error: function(xhr, status, err) {
		  				console.error(status, err.toString());
		  			}
		  		})
			);
			w.setDate(w.getDate() - 1)
			i += 1;
		}
		i = 0;
		while (i < 31){
			var date = m.toISOString().slice(0,10);
			deferred.push(
				$.ajax({
		  			url: "http://api.fixer.io/"+date+"?base=USD",
		  			dataType: "json",
		  			success: function(data){
		  				var rate = data.rates.EUR;
						month.push({date: this.url.slice(20,30), rate: rate});
		  			},
		  			error: function(xhr, status, err) {
		  				console.error(status, err.toString());
		  			}
		  		})
			);
			m.setDate(m.getDate() - 1)
			i += 1;
		}
		i = 0;
		while (i < 13){
			var date = y.toISOString().slice(0,10);
			deferred.push(
				$.ajax({
		  			url: "http://api.fixer.io/"+date+"?base=USD",
		  			dataType: "json",
		  			success: function(data){
		  				var rate = data.rates.EUR;
						year.push({date: this.url.slice(20,30), rate: rate});
		  			},
		  			error: function(xhr, status, err) {
		  				console.error(status, err.toString());
		  			}
		  		})
			);
			y.setMonth(y.getMonth() - 1)
			i += 1;
		}
		i = 0;
		while (i < 11){
			var date = d.toISOString().slice(0,10);
			deferred.push(
				$.ajax({
		  			url: "http://api.fixer.io/"+date+"?base=USD",
		  			dataType: "json",
		  			success: function(data){
		  				var rate = data.rates.EUR;
						decade.push({date: this.url.slice(20,30), rate: rate});
		  			},
		  			error: function(xhr, status, err) {
		  				console.error(status, err.toString());
		  			}
		  		})
			);
			d.setYear(d.getFullYear() - 1);
			i += 1;
		}

		$.when.apply(null, deferred).then(function(){
			var data = {today: today, week: week, month: month, year: year, decade: decade}
			this.setState({data:[data], visibility:true});
		}.bind(this));
		$('.menu .item')
		  .tab()
		;
  	},
  	render: function(){
  		var mTick = 10;
  		var yTick = 9;
  		var dTick = 10;
  		var viewState = this.state.visibility ? "visible":"hidden";
  		var loadState = this.state.visibility ? "none":"block";
  		var divStyle = {visibility:viewState}
  		var placeHolder = {display:loadState}

  		return (
  			<div>
  				<div className="placeHolder" style={placeHolder}>
	  				<div className="spin"><i className="circle notched icon large"></i></div>
	  				<p>Loading</p>
	  			</div>
	  			<div className="ui two column centered grid" style={divStyle}>
	  				
	  				<CurrentRate data={this.state.data} />
	  				<div className="ui pointing secondary menu">
					  <a className="item active" data-tab="first">Week</a>
					  <a className="item" data-tab="second">Month</a>
					  <a className="item" data-tab="third">Year</a>
					  <a className="item" data-tab="fourth">Decade</a>
					</div>
					<div className="ui bottom attached tab segment active" id="first" data-tab="first">
	  					<Graph data={this.state.data} />
	  				</div>
	  				<div className="ui bottom attached tab segment" data-tab="second">
	  					<Graph data={this.state.data} ticks={mTick} dataType="month" />
	  				</div>
	  				<div className="ui bottom attached tab segment" data-tab="third">
	  					<Graph data={this.state.data} ticks={yTick} dataType="year" timeFormat="%b %Y"/>
	  				</div>
	  				<div className="ui bottom attached tab segment" data-tab="fourth">
	  					<Graph data={this.state.data} ticks={dTick} dataType="decade" timeFormat="%Y"/>
	  				</div>
	  			</div>
	  		</div>
  		);
  	}

});


ReactDOM.render(
  	<Exchange url="http://api.fixer.io/" />,
  	document.getElementById('content')
);