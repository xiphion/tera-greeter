const Command = require('command');
const Vec3 = require('tera-vec3');

module.exports = function greeter(dispatch) {
    const command = Command(dispatch);
    let users = [];
    let loc = new Vec3();
    let w;
    let gameid;

    dispatch.hook('C_PLAYER_LOCATION', 3, packet => {
        loc = packet.loc;
        w = packet.w;
    })

    dispatch.hook('S_SPAWN_ME', 2, packet => {
        loc = packet.loc;
        w = packet.w;
    })

    dispatch.hook('S_SPAWN_USER', 13, packet => {
        users[packet.name] = packet.gameId;
    })

    dispatch.hook('S_DESPAWN_USER', 3, packet => {
        users.splice(packet.name,1);
    })

    command.add('greetdbg', () => {
        console.log(users);
    })

    command.add('greet', (person) => {
        dispatch.toServer('C_START_INSTANCE_SKILL', 3, {
            skill: 127510165,
            loc: loc,
            w: w,
            unk: false,
            targets: [{unk1:0, target:users[person], unk2: 0}],
            endpoints: [{loc: loc}]
        })
    })
}
