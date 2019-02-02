var analyzer, fft, colors;
var preSong = false;
var playing = false;
var paused = false;

var palettes = [['#E0E4CC', '#A7DBD8', '#69D2E7', '#71A9F7', '#F38630', '#FA6900', '#FF4E50', '#F9D423'], ['#ffc5b6', '#ffb0a1', '#fd9b89', '#ff9175', '#ff6565', '#D74147', '#B0152B'], ['#E0E4CC', '#A7DBD8', '#69D2E7', '#71A9F7', '#486C9E', '#03396c', '#000080'], ['#F8B195', '#F67280', '#C06C84', '#B077A9', '#6C5B7B', '#698EB2', '#355C7D'], ['#E1F5C4', '#EDE574', '#F9D423', '#FC913A', '#FA6900', '#FF4E50', '#ff3232'], ['#f0e4e4', '#dec3c3', '#851e3e', '#651e3e', '#451e3e', '#251e3e', '#051e3e'], ['#35a79c', '#54b2a9', '#65c3ba', '#83d0c9', '#7AFAC4', '#11C6C5', '#009688'], ['#ffffff', '#d0e1f9', '#4d648d', '#283655', '#385797', '#009BF9', '#00CFFA'], ['#f1faee', '#a8dadc', '#fb964c', '#e63946', '#457b9d', '#7C77FF', '#4BA0F7'], ['#F9F871', '#D4E975', '#A8F88B', '#46F0B5',' #00E2DE', '#00CFFA', '#00B8FF']];

// myArray[Math.floor(Math.random() * myArray.length)];
function setup() {
	var c = createCanvas(windowWidth, windowHeight);
	analyzer = new p5.Amplitude();
	fft = new p5.FFT();
	uploadBtn = createFileInput(uploaded);
	uploadBtn.elt.id = "file-upload";
	colors = palettes[2];

	var u = document.getElementById("u");
	var label = document.createElement("LABEL");
	label.innerText = "upload audio file";
	label.setAttribute("for", "file-upload");
	u.appendChild(label);


}

function loaded() {
	song.play(); 
}

function draw() {
	background(0,0,0);
	fft.analyze();
	
	staticLadder();
	if (playing) {
		topLadder();
	}
}

function uploaded(file) {
		console.log("a");
		if (playing) {
			song.pause();
		}		
		song = loadSound(file.data, loaded);
		playing=true;
		preSong=false;
	
	
}


function keyReleased() {
	if (key == ' ') {
		if (song.isPlaying()) {
	    song.pause();
	    paused = true;
	  } else {
	    song.play();
	    paused = false;
	  }
	}

	if (key == 'k' && !preSong) {
		if (playing) {
			song.pause();
		}
		preSong = true;
		song = loadSound('m.mp3', loaded);
		playing = true;
	}
	if (key == 'j') {
		colors = palettes[floor(random(palettes.length - 1))];
	}

}


function staticLadder() {
	stroke(255, 250, 250);
	strokeWeight(1.5);
	noFill();

	var xa = width/2 - 40;
	var xb = width/2 + 40;
	var y = height * (1/5);
	for (var steps = 0; steps < 13; steps++) {
		//draw circles
		ellipse(xa, y, 13);
		ellipse(xb, y, 13);
		


		y+=(height*1/2)/10;
		xa-=6;
		xb+=6;

	}
}

function topLadder() {
    stroke(255, 250, 250);
	strokeWeight(1.5);
    noFill();
   
    var xa = (width/2) - 40;
    var xb = (width/2) + 40;
    var y = height * (1/5);


    // animation
    var bass = fft.getEnergy("bass");
    // var mapBass = map( bass, 0, 255, width * (5/8), width * (3/8));
    var mapBass = map(bass, 0, 255, (width/2) - 40, (width/2) + (width * (7/16)));
    var xse = (width/2) - 40;
    var y = height * (1/5);
    var xso = (width/2) + 40;
    var f = xso;
    var g = xse;
    var mapBassOdd = map(bass, 0, 255, (width/2) + (width * (7/16), (width/2) + 60));

    var mid = fft.getEnergy( "mid" );     
    var mapMid = map(mid, 0, 255, (width/2) - 40, (width/2) + (width * (7/16)));


    



    // fill(255, 250, 250);

    for (var i = 0; i < 13; i++) {
    		var c = colors[(i + (i % 2))/2]
    	   	fill(c);

    	if (i % 2 == 0) {
    		stroke(255, 250, 250);
    		strokeWeight(1.5);
    		beginShape(POINTS);
 
    		var cxo = (xse*1.35) - ((mapMid/1.5)*(mapBass/1500));
    		var cxt = g + (((mapBass*(1/3)) + ((((i + (i % 2))/2)/2.5)*(mapBass/15))));

	    	for (let a = cxo; a < cxt; a += 5) {
	    		vertex(a, y);
	    	}
	    	endShape();
	    	stroke(c);
	    	ellipse((xse*1.35) - ((mapMid/1.5)*(mapBass/1500)), y, 13);
	    	ellipse(g + (((mapBass*(1/3)) + ((((i + (i % 2))/2)/2.5)*(mapBass/15)))), y, 13);
    	} 
    	else {

    		stroke(255, 250, 250);
    		strokeWeight(1.5);
    		beginShape(POINTS);
    		var cxbo = (xso*1.35) - ((mapMid/1.5)*(mapBass/1300));
    		var cxbt = (f) - ((mapBass*(1/3)) + ((((i + (i % 2))/2)/2.5)*(mapBass/15)));
    		for (let b = cxbt; b < cxbo; b += 5) {
	    		vertex(b, y);
	    	}
    		endShape();

    		stroke(c);
    		ellipse((xso*1.35) - ((mapMid/1.5)*(mapBass/1300)), y, 13);
    		ellipse((f) - ((mapBass*(1/3)) + ((((i + (i % 2))/2)/2.5)*(mapBass/15))), y, 13);
    	}
    	
    		treble = fft.getEnergy( "mid" ); 
			mapTreble = map(treble, 0, 255, xa, xb);
	
			push();
			strokeWeight(3);
			beginShape();
			vertex(mapTreble-(4*i+(i*1.5)), y)
			vertex(mapTreble, y);
			vertex(mapTreble+(4*i+(i*1.5)), y)
			endShape();
			pop();
    


    	xso += 12;
    	f -= 6;
    	xse -= 12;
	    g += 6;
    	y += (height * 1/2)/10;

    }

}

function polygon(x, y, radius, npoints) {
  var angle = TWO_PI / npoints;
  beginShape();
  for (var a = 0; a < TWO_PI; a += angle) {
    var sx = x + cos(a) * radius;
    var sy = y + sin(a) * radius;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}














