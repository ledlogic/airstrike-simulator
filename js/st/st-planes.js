/* st-planes.js */

const MAX_TO_CRUISE = 2.0 / 3.0;
const KPH_TO_MPM = 1000 / 60 / 10;

st.planes = {
	
	detailVisible: true,
	
	data: {
		"bf-109": {
			type: "tl6-propfighter",
			v: MAX_TO_CRUISE * 588 * KPH_TO_MPM,
			minv: MAX_TO_CRUISE * 165 * KPH_TO_MPM,
			hull: 3,
			structure: 3,
			armour: 6,
			range: 1e9,
			weapons: [
				{
					"type": "gun",
					"armament": "MG-131",
					"arc": "f",
					"d": 6,
					"ap": "S"
				}
			],
			smoke: true
		},
		"me-262": {
			type: "tl6-jetfighter",
			v: MAX_TO_CRUISE * 900 * KPH_TO_MPM,
			minv: MAX_TO_CRUISE * 250 * KPH_TO_MPM,
			hull: 3,
			structure: 8,
			armour: 4,
			range: 1e9,
			weapons: [
				{
					"type": "gun",
					"armament": "30mm",
					"arc": "f",
					"d": 7,
					"ap": "S"
				}
			],
			smoke: false
		},
		"po-2": {
			type: "tl5-biplane",
			v: MAX_TO_CRUISE * 152 * KPH_TO_MPM,
			minv: MAX_TO_CRUISE * 64 * KPH_TO_MPM,
			hull: 1,
			structure: 1,
			armour: 4,
			range: 1e9,
			weapons: [
				{
					"type": "gun",
					"armament": "ShKAS",
					"arc": "t",
					"d": 3,
					"ap": "S"
				}
			],
			smoke: true
		},
		"he-177": {
			type: "tl6-bomber",
			v: MAX_TO_CRUISE * 488 * KPH_TO_MPM,
			minv: MAX_TO_CRUISE * 135 * KPH_TO_MPM,
			hull: 32,
			structure: 32,
			armour: 6,
			range: 1e9,
			weapons: [
				{
					"type": "gun",
					"armament": "MG-151",
					"arc": "f",
					"d": 6,
					"ap": "S"
				},
				{
					"type": "gun",
					"armament": "MG-151",
					"arc": "a",
					"d": 6,
					"ap": "S"
				},
				{
					"type": "gun",
					"armament": "MG-131",
					"arc": "t",
					"d": 5,
					"ap": "S"
				},
				{
					"type": "gun",
					"armament": "MG-131",
					"arc": "t",
					"d": 5,
					"ap": "S"
				}
			],
			smoke: true
		},
		"mig-25": {
			type: "tl7-jetfighter",
			v: MAX_TO_CRUISE * 3000 * KPH_TO_MPM,
			minv: MAX_TO_CRUISE * 290 * KPH_TO_MPM,
			hull: 20,
			structure: 20,
			armour: 4,
			range: 1e9,
			weapons: [
				{
					"type": "missile",
					"armament": "R-40",
					"arc": "f",
					"d": 9,
					"ap": "S",
					"range": 65000 
				}
			],
			smoke: false
		},
		"r-40": {
			type: "tl7-missile",
			v: MAX_TO_CRUISE * 4100 * KPH_TO_MPM,
			minv: MAX_TO_CRUISE * 2050 * KPH_TO_MPM,
			hull: 1,
			structure: 1,
			armour: 0,
			range: 65000,
			weapons: [
				{
					"type": "gun",
					"armament": "R-40",
					"arc": "t",
					"d": 9,
					"ap": "S",
					"range": 200
				}
			],
			smoke: false
		}
	},

	planes: [],

	init: function() {
		st.log("st.planes.init");
		
		$("#st-cb-details").attr("checked", st.planes.detailsVisible ? "checked" : "");
	},

	createPlanes: function(team, design, qty, opts) {
		var full = st.p5.real.full;
		var hspread = 0.5;
		var vspread = 0.5;
		for (var i = 0; i < qty; i++) {
			if (team == 'german') {
				var x = st.math.randomBetween(-full, (-1 + hspread) * full);
				var y = st.math.randomBetween(-vspread * full, vspread * full);
				var a = st.math.randomBetween(10, 170);
				var homeAngle = 260.0;
			}
			if (team == 'soviet') {
				var x = st.math.randomBetween((1 - hspread) * full, full);
				var y = st.math.randomBetween(-vspread * full, vspread * full);
				var a = st.math.randomBetween(190, 350);
				var homeAngle = 100.0;
			}			
			if (opts != null) {
				if (opts.x != null) {
					x = opts.x;
				}
				if (opts.y != null) {
					y = opts.y;
				}
			}
		
			var plane = st.planes.createPlane(team, design, x, y, a, homeAngle);
			var index = st.planes.planes.length;
			plane.index = index;
			st.planes.planes[index] = plane;
		}
	},

	createPlane: function(team, design, x, y, a, homeAngle) {
		var data = st.planes.data[design];
		
		var plane = {
			data: data,
			team: team,
			design: design,
			type: data.type,
			x: x,
			y: y,
			a: a,
			homeAngle: homeAngle,
			distance: 0,
			v: data.v,
			target: -1,
			targetA: -1,
			targetDist: 1e10,
			smokes: [],
			hull: data.hull,
			structure: data.structure,
			armour: data.armour,
			weapons: data.weapons,
			smoke: data.smoke,
			shootDelayed: 0,
			brightnessDelta: 0
		};
		return plane;
	},

	minArrDistance: function(distArr) {
		var minIndex = -1;
		var minDist = 1e20;
		for (var i = 0; i < distArr.length; i++) {
			var dist = distArr[i];
			if (dist < minDist) {
				minIndex = i;
				minDist = dist;
			}
		}
		return minIndex;
	},

	getTargetDistances: function(index, lastTarget) {
		var planes = st.planes.planes;
		var d = [];
		for (var i = 0; i < planes.length; i++) {
			var targetPlane = planes[i];
			if ((i == index) || (i == lastTarget)) {
				d[i] = 1e21;
			} else if (st.planes.sameTeam(index, i)) {
				d[i] = 1e21;
			} else if (targetPlane.type == "missile") {
				d[i] = 1e21;
			} else if (targetPlane.structure <= 0) {
				d[i] = 1e21;
			} else {
				d[i] = st.planes.calcIndexDistance(index, i);
			}
		}
		return d;
	},

	sameTeam: function(i1, i2) {
		var planes = st.planes.planes;
		var p1 = planes[i1];
		var p2 = planes[i2];
		var b = (p1.team == p2.team);
		return b;
	},

	calcIndexDistance: function(i1, i2) {
		var planes = st.planes.planes;
		var p1 = planes[i1];
		var p2 = planes[i2];
		var d = st.planes.calcPlaneDistance(p1, p2);
		return d;
	},

	calcPlaneDistance: function(p1, p2) {
		var dx = (p2.x - p1.x);
		var dy = (p2.y - p1.y);
		var d = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
		return d;
	},
	
	calcIndexAngle: function(i1, i2) {
		var planes = st.planes.planes;
		var p1 = planes[i1];
		var p2 = planes[i2];
		var d = st.planes.calcPlaneAngle(p1, p2);
		return d;
	},

	/** 
	 * Returns the geo angle difference to the other point
	 */
	calcPlaneAngle: function(p1, p2) {
		var dx = (p2.x - p1.x);
		var dy = (p2.y - p1.y);
		
		// special radians with extra cases
		var theta = Math.atan2(dy, dx);
		
		// convert to degrees
		theta *= 180.0 / Math.PI;
		
		// convert to geographic
		theta = 90.0 - theta;
		
		while (theta > 360.0) {
			theta -= 360.0;
		}
		while (theta < 0.0) {
			theta += 360.0;
		}

		return theta;
	},
	
	shoot: function(plane) {
		var planes = st.planes.planes;
		var weapons = plane.weapons;
		var targetPlane = planes[plane.target];
		
		plane.shootDelayed++;
		//st.log("plane.shootDelayed[" + plane.shootDelayed + "]");
		
		_.each(weapons, function(weapon) {
			var dist = st.planes.calcPlaneDistance(plane, targetPlane);
			var canHit = (weapon.arc == "t") || (weapon.arc == "f" && Math.abs(plane.targetA - plane.a) < MAX_SHOOT_BULLET_DELTA_ANGLE);
			canHit = canHit && dist < st.planes.getWeaponDist(weapon);
			if (canHit) {
				plane.shootDelayed = 0;
				
				if (plane.type == "tl7-missile") {
					var missleBulletDelta = 60;
					for (var ai=0; ai<360; ai+=missleBulletDelta) {
						var x = plane.x;
						var y = plane.y;
						var a = plane.a + ai + st.math.dieN(missleBulletDelta);
						st.bullets.createBullet(x, y, a, 1);
					}
				} else {	
					var x = plane.x;
					var y = plane.y;
					var a = plane.a;
					st.bullets.createBullet(x, y, a, 5);
				}
				
				var effect = 0;
				var d1 = st.math.die(weapon.d, 6, effect);
				d2 = Math.max(0, d1-targetPlane.armour);
								
				if (d2>0 && targetPlane.hull > 0) {
					var dHull = Math.min(d2, targetPlane.hull);
					targetPlane.hull = targetPlane.hull - dHull;
					d2 -= dHull;
				}
				if (d2>0 && targetPlane.structure > 0) {
					var dStructure = Math.min(d2, targetPlane.structure);
					targetPlane.structure = targetPlane.structure - dStructure;
				}
				
				if (targetPlane.structure <= 0) {
					var explosionBulletDelta = 20;
					for (var ai=0; ai<360; ai+=explosionBulletDelta) {
						var r = 100;
						var x = targetPlane.x + st.math.randomBetween(-r, r);
						var y = targetPlane.y + st.math.randomBetween(-r, r);
						var a = targetPlane.a + 0.5 * ai + st.math.dieN(explosionBulletDelta);
						while (a > 360) {
							a-= 360;
						} 
						while (a < 360) {
							a+= 360;
						}
						st.bullets.createExplosion(x, y, a, 1);	
					}
				}
				
				if (plane.type == "missile") {
					plane.hull = 0;
					plane.structure = 0;
				}
			}
		});
	},
	
	getAllWeaponDist: function(plane) {
		var dmin = 1e9;
		var weapons = plane.weapons;
		_.each(weapons, function(weapon) {
			var d = st.planes.getWeaponDist(weapon);
			dmin = Math.min(dmin, d);
		});
		return dmin;
	},
	
	getWeaponDist: function(weapon) {
		switch (weapon.armament) {
			case "MG-131":
				return 6500;
			case "ShKAS":
				return 400;
			case "R-40":
				return 13;
			default: 
				return 1828;
		}
	}
};

st.time.updatePlanes = function() {
	st.time.updateTargets();
	st.time.updateAngles();
	st.time.updatePositions();
};
	
st.time.updateTargets = function() {
	var planes = st.planes.planes;
	for (var i = 0; i < planes.length; i++) {
		var plane = planes[i];
		var target = plane.target;
		var lastTarget = -1;

		if (target > -1) {
			if (planes[target].structure <= 0) {
				plane.target = -1;	
			} else if (plane.shootDelayed > MAX_SHOOT_DELAYS_BEFORE_NEW_TARGET) {
				lastTarget = target;	
				plane.target = -1;
				plane.shootDelayed = 0;
			}
		}
		if (plane.target == -1) {
			st.time.updateTarget(i, lastTarget);
		}
	}
};

st.time.updateTarget = function(index, lastTarget) {
	var planes = st.planes.planes;
	var indexPlane = planes[index];
	var distArr = st.planes.getTargetDistances(index, lastTarget);
	var minDistIndex = st.planes.minArrDistance(distArr);
	indexPlane.target = minDistIndex;
}

st.time.updateAngles = function() {
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
				st.time.updateAngle(plane, targetA);
			} else {
				var targetA = plane.homeAngle;
				st.time.updateAngle(plane, targetA);
			}
		}
	}
};
	
st.time.updateAngle = function(plane, targetA) {
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
		else {
			plane.v += deltaV;
			plane.v = Math.min(plane.v, plane.data.v);
		}
	}
	else if (dA < 0) {
		deltaA = Math.max(dA, -turnFactor * turnA * turnRatio);
		if (dA < -3) {
			plane.v -= deltaV;
			plane.v = Math.max(plane.v, plane.data.minv);
		}
		else {
			plane.v += deltaV;
			plane.v = Math.min(plane.v, plane.data.v);
		}
	} else {
		plane.v += deltaV;
		plane.v = Math.min(plane.v, plane.data.v);
	}
	plane.a += deltaA;
	
	while (plane.a > 360.0) {
		plane.a -= 360.0;
		plane.shootDelayed++;
	}
	while (plane.a < 0.0) {
		plane.a += 360.0;
		plane.shootDelayed++;
	}
};
	
st.time.updatePositions = function() {
	var planes = st.planes.planes;
	var scale = st.p5.time.scale;
	var drift = st.clouds.drift;
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
			
			x += drift.x;
			y += drift.y;
			
			var dist = Math.sqrt(Math.pow(x,2) + Math.pow(y,2));
			plane.distance += dist;
			if (plane.distance > plane.range) {
				plane.hull = 0;
				plane.structure = 0;
			}
			
			if (plane.target > -1) {
				if (plane.type == "tl7-missile") {
					var targetPlane = planes[plane.target];					
					var targetDist = st.planes.calcPlaneDistance(plane, targetPlane);
					if (dist >= targetDist) {
						x = targetPlane.x;
						y = targetPlane.y;
					}
					st.planes.shoot(plane);
				}
			}
			
			plane.x = x;
			plane.y = y;
		}
	}
};

st.p5.drawPlanes = function(opts) {
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

				case "tl7-missile":
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
			}
			
			// detail
			fill(fuselageColor);
			textFont(st.p5.font);
			var t = "p" + i + " (" + plane.design + ")";
			text(t, x - 8, y + 24);

			if (st.planes.detailVisible) {
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
			}
		}
	}
};
