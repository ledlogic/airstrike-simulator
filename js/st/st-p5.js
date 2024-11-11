function setup() {
	st.p5.init();
}

function draw() {
	st.p5.drawSky();
	st.p5.drawPlanes();
}

function preload() {
	st.p5.font = loadFont('./font/inconsolata.otf');
}

st.p5 = {
	ratio: 500,

	real: {
		height: 10000,
		width: 5000
	},

	init: function() {
		var w = window.innerWidth - 32;
		var h = window.innerHeight - 140;

		st.p5.real.ratio = st.p5.real.height / h;

		var canvas = $("#st-canvas")[0];
		createCanvas(w, h, WEBGL, canvas);
		st.p5.w = w;
		st.p5.h = h;

		st.planes.init();
	},

	drawSky: function() {
		var ratio = st.p5.real.ratio;

		stroke(155, 155, 255);
		strokeWeight(0.5);
		for (var realx = -5000; realx <= 10000; realx += 500) {
			var x1 = realx / ratio;
			var x2 = x1;
			var y1 = -10000 / ratio;
			var y2 = 10000 / ratio;
			line(x1, y1, x2, y2);
		}
		for (var realy = -5000; realy <= 10000; realy += 500) {
			var x1 = -10000 / ratio;
			var x2 = 10000 / ratio;
			var y1 = realy / ratio;
			var y2 = y1;
			line(x1, y1, x2, y2);
		}

		strokeWeight(1);
		for (var realx = -5000; realx <= 10000; realx += 2500) {
			var x1 = realx / ratio;
			var x2 = x1;
			var y1 = -10000 / ratio;
			var y2 = 10000 / ratio;
			line(x1, y1, x2, y2);
		}
		for (var realy = -5000; realy <= 10000; realy += 2500) {
			var x1 = -10000 / ratio;
			var x2 = 10000 / ratio;
			var y1 = realy / ratio;
			var y2 = y1;
			line(x1, y1, x2, y2);
		}

		strokeWeight(2);
		var x1 = 0 / ratio;
		var x2 = 0;
		var y1 = -10000 / ratio;
		var y2 = 10000 / ratio;
		line(x1, y1, x2, y2);

		var x1 = -10000 / ratio;
		var x2 = 10000 / ratio;
		var y1 = 0;
		var y2 = 0;
		line(x1, y1, x2, y2);
	},

	drawPlanes: function() {
		strokeWeight(3);

		var ratio = st.p5.real.ratio;
		var planes = st.planes.planes;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];

			var x = plane.x / ratio;
			var y = -plane.y / ratio;
			var a = plane.a;
			var canvasa = 90.0 - a;

			// fuselage
			stroke('gray');
			fill(0, 0, 0, 0);
			var r = 10;
			var x1 = x + 0.75 * r * Math.cos(canvasa / 180.0 * Math.PI);
			var y1 = y - 0.75 * r * Math.sin(canvasa / 180.0 * Math.PI);
			var x2 = x + r * Math.cos((canvasa + 180.0) / 180.0 * Math.PI);
			var y2 = y - r * Math.sin((canvasa + 180.0) / 180.0 * Math.PI)
			line(x1, y1, x2, y2);
			
			// wing
			var winga = canvasa + 90.0;
			var r = 10.0;
			var x1 = x + r * Math.cos(winga / 180.0 * Math.PI);
			var y1 = y - r * Math.sin(winga / 180.0 * Math.PI);
			var x2 = x + r * Math.cos((winga + 180.0) / 180.0 * Math.PI);
			var y2 = y - r * Math.sin((winga + 180.0) / 180.0 * Math.PI)
			line(x1, y1, x2, y2);
			
			stroke('gray');
			var r = 4;
			var x1 = x + r * Math.cos(canvasa / 180.0 * Math.PI);
			var y1 = y - r * Math.sin(canvasa / 180.0 * Math.PI);
			var x2 = x + r * Math.cos((canvasa + 180.0) / 180.0 * Math.PI);
			var y2 = y - r * Math.sin((canvasa + 180.0) / 180.0 * Math.PI)
			circle(x1, y1, 2);
		
			// light blue center and outer radius
			stroke(155, 155, 255);
			circle(x, y, 2);
			circle(x, y, 25);

			fill('red');
			textFont(st.p5.font);
			var t = "p" + i + " (" + Math.round(a) + ")";
			text(t, x-20, y + 20);

			var t = "(" + Math.round(plane.x) + ", " + Math.round(plane.y) + ")";
			text(t, x-20, y + 30);
		}
	}
};