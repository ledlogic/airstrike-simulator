/* st-grid.js */

st.grid = {
	visible: true,
	
	init: function() {
		st.log("st.grid.init");
		$("#st-cb-grid").attr("checked", st.grid.visible ? "checked" : "");
	}
};

st.p5.drawGrid = function() {
	if (!st.grid.visible) {
		return;
	}
	
	var ratio = st.p5.real.ratio;

	fill(0, 0, 0);
	stroke(0, 0, 0);
	strokeWeight(0.5);
	
	for (var realx = -st.p5.real.full; realx <= st.p5.real.full; realx += st.p5.real.minor) {
		var x1 = realx / ratio;
		var x2 = x1;
		var y1 = -st.p5.real.full / ratio;
		var y2 = st.p5.real.full / ratio;
		line(x1, y1, x2, y2);
	}

	for (var realy = -st.p5.real.full; realy <= st.p5.real.full; realy += st.p5.real.minor) {
		var x1 = -st.p5.real.full / ratio;
		var x2 = st.p5.real.full / ratio;
		var y1 = realy / ratio;
		var y2 = y1;
		line(x1, y1, x2, y2);
	}

	strokeWeight(1);
	for (var realx = -st.p5.real.full; realx <= st.p5.real.full; realx += st.p5.real.major) {
		var x1 = realx / ratio;
		var x2 = x1;
		var y1 = -st.p5.real.full / ratio;
		var y2 = st.p5.real.full / ratio;
		line(x1, y1, x2, y2);
		
		var t = Math.round(realx);
		text(t, x1+4, 12);
	}

	for (var realy = -st.p5.real.full; realy <= st.p5.real.full; realy += st.p5.real.major) {
		var x1 = -st.p5.real.full / ratio;
		var x2 = st.p5.real.full / ratio;
		var y1 = realy / ratio;
		var y2 = y1;
		line(x1, y1, x2, y2);

		var t = Math.round(realy);
		text(t, 12, y1+4);
	}

	strokeWeight(2);
	var x1 = 0 / ratio;
	var x2 = 0;
	var y1 = -st.p5.real.full / ratio;
	var y2 = st.p5.real.full / ratio;
	line(x1, y1, x2, y2);

	var x1 = -st.p5.real.full / ratio;
	var x2 = st.p5.real.full / ratio;
	var y1 = 0;
	var y2 = 0;
	line(x1, y1, x2, y2);
};