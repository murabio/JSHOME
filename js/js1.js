/**
 * js1 namespace.
 */
if (typeof js1 == "undefined") {
    var js1 = {

        person: null,
        personX: 270,
        personY: 430,
        adjacencyMatrix: null,
        positionAbs: 6,
        positionRel: 0,
        poi: null,
        timer: null,

        init: function() {
            js1.adjacencyMatrix = JSON.parse(js1.GetText(location.href + "/json/json2.json"));
            var selectList = document.getElementById("destination");
            js1.poi = JSON.parse(js1.GetText(location.href + "/json/json1.json"));
            js1.person = document.getElementById("person");
            js1.person.style.position = "absolute";
            js1.person.style.left = js1.personX + "px";
            js1.person.style.top = js1.personY + "px";
            for (var i = 0; i < js1.poi.p.length; i++) {
                var div = document.createElement("div");
                div.style.background =  "#fffff";// "#991111";
                div.style.width = "10px";
                div.style.height = "10px";
                div.style.borderRadius = "25px";
                div.style.position = "absolute";
                div.style.left = js1.poi.p[i].x;
                div.style.top = js1.poi.p[i].y;
                document.getElementById("poi").appendChild(div);

                var option = document.createElement("option");
                option.value = i;
                option.text = "p" + (i + 1);
                selectList.appendChild(option);
            }


        },

        start: function() {

            var sVal = js1.positionAbs;
            var destination = document.getElementById("destination");
            var dVal = destination.options[destination.selectedIndex].value;
            js1.p = js1.dijkstra(parseInt(sVal), parseInt(dVal));
            js1.positionRel = 0;
            js1.timer = setInterval(js1.myTimer, 45);
        },

        myTimer: function() {
            var i = js1.positionRel;
            var nextPoi = js1.p[i];
            var x = nextPoi[0];
            var y = nextPoi[1];
            var px = js1.personX;
            var py = js1.personY;
            var diffx = 1, diffy = 1, rapx = 1, rapy = 1;

            diffx = x - px;
            if (x < px)
                diffx = -diffx;
            diffy = y - py;
            if (y < py)
                diffy = -diffy;


            if (diffy > 0 && diffx < diffy) {
                rapx = diffx / diffy;
            }
            if (diffx > 0 && diffy < diffx) {
                rapy = diffy / diffx;
            }
            if (px < x)
                js1.personX = js1.personX + (5 * rapx);
            else if (px > x)
                js1.personX = js1.personX - (5 * rapx);

            if (py < y)
                js1.personY = js1.personY + (5 * rapy);
            else if (py > y)
                js1.personY = js1.personY - (5 * rapy);

            if (px == x && py == y) {
                if (i == js1.p.length - 1) {
                    clearInterval(js1.timer);
                }
                js1.positionRel++;
            }

            for (var j = 0; j < js1.poi.p.length; j++) {
                if (parseInt(px) + 5 == parseInt(js1.poi.p[j].x) && parseInt(py) + 5 == parseInt(js1.poi.p[j].y)) {
                    js1.positionAbs = j;
                }
            }
            /**
             * Commentato perchè per serve solo per debug
             */
            var div = document.getElementById('position');
            div.innerHTML = 'Position abs ' + js1.positionAbs;
            div.innerHTML += '</br>';
            div.innerHTML += 'Position rel ' + (parseInt(js1.positionRel) - 1);
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
            var result = new Array();
            for (var i = 0; i < resIndex.length; i++) {
                var poi = new Array();
                poi.push(js1.poi.p[resIndex[i]].x - 5);
                poi.push(js1.poi.p[resIndex[i]].y - 5);
                result.push(poi);
            }
            js1.person.style.left = result[0][0] + "px";
            js1.person.style.top = result[0][1] + "px";
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
        },

        GetText: function(url) {
            var Httpreq = new XMLHttpRequest(); // a new request
            Httpreq.open("GET", url, false);
            Httpreq.send(null);
            return Httpreq.responseText;
        }

    };
    js1.init();
};
