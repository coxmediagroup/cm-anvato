var players = {},
    requests = {};

module.exports = {
    get: function (id, resolve) {
        if (id in players) {
            resolve(players[id]);
        } else {
            requests[id] = requests[id] || [];
            requests[id].push(resolve);
        }
    },
    add: function (id, player) {
        players[id] = player;
        if (id in requests) {
            requests[id].forEach(function (resolve) {
                resolve(player);
            });
            requests[id] = [];
        }
    }
};
