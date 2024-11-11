function setup() {
	st.p5.init();
}

function draw() {
	background(220);
	
	stroke(0);
	strokeWeight(0.5);

	var z1 = 0;
	var z2 = 0;

	for (var x = -st.p5.w; x <= st.p5.w; x += st.p5.w / 20) {
		var x1 = x;
		var x2 = x;
		var y1 = -st.p5.h;
		var y2 = st.p5.h;
		line(x1, y1, x2, y2);
	}
	for (var y = -st.p5.h; y <= st.p5.h; y += st.p5.h / 20) {
		var y1 = y;
		var y2 = y;
		var x1 = -st.p5.w;
		var x2 = st.p5.w;
		line(x1, y1, x2, y2);
	}
}

st.p5 = {
	init() {
		var w = window.innerWidth - 32;
		var h = window.innerHeight - 140;
		
		var canvas = $("#st-canvas")[0];
		createCanvas(w, h, WEBGL, canvas);
		st.p5.w = w;
		st.p5.h = h;
		
		//var cam = createCamera();
		//cam.lookAt(0, 0, 0);
	}
};