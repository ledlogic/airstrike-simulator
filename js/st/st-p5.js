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
	},

	drawGrid: function() {
		var ratio = st.p5.real.ratio;

		fill(0, 0, 0);
		stroke(0, 0, 0);
		strokeWeight(0.5);
		
		for (var realx = -st.p5.real.full; realx <= st.p5.real.full; realx += st.p5.real.minor) {
			var x1 = realx / ratio;
			var x2 = x1;
			var y1 = -st.p5.real.full / ratio;
			var y2 = st.p5.real.full / ratio;
			line(x1, y1, x2, y2);
		}

		for (var realy = -st.p5.real.full; realy <= st.p5.real.full; realy += st.p5.real.minor) {
			var x1 = -st.p5.real.full / ratio;
			var x2 = st.p5.real.full / ratio;
			var y1 = realy / ratio;
			var y2 = y1;
			line(x1, y1, x2, y2);
		}

		strokeWeight(1);
		for (var realx = -st.p5.real.full; realx <= st.p5.real.full; realx += st.p5.real.major) {
			var x1 = realx / ratio;
			var x2 = x1;
			var y1 = -st.p5.real.full / ratio;
			var y2 = st.p5.real.full / ratio;
			line(x1, y1, x2, y2);
			
			var t = Math.round(realx);
			text(t, x1+4, 12);
		}

		for (var realy = -st.p5.real.full; realy <= st.p5.real.full; realy += st.p5.real.major) {
			var x1 = -st.p5.real.full / ratio;
			var x2 = st.p5.real.full / ratio;
			var y1 = realy / ratio;
			var y2 = y1;
			line(x1, y1, x2, y2);

			var t = Math.round(realy);
			text(t, 12, y1+4);
		}

		strokeWeight(2);
		var x1 = 0 / ratio;
		var x2 = 0;
		var y1 = -st.p5.real.full / ratio;
		var y2 = st.p5.real.full / ratio;
		line(x1, y1, x2, y2);

		var x1 = -st.p5.real.full / ratio;
		var x2 = st.p5.real.full / ratio;
		var y1 = 0;
		var y2 = 0;
		line(x1, y1, x2, y2);
	},

	drawClouds: function() {
		var ratio = st.p5.real.ratio;
		var clouds = st.clouds.clouds;
		for (var i = 0; i < clouds.length; i++) {
			var cloud = clouds[i];

			var x = cloud.x / ratio;
			var y = -cloud.y / ratio;
			var r = cloud.r / ratio;
			var a = cloud.a;

			var points = cloud.points;
			for (var j = 0; j < points.length; j++) {
				var point = points[j];
				
				var x1 = (cloud.x + point.x) / ratio;
				var y1 = -(cloud.y + point.y) / ratio;
				var r1 = point.r / ratio;
				var a1 = point.a;
				
				stroke(0,0,0,0);
				fill(255,255,255,a1);
				circle(x1, y1, r1);
			}
		}
	},

	drawSmoke: function() {
		var ratio = st.p5.real.ratio;
		var planes = st.planes.planes;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];
			var smokes = plane.smokes;
			for (var j = 0; j < smokes.length; j++) {
				var smoke = smokes[j];
				var x = smoke.x / ratio;
				var y = -smoke.y / ratio;
				var a = smoke.a;
				stroke(0,0,0,a);
				circle(x, y, 2);
			}
		}
	},

	drawPlanes: function(opts) {
		var ratio = st.p5.real.ratio;
		var planes = st.planes.planes;
		var mode = opts.mode;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];
			if (plane.structure > 0) {

				var x = plane.x / ratio;
				var y = -plane.y / ratio;
				var a = plane.a;
				var canvasa = 90.0 - a;
	
				// fuselage
				var r = 10;
				var fuselageColor = 'black';
				
				var team = plane.team;
				var fuselageColor = st.teams.getTeamColor(team);
				var brightnessRange = 5;
				var brightness = plane.brightness;
				var brightnessDelta = Math.round(brightnessRange * (0.5 - Math.random()));
				brightness = brightness + brightnessDelta;
				plane.brightness = brightness;
				
				fuselageColor = "rgb("
					+ st.math.fixColor(fuselageColor[0] + brightness)
					+ ","
					+ st.math.fixColor(fuselageColor[1] + brightness)
					+ ","
					+ st.math.fixColor(fuselageColor[2] + brightness)
					+ ")";
								
				var shadowPt = { x: 0, y: 0 };
				if (mode == "shadow") {
					fuselageColor = 'rgb(50,50,50)';
					shadowPt = { x: -10, y: 10 };
					r = 5;
				}
				stroke(fuselageColor);
				strokeWeight(0.3 * r);
				fill(0, 0, 0, 0);

				var x1 = x + 0.75 * r * Math.cos(canvasa / 180.0 * Math.PI) + shadowPt.x;
				var y1 = y - 0.75 * r * Math.sin(canvasa / 180.0 * Math.PI) + shadowPt.y;
				var fx2 = x + r * Math.cos((canvasa + 180.0) / 180.0 * Math.PI) + shadowPt.x;
				var fy2 = y - r * Math.sin((canvasa + 180.0) / 180.0 * Math.PI) + shadowPt.y;
				line(x1, y1, fx2, fy2);
	
				// wing
				var winga = canvasa + 90.0;
				var x1 = x + r * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
				var y1 = y - r * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;
				var x2 = x + r * Math.cos((winga + 180.0) / 180.0 * Math.PI) + shadowPt.x;
				var y2 = y - r * Math.sin((winga + 180.0) / 180.0 * Math.PI) + shadowPt.y;
				line(x1, y1, x2, y2);
	
				// tail
				strokeWeight(2.5);
				var tr = 0.3 * r;
				var rr = 0.9;
				var tx2 = ((1-rr) * x + rr*fx2);
				var ty2 = ((1-rr) * y + rr*fy2);
				var x1 = tx2 + tr * Math.cos(winga / 180.0 * Math.PI);
				var y1 = ty2 - tr * Math.sin(winga / 180.0 * Math.PI);
				var x2 = tx2 + tr * Math.cos((winga + 180.0) / 180.0 * Math.PI);
				var y2 = ty2 - tr * Math.sin((winga + 180.0) / 180.0 * Math.PI);
				line(x1, y1, x2, y2);
	
				// detail
				if (opts.detail) {
					fill(fuselageColor);
					textFont(st.p5.font);
					var t = "p" + i;
					text(t, x - 20, y + 20);
	
	 				var t = " (" + Math.round(plane.x) + "m, " + Math.round(plane.y) + "m, " + Math.round(a) + "°)";
					text(t, x - 20, y + 30);
		
					var t = " hull: " + Math.round(plane.hull) + ", structure: " + Math.round(plane.structure);
					text(t, x - 20, y + 40);
	
					if (plane.target != -1) {
						var t = "-> p" + plane.target + ": " + Math.round(plane.targetDist) + "m";
						text(t, x - 20, y + 50);
					}
				} else {
					fill(fuselageColor);
					textFont(st.p5.font);
					var t = "p" + i;
					text(t, x - 20, y + 20);
					
				}	
			}
		}
	},
	
	updateTime: function() {
		var current = millis();
		st.p5.time.current = current;
	
		var smokeDelta = 75;
		var last = st.p5.time.last;
		if (current) {
			var delta = current - last;
			st.p5.time.delta = delta;
			
			// smokes			
			st.p5.time.cumDelta += delta;		
			if (st.p5.time.cumDelta > smokeDelta) {
				st.p5.updateSmokes();
				st.p5.time.cumDelta -= smokeDelta;
			}
			
			// planes
			st.planes.updateTargets();
			st.p5.updateAngles();
			st.p5.updatePositions();
			
			// clouds
			st.p5.updateClouds();
		}
		st.p5.time.last = current;
	},
	
	updateAngles: function() {
		var planes = st.planes.planes;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];
			if (plane.structure > 0) {
				if (plane.target > -1 && i != plane.target && planes[plane.target].structure > 0) {
					var dist = st.planes.calcIndexDistance(i, plane.target) * st.p5.time.delta;
					plane.targetDist = dist;
					if (dist < st.planes.minDistTarget(plane)) {
						st.planes.shoot(plane);
					}
					var targetA = st.planes.calcIndexAngle(i, plane.target);
					plane.targetA = targetA;
					st.p5.updatePlane(plane, targetA);
				} else {
					var targetA = plane.homeAngle;
					st.p5.updatePlane(plane, targetA);
				}
			}
		}
	},
	
	updatePlane: function(plane, targetA) {
		var planeA = plane.a;
		var dA = (targetA - planeA);
		if (dA > 180) {
			dA = 180 - dA;
		}
		var deltaA = 0;
		if (dA > 0) {
			deltaA = Math.min(dA, 3);
		}
		if (dA < 0) {
			deltaA = Math.max(dA, -3);
		}
		plane.a += deltaA;
		
		while (plane.a > 360.0) {
			plane.a -= 360.0;
		}
		while (plane.a < 0.0) {
			plane.a += 360.0;
		}		
	},
	
	updatePositions: function() {
		var planes = st.planes.planes;
		var scale = st.p5.time.scale;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];

			if (plane.structure > 0) {
				var x = plane.x;
				var y = plane.y;
				var a = plane.a;
				var v = plane.v;
				
				// convert from geographic
				var canvasa = 90.0 - a;
	
				var mc = Math.cos(canvasa / 180.0 * Math.PI);
				var ms = Math.sin(canvasa / 180.0 * Math.PI);
	
				x += mc * v * st.p5.time.delta / scale;
				y += ms * v * st.p5.time.delta / scale;
				
				plane.x = x;
				plane.y = y;
			}
		}
	},
	
	updateSmokes: function() {
		var smokeDelta = 10;
		
		var planes = st.planes.planes;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];

			// fade smoke
			var smokes = plane.smokes;
			var minJ = 0;
			for (var j = 0; j < smokes.length; j++) {
				var smoke = smokes[j];
				smoke.a = smoke.a - smokeDelta;
				if (smoke.a <= 0) {
					minJ = j;	
				}
			}
			if (minJ > 0) {
				plane.smokes = _.drop(smokes, minJ);
			}

			if (plane.structure > 0) {
				var x = plane.x;
				var y = plane.y;
				var pt = {
					x : x, 
					y: y,
					a: 180
				};
				plane.smokes.push(pt);
			}
		}
	},
	
	updateClouds: function() {
		var clouds = st.clouds.clouds;
		var drift = st.clouds.drift;
		for (var i = 0; i < clouds.length; i++) {
			var cloud = clouds[i];
			cloud.x += drift.x;
			cloud.y += drift.y;
			
			if (cloud.x < -st.p5.real.full) {
				cloud.x = st.p5.real.full;
			}
			if (cloud.x > st.p5.real.full) {
				cloud.x = -st.p5.real.full;
			}
			if (cloud.y < -st.p5.real.full) {
				cloud.y = st.p5.real.full;
			}
			if (cloud.y > st.p5.real.full) {
				cloud.y = -st.p5.real.full;
			}			
			
			var points = cloud.points;
			for (var j = 0; j < points.length; j++) {
				var point = points[j];
				point.x += point.vy + st.math.randomBetween(-0.1, 0.1);
				point.y += point.vy + st.math.randomBetween(-0.1, 0.1);
			}
		}
	}
};

/* p5 methods */

function setup() {
	st.p5.init();
}

function draw() {
	st.p5.updateTime();
	st.p5.drawBackground();
	st.p5.drawGrid();
	st.p5.drawClouds();
	st.p5.drawPlanes({mode:"shadow"});
	st.p5.drawSmoke();
	st.p5.drawPlanes({mode:"normal"});
}

function preload() {
	st.p5.font = loadFont('./font/inconsolata.otf');
	st.p5.backgroundImg = loadImage('img/pripyat-river.jpg');
}