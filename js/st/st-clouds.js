/* st-clouds.js */

st.clouds = {
	MIN_CLOUDS: 10,
	MAX_CLOUDS: 50,
	MIN_CLOUD_RADIUS: 250,
	MAX_CLOUD_RADIUS: 2000,
	MIN_CLOUD_ALPHA: 50,
	MAX_CLOUD_ALPHA: 200,
	MIN_CLOUD_POINTS: 50,
	MAX_CLOUD_POINTS: 100,

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
			st.log("a[" + a + "]");
			var cloud = st.clouds.createCloud(x, y, r, a);
			clouds.push(cloud);
		}
	},
	createCloud: function(x, y, r, a) {
		var qtyPoints = st.math.randomBetween(st.clouds.MIN_CLOUD_POINTS, st.clouds.MAX_CLOUD_POINTS); 
		
		var points = [];
		for (var i = 0; i< qtyPoints; i++) {
			var r1 = Math.random() * r;
			var radians = Math.random() * 2 * Math.PI;
			var x1 = Math.cos(radians) * r1;
			var y1 = Math.sin(radians) * r1;
			var r1 = st.math.randomBetween(0.1 * r, r);
			var a1 = a;
			var point = {
				x: x1,
				y: y1,
				a: a1,
				r: r1
			}
			points.push(point);
		}
		
		var cloud = {
			x: x,
			y: y,
			a: a,
			r: r,
			points: points
		};
		return cloud;
	}
};