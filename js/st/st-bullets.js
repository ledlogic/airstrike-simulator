/* st-bullets.js */

const MAX_SHOOT_BULLET_DELTA_ANGLE = 20;
const BULLET_V = 3730 * KPH_TO_MPM;
const EXPLOSION_V = 373 * KPH_TO_MPM;

// bullets/shells
st.bullets = {
	bullets: [],
	
	v: BULLET_V,

	init: function() {
	},

	createBullet: function(x, y, a, cnt) {
		var bullet  =  {
			x: x,
			y: y,
			a: a,
			v: st.bullets.v,
			distance: 0,
			cnt: cnt,
			active: true,
			range: 2500
		};
		st.bullets.bullets.push(bullet);
		return bullet;		
	}
};