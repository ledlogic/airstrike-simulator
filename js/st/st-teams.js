/* st.roles.js */

st.teams = {
	"german": {
		"country": "Germany",
		"color": [255, 204, 0]
	},
	"soviet": {
		"country": "Soviet Union",
		"color": [204, 0, 0]
	},
	
	init: function() {
		st.log("st.teams.init");
	},
	getTeam: function(team) {
		return st.teams[team];
	},
	getTeamColor: function(team) {
		return st.teams.getTeam(team).color;
	}
};