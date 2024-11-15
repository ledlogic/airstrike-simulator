function setup() {
	st.p5.init();
}

function draw() {
	st.p5.updateTime();
	st.p5.drawSky();
	st.p5.drawSmoke();
	st.p5.drawPlanes();
}

function preload() {
	st.p5.font = loadFont('./font/inconsolata.otf');
}

st.p5 = {
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
		var w = window.innerWidth - 32;
		var h = window.innerHeight - 140;

		st.p5.real.ratio = st.p5.real.full / h;

		var canvas = $("#st-canvas")[0];
		createCanvas(w, h, WEBGL, canvas);
		st.p5.w = w;
		st.p5.h = h;

		st.planes.init();
	},

	drawSky: function() {
		var ratio = st.p5.real.ratio;
		
		background(255);

		stroke(155, 155, 255);
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
		}
		for (var realy = -st.p5.real.full; realy <= st.p5.real.full; realy += st.p5.real.major) {
			var x1 = -st.p5.real.full / ratio;
			var x2 = st.p5.real.full / ratio;
			var y1 = realy / ratio;
			var y2 = y1;
			line(x1, y1, x2, y2);
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
				fill(0,0,0,0);
				circle(x, y, 2);
			}
		}
	},

	drawPlanes: function() {
		var ratio = st.p5.real.ratio;
		var planes = st.planes.planes;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];
			if (plane.hp > 0) {

				var x = plane.x / ratio;
				var y = -plane.y / ratio;
				var a = plane.a;
				var canvasa = 90.0 - a;
	
				// fuselage
				var fuselageColor = 'black';
				if (plane.team == 'german') {
					fuselageColor = 'gray';
				}
				if (plane.team == 'soviet') {
					fuselageColor = 'maroon';
				}
				
				stroke(fuselageColor);
				strokeWeight(3);
				fill(0, 0, 0, 0);
				var r = 10;
				var x1 = x + 0.75 * r * Math.cos(canvasa / 180.0 * Math.PI);
				var y1 = y - 0.75 * r * Math.sin(canvasa / 180.0 * Math.PI);
				var fx2 = x + r * Math.cos((canvasa + 180.0) / 180.0 * Math.PI);
				var fy2 = y - r * Math.sin((canvasa + 180.0) / 180.0 * Math.PI)
				line(x1, y1, fx2, fy2);
	
				// wing
				var winga = canvasa + 90.0;
				var r = 10.0;
				var x1 = x + r * Math.cos(winga / 180.0 * Math.PI);
				var y1 = y - r * Math.sin(winga / 180.0 * Math.PI);
				var x2 = x + r * Math.cos((winga + 180.0) / 180.0 * Math.PI);
				var y2 = y - r * Math.sin((winga + 180.0) / 180.0 * Math.PI)
				line(x1, y1, x2, y2);
	
				// tail
				strokeWeight(2.5);
				var r = 3;
				var rr = 0.9;
				var tx2 = ((1-rr) * x + rr*fx2);
				var ty2 = ((1-rr) * y + rr*fy2);
				var x1 = tx2 + r * Math.cos(winga / 180.0 * Math.PI);
				var y1 = ty2 - r * Math.sin(winga / 180.0 * Math.PI);
				var x2 = tx2 + r * Math.cos((winga + 180.0) / 180.0 * Math.PI);
				var y2 = ty2 - r * Math.sin((winga + 180.0) / 180.0 * Math.PI)
				line(x1, y1, x2, y2);
	
				// cockpit
				stroke('fuselageColor');
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
	
				fill(fuselageColor);
				textFont(st.p5.font);
				var t = "p" + i + " (" + Math.round(a) + ")";
				text(t, x - 20, y + 20);
	
				var t = "(" + Math.round(plane.x) + ", " + Math.round(plane.y) + ")";
				text(t, x - 20, y + 30);
	
				var t = "(" + Math.round(plane.targetDist) + ")";
				text(t, x - 20, y + 40);
	
				var t = "(" + Math.round(plane.hp) + ")";
				text(t, x - 20, y + 50);
			}
		}
	},
	
	updateTime: function() {
		var current = millis();
		st.p5.time.current = current;
	
		var smokeDelta = 500;
		var last = st.p5.time.last;
		var cnt = 0;
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
			st.p5.updateAngles(delta);
			st.p5.updatePositions(delta);
		}
		st.p5.time.last = current;
	},
	
	updateAngles: function(delta) {
		var planes = st.planes.planes;
		var scale = st.p5.time.scale;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];
			if (plane.hp > 0) {
				if (plane.target > -1 && i != plane.target) {
					var dist = st.planes.calcIndexDistance(i, plane.target);
					plane.targetDist = dist;
					if (dist < plane.minTargetDist) {
						var targetPlane = planes[plane.target];
						var hp = targetPlane.hp - plane.d;
						targetPlane.hp = Math.max(hp, 0);
					}				
					if (dist > plane.minTargetDist) {
						var targetA = st.planes.calcIndexAngle(i, plane.target);
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
					}
				}
			}
		}
	},
	
	updatePositions: function(delta) {
		var planes = st.planes.planes;
		var scale = st.p5.time.scale;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];

			if (plane.hp > 0) {
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

			if (plane.hp > 0) {
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
	
};