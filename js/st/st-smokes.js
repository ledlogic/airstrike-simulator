/* st-smokes.js */

st.smokes = {
	init: function() {
		st.log("st.smokes.init");
	}
};

st.p5.drawSmokes = function() {
	var ratio = st.p5.real.ratio;
	var planes = st.planes.planes;
	for (var i = 0; i < planes.length; i++) {
		var plane = planes[i];
		var smokes = plane.smokes;
		for (var j = 0; j < smokes.length; j++) {
			var smoke = smokes[j];
			var x = smoke.x / ratio;
			var y = -smoke.y / ratio;
			var a = smoke.a;
			
			if (plane.smoke) {
				stroke(0,0,0,0);
				fill(55, 55, 55, a);
				circle(x, y, 5);
			} else if (!plane.smoke && j > 0) {
				var x1 = x;
				var y1 = y;

				var smoke2 = smokes[j-1];
				var x2 = smoke2.x / ratio;
				var y2 = -smoke2.y / ratio;
				
				strokeWeight(5);
				stroke(125, 125, 125, a);
				line(x1, y1, x2, y2);
			}
		}
	}
};

st.time.updateSmokes = function() {
	var smokeDelta = 10;
	var drift = st.clouds.drift;
	var planes = st.planes.planes;
	for (var i = 0; i < planes.length; i++) {
		var plane = planes[i];
		
		//if (plane.smoke) {
			// fade smoke
			var smokes = plane.smokes;
			var minJ = 0;
			for (var j = 0; j < smokes.length; j++) {
				var smoke = smokes[j];
				smoke.a = smoke.a - smokeDelta;
				
				smoke.x += drift.x;
				smoke.y += drift.y;
				
				if (smoke.a <= 0) {
					minJ = j;	
				}
			}
			if (minJ > 0) {
				plane.smokes = _.drop(smokes, minJ);
			}

			if (plane.structure > 0) {
				var x = plane.x;
				var y = plane.y;
				var pt = {
					x : x, 
					y: y,
					a: 180
				};
				plane.smokes.push(pt);
			}
		//}
	}
};