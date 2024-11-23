/* st-bullets.js */

const MAX_SHOOT_BULLET_DELTA_ANGLE = 10;

// bullets/shells
st.bullets = {
	bullets: [],
	
	v: 3730 * KPH_TO_MPM,

	init: function() {
	},

	createBullet: function(x, y, a) {
		var bullet  =  {
			x: x,
			y: y,
			a: a,
			v: st.bullets.v,
			active: true
		};
		st.bullets.bullets.push(bullet);
		return bullet;		
	}
};