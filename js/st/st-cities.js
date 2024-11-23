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