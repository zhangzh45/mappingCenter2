(function () {
    var d, a, c, b;
    (function () {
        var f = {}, e = {};
        d = function (g, h, i) {
            f[g] = {deps: h, callback: i}
        };
        b = c = a = function (g) {
            b._eak_seen = f;
            if (e[g]) {
                return e[g]
            }
            e[g] = {};
            if (!f[g]) {
                throw new Error("Could not find module " + g)
            }
            var n = f[g], r = n.deps, q = n.callback, k = [], j;
            for (var m = 0, h = r.length; m < h; m++) {
                if (r[m] === "exports") {
                    k.push(j = {})
                } else {
                    k.push(a(p(r[m])))
                }
            }
            var o = q.apply(this, k);
            return e[g] = j || o;
            function p(x) {
                if (x.charAt(0) !== ".") {
                    return x
                }
                var w = x.split("/");
                var t = g.split("/").slice(0, -1);
                for (var v = 0, s = w.length; v < s; v++) {
                    var u = w[v];
                    if (u === "..") {
                        t.pop()
                    } else {
                        if (u === ".") {
                            continue
                        } else {
                            t.push(u)
                        }
                    }
                }
                return t.join("/")
            }
        }
    })();
    d("promise/all", ["./utils", "exports"], function (i, g) {
        var e = i.isArray;
        var h = i.isFunction;

        function f(j) {
            var k = this;
            if (!e(j)) {
                throw new TypeError("You must pass an array to all.")
            }
            return new k(function (q, p) {
                var n = [], o = j.length, s;
                if (o === 0) {
                    q([])
                }
                function r(t) {
                    return function (u) {
                        l(t, u)
                    }
                }

                function l(t, u) {
                    n[t] = u;
                    if (--o === 0) {
                        q(n)
                    }
                }

                for (var m = 0; m < j.length; m++) {
                    s = j[m];
                    if (s && h(s.then)) {
                        s.then(r(m), p)
                    } else {
                        l(m, s)
                    }
                }
            })
        }

        g.all = f
    });
    d("promise/asap", ["exports"], function (o) {
        var m = (typeof window !== "undefined") ? window : {};
        var j = m.MutationObserver || m.WebKitMutationObserver;
        var l = (typeof global !== "undefined") ? global : (this === undefined ? window : this);

        function k() {
            return function () {
                process.nextTick(n)
            }
        }

        function g() {
            var r = 0;
            var p = new j(n);
            var q = document.createTextNode("");
            p.observe(q, {characterData: true});
            return function () {
                q.data = (r = ++r % 2)
            }
        }

        function i() {
            return function () {
                l.setTimeout(n, 1)
            }
        }

        var h = [];

        function n() {
            for (var r = 0; r < h.length; r++) {
                var q = h[r];
                var s = q[0], p = q[1];
                s(p)
            }
            h = []
        }

        var f;
        if (typeof process !== "undefined" && {}.toString.call(process) === "[object process]") {
            f = k()
        } else {
            if (j) {
                f = g()
            } else {
                f = i()
            }
        }
        function e(r, p) {
            var q = h.push([r, p]);
            if (q === 1) {
                f()
            }
        }

        o.asap = e
    });
    d("promise/config", ["exports"], function (g) {
        var f = {instrument: false};

        function e(h, i) {
            if (arguments.length === 2) {
                f[h] = i
            } else {
                return f[h]
            }
        }

        g.config = f;
        g.configure = e
    });
    d("promise/polyfill", ["./promise", "./utils", "exports"], function (j, f, g) {
        var e = j.Promise;
        var i = f.isFunction;

        function h() {
            var l;
            if (typeof global !== "undefined") {
                l = global
            } else {
                if (typeof window !== "undefined" && window.document) {
                    l = window
                } else {
                    l = self
                }
            }
            var k = "Promise" in l && "resolve" in l.Promise && "reject" in l.Promise && "all" in l.Promise && "race" in l.Promise && (function () {
                    var m;
                    new l.Promise(function (n) {
                        m = n
                    });
                    return i(m)
                }());
            if (true) {
                l.Promise = e
            }
        }

        g.polyfill = h
    });
    d("promise/promise", ["./config", "./utils", "./all", "./race", "./resolve", "./reject", "./asap", "exports"], function (y, e, A, m, C, r, F, l) {
        var J = y.config;
        var K = y.configure;
        var x = e.objectOrFunction;
        var f = e.isFunction;
        var i = e.now;
        var j = A.all;
        var o = m.race;
        var q = C.resolve;
        var h = r.reject;
        var B = F.asap;
        var w = 0;
        J.async = B;
        function k(M) {
            if (!f(M)) {
                throw new TypeError("You must pass a resolver function as the first argument to the promise constructor")
            }
            if (!(this instanceof k)) {
                throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.")
            }
            this._subscribers = [];
            I(M, this)
        }

        function I(Q, P) {
            function M(R) {
                D(P, R)
            }

            function O(R) {
                p(P, R)
            }

            try {
                Q(M, O)
            } catch (N) {
                O(N)
            }
        }

        function G(T, V, S, O) {
            var M = f(S), R, Q, U, N;
            if (M) {
                try {
                    R = S(O);
                    U = true
                } catch (P) {
                    N = true;
                    Q = P
                }
            } else {
                R = O;
                U = true
            }
            if (z(V, R)) {
                return
            } else {
                if (M && U) {
                    D(V, R)
                } else {
                    if (N) {
                        p(V, Q)
                    } else {
                        if (T === g) {
                            D(V, R)
                        } else {
                            if (T === L) {
                                p(V, R)
                            }
                        }
                    }
                }
            }
        }

        var s = void 0;
        var v = 0;
        var g = 1;
        var L = 2;

        function u(M, R, Q, P) {
            var O = M._subscribers;
            var N = O.length;
            O[N] = R;
            O[N + g] = Q;
            O[N + L] = P
        }

        function E(Q, M) {
            var S, R, P = Q._subscribers, O = Q._detail;
            for (var N = 0; N < P.length; N += 3) {
                S = P[N];
                R = P[N + M];
                G(M, S, R, O)
            }
            Q._subscribers = null
        }

        k.prototype = {
            constructor: k,
            _state: undefined,
            _detail: undefined,
            _subscribers: undefined,
            then: function (R, P) {
                var Q = this;
                var N = new this.constructor(function () {
                });
                if (this._state) {
                    var O = arguments;
                    J.async(function M() {
                        G(Q._state, N, O[Q._state - 1], Q._detail)
                    })
                } else {
                    u(this, N, R, P)
                }
                return N
            },
            "catch": function (M) {
                return this.then(null, M)
            }
        };
        k.all = j;
        k.race = o;
        k.resolve = q;
        k.reject = h;
        function z(Q, O) {
            var P = null, M;
            try {
                if (Q === O) {
                    throw new TypeError("A promises callback cannot return that same promise.")
                }
                if (x(O)) {
                    P = O.then;
                    if (f(P)) {
                        P.call(O, function (R) {
                            if (M) {
                                return true
                            }
                            M = true;
                            if (O !== R) {
                                D(Q, R)
                            } else {
                                n(Q, R)
                            }
                        }, function (R) {
                            if (M) {
                                return true
                            }
                            M = true;
                            p(Q, R)
                        });
                        return true
                    }
                }
            } catch (N) {
                if (M) {
                    return true
                }
                p(Q, N);
                return true
            }
            return false
        }

        function D(N, M) {
            if (N === M) {
                n(N, M)
            } else {
                if (!z(N, M)) {
                    n(N, M)
                }
            }
        }

        function n(N, M) {
            if (N._state !== s) {
                return
            }
            N._state = v;
            N._detail = M;
            J.async(H, N)
        }

        function p(N, M) {
            if (N._state !== s) {
                return
            }
            N._state = v;
            N._detail = M;
            J.async(t, N)
        }

        function H(M) {
            E(M, M._state = g)
        }

        function t(M) {
            E(M, M._state = L)
        }

        l.Promise = k
    });
    d("promise/race", ["./utils", "exports"], function (h, g) {
        var e = h.isArray;

        function f(i) {
            var j = this;
            if (!e(i)) {
                throw new TypeError("You must pass an array to race.")
            }
            return new j(function (n, m) {
                var l = [], o;
                for (var k = 0; k < i.length; k++) {
                    o = i[k];
                    if (o && typeof o.then === "function") {
                        o.then(n, m)
                    } else {
                        n(o)
                    }
                }
            })
        }

        g.race = f
    });
    d("promise/reject", ["exports"], function (f) {
        function e(h) {
            var g = this;
            return new g(function (j, i) {
                i(h)
            })
        }

        f.reject = e
    });
    d("promise/resolve", ["exports"], function (f) {
        function e(h) {
            if (h && typeof h === "object" && h.constructor === this) {
                return h
            }
            var g = this;
            return new g(function (i) {
                i(h)
            })
        }

        f.resolve = e
    });
    d("promise/utils", ["exports"], function (h) {
        function g(j) {
            return i(j) || (typeof j === "object" && j !== null)
        }

        function i(j) {
            return typeof j === "function"
        }

        function e(j) {
            return Object.prototype.toString.call(j) === "[object Array]"
        }

        var f = Date.now || function () {
                return new Date().getTime()
            };
        h.objectOrFunction = g;
        h.isFunction = i;
        h.isArray = e;
        h.now = f
    });
    a("promise/polyfill").polyfill()
}());