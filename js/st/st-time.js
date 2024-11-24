/* st-time.js */

const MAX_SHOOT_DELAYS_BEFORE_NEW_TARGET = 4;

st.time = {
	init: function() {
		st.log("init time");
	},

	updateTime: function() {
		var current = millis();
		st.p5.time.current = current;
	
		var smokeDelta = 75;
		var last = st.p5.time.last;
		if (current) {
			var delta = current - last;
			st.p5.time.delta = delta;
			
			// smokes			
			st.p5.time.cumDelta += delta;		
			if (st.p5.time.cumDelta > smokeDelta) {
				st.time.updateSmokes();
				st.p5.time.cumDelta -= smokeDelta;
			}
			
			// planes
			st.time.updatePlanes();
			
			// bullets
			st.time.updateBullets();
			
			// clouds
			st.time.updateClouds();
		}
		st.p5.time.last = current;
	}

};