// ../../../AppData/Local/Programs/Antigravity IDE/resources/app/node_modules/preact/dist/preact.module.js
var n;
var l;
var u;
var t;
var i;
var r;
var o;
var e;
var f;
var c;
var s;
var a;
var h;
var p = {};
var v = [];
var y = /acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i;
var w = Array.isArray;
function d(n2, l3) {
  for (var u4 in l3) n2[u4] = l3[u4];
  return n2;
}
function g(n2) {
  n2 && n2.parentNode && n2.parentNode.removeChild(n2);
}
function _(l3, u4, t3) {
  var i3, r3, o3, e3 = {};
  for (o3 in u4) "key" == o3 ? i3 = u4[o3] : "ref" == o3 ? r3 = u4[o3] : e3[o3] = u4[o3];
  if (arguments.length > 2 && (e3.children = arguments.length > 3 ? n.call(arguments, 2) : t3), "function" == typeof l3 && null != l3.defaultProps) for (o3 in l3.defaultProps) void 0 === e3[o3] && (e3[o3] = l3.defaultProps[o3]);
  return m(l3, e3, i3, r3, null);
}
function m(n2, t3, i3, r3, o3) {
  var e3 = { type: n2, props: t3, key: i3, ref: r3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: null == o3 ? ++u : o3, __i: -1, __u: 0 };
  return null == o3 && null != l.vnode && l.vnode(e3), e3;
}
function k(n2) {
  return n2.children;
}
function x(n2, l3) {
  this.props = n2, this.context = l3;
}
function S(n2, l3) {
  if (null == l3) return n2.__ ? S(n2.__, n2.__i + 1) : null;
  for (var u4; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) return u4.__e;
  return "function" == typeof n2.type ? S(n2) : null;
}
function C(n2) {
  var l3, u4;
  if (null != (n2 = n2.__) && null != n2.__c) {
    for (n2.__e = n2.__c.base = null, l3 = 0; l3 < n2.__k.length; l3++) if (null != (u4 = n2.__k[l3]) && null != u4.__e) {
      n2.__e = n2.__c.base = u4.__e;
      break;
    }
    return C(n2);
  }
}
function M(n2) {
  (!n2.__d && (n2.__d = true) && i.push(n2) && !$.__r++ || r != l.debounceRendering) && ((r = l.debounceRendering) || o)($);
}
function $() {
  for (var n2, u4, t3, r3, o3, f4, c3, s3 = 1; i.length; ) i.length > s3 && i.sort(e), n2 = i.shift(), s3 = i.length, n2.__d && (t3 = void 0, r3 = void 0, o3 = (r3 = (u4 = n2).__v).__e, f4 = [], c3 = [], u4.__P && ((t3 = d({}, r3)).__v = r3.__v + 1, l.vnode && l.vnode(t3), O(u4.__P, t3, r3, u4.__n, u4.__P.namespaceURI, 32 & r3.__u ? [o3] : null, f4, null == o3 ? S(r3) : o3, !!(32 & r3.__u), c3), t3.__v = r3.__v, t3.__.__k[t3.__i] = t3, N(f4, t3, c3), r3.__e = r3.__ = null, t3.__e != o3 && C(t3)));
  $.__r = 0;
}
function I(n2, l3, u4, t3, i3, r3, o3, e3, f4, c3, s3) {
  var a3, h3, y3, w3, d3, g4, _3, m3 = t3 && t3.__k || v, b2 = l3.length;
  for (f4 = P(u4, l3, m3, f4, b2), a3 = 0; a3 < b2; a3++) null != (y3 = u4.__k[a3]) && (h3 = -1 == y3.__i ? p : m3[y3.__i] || p, y3.__i = a3, g4 = O(n2, y3, h3, i3, r3, o3, e3, f4, c3, s3), w3 = y3.__e, y3.ref && h3.ref != y3.ref && (h3.ref && B(h3.ref, null, y3), s3.push(y3.ref, y3.__c || w3, y3)), null == d3 && null != w3 && (d3 = w3), (_3 = !!(4 & y3.__u)) || h3.__k === y3.__k ? f4 = A(y3, f4, n2, _3) : "function" == typeof y3.type && void 0 !== g4 ? f4 = g4 : w3 && (f4 = w3.nextSibling), y3.__u &= -7);
  return u4.__e = d3, f4;
}
function P(n2, l3, u4, t3, i3) {
  var r3, o3, e3, f4, c3, s3 = u4.length, a3 = s3, h3 = 0;
  for (n2.__k = new Array(i3), r3 = 0; r3 < i3; r3++) null != (o3 = l3[r3]) && "boolean" != typeof o3 && "function" != typeof o3 ? (f4 = r3 + h3, (o3 = n2.__k[r3] = "string" == typeof o3 || "number" == typeof o3 || "bigint" == typeof o3 || o3.constructor == String ? m(null, o3, null, null, null) : w(o3) ? m(k, { children: o3 }, null, null, null) : null == o3.constructor && o3.__b > 0 ? m(o3.type, o3.props, o3.key, o3.ref ? o3.ref : null, o3.__v) : o3).__ = n2, o3.__b = n2.__b + 1, e3 = null, -1 != (c3 = o3.__i = L(o3, u4, f4, a3)) && (a3--, (e3 = u4[c3]) && (e3.__u |= 2)), null == e3 || null == e3.__v ? (-1 == c3 && (i3 > s3 ? h3-- : i3 < s3 && h3++), "function" != typeof o3.type && (o3.__u |= 4)) : c3 != f4 && (c3 == f4 - 1 ? h3-- : c3 == f4 + 1 ? h3++ : (c3 > f4 ? h3-- : h3++, o3.__u |= 4))) : n2.__k[r3] = null;
  if (a3) for (r3 = 0; r3 < s3; r3++) null != (e3 = u4[r3]) && 0 == (2 & e3.__u) && (e3.__e == t3 && (t3 = S(e3)), D(e3, e3));
  return t3;
}
function A(n2, l3, u4, t3) {
  var i3, r3;
  if ("function" == typeof n2.type) {
    for (i3 = n2.__k, r3 = 0; i3 && r3 < i3.length; r3++) i3[r3] && (i3[r3].__ = n2, l3 = A(i3[r3], l3, u4, t3));
    return l3;
  }
  n2.__e != l3 && (t3 && (l3 && n2.type && !l3.parentNode && (l3 = S(n2)), u4.insertBefore(n2.__e, l3 || null)), l3 = n2.__e);
  do {
    l3 = l3 && l3.nextSibling;
  } while (null != l3 && 8 == l3.nodeType);
  return l3;
}
function H(n2, l3) {
  return l3 = l3 || [], null == n2 || "boolean" == typeof n2 || (w(n2) ? n2.some(function(n3) {
    H(n3, l3);
  }) : l3.push(n2)), l3;
}
function L(n2, l3, u4, t3) {
  var i3, r3, o3, e3 = n2.key, f4 = n2.type, c3 = l3[u4], s3 = null != c3 && 0 == (2 & c3.__u);
  if (null === c3 && null == n2.key || s3 && e3 == c3.key && f4 == c3.type) return u4;
  if (t3 > (s3 ? 1 : 0)) {
    for (i3 = u4 - 1, r3 = u4 + 1; i3 >= 0 || r3 < l3.length; ) if (null != (c3 = l3[o3 = i3 >= 0 ? i3-- : r3++]) && 0 == (2 & c3.__u) && e3 == c3.key && f4 == c3.type) return o3;
  }
  return -1;
}
function T(n2, l3, u4) {
  "-" == l3[0] ? n2.setProperty(l3, null == u4 ? "" : u4) : n2[l3] = null == u4 ? "" : "number" != typeof u4 || y.test(l3) ? u4 : u4 + "px";
}
function j(n2, l3, u4, t3, i3) {
  var r3, o3;
  n: if ("style" == l3) if ("string" == typeof u4) n2.style.cssText = u4;
  else {
    if ("string" == typeof t3 && (n2.style.cssText = t3 = ""), t3) for (l3 in t3) u4 && l3 in u4 || T(n2.style, l3, "");
    if (u4) for (l3 in u4) t3 && u4[l3] == t3[l3] || T(n2.style, l3, u4[l3]);
  }
  else if ("o" == l3[0] && "n" == l3[1]) r3 = l3 != (l3 = l3.replace(f, "$1")), o3 = l3.toLowerCase(), l3 = o3 in n2 || "onFocusOut" == l3 || "onFocusIn" == l3 ? o3.slice(2) : l3.slice(2), n2.l || (n2.l = {}), n2.l[l3 + r3] = u4, u4 ? t3 ? u4.u = t3.u : (u4.u = c, n2.addEventListener(l3, r3 ? a : s, r3)) : n2.removeEventListener(l3, r3 ? a : s, r3);
  else {
    if ("http://www.w3.org/2000/svg" == i3) l3 = l3.replace(/xlink(H|:h)/, "h").replace(/sName$/, "s");
    else if ("width" != l3 && "height" != l3 && "href" != l3 && "list" != l3 && "form" != l3 && "tabIndex" != l3 && "download" != l3 && "rowSpan" != l3 && "colSpan" != l3 && "role" != l3 && "popover" != l3 && l3 in n2) try {
      n2[l3] = null == u4 ? "" : u4;
      break n;
    } catch (n3) {
    }
    "function" == typeof u4 || (null == u4 || false === u4 && "-" != l3[4] ? n2.removeAttribute(l3) : n2.setAttribute(l3, "popover" == l3 && 1 == u4 ? "" : u4));
  }
}
function F(n2) {
  return function(u4) {
    if (this.l) {
      var t3 = this.l[u4.type + n2];
      if (null == u4.t) u4.t = c++;
      else if (u4.t < t3.u) return;
      return t3(l.event ? l.event(u4) : u4);
    }
  };
}
function O(n2, u4, t3, i3, r3, o3, e3, f4, c3, s3) {
  var a3, h3, p3, v3, y3, _3, m3, b2, S2, C3, M2, $2, P4, A4, H3, L2, T4, j4 = u4.type;
  if (null != u4.constructor) return null;
  128 & t3.__u && (c3 = !!(32 & t3.__u), o3 = [f4 = u4.__e = t3.__e]), (a3 = l.__b) && a3(u4);
  n: if ("function" == typeof j4) try {
    if (b2 = u4.props, S2 = "prototype" in j4 && j4.prototype.render, C3 = (a3 = j4.contextType) && i3[a3.__c], M2 = a3 ? C3 ? C3.props.value : a3.__ : i3, t3.__c ? m3 = (h3 = u4.__c = t3.__c).__ = h3.__E : (S2 ? u4.__c = h3 = new j4(b2, M2) : (u4.__c = h3 = new x(b2, M2), h3.constructor = j4, h3.render = E), C3 && C3.sub(h3), h3.props = b2, h3.state || (h3.state = {}), h3.context = M2, h3.__n = i3, p3 = h3.__d = true, h3.__h = [], h3._sb = []), S2 && null == h3.__s && (h3.__s = h3.state), S2 && null != j4.getDerivedStateFromProps && (h3.__s == h3.state && (h3.__s = d({}, h3.__s)), d(h3.__s, j4.getDerivedStateFromProps(b2, h3.__s))), v3 = h3.props, y3 = h3.state, h3.__v = u4, p3) S2 && null == j4.getDerivedStateFromProps && null != h3.componentWillMount && h3.componentWillMount(), S2 && null != h3.componentDidMount && h3.__h.push(h3.componentDidMount);
    else {
      if (S2 && null == j4.getDerivedStateFromProps && b2 !== v3 && null != h3.componentWillReceiveProps && h3.componentWillReceiveProps(b2, M2), !h3.__e && null != h3.shouldComponentUpdate && false === h3.shouldComponentUpdate(b2, h3.__s, M2) || u4.__v == t3.__v) {
        for (u4.__v != t3.__v && (h3.props = b2, h3.state = h3.__s, h3.__d = false), u4.__e = t3.__e, u4.__k = t3.__k, u4.__k.some(function(n3) {
          n3 && (n3.__ = u4);
        }), $2 = 0; $2 < h3._sb.length; $2++) h3.__h.push(h3._sb[$2]);
        h3._sb = [], h3.__h.length && e3.push(h3);
        break n;
      }
      null != h3.componentWillUpdate && h3.componentWillUpdate(b2, h3.__s, M2), S2 && null != h3.componentDidUpdate && h3.__h.push(function() {
        h3.componentDidUpdate(v3, y3, _3);
      });
    }
    if (h3.context = M2, h3.props = b2, h3.__P = n2, h3.__e = false, P4 = l.__r, A4 = 0, S2) {
      for (h3.state = h3.__s, h3.__d = false, P4 && P4(u4), a3 = h3.render(h3.props, h3.state, h3.context), H3 = 0; H3 < h3._sb.length; H3++) h3.__h.push(h3._sb[H3]);
      h3._sb = [];
    } else do {
      h3.__d = false, P4 && P4(u4), a3 = h3.render(h3.props, h3.state, h3.context), h3.state = h3.__s;
    } while (h3.__d && ++A4 < 25);
    h3.state = h3.__s, null != h3.getChildContext && (i3 = d(d({}, i3), h3.getChildContext())), S2 && !p3 && null != h3.getSnapshotBeforeUpdate && (_3 = h3.getSnapshotBeforeUpdate(v3, y3)), L2 = a3, null != a3 && a3.type === k && null == a3.key && (L2 = V(a3.props.children)), f4 = I(n2, w(L2) ? L2 : [L2], u4, t3, i3, r3, o3, e3, f4, c3, s3), h3.base = u4.__e, u4.__u &= -161, h3.__h.length && e3.push(h3), m3 && (h3.__E = h3.__ = null);
  } catch (n3) {
    if (u4.__v = null, c3 || null != o3) if (n3.then) {
      for (u4.__u |= c3 ? 160 : 128; f4 && 8 == f4.nodeType && f4.nextSibling; ) f4 = f4.nextSibling;
      o3[o3.indexOf(f4)] = null, u4.__e = f4;
    } else {
      for (T4 = o3.length; T4--; ) g(o3[T4]);
      z(u4);
    }
    else u4.__e = t3.__e, u4.__k = t3.__k, n3.then || z(u4);
    l.__e(n3, u4, t3);
  }
  else null == o3 && u4.__v == t3.__v ? (u4.__k = t3.__k, u4.__e = t3.__e) : f4 = u4.__e = q(t3.__e, u4, t3, i3, r3, o3, e3, c3, s3);
  return (a3 = l.diffed) && a3(u4), 128 & u4.__u ? void 0 : f4;
}
function z(n2) {
  n2 && n2.__c && (n2.__c.__e = true), n2 && n2.__k && n2.__k.forEach(z);
}
function N(n2, u4, t3) {
  for (var i3 = 0; i3 < t3.length; i3++) B(t3[i3], t3[++i3], t3[++i3]);
  l.__c && l.__c(u4, n2), n2.some(function(u5) {
    try {
      n2 = u5.__h, u5.__h = [], n2.some(function(n3) {
        n3.call(u5);
      });
    } catch (n3) {
      l.__e(n3, u5.__v);
    }
  });
}
function V(n2) {
  return "object" != typeof n2 || null == n2 || n2.__b && n2.__b > 0 ? n2 : w(n2) ? n2.map(V) : d({}, n2);
}
function q(u4, t3, i3, r3, o3, e3, f4, c3, s3) {
  var a3, h3, v3, y3, d3, _3, m3, b2 = i3.props, k3 = t3.props, x3 = t3.type;
  if ("svg" == x3 ? o3 = "http://www.w3.org/2000/svg" : "math" == x3 ? o3 = "http://www.w3.org/1998/Math/MathML" : o3 || (o3 = "http://www.w3.org/1999/xhtml"), null != e3) {
    for (a3 = 0; a3 < e3.length; a3++) if ((d3 = e3[a3]) && "setAttribute" in d3 == !!x3 && (x3 ? d3.localName == x3 : 3 == d3.nodeType)) {
      u4 = d3, e3[a3] = null;
      break;
    }
  }
  if (null == u4) {
    if (null == x3) return document.createTextNode(k3);
    u4 = document.createElementNS(o3, x3, k3.is && k3), c3 && (l.__m && l.__m(t3, e3), c3 = false), e3 = null;
  }
  if (null == x3) b2 === k3 || c3 && u4.data == k3 || (u4.data = k3);
  else {
    if (e3 = e3 && n.call(u4.childNodes), b2 = i3.props || p, !c3 && null != e3) for (b2 = {}, a3 = 0; a3 < u4.attributes.length; a3++) b2[(d3 = u4.attributes[a3]).name] = d3.value;
    for (a3 in b2) if (d3 = b2[a3], "children" == a3) ;
    else if ("dangerouslySetInnerHTML" == a3) v3 = d3;
    else if (!(a3 in k3)) {
      if ("value" == a3 && "defaultValue" in k3 || "checked" == a3 && "defaultChecked" in k3) continue;
      j(u4, a3, null, d3, o3);
    }
    for (a3 in k3) d3 = k3[a3], "children" == a3 ? y3 = d3 : "dangerouslySetInnerHTML" == a3 ? h3 = d3 : "value" == a3 ? _3 = d3 : "checked" == a3 ? m3 = d3 : c3 && "function" != typeof d3 || b2[a3] === d3 || j(u4, a3, d3, b2[a3], o3);
    if (h3) c3 || v3 && (h3.__html == v3.__html || h3.__html == u4.innerHTML) || (u4.innerHTML = h3.__html), t3.__k = [];
    else if (v3 && (u4.innerHTML = ""), I("template" == t3.type ? u4.content : u4, w(y3) ? y3 : [y3], t3, i3, r3, "foreignObject" == x3 ? "http://www.w3.org/1999/xhtml" : o3, e3, f4, e3 ? e3[0] : i3.__k && S(i3, 0), c3, s3), null != e3) for (a3 = e3.length; a3--; ) g(e3[a3]);
    c3 || (a3 = "value", "progress" == x3 && null == _3 ? u4.removeAttribute("value") : null != _3 && (_3 !== u4[a3] || "progress" == x3 && !_3 || "option" == x3 && _3 != b2[a3]) && j(u4, a3, _3, b2[a3], o3), a3 = "checked", null != m3 && m3 != u4[a3] && j(u4, a3, m3, b2[a3], o3));
  }
  return u4;
}
function B(n2, u4, t3) {
  try {
    if ("function" == typeof n2) {
      var i3 = "function" == typeof n2.__u;
      i3 && n2.__u(), i3 && null == u4 || (n2.__u = n2(u4));
    } else n2.current = u4;
  } catch (n3) {
    l.__e(n3, t3);
  }
}
function D(n2, u4, t3) {
  var i3, r3;
  if (l.unmount && l.unmount(n2), (i3 = n2.ref) && (i3.current && i3.current != n2.__e || B(i3, null, u4)), null != (i3 = n2.__c)) {
    if (i3.componentWillUnmount) try {
      i3.componentWillUnmount();
    } catch (n3) {
      l.__e(n3, u4);
    }
    i3.base = i3.__P = null;
  }
  if (i3 = n2.__k) for (r3 = 0; r3 < i3.length; r3++) i3[r3] && D(i3[r3], u4, t3 || "function" != typeof n2.type);
  t3 || g(n2.__e), n2.__c = n2.__ = n2.__e = void 0;
}
function E(n2, l3, u4) {
  return this.constructor(n2, u4);
}
function G(u4, t3, i3) {
  var r3, o3, e3, f4;
  t3 == document && (t3 = document.documentElement), l.__ && l.__(u4, t3), o3 = (r3 = "function" == typeof i3) ? null : i3 && i3.__k || t3.__k, e3 = [], f4 = [], O(t3, u4 = (!r3 && i3 || t3).__k = _(k, null, [u4]), o3 || p, p, t3.namespaceURI, !r3 && i3 ? [i3] : o3 ? null : t3.firstChild ? n.call(t3.childNodes) : null, e3, !r3 && i3 ? i3 : o3 ? o3.__e : t3.firstChild, r3, f4), N(e3, u4, f4);
}
n = v.slice, l = { __e: function(n2, l3, u4, t3) {
  for (var i3, r3, o3; l3 = l3.__; ) if ((i3 = l3.__c) && !i3.__) try {
    if ((r3 = i3.constructor) && null != r3.getDerivedStateFromError && (i3.setState(r3.getDerivedStateFromError(n2)), o3 = i3.__d), null != i3.componentDidCatch && (i3.componentDidCatch(n2, t3 || {}), o3 = i3.__d), o3) return i3.__E = i3;
  } catch (l4) {
    n2 = l4;
  }
  throw n2;
} }, u = 0, t = function(n2) {
  return null != n2 && null == n2.constructor;
}, x.prototype.setState = function(n2, l3) {
  var u4;
  u4 = null != this.__s && this.__s != this.state ? this.__s : this.__s = d({}, this.state), "function" == typeof n2 && (n2 = n2(d({}, u4), this.props)), n2 && d(u4, n2), null != n2 && this.__v && (l3 && this._sb.push(l3), M(this));
}, x.prototype.forceUpdate = function(n2) {
  this.__v && (this.__e = true, n2 && this.__h.push(n2), M(this));
}, x.prototype.render = k, i = [], o = "function" == typeof Promise ? Promise.prototype.then.bind(Promise.resolve()) : setTimeout, e = function(n2, l3) {
  return n2.__v.__b - l3.__v.__b;
}, $.__r = 0, f = /(PointerCapture)$|Capture$/i, c = 0, s = F(false), a = F(true), h = 0;

// ../../../AppData/Local/Programs/Antigravity IDE/resources/app/node_modules/preact/hooks/dist/hooks.module.js
var t2;
var r2;
var u2;
var i2;
var o2 = 0;
var f2 = [];
var c2 = l;
var e2 = c2.__b;
var a2 = c2.__r;
var v2 = c2.diffed;
var l2 = c2.__c;
var m2 = c2.unmount;
var s2 = c2.__;
function p2(n2, t3) {
  c2.__h && c2.__h(r2, n2, o2 || t3), o2 = 0;
  var u4 = r2.__H || (r2.__H = { __: [], __h: [] });
  return n2 >= u4.__.length && u4.__.push({}), u4.__[n2];
}
function d2(n2) {
  return o2 = 1, h2(D2, n2);
}
function h2(n2, u4, i3) {
  var o3 = p2(t2++, 2);
  if (o3.t = n2, !o3.__c && (o3.__ = [i3 ? i3(u4) : D2(void 0, u4), function(n3) {
    var t3 = o3.__N ? o3.__N[0] : o3.__[0], r3 = o3.t(t3, n3);
    t3 !== r3 && (o3.__N = [r3, o3.__[1]], o3.__c.setState({}));
  }], o3.__c = r2, !r2.__f)) {
    var f4 = function(n3, t3, r3) {
      if (!o3.__c.__H) return true;
      var u5 = o3.__c.__H.__.filter(function(n4) {
        return !!n4.__c;
      });
      if (u5.every(function(n4) {
        return !n4.__N;
      })) return !c3 || c3.call(this, n3, t3, r3);
      var i4 = o3.__c.props !== n3;
      return u5.forEach(function(n4) {
        if (n4.__N) {
          var t4 = n4.__[0];
          n4.__ = n4.__N, n4.__N = void 0, t4 !== n4.__[0] && (i4 = true);
        }
      }), c3 && c3.call(this, n3, t3, r3) || i4;
    };
    r2.__f = true;
    var c3 = r2.shouldComponentUpdate, e3 = r2.componentWillUpdate;
    r2.componentWillUpdate = function(n3, t3, r3) {
      if (this.__e) {
        var u5 = c3;
        c3 = void 0, f4(n3, t3, r3), c3 = u5;
      }
      e3 && e3.call(this, n3, t3, r3);
    }, r2.shouldComponentUpdate = f4;
  }
  return o3.__N || o3.__;
}
function y2(n2, u4) {
  var i3 = p2(t2++, 3);
  !c2.__s && C2(i3.__H, u4) && (i3.__ = n2, i3.u = u4, r2.__H.__h.push(i3));
}
function A2(n2) {
  return o2 = 5, T2(function() {
    return { current: n2 };
  }, []);
}
function T2(n2, r3) {
  var u4 = p2(t2++, 7);
  return C2(u4.__H, r3) && (u4.__ = n2(), u4.__H = r3, u4.__h = n2), u4.__;
}
function q2(n2, t3) {
  return o2 = 8, T2(function() {
    return n2;
  }, t3);
}
function j2() {
  for (var n2; n2 = f2.shift(); ) if (n2.__P && n2.__H) try {
    n2.__H.__h.forEach(z2), n2.__H.__h.forEach(B2), n2.__H.__h = [];
  } catch (t3) {
    n2.__H.__h = [], c2.__e(t3, n2.__v);
  }
}
c2.__b = function(n2) {
  r2 = null, e2 && e2(n2);
}, c2.__ = function(n2, t3) {
  n2 && t3.__k && t3.__k.__m && (n2.__m = t3.__k.__m), s2 && s2(n2, t3);
}, c2.__r = function(n2) {
  a2 && a2(n2), t2 = 0;
  var i3 = (r2 = n2.__c).__H;
  i3 && (u2 === r2 ? (i3.__h = [], r2.__h = [], i3.__.forEach(function(n3) {
    n3.__N && (n3.__ = n3.__N), n3.u = n3.__N = void 0;
  })) : (i3.__h.forEach(z2), i3.__h.forEach(B2), i3.__h = [], t2 = 0)), u2 = r2;
}, c2.diffed = function(n2) {
  v2 && v2(n2);
  var t3 = n2.__c;
  t3 && t3.__H && (t3.__H.__h.length && (1 !== f2.push(t3) && i2 === c2.requestAnimationFrame || ((i2 = c2.requestAnimationFrame) || w2)(j2)), t3.__H.__.forEach(function(n3) {
    n3.u && (n3.__H = n3.u), n3.u = void 0;
  })), u2 = r2 = null;
}, c2.__c = function(n2, t3) {
  t3.some(function(n3) {
    try {
      n3.__h.forEach(z2), n3.__h = n3.__h.filter(function(n4) {
        return !n4.__ || B2(n4);
      });
    } catch (r3) {
      t3.some(function(n4) {
        n4.__h && (n4.__h = []);
      }), t3 = [], c2.__e(r3, n3.__v);
    }
  }), l2 && l2(n2, t3);
}, c2.unmount = function(n2) {
  m2 && m2(n2);
  var t3, r3 = n2.__c;
  r3 && r3.__H && (r3.__H.__.forEach(function(n3) {
    try {
      z2(n3);
    } catch (n4) {
      t3 = n4;
    }
  }), r3.__H = void 0, t3 && c2.__e(t3, r3.__v));
};
var k2 = "function" == typeof requestAnimationFrame;
function w2(n2) {
  var t3, r3 = function() {
    clearTimeout(u4), k2 && cancelAnimationFrame(t3), setTimeout(n2);
  }, u4 = setTimeout(r3, 35);
  k2 && (t3 = requestAnimationFrame(r3));
}
function z2(n2) {
  var t3 = r2, u4 = n2.__c;
  "function" == typeof u4 && (n2.__c = void 0, u4()), r2 = t3;
}
function B2(n2) {
  var t3 = r2;
  n2.__c = n2.__(), r2 = t3;
}
function C2(n2, t3) {
  return !n2 || n2.length !== t3.length || t3.some(function(t4, r3) {
    return t4 !== n2[r3];
  });
}
function D2(n2, t3) {
  return "function" == typeof t3 ? t3(n2) : t3;
}

// ../../../AppData/Local/Programs/Antigravity IDE/resources/app/node_modules/preact/compat/dist/compat.module.js
function g3(n2, t3) {
  for (var e3 in t3) n2[e3] = t3[e3];
  return n2;
}
function E2(n2, t3) {
  for (var e3 in n2) if ("__source" !== e3 && !(e3 in t3)) return true;
  for (var r3 in t3) if ("__source" !== r3 && n2[r3] !== t3[r3]) return true;
  return false;
}
function N2(n2, t3) {
  this.props = n2, this.context = t3;
}
(N2.prototype = new x()).isPureReactComponent = true, N2.prototype.shouldComponentUpdate = function(n2, t3) {
  return E2(this.props, n2) || E2(this.state, t3);
};
var T3 = l.__b;
l.__b = function(n2) {
  n2.type && n2.type.__f && n2.ref && (n2.props.ref = n2.ref, n2.ref = null), T3 && T3(n2);
};
var A3 = "undefined" != typeof Symbol && Symbol.for && /* @__PURE__ */ Symbol.for("react.forward_ref") || 3911;
var F3 = l.__e;
l.__e = function(n2, t3, e3, r3) {
  if (n2.then) {
    for (var u4, o3 = t3; o3 = o3.__; ) if ((u4 = o3.__c) && u4.__c) return null == t3.__e && (t3.__e = e3.__e, t3.__k = e3.__k), u4.__c(n2, t3);
  }
  F3(n2, t3, e3, r3);
};
var U = l.unmount;
function V2(n2, t3, e3) {
  return n2 && (n2.__c && n2.__c.__H && (n2.__c.__H.__.forEach(function(n3) {
    "function" == typeof n3.__c && n3.__c();
  }), n2.__c.__H = null), null != (n2 = g3({}, n2)).__c && (n2.__c.__P === e3 && (n2.__c.__P = t3), n2.__c.__e = true, n2.__c = null), n2.__k = n2.__k && n2.__k.map(function(n3) {
    return V2(n3, t3, e3);
  })), n2;
}
function W(n2, t3, e3) {
  return n2 && e3 && (n2.__v = null, n2.__k = n2.__k && n2.__k.map(function(n3) {
    return W(n3, t3, e3);
  }), n2.__c && n2.__c.__P === t3 && (n2.__e && e3.appendChild(n2.__e), n2.__c.__e = true, n2.__c.__P = e3)), n2;
}
function P3() {
  this.__u = 0, this.o = null, this.__b = null;
}
function j3(n2) {
  var t3 = n2.__.__c;
  return t3 && t3.__a && t3.__a(n2);
}
function B3() {
  this.i = null, this.l = null;
}
l.unmount = function(n2) {
  var t3 = n2.__c;
  t3 && t3.__R && t3.__R(), t3 && 32 & n2.__u && (n2.type = null), U && U(n2);
}, (P3.prototype = new x()).__c = function(n2, t3) {
  var e3 = t3.__c, r3 = this;
  null == r3.o && (r3.o = []), r3.o.push(e3);
  var u4 = j3(r3.__v), o3 = false, i3 = function() {
    o3 || (o3 = true, e3.__R = null, u4 ? u4(l3) : l3());
  };
  e3.__R = i3;
  var l3 = function() {
    if (!--r3.__u) {
      if (r3.state.__a) {
        var n3 = r3.state.__a;
        r3.__v.__k[0] = W(n3, n3.__c.__P, n3.__c.__O);
      }
      var t4;
      for (r3.setState({ __a: r3.__b = null }); t4 = r3.o.pop(); ) t4.forceUpdate();
    }
  };
  r3.__u++ || 32 & t3.__u || r3.setState({ __a: r3.__b = r3.__v.__k[0] }), n2.then(i3, i3);
}, P3.prototype.componentWillUnmount = function() {
  this.o = [];
}, P3.prototype.render = function(n2, e3) {
  if (this.__b) {
    if (this.__v.__k) {
      var r3 = document.createElement("div"), o3 = this.__v.__k[0].__c;
      this.__v.__k[0] = V2(this.__b, r3, o3.__O = o3.__P);
    }
    this.__b = null;
  }
  var i3 = e3.__a && _(k, null, n2.fallback);
  return i3 && (i3.__u &= -33), [_(k, null, e3.__a ? null : n2.children), i3];
};
var H2 = function(n2, t3, e3) {
  if (++e3[1] === e3[0] && n2.l.delete(t3), n2.props.revealOrder && ("t" !== n2.props.revealOrder[0] || !n2.l.size)) for (e3 = n2.i; e3; ) {
    for (; e3.length > 3; ) e3.pop()();
    if (e3[1] < e3[0]) break;
    n2.i = e3 = e3[2];
  }
};
(B3.prototype = new x()).__a = function(n2) {
  var t3 = this, e3 = j3(t3.__v), r3 = t3.l.get(n2);
  return r3[0]++, function(u4) {
    var o3 = function() {
      t3.props.revealOrder ? (r3.push(u4), H2(t3, n2, r3)) : u4();
    };
    e3 ? e3(o3) : o3();
  };
}, B3.prototype.render = function(n2) {
  this.i = null, this.l = /* @__PURE__ */ new Map();
  var t3 = H(n2.children);
  n2.revealOrder && "b" === n2.revealOrder[0] && t3.reverse();
  for (var e3 = t3.length; e3--; ) this.l.set(t3[e3], this.i = [1, 0, this.i]);
  return n2.children;
}, B3.prototype.componentDidUpdate = B3.prototype.componentDidMount = function() {
  var n2 = this;
  this.l.forEach(function(t3, e3) {
    H2(n2, e3, t3);
  });
};
var q3 = "undefined" != typeof Symbol && Symbol.for && /* @__PURE__ */ Symbol.for("react.element") || 60103;
var G2 = /^(?:accent|alignment|arabic|baseline|cap|clip(?!PathU)|color|dominant|fill|flood|font|glyph(?!R)|horiz|image(!S)|letter|lighting|marker(?!H|W|U)|overline|paint|pointer|shape|stop|strikethrough|stroke|text(?!L)|transform|underline|unicode|units|v|vector|vert|word|writing|x(?!C))[A-Z]/;
var J2 = /^on(Ani|Tra|Tou|BeforeInp|Compo)/;
var K2 = /[A-Z0-9]/g;
var Q2 = "undefined" != typeof document;
var X = function(n2) {
  return ("undefined" != typeof Symbol && "symbol" == typeof /* @__PURE__ */ Symbol() ? /fil|che|rad/ : /fil|che|ra/).test(n2);
};
function nn(n2, t3, e3) {
  return null == t3.__k && (t3.textContent = ""), G(n2, t3), "function" == typeof e3 && e3(), n2 ? n2.__c : null;
}
x.prototype.isReactComponent = {}, ["componentWillMount", "componentWillReceiveProps", "componentWillUpdate"].forEach(function(t3) {
  Object.defineProperty(x.prototype, t3, { configurable: true, get: function() {
    return this["UNSAFE_" + t3];
  }, set: function(n2) {
    Object.defineProperty(this, t3, { configurable: true, writable: true, value: n2 });
  } });
});
var en = l.event;
function rn() {
}
function un() {
  return this.cancelBubble;
}
function on() {
  return this.defaultPrevented;
}
l.event = function(n2) {
  return en && (n2 = en(n2)), n2.persist = rn, n2.isPropagationStopped = un, n2.isDefaultPrevented = on, n2.nativeEvent = n2;
};
var ln;
var cn = { enumerable: false, configurable: true, get: function() {
  return this.class;
} };
var fn = l.vnode;
l.vnode = function(n2) {
  "string" == typeof n2.type && (function(n3) {
    var t3 = n3.props, e3 = n3.type, u4 = {}, o3 = -1 === e3.indexOf("-");
    for (var i3 in t3) {
      var l3 = t3[i3];
      if (!("value" === i3 && "defaultValue" in t3 && null == l3 || Q2 && "children" === i3 && "noscript" === e3 || "class" === i3 || "className" === i3)) {
        var c3 = i3.toLowerCase();
        "defaultValue" === i3 && "value" in t3 && null == t3.value ? i3 = "value" : "download" === i3 && true === l3 ? l3 = "" : "translate" === c3 && "no" === l3 ? l3 = false : "o" === c3[0] && "n" === c3[1] ? "ondoubleclick" === c3 ? i3 = "ondblclick" : "onchange" !== c3 || "input" !== e3 && "textarea" !== e3 || X(t3.type) ? "onfocus" === c3 ? i3 = "onfocusin" : "onblur" === c3 ? i3 = "onfocusout" : J2.test(i3) && (i3 = c3) : c3 = i3 = "oninput" : o3 && G2.test(i3) ? i3 = i3.replace(K2, "-$&").toLowerCase() : null === l3 && (l3 = void 0), "oninput" === c3 && u4[i3 = c3] && (i3 = "oninputCapture"), u4[i3] = l3;
      }
    }
    "select" == e3 && u4.multiple && Array.isArray(u4.value) && (u4.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = -1 != u4.value.indexOf(n4.props.value);
    })), "select" == e3 && null != u4.defaultValue && (u4.value = H(t3.children).forEach(function(n4) {
      n4.props.selected = u4.multiple ? -1 != u4.defaultValue.indexOf(n4.props.value) : u4.defaultValue == n4.props.value;
    })), t3.class && !t3.className ? (u4.class = t3.class, Object.defineProperty(u4, "className", cn)) : (t3.className && !t3.class || t3.class && t3.className) && (u4.class = u4.className = t3.className), n3.props = u4;
  })(n2), n2.$$typeof = q3, fn && fn(n2);
};
var an = l.__r;
l.__r = function(n2) {
  an && an(n2), ln = n2.__c;
};
var sn = l.diffed;
l.diffed = function(n2) {
  sn && sn(n2);
  var t3 = n2.props, e3 = n2.__e;
  null != e3 && "textarea" === n2.type && "value" in t3 && t3.value !== e3.value && (e3.value = null == t3.value ? "" : t3.value), ln = null;
};
function bn(n2) {
  return !!n2.__k && (G(null, n2), true);
}
var Cn = k;

// ../../../AppData/Local/Programs/Antigravity IDE/resources/app/node_modules/preact/compat/client.mjs
function createRoot(container) {
  return {
    // eslint-disable-next-line
    render: function(children) {
      nn(children, container);
    },
    // eslint-disable-next-line
    unmount: function() {
      bn(container);
    }
  };
}

// frontend/src/api.ts
var API_BASE = "";
async function request(path, init) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...init
  });
  if (!response.ok) {
    let detail = `Request failed (${response.status})`;
    try {
      const body = await response.json();
      if (typeof body.detail === "string") detail = body.detail;
    } catch {
    }
    throw new Error(detail);
  }
  return await response.json();
}
function getNetwork(signal) {
  return request("/api/network", { signal });
}
function solve(payload, signal) {
  return request("/api/solve", {
    method: "POST",
    body: JSON.stringify(payload),
    signal
  });
}
function analyze(network, signal) {
  return request("/api/analyze", {
    method: "POST",
    body: JSON.stringify({ network }),
    signal
  });
}

// ../../../AppData/Local/Programs/Antigravity IDE/resources/app/node_modules/preact/jsx-runtime/dist/jsxRuntime.module.js
var f3 = 0;
function u3(e3, t3, n2, o3, i3, u4) {
  t3 || (t3 = {});
  var a3, c3, p3 = t3;
  if ("ref" in p3) for (c3 in p3 = {}, t3) "ref" == c3 ? a3 = t3[c3] : p3[c3] = t3[c3];
  var l3 = { type: e3, props: p3, key: n2, ref: a3, __k: null, __: null, __b: 0, __e: null, __c: null, constructor: void 0, __v: --f3, __i: -1, __u: 0, __source: i3, __self: u4 };
  if ("function" == typeof e3 && (a3 = e3.defaultProps)) for (c3 in a3) void 0 === p3[c3] && (p3[c3] = a3[c3]);
  return l.vnode && l.vnode(l3), l3;
}

// frontend/src/components/ui.tsx
function Card({ className = "", children }) {
  return /* @__PURE__ */ u3("section", { className: `card ${className}`, children });
}
var TONES = {
  neutral: "border-white/10 bg-white/[0.06] text-slate-300",
  good: "border-emerald-400/25 bg-emerald-400/10 text-emerald-300",
  warn: "border-amber-400/25 bg-amber-400/10 text-amber-300",
  bad: "border-rose-400/25 bg-rose-400/10 text-rose-300"
};
function Pill({ children, tone = "neutral" }) {
  return /* @__PURE__ */ u3(
    "span",
    {
      className: `inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${TONES[tone]}`,
      children
    }
  );
}
function SectionTitle({
  title,
  subtitle,
  right
}) {
  return /* @__PURE__ */ u3("div", { className: "flex items-start justify-between gap-3", children: [
    /* @__PURE__ */ u3("div", { children: [
      /* @__PURE__ */ u3("h2", { className: "text-[13px] font-semibold uppercase tracking-[0.16em] text-slate-300", children: title }),
      subtitle ? /* @__PURE__ */ u3("p", { className: "mt-1 text-[12px] leading-relaxed text-slate-500", children: subtitle }) : null
    ] }),
    right
  ] });
}
function Stat({
  label,
  value,
  unit,
  accent
}) {
  return /* @__PURE__ */ u3("div", { className: "rounded-xl border border-white/[0.06] bg-black/25 px-3 py-2.5", children: [
    /* @__PURE__ */ u3("div", { className: "text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500", children: label }),
    /* @__PURE__ */ u3("div", { className: "mt-1.5 font-mono text-[17px] leading-none", style: { color: accent ?? "#f1f5f9" }, children: [
      value,
      unit ? /* @__PURE__ */ u3("span", { className: "ml-1 font-sans text-[10.5px] text-slate-400", children: unit }) : null
    ] })
  ] });
}
function Switch({
  checked,
  onChange,
  label
}) {
  return /* @__PURE__ */ u3(
    "button",
    {
      type: "button",
      role: "switch",
      "aria-checked": checked,
      "aria-label": label,
      onClick: () => onChange(!checked),
      className: `relative h-4 w-8 shrink-0 rounded-full border transition ${checked ? "border-emerald-400/40 bg-emerald-400/25" : "border-white/10 bg-white/[0.06]"}`,
      children: /* @__PURE__ */ u3(
        "span",
        {
          className: `absolute top-[2px] h-[10px] w-[10px] rounded-full transition-all ${checked ? "left-[18px] bg-emerald-300" : "left-[3px] bg-slate-500"}`
        }
      )
    }
  );
}
function Spinner({ className = "h-3.5 w-3.5" }) {
  return /* @__PURE__ */ u3("svg", { className: `animate-spin ${className}`, viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", children: [
    /* @__PURE__ */ u3("circle", { cx: "12", cy: "12", r: "9", stroke: "currentColor", strokeOpacity: "0.25", strokeWidth: "3" }),
    /* @__PURE__ */ u3("path", { d: "M21 12a9 9 0 0 0-9-9", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round" })
  ] });
}

// frontend/src/components/EditorCard.tsx
function EditorCard({
  network,
  suspended,
  modified,
  notice,
  onToggleLine,
  onAddStation,
  onRemoveStation,
  onReset
}) {
  const [name, setName] = d2("");
  const [lineId, setLineId] = d2(network.lines[0]?.id ?? "");
  const [afterId, setAfterId] = d2("");
  const [removeId, setRemoveId] = d2("");
  const activeLine = network.lines.find((line) => line.id === lineId) ?? network.lines[0];
  y2(() => {
    if (!activeLine) return;
    if (!activeLine.stations.includes(afterId)) {
      setAfterId(activeLine.stations[0] ?? "");
    }
  }, [activeLine, afterId]);
  const stationName = (id) => network.stations.find((station) => station.id === id)?.name ?? id;
  return /* @__PURE__ */ u3(Card, { className: "p-4 sm:p-5", children: [
    /* @__PURE__ */ u3(
      SectionTitle,
      {
        title: "Edit the network",
        subtitle: "Mutate the graph and watch the algorithms react.",
        right: modified ? /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            onClick: onReset,
            className: "btn btn-ghost px-2.5 py-1 text-[11px]",
            children: "Reset"
          }
        ) : null
      }
    ),
    /* @__PURE__ */ u3("div", { className: "mt-4", children: [
      /* @__PURE__ */ u3("h3", { className: "label", children: "Lines" }),
      /* @__PURE__ */ u3("ul", { className: "space-y-1", children: network.lines.map((line) => {
        const active = !suspended.includes(line.id);
        return /* @__PURE__ */ u3("li", { className: "flex items-center gap-2 rounded-lg px-1 py-1", children: [
          /* @__PURE__ */ u3("span", { className: "h-2 w-2 rounded-full", style: { background: active ? line.color : "#475569" } }),
          /* @__PURE__ */ u3("span", { className: `text-[12px] ${active ? "text-slate-300" : "text-slate-500 line-through"}`, children: line.name }),
          /* @__PURE__ */ u3("span", { className: "rounded border border-white/10 px-1 font-mono text-[8.5px] uppercase tracking-wide text-slate-500", children: line.mode }),
          /* @__PURE__ */ u3("span", { className: "font-mono text-[10px] text-slate-600", children: line.stations.length }),
          /* @__PURE__ */ u3("div", { className: "ml-auto", children: /* @__PURE__ */ u3(
            Switch,
            {
              checked: active,
              onChange: () => onToggleLine(line.id),
              label: `${active ? "Suspend" : "Restore"} ${line.name}`
            }
          ) })
        ] }, line.id);
      }) })
    ] }),
    /* @__PURE__ */ u3(
      "form",
      {
        className: "mt-4 border-t border-white/[0.06] pt-4",
        onSubmit: (event) => {
          event.preventDefault();
          if (!name.trim() || !activeLine) return;
          onAddStation({ name, lineId: activeLine.id, afterId });
          setName("");
        },
        children: [
          /* @__PURE__ */ u3("h3", { className: "label", children: "Add a station" }),
          /* @__PURE__ */ u3(
            "input",
            {
              className: "field",
              placeholder: "New station name",
              value: name,
              onChange: (event) => setName(event.target.value),
              maxLength: 40
            }
          ),
          /* @__PURE__ */ u3("div", { className: "mt-2 grid grid-cols-2 gap-2", children: [
            /* @__PURE__ */ u3(
              "select",
              {
                className: "field px-2.5 py-2 text-[12px]",
                value: lineId,
                onChange: (event) => setLineId(event.target.value),
                "aria-label": "Line for the new station",
                children: network.lines.map((line) => /* @__PURE__ */ u3("option", { value: line.id, children: line.name }, line.id))
              }
            ),
            /* @__PURE__ */ u3(
              "select",
              {
                className: "field px-2.5 py-2 text-[12px]",
                value: afterId,
                onChange: (event) => setAfterId(event.target.value),
                "aria-label": "Insert after station",
                children: activeLine?.stations.map((id) => /* @__PURE__ */ u3("option", { value: id, children: [
                  "after ",
                  stationName(id)
                ] }, id))
              }
            )
          ] }),
          /* @__PURE__ */ u3("button", { type: "submit", className: "btn btn-primary mt-2 w-full py-1.5 text-[12px]", disabled: !name.trim(), children: "Insert into line" })
        ]
      }
    ),
    /* @__PURE__ */ u3("div", { className: "mt-4 border-t border-white/[0.06] pt-4", children: [
      /* @__PURE__ */ u3("h3", { className: "label", children: "Remove a station" }),
      /* @__PURE__ */ u3("div", { className: "flex gap-2", children: [
        /* @__PURE__ */ u3(
          "select",
          {
            className: "field px-2.5 py-2 text-[12px]",
            value: removeId,
            onChange: (event) => setRemoveId(event.target.value),
            "aria-label": "Station to remove",
            children: [
              /* @__PURE__ */ u3("option", { value: "", children: "Select a station\u2026" }),
              [...network.stations].sort((a3, b2) => a3.name.localeCompare(b2.name)).map((station) => /* @__PURE__ */ u3("option", { value: station.id, children: station.name }, station.id))
            ]
          }
        ),
        /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            className: "btn btn-danger shrink-0 px-3 py-2 text-[12px]",
            disabled: !removeId,
            onClick: () => {
              if (!removeId) return;
              onRemoveStation(removeId);
              setRemoveId("");
            },
            children: "Delete"
          }
        )
      ] }),
      /* @__PURE__ */ u3("p", { className: "mt-2 text-[11px] leading-relaxed text-slate-600", children: "Deleting a vertex deletes its incident edges \u2014 try removing Yamuna Bank to split the Blue Line." })
    ] }),
    notice ? /* @__PURE__ */ u3("p", { className: "mt-3 rounded-lg border border-white/[0.06] bg-black/25 px-2.5 py-2 text-[11.5px] text-slate-400", children: notice }) : null
  ] });
}

// frontend/src/components/InsightsCard.tsx
function InsightsCard({ analysis, lines }) {
  const lineColor = (id) => lines.find((line) => line.id === id)?.color ?? "#94a3b8";
  const hubs = analysis?.topDegrees.filter((row) => row.degree >= 3) ?? [];
  return /* @__PURE__ */ u3(Card, { className: "p-4 sm:p-5", children: [
    /* @__PURE__ */ u3(
      SectionTitle,
      {
        title: "Network analysis",
        subtitle: "Structural properties of the graph that is currently loaded.",
        right: analysis ? analysis.isConnected ? /* @__PURE__ */ u3(Pill, { tone: "good", children: "Connected" }) : /* @__PURE__ */ u3(Pill, { tone: "warn", children: [
          analysis.componentCount,
          " components"
        ] }) : null
      }
    ),
    !analysis ? /* @__PURE__ */ u3("div", { className: "mt-4 h-40 animate-pulse rounded-xl bg-white/[0.03]" }) : /* @__PURE__ */ u3(k, { children: [
      /* @__PURE__ */ u3("div", { className: "mt-4 grid grid-cols-2 gap-2", children: [
        { label: "|V|", value: analysis.stationCount, hint: "stations" },
        { label: "|E|", value: analysis.edgeCount, hint: "edges" },
        { label: "avg deg", value: analysis.averageDegree.toFixed(2), hint: "2E/V" },
        { label: "density", value: analysis.density.toFixed(3), hint: "2E/V(V-1)" }
      ].map((item) => /* @__PURE__ */ u3("div", { className: "rounded-xl border border-white/[0.06] bg-black/20 px-2.5 py-2", children: [
        /* @__PURE__ */ u3("div", { className: "font-mono text-[10px] uppercase tracking-[0.08em] text-slate-500", children: item.label }),
        /* @__PURE__ */ u3("div", { className: "mt-1 font-mono text-[15px] leading-none text-slate-100", children: item.value }),
        /* @__PURE__ */ u3("div", { className: "mt-1 text-[10px] text-slate-600", children: item.hint })
      ] }, item.label)) }),
      /* @__PURE__ */ u3("div", { className: "mt-5", children: [
        /* @__PURE__ */ u3("h3", { className: "label", children: "Busiest vertices \xB7 degree" }),
        /* @__PURE__ */ u3("ul", { className: "space-y-1.5", children: [
          hubs.map((row) => /* @__PURE__ */ u3("li", { className: "flex items-center gap-2", children: [
            /* @__PURE__ */ u3("span", { className: "w-[42%] truncate text-[12px] text-slate-300", children: row.name }),
            /* @__PURE__ */ u3("span", { className: "flex items-center gap-1", children: row.lines.map((lineId) => /* @__PURE__ */ u3(
              "span",
              {
                className: "h-1.5 w-1.5 rounded-full",
                style: { background: lineColor(lineId) }
              },
              lineId
            )) }),
            /* @__PURE__ */ u3("div", { className: "ml-auto h-1.5 w-full max-w-[120px] overflow-hidden rounded-full bg-white/[0.06]", children: /* @__PURE__ */ u3(
              "div",
              {
                className: "h-full rounded-full bg-emerald-400/80",
                style: { width: `${row.degree / Math.max(analysis.maxDegree, 1) * 100}%` }
              }
            ) }),
            /* @__PURE__ */ u3("span", { className: "w-4 text-right font-mono text-[11px] text-slate-400", children: row.degree })
          ] }, row.id)),
          hubs.length === 0 ? /* @__PURE__ */ u3("li", { className: "text-[12px] text-slate-500", children: "No connected stations." }) : null
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { className: "mt-5", children: [
        /* @__PURE__ */ u3("h3", { className: "label", children: "Critical vertices \xB7 removal impact" }),
        /* @__PURE__ */ u3("ul", { className: "space-y-1", children: [
          analysis.criticalStations.slice(0, 5).map((row) => /* @__PURE__ */ u3(
            "li",
            {
              className: "flex items-center gap-2 rounded-lg border border-white/[0.05] bg-black/20 px-2 py-1.5",
              children: [
                /* @__PURE__ */ u3("span", { className: "flex-1 truncate text-[12px] text-slate-300", children: row.name }),
                /* @__PURE__ */ u3("span", { className: "font-mono text-[10px] text-slate-600", children: [
                  "deg ",
                  row.degree
                ] }),
                /* @__PURE__ */ u3("span", { className: "rounded-md border border-amber-400/20 bg-amber-400/[0.08] px-1.5 py-0.5 font-mono text-[10px] text-amber-200/90", children: [
                  row.parts,
                  " parts"
                ] })
              ]
            },
            row.id
          )),
          analysis.criticalStations.length === 0 ? /* @__PURE__ */ u3("li", { className: "text-[12px] text-slate-500", children: "None \u2014 no single station splits the network." }) : null
        ] }),
        /* @__PURE__ */ u3("p", { className: "mt-2 text-[11px] leading-relaxed text-slate-600", children: [
          analysis.articulationPoints.length,
          " of ",
          analysis.stationCount,
          " vertices are cut vertices (Tarjan low-link DFS). Removing one splits the graph into the number of components shown."
        ] })
      ] }),
      analysis.componentCount > 1 ? /* @__PURE__ */ u3("div", { className: "mt-5 rounded-xl border border-amber-400/20 bg-amber-400/[0.05] p-3", children: [
        /* @__PURE__ */ u3("h3", { className: "text-[10.5px] font-medium uppercase tracking-[0.14em] text-amber-200/80", children: "Components" }),
        /* @__PURE__ */ u3("ul", { className: "mt-2 space-y-1.5", children: analysis.components.map((component, index) => /* @__PURE__ */ u3("li", { className: "text-[11.5px] leading-snug text-amber-100/70", children: [
          /* @__PURE__ */ u3("span", { className: "font-mono text-amber-300/90", children: component.length }),
          " station",
          component.length === 1 ? "" : "s",
          " \xB7 ",
          component.slice(0, 4).join(", "),
          component.length > 4 ? ` +${component.length - 4}` : ""
        ] }, index)) })
      ] }) : /* @__PURE__ */ u3("p", { className: "mt-5 text-[11px] leading-relaxed text-slate-600", children: "A single component means every station is reachable from every other station." })
    ] })
  ] });
}

// frontend/src/components/MetroMap.tsx
var VIEW_X = 10;
var VIEW_Y = 15;
var VIEW_W = 1050;
var VIEW_H = 860;
var VIEW_BOX = `${VIEW_X} ${VIEW_Y} ${VIEW_W} ${VIEW_H}`;
var MIN_ZOOM = 1;
var MAX_ZOOM = 6;
function labelQuad(x3, y3, anchor, angle, width, height) {
  const left = anchor === "start" ? 0 : anchor === "end" ? -width : -width / 2;
  const top = -height * 0.75;
  const radians = angle * Math.PI / 180;
  const cos = Math.cos(radians);
  const sin = Math.sin(radians);
  const corners = [
    [left, top],
    [left + width, top],
    [left + width, top + height],
    [left, top + height]
  ];
  return corners.map(([lx, ly]) => [x3 + lx * cos - ly * sin, y3 + lx * sin + ly * cos]);
}
function quadsOverlap(a3, b2) {
  for (const quad of [a3, b2]) {
    for (let index = 0; index < quad.length; index += 1) {
      const [x1, y1] = quad[index];
      const [x22, y22] = quad[(index + 1) % quad.length];
      const axisX = y1 - y22;
      const axisY = x22 - x1;
      const length = Math.hypot(axisX, axisY) || 1;
      const nx = axisX / length;
      const ny = axisY / length;
      let minA = Infinity;
      let maxA = -Infinity;
      for (const [px, py] of a3) {
        const value = px * nx + py * ny;
        minA = Math.min(minA, value);
        maxA = Math.max(maxA, value);
      }
      let minB = Infinity;
      let maxB = -Infinity;
      for (const [px, py] of b2) {
        const value = px * nx + py * ny;
        minB = Math.min(minB, value);
        maxB = Math.max(maxB, value);
      }
      if (maxA < minB || maxB < minA) return false;
    }
  }
  return true;
}
function estimatedWidth(text, fontSize, bold) {
  return text.length * fontSize * (bold ? 0.6 : 0.56);
}
function MetroMap({ network, route, suspended, penalty, includeBus }) {
  const svgRef = A2(null);
  const frameRef = A2(null);
  const dragRef = A2(null);
  const [view, setView] = d2({ x: 0, y: 0, k: 1 });
  const [box, setBox] = d2({ width: 640, height: 520 });
  const [dragging, setDragging] = d2(false);
  const [hovered, setHovered] = d2(null);
  const stationById = T2(
    () => new Map(network.stations.map((station) => [station.id, station])),
    [network]
  );
  const lineById = T2(() => new Map(network.lines.map((line) => [line.id, line])), [network]);
  const suspendedSet = T2(() => new Set(suspended), [suspended]);
  const routeStationIds = T2(() => new Set(route?.stationIds ?? []), [route]);
  const interchangeIds = T2(() => new Set(route?.interchangeStationIds ?? []), [route]);
  const terminals = T2(() => {
    const ids = /* @__PURE__ */ new Set();
    for (const line of network.lines) {
      if (line.stations.length === 0) continue;
      ids.add(line.stations[0]);
      ids.add(line.stations[line.stations.length - 1]);
    }
    return ids;
  }, [network]);
  const metroLines = network.lines.filter((line) => line.mode === "metro");
  const busLines = network.lines.filter((line) => line.mode === "bus");
  y2(() => {
    const node = frameRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setBox({ width, height });
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  y2(() => {
    const node = svgRef.current;
    if (!node) return;
    const handleWheel = (event) => {
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const ctm = node.getScreenCTM();
      if (!ctm) return;
      const point = new DOMPoint(event.clientX, event.clientY).matrixTransform(ctm.inverse());
      setView((current) => {
        const factor = event.deltaY < 0 ? 1.12 : 1 / 1.12;
        const k3 = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.k * factor));
        const px = (point.x - current.x) / current.k;
        const py = (point.y - current.y) / current.k;
        return { k: k3, x: point.x - k3 * px, y: point.y - k3 * py };
      });
    };
    node.addEventListener("wheel", handleWheel, { passive: false });
    return () => node.removeEventListener("wheel", handleWheel);
  }, []);
  const handlePointerDown = (event) => {
    const ctm = svgRef.current?.getScreenCTM();
    if (!ctm) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    dragRef.current = { x: event.clientX, y: event.clientY, vx: view.x, vy: view.y, scale: ctm.a };
    setDragging(true);
  };
  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag) return;
    setView((current) => ({
      ...current,
      x: drag.vx + (event.clientX - drag.x) / drag.scale,
      y: drag.vy + (event.clientY - drag.y) / drag.scale
    }));
  };
  const endDrag = () => {
    dragRef.current = null;
    setDragging(false);
  };
  const pathFor = (ids) => {
    const points = ids.map((id) => stationById.get(id)).filter((station) => station !== void 0);
    if (points.length < 2) return "";
    return points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x} ${point.y}`).join(" ");
  };
  const startStation = route?.stationIds.length ? stationById.get(route.stationIds[0]) : void 0;
  const endStation = route?.stationIds.length ? stationById.get(route.stationIds[route.stationIds.length - 1]) : void 0;
  const zoomBy = (factor) => setView((current) => ({
    ...current,
    k: Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, current.k * factor))
  }));
  const labels = T2(() => {
    const scale = Math.min(box.width / VIEW_W, box.height / VIEW_H) || 0.6;
    const targetPx = box.width < 480 ? 9 : 10.5;
    const baseFont = Math.max(4, targetPx / Math.max(scale * view.k, 0.05));
    const offsetFactor = baseFont / 15.5;
    const routeStart = route?.stationIds[0];
    const routeEnd = route?.stationIds[route.stationIds.length - 1];
    const priorityOf = (station) => {
      if (station.id === routeStart || station.id === routeEnd) return 0;
      if (routeStationIds.has(station.id)) return 1;
      if (station.lines.length > 1) return 2;
      if (station.lines.some((lineId) => lineById.get(lineId)?.mode === "bus")) return 3;
      if (terminals.has(station.id)) return 4;
      return 5;
    };
    const candidates = network.stations.map((station) => ({ station, priority: priorityOf(station) })).sort((a3, b2) => a3.priority - b2.priority || a3.station.name.localeCompare(b2.station.name));
    const placed = [];
    const quads = [];
    for (const { station, priority } of candidates) {
      const isRouteStation = routeStationIds.has(station.id) || station.id === routeStart || station.id === routeEnd;
      const important = priority <= 2;
      const fontSize = important ? baseFont * 1.08 : baseFont;
      const x3 = station.x + station.label.dx * offsetFactor;
      const y3 = station.y + station.label.dy * offsetFactor;
      const width = estimatedWidth(station.name, fontSize, important) + 4;
      const height = fontSize * 1.15 + 4;
      const quad = labelQuad(x3, y3, station.label.anchor, station.label.rotate, width, height);
      const outside = quad.some(
        ([px, py]) => px < VIEW_X - 4 || px > VIEW_X + VIEW_W + 4 || py < VIEW_Y - 4 || py > VIEW_Y + VIEW_H + 4
      );
      if (outside && !isRouteStation) continue;
      if (quads.some((other) => quadsOverlap(other, quad))) {
        if (!isRouteStation) continue;
      }
      quads.push(quad);
      placed.push({ station, x: x3, y: y3, fontSize, important });
    }
    return placed;
  }, [network, box, view.k, lineById, terminals, route, routeStationIds]);
  const hoveredLabel = T2(() => {
    if (!hovered) return null;
    const station = stationById.get(hovered);
    if (!station) return null;
    if (labels.some((item) => item.station.id === hovered)) return null;
    const scale = Math.min(box.width / VIEW_W, box.height / VIEW_H) || 0.6;
    const targetPx = box.width < 480 ? 9 : 10.5;
    const baseFont = Math.max(4, targetPx / Math.max(scale * view.k, 0.05));
    const offsetFactor = baseFont / 15.5;
    const fontSize = baseFont * 1.08;
    const x3 = station.x + station.label.dx * offsetFactor;
    const y3 = station.y + station.label.dy * offsetFactor;
    return { station, x: x3, y: y3, fontSize, important: true };
  }, [hovered, stationById, labels, box, view.k]);
  return /* @__PURE__ */ u3(Card, { className: "flex h-[440px] flex-col overflow-hidden sm:h-[520px] md:h-[560px] xl:h-[720px]", children: [
    /* @__PURE__ */ u3("div", { className: "flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3", children: [
      /* @__PURE__ */ u3("div", { children: [
        /* @__PURE__ */ u3("h2", { className: "text-[13px] font-semibold uppercase tracking-[0.16em] text-slate-300", children: "Network map" }),
        /* @__PURE__ */ u3("p", { className: "mt-0.5 text-[11px] text-slate-500", children: [
          "Drag to pan \xB7 \u2318/Ctrl + scroll to zoom in for more labels \xB7 ",
          penalty,
          " min interchange"
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { className: "flex items-center gap-1", children: [
        /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            onClick: () => zoomBy(1 / 1.25),
            className: "grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-white/20 hover:text-slate-100",
            "aria-label": "Zoom out",
            children: /* @__PURE__ */ u3("svg", { viewBox: "0 0 20 20", className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: /* @__PURE__ */ u3("path", { d: "M5 10h10", strokeLinecap: "round" }) })
          }
        ),
        /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            onClick: () => zoomBy(1.25),
            className: "grid h-7 w-7 place-items-center rounded-lg border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-white/20 hover:text-slate-100",
            "aria-label": "Zoom in",
            children: /* @__PURE__ */ u3("svg", { viewBox: "0 0 20 20", className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: /* @__PURE__ */ u3("path", { d: "M10 5v10M5 10h10", strokeLinecap: "round" }) })
          }
        ),
        /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            onClick: () => setView({ x: 0, y: 0, k: 1 }),
            className: "rounded-lg border border-white/10 bg-white/[0.04] px-2.5 py-1 text-[11px] text-slate-400 transition hover:border-white/20 hover:text-slate-100",
            children: "Reset"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u3("div", { ref: frameRef, className: "relative min-h-0 flex-1", children: [
      /* @__PURE__ */ u3(
        "svg",
        {
          ref: svgRef,
          viewBox: VIEW_BOX,
          preserveAspectRatio: "xMidYMid meet",
          className: `h-full w-full touch-none select-none ${dragging ? "cursor-grabbing" : "cursor-grab"}`,
          onPointerDown: handlePointerDown,
          onPointerMove: handlePointerMove,
          onPointerUp: endDrag,
          onPointerLeave: endDrag,
          role: "img",
          "aria-label": "Metro and bus network with the planned route highlighted",
          children: [
            /* @__PURE__ */ u3("defs", { children: [
              /* @__PURE__ */ u3("pattern", { id: "dot-grid", width: "26", height: "26", patternUnits: "userSpaceOnUse", children: /* @__PURE__ */ u3("circle", { cx: "1.5", cy: "1.5", r: "1.1", fill: "rgba(148,163,184,0.10)" }) }),
              /* @__PURE__ */ u3("filter", { id: "route-glow", x: "-20%", y: "-20%", width: "140%", height: "140%", children: [
                /* @__PURE__ */ u3("feGaussianBlur", { stdDeviation: "3", result: "blur" }),
                /* @__PURE__ */ u3("feMerge", { children: [
                  /* @__PURE__ */ u3("feMergeNode", { in: "blur" }),
                  /* @__PURE__ */ u3("feMergeNode", { in: "SourceGraphic" })
                ] })
              ] })
            ] }),
            /* @__PURE__ */ u3("rect", { x: "0", y: "0", width: "1000", height: "940", fill: "url(#dot-grid)" }),
            /* @__PURE__ */ u3("g", { transform: `translate(${view.x} ${view.y}) scale(${view.k})`, children: [
              busLines.map((line) => {
                const off = suspendedSet.has(line.id) || !includeBus;
                return /* @__PURE__ */ u3(
                  "path",
                  {
                    d: pathFor(line.stations),
                    fill: "none",
                    stroke: line.color,
                    strokeWidth: 5,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    strokeDasharray: "11 9",
                    opacity: off ? 0.13 : 0.85
                  },
                  line.id
                );
              }),
              metroLines.map((line) => {
                const off = suspendedSet.has(line.id);
                return /* @__PURE__ */ u3("g", { opacity: off ? 0.16 : 1, children: [
                  /* @__PURE__ */ u3(
                    "path",
                    {
                      d: pathFor(line.stations),
                      fill: "none",
                      stroke: "#05080d",
                      strokeWidth: 13,
                      strokeLinecap: "round",
                      strokeLinejoin: "round"
                    }
                  ),
                  /* @__PURE__ */ u3(
                    "path",
                    {
                      d: pathFor(line.stations),
                      fill: "none",
                      stroke: line.color,
                      strokeWidth: 7.5,
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      strokeDasharray: off ? "7 8" : void 0
                    }
                  )
                ] }, line.id);
              }),
              route && route.legs.length > 0 ? /* @__PURE__ */ u3("g", { children: [
                /* @__PURE__ */ u3(
                  "path",
                  {
                    d: pathFor(route.stationIds),
                    fill: "none",
                    stroke: "#f8fafc",
                    strokeOpacity: 0.16,
                    strokeWidth: 15,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    filter: "url(#route-glow)"
                  }
                ),
                route.legs.map((leg, index) => /* @__PURE__ */ u3(
                  "path",
                  {
                    d: pathFor(leg.stationIds),
                    fill: "none",
                    stroke: leg.color,
                    strokeWidth: 10,
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  },
                  `${leg.line}-${index}`
                )),
                /* @__PURE__ */ u3(
                  "path",
                  {
                    className: "route-flow",
                    d: pathFor(route.stationIds),
                    fill: "none",
                    stroke: "#ffffff",
                    strokeOpacity: 0.7,
                    strokeWidth: 1.8,
                    strokeDasharray: "2 26",
                    strokeLinecap: "round"
                  }
                )
              ] }) : null,
              network.stations.map((station) => {
                const onRoute = routeStationIds.has(station.id);
                const interchange = station.lines.length > 1;
                const color = lineById.get(station.lines[0])?.color ?? "#94a3b8";
                const isInterchangeOnRoute = interchangeIds.has(station.id);
                return /* @__PURE__ */ u3(
                  "g",
                  {
                    onPointerEnter: () => setHovered(station.id),
                    onPointerLeave: () => setHovered((current) => current === station.id ? null : current),
                    children: [
                      /* @__PURE__ */ u3("title", { children: `${station.name} \u2014 ${station.lines.length} line${station.lines.length === 1 ? "" : "s"}` }),
                      /* @__PURE__ */ u3("circle", { cx: station.x, cy: station.y, r: 11, fill: "transparent" }),
                      onRoute && !interchange ? /* @__PURE__ */ u3(
                        "circle",
                        {
                          cx: station.x,
                          cy: station.y,
                          r: 9,
                          fill: "none",
                          stroke: "#f8fafc",
                          strokeOpacity: 0.35,
                          strokeWidth: 2.5
                        }
                      ) : null,
                      isInterchangeOnRoute ? /* @__PURE__ */ u3(
                        "circle",
                        {
                          cx: station.x,
                          cy: station.y,
                          r: 12,
                          fill: "none",
                          stroke: "#f8fafc",
                          strokeOpacity: 0.5,
                          strokeWidth: 2.5
                        }
                      ) : null,
                      interchange ? /* @__PURE__ */ u3(k, { children: [
                        /* @__PURE__ */ u3("circle", { cx: station.x, cy: station.y, r: 7, fill: "#0a0f16", stroke: "#e2e8f0", strokeWidth: 3 }),
                        /* @__PURE__ */ u3("circle", { cx: station.x, cy: station.y, r: 2.4, fill: "#e2e8f0" })
                      ] }) : /* @__PURE__ */ u3("circle", { cx: station.x, cy: station.y, r: 4.6, fill: "#0a0f16", stroke: color, strokeWidth: 2.8 })
                    ]
                  },
                  station.id
                );
              }),
              labels.map(({ station, x: x3, y: y3, fontSize, important }) => /* @__PURE__ */ u3(
                "text",
                {
                  x: x3,
                  y: y3,
                  textAnchor: station.label.anchor,
                  transform: `rotate(${station.label.rotate} ${x3} ${y3})`,
                  fontSize,
                  fontWeight: important ? 600 : 450,
                  fill: important ? "#f1f5f9" : "#a8b3c2",
                  stroke: "#070a10",
                  strokeWidth: fontSize * 0.2,
                  strokeLinejoin: "round",
                  paintOrder: "stroke",
                  pointerEvents: "none",
                  children: station.name
                },
                `label-${station.id}`
              )),
              hoveredLabel ? /* @__PURE__ */ u3(
                "text",
                {
                  x: hoveredLabel.x,
                  y: hoveredLabel.y,
                  textAnchor: hoveredLabel.station.label.anchor,
                  transform: `rotate(${hoveredLabel.station.label.rotate} ${hoveredLabel.x} ${hoveredLabel.y})`,
                  fontSize: hoveredLabel.fontSize,
                  fontWeight: 650,
                  fill: "#38bdf8",
                  stroke: "#070a10",
                  strokeWidth: hoveredLabel.fontSize * 0.25,
                  strokeLinejoin: "round",
                  paintOrder: "stroke",
                  pointerEvents: "none",
                  children: hoveredLabel.station.name
                },
                `label-hover-${hoveredLabel.station.id}`
              ) : null,
              startStation ? /* @__PURE__ */ u3("g", { pointerEvents: "none", children: [
                /* @__PURE__ */ u3("circle", { cx: startStation.x, cy: startStation.y, r: 10, fill: "#080c12", stroke: "#34d399", strokeWidth: 3.5 }),
                /* @__PURE__ */ u3("circle", { cx: startStation.x, cy: startStation.y, r: 3.2, fill: "#34d399" })
              ] }) : null,
              endStation ? /* @__PURE__ */ u3("g", { pointerEvents: "none", children: [
                /* @__PURE__ */ u3("circle", { cx: endStation.x, cy: endStation.y, r: 10, fill: "#080c12", stroke: "#fb7185", strokeWidth: 3.5 }),
                /* @__PURE__ */ u3("circle", { cx: endStation.x, cy: endStation.y, r: 3.2, fill: "#fb7185" })
              ] }) : null
            ] })
          ]
        }
      ),
      !route ? /* @__PURE__ */ u3("div", { className: "pointer-events-none absolute inset-0 grid place-items-center", children: /* @__PURE__ */ u3("p", { className: "rounded-full border border-white/10 bg-black/50 px-3 py-1.5 text-[11px] text-slate-400", children: "Pick two stations to highlight a route" }) }) : null
    ] }),
    /* @__PURE__ */ u3("div", { className: "flex flex-wrap items-center gap-x-3.5 gap-y-1.5 border-t border-white/[0.06] px-4 py-2.5", children: [
      /* @__PURE__ */ u3("span", { className: "text-[9px] font-medium uppercase tracking-[0.14em] text-slate-600", children: "Metro" }),
      metroLines.map((line) => {
        const off = suspendedSet.has(line.id);
        return /* @__PURE__ */ u3(
          "span",
          {
            className: `inline-flex items-center gap-1.5 text-[11px] ${off ? "text-slate-600" : "text-slate-400"}`,
            children: [
              /* @__PURE__ */ u3("span", { className: "h-[3px] w-4 rounded-full", style: { background: off ? "#475569" : line.color } }),
              /* @__PURE__ */ u3("span", { className: off ? "line-through decoration-slate-600" : "", children: line.name })
            ]
          },
          line.id
        );
      }),
      /* @__PURE__ */ u3("span", { className: "ml-1 text-[9px] font-medium uppercase tracking-[0.14em] text-slate-600", children: "Bus" }),
      busLines.map((line) => {
        const off = suspendedSet.has(line.id) || !includeBus;
        return /* @__PURE__ */ u3(
          "span",
          {
            className: `inline-flex items-center gap-1.5 text-[11px] ${off ? "text-slate-600" : "text-slate-400"}`,
            children: [
              /* @__PURE__ */ u3(
                "span",
                {
                  className: "w-4 border-t-2 border-dashed",
                  style: { borderColor: off ? "#475569" : line.color }
                }
              ),
              /* @__PURE__ */ u3("span", { className: off ? "line-through decoration-slate-600" : "", children: line.name })
            ]
          },
          line.id
        );
      }),
      /* @__PURE__ */ u3("span", { className: "ml-auto inline-flex items-center gap-1.5 text-[11px] text-slate-500", children: [
        /* @__PURE__ */ u3("span", { className: "h-2.5 w-2.5 rounded-full border-2 border-slate-200 bg-[#0a0f16]" }),
        "interchange"
      ] })
    ] })
  ] });
}

// frontend/src/types.ts
var MODE_OPTIONS = [
  {
    id: "fewest_stops",
    label: "Fewest stops",
    algorithm: "BFS",
    hint: "Breadth-first search on the unweighted graph: every edge costs one stop, so the hop count is minimal. It ignores travel time, so the fewest-stop route can be slower. Ties are broken by time. O(V + E)."
  },
  {
    id: "shortest_time",
    label: "Shortest time",
    algorithm: "Dijkstra",
    hint: "Dijkstra on the weighted graph. Travel minutes plus a 5-minute penalty per interchange, using a priority queue. O((V + E) log V)."
  },
  {
    id: "fewest_interchanges",
    label: "Fewest changes",
    algorithm: "Dijkstra",
    hint: "Dijkstra on the (station, line) state graph: rides are cheap, changing line costs one interchange. Ties are broken by travel time."
  }
];
var INTERCHANGE_PENALTY = 5;

// frontend/src/components/ModeToggle.tsx
function ModeToggle({
  mode,
  onChange
}) {
  return /* @__PURE__ */ u3(
    "div",
    {
      role: "radiogroup",
      "aria-label": "Optimisation objective",
      className: "grid grid-cols-3 gap-1 rounded-xl border border-white/10 bg-black/30 p-1",
      children: MODE_OPTIONS.map((option) => {
        const active = option.id === mode;
        return /* @__PURE__ */ u3(
          "button",
          {
            role: "radio",
            "aria-checked": active,
            type: "button",
            onClick: () => onChange(option.id),
            className: `group flex flex-col items-center gap-0.5 rounded-lg px-2 py-2 text-center transition ${active ? "bg-emerald-400/12 text-emerald-100 ring-1 ring-inset ring-emerald-400/30" : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200"}`,
            children: [
              /* @__PURE__ */ u3("span", { className: "text-[12px] font-medium leading-tight", children: option.label }),
              /* @__PURE__ */ u3(
                "span",
                {
                  className: `font-mono text-[9.5px] uppercase tracking-[0.1em] ${active ? "text-emerald-300/80" : "text-slate-600 group-hover:text-slate-500"}`,
                  children: option.algorithm
                }
              )
            ]
          },
          option.id
        );
      })
    }
  );
}

// frontend/src/components/StationSelect.tsx
function StationSelect({ label, value, stations, onChange }) {
  const sorted = [...stations].sort((a3, b2) => a3.name.localeCompare(b2.name));
  return /* @__PURE__ */ u3("label", { className: "block", children: [
    /* @__PURE__ */ u3("span", { className: "label", children: label }),
    /* @__PURE__ */ u3("div", { className: "relative", children: [
      /* @__PURE__ */ u3(
        "select",
        {
          className: "field pr-9",
          value,
          onChange: (event) => onChange(event.target.value),
          children: sorted.map((station) => /* @__PURE__ */ u3("option", { value: station.id, children: station.name }, station.id))
        }
      ),
      /* @__PURE__ */ u3(
        "svg",
        {
          className: "pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500",
          viewBox: "0 0 20 20",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: "1.6",
          "aria-hidden": "true",
          children: /* @__PURE__ */ u3("path", { d: "M6 8l4 4 4-4", strokeLinecap: "round", strokeLinejoin: "round" })
        }
      )
    ] })
  ] });
}

// frontend/src/components/PlannerCard.tsx
function PlannerCard({
  network,
  stations,
  source,
  target,
  mode,
  onSourceChange,
  onTargetChange,
  onSwap,
  onModeChange,
  includeBus,
  busCount,
  onToggleBus
}) {
  const stationList = stations ?? network.stations;
  const activeMode = MODE_OPTIONS.find((option) => option.id === mode) ?? MODE_OPTIONS[0];
  return /* @__PURE__ */ u3(Card, { className: "p-4 sm:p-5", children: [
    /* @__PURE__ */ u3(
      SectionTitle,
      {
        title: "Plan a journey",
        subtitle: "Vertices are stations, edges are adjacent stops, weights are minutes."
      }
    ),
    /* @__PURE__ */ u3("div", { className: "mt-4 space-y-2.5", children: [
      /* @__PURE__ */ u3(StationSelect, { label: "From", value: source, stations: stationList, onChange: onSourceChange }),
      /* @__PURE__ */ u3("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ u3("span", { className: "h-px flex-1 bg-white/[0.06]" }),
        /* @__PURE__ */ u3(
          "button",
          {
            type: "button",
            onClick: onSwap,
            "aria-label": "Swap origin and destination",
            className: "grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-emerald-400/40 hover:text-emerald-300",
            children: /* @__PURE__ */ u3("svg", { viewBox: "0 0 24 24", className: "h-3.5 w-3.5", fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: /* @__PURE__ */ u3("path", { d: "M7 4v13m0 0-3-3m3 3 3-3M17 20V7m0 0-3 3m3-3 3 3", strokeLinecap: "round", strokeLinejoin: "round" }) })
          }
        ),
        /* @__PURE__ */ u3("span", { className: "h-px flex-1 bg-white/[0.06]" })
      ] }),
      /* @__PURE__ */ u3(StationSelect, { label: "To", value: target, stations: stationList, onChange: onTargetChange })
    ] }),
    /* @__PURE__ */ u3("div", { className: "mt-5", children: [
      /* @__PURE__ */ u3("span", { className: "label", children: "Optimise for" }),
      /* @__PURE__ */ u3(ModeToggle, { mode, onChange: onModeChange }),
      /* @__PURE__ */ u3("div", { className: "mt-2.5 flex gap-2 rounded-lg border border-white/[0.06] bg-black/20 px-2.5 py-2", children: [
        /* @__PURE__ */ u3("span", { className: "mt-[3px] h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/70" }),
        /* @__PURE__ */ u3("p", { className: "text-[11.5px] leading-relaxed text-slate-500", children: activeMode.hint })
      ] })
    ] }),
    /* @__PURE__ */ u3("div", { className: "mt-3 flex items-center gap-2.5 rounded-xl border border-white/[0.06] bg-black/20 px-3 py-2", children: [
      /* @__PURE__ */ u3("span", { className: "text-[11.5px] text-slate-300", children: "Include bus routes" }),
      /* @__PURE__ */ u3("span", { className: "font-mono text-[10px] text-slate-600", children: [
        busCount,
        " routes"
      ] }),
      /* @__PURE__ */ u3("div", { className: "ml-auto", children: /* @__PURE__ */ u3(Switch, { checked: includeBus, onChange: onToggleBus, label: "Include bus routes in planning" }) })
    ] })
  ] });
}

// frontend/src/lib/format.ts
function formatMinutes(value) {
  const total = Math.round(value);
  if (total < 60) return `${total} min`;
  const hours = Math.floor(total / 60);
  const minutes = total % 60;
  return minutes === 0 ? `${hours} h` : `${hours} h ${minutes} min`;
}
function stopsLabel(count) {
  return count === 1 ? "1 stop" : `${count} stops`;
}

// frontend/src/components/RoutePanel.tsx
function ModeIcon({ mode, className }) {
  if (mode === "bus") {
    return /* @__PURE__ */ u3("svg", { viewBox: "0 0 24 24", className, fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: [
      /* @__PURE__ */ u3("rect", { x: "4", y: "3.5", width: "16", height: "13", rx: "2.5" }),
      /* @__PURE__ */ u3("path", { d: "M4 10h16M7.5 16.5V19M16.5 16.5V19", strokeLinecap: "round" }),
      /* @__PURE__ */ u3("circle", { cx: "8", cy: "13.2", r: "0.9", fill: "currentColor", stroke: "none" }),
      /* @__PURE__ */ u3("circle", { cx: "16", cy: "13.2", r: "0.9", fill: "currentColor", stroke: "none" })
    ] });
  }
  return /* @__PURE__ */ u3("svg", { viewBox: "0 0 24 24", className, fill: "none", stroke: "currentColor", strokeWidth: "1.8", children: [
    /* @__PURE__ */ u3("rect", { x: "5.5", y: "3.5", width: "13", height: "13.5", rx: "3" }),
    /* @__PURE__ */ u3("path", { d: "M5.5 11.5h13M8.5 20l1.5-2.5M15.5 20 14 17.5", strokeLinecap: "round" }),
    /* @__PURE__ */ u3("circle", { cx: "9", cy: "14", r: "1", fill: "currentColor", stroke: "none" }),
    /* @__PURE__ */ u3("circle", { cx: "15", cy: "14", r: "1", fill: "currentColor", stroke: "none" })
  ] });
}
function Rail({ color }) {
  return /* @__PURE__ */ u3("div", { className: "relative flex w-4 shrink-0 justify-center", children: /* @__PURE__ */ u3("span", { className: "absolute inset-y-0 w-[3px] rounded-full", style: { background: `${color}55` } }) });
}
function StationRow({
  name,
  color,
  tone
}) {
  return /* @__PURE__ */ u3("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ u3("div", { className: "relative flex w-4 shrink-0 justify-center", children: [
      /* @__PURE__ */ u3(Rail, { color }),
      tone === "stop" ? /* @__PURE__ */ u3("span", { className: "relative z-10 mt-[7px] h-1.5 w-1.5 rounded-full", style: { background: color } }) : /* @__PURE__ */ u3(
        "span",
        {
          className: "relative z-10 mt-[5px] h-2.5 w-2.5 rounded-full",
          style: {
            background: tone === "start" ? "#34d399" : "#fb7185",
            boxShadow: `0 0 0 2px ${tone === "start" ? "#34d39955" : "#fb718555"}`
          }
        }
      )
    ] }),
    /* @__PURE__ */ u3(
      "div",
      {
        className: `flex-1 pb-2 text-[13px] leading-6 ${tone === "stop" ? "text-slate-400" : "font-semibold text-slate-100"}`,
        children: [
          name,
          tone === "end" ? /* @__PURE__ */ u3("span", { className: "ml-2 text-[10.5px] font-normal text-rose-300/80", children: "arrive" }) : null
        ]
      }
    )
  ] });
}
function LegHeader({ leg }) {
  return /* @__PURE__ */ u3("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ u3(Rail, { color: leg.color }),
    /* @__PURE__ */ u3("div", { className: "flex flex-wrap items-center gap-2 pb-1.5 pt-0.5", children: [
      /* @__PURE__ */ u3(
        "span",
        {
          className: "inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.1em]",
          style: { background: `${leg.color}20`, color: leg.color },
          children: [
            /* @__PURE__ */ u3(ModeIcon, { mode: leg.mode, className: "h-2.5 w-2.5" }),
            leg.lineName
          ]
        }
      ),
      /* @__PURE__ */ u3("span", { className: "text-[11px] text-slate-500", children: [
        stopsLabel(leg.stops),
        " \xB7 ",
        formatMinutes(leg.minutes)
      ] })
    ] })
  ] });
}
function InterchangeRow({ name, next, penalty }) {
  return /* @__PURE__ */ u3("div", { className: "flex gap-3", children: [
    /* @__PURE__ */ u3("div", { className: "relative flex w-4 shrink-0 justify-center", children: [
      /* @__PURE__ */ u3(Rail, { color: next.color }),
      /* @__PURE__ */ u3("span", { className: "relative z-10 mt-[4px] h-3 w-3 rounded-full border-2 border-slate-200 bg-[#080c12]" })
    ] }),
    /* @__PURE__ */ u3("div", { className: "flex flex-1 flex-wrap items-center gap-x-2 gap-y-1 pb-2.5", children: [
      /* @__PURE__ */ u3("span", { className: "text-[13px] font-semibold text-slate-100", children: name }),
      /* @__PURE__ */ u3("span", { className: "rounded-md border border-white/10 bg-white/[0.05] px-1.5 py-0.5 text-[10px] text-slate-400", children: [
        "change to ",
        next.lineName,
        " \xB7 +",
        penalty,
        " min"
      ] })
    ] })
  ] });
}
function RoutePanel({ result, mode, pending, onModeChange }) {
  const route = result?.primary;
  const summary = route?.summary;
  return /* @__PURE__ */ u3(Card, { className: "flex min-h-[320px] flex-col p-4 sm:p-5", children: [
    /* @__PURE__ */ u3(
      SectionTitle,
      {
        title: "Route",
        subtitle: result ? `${result.source.name} \u2192 ${result.target.name}` : "Choose two stations to solve the graph.",
        right: pending ? /* @__PURE__ */ u3(Spinner, { className: "mt-1 h-3.5 w-3.5 text-slate-500" }) : null
      }
    ),
    !result || !route ? /* @__PURE__ */ u3("div", { className: "mt-6 space-y-2", children: [
      /* @__PURE__ */ u3("div", { className: "h-12 animate-pulse rounded-xl bg-white/[0.04]" }),
      /* @__PURE__ */ u3("div", { className: "h-24 animate-pulse rounded-xl bg-white/[0.03]" })
    ] }) : !route.found ? /* @__PURE__ */ u3("div", { className: "mt-4 rounded-xl border border-amber-400/25 bg-amber-400/[0.07] p-4", children: [
      /* @__PURE__ */ u3(Pill, { tone: "warn", children: "No path" }),
      /* @__PURE__ */ u3("p", { className: "mt-2 text-[12.5px] leading-relaxed text-amber-100/80", children: route.message }),
      /* @__PURE__ */ u3("p", { className: "mt-2 text-[11px] leading-relaxed text-amber-200/50", children: "The stations lie in different connected components, so no walk, path or route can join them." })
    ] }) : /* @__PURE__ */ u3(k, { children: [
      /* @__PURE__ */ u3("div", { className: "mt-4 grid grid-cols-2 gap-2.5", children: [
        /* @__PURE__ */ u3(Stat, { label: "Stops", value: summary?.stops ?? 0 }),
        /* @__PURE__ */ u3(Stat, { label: "Time", value: Math.round(summary?.minutes ?? 0), unit: "min", accent: "#a7f3d0" }),
        /* @__PURE__ */ u3(Stat, { label: "Changes", value: summary?.interchanges ?? 0 }),
        /* @__PURE__ */ u3(Stat, { label: "Fare", value: `\u20B9${summary?.fare ?? 0}` })
      ] }),
      /* @__PURE__ */ u3("p", { className: "mt-2 text-[11px] leading-relaxed text-slate-500", children: [
        summary && summary.interchanges > 0 ? `${Math.round(summary.rideMinutes)} min riding + ${summary.interchanges} \xD7 ${result.interchangePenalty} min interchange` : `${Math.round(summary?.rideMinutes ?? 0)} min riding`,
        summary ? ` \xB7 fare ${summary.fareBand}` : ""
      ] }),
      route.message ? /* @__PURE__ */ u3("p", { className: "mt-3 rounded-lg border border-white/[0.06] bg-black/20 px-2.5 py-2 text-[11.5px] text-slate-400", children: route.message }) : null,
      route.legs.length > 0 ? /* @__PURE__ */ u3("div", { className: "mt-4 border-t border-white/[0.06] pt-4", children: [
        /* @__PURE__ */ u3("div", { className: "mb-2 flex items-center justify-between", children: [
          /* @__PURE__ */ u3("h3", { className: "text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-500", children: "Itinerary" }),
          /* @__PURE__ */ u3("span", { className: "font-mono text-[10.5px] text-slate-600", children: [
            stopsLabel(summary?.stops ?? 0),
            " \xB7 ",
            route.legs.length,
            " leg",
            route.legs.length === 1 ? "" : "s"
          ] })
        ] }),
        /* @__PURE__ */ u3("div", { className: "max-h-[330px] overflow-y-auto pr-1", children: route.legs.map((leg, index) => {
          const isLast = index === route.legs.length - 1;
          const arrival = leg.stationNames[leg.stationNames.length - 1];
          return /* @__PURE__ */ u3(k, { children: [
            index === 0 ? /* @__PURE__ */ u3(StationRow, { name: leg.stationNames[0], color: leg.color, tone: "start" }) : null,
            /* @__PURE__ */ u3(LegHeader, { leg }),
            leg.stationNames.slice(1, -1).map((name, position) => /* @__PURE__ */ u3(StationRow, { name, color: leg.color, tone: "stop" }, `${name}-${position}`)),
            isLast ? /* @__PURE__ */ u3(StationRow, { name: arrival, color: leg.color, tone: "end" }) : /* @__PURE__ */ u3(
              InterchangeRow,
              {
                name: arrival,
                next: route.legs[index + 1],
                penalty: result.interchangePenalty
              }
            )
          ] }, `${leg.line}-${index}`);
        }) })
      ] }) : null,
      /* @__PURE__ */ u3("div", { className: "mt-4 border-t border-white/[0.06] pt-3", children: [
        /* @__PURE__ */ u3("h3", { className: "mb-1.5 text-[10.5px] font-medium uppercase tracking-[0.14em] text-slate-500", children: "Objectives compared" }),
        /* @__PURE__ */ u3("div", { className: "grid grid-cols-[minmax(0,1fr)_34px_38px_32px] items-center gap-1.5 px-2.5 pb-1 text-[9px] uppercase tracking-[0.1em] text-slate-500", children: [
          /* @__PURE__ */ u3("span", { children: "Objective" }),
          /* @__PURE__ */ u3("span", { className: "text-right", children: "Stops" }),
          /* @__PURE__ */ u3("span", { className: "text-right", children: "Time" }),
          /* @__PURE__ */ u3("span", { className: "text-right", children: "Chg" })
        ] }),
        /* @__PURE__ */ u3("ul", { className: "space-y-1", children: result.options.map((option) => {
          const active = option.mode === mode;
          const meta = MODE_OPTIONS.find((entry) => entry.id === option.mode);
          const displayLabel = option.mode === "fewest_interchanges" ? "Fewest changes" : meta?.label ?? option.mode;
          return /* @__PURE__ */ u3("li", { children: /* @__PURE__ */ u3(
            "button",
            {
              type: "button",
              onClick: () => onModeChange(option.mode),
              className: `grid w-full grid-cols-[minmax(0,1fr)_34px_38px_32px] items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-left transition ${active ? "border-emerald-400/30 bg-emerald-400/[0.08]" : "border-transparent hover:border-white/10 hover:bg-white/[0.03]"}`,
              children: [
                /* @__PURE__ */ u3(
                  "span",
                  {
                    className: `truncate text-[11.5px] ${active ? "text-emerald-100" : "text-slate-400"}`,
                    children: displayLabel
                  }
                ),
                option.found && option.summary ? /* @__PURE__ */ u3(k, { children: [
                  /* @__PURE__ */ u3("span", { className: "text-right font-mono text-[11px] text-slate-400", children: option.summary.stops }),
                  /* @__PURE__ */ u3("span", { className: "text-right font-mono text-[11px] text-slate-400", children: Math.round(option.summary.minutes) }),
                  /* @__PURE__ */ u3("span", { className: "text-right font-mono text-[11px] text-slate-500", children: option.summary.interchanges })
                ] }) : /* @__PURE__ */ u3("span", { className: "col-span-3 text-right text-[11px] text-amber-300/70", children: "unreachable" })
              ]
            }
          ) }, option.mode);
        }) }),
        /* @__PURE__ */ u3("p", { className: "mt-2 text-[11px] leading-relaxed text-slate-600", children: "Objectives can tie or disagree \u2014 the fewest-stop path may need more changes, and a bus can beat the metro on changes while losing on time." })
      ] })
    ] })
  ] });
}

// frontend/src/lib/network.ts
function slugify(value) {
  return value.toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-");
}
function uniqueStationId(name, stations) {
  const base = slugify(name) || "station";
  const taken = new Set(stations.map((station) => station.id));
  if (!taken.has(base)) return base;
  let suffix = 2;
  while (taken.has(`${base}-${suffix}`)) suffix += 1;
  return `${base}-${suffix}`;
}
function labelForDirection(from, to) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (Math.abs(dx) >= Math.abs(dy)) {
    return { dx: 0, dy: 16, anchor: "middle", rotate: 0 };
  }
  return { dx: -13, dy: 4, anchor: "end", rotate: 0 };
}
function findStation(stations, id) {
  const station = stations.find((candidate) => candidate.id === id);
  if (!station) throw new Error(`Station "${id}" is not in this network.`);
  return station;
}
function addStation(network, input) {
  const name = input.name.trim();
  if (!name) throw new Error("Give the new station a name.");
  const line = network.lines.find((candidate) => candidate.id === input.lineId);
  if (!line) throw new Error("Choose a line for the new station.");
  const index = line.stations.indexOf(input.afterId);
  if (index === -1) throw new Error("That station is not on this line.");
  const previousId = line.stations[index + 1];
  const after = findStation(network.stations, input.afterId);
  const next = previousId ? findStation(network.stations, previousId) : void 0;
  let x3;
  let y3;
  if (next) {
    x3 = (after.x + next.x) / 2;
    y3 = (after.y + next.y) / 2;
  } else {
    const beforeId = line.stations[index - 1];
    const before = beforeId ? findStation(network.stations, beforeId) : void 0;
    const dx = before ? after.x - before.x : 40;
    const dy = before ? after.y - before.y : 0;
    const length = Math.hypot(dx, dy) || 1;
    x3 = after.x + dx / length * 45;
    y3 = after.y + dy / length * 45;
  }
  const id = uniqueStationId(name, network.stations);
  const label = next ? labelForDirection(after, next) : labelForDirection(after, { ...after, x: x3, y: y3 });
  const station = { id, name, x: x3, y: y3, lines: [line.id], label };
  const splitEdge = next ? network.edges.find(
    (edge) => edge.a === after.id && edge.b === next.id || edge.a === next.id && edge.b === after.id
  ) : void 0;
  const originalMinutes = splitEdge ? splitEdge.minutes : 6;
  const firstHalf = Math.max(1, Math.round(originalMinutes / 2));
  const secondHalf = Math.max(1, Math.round(originalMinutes - firstHalf));
  const edges = network.edges.filter((edge) => edge !== splitEdge);
  edges.push({ a: after.id, b: id, line: line.id, minutes: firstHalf });
  if (next) edges.push({ a: id, b: next.id, line: line.id, minutes: secondHalf });
  const stations = [...network.stations, station].sort((a3, b2) => a3.name.localeCompare(b2.name));
  const lines = network.lines.map((candidate) => {
    if (candidate.id !== line.id) return candidate;
    const order = [...candidate.stations];
    order.splice(index + 1, 0, id);
    return { ...candidate, stations: order };
  });
  return { ...network, stations, lines, edges };
}
function removeStation(network, stationId) {
  const station = network.stations.find((candidate) => candidate.id === stationId);
  if (!station) throw new Error("That station is not in this network.");
  return {
    ...network,
    stations: network.stations.filter((candidate) => candidate.id !== stationId),
    edges: network.edges.filter((edge) => edge.a !== stationId && edge.b !== stationId),
    lines: network.lines.map((line) => ({
      ...line,
      stations: line.stations.filter((id) => id !== stationId)
    }))
  };
}

// frontend/src/App.tsx
var DEFAULT_SOURCE = "karol-bagh";
var DEFAULT_TARGET = "lajpat-nagar";
function App() {
  const [baseNetwork, setBaseNetwork] = d2(null);
  const [network, setNetwork] = d2(null);
  const [suspended, setSuspended] = d2([]);
  const [includeBus, setIncludeBus] = d2(true);
  const [source, setSource] = d2(DEFAULT_SOURCE);
  const [target, setTarget] = d2(DEFAULT_TARGET);
  const [mode, setMode] = d2("shortest_time");
  const [result, setResult] = d2(null);
  const [analysis, setAnalysis] = d2(null);
  const [error, setError] = d2(null);
  const [pending, setPending] = d2(false);
  const [notice, setNotice] = d2(null);
  y2(() => {
    const controller = new AbortController();
    getNetwork(controller.signal).then((loaded) => {
      setBaseNetwork(loaded);
      setNetwork(loaded);
    }).catch((cause) => {
      if (cause.name !== "AbortError") setError(cause.message);
    });
    return () => controller.abort();
  }, []);
  const busLineIds = T2(
    () => new Set((network?.lines ?? []).filter((line) => line.mode === "bus").map((line) => line.id)),
    [network]
  );
  const effectiveNetwork = T2(() => {
    if (!network) return null;
    const excluded = new Set(suspended);
    if (!includeBus) busLineIds.forEach((lineId) => excluded.add(lineId));
    if (excluded.size === 0) return network;
    const stations = network.stations.filter(
      (station) => station.lines.some((lineId) => !excluded.has(lineId))
    );
    const stationIds = new Set(stations.map((station) => station.id));
    return {
      ...network,
      lines: network.lines.filter((line) => !excluded.has(line.id)),
      stations,
      edges: network.edges.filter(
        (edge) => !excluded.has(edge.line) && stationIds.has(edge.a) && stationIds.has(edge.b)
      )
    };
  }, [network, suspended, includeBus, busLineIds]);
  y2(() => {
    if (!effectiveNetwork || effectiveNetwork.stations.length === 0) return;
    const stationIds = new Set(effectiveNetwork.stations.map((station) => station.id));
    let nextSource = source;
    if (!stationIds.has(source)) {
      nextSource = effectiveNetwork.stations[0]?.id ?? "";
      setSource(nextSource);
    }
    if (!stationIds.has(target)) {
      const fallbackTarget = effectiveNetwork.stations.find((station) => station.id !== nextSource)?.id ?? effectiveNetwork.stations[0]?.id ?? "";
      setTarget(fallbackTarget);
    }
  }, [effectiveNetwork, source, target]);
  y2(() => {
    if (!effectiveNetwork || effectiveNetwork.stations.length === 0) return;
    const stationIds = new Set(effectiveNetwork.stations.map((station) => station.id));
    if (!stationIds.has(source) || !stationIds.has(target)) {
      return;
    }
    const controller = new AbortController();
    setPending(true);
    Promise.all([
      solve(
        {
          network: effectiveNetwork,
          source,
          target,
          mode,
          interchangePenalty: INTERCHANGE_PENALTY
        },
        controller.signal
      ),
      analyze(effectiveNetwork, controller.signal)
    ]).then(([solved, analysed]) => {
      setResult(solved);
      setAnalysis(analysed);
      setError(null);
    }).catch((cause) => {
      if (cause.name !== "AbortError") setError(cause.message);
    }).finally(() => setPending(false));
    return () => controller.abort();
  }, [effectiveNetwork, source, target, mode]);
  const applyNetwork = q2(
    (next) => {
      setNetwork(next);
      if (!next.stations.some((station) => station.id === source)) {
        setSource(next.stations[0]?.id ?? "");
      }
      if (!next.stations.some((station) => station.id === target)) {
        setTarget(next.stations[1]?.id ?? next.stations[0]?.id ?? "");
      }
    },
    [source, target]
  );
  const handleAddStation = (input) => {
    if (!network) return;
    try {
      applyNetwork(addStation(network, input));
      setNotice(`Added \u201C${input.name.trim()}\u201D to the network.`);
    } catch (cause) {
      setNotice(cause.message);
    }
  };
  const handleRemoveStation = (stationId) => {
    if (!network) return;
    const name = network.stations.find((station) => station.id === stationId)?.name ?? stationId;
    try {
      applyNetwork(removeStation(network, stationId));
      setNotice(`Removed \u201C${name}\u201D and its incident edges.`);
    } catch (cause) {
      setNotice(cause.message);
    }
  };
  const handleReset = () => {
    if (!baseNetwork) return;
    setNetwork(baseNetwork);
    setSuspended([]);
    setIncludeBus(true);
    setSource(DEFAULT_SOURCE);
    setTarget(DEFAULT_TARGET);
    setMode("shortest_time");
    setNotice(`Network restored to the original ${baseNetwork.stations.length}-station dataset.`);
  };
  const modified = Boolean(
    baseNetwork && network && (network !== baseNetwork || suspended.length > 0)
  );
  if (!network || !baseNetwork) {
    return /* @__PURE__ */ u3("div", { className: "grid min-h-screen place-items-center", children: /* @__PURE__ */ u3("div", { className: "flex items-center gap-3 text-sm text-slate-400", children: error ? /* @__PURE__ */ u3("span", { className: "max-w-md rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-3 text-rose-200", children: error }) : /* @__PURE__ */ u3(k, { children: [
      /* @__PURE__ */ u3(Spinner, { className: "h-4 w-4 text-emerald-300" }),
      "Loading the metro graph\u2026"
    ] }) }) });
  }
  const metroCount = network.lines.filter((line) => line.mode === "metro").length;
  const busCount = network.lines.filter((line) => line.mode === "bus").length;
  return /* @__PURE__ */ u3("div", { className: "min-h-screen pb-10", children: [
    /* @__PURE__ */ u3("header", { className: "sticky top-0 z-20 border-b border-white/[0.06] bg-[#070a10]/85 backdrop-blur-xl", children: /* @__PURE__ */ u3("div", { className: "mx-auto flex max-w-[1500px] flex-wrap items-center gap-3 px-4 py-3 xl:px-6", children: [
      /* @__PURE__ */ u3("div", { className: "grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-emerald-300 to-sky-500 text-[#04140f] shadow-lg shadow-emerald-500/20", children: /* @__PURE__ */ u3("svg", { viewBox: "0 0 24 24", className: "h-5 w-5", fill: "none", stroke: "currentColor", strokeWidth: "1.9", children: [
        /* @__PURE__ */ u3("circle", { cx: "6", cy: "18", r: "2.1" }),
        /* @__PURE__ */ u3("circle", { cx: "18", cy: "18", r: "2.1" }),
        /* @__PURE__ */ u3("circle", { cx: "12", cy: "6", r: "2.1" }),
        /* @__PURE__ */ u3("path", { d: "M12 8.1 6 15.9M12 8.1l6 7.8M8.1 18h7.8", strokeLinecap: "round" })
      ] }) }),
      /* @__PURE__ */ u3("div", { className: "min-w-0", children: [
        /* @__PURE__ */ u3("h1", { className: "text-[15px] font-semibold tracking-tight text-white", children: "MetroGraph" }),
        /* @__PURE__ */ u3("p", { className: "truncate text-[11px] text-slate-500", children: [
          network.name,
          " \xB7 BFS & Dijkstra route engine"
        ] })
      ] }),
      /* @__PURE__ */ u3("div", { className: "ml-auto flex flex-wrap items-center gap-1.5", children: [
        /* @__PURE__ */ u3(Pill, { children: [
          network.stations.length,
          " stations"
        ] }),
        /* @__PURE__ */ u3(Pill, { children: [
          metroCount,
          " metro"
        ] }),
        /* @__PURE__ */ u3(Pill, { children: [
          busCount,
          " bus"
        ] }),
        analysis ? analysis.isConnected ? /* @__PURE__ */ u3(Pill, { tone: "good", children: "connected" }) : /* @__PURE__ */ u3(Pill, { tone: "warn", children: [
          analysis.componentCount,
          " components"
        ] }) : null
      ] })
    ] }) }),
    /* @__PURE__ */ u3("main", { className: "mx-auto grid max-w-[1500px] gap-4 px-4 pt-4 md:grid-cols-[minmax(300px,360px)_minmax(0,1fr)] xl:grid-cols-[320px_minmax(0,1fr)_320px] xl:gap-5 xl:px-6", children: [
      /* @__PURE__ */ u3("div", { className: "space-y-4 md:col-start-1 xl:space-y-5", children: [
        /* @__PURE__ */ u3(
          PlannerCard,
          {
            network,
            stations: effectiveNetwork?.stations ?? network.stations,
            source,
            target,
            mode,
            onSourceChange: setSource,
            onTargetChange: setTarget,
            onSwap: () => {
              setSource(target);
              setTarget(source);
            },
            onModeChange: setMode,
            includeBus,
            busCount,
            onToggleBus: setIncludeBus
          }
        ),
        /* @__PURE__ */ u3(RoutePanel, { result, mode, pending, onModeChange: setMode })
      ] }),
      /* @__PURE__ */ u3("div", { className: "space-y-4 md:col-start-2 xl:space-y-5", children: [
        error ? /* @__PURE__ */ u3("div", { className: "rounded-xl border border-rose-400/25 bg-rose-400/10 px-4 py-2.5 text-[12px] text-rose-200", children: error }) : null,
        /* @__PURE__ */ u3(
          MetroMap,
          {
            network,
            route: result?.primary ?? null,
            suspended,
            penalty: INTERCHANGE_PENALTY,
            includeBus
          }
        )
      ] }),
      /* @__PURE__ */ u3("div", { className: "grid gap-4 md:col-span-2 md:grid-cols-2 xl:col-span-1 xl:col-start-3 xl:grid-cols-1 xl:gap-5", children: [
        /* @__PURE__ */ u3(InsightsCard, { analysis, lines: network.lines }),
        /* @__PURE__ */ u3(
          EditorCard,
          {
            network,
            suspended,
            modified,
            notice,
            onToggleLine: (lineId) => setSuspended(
              (current) => current.includes(lineId) ? current.filter((id) => id !== lineId) : [...current, lineId]
            ),
            onAddStation: handleAddStation,
            onRemoveStation: handleRemoveStation,
            onReset: handleReset
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ u3("footer", { className: "mx-auto max-w-[1500px] px-4 pb-10 xl:px-6", children: /* @__PURE__ */ u3("p", { className: "text-[11px] leading-relaxed text-slate-600", children: "Every algorithm here \u2014 adjacency list construction, BFS, Dijkstra over the (station, line) state graph, connected components, vertex degrees and articulation points \u2014 is implemented by hand in Python. Bus routes are just more lines in the same graph, so each algorithm handles them without a special case. No NetworkX, no graph shortcuts." }) })
  ] });
}

// frontend/src/main.tsx

createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ u3(Cn, { children: /* @__PURE__ */ u3(App, {}) })
);
