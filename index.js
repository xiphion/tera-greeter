var stringSimilarity = require('string-similarity');
class greeter {
	constructor(mod) {
		let users = [];
		let loc
		let boyo;
		
		mod.hook('C_PLAYER_LOCATION', 5, packet => {
			loc = packet;
		})

		mod.hook('S_SPAWN_ME', 3, packet => {
			loc = packet;
			users = [];
		})

		mod.hook('S_SPAWN_USER', 13, packet => {
			users[packet.name] = packet.gameId;
		})
		
		mod.command.add('greet', {
			$default(person) {
				
				if (!person) {
					mod.command.message('enter the character name of the person you want to greet');
					return;
				}
				boyo = stringSimilarity.findBestMatch(person, Object.keys(users))
				if (boyo.bestMatch.rating < 0.4) {
					mod.command.message('person with that name not found - be more specific');
					return;
				}
				boyo = boyo.bestMatch.target;
				mod.send('C_START_INSTANCE_SKILL', 5, {
					skill: {
						npc: false,
						type: 1,
						id: 60401301
					},
					loc: loc.loc,
					w: loc.w,
					unk: false,
					targets: [{
						unk1: 0,
						target: users[boyo],
						unk2: 0
					}],
					endpoints: [{
						loc: loc
					}]
				})
			}
		})
	}
}

module.exports = greeter