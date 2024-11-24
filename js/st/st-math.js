/* st-math.js */

st.math = {
	init: function() {
		st.log("init math");
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
	}
};