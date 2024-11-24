/* st-planes.js */

const MAX_TO_CRUISE = 2.0 / 3.0;
const KPH_TO_MPM = 1000 / 60 / 10;

st.planes = {
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
		var url = $.url();
		var simulation = url.param('simulation');
		switch (simulation) {
			case "angle":
				var angle = parseFloat(url.param('angle'),0);
				angle = 90 - angle;
				var r = 5000;
				var x1 = Math.cos(angle / 180 * Math.PI) * r;
				var y1 = Math.sin(angle / 180 * Math.PI) * r;
				var x2 = Math.cos((angle + 180) / 180 * Math.PI) * r;
				var y2 = Math.sin((angle + 180) / 180 * Math.PI) * r;
				st.planes.createPlanes("soviet", "po-2", 1, {x: x1, y: y1});
				st.planes.createPlanes("german", "bf-109", 1, {x: x2, y: y2});
				return;
			case "acti":
				st.planes.createPlanes("soviet", "po-2", 12);
				st.planes.createPlanes("german", "bf-109", 3);
				return;
			case "actii":
				st.planes.createPlanes("soviet", "po-2", 6);
				st.planes.createPlanes("german", "me-262", 4);
				return;
			case "actiii":
				st.planes.createPlanes("soviet", "po-2", 6);
				st.planes.createPlanes("soviet", "mig-25", 6);
				st.planes.createPlanes("soviet", "r-40", 4);
				st.cities.createCity("soviet", "Capital");
				st.planes.createPlanes("german", "me-262", 6);
				st.planes.createPlanes("german", "he-177", 2);
				return;
			default:
				st.planes.createPlanes("german", "bf-109", 3);
				st.planes.createPlanes("soviet", "po-2", 12);
				return;
		}
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
			st.log([design, plane]);
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
						
						var bullet = st.bullets.createBullet(x, y, a, 1);
						bullet.v = EXPLOSION_V;						
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