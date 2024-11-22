/* st-clouds.js */

st.clouds = {
	MIN_CLOUDS: 10,
	MAX_CLOUDS: 100,
	MIN_CLOUD_RADIUS: 250,
	MAX_CLOUD_RADIUS: 1500,
	MIN_CLOUD_ALPHA: 25,
	MAX_CLOUD_ALPHA: 125,
	MIN_CLOUD_POINTS: 20,
	MAX_CLOUD_POINTS: 80,
	MIN_CLOUD_DRIFT: 5,
	MAX_CLOUD_DRIFT: 10,
	MIN_POINT_RADIUS: 250,
	MAX_POINT_RADIUS: 750,
	MAX_POINT_VELOCITY: 0.25,
	POINT_ALPHA_DELTA: 10,
	
	drift: {
		x: 0, 
		y: 0
	},

	clouds: [],
	
	init: function() {
		st.log("st.clouds.init");
		st.clouds.initClouds();
	},
	initClouds: function() {
		var qtyClouds = st.math.randomBetween(st.clouds.MIN_CLOUDS, st.clouds.MAX_CLOUDS);
		
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
		
		var qtyPoints = st.math.randomBetween(st.clouds.MIN_CLOUD_POINTS, st.clouds.MAX_CLOUD_POINTS); 
		var points = [];
		for (var i = 0; i< qtyPoints; i++) {
			var r1 = Math.random() * r;
			var radians = Math.random() * 2 * Math.PI;
			var x1 = Math.cos(radians) * r1;
			var y1 = Math.sin(radians) * r1;
			var r1 = st.math.randomBetween(-st.clouds.MIN_POINT_RADIUS, st.clouds.MAX_POINT_RADIUS);
			var a1 = st.math.randomBetween(a - st.clouds.POINT_ALPHA_DELTA, a + st.clouds.POINT_ALPHA_DELTA);
			var vx1 = st.math.randomBetween(-st.clouds.MAX_POINT_VELOCITY, st.clouds.MAX_POINT_VELOCITY);
			var vy1 = st.math.randomBetween(-st.clouds.MAX_POINT_VELOCITY, st.clouds.MAX_POINT_VELOCITY);
			var point = {
				x: x1,
				y: y1,
				a: a1,
				r: r1,
				vx: vx1,
				vy: vy1
			}
			points.push(point);
		}
		return points;
	}
};