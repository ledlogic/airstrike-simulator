/* st-bullets.js */

const MAX_SHOOT_BULLET_DELTA_ANGLE = 20;
const BULLET_V = 3730 * KPH_TO_MPM;
const EXPLOSION_V = 373 * KPH_TO_MPM;

// bullets/shells
st.bullets = {
	bullets: [],

	v: BULLET_V,

	init: function() {
		st.log("st.bullets.init");
	},

	createBullet: function(x, y, a, cnt) {
		var bullet = {
			x: x,
			y: y,
			a: a,
			v: st.bullets.v,
			distance: 0,
			cnt: cnt,
			active: true,
			range: 2500,
			color: { r: 120, g: 120, b: 120 }
		};
		st.bullets.bullets.push(bullet);
		return bullet;
	},

	createExplosion: function(x, y, a, cnt) {
		var bullet = st.bullets.createBullet(x, y, a, cnt);
		bullet.v = st.math.randomBetween(0, EXPLOSION_V);
		var r = st.math.randomBetween(120, 255);
		var g = st.math.randomBetween(0, r);
		bullet.color = { r: r, g: g, b: 0 }
	}
};

st.p5.drawBullets = function() {
	var ratio = st.p5.real.ratio;
	var bullets = st.bullets.bullets;
	var scale = st.p5.time.scale;

	for (var i = 0; i < bullets.length; i++) {
		var bullet = bullets[i];
		var x = bullet.x;
		var y = bullet.y;
		var a = bullet.a;
		var v = bullet.v / 2.5;

		// convert from geographic
		var canvasa = 90.0 - a;

		var mc = Math.cos(canvasa / 180.0 * Math.PI);
		var ms = Math.sin(canvasa / 180.0 * Math.PI);

		stroke(0, 0, 0, 0);
		var cnt = st.math.randomBetween(bullet.cnt, bullet.cnt * 2);
		for (var b = 0; b < cnt; b++) {
			var xb = (x + b * mc * v * st.p5.time.delta / scale) / ratio;
			var yb = (-y - b * ms * v * st.p5.time.delta / scale) / ratio;
			stroke(0, 0, 0, 0);
			fill(bullet.color.r, bullet.color.g, bullet.color.b, Math.round(st.math.randomBetween(200, 255)));
			circle(xb, yb, 2);
		}
	}
};

st.time.updateBullets = function() {
	var bullets = st.bullets.bullets;
	var drift = st.clouds.drift;
	var scale = st.p5.time.scale;
	var overflow = st.p5.real.full * 1.1;
	var newBullets = [];
	for (var i = 0; i < bullets.length; i++) {
		var bullet = bullets[i];
		if (bullet.active) {
			var x = bullet.x;
			var y = bullet.y;
			var a = bullet.a;
			var v = bullet.v;

			// convert from geographic
			var canvasa = 90.0 - a;

			var mc = Math.cos(canvasa / 180.0 * Math.PI);
			var ms = Math.sin(canvasa / 180.0 * Math.PI);

			var deltaX = mc * v * st.p5.time.delta / scale;
			var deltaY = ms * v * st.p5.time.delta / scale;

			var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
			bullet.distance += dist;
			if (bullet.distance > bullet.range) {
				bullet.active = false;
			}
			if (bullet.a == 0) {
				bullet.active = false;
			}
			
			if (bullet.active) {
				bullet.x = x + deltaX + drift.x;
				bullet.y = y + deltaY + drift.y;
				
				switch (true) {
					case (bullet.x < -overflow):
					case (bullet.x > overflow):
					case (bullet.y < -overflow):
					case (bullet.y > overflow):
						bullet.active = false;
						break;
				}
			}			
		}
		if (bullet.active) {
			bullet.color.r = st.math.ratioAverage(bullet.color.r, 120, 0.01);
			bullet.color.g = st.math.ratioAverage(bullet.color.g, 120, 0.01);
			bullet.color.b = st.math.ratioAverage(bullet.color.b, 120, 0.01);
			bullet.v *= 0.95;
			newBullets.push(bullet);
		}
	}
	st.bullets.bullets = newBullets;
};
