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
			
			// draw points		
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
				stroke(0,0,0,0);
				fill(0,0,0,a);
				circle(x, y, 5);
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
				var team = plane.team;
				var fuselageColor = st.teams.getTeamColor(team);
				var brightnessRange = 1.5;
				var brightnessDelta = plane.brightnessDelta;
				var newDelta = Math.round(brightnessRange * (0.5 - Math.random()));
				brightnessDelta += newDelta;
				plane.brightness = brightnessDelta;
				
				var fuselageColorStr = "rgb("
					+ st.math.fixColor(fuselageColor[0] + brightnessDelta)
					+ ","
					+ st.math.fixColor(fuselageColor[1] + brightnessDelta)
					+ ","
					+ st.math.fixColor(fuselageColor[2] + brightnessDelta)
					+ ")";

				var wingColorStr = "rgb("
					+ st.math.fixColor(fuselageColor[0] + brightnessDelta - 30.0)
					+ ","
					+ st.math.fixColor(fuselageColor[1] + brightnessDelta - 30.0)
					+ ","
					+ st.math.fixColor(fuselageColor[2] + brightnessDelta - 30.0)
					+ ")";
								
				var shadowPt = { x: 0, y: 0 };
				if (mode == "shadow") {
					fuselageColorStr = 'rgb(50,50,50)';
					wingColorStr = 'rgb(50,50,50)';
					shadowPt = { x: -10, y: 10 };
					r = 5;
				}
	
				// wing
				switch (plane.type) {
					case "tl5-biplane":
						// tail
						var winga = canvasa + 160.0;
						var wingb = canvasa - 160.0;
						var x1 = x + r * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;
						var x2 = x + r * Math.cos(wingb / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * Math.sin(wingb / 180.0 * Math.PI) + shadowPt.y;
						strokeWeight(2.5);
						stroke(wingColorStr);
						line(x1, y1, x2, y2);

						//  lower wing
						var winga = canvasa + 85.0;
						var wingb = canvasa - 85.0;
						var x1 = x + r * 0.9 * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 0.9 * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;
						var x2 = x + r * 0.9 * Math.cos(wingb / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * 0.9 * Math.sin(wingb / 180.0 * Math.PI) + shadowPt.y;
						stroke(wingColorStr);
						line(x1, y1, x2, y2);

						// fuselage
						var x1 = x + 0.75 * r * Math.cos(canvasa / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - 0.75 * r * Math.sin(canvasa / 180.0 * Math.PI) + shadowPt.y;
						var fx2 = x + r * Math.cos((canvasa + 180.0) / 180.0 * Math.PI) + shadowPt.x;
						var fy2 = y - r * Math.sin((canvasa + 180.0) / 180.0 * Math.PI) + shadowPt.y;
						fill(0, 0, 0, 0);
						strokeWeight(0.3 * r);
						stroke(fuselageColorStr);
						line(x1, y1, fx2, fy2);

						// top wing
						var winga = canvasa + 75.0;
						var wingb = canvasa - 75.0;
						var x1 = x + r * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;
						var x2 = x + r * Math.cos(wingb / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * Math.sin(wingb / 180.0 * Math.PI) + shadowPt.y;
						stroke(fuselageColorStr);
						line(x1, y1, x2, y2);
					
						break;

					case "tl6-propfighter": 
						// tail
						var winga = canvasa + 155.0;
						var wingb = canvasa - 155.0;
						var x1 = x + r * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;
						var x2 = x + r * Math.cos(wingb / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * Math.sin(wingb / 180.0 * Math.PI) + shadowPt.y;
						strokeWeight(1.8);
						stroke(wingColorStr);
						line(x1, y1, x2, y2);

						// wing
						var winga = canvasa + 85.0;
						var wingb = canvasa - 85.0;
						var x1 = x + r * 0.9 * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 0.9 * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;
						var x2 = x + r * 0.9 * Math.cos(wingb / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * 0.9 * Math.sin(wingb / 180.0 * Math.PI) + shadowPt.y;
						strokeWeight(3);
						stroke(wingColorStr);
						line(x1, y1, x2, y2);
			
						// fuselage
						var x1 = x + 0.75 * r * Math.cos(canvasa / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - 0.75 * r * Math.sin(canvasa / 180.0 * Math.PI) + shadowPt.y;
						var fx2 = x + r * Math.cos((canvasa + 180.0) / 180.0 * Math.PI) + shadowPt.x;
						var fy2 = y - r * Math.sin((canvasa + 180.0) / 180.0 * Math.PI) + shadowPt.y;
						fill(0, 0, 0, 0);
						strokeWeight(0.3 * r);
						stroke(fuselageColorStr);
						line(x1, y1, fx2, fy2);
					
						break;

					case "tl6-jetfighter":
						// tail
						var sweep = 160.0;
						var winga = canvasa + sweep;
						var x1 = x + r * 1 * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 1 * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;

						var sweep = 180.0;
						var wingc = canvasa + sweep;
						var x2 = x + r * 0.6 * Math.cos(wingc / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * 0.6 * Math.sin(wingc / 180.0 * Math.PI) + shadowPt.y;
						strokeWeight(2);
						stroke(wingColorStr);
						line(x1, y1, x2, y2);

						var sweep = 160.0;
						var wingb = canvasa - sweep;
						var x1 = x + r * 1 * Math.cos(wingb / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 1 * Math.sin(wingb / 180.0 * Math.PI) + shadowPt.y;
						stroke(wingColorStr);
						line(x1, y1, x2, y2);

						var sweep = 180.0;
						var wingc = canvasa - sweep;
						var x2 = x + r * 0.6 * Math.cos(wingc / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * 0.6 * Math.sin(wingc / 180.0 * Math.PI) + shadowPt.y;
						stroke(wingColorStr);
						line(x1, y1, x2, y2);
						
						// engine 
						var sweep = 20.0;
						var winga = canvasa + 90 - sweep;
						var wingb = canvasa + 90 + 2 * sweep;
						var x1 = x + r * 0.45 * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 0.45 * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;

						var x2 = x + r * 0.45 * Math.cos(wingb / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * 0.45 * Math.sin(wingb / 180.0 * Math.PI) + shadowPt.y;
						stroke(wingColorStr);
						line(x1, y1, x2, y2);
						
						var winga = canvasa - 90 - 2*sweep;
						var wingb = canvasa - 90 + sweep;
						var x1 = x + r * 0.45 * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 0.45 * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;

						var x2 = x + r * 0.45 * Math.cos(wingb / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * 0.45 * Math.sin(wingb / 180.0 * Math.PI) + shadowPt.y;
						stroke(wingColorStr);
						line(x1, y1, x2, y2);

						// wing 
						var sweep = 105.0;
						var winga = canvasa + sweep;
						var x1 = x + r * 0.9 * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 0.9 * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;

						var sweep = 85.0;
						var wingc = canvasa + sweep;
						var x2 = x + r * 0.1 * Math.cos(wingc / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * 0.1 * Math.sin(wingc / 180.0 * Math.PI) + shadowPt.y;
						stroke(wingColorStr);
						line(x1, y1, x2, y2);

						var sweep = 105.0;
						var wingb = canvasa - sweep;
						var x1 = x + r * 0.9 * Math.cos(wingb / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 0.9 * Math.sin(wingb / 180.0 * Math.PI) + shadowPt.y;
						stroke(wingColorStr);
						line(x1, y1, x2, y2);

						var sweep = 85.0;
						var wingc = canvasa - sweep;
						var x2 = x + r * 0.1 * Math.cos(wingc / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * 0.1 * Math.sin(wingc / 180.0 * Math.PI) + shadowPt.y;
						stroke(wingColorStr);
						line(x1, y1, x2, y2);
						
						// fuselage
						var x1 = x + 0.6 * r * Math.cos(canvasa / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - 0.6 * r * Math.sin(canvasa / 180.0 * Math.PI) + shadowPt.y;
						var fx2 = x + r * Math.cos((canvasa + 180.0) / 180.0 * Math.PI) + shadowPt.x;
						var fy2 = y - r * Math.sin((canvasa + 180.0) / 180.0 * Math.PI) + shadowPt.y;
						fill(0, 0, 0, 0);
						strokeWeight(0.2 * r);
						stroke(fuselageColorStr);
						line(x1, y1, fx2, fy2);
					
						break;
				}
	
				// detail
				fill(fuselageColorStr);
				textFont(st.p5.font);
				var t = "p" + i;
				text(t, x - 8, y + 24);
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
		
		var drift = st.clouds.drift;

		var planes = st.planes.planes;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];
			
			if (plane.smoke) {
				// fade smoke
				var smokes = plane.smokes;
				var minJ = 0;
				for (var j = 0; j < smokes.length; j++) {
					var smoke = smokes[j];
					smoke.a = smoke.a - smokeDelta;
					
					smoke.x += drift.x;
					smoke.y += drift.y;
					
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
		}
	},
	
	updateClouds: function() {
		var clouds = st.clouds.clouds;
		var drift = st.clouds.drift;
		var overflow = st.p5.real.full * 1.1;
		for (var i = 0; i < clouds.length; i++) {
			var cloud = clouds[i];
			cloud.x += drift.x + cloud.drift.x;
			cloud.y += drift.y + cloud.drift.y;
			
			var reset = false;
			if (cloud.x < -overflow) {
				cloud.x = overflow;
				reset = true;
			}
			if (cloud.x > overflow) {
				cloud.x = -overflow;
				reset = true;
			}
			if (cloud.y < -overflow) {
				cloud.y = overflow;
				reset = true;
			}
			if (cloud.y > overflow) {
				cloud.y = -overflow;
				reset = true;
			}
			if (reset) {
				var points = st.clouds.createPoints(cloud);
				cloud.points = points;
			}
			
			var points = cloud.points;
			for (var j = 0; j < points.length; j++) {
				var point = points[j];
				point.x += point.vx + st.math.randomBetween(-0.1, 0.1);
				point.y += point.vy + st.math.randomBetween(-0.1, 0.1);
				point.r += st.math.randomBetween(-0.1, 0.1);
				point.r = Math.max(point.r, st.clouds.MIN_POINT_RADIUS);
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