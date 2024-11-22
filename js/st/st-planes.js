/* st-planes.js */

const MAX_TO_CRUISE = 2.0 / 3.0;
const KPH_TO_MPM = 1000 / 60 / 10;

st.planes = {
	data: {
		"bf-109": {
			type: "tl6-propfighter",
			v: MAX_TO_CRUISE * 588 * KPH_TO_MPM,
			hull: 3,
			structure: 3,
			armour: 6,
			weapons: [
				{
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
			hull: 3,
			structure: 8,
			armour: 4,
			weapons: [
				{
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
			hull: 1,
			structure: 1,
			armour: 4,
			weapons: [
				{
					"arc": "t",
					"d": 3,
					"ap": "S"
				}
			],
			smoke: true
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
			default:
				st.planes.createPlanes("german", "bf-109", 3);
				st.planes.createPlanes("soviet", "po-2", 12);
				return;
		}
	},

	createPlanes: function(team, design, qty, opts) {
		var full = st.p5.real.full;
		var spread = 0.5;
		for (var i = 0; i < qty; i++) {
			if (team == 'german') {
				var x = st.math.randomBetween(-full, (-1 + spread) * full);
				var y = st.math.randomBetween(-spread * full, spread * full);
				var a = st.math.randomBetween(0, 180);
				var homeAngle = 260.0;
			}
			if (team == 'soviet') {
				var x = st.math.randomBetween(spread * full, full);
				var y = st.math.randomBetween(-spread * full, spread * full);
				var a = st.math.randomBetween(180, 360);
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
			st.planes.planes.push(plane);
		}
	},

	createPlane: function(team, design, x, y, a, homeAngle) {
		var data = st.planes.data[design];
		
		var plane = {
			team: team,
			design: design,
			type: data.type,
			x: x,
			y: y,
			a: a,
			homeAngle: homeAngle,
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
				st.planes.updateTarget(i, lastTarget);
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
		if (lastTarget != -1) {
			console.log([lastTarget,minDistIndex]);
		}
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
		
		plane.shootDelayed = plane.shootDelayed + 1;
		st.log("plane.shootDelayed[" + plane.shootDelayed + "]");
		
		_.each(weapons, function(weapon) {
			var canHit = (weapon.arc == "t") || (weapon.arc == "f" && Math.abs(plane.targetA - plane.a) < 20);
			if (canHit) {
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
			}
		});
	},
	
	minDistTarget: function(plane) {
		return 35000;
	}
};