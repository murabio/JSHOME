/**
 * js1 namespace.
 */
if (typeof js1 == "undefined") {
    var js1 = {

        person: null,
        personX: 290,
        personY: 590,
        adjacencyMatrix: new Array(
            new Array(0, 1, 0, 0, 0),
            new Array(1, 0, 1, 1, 0),
            new Array(0, 1, 0, 0, 0),
            new Array(0, 1, 0, 0, 1),
            new Array(0, 0, 0, 1, 0)
        ),
        position: 0,
        oldPosition: -1,
        timer: null,

        init: function() {
            js1.person = document.getElementById("person");
            js1.person.style.position = "absolute";
            js1.person.style.left = "290px";
            js1.person.style.top = "590px";
        },

        start: function() {
            if (js1.timer != null)
                clearInterval(js1.timer);
            var source = document.getElementById("source");
            var sVal = source.options[source.selectedIndex].value;
            var destination = document.getElementById("destination");
            var dVal = destination.options[destination.selectedIndex].value;
            js1.p = js1.dijkstra(parseInt(sVal), parseInt(dVal));
            js1.timer = setInterval(js1.myTimer, 20);
        },

        myTimer: function() {
            var i = js1.position;
            var nextPoi = js1.p[i];
            var x = nextPoi[0];
            var y = nextPoi[1];
            var px = js1.personX;
            var py = js1.personY;
            var op = js1.oldPosition;

            if (px < x)
                js1.personX++;
            else if (px > x)
                js1.personX--;
            if (py < y)
                js1.personY++;
            else if (py > y)
                js1.personY--;
            if (px == x && py == y) {
                if (i < js1.p.length - 1 && i > op) {
                    js1.oldPosition = i;
                    js1.position++;
                } /*else if (i == js1.p.length - 1 && js1.position > 0) {
                    js1.oldPosition = i;
                    js1.position--;
                } else if (i < js1.p.length - 1 && i > 0 && i < op) {
                    js1.oldPosition = i;
                    js1.position--;
                } */else if (i == 0) {
                    js1.oldPosition = i;
                    js1.position++;
                }
            }

            js1.person.style.left = (js1.personX) + "px";
            js1.person.style.top = (js1.personY) + "px";
        },

        dijkstra: function(source, destination) {
            var Q = new Array();
            var G = new Array();
            for (var i = 0; i < js1.adjacencyMatrix.length; i++) {
                var v = new Object();
                v.name = i;
                v.dist = null;
                v.prev = null;
                G.push(v);
                Q.push(v);
            }
            Q[source].dist = 0;
            G[source].dist = 0;
            var u = Q[source];


            while (Q.length > 0 || u.name != destination) {
                Q.sort(js1.compare);
                u = Q[0];
                if (u.name == destination)
                    break;
                Q.reverse().pop();
                for (var i = 0; i < js1.adjacencyMatrix[u.name].length; i++) {
                    var q = null;
                    for (var j = 0; j < Q.length; j++) {
                        if (Q[j].name == i) {
                            q = Q[j];
                        }
                    }
                    if (js1.adjacencyMatrix[u.name][i] == 1 && q != null) {

                        var alt = u.dist + 1;
                        if (q.dist == null || alt < q.dist) {
                            G[q.name].dist = alt;
                            G[q.name].prev = u.name;
                        }
                    }
                }

            }
            var resIndex = new Array();
            var last = destination;
            while (G[last].prev != null) {
                resIndex.push(G[last].name);
                last = G[last].prev;
            }
            resIndex.push(G[last].name);
            resIndex = resIndex.reverse();
            var resTot = new Array(
                new Array(290, 590),
                new Array(290, 490),
                new Array(290, 390),
                new Array(490, 490),
                new Array(490, 190)
            );
            var result = new Array();
            for (var i = 0; i < resIndex.length; i++) {
                result.push(resTot[resIndex[i]]);
            }
            debugger;
            js1.person.style.left = result[0][0]+"px";
            js1.person.style.top = result[0][1]+"px";
            js1.personX = result[0][0];
            js1.personY = result[0][1];
            js1.position = 0;
            return result;
        },

        compare: function(a, b) {
            if (a.dist == null && b.dist == null)
                return 0;
            if (a.dist == null)
                return 1;
            if (b.dist == null)
                return -1;
            if (a.dist < b.dist)
                return -1;
            else if (a.dist > b.dist)
                return 1;
            else
                return 0;
        }
    };
    js1.init();
};