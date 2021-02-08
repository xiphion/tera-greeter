var stringSimilarity = require("string-similarity");


class greeter {
	constructor(mod) {
		let userid = [];
		let userloc = [];
		let loc
		let boyo;
		let index;
		let angle;
		let tempPackie;

		mod.hook('C_NOTIFY_LOCATION_IN_ACTION', 4, { filter: { fake: null, modified: null } }, packet => {
			loc = packet.loc;
		})
		
		mod.hook('C_NOTIFY_LOCATION_IN_DASH', 4, { filter: { fake: null, modified: null } }, packet => {
			loc = packet.loc;
		})
		
		mod.hook('C_PRESS_SKILL', 4, { filter: { fake: null, modified: null } }, packet => {
			loc = packet.loc;
		})
		
		mod.hook('C_START_SKILL', 7, { filter: { fake: null, modified: null } }, packet => {
			loc = packet.loc;
		})
		
		mod.hook('C_START_TARGETED_SKILL', 7, { filter: { fake: null, modified: null } }, packet => {
			loc = packet.loc;
		})
		
		mod.hook('C_START_COMBO_INSTANT_SKILL', 6, { filter: { fake: null, modified: null } }, packet => {
			loc = packet.loc;	
		})
		
		mod.hook('C_START_INSTANCE_SKILL', 7, { filter: { fake: null, modified: null } }, packet => {
			loc = packet.loc;
		})
		
		mod.hook('C_START_INSTANCE_SKILL_EX', 5, { filter: { fake: null, modified: null } }, packet => {
			loc = packet.loc;
		})
		
		mod.hook('C_PLAYER_LOCATION', 5, packet => {
			loc = packet.loc;
			angle = packet.w;
		})
		
		mod.hook('C_PLAYER_FLYING_LOCATION', 4, packet => {
			loc = packet.loc;
		})
		
		mod.hook('S_SPAWN_ME', 3, packet => {
			loc = packet.loc;
			userid = [];
		})
		
		mod.hook('S_USER_LOCATION', 5, packet => {
			userloc[packet.gameId] = packet.loc;
		})
		
		mod.hook('S_SPAWN_USER', 17, packet => {
			userid[packet.name] = packet.gameId;
			userloc[packet.gameId] = packet.loc;
		})
		
		mod.hook('S_DESPAWN_USER', 3, packet => {
			index = userid.indexOf(packet.gameId);
			if(index > -1) {
				userid.splice(index, 1);
				userloc.splice(packet.gameId, 1);
			}
		})
		
		mod.command.add('greet', {
			$default(person) {
				
				if (!person || typeof(person) !== 'string') {
					mod.command.message('enter the character name of the person you want to greet');
					return;
				}
				boyo = stringSimilarity.findBestMatch(person, Object.keys(userid))
				if (boyo.bestMatch.rating < 0.4) {
					mod.command.message('person with that name not found - be more specific');
					return;
				}
				
				boyo = boyo.bestMatch.target;
				
				greetBloke();
			}
		})

		function greetBloke() {
			mod.send('C_START_INSTANCE_SKILL', 7, {
				skill: {
					reserved: 0,
					npc: false,
					type: 1,
					huntingZoneId: 0,
					id: 60401301
				},
				loc: loc,
				w: angle,
				continue: false,
				targets: [{
					arrowId: 0,
					gameId: userid[boyo],
					hitCylinderId: 0
				}],
				endpoints: [userloc[userid[boyo]]]
			});
		}
	}
}

module.exports = greeter