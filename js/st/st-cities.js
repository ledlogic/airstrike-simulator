/* st-cities.js */

st.cities = {
	cities: [],
	
	init: function() {
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
		
		fill(fuselageColor);
		stroke(0, 0, 0, 0);
		circle(xc, yc, 20);

		fill(fuselageColor);
		textFont(st.p5.font);
		var t = city.name;
		text(t, xc - 20, yc + 24);					
	}
};