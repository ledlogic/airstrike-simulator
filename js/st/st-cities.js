/* st-cities.js */

const CITY_RADIUS = 500;

st.cities = {
	cities: [],
	
	init: function() {
		st.log("st.cities.init");
		
		st.cities.createCity("soviet", "Base");
		st.cities.createCity("german", "Base");
	},

	createCity: function(team, name) {
		var full = st.p5.real.full;
		var hspread = 0.3;
		var vspread = 0.3;
		if (team == 'german') {
			var x = st.math.randomBetween(-full, (-0.5 - hspread) * full);
			var y = st.math.randomBetween(-vspread * full, vspread * full);
		}
		if (team == 'soviet') {
			var x = st.math.randomBetween(0.5 * full, (0.5 + hspread) * full);
			var y = st.math.randomBetween(-vspread * full, vspread * full);
		}			

		var city  =  {
			name: name,
			team: team,
			x: x,
			y: y,
			hp: 30
		};
		st.cities.cities.push(city);
		return city;		
	},
	
	getTeamCity: function(team) {
		var cities = st.cities.cities;
		for (var i = 0; i < cities.length; i++) {
			var city = cities[i];
			if (city.team == team) {
				return city;
			}
		}
		return null;
	}
};

st.p5.drawCities = function() {
	var ratio = st.p5.real.ratio;
	var cities = st.cities.cities;
	for (var i = 0; i < cities.length; i++) {
		var city = cities[i];
		var team = city.team;
		var fuselageColor = st.teams.getTeamColor(team);
		
		var xc = city.x / ratio;
		var yc = -city.y / ratio;
		var yr = CITY_RADIUS / ratio;
		
		strokeWeight(2.5);
		fill(0,0,0,0);
		stroke(fuselageColor);

		var x1 = (city.x - CITY_RADIUS * 0.5) / ratio;
		var y1 = (-city.y) / ratio;
		var x2 = (city.x + CITY_RADIUS * 0.5) / ratio;
		var y2 = (-city.y) / ratio;
		line(x1, y1, x2, y2);
		
		var x1 = (city.x) / ratio;
		var y1 = (-city.y - CITY_RADIUS * 0.5) / ratio;
		var x2 = (city.x) / ratio;
		var y2 = (-city.y + CITY_RADIUS * 0.5) / ratio;
		line(x1, y1, x2, y2);

		strokeWeight(5);
		circle(xc, yc, yr);

		fill(fuselageColor);
		textFont(st.p5.font);
		var t = city.name;
		text(t, xc - 12, yc + 24);				
	}
};