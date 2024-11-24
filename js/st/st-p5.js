/* st-p5.js */

st.p5 = {
	backgroundImg: null,
	font: null, 
	ratio: 500,
	
	time: { 
		current: 0,
		last: 0,
		delta: 0,
		cumDelta: 0,
		scale: 250
	},

	real: {
		full: 20000,
		major: 2500,
		minor: 500
	},

	init: function() {
		st.log("st.p5.init");

		var w = window.innerWidth;
		var h = window.innerHeight;

		st.p5.real.ratio = st.p5.real.full / h;

		var canvas = $("#st-canvas")[0];
		createCanvas(w, h, WEBGL, canvas);
		st.p5.w = w;
		st.p5.h = h;

		st.planes.init();
	},
	
	drawBackground: function() {
		clear();
	}
};

/* p5 methods */

function setup() {
	st.p5.init();
}

function draw() {
	st.time.updateTime();
	st.p5.drawBackground();
	st.p5.drawCities();
	st.p5.drawGrid();
	st.p5.drawClouds();
	st.p5.drawPlanes({mode:"shadow", detail: true});
	st.p5.drawSmokes();
	st.p5.drawPlanes({mode:"normal"});
	st.p5.drawBullets();
}

function preload() {
	st.p5.font = loadFont('./font/inconsolata.otf');
}