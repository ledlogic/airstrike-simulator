/* st-clouds.js */

st.clouds = {
	MIN_CLOUDS: 10,
	MAX_CLOUDS: 100,
	MIN_CLOUD_RADIUS: 250,
	MAX_CLOUD_RADIUS: 2500,
	MIN_CLOUD_ALPHA: 25,
	MAX_CLOUD_ALPHA: 125,
	MIN_CLOUD_POINTS: 20,
	MAX_CLOUD_POINTS: 100,
	MIN_CLOUD_DRIFT: 5,
	MAX_CLOUD_DRIFT: 10,
	MIN_POINT_RADIUS: 50,
	MAX_POINT_RADIUS: 500,
	MAX_POINT_VELOCITY: 0.5,
	POINT_ALPHA_DELTA: 10,
	
	drift: {
		x: 0, 
		y: 0
	},

	clouds: [],
	
	visible: true,
	
	init: function() {
		st.log("st.clouds.init");
		st.clouds.initClouds();
		
		$("#st-cb-clouds").attr("checked", st.clouds.visible ? "checked" : "");
	},
	initClouds: function() {
		st.log("st.clouds.initClouds");

		var qtyClouds = st.math.randomBetween(st.clouds.MIN_CLOUDS, st.clouds.MAX_CLOUDS);
		//st.log(qtyClouds);
		
		var clouds = st.clouds.clouds;
		var full = st.p5.real.full;
		for (var i = 0; i < qtyClouds; i++) {
			var x = st.math.randomBetween(-full, full);
			var y = st.math.randomBetween(-full, full);
			var r = st.math.randomBetween(st.clouds.MIN_CLOUD_RADIUS, st.clouds.MAX_CLOUD_RADIUS);  
			var a = Math.round(st.math.randomBetween(st.clouds.MIN_CLOUD_ALPHA, st.clouds.MAX_CLOUD_ALPHA));
			var cloud = st.clouds.createCloud(x, y, r, a);
			clouds.push(cloud);
		}
		
		st.clouds.drift.x = st.math.randomBetween(-st.clouds.MAX_CLOUD_DRIFT, st.clouds.MAX_CLOUD_DRIFT);
		st.clouds.drift.y = st.math.randomBetween(-st.clouds.MAX_CLOUD_DRIFT, st.clouds.MAX_CLOUD_DRIFT);
	},
	createCloud: function(x, y, r, a) {
		var cloud = {
			x: x,
			y: y,
			r: r,
			a: a
		};
		
		var points = st.clouds.createPoints(cloud);
		cloud.points = points;

		cloud.drift = {};
		cloud.drift.x = 0.125 * st.math.randomBetween(-st.clouds.MAX_CLOUD_DRIFT, st.clouds.MAX_CLOUD_DRIFT);
		cloud.drift.y = 0.125 * st.math.randomBetween(-st.clouds.MAX_CLOUD_DRIFT, st.clouds.MAX_CLOUD_DRIFT);
	
		return cloud;
	},
	createPoints: function(cloud) {
		var r = cloud.r;
		var a = cloud.a;
		
		var qtyPoints = st.math.randomBetween(st.clouds.MIN_CLOUD_POINTS, st.clouds.MAX_CLOUD_POINTS) * cloud.r / 750.0;
		//st.log(qtyPoints);
		
		var points = [];
		for (var i = 0; i< qtyPoints; i++) {
			var r1 = Math.random() * r;
			var radians = Math.random() * 2 * Math.PI;
			var x1 = Math.cos(radians) * r1;
			var y1 = Math.sin(radians) * r1;
			var r1 = st.math.randomBetween(-st.clouds.MIN_POINT_RADIUS, st.clouds.MAX_POINT_RADIUS) + r / 5.0;
			var a1 = st.math.randomBetween(a - st.clouds.POINT_ALPHA_DELTA, a + st.clouds.POINT_ALPHA_DELTA);
			var vx1 = st.math.randomBetween(-st.clouds.MAX_POINT_VELOCITY, st.clouds.MAX_POINT_VELOCITY);
			var vy1 = st.math.randomBetween(-st.clouds.MAX_POINT_VELOCITY, st.clouds.MAX_POINT_VELOCITY);
			var point = {
				x: x1,
				y: y1,
				a: a1,
				r: r1,
				vx: vx1,
				vy: vy1,
				radians: radians
			}
			points.push(point);
		}
		
		 points = _.sortBy(points, function (point) {
            return point.radians;
        });
			
		return points;
	}
};

st.p5.drawClouds = function() {
	if (!st.clouds.visible) {
		return;
	}
	
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
};

st.time.updateClouds = function() {
	var clouds = st.clouds.clouds;
	for (var i = 0; i < clouds.length; i++) {
		var cloud = clouds[i];
		st.time.updateCloud(cloud);
		st.time.updateCloudPoints(cloud);
	}
};

st.time.updateCloud = function(cloud) {
	var drift = st.clouds.drift;
	var overflow = st.p5.real.full * 1.1;

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
};

st.time.updateCloudPoints = function(cloud) {
	var points = cloud.points;
	for (var j = 0; j < points.length; j++) {
		var point = points[j];
		point.x += point.vx + st.math.randomBetween(-0.1, 0.1);
		point.y += point.vy + st.math.randomBetween(-0.1, 0.1);
		point.r += st.math.randomBetween(-0.1, 0.1);
		point.r = Math.max(point.r, st.clouds.MIN_POINT_RADIUS);
	}
};

