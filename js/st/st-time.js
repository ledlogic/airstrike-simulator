/* st-time.js */

st.time = {
	init: function() {
		st.log("init time");
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
				st.time.updateSmokes();
				st.p5.time.cumDelta -= smokeDelta;
			}
			
			// planes
			st.time.updateTargets();
			st.time.updateAngles();
			st.time.updatePositions();
			st.time.updateBullets();
			
			// clouds
			st.time.updateClouds();
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
					
					// if in range, shoot
					if (dist < st.planes.getAllWeaponDist(plane)) {
						st.planes.shoot(plane);
					}
					var targetA = st.planes.calcIndexAngle(i, plane.target);
					plane.targetA = targetA;
					st.time.updatePlane(plane, targetA);
				} else {
					var targetA = plane.homeAngle;
					st.time.updatePlane(plane, targetA);
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
		var turnA = 3;
		var deltaV = plane.data.v * 0.1;
		var turnRatio = (plane.data.minv / plane.v);
		var turnFactor = 2.0;
		if (dA > 0) {
			deltaA = Math.min(dA, turnFactor * turnA * turnRatio);
			if (dA > 3) {
				plane.v -= deltaV;
				plane.v = Math.max(plane.v, plane.data.minv);
			}
		}
		else if (dA < 0) {
			deltaA = Math.max(dA, -turnFactor * turnA * turnRatio);
			if (dA > 3) {
				plane.v -= deltaV;
				plane.v = Math.max(plane.v, plane.data.minv);
			}
		} else {
			plane.v += deltaV;
			plane.v = Math.min(plane.v, plane.data.v);
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
	
	updateBullets: function() {
		var bullets = st.bullets.bullets;
		var scale = st.p5.time.scale;
		var overflow = st.p5.real.full * 1.1;
		var newBullets = [];
		for (var i = 0; i < bullets.length; i++) {
			var bullet = bullets[i];
			if (bullet.active) {
				var x = bullet.x;
				var y = bullet.y;
				var a = bullet.a;
				var v = bullet.v / 5;
			
				// convert from geographic
				var canvasa = 90.0 - a;
	
				var mc = Math.cos(canvasa / 180.0 * Math.PI);
				var ms = Math.sin(canvasa / 180.0 * Math.PI);
				
				var deltaX = mc * v * st.p5.time.delta / scale;
				var deltaY = ms * v * st.p5.time.delta / scale;
	
				x += deltaX;
				y += deltaY;
				
				bullet.x = x;
				bullet.y = y;
				
				if (bullet.x < -overflow) {
					bullet.active = false;
				}
				if (bullet.x > overflow) {
					bullet.active = false;
				}
				if (bullet.y < -overflow) {
					bullet.active = false;
				}
				if (bullet.y > overflow) {
					bullet.active = false;
				}
			}
			if (bullet.active) {
				newBullets.push(bullet);
			}
		}
		st.bullets.bullets = newBullets;
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
	},
	
	/**
	 * Update the target for all planes
	 * All planes work independently
	 **/
	updateTargets: function() {
		var planes = st.planes.planes;
		for (var i = 0; i < planes.length; i++) {
			var plane = planes[i];
			var target = plane.target;
			var lastTarget = -1;

			if (target > -1) {
				if (planes[target].structure <= 0) {
					plane.target = -1;	
				} else if (plane.shootDelayed > 5) {
					lastTarget = target;	
					plane.target = -1;
					plane.shootDelayed = 0;
				}
			}
			if (plane.target == -1) {
				st.time.updateTarget(i, lastTarget);
			}
		}
	},

	/**
	 * Update the target for plane index
	 **/
	updateTarget: function(index, lastTarget) {
		var planes = st.planes.planes;
		var indexPlane = planes[index];
		var distArr = st.planes.getTargetDistances(index, lastTarget);
		var minDistIndex = st.planes.minArrDistance(distArr);
		indexPlane.target = minDistIndex;
	}

};