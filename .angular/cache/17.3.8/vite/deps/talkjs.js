import "./chunk-EHLZM3EC.js";

// node_modules/talkjs/src/index.esnext.js
if (typeof window === "undefined") {
  throw new Error("[TalkJS] The TalkJS JavaScript SDK only works in browsers (and not, for example, in Node.js)");
}
(function(t, a, l, k, j, s) {
  s = a.createElement("script");
  s.async = 1;
  s.src = "https://cdn.talkjs.com/talk.js";
  a.head.appendChild(s);
  k = t.Promise;
  t.Talk = { v: 3, ready: { then: function(f) {
    if (k)
      return new k(function(r, e) {
        l.push([f, r, e]);
      });
    l.push([f]);
  }, catch: function() {
    return k && new k();
  }, c: l } };
})(window, document, []);
var Talk = window.Talk;
var index_esnext_default = Talk;
export {
  index_esnext_default as default
};
//# sourceMappingURL=talkjs.js.map
