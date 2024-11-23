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

					case "tl6-bomber":
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
						
					case "tl7-jetfighter":
						// tail
						var sweep = 160.0;
						var winga = canvasa + sweep;
						var x1 = x + r * 1 * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 1 * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;

						var sweep = 180.0;
						var wingc = canvasa + sweep;
						var x2 = x + r * 0.6 * Math.cos(wingc / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * 0.6 * Math.sin(wingc / 180.0 * Math.PI) + shadowPt.y;
						strokeWeight(3);
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
												
						// wing 
						var sweep = 125.0;
						var winga = canvasa + sweep;
						var x1 = x + r * 0.8 * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 0.8 * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;

						var wingc = canvasa + sweep;
						var x2 = x ;
						var y2 = y ;
						stroke(wingColorStr);
						line(x1, y1, x2, y2);

						var sweep = 125.0;
						var wingb = canvasa - sweep;
						var x1 = x + r * 0.8 * Math.cos(wingb / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 0.8 * Math.sin(wingb / 180.0 * Math.PI) + shadowPt.y;
						stroke(wingColorStr);
						line(x1, y1, x2, y2);

						var wingc = canvasa - sweep;
						var x2 = x ;
						var y2 = y ;
						stroke(wingColorStr);
						line(x1, y1, x2, y2);
						
						var sweep = 120.0;
						var winga = canvasa + sweep;
						var x1 = x + r * 0.8 * Math.cos(winga / 180.0 * Math.PI) + shadowPt.x;
						var y1 = y - r * 0.8 * Math.sin(winga / 180.0 * Math.PI) + shadowPt.y;

						var wingb = canvasa - sweep;
						var x2 = x + r * 0.8 * Math.cos(wingb / 180.0 * Math.PI) + shadowPt.x;
						var y2 = y - r * 0.8 * Math.sin(wingb / 180.0 * Math.PI) + shadowPt.y;
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
				if (opts.detail) {
					fill(fuselageColor);
					textFont(st.p5.font);
					var t = "p" + i + " (" + plane.design + ")";
					text(t, x - 8, y + 24);
	
	 				var t = " (" + Math.round(plane.x) + "m, " + Math.round(plane.y) + "m, " + Math.round(a) + "°)";
					text(t, x - 8, y + 36);
		
	 				var t = " (" + Math.round(plane.v) + "km/h)";
					text(t, x - 8, y + 48);

					var t = " hull: " + Math.round(plane.hull) + ", structure: " + Math.round(plane.structure);
					text(t, x - 8, y + 62);
	
					if (plane.target != -1) {
						var t = "-> p" + plane.target + ": " + Math.round(plane.targetDist) + "m";
						text(t, x - 8, y + 72);
					}
				} else {
					fill(fuselageColor);
					textFont(st.p5.font);
					var t = "p" + i;
					text(t, x - 8, y + 24);					
				}			
				
				// weapon radius
				if (mode != "shadow" && plane.target != -1) {
					var dist = st.planes.getAllWeaponDist(plane);	
					var adelta = 10;
					
					var amin = 0;
					var amax = 0;
					
					switch (plane.weapons[0].arc) {
						case "f":
							amin = a - 20;
							amax = a + 20;
							break;
						default:
							amin = a - 180;
							amax = a + 180;
							break;
					}
										
					for (var a1 = amin; a1 < amax; a1 += adelta) {
						var canvasa1 = 90.0 - a1;
						var x1 = x + (dist * Math.cos(canvasa1 / 180.0 * Math.PI)) / ratio;
						var y1 = y - (dist * Math.sin(canvasa1 / 180.0 * Math.PI)) / ratio;
						var x2 = x + (dist * Math.cos((canvasa1 - adelta) / 180.0 * Math.PI)) / ratio;
						var y2 = y - (dist * Math.sin((canvasa1 - adelta) / 180.0 * Math.PI)) / ratio;
						strokeWeight(1);
						switch (plane.shootDelayed) {
							case 0:
								stroke("green");
								break;
							case 1:
							case 2:
								stroke("yellow");
								break;
							case 3:
							case 4:
								stroke("orange");
								break;
							case 5:
								stroke("red");
								break;
							default: 
								stroke("black");
								break;
						}
						line(x1, y1, x2, y2);
					}
				}
			}
		}
	},
	
	drawBullets: function() {
		var ratio = st.p5.real.ratio;
		var bullets = st.bullets.bullets;
		var scale = st.p5.time.scale;

		for (var i = 0; i < bullets.length; i++) {
			var bullet = bullets[i];
			var x = bullet.x;
			var y = bullet.y;
			var a = bullet.a;
			var v = bullet.v / 5;
			
			// convert from geographic
			var canvasa = 90.0 - a;

			var mc = Math.cos(canvasa / 180.0 * Math.PI);
			var ms = Math.sin(canvasa / 180.0 * Math.PI);

			stroke(0,0,0,0);
			for (var b = 0; b< 5; b++) {
				var xb = (x + b * mc * v * st.p5.time.delta / scale) / ratio;
				var yb = (-y - b * ms * v * st.p5.time.delta / scale) / ratio;
				fill(58,52,32,255);
				circle(xb, yb, 4);
			}
		}		
	},
	
	drawCities: function() {
		var ratio = st.p5.real.ratio;
		var cities = st.cities.cities;
		for (var i = 0; i < cities.length; i++) {
			var city = cities[i];
			var team = city.team;
			var fuselageColor = st.teams.getTeamColor(team);
			
			var xc = city.x / ratio;
			var yc = -city.y / ratio;
			
			fill(fuselageColor);
			stroke(0, 0, 0, 0);
			circle(xc, yc, 20);

			fill(fuselageColor);
			textFont(st.p5.font);
			var t = city.name;
			text(t, xc - 20, yc + 24);					
		}
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
	st.p5.drawSmoke();
	st.p5.drawPlanes({mode:"normal"});
	st.p5.drawBullets();
}

function preload() {
	st.p5.font = loadFont('./font/inconsolata.otf');
	st.p5.backgroundImg = loadImage('img/pripyat-river.jpg');
}