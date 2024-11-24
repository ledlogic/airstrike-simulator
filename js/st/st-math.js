/* st-math.js */

st.math = {
	init: function() {
		st.log("st.math.init");
	},
	die : function(qty, die, mod) {
		var ret = mod;
		for (var i = 0; i < qty; i++) {
			ret += st.math.dieN(die);
		}
		return ret;
	},
	dieN : function(die) {
		return Math.floor(Math.random() * die) + 1;
	},
	dieArray : function(array) {
		return Math.floor(Math.random() * array.length);
	},
	ensureRange: function(value, min, max) {
		var ret = value;
		ret = Math.max(min, ret);
		ret = Math.min(max, ret);
		return ret;
	},
	average: function(f1, f2) {
		return 0.5 * (f1 + f2);
	},
	ratioAverage: function(f1, f2, r) {
		var low = Math.min(f1, f2);
		var high = Math.max(f1, f2);
		return r * low + (1.0 - r) * high;
	},
	averageUp: function() {
		var tot = 0;
		var len = arguments.length;
		for (var i=0; i<len; i++) {
			tot += arguments[i] ? arguments[i] : 0;
		}
		var ret = Math.ceil(tot / len);
		return ret;
	},
	randomAngle: function() {
		return Math.random() * 360.0;
	},
	randomBetween: function(low, high) {
		return Math.random() * (high - low) + low;
	},
	fixColor: function(value) {
		var ret = value;
		ret = Math.min(ret, 255);
		ret = Math.max(ret, 0);
		return ret;
	},
	distance: function(dx, dy) {
		return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
	},
	/** 
	 * Returns the (absolute) distance from p1 to p2
	 */
	calcPointDistance: function(p1, p2) {
		var dx = (p2.x - p1.x);
		var dy = (p2.y - p1.y);
		var d = st.math.distance(dx, dy);
		return d;
	},
	/** 
	 * Returns the geo angle difference from p1 to p2
	 */
	calcPointAngle: function(p1, p2) {
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
	}
};