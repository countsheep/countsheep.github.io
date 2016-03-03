var streams = [];
var button = document.getElementById('search-bt');
var field = document.getElementById('search-val');

var found = document.getElementById("found-results");
var none = document.getElementById("no-results");

var table = document.getElementById('content');
var tBody = table.tBodies[0];

var results = document.getElementById('result-num');
var pgno = document.getElementById('pgno');
var pages = document.getElementById('pages');
var currentpg = 0;
var totalpg = 0;

var first = document.getElementById('first');
var last = document.getElementById('last');
var prev = document.getElementById('prev');
var p_link = "#";
var last = document.getElementById('last');
var l_link = "#";

var reset = false;

//create stream objects to change with results
var Stream = function(){
	this.row = document.createElement("tr");
	var picCell = document.createElement("td");
	var textCell = document.createElement("td")
	this.image = document.createElement("img");
	this.image.width = 320;
	this.image.height = 180;
	this.title = document.createElement("h3");
	this.info = document.createElement("div");
	textCell.appendChild(this.title);
	textCell.appendChild(this.info);
	picCell.appendChild(this.image);
	this.row.appendChild(picCell);
	this.row.appendChild(textCell);
	this.destination = "#";
	this.f = function(){};
}

Stream.prototype.hide = function() {
	this.row.style.display = 'none';
};

Stream.prototype.show = function() {
	this.row.style.display = 'block';
};

Stream.prototype.changePicture = function(link) {
	this.image.setAttribute("src", link);
};

Stream.prototype.changeTitle = function(title) {
	this.title.innerHTML = title;
};

Stream.prototype.changeInfo = function(game, views, time, status) {
	var info = game + " - "
				+ views + " viewers <br/>"
				+ "Created at "+ time + "<br/>"
				+ status;
	this.info.innerHTML = info;
};

Stream.prototype.changeLink = function(link) {
	this.destination = link;
}

var updateRow = function(stream, desc){
	stream.changePicture(desc.preview.medium);
	stream.changeTitle(desc.channel.display_name);
	stream.changeInfo(desc.game, desc.viewers, desc.created_at, desc.channel.status);
	stream.changeLink(desc._links.self);
}

var updateContent = function(data){
	pgno.innerHTML = currentpg;
	var numStreams = data.streams.length;
	for (var i = 0; i < 10; i++){
		var stream = streams[i]
		if (i < numStreams){
			updateRow(stream, data.streams[i]);
			stream.show();
		}
		else{
			stream.hide();
		}
	}
	if (typeof data._links.prev === "undefined"){
		first.style.display = 'inline-block';
		prev.style.display = 'none';
	}
	else{
		prev.style.display = 'inline-block';
		first.style.display = 'none';
		p_link = data._links.prev+"&callback=updateContent";
	}

	if (numStreams == 0 || currentpg >= totalpg){
		last.style.display = 'inline-block';
		next.style.display = 'none';
	}
	else{
		next.style.display = 'inline-block';
		last.style.display = 'none';
		l_link = data._links.next+"&callback=updateContent";
	}
}

var resetSearch = function(data){
	var total = data._total;
	results.innerHTML = total;
	if (total == 0){
		found.style.display = 'none';
		none.style.display = 'block';

	}
	else{
		none.style.display = 'none';
		found.style.display = 'block';
		totalpg = Math.max(Math.ceil(total/10), 1);
		pages.innerHTML = totalpg;
		currentpg = 1;
		updateContent(data);
	}
}

var nextPage = function(){
	currentpg += 1;
	console.log(l_link)
	getData(l_link);
}

var prevPage = function(){
	currentpg -= 1;
	getData(p_link)
}

var getData = function(url){
	var jsonp = document.createElement("script");
	jsonp.type = "application/javascript";
	jsonp.src = url;
	document.body.appendChild(jsonp);
	document.body.removeChild(jsonp);
}

var search = function(){
	reset = true;
	var input = field.value;
	if (input.trim() != ""){
		var query = encodeURI(input);
		var url = "https://api.twitch.tv/kraken/search/streams?q="+query+"&callback=resetSearch";
		getData(url);
	}
}

var entered = function(e){
	if(e.keyCode === 13){
		search();
    }
}

button.addEventListener("click", search);
prev.addEventListener("click", prevPage);
next.addEventListener("click", nextPage);

for (var i = 0; i < 10; i++){
	var stream = new Stream();
	streams.push(stream);
	tBody.appendChild(stream.row);
}
