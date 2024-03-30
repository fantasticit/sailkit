/**
 * @vue/shared v3.4.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function _s(e, t) {
  const n = new Set(e.split(","));
  return t ? (s) => n.has(s.toLowerCase()) : (s) => n.has(s);
}
const te = {},
  mt = [],
  xe = () => {},
  oo = () => !1,
  Bt = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    (e.charCodeAt(2) > 122 || e.charCodeAt(2) < 97),
  ys = (e) => e.startsWith("onUpdate:"),
  ie = Object.assign,
  bs = (e, t) => {
    const n = e.indexOf(t);
    n > -1 && e.splice(n, 1);
  },
  lo = Object.prototype.hasOwnProperty,
  X = (e, t) => lo.call(e, t),
  B = Array.isArray,
  _t = (e) => bn(e) === "[object Map]",
  Hr = (e) => bn(e) === "[object Set]",
  K = (e) => typeof e == "function",
  ne = (e) => typeof e == "string",
  St = (e) => typeof e == "symbol",
  Z = (e) => e !== null && typeof e == "object",
  jr = (e) => (Z(e) || K(e)) && K(e.then) && K(e.catch),
  Vr = Object.prototype.toString,
  bn = (e) => Vr.call(e),
  co = (e) => bn(e).slice(8, -1),
  Dr = (e) => bn(e) === "[object Object]",
  vs = (e) => ne(e) && e !== "NaN" && e[0] !== "-" && "" + parseInt(e, 10) === e,
  yt = _s(
    ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted",
  ),
  vn = (e) => {
    const t = Object.create(null);
    return (n) => t[n] || (t[n] = e(n));
  },
  ao = /-(\w)/g,
  Me = vn((e) => e.replace(ao, (t, n) => (n ? n.toUpperCase() : ""))),
  uo = /\B([A-Z])/g,
  at = vn((e) => e.replace(uo, "-$1").toLowerCase()),
  wn = vn((e) => e.charAt(0).toUpperCase() + e.slice(1)),
  on = vn((e) => (e ? `on${wn(e)}` : "")),
  Qe = (e, t) => !Object.is(e, t),
  Vn = (e, t) => {
    for (let n = 0; n < e.length; n++) e[n](t);
  },
  un = (e, t, n) => {
    Object.defineProperty(e, t, { configurable: !0, enumerable: !1, value: n });
  },
  fo = (e) => {
    const t = parseFloat(e);
    return isNaN(t) ? e : t;
  },
  ho = (e) => {
    const t = ne(e) ? Number(e) : NaN;
    return isNaN(t) ? e : t;
  };
let Ws;
const Ur = () =>
  Ws ||
  (Ws =
    typeof globalThis < "u"
      ? globalThis
      : typeof self < "u"
        ? self
        : typeof window < "u"
          ? window
          : typeof global < "u"
            ? global
            : {});
function ws(e) {
  if (B(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) {
      const s = e[n],
        r = ne(s) ? _o(s) : ws(s);
      if (r) for (const i in r) t[i] = r[i];
    }
    return t;
  } else if (ne(e) || Z(e)) return e;
}
const po = /;(?![^(]*\))/g,
  go = /:([^]+)/,
  mo = /\/\*[^]*?\*\//g;
function _o(e) {
  const t = {};
  return (
    e
      .replace(mo, "")
      .split(po)
      .forEach((n) => {
        if (n) {
          const s = n.split(go);
          s.length > 1 && (t[s[0].trim()] = s[1].trim());
        }
      }),
    t
  );
}
function Es(e) {
  let t = "";
  if (ne(e)) t = e;
  else if (B(e))
    for (let n = 0; n < e.length; n++) {
      const s = Es(e[n]);
      s && (t += s + " ");
    }
  else if (Z(e)) for (const n in e) e[n] && (t += n + " ");
  return t.trim();
}
const yo = "itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly",
  bo = _s(yo);
function Br(e) {
  return !!e || e === "";
}
const Fa = (e) =>
    ne(e)
      ? e
      : e == null
        ? ""
        : B(e) || (Z(e) && (e.toString === Vr || !K(e.toString)))
          ? JSON.stringify(e, kr, 2)
          : String(e),
  kr = (e, t) =>
    t && t.__v_isRef
      ? kr(e, t.value)
      : _t(t)
        ? {
            [`Map(${t.size})`]: [...t.entries()].reduce(
              (n, [s, r], i) => ((n[Dn(s, i) + " =>"] = r), n),
              {},
            ),
          }
        : Hr(t)
          ? { [`Set(${t.size})`]: [...t.values()].map((n) => Dn(n)) }
          : St(t)
            ? Dn(t)
            : Z(t) && !B(t) && !Dr(t)
              ? String(t)
              : t,
  Dn = (e, t = "") => {
    var n;
    return St(e) ? `Symbol(${(n = e.description) != null ? n : t})` : e;
  };
/**
 * @vue/reactivity v3.4.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ let be;
class vo {
  constructor(t = !1) {
    (this.detached = t),
      (this._active = !0),
      (this.effects = []),
      (this.cleanups = []),
      (this.parent = be),
      !t && be && (this.index = (be.scopes || (be.scopes = [])).push(this) - 1);
  }
  get active() {
    return this._active;
  }
  run(t) {
    if (this._active) {
      const n = be;
      try {
        return (be = this), t();
      } finally {
        be = n;
      }
    }
  }
  on() {
    be = this;
  }
  off() {
    be = this.parent;
  }
  stop(t) {
    if (this._active) {
      let n, s;
      for (n = 0, s = this.effects.length; n < s; n++) this.effects[n].stop();
      for (n = 0, s = this.cleanups.length; n < s; n++) this.cleanups[n]();
      if (this.scopes) for (n = 0, s = this.scopes.length; n < s; n++) this.scopes[n].stop(!0);
      if (!this.detached && this.parent && !t) {
        const r = this.parent.scopes.pop();
        r && r !== this && ((this.parent.scopes[this.index] = r), (r.index = this.index));
      }
      (this.parent = void 0), (this._active = !1);
    }
  }
}
function wo(e, t = be) {
  t && t.active && t.effects.push(e);
}
function Kr() {
  return be;
}
function Eo(e) {
  be && be.cleanups.push(e);
}
let ot;
class Cs {
  constructor(t, n, s, r) {
    (this.fn = t),
      (this.trigger = n),
      (this.scheduler = s),
      (this.active = !0),
      (this.deps = []),
      (this._dirtyLevel = 4),
      (this._trackId = 0),
      (this._runnings = 0),
      (this._shouldSchedule = !1),
      (this._depsLength = 0),
      wo(this, r);
  }
  get dirty() {
    if (this._dirtyLevel === 2 || this._dirtyLevel === 3) {
      (this._dirtyLevel = 1), ut();
      for (let t = 0; t < this._depsLength; t++) {
        const n = this.deps[t];
        if (n.computed && (Co(n.computed), this._dirtyLevel >= 4)) break;
      }
      this._dirtyLevel === 1 && (this._dirtyLevel = 0), ft();
    }
    return this._dirtyLevel >= 4;
  }
  set dirty(t) {
    this._dirtyLevel = t ? 4 : 0;
  }
  run() {
    if (((this._dirtyLevel = 0), !this.active)) return this.fn();
    let t = Xe,
      n = ot;
    try {
      return (Xe = !0), (ot = this), this._runnings++, qs(this), this.fn();
    } finally {
      Gs(this), this._runnings--, (ot = n), (Xe = t);
    }
  }
  stop() {
    var t;
    this.active &&
      (qs(this), Gs(this), (t = this.onStop) == null || t.call(this), (this.active = !1));
  }
}
function Co(e) {
  return e.value;
}
function qs(e) {
  e._trackId++, (e._depsLength = 0);
}
function Gs(e) {
  if (e.deps.length > e._depsLength) {
    for (let t = e._depsLength; t < e.deps.length; t++) Wr(e.deps[t], e);
    e.deps.length = e._depsLength;
  }
}
function Wr(e, t) {
  const n = e.get(t);
  n !== void 0 && t._trackId !== n && (e.delete(t), e.size === 0 && e.cleanup());
}
let Xe = !0,
  ss = 0;
const qr = [];
function ut() {
  qr.push(Xe), (Xe = !1);
}
function ft() {
  const e = qr.pop();
  Xe = e === void 0 ? !0 : e;
}
function xs() {
  ss++;
}
function Ss() {
  for (ss--; !ss && rs.length; ) rs.shift()();
}
function Gr(e, t, n) {
  if (t.get(e) !== e._trackId) {
    t.set(e, e._trackId);
    const s = e.deps[e._depsLength];
    s !== t ? (s && Wr(s, e), (e.deps[e._depsLength++] = t)) : e._depsLength++;
  }
}
const rs = [];
function zr(e, t, n) {
  xs();
  for (const s of e.keys()) {
    let r;
    s._dirtyLevel < t &&
      (r ?? (r = e.get(s) === s._trackId)) &&
      (s._shouldSchedule || (s._shouldSchedule = s._dirtyLevel === 0), (s._dirtyLevel = t)),
      s._shouldSchedule &&
        (r ?? (r = e.get(s) === s._trackId)) &&
        (s.trigger(),
        (!s._runnings || s.allowRecurse) &&
          s._dirtyLevel !== 2 &&
          ((s._shouldSchedule = !1), s.scheduler && rs.push(s.scheduler)));
  }
  Ss();
}
const Xr = (e, t) => {
    const n = new Map();
    return (n.cleanup = e), (n.computed = t), n;
  },
  fn = new WeakMap(),
  lt = Symbol(""),
  is = Symbol("");
function _e(e, t, n) {
  if (Xe && ot) {
    let s = fn.get(e);
    s || fn.set(e, (s = new Map()));
    let r = s.get(n);
    r || s.set(n, (r = Xr(() => s.delete(n)))), Gr(ot, r);
  }
}
function He(e, t, n, s, r, i) {
  const o = fn.get(e);
  if (!o) return;
  let l = [];
  if (t === "clear") l = [...o.values()];
  else if (n === "length" && B(e)) {
    const c = Number(s);
    o.forEach((u, d) => {
      (d === "length" || (!St(d) && d >= c)) && l.push(u);
    });
  } else
    switch ((n !== void 0 && l.push(o.get(n)), t)) {
      case "add":
        B(e) ? vs(n) && l.push(o.get("length")) : (l.push(o.get(lt)), _t(e) && l.push(o.get(is)));
        break;
      case "delete":
        B(e) || (l.push(o.get(lt)), _t(e) && l.push(o.get(is)));
        break;
      case "set":
        _t(e) && l.push(o.get(lt));
        break;
    }
  xs();
  for (const c of l) c && zr(c, 4);
  Ss();
}
function xo(e, t) {
  var n;
  return (n = fn.get(e)) == null ? void 0 : n.get(t);
}
const So = _s("__proto__,__v_isRef,__isVue"),
  Yr = new Set(
    Object.getOwnPropertyNames(Symbol)
      .filter((e) => e !== "arguments" && e !== "caller")
      .map((e) => Symbol[e])
      .filter(St),
  ),
  zs = To();
function To() {
  const e = {};
  return (
    ["includes", "indexOf", "lastIndexOf"].forEach((t) => {
      e[t] = function (...n) {
        const s = Y(this);
        for (let i = 0, o = this.length; i < o; i++) _e(s, "get", i + "");
        const r = s[t](...n);
        return r === -1 || r === !1 ? s[t](...n.map(Y)) : r;
      };
    }),
    ["push", "pop", "shift", "unshift", "splice"].forEach((t) => {
      e[t] = function (...n) {
        ut(), xs();
        const s = Y(this)[t].apply(this, n);
        return Ss(), ft(), s;
      };
    }),
    e
  );
}
function Ao(e) {
  const t = Y(this);
  return _e(t, "has", e), t.hasOwnProperty(e);
}
class Jr {
  constructor(t = !1, n = !1) {
    (this._isReadonly = t), (this._isShallow = n);
  }
  get(t, n, s) {
    const r = this._isReadonly,
      i = this._isShallow;
    if (n === "__v_isReactive") return !r;
    if (n === "__v_isReadonly") return r;
    if (n === "__v_isShallow") return i;
    if (n === "__v_raw")
      return s === (r ? (i ? Do : ti) : i ? ei : Zr).get(t) ||
        Object.getPrototypeOf(t) === Object.getPrototypeOf(s)
        ? t
        : void 0;
    const o = B(t);
    if (!r) {
      if (o && X(zs, n)) return Reflect.get(zs, n, s);
      if (n === "hasOwnProperty") return Ao;
    }
    const l = Reflect.get(t, n, s);
    return (St(n) ? Yr.has(n) : So(n)) || (r || _e(t, "get", n), i)
      ? l
      : he(l)
        ? o && vs(n)
          ? l
          : l.value
        : Z(l)
          ? r
            ? xn(l)
            : Cn(l)
          : l;
  }
}
class Qr extends Jr {
  constructor(t = !1) {
    super(!1, t);
  }
  set(t, n, s, r) {
    let i = t[n];
    if (!this._isShallow) {
      const c = Ct(i);
      if ((!dn(s) && !Ct(s) && ((i = Y(i)), (s = Y(s))), !B(t) && he(i) && !he(s)))
        return c ? !1 : ((i.value = s), !0);
    }
    const o = B(t) && vs(n) ? Number(n) < t.length : X(t, n),
      l = Reflect.set(t, n, s, r);
    return t === Y(r) && (o ? Qe(s, i) && He(t, "set", n, s) : He(t, "add", n, s)), l;
  }
  deleteProperty(t, n) {
    const s = X(t, n);
    t[n];
    const r = Reflect.deleteProperty(t, n);
    return r && s && He(t, "delete", n, void 0), r;
  }
  has(t, n) {
    const s = Reflect.has(t, n);
    return (!St(n) || !Yr.has(n)) && _e(t, "has", n), s;
  }
  ownKeys(t) {
    return _e(t, "iterate", B(t) ? "length" : lt), Reflect.ownKeys(t);
  }
}
class Ro extends Jr {
  constructor(t = !1) {
    super(!0, t);
  }
  set(t, n) {
    return !0;
  }
  deleteProperty(t, n) {
    return !0;
  }
}
const Oo = new Qr(),
  Lo = new Ro(),
  Io = new Qr(!0),
  Ts = (e) => e,
  En = (e) => Reflect.getPrototypeOf(e);
function qt(e, t, n = !1, s = !1) {
  e = e.__v_raw;
  const r = Y(e),
    i = Y(t);
  n || (Qe(t, i) && _e(r, "get", t), _e(r, "get", i));
  const { has: o } = En(r),
    l = s ? Ts : n ? Os : Ht;
  if (o.call(r, t)) return l(e.get(t));
  if (o.call(r, i)) return l(e.get(i));
  e !== r && e.get(t);
}
function Gt(e, t = !1) {
  const n = this.__v_raw,
    s = Y(n),
    r = Y(e);
  return (
    t || (Qe(e, r) && _e(s, "has", e), _e(s, "has", r)), e === r ? n.has(e) : n.has(e) || n.has(r)
  );
}
function zt(e, t = !1) {
  return (e = e.__v_raw), !t && _e(Y(e), "iterate", lt), Reflect.get(e, "size", e);
}
function Xs(e) {
  e = Y(e);
  const t = Y(this);
  return En(t).has.call(t, e) || (t.add(e), He(t, "add", e, e)), this;
}
function Ys(e, t) {
  t = Y(t);
  const n = Y(this),
    { has: s, get: r } = En(n);
  let i = s.call(n, e);
  i || ((e = Y(e)), (i = s.call(n, e)));
  const o = r.call(n, e);
  return n.set(e, t), i ? Qe(t, o) && He(n, "set", e, t) : He(n, "add", e, t), this;
}
function Js(e) {
  const t = Y(this),
    { has: n, get: s } = En(t);
  let r = n.call(t, e);
  r || ((e = Y(e)), (r = n.call(t, e))), s && s.call(t, e);
  const i = t.delete(e);
  return r && He(t, "delete", e, void 0), i;
}
function Qs() {
  const e = Y(this),
    t = e.size !== 0,
    n = e.clear();
  return t && He(e, "clear", void 0, void 0), n;
}
function Xt(e, t) {
  return function (s, r) {
    const i = this,
      o = i.__v_raw,
      l = Y(o),
      c = t ? Ts : e ? Os : Ht;
    return !e && _e(l, "iterate", lt), o.forEach((u, d) => s.call(r, c(u), c(d), i));
  };
}
function Yt(e, t, n) {
  return function (...s) {
    const r = this.__v_raw,
      i = Y(r),
      o = _t(i),
      l = e === "entries" || (e === Symbol.iterator && o),
      c = e === "keys" && o,
      u = r[e](...s),
      d = n ? Ts : t ? Os : Ht;
    return (
      !t && _e(i, "iterate", c ? is : lt),
      {
        next() {
          const { value: h, done: p } = u.next();
          return p ? { value: h, done: p } : { value: l ? [d(h[0]), d(h[1])] : d(h), done: p };
        },
        [Symbol.iterator]() {
          return this;
        },
      }
    );
  };
}
function Ue(e) {
  return function (...t) {
    return e === "delete" ? !1 : e === "clear" ? void 0 : this;
  };
}
function Po() {
  const e = {
      get(i) {
        return qt(this, i);
      },
      get size() {
        return zt(this);
      },
      has: Gt,
      add: Xs,
      set: Ys,
      delete: Js,
      clear: Qs,
      forEach: Xt(!1, !1),
    },
    t = {
      get(i) {
        return qt(this, i, !1, !0);
      },
      get size() {
        return zt(this);
      },
      has: Gt,
      add: Xs,
      set: Ys,
      delete: Js,
      clear: Qs,
      forEach: Xt(!1, !0),
    },
    n = {
      get(i) {
        return qt(this, i, !0);
      },
      get size() {
        return zt(this, !0);
      },
      has(i) {
        return Gt.call(this, i, !0);
      },
      add: Ue("add"),
      set: Ue("set"),
      delete: Ue("delete"),
      clear: Ue("clear"),
      forEach: Xt(!0, !1),
    },
    s = {
      get(i) {
        return qt(this, i, !0, !0);
      },
      get size() {
        return zt(this, !0);
      },
      has(i) {
        return Gt.call(this, i, !0);
      },
      add: Ue("add"),
      set: Ue("set"),
      delete: Ue("delete"),
      clear: Ue("clear"),
      forEach: Xt(!0, !0),
    };
  return (
    ["keys", "values", "entries", Symbol.iterator].forEach((i) => {
      (e[i] = Yt(i, !1, !1)),
        (n[i] = Yt(i, !0, !1)),
        (t[i] = Yt(i, !1, !0)),
        (s[i] = Yt(i, !0, !0));
    }),
    [e, n, t, s]
  );
}
const [Mo, No, Fo, $o] = Po();
function As(e, t) {
  const n = t ? (e ? $o : Fo) : e ? No : Mo;
  return (s, r, i) =>
    r === "__v_isReactive"
      ? !e
      : r === "__v_isReadonly"
        ? e
        : r === "__v_raw"
          ? s
          : Reflect.get(X(n, r) && r in s ? n : s, r, i);
}
const Ho = { get: As(!1, !1) },
  jo = { get: As(!1, !0) },
  Vo = { get: As(!0, !1) },
  Zr = new WeakMap(),
  ei = new WeakMap(),
  ti = new WeakMap(),
  Do = new WeakMap();
function Uo(e) {
  switch (e) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function Bo(e) {
  return e.__v_skip || !Object.isExtensible(e) ? 0 : Uo(co(e));
}
function Cn(e) {
  return Ct(e) ? e : Rs(e, !1, Oo, Ho, Zr);
}
function ko(e) {
  return Rs(e, !1, Io, jo, ei);
}
function xn(e) {
  return Rs(e, !0, Lo, Vo, ti);
}
function Rs(e, t, n, s, r) {
  if (!Z(e) || (e.__v_raw && !(t && e.__v_isReactive))) return e;
  const i = r.get(e);
  if (i) return i;
  const o = Bo(e);
  if (o === 0) return e;
  const l = new Proxy(e, o === 2 ? s : n);
  return r.set(e, l), l;
}
function bt(e) {
  return Ct(e) ? bt(e.__v_raw) : !!(e && e.__v_isReactive);
}
function Ct(e) {
  return !!(e && e.__v_isReadonly);
}
function dn(e) {
  return !!(e && e.__v_isShallow);
}
function ni(e) {
  return bt(e) || Ct(e);
}
function Y(e) {
  const t = e && e.__v_raw;
  return t ? Y(t) : e;
}
function Lt(e) {
  return Object.isExtensible(e) && un(e, "__v_skip", !0), e;
}
const Ht = (e) => (Z(e) ? Cn(e) : e),
  Os = (e) => (Z(e) ? xn(e) : e);
class si {
  constructor(t, n, s, r) {
    (this.getter = t),
      (this._setter = n),
      (this.dep = void 0),
      (this.__v_isRef = !0),
      (this.__v_isReadonly = !1),
      (this.effect = new Cs(
        () => t(this._value),
        () => It(this, this.effect._dirtyLevel === 2 ? 2 : 3),
      )),
      (this.effect.computed = this),
      (this.effect.active = this._cacheable = !r),
      (this.__v_isReadonly = s);
  }
  get value() {
    const t = Y(this);
    return (
      (!t._cacheable || t.effect.dirty) && Qe(t._value, (t._value = t.effect.run())) && It(t, 4),
      Ls(t),
      t.effect._dirtyLevel >= 2 && It(t, 2),
      t._value
    );
  }
  set value(t) {
    this._setter(t);
  }
  get _dirty() {
    return this.effect.dirty;
  }
  set _dirty(t) {
    this.effect.dirty = t;
  }
}
function Ko(e, t, n = !1) {
  let s, r;
  const i = K(e);
  return i ? ((s = e), (r = xe)) : ((s = e.get), (r = e.set)), new si(s, r, i || !r, n);
}
function Ls(e) {
  var t;
  Xe &&
    ot &&
    ((e = Y(e)),
    Gr(
      ot,
      (t = e.dep) != null ? t : (e.dep = Xr(() => (e.dep = void 0), e instanceof si ? e : void 0)),
    ));
}
function It(e, t = 4, n) {
  e = Y(e);
  const s = e.dep;
  s && zr(s, t);
}
function he(e) {
  return !!(e && e.__v_isRef === !0);
}
function fe(e) {
  return ii(e, !1);
}
function ri(e) {
  return ii(e, !0);
}
function ii(e, t) {
  return he(e) ? e : new Wo(e, t);
}
class Wo {
  constructor(t, n) {
    (this.__v_isShallow = n),
      (this.dep = void 0),
      (this.__v_isRef = !0),
      (this._rawValue = n ? t : Y(t)),
      (this._value = n ? t : Ht(t));
  }
  get value() {
    return Ls(this), this._value;
  }
  set value(t) {
    const n = this.__v_isShallow || dn(t) || Ct(t);
    (t = n ? t : Y(t)),
      Qe(t, this._rawValue) && ((this._rawValue = t), (this._value = n ? t : Ht(t)), It(this, 4));
  }
}
function oi(e) {
  return he(e) ? e.value : e;
}
const qo = {
  get: (e, t, n) => oi(Reflect.get(e, t, n)),
  set: (e, t, n, s) => {
    const r = e[t];
    return he(r) && !he(n) ? ((r.value = n), !0) : Reflect.set(e, t, n, s);
  },
};
function li(e) {
  return bt(e) ? e : new Proxy(e, qo);
}
class Go {
  constructor(t) {
    (this.dep = void 0), (this.__v_isRef = !0);
    const { get: n, set: s } = t(
      () => Ls(this),
      () => It(this),
    );
    (this._get = n), (this._set = s);
  }
  get value() {
    return this._get();
  }
  set value(t) {
    this._set(t);
  }
}
function zo(e) {
  return new Go(e);
}
class Xo {
  constructor(t, n, s) {
    (this._object = t), (this._key = n), (this._defaultValue = s), (this.__v_isRef = !0);
  }
  get value() {
    const t = this._object[this._key];
    return t === void 0 ? this._defaultValue : t;
  }
  set value(t) {
    this._object[this._key] = t;
  }
  get dep() {
    return xo(Y(this._object), this._key);
  }
}
class Yo {
  constructor(t) {
    (this._getter = t), (this.__v_isRef = !0), (this.__v_isReadonly = !0);
  }
  get value() {
    return this._getter();
  }
}
function Jo(e, t, n) {
  return he(e) ? e : K(e) ? new Yo(e) : Z(e) && arguments.length > 1 ? Qo(e, t, n) : fe(e);
}
function Qo(e, t, n) {
  const s = e[t];
  return he(s) ? s : new Xo(e, t, n);
}
/**
 * @vue/runtime-core v3.4.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ function Ye(e, t, n, s) {
  try {
    return s ? e(...s) : e();
  } catch (r) {
    Sn(r, t, n);
  }
}
function Se(e, t, n, s) {
  if (K(e)) {
    const i = Ye(e, t, n, s);
    return (
      i &&
        jr(i) &&
        i.catch((o) => {
          Sn(o, t, n);
        }),
      i
    );
  }
  const r = [];
  for (let i = 0; i < e.length; i++) r.push(Se(e[i], t, n, s));
  return r;
}
function Sn(e, t, n, s = !0) {
  const r = t ? t.vnode : null;
  if (t) {
    let i = t.parent;
    const o = t.proxy,
      l = `https://vuejs.org/error-reference/#runtime-${n}`;
    for (; i; ) {
      const u = i.ec;
      if (u) {
        for (let d = 0; d < u.length; d++) if (u[d](e, o, l) === !1) return;
      }
      i = i.parent;
    }
    const c = t.appContext.config.errorHandler;
    if (c) {
      Ye(c, null, 10, [e, o, l]);
      return;
    }
  }
  Zo(e, n, r, s);
}
function Zo(e, t, n, s = !0) {
  console.error(e);
}
let jt = !1,
  os = !1;
const ue = [];
let Pe = 0;
const vt = [];
let We = null,
  rt = 0;
const ci = Promise.resolve();
let Is = null;
function Tn(e) {
  const t = Is || ci;
  return e ? t.then(this ? e.bind(this) : e) : t;
}
function el(e) {
  let t = Pe + 1,
    n = ue.length;
  for (; t < n; ) {
    const s = (t + n) >>> 1,
      r = ue[s],
      i = Vt(r);
    i < e || (i === e && r.pre) ? (t = s + 1) : (n = s);
  }
  return t;
}
function Ps(e) {
  (!ue.length || !ue.includes(e, jt && e.allowRecurse ? Pe + 1 : Pe)) &&
    (e.id == null ? ue.push(e) : ue.splice(el(e.id), 0, e), ai());
}
function ai() {
  !jt && !os && ((os = !0), (Is = ci.then(ui)));
}
function tl(e) {
  const t = ue.indexOf(e);
  t > Pe && ue.splice(t, 1);
}
function nl(e) {
  B(e) ? vt.push(...e) : (!We || !We.includes(e, e.allowRecurse ? rt + 1 : rt)) && vt.push(e), ai();
}
function Zs(e, t, n = jt ? Pe + 1 : 0) {
  for (; n < ue.length; n++) {
    const s = ue[n];
    if (s && s.pre) {
      if (e && s.id !== e.uid) continue;
      ue.splice(n, 1), n--, s();
    }
  }
}
function hn(e) {
  if (vt.length) {
    const t = [...new Set(vt)].sort((n, s) => Vt(n) - Vt(s));
    if (((vt.length = 0), We)) {
      We.push(...t);
      return;
    }
    for (We = t, rt = 0; rt < We.length; rt++) We[rt]();
    (We = null), (rt = 0);
  }
}
const Vt = (e) => (e.id == null ? 1 / 0 : e.id),
  sl = (e, t) => {
    const n = Vt(e) - Vt(t);
    if (n === 0) {
      if (e.pre && !t.pre) return -1;
      if (t.pre && !e.pre) return 1;
    }
    return n;
  };
function ui(e) {
  (os = !1), (jt = !0), ue.sort(sl);
  try {
    for (Pe = 0; Pe < ue.length; Pe++) {
      const t = ue[Pe];
      t && t.active !== !1 && Ye(t, null, 14);
    }
  } finally {
    (Pe = 0), (ue.length = 0), hn(), (jt = !1), (Is = null), (ue.length || vt.length) && ui();
  }
}
function rl(e, t, ...n) {
  if (e.isUnmounted) return;
  const s = e.vnode.props || te;
  let r = n;
  const i = t.startsWith("update:"),
    o = i && t.slice(7);
  if (o && o in s) {
    const d = `${o === "modelValue" ? "model" : o}Modifiers`,
      { number: h, trim: p } = s[d] || te;
    p && (r = n.map((v) => (ne(v) ? v.trim() : v))), h && (r = n.map(fo));
  }
  let l,
    c = s[(l = on(t))] || s[(l = on(Me(t)))];
  !c && i && (c = s[(l = on(at(t)))]), c && Se(c, e, 6, r);
  const u = s[l + "Once"];
  if (u) {
    if (!e.emitted) e.emitted = {};
    else if (e.emitted[l]) return;
    (e.emitted[l] = !0), Se(u, e, 6, r);
  }
}
function fi(e, t, n = !1) {
  const s = t.emitsCache,
    r = s.get(e);
  if (r !== void 0) return r;
  const i = e.emits;
  let o = {},
    l = !1;
  if (!K(e)) {
    const c = (u) => {
      const d = fi(u, t, !0);
      d && ((l = !0), ie(o, d));
    };
    !n && t.mixins.length && t.mixins.forEach(c),
      e.extends && c(e.extends),
      e.mixins && e.mixins.forEach(c);
  }
  return !i && !l
    ? (Z(e) && s.set(e, null), null)
    : (B(i) ? i.forEach((c) => (o[c] = null)) : ie(o, i), Z(e) && s.set(e, o), o);
}
function An(e, t) {
  return !e || !Bt(t)
    ? !1
    : ((t = t.slice(2).replace(/Once$/, "")),
      X(e, t[0].toLowerCase() + t.slice(1)) || X(e, at(t)) || X(e, t));
}
let de = null,
  Rn = null;
function pn(e) {
  const t = de;
  return (de = e), (Rn = (e && e.type.__scopeId) || null), t;
}
function $a(e) {
  Rn = e;
}
function Ha() {
  Rn = null;
}
function il(e, t = de, n) {
  if (!t || e._n) return e;
  const s = (...r) => {
    s._d && fr(-1);
    const i = pn(t);
    let o;
    try {
      o = e(...r);
    } finally {
      pn(i), s._d && fr(1);
    }
    return o;
  };
  return (s._n = !0), (s._c = !0), (s._d = !0), s;
}
function Un(e) {
  const {
    type: t,
    vnode: n,
    proxy: s,
    withProxy: r,
    props: i,
    propsOptions: [o],
    slots: l,
    attrs: c,
    emit: u,
    render: d,
    renderCache: h,
    data: p,
    setupState: v,
    ctx: R,
    inheritAttrs: M,
  } = e;
  let V, q;
  const J = pn(e);
  try {
    if (n.shapeFlag & 4) {
      const _ = r || s,
        P = _;
      (V = Ae(d.call(P, _, h, i, v, p, R))), (q = c);
    } else {
      const _ = t;
      (V = Ae(_.length > 1 ? _(i, { attrs: c, slots: l, emit: u }) : _(i, null))),
        (q = t.props ? c : ol(c));
    }
  } catch (_) {
    (Ft.length = 0), Sn(_, e, 1), (V = ae(ve));
  }
  let m = V;
  if (q && M !== !1) {
    const _ = Object.keys(q),
      { shapeFlag: P } = m;
    _.length && P & 7 && (o && _.some(ys) && (q = ll(q, o)), (m = Ze(m, q)));
  }
  return (
    n.dirs && ((m = Ze(m)), (m.dirs = m.dirs ? m.dirs.concat(n.dirs) : n.dirs)),
    n.transition && (m.transition = n.transition),
    (V = m),
    pn(J),
    V
  );
}
const ol = (e) => {
    let t;
    for (const n in e) (n === "class" || n === "style" || Bt(n)) && ((t || (t = {}))[n] = e[n]);
    return t;
  },
  ll = (e, t) => {
    const n = {};
    for (const s in e) (!ys(s) || !(s.slice(9) in t)) && (n[s] = e[s]);
    return n;
  };
function cl(e, t, n) {
  const { props: s, children: r, component: i } = e,
    { props: o, children: l, patchFlag: c } = t,
    u = i.emitsOptions;
  if (t.dirs || t.transition) return !0;
  if (n && c >= 0) {
    if (c & 1024) return !0;
    if (c & 16) return s ? er(s, o, u) : !!o;
    if (c & 8) {
      const d = t.dynamicProps;
      for (let h = 0; h < d.length; h++) {
        const p = d[h];
        if (o[p] !== s[p] && !An(u, p)) return !0;
      }
    }
  } else
    return (r || l) && (!l || !l.$stable) ? !0 : s === o ? !1 : s ? (o ? er(s, o, u) : !0) : !!o;
  return !1;
}
function er(e, t, n) {
  const s = Object.keys(t);
  if (s.length !== Object.keys(e).length) return !0;
  for (let r = 0; r < s.length; r++) {
    const i = s[r];
    if (t[i] !== e[i] && !An(n, i)) return !0;
  }
  return !1;
}
function al({ vnode: e, parent: t }, n) {
  for (; t; ) {
    const s = t.subTree;
    if ((s.suspense && s.suspense.activeBranch === e && (s.el = e.el), s === e))
      ((e = t.vnode).el = n), (t = t.parent);
    else break;
  }
}
const Ms = "components";
function ja(e, t) {
  return hi(Ms, e, !0, t) || e;
}
const di = Symbol.for("v-ndc");
function Va(e) {
  return ne(e) ? hi(Ms, e, !1) || e : e || di;
}
function hi(e, t, n = !0, s = !1) {
  const r = de || ce;
  if (r) {
    const i = r.type;
    if (e === Ms) {
      const l = ic(i, !1);
      if (l && (l === t || l === Me(t) || l === wn(Me(t)))) return i;
    }
    const o = tr(r[e] || i[e], t) || tr(r.appContext[e], t);
    return !o && s ? i : o;
  }
}
function tr(e, t) {
  return e && (e[t] || e[Me(t)] || e[wn(Me(t))]);
}
const ul = (e) => e.__isSuspense;
function pi(e, t) {
  t && t.pendingBranch ? (B(e) ? t.effects.push(...e) : t.effects.push(e)) : nl(e);
}
const fl = Symbol.for("v-scx"),
  dl = () => Et(fl);
function gi(e, t) {
  return On(e, null, t);
}
function Da(e, t) {
  return On(e, null, { flush: "post" });
}
const Jt = {};
function je(e, t, n) {
  return On(e, t, n);
}
function On(e, t, { immediate: n, deep: s, flush: r, once: i, onTrack: o, onTrigger: l } = te) {
  if (t && i) {
    const L = t;
    t = (...D) => {
      L(...D), P();
    };
  }
  const c = ce,
    u = (L) => (s === !0 ? L : pt(L, s === !1 ? 1 : void 0));
  let d,
    h = !1,
    p = !1;
  if (
    (he(e)
      ? ((d = () => e.value), (h = dn(e)))
      : bt(e)
        ? ((d = () => u(e)), (h = !0))
        : B(e)
          ? ((p = !0),
            (h = e.some((L) => bt(L) || dn(L))),
            (d = () =>
              e.map((L) => {
                if (he(L)) return L.value;
                if (bt(L)) return u(L);
                if (K(L)) return Ye(L, c, 2);
              })))
          : K(e)
            ? t
              ? (d = () => Ye(e, c, 2))
              : (d = () => (v && v(), Se(e, c, 3, [R])))
            : (d = xe),
    t && s)
  ) {
    const L = d;
    d = () => pt(L());
  }
  let v,
    R = (L) => {
      v = m.onStop = () => {
        Ye(L, c, 4), (v = m.onStop = void 0);
      };
    },
    M;
  if (Fn)
    if (((R = xe), t ? n && Se(t, c, 3, [d(), p ? [] : void 0, R]) : d(), r === "sync")) {
      const L = dl();
      M = L.__watcherHandles || (L.__watcherHandles = []);
    } else return xe;
  let V = p ? new Array(e.length).fill(Jt) : Jt;
  const q = () => {
    if (!(!m.active || !m.dirty))
      if (t) {
        const L = m.run();
        (s || h || (p ? L.some((D, O) => Qe(D, V[O])) : Qe(L, V))) &&
          (v && v(), Se(t, c, 3, [L, V === Jt ? void 0 : p && V[0] === Jt ? [] : V, R]), (V = L));
      } else m.run();
  };
  q.allowRecurse = !!t;
  let J;
  r === "sync"
    ? (J = q)
    : r === "post"
      ? (J = () => ge(q, c && c.suspense))
      : ((q.pre = !0), c && (q.id = c.uid), (J = () => Ps(q)));
  const m = new Cs(d, xe, J),
    _ = Kr(),
    P = () => {
      m.stop(), _ && bs(_.effects, m);
    };
  return (
    t ? (n ? q() : (V = m.run())) : r === "post" ? ge(m.run.bind(m), c && c.suspense) : m.run(),
    M && M.push(P),
    P
  );
}
function hl(e, t, n) {
  const s = this.proxy,
    r = ne(e) ? (e.includes(".") ? mi(s, e) : () => s[e]) : e.bind(s, s);
  let i;
  K(t) ? (i = t) : ((i = t.handler), (n = t));
  const o = kt(this),
    l = On(r, i.bind(s), n);
  return o(), l;
}
function mi(e, t) {
  const n = t.split(".");
  return () => {
    let s = e;
    for (let r = 0; r < n.length && s; r++) s = s[n[r]];
    return s;
  };
}
function pt(e, t, n = 0, s) {
  if (!Z(e) || e.__v_skip) return e;
  if (t && t > 0) {
    if (n >= t) return e;
    n++;
  }
  if (((s = s || new Set()), s.has(e))) return e;
  if ((s.add(e), he(e))) pt(e.value, t, n, s);
  else if (B(e)) for (let r = 0; r < e.length; r++) pt(e[r], t, n, s);
  else if (Hr(e) || _t(e))
    e.forEach((r) => {
      pt(r, t, n, s);
    });
  else if (Dr(e)) for (const r in e) pt(e[r], t, n, s);
  return e;
}
function Ie(e, t, n, s) {
  const r = e.dirs,
    i = t && t.dirs;
  for (let o = 0; o < r.length; o++) {
    const l = r[o];
    i && (l.oldValue = i[o].value);
    let c = l.dir[s];
    c && (ut(), Se(c, n, 8, [e.el, l, e, t]), ft());
  }
}
const qe = Symbol("_leaveCb"),
  Qt = Symbol("_enterCb");
function pl() {
  const e = { isMounted: !1, isLeaving: !1, isUnmounting: !1, leavingVNodes: new Map() };
  return (
    Tt(() => {
      e.isMounted = !0;
    }),
    Ei(() => {
      e.isUnmounting = !0;
    }),
    e
  );
}
const we = [Function, Array],
  _i = {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: we,
    onEnter: we,
    onAfterEnter: we,
    onEnterCancelled: we,
    onBeforeLeave: we,
    onLeave: we,
    onAfterLeave: we,
    onLeaveCancelled: we,
    onBeforeAppear: we,
    onAppear: we,
    onAfterAppear: we,
    onAppearCancelled: we,
  },
  gl = {
    name: "BaseTransition",
    props: _i,
    setup(e, { slots: t }) {
      const n = Nn(),
        s = pl();
      return () => {
        const r = t.default && bi(t.default(), !0);
        if (!r || !r.length) return;
        let i = r[0];
        if (r.length > 1) {
          for (const p of r)
            if (p.type !== ve) {
              i = p;
              break;
            }
        }
        const o = Y(e),
          { mode: l } = o;
        if (s.isLeaving) return Bn(i);
        const c = nr(i);
        if (!c) return Bn(i);
        const u = ls(c, o, s, n);
        cs(c, u);
        const d = n.subTree,
          h = d && nr(d);
        if (h && h.type !== ve && !it(c, h)) {
          const p = ls(h, o, s, n);
          if ((cs(h, p), l === "out-in"))
            return (
              (s.isLeaving = !0),
              (p.afterLeave = () => {
                (s.isLeaving = !1), n.update.active !== !1 && ((n.effect.dirty = !0), n.update());
              }),
              Bn(i)
            );
          l === "in-out" &&
            c.type !== ve &&
            (p.delayLeave = (v, R, M) => {
              const V = yi(s, h);
              (V[String(h.key)] = h),
                (v[qe] = () => {
                  R(), (v[qe] = void 0), delete u.delayedLeave;
                }),
                (u.delayedLeave = M);
            });
        }
        return i;
      };
    },
  },
  ml = gl;
function yi(e, t) {
  const { leavingVNodes: n } = e;
  let s = n.get(t.type);
  return s || ((s = Object.create(null)), n.set(t.type, s)), s;
}
function ls(e, t, n, s) {
  const {
      appear: r,
      mode: i,
      persisted: o = !1,
      onBeforeEnter: l,
      onEnter: c,
      onAfterEnter: u,
      onEnterCancelled: d,
      onBeforeLeave: h,
      onLeave: p,
      onAfterLeave: v,
      onLeaveCancelled: R,
      onBeforeAppear: M,
      onAppear: V,
      onAfterAppear: q,
      onAppearCancelled: J,
    } = t,
    m = String(e.key),
    _ = yi(n, e),
    P = (O, j) => {
      O && Se(O, s, 9, j);
    },
    L = (O, j) => {
      const E = j[1];
      P(O, j), B(O) ? O.every((U) => U.length <= 1) && E() : O.length <= 1 && E();
    },
    D = {
      mode: i,
      persisted: o,
      beforeEnter(O) {
        let j = l;
        if (!n.isMounted)
          if (r) j = M || l;
          else return;
        O[qe] && O[qe](!0);
        const E = _[m];
        E && it(e, E) && E.el[qe] && E.el[qe](), P(j, [O]);
      },
      enter(O) {
        let j = c,
          E = u,
          U = d;
        if (!n.isMounted)
          if (r) (j = V || c), (E = q || u), (U = J || d);
          else return;
        let S = !1;
        const W = (O[Qt] = (re) => {
          S ||
            ((S = !0),
            re ? P(U, [O]) : P(E, [O]),
            D.delayedLeave && D.delayedLeave(),
            (O[Qt] = void 0));
        });
        j ? L(j, [O, W]) : W();
      },
      leave(O, j) {
        const E = String(e.key);
        if ((O[Qt] && O[Qt](!0), n.isUnmounting)) return j();
        P(h, [O]);
        let U = !1;
        const S = (O[qe] = (W) => {
          U ||
            ((U = !0), j(), W ? P(R, [O]) : P(v, [O]), (O[qe] = void 0), _[E] === e && delete _[E]);
        });
        (_[E] = e), p ? L(p, [O, S]) : S();
      },
      clone(O) {
        return ls(O, t, n, s);
      },
    };
  return D;
}
function Bn(e) {
  if (Ln(e)) return (e = Ze(e)), (e.children = null), e;
}
function nr(e) {
  return Ln(e) ? (e.children ? e.children[0] : void 0) : e;
}
function cs(e, t) {
  e.shapeFlag & 6 && e.component
    ? cs(e.component.subTree, t)
    : e.shapeFlag & 128
      ? ((e.ssContent.transition = t.clone(e.ssContent)),
        (e.ssFallback.transition = t.clone(e.ssFallback)))
      : (e.transition = t);
}
function bi(e, t = !1, n) {
  let s = [],
    r = 0;
  for (let i = 0; i < e.length; i++) {
    let o = e[i];
    const l = n == null ? o.key : String(n) + String(o.key != null ? o.key : i);
    o.type === me
      ? (o.patchFlag & 128 && r++, (s = s.concat(bi(o.children, t, l))))
      : (t || o.type !== ve) && s.push(l != null ? Ze(o, { key: l }) : o);
  }
  if (r > 1) for (let i = 0; i < s.length; i++) s[i].patchFlag = -2;
  return s;
}
/*! #__NO_SIDE_EFFECTS__ */ function vi(e, t) {
  return K(e) ? ie({ name: e.name }, t, { setup: e }) : e;
}
const wt = (e) => !!e.type.__asyncLoader,
  Ln = (e) => e.type.__isKeepAlive;
function _l(e, t) {
  wi(e, "a", t);
}
function yl(e, t) {
  wi(e, "da", t);
}
function wi(e, t, n = ce) {
  const s =
    e.__wdc ||
    (e.__wdc = () => {
      let r = n;
      for (; r; ) {
        if (r.isDeactivated) return;
        r = r.parent;
      }
      return e();
    });
  if ((In(t, s, n), n)) {
    let r = n.parent;
    for (; r && r.parent; ) Ln(r.parent.vnode) && bl(s, t, n, r), (r = r.parent);
  }
}
function bl(e, t, n, s) {
  const r = In(t, e, s, !0);
  Pn(() => {
    bs(s[t], r);
  }, n);
}
function In(e, t, n = ce, s = !1) {
  if (n) {
    const r = n[e] || (n[e] = []),
      i =
        t.__weh ||
        (t.__weh = (...o) => {
          if (n.isUnmounted) return;
          ut();
          const l = kt(n),
            c = Se(t, n, e, o);
          return l(), ft(), c;
        });
    return s ? r.unshift(i) : r.push(i), i;
  }
}
const De =
    (e) =>
    (t, n = ce) =>
      (!Fn || e === "sp") && In(e, (...s) => t(...s), n),
  vl = De("bm"),
  Tt = De("m"),
  wl = De("bu"),
  El = De("u"),
  Ei = De("bum"),
  Pn = De("um"),
  Cl = De("sp"),
  xl = De("rtg"),
  Sl = De("rtc");
function Tl(e, t = ce) {
  In("ec", e, t);
}
function Ua(e, t, n, s) {
  let r;
  const i = n && n[s];
  if (B(e) || ne(e)) {
    r = new Array(e.length);
    for (let o = 0, l = e.length; o < l; o++) r[o] = t(e[o], o, void 0, i && i[o]);
  } else if (typeof e == "number") {
    r = new Array(e);
    for (let o = 0; o < e; o++) r[o] = t(o + 1, o, void 0, i && i[o]);
  } else if (Z(e))
    if (e[Symbol.iterator]) r = Array.from(e, (o, l) => t(o, l, void 0, i && i[l]));
    else {
      const o = Object.keys(e);
      r = new Array(o.length);
      for (let l = 0, c = o.length; l < c; l++) {
        const u = o[l];
        r[l] = t(e[u], u, l, i && i[l]);
      }
    }
  else r = [];
  return n && (n[s] = r), r;
}
function Ba(e, t, n = {}, s, r) {
  if (de.isCE || (de.parent && wt(de.parent) && de.parent.isCE))
    return t !== "default" && (n.name = t), ae("slot", n, s && s());
  let i = e[t];
  i && i._c && (i._d = !1), Ni();
  const o = i && Ci(i(n)),
    l = $i(
      me,
      { key: n.key || (o && o.key) || `_${t}` },
      o || (s ? s() : []),
      o && e._ === 1 ? 64 : -2,
    );
  return !r && l.scopeId && (l.slotScopeIds = [l.scopeId + "-s"]), i && i._c && (i._d = !0), l;
}
function Ci(e) {
  return e.some((t) => (_n(t) ? !(t.type === ve || (t.type === me && !Ci(t.children))) : !0))
    ? e
    : null;
}
function ka(e, t) {
  const n = {};
  for (const s in e) n[t && /[A-Z]/.test(s) ? `on:${s}` : on(s)] = e[s];
  return n;
}
const as = (e) => (e ? (Di(e) ? Hs(e) || e.proxy : as(e.parent)) : null),
  Pt = ie(Object.create(null), {
    $: (e) => e,
    $el: (e) => e.vnode.el,
    $data: (e) => e.data,
    $props: (e) => e.props,
    $attrs: (e) => e.attrs,
    $slots: (e) => e.slots,
    $refs: (e) => e.refs,
    $parent: (e) => as(e.parent),
    $root: (e) => as(e.root),
    $emit: (e) => e.emit,
    $options: (e) => Ns(e),
    $forceUpdate: (e) =>
      e.f ||
      (e.f = () => {
        (e.effect.dirty = !0), Ps(e.update);
      }),
    $nextTick: (e) => e.n || (e.n = Tn.bind(e.proxy)),
    $watch: (e) => hl.bind(e),
  }),
  kn = (e, t) => e !== te && !e.__isScriptSetup && X(e, t),
  Al = {
    get({ _: e }, t) {
      const {
        ctx: n,
        setupState: s,
        data: r,
        props: i,
        accessCache: o,
        type: l,
        appContext: c,
      } = e;
      let u;
      if (t[0] !== "$") {
        const v = o[t];
        if (v !== void 0)
          switch (v) {
            case 1:
              return s[t];
            case 2:
              return r[t];
            case 4:
              return n[t];
            case 3:
              return i[t];
          }
        else {
          if (kn(s, t)) return (o[t] = 1), s[t];
          if (r !== te && X(r, t)) return (o[t] = 2), r[t];
          if ((u = e.propsOptions[0]) && X(u, t)) return (o[t] = 3), i[t];
          if (n !== te && X(n, t)) return (o[t] = 4), n[t];
          us && (o[t] = 0);
        }
      }
      const d = Pt[t];
      let h, p;
      if (d) return t === "$attrs" && _e(e, "get", t), d(e);
      if ((h = l.__cssModules) && (h = h[t])) return h;
      if (n !== te && X(n, t)) return (o[t] = 4), n[t];
      if (((p = c.config.globalProperties), X(p, t))) return p[t];
    },
    set({ _: e }, t, n) {
      const { data: s, setupState: r, ctx: i } = e;
      return kn(r, t)
        ? ((r[t] = n), !0)
        : s !== te && X(s, t)
          ? ((s[t] = n), !0)
          : X(e.props, t) || (t[0] === "$" && t.slice(1) in e)
            ? !1
            : ((i[t] = n), !0);
    },
    has(
      { _: { data: e, setupState: t, accessCache: n, ctx: s, appContext: r, propsOptions: i } },
      o,
    ) {
      let l;
      return (
        !!n[o] ||
        (e !== te && X(e, o)) ||
        kn(t, o) ||
        ((l = i[0]) && X(l, o)) ||
        X(s, o) ||
        X(Pt, o) ||
        X(r.config.globalProperties, o)
      );
    },
    defineProperty(e, t, n) {
      return (
        n.get != null ? (e._.accessCache[t] = 0) : X(n, "value") && this.set(e, t, n.value, null),
        Reflect.defineProperty(e, t, n)
      );
    },
  };
function Ka() {
  return Rl().slots;
}
function Rl() {
  const e = Nn();
  return e.setupContext || (e.setupContext = Bi(e));
}
function sr(e) {
  return B(e) ? e.reduce((t, n) => ((t[n] = null), t), {}) : e;
}
let us = !0;
function Ol(e) {
  const t = Ns(e),
    n = e.proxy,
    s = e.ctx;
  (us = !1), t.beforeCreate && rr(t.beforeCreate, e, "bc");
  const {
    data: r,
    computed: i,
    methods: o,
    watch: l,
    provide: c,
    inject: u,
    created: d,
    beforeMount: h,
    mounted: p,
    beforeUpdate: v,
    updated: R,
    activated: M,
    deactivated: V,
    beforeDestroy: q,
    beforeUnmount: J,
    destroyed: m,
    unmounted: _,
    render: P,
    renderTracked: L,
    renderTriggered: D,
    errorCaptured: O,
    serverPrefetch: j,
    expose: E,
    inheritAttrs: U,
    components: S,
    directives: W,
    filters: re,
  } = t;
  if ((u && Ll(u, s, null), o))
    for (const z in o) {
      const F = o[z];
      K(F) && (s[z] = F.bind(n));
    }
  if (r) {
    const z = r.call(n, n);
    Z(z) && (e.data = Cn(z));
  }
  if (((us = !0), i))
    for (const z in i) {
      const F = i[z],
        Fe = K(F) ? F.bind(n, n) : K(F.get) ? F.get.bind(n, n) : xe,
        Kt = !K(F) && K(F.set) ? F.set.bind(n) : xe,
        et = se({ get: Fe, set: Kt });
      Object.defineProperty(s, z, {
        enumerable: !0,
        configurable: !0,
        get: () => et.value,
        set: (Oe) => (et.value = Oe),
      });
    }
  if (l) for (const z in l) xi(l[z], s, n, z);
  if (c) {
    const z = K(c) ? c.call(n) : c;
    Reflect.ownKeys(z).forEach((F) => {
      $l(F, z[F]);
    });
  }
  d && rr(d, e, "c");
  function $(z, F) {
    B(F) ? F.forEach((Fe) => z(Fe.bind(n))) : F && z(F.bind(n));
  }
  if (
    ($(vl, h),
    $(Tt, p),
    $(wl, v),
    $(El, R),
    $(_l, M),
    $(yl, V),
    $(Tl, O),
    $(Sl, L),
    $(xl, D),
    $(Ei, J),
    $(Pn, _),
    $(Cl, j),
    B(E))
  )
    if (E.length) {
      const z = e.exposed || (e.exposed = {});
      E.forEach((F) => {
        Object.defineProperty(z, F, { get: () => n[F], set: (Fe) => (n[F] = Fe) });
      });
    } else e.exposed || (e.exposed = {});
  P && e.render === xe && (e.render = P),
    U != null && (e.inheritAttrs = U),
    S && (e.components = S),
    W && (e.directives = W);
}
function Ll(e, t, n = xe) {
  B(e) && (e = fs(e));
  for (const s in e) {
    const r = e[s];
    let i;
    Z(r)
      ? "default" in r
        ? (i = Et(r.from || s, r.default, !0))
        : (i = Et(r.from || s))
      : (i = Et(r)),
      he(i)
        ? Object.defineProperty(t, s, {
            enumerable: !0,
            configurable: !0,
            get: () => i.value,
            set: (o) => (i.value = o),
          })
        : (t[s] = i);
  }
}
function rr(e, t, n) {
  Se(B(e) ? e.map((s) => s.bind(t.proxy)) : e.bind(t.proxy), t, n);
}
function xi(e, t, n, s) {
  const r = s.includes(".") ? mi(n, s) : () => n[s];
  if (ne(e)) {
    const i = t[e];
    K(i) && je(r, i);
  } else if (K(e)) je(r, e.bind(n));
  else if (Z(e))
    if (B(e)) e.forEach((i) => xi(i, t, n, s));
    else {
      const i = K(e.handler) ? e.handler.bind(n) : t[e.handler];
      K(i) && je(r, i, e);
    }
}
function Ns(e) {
  const t = e.type,
    { mixins: n, extends: s } = t,
    {
      mixins: r,
      optionsCache: i,
      config: { optionMergeStrategies: o },
    } = e.appContext,
    l = i.get(t);
  let c;
  return (
    l
      ? (c = l)
      : !r.length && !n && !s
        ? (c = t)
        : ((c = {}), r.length && r.forEach((u) => gn(c, u, o, !0)), gn(c, t, o)),
    Z(t) && i.set(t, c),
    c
  );
}
function gn(e, t, n, s = !1) {
  const { mixins: r, extends: i } = t;
  i && gn(e, i, n, !0), r && r.forEach((o) => gn(e, o, n, !0));
  for (const o in t)
    if (!(s && o === "expose")) {
      const l = Il[o] || (n && n[o]);
      e[o] = l ? l(e[o], t[o]) : t[o];
    }
  return e;
}
const Il = {
  data: ir,
  props: or,
  emits: or,
  methods: Ot,
  computed: Ot,
  beforeCreate: pe,
  created: pe,
  beforeMount: pe,
  mounted: pe,
  beforeUpdate: pe,
  updated: pe,
  beforeDestroy: pe,
  beforeUnmount: pe,
  destroyed: pe,
  unmounted: pe,
  activated: pe,
  deactivated: pe,
  errorCaptured: pe,
  serverPrefetch: pe,
  components: Ot,
  directives: Ot,
  watch: Ml,
  provide: ir,
  inject: Pl,
};
function ir(e, t) {
  return t
    ? e
      ? function () {
          return ie(K(e) ? e.call(this, this) : e, K(t) ? t.call(this, this) : t);
        }
      : t
    : e;
}
function Pl(e, t) {
  return Ot(fs(e), fs(t));
}
function fs(e) {
  if (B(e)) {
    const t = {};
    for (let n = 0; n < e.length; n++) t[e[n]] = e[n];
    return t;
  }
  return e;
}
function pe(e, t) {
  return e ? [...new Set([].concat(e, t))] : t;
}
function Ot(e, t) {
  return e ? ie(Object.create(null), e, t) : t;
}
function or(e, t) {
  return e
    ? B(e) && B(t)
      ? [...new Set([...e, ...t])]
      : ie(Object.create(null), sr(e), sr(t ?? {}))
    : t;
}
function Ml(e, t) {
  if (!e) return t;
  if (!t) return e;
  const n = ie(Object.create(null), e);
  for (const s in t) n[s] = pe(e[s], t[s]);
  return n;
}
function Si() {
  return {
    app: null,
    config: {
      isNativeTag: oo,
      performance: !1,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {},
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap(),
  };
}
let Nl = 0;
function Fl(e, t) {
  return function (s, r = null) {
    K(s) || (s = ie({}, s)), r != null && !Z(r) && (r = null);
    const i = Si(),
      o = new WeakSet();
    let l = !1;
    const c = (i.app = {
      _uid: Nl++,
      _component: s,
      _props: r,
      _container: null,
      _context: i,
      _instance: null,
      version: lc,
      get config() {
        return i.config;
      },
      set config(u) {},
      use(u, ...d) {
        return (
          o.has(u) ||
            (u && K(u.install) ? (o.add(u), u.install(c, ...d)) : K(u) && (o.add(u), u(c, ...d))),
          c
        );
      },
      mixin(u) {
        return i.mixins.includes(u) || i.mixins.push(u), c;
      },
      component(u, d) {
        return d ? ((i.components[u] = d), c) : i.components[u];
      },
      directive(u, d) {
        return d ? ((i.directives[u] = d), c) : i.directives[u];
      },
      mount(u, d, h) {
        if (!l) {
          const p = ae(s, r);
          return (
            (p.appContext = i),
            h === !0 ? (h = "svg") : h === !1 && (h = void 0),
            d && t ? t(p, u) : e(p, u, h),
            (l = !0),
            (c._container = u),
            (u.__vue_app__ = c),
            Hs(p.component) || p.component.proxy
          );
        }
      },
      unmount() {
        l && (e(null, c._container), delete c._container.__vue_app__);
      },
      provide(u, d) {
        return (i.provides[u] = d), c;
      },
      runWithContext(u) {
        const d = Mt;
        Mt = c;
        try {
          return u();
        } finally {
          Mt = d;
        }
      },
    });
    return c;
  };
}
let Mt = null;
function $l(e, t) {
  if (ce) {
    let n = ce.provides;
    const s = ce.parent && ce.parent.provides;
    s === n && (n = ce.provides = Object.create(s)), (n[e] = t);
  }
}
function Et(e, t, n = !1) {
  const s = ce || de;
  if (s || Mt) {
    const r = s
      ? s.parent == null
        ? s.vnode.appContext && s.vnode.appContext.provides
        : s.parent.provides
      : Mt._context.provides;
    if (r && e in r) return r[e];
    if (arguments.length > 1) return n && K(t) ? t.call(s && s.proxy) : t;
  }
}
function Hl(e, t, n, s = !1) {
  const r = {},
    i = {};
  un(i, Mn, 1), (e.propsDefaults = Object.create(null)), Ti(e, t, r, i);
  for (const o in e.propsOptions[0]) o in r || (r[o] = void 0);
  n ? (e.props = s ? r : ko(r)) : e.type.props ? (e.props = r) : (e.props = i), (e.attrs = i);
}
function jl(e, t, n, s) {
  const {
      props: r,
      attrs: i,
      vnode: { patchFlag: o },
    } = e,
    l = Y(r),
    [c] = e.propsOptions;
  let u = !1;
  if ((s || o > 0) && !(o & 16)) {
    if (o & 8) {
      const d = e.vnode.dynamicProps;
      for (let h = 0; h < d.length; h++) {
        let p = d[h];
        if (An(e.emitsOptions, p)) continue;
        const v = t[p];
        if (c)
          if (X(i, p)) v !== i[p] && ((i[p] = v), (u = !0));
          else {
            const R = Me(p);
            r[R] = ds(c, l, R, v, e, !1);
          }
        else v !== i[p] && ((i[p] = v), (u = !0));
      }
    }
  } else {
    Ti(e, t, r, i) && (u = !0);
    let d;
    for (const h in l)
      (!t || (!X(t, h) && ((d = at(h)) === h || !X(t, d)))) &&
        (c
          ? n && (n[h] !== void 0 || n[d] !== void 0) && (r[h] = ds(c, l, h, void 0, e, !0))
          : delete r[h]);
    if (i !== l) for (const h in i) (!t || !X(t, h)) && (delete i[h], (u = !0));
  }
  u && He(e, "set", "$attrs");
}
function Ti(e, t, n, s) {
  const [r, i] = e.propsOptions;
  let o = !1,
    l;
  if (t)
    for (let c in t) {
      if (yt(c)) continue;
      const u = t[c];
      let d;
      r && X(r, (d = Me(c)))
        ? !i || !i.includes(d)
          ? (n[d] = u)
          : ((l || (l = {}))[d] = u)
        : An(e.emitsOptions, c) || ((!(c in s) || u !== s[c]) && ((s[c] = u), (o = !0)));
    }
  if (i) {
    const c = Y(n),
      u = l || te;
    for (let d = 0; d < i.length; d++) {
      const h = i[d];
      n[h] = ds(r, c, h, u[h], e, !X(u, h));
    }
  }
  return o;
}
function ds(e, t, n, s, r, i) {
  const o = e[n];
  if (o != null) {
    const l = X(o, "default");
    if (l && s === void 0) {
      const c = o.default;
      if (o.type !== Function && !o.skipFactory && K(c)) {
        const { propsDefaults: u } = r;
        if (n in u) s = u[n];
        else {
          const d = kt(r);
          (s = u[n] = c.call(null, t)), d();
        }
      } else s = c;
    }
    o[0] && (i && !l ? (s = !1) : o[1] && (s === "" || s === at(n)) && (s = !0));
  }
  return s;
}
function Ai(e, t, n = !1) {
  const s = t.propsCache,
    r = s.get(e);
  if (r) return r;
  const i = e.props,
    o = {},
    l = [];
  let c = !1;
  if (!K(e)) {
    const d = (h) => {
      c = !0;
      const [p, v] = Ai(h, t, !0);
      ie(o, p), v && l.push(...v);
    };
    !n && t.mixins.length && t.mixins.forEach(d),
      e.extends && d(e.extends),
      e.mixins && e.mixins.forEach(d);
  }
  if (!i && !c) return Z(e) && s.set(e, mt), mt;
  if (B(i))
    for (let d = 0; d < i.length; d++) {
      const h = Me(i[d]);
      lr(h) && (o[h] = te);
    }
  else if (i)
    for (const d in i) {
      const h = Me(d);
      if (lr(h)) {
        const p = i[d],
          v = (o[h] = B(p) || K(p) ? { type: p } : ie({}, p));
        if (v) {
          const R = ur(Boolean, v.type),
            M = ur(String, v.type);
          (v[0] = R > -1), (v[1] = M < 0 || R < M), (R > -1 || X(v, "default")) && l.push(h);
        }
      }
    }
  const u = [o, l];
  return Z(e) && s.set(e, u), u;
}
function lr(e) {
  return e[0] !== "$" && !yt(e);
}
function cr(e) {
  return e === null
    ? "null"
    : typeof e == "function"
      ? e.name || ""
      : (typeof e == "object" && e.constructor && e.constructor.name) || "";
}
function ar(e, t) {
  return cr(e) === cr(t);
}
function ur(e, t) {
  return B(t) ? t.findIndex((n) => ar(n, e)) : K(t) && ar(t, e) ? 0 : -1;
}
const Ri = (e) => e[0] === "_" || e === "$stable",
  Fs = (e) => (B(e) ? e.map(Ae) : [Ae(e)]),
  Vl = (e, t, n) => {
    if (t._n) return t;
    const s = il((...r) => Fs(t(...r)), n);
    return (s._c = !1), s;
  },
  Oi = (e, t, n) => {
    const s = e._ctx;
    for (const r in e) {
      if (Ri(r)) continue;
      const i = e[r];
      if (K(i)) t[r] = Vl(r, i, s);
      else if (i != null) {
        const o = Fs(i);
        t[r] = () => o;
      }
    }
  },
  Li = (e, t) => {
    const n = Fs(t);
    e.slots.default = () => n;
  },
  Dl = (e, t) => {
    if (e.vnode.shapeFlag & 32) {
      const n = t._;
      n ? ((e.slots = Y(t)), un(t, "_", n)) : Oi(t, (e.slots = {}));
    } else (e.slots = {}), t && Li(e, t);
    un(e.slots, Mn, 1);
  },
  Ul = (e, t, n) => {
    const { vnode: s, slots: r } = e;
    let i = !0,
      o = te;
    if (s.shapeFlag & 32) {
      const l = t._;
      l
        ? n && l === 1
          ? (i = !1)
          : (ie(r, t), !n && l === 1 && delete r._)
        : ((i = !t.$stable), Oi(t, r)),
        (o = t);
    } else t && (Li(e, t), (o = { default: 1 }));
    if (i) for (const l in r) !Ri(l) && o[l] == null && delete r[l];
  };
function mn(e, t, n, s, r = !1) {
  if (B(e)) {
    e.forEach((p, v) => mn(p, t && (B(t) ? t[v] : t), n, s, r));
    return;
  }
  if (wt(s) && !r) return;
  const i = s.shapeFlag & 4 ? Hs(s.component) || s.component.proxy : s.el,
    o = r ? null : i,
    { i: l, r: c } = e,
    u = t && t.r,
    d = l.refs === te ? (l.refs = {}) : l.refs,
    h = l.setupState;
  if (
    (u != null &&
      u !== c &&
      (ne(u) ? ((d[u] = null), X(h, u) && (h[u] = null)) : he(u) && (u.value = null)),
    K(c))
  )
    Ye(c, l, 12, [o, d]);
  else {
    const p = ne(c),
      v = he(c);
    if (p || v) {
      const R = () => {
        if (e.f) {
          const M = p ? (X(h, c) ? h[c] : d[c]) : c.value;
          r
            ? B(M) && bs(M, i)
            : B(M)
              ? M.includes(i) || M.push(i)
              : p
                ? ((d[c] = [i]), X(h, c) && (h[c] = d[c]))
                : ((c.value = [i]), e.k && (d[e.k] = c.value));
        } else p ? ((d[c] = o), X(h, c) && (h[c] = o)) : v && ((c.value = o), e.k && (d[e.k] = o));
      };
      o ? ((R.id = -1), ge(R, n)) : R();
    }
  }
}
let Be = !1;
const Bl = (e) => e.namespaceURI.includes("svg") && e.tagName !== "foreignObject",
  kl = (e) => e.namespaceURI.includes("MathML"),
  Zt = (e) => {
    if (Bl(e)) return "svg";
    if (kl(e)) return "mathml";
  },
  en = (e) => e.nodeType === 8;
function Kl(e) {
  const {
      mt: t,
      p: n,
      o: {
        patchProp: s,
        createText: r,
        nextSibling: i,
        parentNode: o,
        remove: l,
        insert: c,
        createComment: u,
      },
    } = e,
    d = (m, _) => {
      if (!_.hasChildNodes()) {
        n(null, m, _), hn(), (_._vnode = m);
        return;
      }
      (Be = !1),
        h(_.firstChild, m, null, null, null),
        hn(),
        (_._vnode = m),
        Be && console.error("Hydration completed but contains mismatches.");
    },
    h = (m, _, P, L, D, O = !1) => {
      const j = en(m) && m.data === "[",
        E = () => M(m, _, P, L, D, j),
        { type: U, ref: S, shapeFlag: W, patchFlag: re } = _;
      let le = m.nodeType;
      (_.el = m), re === -2 && ((O = !1), (_.dynamicChildren = null));
      let $ = null;
      switch (U) {
        case xt:
          le !== 3
            ? _.children === ""
              ? (c((_.el = r("")), o(m), m), ($ = m))
              : ($ = E())
            : (m.data !== _.children && ((Be = !0), (m.data = _.children)), ($ = i(m)));
          break;
        case ve:
          J(m)
            ? (($ = i(m)), q((_.el = m.content.firstChild), m, P))
            : le !== 8 || j
              ? ($ = E())
              : ($ = i(m));
          break;
        case Nt:
          if ((j && ((m = i(m)), (le = m.nodeType)), le === 1 || le === 3)) {
            $ = m;
            const z = !_.children.length;
            for (let F = 0; F < _.staticCount; F++)
              z && (_.children += $.nodeType === 1 ? $.outerHTML : $.data),
                F === _.staticCount - 1 && (_.anchor = $),
                ($ = i($));
            return j ? i($) : $;
          } else E();
          break;
        case me:
          j ? ($ = R(m, _, P, L, D, O)) : ($ = E());
          break;
        default:
          if (W & 1)
            (le !== 1 || _.type.toLowerCase() !== m.tagName.toLowerCase()) && !J(m)
              ? ($ = E())
              : ($ = p(m, _, P, L, D, O));
          else if (W & 6) {
            _.slotScopeIds = D;
            const z = o(m);
            if (
              (j
                ? ($ = V(m))
                : en(m) && m.data === "teleport start"
                  ? ($ = V(m, m.data, "teleport end"))
                  : ($ = i(m)),
              t(_, z, null, P, L, Zt(z), O),
              wt(_))
            ) {
              let F;
              j
                ? ((F = ae(me)), (F.anchor = $ ? $.previousSibling : z.lastChild))
                : (F = m.nodeType === 3 ? Vi("") : ae("div")),
                (F.el = m),
                (_.component.subTree = F);
            }
          } else
            W & 64
              ? le !== 8
                ? ($ = E())
                : ($ = _.type.hydrate(m, _, P, L, D, O, e, v))
              : W & 128 && ($ = _.type.hydrate(m, _, P, L, Zt(o(m)), D, O, e, h));
      }
      return S != null && mn(S, null, L, _), $;
    },
    p = (m, _, P, L, D, O) => {
      O = O || !!_.dynamicChildren;
      const { type: j, props: E, patchFlag: U, shapeFlag: S, dirs: W, transition: re } = _,
        le = j === "input" || j === "option";
      if (le || U !== -1) {
        W && Ie(_, null, P, "created");
        let $ = !1;
        if (J(m)) {
          $ = Ii(L, re) && P && P.vnode.props && P.vnode.props.appear;
          const F = m.content.firstChild;
          $ && re.beforeEnter(F), q(F, m, P), (_.el = m = F);
        }
        if (S & 16 && !(E && (E.innerHTML || E.textContent))) {
          let F = v(m.firstChild, _, m, P, L, D, O);
          for (; F; ) {
            Be = !0;
            const Fe = F;
            (F = F.nextSibling), l(Fe);
          }
        } else S & 8 && m.textContent !== _.children && ((Be = !0), (m.textContent = _.children));
        if (E)
          if (le || !O || U & 48)
            for (const F in E)
              ((le && (F.endsWith("value") || F === "indeterminate")) ||
                (Bt(F) && !yt(F)) ||
                F[0] === ".") &&
                s(m, F, null, E[F], void 0, void 0, P);
          else E.onClick && s(m, "onClick", null, E.onClick, void 0, void 0, P);
        let z;
        (z = E && E.onVnodeBeforeMount) && Ee(z, P, _),
          W && Ie(_, null, P, "beforeMount"),
          ((z = E && E.onVnodeMounted) || W || $) &&
            pi(() => {
              z && Ee(z, P, _), $ && re.enter(m), W && Ie(_, null, P, "mounted");
            }, L);
      }
      return m.nextSibling;
    },
    v = (m, _, P, L, D, O, j) => {
      j = j || !!_.dynamicChildren;
      const E = _.children,
        U = E.length;
      for (let S = 0; S < U; S++) {
        const W = j ? E[S] : (E[S] = Ae(E[S]));
        if (m) m = h(m, W, L, D, O, j);
        else {
          if (W.type === xt && !W.children) continue;
          (Be = !0), n(null, W, P, null, L, D, Zt(P), O);
        }
      }
      return m;
    },
    R = (m, _, P, L, D, O) => {
      const { slotScopeIds: j } = _;
      j && (D = D ? D.concat(j) : j);
      const E = o(m),
        U = v(i(m), _, E, P, L, D, O);
      return U && en(U) && U.data === "]"
        ? i((_.anchor = U))
        : ((Be = !0), c((_.anchor = u("]")), E, U), U);
    },
    M = (m, _, P, L, D, O) => {
      if (((Be = !0), (_.el = null), O)) {
        const U = V(m);
        for (;;) {
          const S = i(m);
          if (S && S !== U) l(S);
          else break;
        }
      }
      const j = i(m),
        E = o(m);
      return l(m), n(null, _, E, j, P, L, Zt(E), D), j;
    },
    V = (m, _ = "[", P = "]") => {
      let L = 0;
      for (; m; )
        if (((m = i(m)), m && en(m) && (m.data === _ && L++, m.data === P))) {
          if (L === 0) return i(m);
          L--;
        }
      return m;
    },
    q = (m, _, P) => {
      const L = _.parentNode;
      L && L.replaceChild(m, _);
      let D = P;
      for (; D; ) D.vnode.el === _ && (D.vnode.el = D.subTree.el = m), (D = D.parent);
    },
    J = (m) => m.nodeType === 1 && m.tagName.toLowerCase() === "template";
  return [d, h];
}
const ge = pi;
function Wl(e) {
  return ql(e, Kl);
}
function ql(e, t) {
  const n = Ur();
  n.__VUE__ = !0;
  const {
      insert: s,
      remove: r,
      patchProp: i,
      createElement: o,
      createText: l,
      createComment: c,
      setText: u,
      setElementText: d,
      parentNode: h,
      nextSibling: p,
      setScopeId: v = xe,
      insertStaticContent: R,
    } = e,
    M = (a, f, g, y = null, b = null, x = null, A = void 0, C = null, T = !!f.dynamicChildren) => {
      if (a === f) return;
      a && !it(a, f) && ((y = Wt(a)), Oe(a, b, x, !0), (a = null)),
        f.patchFlag === -2 && ((T = !1), (f.dynamicChildren = null));
      const { type: w, ref: I, shapeFlag: H } = f;
      switch (w) {
        case xt:
          V(a, f, g, y);
          break;
        case ve:
          q(a, f, g, y);
          break;
        case Nt:
          a == null && J(f, g, y, A);
          break;
        case me:
          S(a, f, g, y, b, x, A, C, T);
          break;
        default:
          H & 1
            ? P(a, f, g, y, b, x, A, C, T)
            : H & 6
              ? W(a, f, g, y, b, x, A, C, T)
              : (H & 64 || H & 128) && w.process(a, f, g, y, b, x, A, C, T, dt);
      }
      I != null && b && mn(I, a && a.ref, x, f || a, !f);
    },
    V = (a, f, g, y) => {
      if (a == null) s((f.el = l(f.children)), g, y);
      else {
        const b = (f.el = a.el);
        f.children !== a.children && u(b, f.children);
      }
    },
    q = (a, f, g, y) => {
      a == null ? s((f.el = c(f.children || "")), g, y) : (f.el = a.el);
    },
    J = (a, f, g, y) => {
      [a.el, a.anchor] = R(a.children, f, g, y, a.el, a.anchor);
    },
    m = ({ el: a, anchor: f }, g, y) => {
      let b;
      for (; a && a !== f; ) (b = p(a)), s(a, g, y), (a = b);
      s(f, g, y);
    },
    _ = ({ el: a, anchor: f }) => {
      let g;
      for (; a && a !== f; ) (g = p(a)), r(a), (a = g);
      r(f);
    },
    P = (a, f, g, y, b, x, A, C, T) => {
      f.type === "svg" ? (A = "svg") : f.type === "math" && (A = "mathml"),
        a == null ? L(f, g, y, b, x, A, C, T) : j(a, f, b, x, A, C, T);
    },
    L = (a, f, g, y, b, x, A, C) => {
      let T, w;
      const { props: I, shapeFlag: H, transition: N, dirs: k } = a;
      if (
        ((T = a.el = o(a.type, x, I && I.is, I)),
        H & 8 ? d(T, a.children) : H & 16 && O(a.children, T, null, y, b, Kn(a, x), A, C),
        k && Ie(a, null, y, "created"),
        D(T, a, a.scopeId, A, y),
        I)
      ) {
        for (const Q in I) Q !== "value" && !yt(Q) && i(T, Q, null, I[Q], x, a.children, y, b, $e);
        "value" in I && i(T, "value", null, I.value, x), (w = I.onVnodeBeforeMount) && Ee(w, y, a);
      }
      k && Ie(a, null, y, "beforeMount");
      const G = Ii(b, N);
      G && N.beforeEnter(T),
        s(T, f, g),
        ((w = I && I.onVnodeMounted) || G || k) &&
          ge(() => {
            w && Ee(w, y, a), G && N.enter(T), k && Ie(a, null, y, "mounted");
          }, b);
    },
    D = (a, f, g, y, b) => {
      if ((g && v(a, g), y)) for (let x = 0; x < y.length; x++) v(a, y[x]);
      if (b) {
        let x = b.subTree;
        if (f === x) {
          const A = b.vnode;
          D(a, A, A.scopeId, A.slotScopeIds, b.parent);
        }
      }
    },
    O = (a, f, g, y, b, x, A, C, T = 0) => {
      for (let w = T; w < a.length; w++) {
        const I = (a[w] = C ? Ge(a[w]) : Ae(a[w]));
        M(null, I, f, g, y, b, x, A, C);
      }
    },
    j = (a, f, g, y, b, x, A) => {
      const C = (f.el = a.el);
      let { patchFlag: T, dynamicChildren: w, dirs: I } = f;
      T |= a.patchFlag & 16;
      const H = a.props || te,
        N = f.props || te;
      let k;
      if (
        (g && tt(g, !1),
        (k = N.onVnodeBeforeUpdate) && Ee(k, g, f, a),
        I && Ie(f, a, g, "beforeUpdate"),
        g && tt(g, !0),
        w
          ? E(a.dynamicChildren, w, C, g, y, Kn(f, b), x)
          : A || F(a, f, C, null, g, y, Kn(f, b), x, !1),
        T > 0)
      ) {
        if (T & 16) U(C, f, H, N, g, y, b);
        else if (
          (T & 2 && H.class !== N.class && i(C, "class", null, N.class, b),
          T & 4 && i(C, "style", H.style, N.style, b),
          T & 8)
        ) {
          const G = f.dynamicProps;
          for (let Q = 0; Q < G.length; Q++) {
            const ee = G[Q],
              oe = H[ee],
              Te = N[ee];
            (Te !== oe || ee === "value") && i(C, ee, oe, Te, b, a.children, g, y, $e);
          }
        }
        T & 1 && a.children !== f.children && d(C, f.children);
      } else !A && w == null && U(C, f, H, N, g, y, b);
      ((k = N.onVnodeUpdated) || I) &&
        ge(() => {
          k && Ee(k, g, f, a), I && Ie(f, a, g, "updated");
        }, y);
    },
    E = (a, f, g, y, b, x, A) => {
      for (let C = 0; C < f.length; C++) {
        const T = a[C],
          w = f[C],
          I = T.el && (T.type === me || !it(T, w) || T.shapeFlag & 70) ? h(T.el) : g;
        M(T, w, I, null, y, b, x, A, !0);
      }
    },
    U = (a, f, g, y, b, x, A) => {
      if (g !== y) {
        if (g !== te)
          for (const C in g) !yt(C) && !(C in y) && i(a, C, g[C], null, A, f.children, b, x, $e);
        for (const C in y) {
          if (yt(C)) continue;
          const T = y[C],
            w = g[C];
          T !== w && C !== "value" && i(a, C, w, T, A, f.children, b, x, $e);
        }
        "value" in y && i(a, "value", g.value, y.value, A);
      }
    },
    S = (a, f, g, y, b, x, A, C, T) => {
      const w = (f.el = a ? a.el : l("")),
        I = (f.anchor = a ? a.anchor : l(""));
      let { patchFlag: H, dynamicChildren: N, slotScopeIds: k } = f;
      k && (C = C ? C.concat(k) : k),
        a == null
          ? (s(w, g, y), s(I, g, y), O(f.children || [], g, I, b, x, A, C, T))
          : H > 0 && H & 64 && N && a.dynamicChildren
            ? (E(a.dynamicChildren, N, g, b, x, A, C),
              (f.key != null || (b && f === b.subTree)) && Pi(a, f, !0))
            : F(a, f, g, I, b, x, A, C, T);
    },
    W = (a, f, g, y, b, x, A, C, T) => {
      (f.slotScopeIds = C),
        a == null
          ? f.shapeFlag & 512
            ? b.ctx.activate(f, g, y, A, T)
            : re(f, g, y, b, x, A, T)
          : le(a, f, T);
    },
    re = (a, f, g, y, b, x, A) => {
      const C = (a.component = tc(a, y, b));
      if ((Ln(a) && (C.ctx.renderer = dt), nc(C), C.asyncDep)) {
        if ((b && b.registerDep(C, $), !a.el)) {
          const T = (C.subTree = ae(ve));
          q(null, T, f, g);
        }
      } else $(C, a, f, g, b, x, A);
    },
    le = (a, f, g) => {
      const y = (f.component = a.component);
      if (cl(a, f, g))
        if (y.asyncDep && !y.asyncResolved) {
          z(y, f, g);
          return;
        } else (y.next = f), tl(y.update), (y.effect.dirty = !0), y.update();
      else (f.el = a.el), (y.vnode = f);
    },
    $ = (a, f, g, y, b, x, A) => {
      const C = () => {
          if (a.isMounted) {
            let { next: I, bu: H, u: N, parent: k, vnode: G } = a;
            {
              const ht = Mi(a);
              if (ht) {
                I && ((I.el = G.el), z(a, I, A)),
                  ht.asyncDep.then(() => {
                    a.isUnmounted || C();
                  });
                return;
              }
            }
            let Q = I,
              ee;
            tt(a, !1),
              I ? ((I.el = G.el), z(a, I, A)) : (I = G),
              H && Vn(H),
              (ee = I.props && I.props.onVnodeBeforeUpdate) && Ee(ee, k, I, G),
              tt(a, !0);
            const oe = Un(a),
              Te = a.subTree;
            (a.subTree = oe),
              M(Te, oe, h(Te.el), Wt(Te), a, b, x),
              (I.el = oe.el),
              Q === null && al(a, oe.el),
              N && ge(N, b),
              (ee = I.props && I.props.onVnodeUpdated) && ge(() => Ee(ee, k, I, G), b);
          } else {
            let I;
            const { el: H, props: N } = f,
              { bm: k, m: G, parent: Q } = a,
              ee = wt(f);
            if (
              (tt(a, !1),
              k && Vn(k),
              !ee && (I = N && N.onVnodeBeforeMount) && Ee(I, Q, f),
              tt(a, !0),
              H && jn)
            ) {
              const oe = () => {
                (a.subTree = Un(a)), jn(H, a.subTree, a, b, null);
              };
              ee ? f.type.__asyncLoader().then(() => !a.isUnmounted && oe()) : oe();
            } else {
              const oe = (a.subTree = Un(a));
              M(null, oe, g, y, a, b, x), (f.el = oe.el);
            }
            if ((G && ge(G, b), !ee && (I = N && N.onVnodeMounted))) {
              const oe = f;
              ge(() => Ee(I, Q, oe), b);
            }
            (f.shapeFlag & 256 || (Q && wt(Q.vnode) && Q.vnode.shapeFlag & 256)) &&
              a.a &&
              ge(a.a, b),
              (a.isMounted = !0),
              (f = g = y = null);
          }
        },
        T = (a.effect = new Cs(C, xe, () => Ps(w), a.scope)),
        w = (a.update = () => {
          T.dirty && T.run();
        });
      (w.id = a.uid), tt(a, !0), w();
    },
    z = (a, f, g) => {
      f.component = a;
      const y = a.vnode.props;
      (a.vnode = f), (a.next = null), jl(a, f.props, y, g), Ul(a, f.children, g), ut(), Zs(a), ft();
    },
    F = (a, f, g, y, b, x, A, C, T = !1) => {
      const w = a && a.children,
        I = a ? a.shapeFlag : 0,
        H = f.children,
        { patchFlag: N, shapeFlag: k } = f;
      if (N > 0) {
        if (N & 128) {
          Kt(w, H, g, y, b, x, A, C, T);
          return;
        } else if (N & 256) {
          Fe(w, H, g, y, b, x, A, C, T);
          return;
        }
      }
      k & 8
        ? (I & 16 && $e(w, b, x), H !== w && d(g, H))
        : I & 16
          ? k & 16
            ? Kt(w, H, g, y, b, x, A, C, T)
            : $e(w, b, x, !0)
          : (I & 8 && d(g, ""), k & 16 && O(H, g, y, b, x, A, C, T));
    },
    Fe = (a, f, g, y, b, x, A, C, T) => {
      (a = a || mt), (f = f || mt);
      const w = a.length,
        I = f.length,
        H = Math.min(w, I);
      let N;
      for (N = 0; N < H; N++) {
        const k = (f[N] = T ? Ge(f[N]) : Ae(f[N]));
        M(a[N], k, g, null, b, x, A, C, T);
      }
      w > I ? $e(a, b, x, !0, !1, H) : O(f, g, y, b, x, A, C, T, H);
    },
    Kt = (a, f, g, y, b, x, A, C, T) => {
      let w = 0;
      const I = f.length;
      let H = a.length - 1,
        N = I - 1;
      for (; w <= H && w <= N; ) {
        const k = a[w],
          G = (f[w] = T ? Ge(f[w]) : Ae(f[w]));
        if (it(k, G)) M(k, G, g, null, b, x, A, C, T);
        else break;
        w++;
      }
      for (; w <= H && w <= N; ) {
        const k = a[H],
          G = (f[N] = T ? Ge(f[N]) : Ae(f[N]));
        if (it(k, G)) M(k, G, g, null, b, x, A, C, T);
        else break;
        H--, N--;
      }
      if (w > H) {
        if (w <= N) {
          const k = N + 1,
            G = k < I ? f[k].el : y;
          for (; w <= N; ) M(null, (f[w] = T ? Ge(f[w]) : Ae(f[w])), g, G, b, x, A, C, T), w++;
        }
      } else if (w > N) for (; w <= H; ) Oe(a[w], b, x, !0), w++;
      else {
        const k = w,
          G = w,
          Q = new Map();
        for (w = G; w <= N; w++) {
          const ye = (f[w] = T ? Ge(f[w]) : Ae(f[w]));
          ye.key != null && Q.set(ye.key, w);
        }
        let ee,
          oe = 0;
        const Te = N - G + 1;
        let ht = !1,
          Bs = 0;
        const At = new Array(Te);
        for (w = 0; w < Te; w++) At[w] = 0;
        for (w = k; w <= H; w++) {
          const ye = a[w];
          if (oe >= Te) {
            Oe(ye, b, x, !0);
            continue;
          }
          let Le;
          if (ye.key != null) Le = Q.get(ye.key);
          else
            for (ee = G; ee <= N; ee++)
              if (At[ee - G] === 0 && it(ye, f[ee])) {
                Le = ee;
                break;
              }
          Le === void 0
            ? Oe(ye, b, x, !0)
            : ((At[Le - G] = w + 1),
              Le >= Bs ? (Bs = Le) : (ht = !0),
              M(ye, f[Le], g, null, b, x, A, C, T),
              oe++);
        }
        const ks = ht ? Gl(At) : mt;
        for (ee = ks.length - 1, w = Te - 1; w >= 0; w--) {
          const ye = G + w,
            Le = f[ye],
            Ks = ye + 1 < I ? f[ye + 1].el : y;
          At[w] === 0
            ? M(null, Le, g, Ks, b, x, A, C, T)
            : ht && (ee < 0 || w !== ks[ee] ? et(Le, g, Ks, 2) : ee--);
        }
      }
    },
    et = (a, f, g, y, b = null) => {
      const { el: x, type: A, transition: C, children: T, shapeFlag: w } = a;
      if (w & 6) {
        et(a.component.subTree, f, g, y);
        return;
      }
      if (w & 128) {
        a.suspense.move(f, g, y);
        return;
      }
      if (w & 64) {
        A.move(a, f, g, dt);
        return;
      }
      if (A === me) {
        s(x, f, g);
        for (let H = 0; H < T.length; H++) et(T[H], f, g, y);
        s(a.anchor, f, g);
        return;
      }
      if (A === Nt) {
        m(a, f, g);
        return;
      }
      if (y !== 2 && w & 1 && C)
        if (y === 0) C.beforeEnter(x), s(x, f, g), ge(() => C.enter(x), b);
        else {
          const { leave: H, delayLeave: N, afterLeave: k } = C,
            G = () => s(x, f, g),
            Q = () => {
              H(x, () => {
                G(), k && k();
              });
            };
          N ? N(x, G, Q) : Q();
        }
      else s(x, f, g);
    },
    Oe = (a, f, g, y = !1, b = !1) => {
      const {
        type: x,
        props: A,
        ref: C,
        children: T,
        dynamicChildren: w,
        shapeFlag: I,
        patchFlag: H,
        dirs: N,
      } = a;
      if ((C != null && mn(C, null, g, a, !0), I & 256)) {
        f.ctx.deactivate(a);
        return;
      }
      const k = I & 1 && N,
        G = !wt(a);
      let Q;
      if ((G && (Q = A && A.onVnodeBeforeUnmount) && Ee(Q, f, a), I & 6)) io(a.component, g, y);
      else {
        if (I & 128) {
          a.suspense.unmount(g, y);
          return;
        }
        k && Ie(a, null, f, "beforeUnmount"),
          I & 64
            ? a.type.remove(a, f, g, b, dt, y)
            : w && (x !== me || (H > 0 && H & 64))
              ? $e(w, f, g, !1, !0)
              : ((x === me && H & 384) || (!b && I & 16)) && $e(T, f, g),
          y && Ds(a);
      }
      ((G && (Q = A && A.onVnodeUnmounted)) || k) &&
        ge(() => {
          Q && Ee(Q, f, a), k && Ie(a, null, f, "unmounted");
        }, g);
    },
    Ds = (a) => {
      const { type: f, el: g, anchor: y, transition: b } = a;
      if (f === me) {
        ro(g, y);
        return;
      }
      if (f === Nt) {
        _(a);
        return;
      }
      const x = () => {
        r(g), b && !b.persisted && b.afterLeave && b.afterLeave();
      };
      if (a.shapeFlag & 1 && b && !b.persisted) {
        const { leave: A, delayLeave: C } = b,
          T = () => A(g, x);
        C ? C(a.el, x, T) : T();
      } else x();
    },
    ro = (a, f) => {
      let g;
      for (; a !== f; ) (g = p(a)), r(a), (a = g);
      r(f);
    },
    io = (a, f, g) => {
      const { bum: y, scope: b, update: x, subTree: A, um: C } = a;
      y && Vn(y),
        b.stop(),
        x && ((x.active = !1), Oe(A, a, f, g)),
        C && ge(C, f),
        ge(() => {
          a.isUnmounted = !0;
        }, f),
        f &&
          f.pendingBranch &&
          !f.isUnmounted &&
          a.asyncDep &&
          !a.asyncResolved &&
          a.suspenseId === f.pendingId &&
          (f.deps--, f.deps === 0 && f.resolve());
    },
    $e = (a, f, g, y = !1, b = !1, x = 0) => {
      for (let A = x; A < a.length; A++) Oe(a[A], f, g, y, b);
    },
    Wt = (a) =>
      a.shapeFlag & 6
        ? Wt(a.component.subTree)
        : a.shapeFlag & 128
          ? a.suspense.next()
          : p(a.anchor || a.el);
  let $n = !1;
  const Us = (a, f, g) => {
      a == null
        ? f._vnode && Oe(f._vnode, null, null, !0)
        : M(f._vnode || null, a, f, null, null, null, g),
        $n || (($n = !0), Zs(), hn(), ($n = !1)),
        (f._vnode = a);
    },
    dt = { p: M, um: Oe, m: et, r: Ds, mt: re, mc: O, pc: F, pbc: E, n: Wt, o: e };
  let Hn, jn;
  return t && ([Hn, jn] = t(dt)), { render: Us, hydrate: Hn, createApp: Fl(Us, Hn) };
}
function Kn({ type: e, props: t }, n) {
  return (n === "svg" && e === "foreignObject") ||
    (n === "mathml" && e === "annotation-xml" && t && t.encoding && t.encoding.includes("html"))
    ? void 0
    : n;
}
function tt({ effect: e, update: t }, n) {
  e.allowRecurse = t.allowRecurse = n;
}
function Ii(e, t) {
  return (!e || (e && !e.pendingBranch)) && t && !t.persisted;
}
function Pi(e, t, n = !1) {
  const s = e.children,
    r = t.children;
  if (B(s) && B(r))
    for (let i = 0; i < s.length; i++) {
      const o = s[i];
      let l = r[i];
      l.shapeFlag & 1 &&
        !l.dynamicChildren &&
        ((l.patchFlag <= 0 || l.patchFlag === 32) && ((l = r[i] = Ge(r[i])), (l.el = o.el)),
        n || Pi(o, l)),
        l.type === xt && (l.el = o.el);
    }
}
function Gl(e) {
  const t = e.slice(),
    n = [0];
  let s, r, i, o, l;
  const c = e.length;
  for (s = 0; s < c; s++) {
    const u = e[s];
    if (u !== 0) {
      if (((r = n[n.length - 1]), e[r] < u)) {
        (t[s] = r), n.push(s);
        continue;
      }
      for (i = 0, o = n.length - 1; i < o; )
        (l = (i + o) >> 1), e[n[l]] < u ? (i = l + 1) : (o = l);
      u < e[n[i]] && (i > 0 && (t[s] = n[i - 1]), (n[i] = s));
    }
  }
  for (i = n.length, o = n[i - 1]; i-- > 0; ) (n[i] = o), (o = t[o]);
  return n;
}
function Mi(e) {
  const t = e.subTree.component;
  if (t) return t.asyncDep && !t.asyncResolved ? t : Mi(t);
}
const zl = (e) => e.__isTeleport,
  me = Symbol.for("v-fgt"),
  xt = Symbol.for("v-txt"),
  ve = Symbol.for("v-cmt"),
  Nt = Symbol.for("v-stc"),
  Ft = [];
let Re = null;
function Ni(e = !1) {
  Ft.push((Re = e ? null : []));
}
function Xl() {
  Ft.pop(), (Re = Ft[Ft.length - 1] || null);
}
let Dt = 1;
function fr(e) {
  Dt += e;
}
function Fi(e) {
  return (e.dynamicChildren = Dt > 0 ? Re || mt : null), Xl(), Dt > 0 && Re && Re.push(e), e;
}
function Wa(e, t, n, s, r, i) {
  return Fi(ji(e, t, n, s, r, i, !0));
}
function $i(e, t, n, s, r) {
  return Fi(ae(e, t, n, s, r, !0));
}
function _n(e) {
  return e ? e.__v_isVNode === !0 : !1;
}
function it(e, t) {
  return e.type === t.type && e.key === t.key;
}
const Mn = "__vInternal",
  Hi = ({ key: e }) => e ?? null,
  ln = ({ ref: e, ref_key: t, ref_for: n }) => (
    typeof e == "number" && (e = "" + e),
    e != null ? (ne(e) || he(e) || K(e) ? { i: de, r: e, k: t, f: !!n } : e) : null
  );
function ji(e, t = null, n = null, s = 0, r = null, i = e === me ? 0 : 1, o = !1, l = !1) {
  const c = {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e,
    props: t,
    key: t && Hi(t),
    ref: t && ln(t),
    scopeId: Rn,
    slotScopeIds: null,
    children: n,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag: i,
    patchFlag: s,
    dynamicProps: r,
    dynamicChildren: null,
    appContext: null,
    ctx: de,
  };
  return (
    l ? ($s(c, n), i & 128 && e.normalize(c)) : n && (c.shapeFlag |= ne(n) ? 8 : 16),
    Dt > 0 && !o && Re && (c.patchFlag > 0 || i & 6) && c.patchFlag !== 32 && Re.push(c),
    c
  );
}
const ae = Yl;
function Yl(e, t = null, n = null, s = 0, r = null, i = !1) {
  if (((!e || e === di) && (e = ve), _n(e))) {
    const l = Ze(e, t, !0);
    return (
      n && $s(l, n),
      Dt > 0 && !i && Re && (l.shapeFlag & 6 ? (Re[Re.indexOf(e)] = l) : Re.push(l)),
      (l.patchFlag |= -2),
      l
    );
  }
  if ((oc(e) && (e = e.__vccOpts), t)) {
    t = Jl(t);
    let { class: l, style: c } = t;
    l && !ne(l) && (t.class = Es(l)),
      Z(c) && (ni(c) && !B(c) && (c = ie({}, c)), (t.style = ws(c)));
  }
  const o = ne(e) ? 1 : ul(e) ? 128 : zl(e) ? 64 : Z(e) ? 4 : K(e) ? 2 : 0;
  return ji(e, t, n, s, r, o, i, !0);
}
function Jl(e) {
  return e ? (ni(e) || Mn in e ? ie({}, e) : e) : null;
}
function Ze(e, t, n = !1) {
  const { props: s, ref: r, patchFlag: i, children: o } = e,
    l = t ? Ql(s || {}, t) : s;
  return {
    __v_isVNode: !0,
    __v_skip: !0,
    type: e.type,
    props: l,
    key: l && Hi(l),
    ref: t && t.ref ? (n && r ? (B(r) ? r.concat(ln(t)) : [r, ln(t)]) : ln(t)) : r,
    scopeId: e.scopeId,
    slotScopeIds: e.slotScopeIds,
    children: o,
    target: e.target,
    targetAnchor: e.targetAnchor,
    staticCount: e.staticCount,
    shapeFlag: e.shapeFlag,
    patchFlag: t && e.type !== me ? (i === -1 ? 16 : i | 16) : i,
    dynamicProps: e.dynamicProps,
    dynamicChildren: e.dynamicChildren,
    appContext: e.appContext,
    dirs: e.dirs,
    transition: e.transition,
    component: e.component,
    suspense: e.suspense,
    ssContent: e.ssContent && Ze(e.ssContent),
    ssFallback: e.ssFallback && Ze(e.ssFallback),
    el: e.el,
    anchor: e.anchor,
    ctx: e.ctx,
    ce: e.ce,
  };
}
function Vi(e = " ", t = 0) {
  return ae(xt, null, e, t);
}
function qa(e, t) {
  const n = ae(Nt, null, e);
  return (n.staticCount = t), n;
}
function Ga(e = "", t = !1) {
  return t ? (Ni(), $i(ve, null, e)) : ae(ve, null, e);
}
function Ae(e) {
  return e == null || typeof e == "boolean"
    ? ae(ve)
    : B(e)
      ? ae(me, null, e.slice())
      : typeof e == "object"
        ? Ge(e)
        : ae(xt, null, String(e));
}
function Ge(e) {
  return (e.el === null && e.patchFlag !== -1) || e.memo ? e : Ze(e);
}
function $s(e, t) {
  let n = 0;
  const { shapeFlag: s } = e;
  if (t == null) t = null;
  else if (B(t)) n = 16;
  else if (typeof t == "object")
    if (s & 65) {
      const r = t.default;
      r && (r._c && (r._d = !1), $s(e, r()), r._c && (r._d = !0));
      return;
    } else {
      n = 32;
      const r = t._;
      !r && !(Mn in t)
        ? (t._ctx = de)
        : r === 3 && de && (de.slots._ === 1 ? (t._ = 1) : ((t._ = 2), (e.patchFlag |= 1024)));
    }
  else
    K(t)
      ? ((t = { default: t, _ctx: de }), (n = 32))
      : ((t = String(t)), s & 64 ? ((n = 16), (t = [Vi(t)])) : (n = 8));
  (e.children = t), (e.shapeFlag |= n);
}
function Ql(...e) {
  const t = {};
  for (let n = 0; n < e.length; n++) {
    const s = e[n];
    for (const r in s)
      if (r === "class") t.class !== s.class && (t.class = Es([t.class, s.class]));
      else if (r === "style") t.style = ws([t.style, s.style]);
      else if (Bt(r)) {
        const i = t[r],
          o = s[r];
        o && i !== o && !(B(i) && i.includes(o)) && (t[r] = i ? [].concat(i, o) : o);
      } else r !== "" && (t[r] = s[r]);
  }
  return t;
}
function Ee(e, t, n, s = null) {
  Se(e, t, 7, [n, s]);
}
const Zl = Si();
let ec = 0;
function tc(e, t, n) {
  const s = e.type,
    r = (t ? t.appContext : e.appContext) || Zl,
    i = {
      uid: ec++,
      vnode: e,
      type: s,
      parent: t,
      appContext: r,
      root: null,
      next: null,
      subTree: null,
      effect: null,
      update: null,
      scope: new vo(!0),
      render: null,
      proxy: null,
      exposed: null,
      exposeProxy: null,
      withProxy: null,
      provides: t ? t.provides : Object.create(r.provides),
      accessCache: null,
      renderCache: [],
      components: null,
      directives: null,
      propsOptions: Ai(s, r),
      emitsOptions: fi(s, r),
      emit: null,
      emitted: null,
      propsDefaults: te,
      inheritAttrs: s.inheritAttrs,
      ctx: te,
      data: te,
      props: te,
      attrs: te,
      slots: te,
      refs: te,
      setupState: te,
      setupContext: null,
      attrsProxy: null,
      slotsProxy: null,
      suspense: n,
      suspenseId: n ? n.pendingId : 0,
      asyncDep: null,
      asyncResolved: !1,
      isMounted: !1,
      isUnmounted: !1,
      isDeactivated: !1,
      bc: null,
      c: null,
      bm: null,
      m: null,
      bu: null,
      u: null,
      um: null,
      bum: null,
      da: null,
      a: null,
      rtg: null,
      rtc: null,
      ec: null,
      sp: null,
    };
  return (
    (i.ctx = { _: i }), (i.root = t ? t.root : i), (i.emit = rl.bind(null, i)), e.ce && e.ce(i), i
  );
}
let ce = null;
const Nn = () => ce || de;
let yn, hs;
{
  const e = Ur(),
    t = (n, s) => {
      let r;
      return (
        (r = e[n]) || (r = e[n] = []),
        r.push(s),
        (i) => {
          r.length > 1 ? r.forEach((o) => o(i)) : r[0](i);
        }
      );
    };
  (yn = t("__VUE_INSTANCE_SETTERS__", (n) => (ce = n))),
    (hs = t("__VUE_SSR_SETTERS__", (n) => (Fn = n)));
}
const kt = (e) => {
    const t = ce;
    return (
      yn(e),
      e.scope.on(),
      () => {
        e.scope.off(), yn(t);
      }
    );
  },
  dr = () => {
    ce && ce.scope.off(), yn(null);
  };
function Di(e) {
  return e.vnode.shapeFlag & 4;
}
let Fn = !1;
function nc(e, t = !1) {
  t && hs(t);
  const { props: n, children: s } = e.vnode,
    r = Di(e);
  Hl(e, n, r, t), Dl(e, s);
  const i = r ? sc(e, t) : void 0;
  return t && hs(!1), i;
}
function sc(e, t) {
  const n = e.type;
  (e.accessCache = Object.create(null)), (e.proxy = Lt(new Proxy(e.ctx, Al)));
  const { setup: s } = n;
  if (s) {
    const r = (e.setupContext = s.length > 1 ? Bi(e) : null),
      i = kt(e);
    ut();
    const o = Ye(s, e, 0, [e.props, r]);
    if ((ft(), i(), jr(o))) {
      if ((o.then(dr, dr), t))
        return o
          .then((l) => {
            hr(e, l, t);
          })
          .catch((l) => {
            Sn(l, e, 0);
          });
      e.asyncDep = o;
    } else hr(e, o, t);
  } else Ui(e, t);
}
function hr(e, t, n) {
  K(t)
    ? e.type.__ssrInlineRender
      ? (e.ssrRender = t)
      : (e.render = t)
    : Z(t) && (e.setupState = li(t)),
    Ui(e, n);
}
let pr;
function Ui(e, t, n) {
  const s = e.type;
  if (!e.render) {
    if (!t && pr && !s.render) {
      const r = s.template || Ns(e).template;
      if (r) {
        const { isCustomElement: i, compilerOptions: o } = e.appContext.config,
          { delimiters: l, compilerOptions: c } = s,
          u = ie(ie({ isCustomElement: i, delimiters: l }, o), c);
        s.render = pr(r, u);
      }
    }
    e.render = s.render || xe;
  }
  {
    const r = kt(e);
    ut();
    try {
      Ol(e);
    } finally {
      ft(), r();
    }
  }
}
function rc(e) {
  return (
    e.attrsProxy ||
    (e.attrsProxy = new Proxy(e.attrs, {
      get(t, n) {
        return _e(e, "get", "$attrs"), t[n];
      },
    }))
  );
}
function Bi(e) {
  const t = (n) => {
    e.exposed = n || {};
  };
  return {
    get attrs() {
      return rc(e);
    },
    slots: e.slots,
    emit: e.emit,
    expose: t,
  };
}
function Hs(e) {
  if (e.exposed)
    return (
      e.exposeProxy ||
      (e.exposeProxy = new Proxy(li(Lt(e.exposed)), {
        get(t, n) {
          if (n in t) return t[n];
          if (n in Pt) return Pt[n](e);
        },
        has(t, n) {
          return n in t || n in Pt;
        },
      }))
    );
}
function ic(e, t = !0) {
  return K(e) ? e.displayName || e.name : e.name || (t && e.__name);
}
function oc(e) {
  return K(e) && "__vccOpts" in e;
}
const se = (e, t) => Ko(e, t, Fn);
function ps(e, t, n) {
  const s = arguments.length;
  return s === 2
    ? Z(t) && !B(t)
      ? _n(t)
        ? ae(e, null, [t])
        : ae(e, t)
      : ae(e, null, t)
    : (s > 3 ? (n = Array.prototype.slice.call(arguments, 2)) : s === 3 && _n(n) && (n = [n]),
      ae(e, t, n));
}
const lc = "3.4.21";
/**
 * @vue/runtime-dom v3.4.21
 * (c) 2018-present Yuxi (Evan) You and Vue contributors
 * @license MIT
 **/ const cc = "http://www.w3.org/2000/svg",
  ac = "http://www.w3.org/1998/Math/MathML",
  ze = typeof document < "u" ? document : null,
  gr = ze && ze.createElement("template"),
  uc = {
    insert: (e, t, n) => {
      t.insertBefore(e, n || null);
    },
    remove: (e) => {
      const t = e.parentNode;
      t && t.removeChild(e);
    },
    createElement: (e, t, n, s) => {
      const r =
        t === "svg"
          ? ze.createElementNS(cc, e)
          : t === "mathml"
            ? ze.createElementNS(ac, e)
            : ze.createElement(e, n ? { is: n } : void 0);
      return e === "select" && s && s.multiple != null && r.setAttribute("multiple", s.multiple), r;
    },
    createText: (e) => ze.createTextNode(e),
    createComment: (e) => ze.createComment(e),
    setText: (e, t) => {
      e.nodeValue = t;
    },
    setElementText: (e, t) => {
      e.textContent = t;
    },
    parentNode: (e) => e.parentNode,
    nextSibling: (e) => e.nextSibling,
    querySelector: (e) => ze.querySelector(e),
    setScopeId(e, t) {
      e.setAttribute(t, "");
    },
    insertStaticContent(e, t, n, s, r, i) {
      const o = n ? n.previousSibling : t.lastChild;
      if (r && (r === i || r.nextSibling))
        for (; t.insertBefore(r.cloneNode(!0), n), !(r === i || !(r = r.nextSibling)); );
      else {
        gr.innerHTML = s === "svg" ? `<svg>${e}</svg>` : s === "mathml" ? `<math>${e}</math>` : e;
        const l = gr.content;
        if (s === "svg" || s === "mathml") {
          const c = l.firstChild;
          for (; c.firstChild; ) l.appendChild(c.firstChild);
          l.removeChild(c);
        }
        t.insertBefore(l, n);
      }
      return [o ? o.nextSibling : t.firstChild, n ? n.previousSibling : t.lastChild];
    },
  },
  ke = "transition",
  Rt = "animation",
  Ut = Symbol("_vtc"),
  ki = (e, { slots: t }) => ps(ml, fc(e), t);
ki.displayName = "Transition";
const Ki = {
  name: String,
  type: String,
  css: { type: Boolean, default: !0 },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String,
};
ki.props = ie({}, _i, Ki);
const nt = (e, t = []) => {
    B(e) ? e.forEach((n) => n(...t)) : e && e(...t);
  },
  mr = (e) => (e ? (B(e) ? e.some((t) => t.length > 1) : e.length > 1) : !1);
function fc(e) {
  const t = {};
  for (const S in e) S in Ki || (t[S] = e[S]);
  if (e.css === !1) return t;
  const {
      name: n = "v",
      type: s,
      duration: r,
      enterFromClass: i = `${n}-enter-from`,
      enterActiveClass: o = `${n}-enter-active`,
      enterToClass: l = `${n}-enter-to`,
      appearFromClass: c = i,
      appearActiveClass: u = o,
      appearToClass: d = l,
      leaveFromClass: h = `${n}-leave-from`,
      leaveActiveClass: p = `${n}-leave-active`,
      leaveToClass: v = `${n}-leave-to`,
    } = e,
    R = dc(r),
    M = R && R[0],
    V = R && R[1],
    {
      onBeforeEnter: q,
      onEnter: J,
      onEnterCancelled: m,
      onLeave: _,
      onLeaveCancelled: P,
      onBeforeAppear: L = q,
      onAppear: D = J,
      onAppearCancelled: O = m,
    } = t,
    j = (S, W, re) => {
      st(S, W ? d : l), st(S, W ? u : o), re && re();
    },
    E = (S, W) => {
      (S._isLeaving = !1), st(S, h), st(S, v), st(S, p), W && W();
    },
    U = (S) => (W, re) => {
      const le = S ? D : J,
        $ = () => j(W, S, re);
      nt(le, [W, $]),
        _r(() => {
          st(W, S ? c : i), Ke(W, S ? d : l), mr(le) || yr(W, s, M, $);
        });
    };
  return ie(t, {
    onBeforeEnter(S) {
      nt(q, [S]), Ke(S, i), Ke(S, o);
    },
    onBeforeAppear(S) {
      nt(L, [S]), Ke(S, c), Ke(S, u);
    },
    onEnter: U(!1),
    onAppear: U(!0),
    onLeave(S, W) {
      S._isLeaving = !0;
      const re = () => E(S, W);
      Ke(S, h),
        gc(),
        Ke(S, p),
        _r(() => {
          S._isLeaving && (st(S, h), Ke(S, v), mr(_) || yr(S, s, V, re));
        }),
        nt(_, [S, re]);
    },
    onEnterCancelled(S) {
      j(S, !1), nt(m, [S]);
    },
    onAppearCancelled(S) {
      j(S, !0), nt(O, [S]);
    },
    onLeaveCancelled(S) {
      E(S), nt(P, [S]);
    },
  });
}
function dc(e) {
  if (e == null) return null;
  if (Z(e)) return [Wn(e.enter), Wn(e.leave)];
  {
    const t = Wn(e);
    return [t, t];
  }
}
function Wn(e) {
  return ho(e);
}
function Ke(e, t) {
  t.split(/\s+/).forEach((n) => n && e.classList.add(n)), (e[Ut] || (e[Ut] = new Set())).add(t);
}
function st(e, t) {
  t.split(/\s+/).forEach((s) => s && e.classList.remove(s));
  const n = e[Ut];
  n && (n.delete(t), n.size || (e[Ut] = void 0));
}
function _r(e) {
  requestAnimationFrame(() => {
    requestAnimationFrame(e);
  });
}
let hc = 0;
function yr(e, t, n, s) {
  const r = (e._endId = ++hc),
    i = () => {
      r === e._endId && s();
    };
  if (n) return setTimeout(i, n);
  const { type: o, timeout: l, propCount: c } = pc(e, t);
  if (!o) return s();
  const u = o + "end";
  let d = 0;
  const h = () => {
      e.removeEventListener(u, p), i();
    },
    p = (v) => {
      v.target === e && ++d >= c && h();
    };
  setTimeout(() => {
    d < c && h();
  }, l + 1),
    e.addEventListener(u, p);
}
function pc(e, t) {
  const n = window.getComputedStyle(e),
    s = (R) => (n[R] || "").split(", "),
    r = s(`${ke}Delay`),
    i = s(`${ke}Duration`),
    o = br(r, i),
    l = s(`${Rt}Delay`),
    c = s(`${Rt}Duration`),
    u = br(l, c);
  let d = null,
    h = 0,
    p = 0;
  t === ke
    ? o > 0 && ((d = ke), (h = o), (p = i.length))
    : t === Rt
      ? u > 0 && ((d = Rt), (h = u), (p = c.length))
      : ((h = Math.max(o, u)),
        (d = h > 0 ? (o > u ? ke : Rt) : null),
        (p = d ? (d === ke ? i.length : c.length) : 0));
  const v = d === ke && /\b(transform|all)(,|$)/.test(s(`${ke}Property`).toString());
  return { type: d, timeout: h, propCount: p, hasTransform: v };
}
function br(e, t) {
  for (; e.length < t.length; ) e = e.concat(e);
  return Math.max(...t.map((n, s) => vr(n) + vr(e[s])));
}
function vr(e) {
  return e === "auto" ? 0 : Number(e.slice(0, -1).replace(",", ".")) * 1e3;
}
function gc() {
  return document.body.offsetHeight;
}
function mc(e, t, n) {
  const s = e[Ut];
  s && (t = (t ? [t, ...s] : [...s]).join(" ")),
    t == null ? e.removeAttribute("class") : n ? e.setAttribute("class", t) : (e.className = t);
}
const wr = Symbol("_vod"),
  _c = Symbol("_vsh"),
  yc = Symbol(""),
  bc = /(^|;)\s*display\s*:/;
function vc(e, t, n) {
  const s = e.style,
    r = ne(n);
  let i = !1;
  if (n && !r) {
    if (t)
      if (ne(t))
        for (const o of t.split(";")) {
          const l = o.slice(0, o.indexOf(":")).trim();
          n[l] == null && cn(s, l, "");
        }
      else for (const o in t) n[o] == null && cn(s, o, "");
    for (const o in n) o === "display" && (i = !0), cn(s, o, n[o]);
  } else if (r) {
    if (t !== n) {
      const o = s[yc];
      o && (n += ";" + o), (s.cssText = n), (i = bc.test(n));
    }
  } else t && e.removeAttribute("style");
  wr in e && ((e[wr] = i ? s.display : ""), e[_c] && (s.display = "none"));
}
const Er = /\s*!important$/;
function cn(e, t, n) {
  if (B(n)) n.forEach((s) => cn(e, t, s));
  else if ((n == null && (n = ""), t.startsWith("--"))) e.setProperty(t, n);
  else {
    const s = wc(e, t);
    Er.test(n) ? e.setProperty(at(s), n.replace(Er, ""), "important") : (e[s] = n);
  }
}
const Cr = ["Webkit", "Moz", "ms"],
  qn = {};
function wc(e, t) {
  const n = qn[t];
  if (n) return n;
  let s = Me(t);
  if (s !== "filter" && s in e) return (qn[t] = s);
  s = wn(s);
  for (let r = 0; r < Cr.length; r++) {
    const i = Cr[r] + s;
    if (i in e) return (qn[t] = i);
  }
  return t;
}
const xr = "http://www.w3.org/1999/xlink";
function Ec(e, t, n, s, r) {
  if (s && t.startsWith("xlink:"))
    n == null ? e.removeAttributeNS(xr, t.slice(6, t.length)) : e.setAttributeNS(xr, t, n);
  else {
    const i = bo(t);
    n == null || (i && !Br(n)) ? e.removeAttribute(t) : e.setAttribute(t, i ? "" : n);
  }
}
function Cc(e, t, n, s, r, i, o) {
  if (t === "innerHTML" || t === "textContent") {
    s && o(s, r, i), (e[t] = n ?? "");
    return;
  }
  const l = e.tagName;
  if (t === "value" && l !== "PROGRESS" && !l.includes("-")) {
    const u = l === "OPTION" ? e.getAttribute("value") || "" : e.value,
      d = n ?? "";
    (u !== d || !("_value" in e)) && (e.value = d),
      n == null && e.removeAttribute(t),
      (e._value = n);
    return;
  }
  let c = !1;
  if (n === "" || n == null) {
    const u = typeof e[t];
    u === "boolean"
      ? (n = Br(n))
      : n == null && u === "string"
        ? ((n = ""), (c = !0))
        : u === "number" && ((n = 0), (c = !0));
  }
  try {
    e[t] = n;
  } catch {}
  c && e.removeAttribute(t);
}
function xc(e, t, n, s) {
  e.addEventListener(t, n, s);
}
function Sc(e, t, n, s) {
  e.removeEventListener(t, n, s);
}
const Sr = Symbol("_vei");
function Tc(e, t, n, s, r = null) {
  const i = e[Sr] || (e[Sr] = {}),
    o = i[t];
  if (s && o) o.value = s;
  else {
    const [l, c] = Ac(t);
    if (s) {
      const u = (i[t] = Lc(s, r));
      xc(e, l, u, c);
    } else o && (Sc(e, l, o, c), (i[t] = void 0));
  }
}
const Tr = /(?:Once|Passive|Capture)$/;
function Ac(e) {
  let t;
  if (Tr.test(e)) {
    t = {};
    let s;
    for (; (s = e.match(Tr)); )
      (e = e.slice(0, e.length - s[0].length)), (t[s[0].toLowerCase()] = !0);
  }
  return [e[2] === ":" ? e.slice(3) : at(e.slice(2)), t];
}
let Gn = 0;
const Rc = Promise.resolve(),
  Oc = () => Gn || (Rc.then(() => (Gn = 0)), (Gn = Date.now()));
function Lc(e, t) {
  const n = (s) => {
    if (!s._vts) s._vts = Date.now();
    else if (s._vts <= n.attached) return;
    Se(Ic(s, n.value), t, 5, [s]);
  };
  return (n.value = e), (n.attached = Oc()), n;
}
function Ic(e, t) {
  if (B(t)) {
    const n = e.stopImmediatePropagation;
    return (
      (e.stopImmediatePropagation = () => {
        n.call(e), (e._stopped = !0);
      }),
      t.map((s) => (r) => !r._stopped && s && s(r))
    );
  } else return t;
}
const Ar = (e) =>
    e.charCodeAt(0) === 111 &&
    e.charCodeAt(1) === 110 &&
    e.charCodeAt(2) > 96 &&
    e.charCodeAt(2) < 123,
  Pc = (e, t, n, s, r, i, o, l, c) => {
    const u = r === "svg";
    t === "class"
      ? mc(e, s, u)
      : t === "style"
        ? vc(e, n, s)
        : Bt(t)
          ? ys(t) || Tc(e, t, n, s, o)
          : (
                t[0] === "."
                  ? ((t = t.slice(1)), !0)
                  : t[0] === "^"
                    ? ((t = t.slice(1)), !1)
                    : Mc(e, t, s, u)
              )
            ? Cc(e, t, s, i, o, l, c)
            : (t === "true-value" ? (e._trueValue = s) : t === "false-value" && (e._falseValue = s),
              Ec(e, t, s, u));
  };
function Mc(e, t, n, s) {
  if (s) return !!(t === "innerHTML" || t === "textContent" || (t in e && Ar(t) && K(n)));
  if (
    t === "spellcheck" ||
    t === "draggable" ||
    t === "translate" ||
    t === "form" ||
    (t === "list" && e.tagName === "INPUT") ||
    (t === "type" && e.tagName === "TEXTAREA")
  )
    return !1;
  if (t === "width" || t === "height") {
    const r = e.tagName;
    if (r === "IMG" || r === "VIDEO" || r === "CANVAS" || r === "SOURCE") return !1;
  }
  return Ar(t) && ne(n) ? !1 : t in e;
}
const Nc = ["ctrl", "shift", "alt", "meta"],
  Fc = {
    stop: (e) => e.stopPropagation(),
    prevent: (e) => e.preventDefault(),
    self: (e) => e.target !== e.currentTarget,
    ctrl: (e) => !e.ctrlKey,
    shift: (e) => !e.shiftKey,
    alt: (e) => !e.altKey,
    meta: (e) => !e.metaKey,
    left: (e) => "button" in e && e.button !== 0,
    middle: (e) => "button" in e && e.button !== 1,
    right: (e) => "button" in e && e.button !== 2,
    exact: (e, t) => Nc.some((n) => e[`${n}Key`] && !t.includes(n)),
  },
  za = (e, t) => {
    const n = e._withMods || (e._withMods = {}),
      s = t.join(".");
    return (
      n[s] ||
      (n[s] = (r, ...i) => {
        for (let o = 0; o < t.length; o++) {
          const l = Fc[t[o]];
          if (l && l(r, t)) return;
        }
        return e(r, ...i);
      })
    );
  },
  $c = {
    esc: "escape",
    space: " ",
    up: "arrow-up",
    left: "arrow-left",
    right: "arrow-right",
    down: "arrow-down",
    delete: "backspace",
  },
  Xa = (e, t) => {
    const n = e._withKeys || (e._withKeys = {}),
      s = t.join(".");
    return (
      n[s] ||
      (n[s] = (r) => {
        if (!("key" in r)) return;
        const i = at(r.key);
        if (t.some((o) => o === i || $c[o] === i)) return e(r);
      })
    );
  },
  Hc = ie({ patchProp: Pc }, uc);
let zn,
  Rr = !1;
function jc() {
  return (zn = Rr ? zn : Wl(Hc)), (Rr = !0), zn;
}
const Ya = (...e) => {
  const t = jc().createApp(...e),
    { mount: n } = t;
  return (
    (t.mount = (s) => {
      const r = Dc(s);
      if (r) return n(r, !0, Vc(r));
    }),
    t
  );
};
function Vc(e) {
  if (e instanceof SVGElement) return "svg";
  if (typeof MathMLElement == "function" && e instanceof MathMLElement) return "mathml";
}
function Dc(e) {
  return ne(e) ? document.querySelector(e) : e;
}
const Ja = (e, t) => {
    const n = e.__vccOpts || e;
    for (const [s, r] of t) n[s] = r;
    return n;
  },
  Uc = "modulepreload",
  Bc = function (e) {
    return "/" + e;
  },
  Or = {},
  Qa = function (t, n, s) {
    let r = Promise.resolve();
    if (n && n.length > 0) {
      const i = document.getElementsByTagName("link"),
        o = document.querySelector("meta[property=csp-nonce]"),
        l = (o == null ? void 0 : o.nonce) || (o == null ? void 0 : o.getAttribute("nonce"));
      r = Promise.all(
        n.map((c) => {
          if (((c = Bc(c)), c in Or)) return;
          Or[c] = !0;
          const u = c.endsWith(".css"),
            d = u ? '[rel="stylesheet"]' : "";
          if (!!s)
            for (let v = i.length - 1; v >= 0; v--) {
              const R = i[v];
              if (R.href === c && (!u || R.rel === "stylesheet")) return;
            }
          else if (document.querySelector(`link[href="${c}"]${d}`)) return;
          const p = document.createElement("link");
          if (
            ((p.rel = u ? "stylesheet" : Uc),
            u || ((p.as = "script"), (p.crossOrigin = "")),
            (p.href = c),
            l && p.setAttribute("nonce", l),
            document.head.appendChild(p),
            u)
          )
            return new Promise((v, R) => {
              p.addEventListener("load", v),
                p.addEventListener("error", () => R(new Error(`Unable to preload CSS for ${c}`)));
            });
        }),
      );
    }
    return r
      .then(() => t())
      .catch((i) => {
        const o = new Event("vite:preloadError", { cancelable: !0 });
        if (((o.payload = i), window.dispatchEvent(o), !o.defaultPrevented)) throw i;
      });
  },
  kc = window.__VP_SITE_DATA__;
function js(e) {
  return Kr() ? (Eo(e), !0) : !1;
}
function Je(e) {
  return typeof e == "function" ? e() : oi(e);
}
const Wi = typeof window < "u" && typeof document < "u";
typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
const Kc = Object.prototype.toString,
  Wc = (e) => Kc.call(e) === "[object Object]",
  $t = () => {},
  gs = qc();
function qc() {
  var e, t;
  return (
    Wi &&
    ((e = window == null ? void 0 : window.navigator) == null ? void 0 : e.userAgent) &&
    (/iP(ad|hone|od)/.test(window.navigator.userAgent) ||
      (((t = window == null ? void 0 : window.navigator) == null ? void 0 : t.maxTouchPoints) > 2 &&
        /iPad|Macintosh/.test(window == null ? void 0 : window.navigator.userAgent)))
  );
}
function Gc(e, t) {
  function n(...s) {
    return new Promise((r, i) => {
      Promise.resolve(e(() => t.apply(this, s), { fn: t, thisArg: this, args: s }))
        .then(r)
        .catch(i);
    });
  }
  return n;
}
const qi = (e) => e();
function zc(e = qi) {
  const t = fe(!0);
  function n() {
    t.value = !1;
  }
  function s() {
    t.value = !0;
  }
  const r = (...i) => {
    t.value && e(...i);
  };
  return { isActive: xn(t), pause: n, resume: s, eventFilter: r };
}
function Xc(e) {
  return e || Nn();
}
function Gi(...e) {
  if (e.length !== 1) return Jo(...e);
  const t = e[0];
  return typeof t == "function" ? xn(zo(() => ({ get: t, set: $t }))) : fe(t);
}
function Yc(e, t, n = {}) {
  const { eventFilter: s = qi, ...r } = n;
  return je(e, Gc(s, t), r);
}
function Jc(e, t, n = {}) {
  const { eventFilter: s, ...r } = n,
    { eventFilter: i, pause: o, resume: l, isActive: c } = zc(s);
  return { stop: Yc(e, t, { ...r, eventFilter: i }), pause: o, resume: l, isActive: c };
}
function Vs(e, t = !0, n) {
  Xc() ? Tt(e, n) : t ? e() : Tn(e);
}
function gt(e) {
  var t;
  const n = Je(e);
  return (t = n == null ? void 0 : n.$el) != null ? t : n;
}
const Ne = Wi ? window : void 0;
function Ve(...e) {
  let t, n, s, r;
  if (
    (typeof e[0] == "string" || Array.isArray(e[0])
      ? (([n, s, r] = e), (t = Ne))
      : ([t, n, s, r] = e),
    !t)
  )
    return $t;
  Array.isArray(n) || (n = [n]), Array.isArray(s) || (s = [s]);
  const i = [],
    o = () => {
      i.forEach((d) => d()), (i.length = 0);
    },
    l = (d, h, p, v) => (d.addEventListener(h, p, v), () => d.removeEventListener(h, p, v)),
    c = je(
      () => [gt(t), Je(r)],
      ([d, h]) => {
        if ((o(), !d)) return;
        const p = Wc(h) ? { ...h } : h;
        i.push(...n.flatMap((v) => s.map((R) => l(d, v, R, p))));
      },
      { immediate: !0, flush: "post" },
    ),
    u = () => {
      c(), o();
    };
  return js(u), u;
}
let Lr = !1;
function Za(e, t, n = {}) {
  const { window: s = Ne, ignore: r = [], capture: i = !0, detectIframe: o = !1 } = n;
  if (!s) return $t;
  gs &&
    !Lr &&
    ((Lr = !0),
    Array.from(s.document.body.children).forEach((p) => p.addEventListener("click", $t)),
    s.document.documentElement.addEventListener("click", $t));
  let l = !0;
  const c = (p) =>
      r.some((v) => {
        if (typeof v == "string")
          return Array.from(s.document.querySelectorAll(v)).some(
            (R) => R === p.target || p.composedPath().includes(R),
          );
        {
          const R = gt(v);
          return R && (p.target === R || p.composedPath().includes(R));
        }
      }),
    d = [
      Ve(
        s,
        "click",
        (p) => {
          const v = gt(e);
          if (!(!v || v === p.target || p.composedPath().includes(v))) {
            if ((p.detail === 0 && (l = !c(p)), !l)) {
              l = !0;
              return;
            }
            t(p);
          }
        },
        { passive: !0, capture: i },
      ),
      Ve(
        s,
        "pointerdown",
        (p) => {
          const v = gt(e);
          l = !c(p) && !!(v && !p.composedPath().includes(v));
        },
        { passive: !0 },
      ),
      o &&
        Ve(s, "blur", (p) => {
          setTimeout(() => {
            var v;
            const R = gt(e);
            ((v = s.document.activeElement) == null ? void 0 : v.tagName) === "IFRAME" &&
              !(R != null && R.contains(s.document.activeElement)) &&
              t(p);
          }, 0);
        }),
    ].filter(Boolean);
  return () => d.forEach((p) => p());
}
function Qc(e) {
  return typeof e == "function"
    ? e
    : typeof e == "string"
      ? (t) => t.key === e
      : Array.isArray(e)
        ? (t) => e.includes(t.key)
        : () => !0;
}
function eu(...e) {
  let t,
    n,
    s = {};
  e.length === 3
    ? ((t = e[0]), (n = e[1]), (s = e[2]))
    : e.length === 2
      ? typeof e[1] == "object"
        ? ((t = !0), (n = e[0]), (s = e[1]))
        : ((t = e[0]), (n = e[1]))
      : ((t = !0), (n = e[0]));
  const { target: r = Ne, eventName: i = "keydown", passive: o = !1, dedupe: l = !1 } = s,
    c = Qc(t);
  return Ve(
    r,
    i,
    (d) => {
      (d.repeat && Je(l)) || (c(d) && n(d));
    },
    o,
  );
}
function Zc() {
  const e = fe(!1),
    t = Nn();
  return (
    t &&
      Tt(() => {
        e.value = !0;
      }, t),
    e
  );
}
function ea(e) {
  const t = Zc();
  return se(() => (t.value, !!e()));
}
function zi(e, t = {}) {
  const { window: n = Ne } = t,
    s = ea(() => n && "matchMedia" in n && typeof n.matchMedia == "function");
  let r;
  const i = fe(!1),
    o = (u) => {
      i.value = u.matches;
    },
    l = () => {
      r && ("removeEventListener" in r ? r.removeEventListener("change", o) : r.removeListener(o));
    },
    c = gi(() => {
      s.value &&
        (l(),
        (r = n.matchMedia(Je(e))),
        "addEventListener" in r ? r.addEventListener("change", o) : r.addListener(o),
        (i.value = r.matches));
    });
  return (
    js(() => {
      c(), l(), (r = void 0);
    }),
    i
  );
}
const tn =
    typeof globalThis < "u"
      ? globalThis
      : typeof window < "u"
        ? window
        : typeof global < "u"
          ? global
          : typeof self < "u"
            ? self
            : {},
  nn = "__vueuse_ssr_handlers__",
  ta = na();
function na() {
  return nn in tn || (tn[nn] = tn[nn] || {}), tn[nn];
}
function Xi(e, t) {
  return ta[e] || t;
}
function sa(e) {
  return e == null
    ? "any"
    : e instanceof Set
      ? "set"
      : e instanceof Map
        ? "map"
        : e instanceof Date
          ? "date"
          : typeof e == "boolean"
            ? "boolean"
            : typeof e == "string"
              ? "string"
              : typeof e == "object"
                ? "object"
                : Number.isNaN(e)
                  ? "any"
                  : "number";
}
const ra = {
    boolean: { read: (e) => e === "true", write: (e) => String(e) },
    object: { read: (e) => JSON.parse(e), write: (e) => JSON.stringify(e) },
    number: { read: (e) => Number.parseFloat(e), write: (e) => String(e) },
    any: { read: (e) => e, write: (e) => String(e) },
    string: { read: (e) => e, write: (e) => String(e) },
    map: {
      read: (e) => new Map(JSON.parse(e)),
      write: (e) => JSON.stringify(Array.from(e.entries())),
    },
    set: { read: (e) => new Set(JSON.parse(e)), write: (e) => JSON.stringify(Array.from(e)) },
    date: { read: (e) => new Date(e), write: (e) => e.toISOString() },
  },
  Ir = "vueuse-storage";
function ia(e, t, n, s = {}) {
  var r;
  const {
      flush: i = "pre",
      deep: o = !0,
      listenToStorageChanges: l = !0,
      writeDefaults: c = !0,
      mergeDefaults: u = !1,
      shallow: d,
      window: h = Ne,
      eventFilter: p,
      onError: v = (E) => {
        console.error(E);
      },
      initOnMounted: R,
    } = s,
    M = (d ? ri : fe)(typeof t == "function" ? t() : t);
  if (!n)
    try {
      n = Xi("getDefaultStorage", () => {
        var E;
        return (E = Ne) == null ? void 0 : E.localStorage;
      })();
    } catch (E) {
      v(E);
    }
  if (!n) return M;
  const V = Je(t),
    q = sa(V),
    J = (r = s.serializer) != null ? r : ra[q],
    { pause: m, resume: _ } = Jc(M, () => L(M.value), { flush: i, deep: o, eventFilter: p });
  h &&
    l &&
    Vs(() => {
      Ve(h, "storage", O), Ve(h, Ir, j), R && O();
    }),
    R || O();
  function P(E, U) {
    h &&
      h.dispatchEvent(
        new CustomEvent(Ir, { detail: { key: e, oldValue: E, newValue: U, storageArea: n } }),
      );
  }
  function L(E) {
    try {
      const U = n.getItem(e);
      if (E == null) P(U, null), n.removeItem(e);
      else {
        const S = J.write(E);
        U !== S && (n.setItem(e, S), P(U, S));
      }
    } catch (U) {
      v(U);
    }
  }
  function D(E) {
    const U = E ? E.newValue : n.getItem(e);
    if (U == null) return c && V != null && n.setItem(e, J.write(V)), V;
    if (!E && u) {
      const S = J.read(U);
      return typeof u == "function"
        ? u(S, V)
        : q === "object" && !Array.isArray(S)
          ? { ...V, ...S }
          : S;
    } else return typeof U != "string" ? U : J.read(U);
  }
  function O(E) {
    if (!(E && E.storageArea !== n)) {
      if (E && E.key == null) {
        M.value = V;
        return;
      }
      if (!(E && E.key !== e)) {
        m();
        try {
          (E == null ? void 0 : E.newValue) !== J.write(M.value) && (M.value = D(E));
        } catch (U) {
          v(U);
        } finally {
          E ? Tn(_) : _();
        }
      }
    }
  }
  function j(E) {
    O(E.detail);
  }
  return M;
}
function Yi(e) {
  return zi("(prefers-color-scheme: dark)", e);
}
function oa(e = {}) {
  const {
      selector: t = "html",
      attribute: n = "class",
      initialValue: s = "auto",
      window: r = Ne,
      storage: i,
      storageKey: o = "vueuse-color-scheme",
      listenToStorageChanges: l = !0,
      storageRef: c,
      emitAuto: u,
      disableTransition: d = !0,
    } = e,
    h = { auto: "", light: "light", dark: "dark", ...(e.modes || {}) },
    p = Yi({ window: r }),
    v = se(() => (p.value ? "dark" : "light")),
    R = c || (o == null ? Gi(s) : ia(o, s, i, { window: r, listenToStorageChanges: l })),
    M = se(() => (R.value === "auto" ? v.value : R.value)),
    V = Xi("updateHTMLAttrs", (_, P, L) => {
      const D = typeof _ == "string" ? (r == null ? void 0 : r.document.querySelector(_)) : gt(_);
      if (!D) return;
      let O;
      if (
        (d &&
          ((O = r.document.createElement("style")),
          O.appendChild(
            document.createTextNode(
              "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}",
            ),
          ),
          r.document.head.appendChild(O)),
        P === "class")
      ) {
        const j = L.split(/\s/g);
        Object.values(h)
          .flatMap((E) => (E || "").split(/\s/g))
          .filter(Boolean)
          .forEach((E) => {
            j.includes(E) ? D.classList.add(E) : D.classList.remove(E);
          });
      } else D.setAttribute(P, L);
      d && (r.getComputedStyle(O).opacity, document.head.removeChild(O));
    });
  function q(_) {
    var P;
    V(t, n, (P = h[_]) != null ? P : _);
  }
  function J(_) {
    e.onChanged ? e.onChanged(_, q) : q(_);
  }
  je(M, J, { flush: "post", immediate: !0 }), Vs(() => J(M.value));
  const m = se({
    get() {
      return u ? R.value : M.value;
    },
    set(_) {
      R.value = _;
    },
  });
  try {
    return Object.assign(m, { store: R, system: v, state: M });
  } catch {
    return m;
  }
}
function la(e = {}) {
  const { valueDark: t = "dark", valueLight: n = "", window: s = Ne } = e,
    r = oa({
      ...e,
      onChanged: (l, c) => {
        var u;
        e.onChanged ? (u = e.onChanged) == null || u.call(e, l === "dark", c, l) : c(l);
      },
      modes: { dark: t, light: n },
    }),
    i = se(() => (r.system ? r.system.value : Yi({ window: s }).value ? "dark" : "light"));
  return se({
    get() {
      return r.value === "dark";
    },
    set(l) {
      const c = l ? "dark" : "light";
      i.value === c ? (r.value = "auto") : (r.value = c);
    },
  });
}
function Xn(e) {
  return typeof Window < "u" && e instanceof Window
    ? e.document.documentElement
    : typeof Document < "u" && e instanceof Document
      ? e.documentElement
      : e;
}
function Ji(e) {
  const t = window.getComputedStyle(e);
  if (
    t.overflowX === "scroll" ||
    t.overflowY === "scroll" ||
    (t.overflowX === "auto" && e.clientWidth < e.scrollWidth) ||
    (t.overflowY === "auto" && e.clientHeight < e.scrollHeight)
  )
    return !0;
  {
    const n = e.parentNode;
    return !n || n.tagName === "BODY" ? !1 : Ji(n);
  }
}
function ca(e) {
  const t = e || window.event,
    n = t.target;
  return Ji(n) ? !1 : t.touches.length > 1 ? !0 : (t.preventDefault && t.preventDefault(), !1);
}
const sn = new WeakMap();
function tu(e, t = !1) {
  const n = fe(t);
  let s = null;
  je(
    Gi(e),
    (o) => {
      const l = Xn(Je(o));
      if (l) {
        const c = l;
        sn.get(c) || sn.set(c, c.style.overflow), n.value && (c.style.overflow = "hidden");
      }
    },
    { immediate: !0 },
  );
  const r = () => {
      const o = Xn(Je(e));
      !o ||
        n.value ||
        (gs &&
          (s = Ve(
            o,
            "touchmove",
            (l) => {
              ca(l);
            },
            { passive: !1 },
          )),
        (o.style.overflow = "hidden"),
        (n.value = !0));
    },
    i = () => {
      var o;
      const l = Xn(Je(e));
      !l ||
        !n.value ||
        (gs && (s == null || s()),
        (l.style.overflow = (o = sn.get(l)) != null ? o : ""),
        sn.delete(l),
        (n.value = !1));
    };
  return (
    js(i),
    se({
      get() {
        return n.value;
      },
      set(o) {
        o ? r() : i();
      },
    })
  );
}
function nu(e = {}) {
  const { window: t = Ne, behavior: n = "auto" } = e;
  if (!t) return { x: fe(0), y: fe(0) };
  const s = fe(t.scrollX),
    r = fe(t.scrollY),
    i = se({
      get() {
        return s.value;
      },
      set(l) {
        scrollTo({ left: l, behavior: n });
      },
    }),
    o = se({
      get() {
        return r.value;
      },
      set(l) {
        scrollTo({ top: l, behavior: n });
      },
    });
  return (
    Ve(
      t,
      "scroll",
      () => {
        (s.value = t.scrollX), (r.value = t.scrollY);
      },
      { capture: !1, passive: !0 },
    ),
    { x: i, y: o }
  );
}
function su(e = {}) {
  const {
      window: t = Ne,
      initialWidth: n = Number.POSITIVE_INFINITY,
      initialHeight: s = Number.POSITIVE_INFINITY,
      listenOrientation: r = !0,
      includeScrollbar: i = !0,
    } = e,
    o = fe(n),
    l = fe(s),
    c = () => {
      t &&
        (i
          ? ((o.value = t.innerWidth), (l.value = t.innerHeight))
          : ((o.value = t.document.documentElement.clientWidth),
            (l.value = t.document.documentElement.clientHeight)));
    };
  if ((c(), Vs(c), Ve("resize", c, { passive: !0 }), r)) {
    const u = zi("(orientation: portrait)");
    je(u, () => c());
  }
  return { width: o, height: l };
}
var Yn = { BASE_URL: "/", MODE: "production", DEV: !1, PROD: !0, SSR: !1 },
  Jn = {};
const Qi = /^(?:[a-z]+:|\/\/)/i,
  aa = "vitepress-theme-appearance",
  ua = /#.*$/,
  fa = /[?#].*$/,
  da = /(?:(^|\/)index)?\.(?:md|html)$/,
  Ce = typeof document < "u",
  Zi = {
    relativePath: "",
    filePath: "",
    title: "404",
    description: "Not Found",
    headers: [],
    frontmatter: { sidebar: !1, layout: "page" },
    lastUpdated: 0,
    isNotFound: !0,
  };
function ha(e, t, n = !1) {
  if (t === void 0) return !1;
  if (((e = Pr(`/${e}`)), n)) return new RegExp(t).test(e);
  if (Pr(t) !== e) return !1;
  const s = t.match(ua);
  return s ? (Ce ? location.hash : "") === s[0] : !0;
}
function Pr(e) {
  return decodeURI(e).replace(fa, "").replace(da, "$1");
}
function pa(e) {
  return Qi.test(e);
}
function ga(e, t) {
  var s, r, i, o, l, c, u;
  const n =
    Object.keys(e.locales).find((d) => d !== "root" && !pa(d) && ha(t, `/${d}/`, !0)) || "root";
  return Object.assign({}, e, {
    localeIndex: n,
    lang: ((s = e.locales[n]) == null ? void 0 : s.lang) ?? e.lang,
    dir: ((r = e.locales[n]) == null ? void 0 : r.dir) ?? e.dir,
    title: ((i = e.locales[n]) == null ? void 0 : i.title) ?? e.title,
    titleTemplate: ((o = e.locales[n]) == null ? void 0 : o.titleTemplate) ?? e.titleTemplate,
    description: ((l = e.locales[n]) == null ? void 0 : l.description) ?? e.description,
    head: to(e.head, ((c = e.locales[n]) == null ? void 0 : c.head) ?? []),
    themeConfig: { ...e.themeConfig, ...((u = e.locales[n]) == null ? void 0 : u.themeConfig) },
  });
}
function eo(e, t) {
  const n = t.title || e.title,
    s = t.titleTemplate ?? e.titleTemplate;
  if (typeof s == "string" && s.includes(":title")) return s.replace(/:title/g, n);
  const r = ma(e.title, s);
  return n === r.slice(3) ? n : `${n}${r}`;
}
function ma(e, t) {
  return t === !1 ? "" : t === !0 || t === void 0 ? ` | ${e}` : e === t ? "" : ` | ${t}`;
}
function _a(e, t) {
  const [n, s] = t;
  if (n !== "meta") return !1;
  const r = Object.entries(s)[0];
  return r == null ? !1 : e.some(([i, o]) => i === n && o[r[0]] === r[1]);
}
function to(e, t) {
  return [...e.filter((n) => !_a(t, n)), ...t];
}
const ya = /[\u0000-\u001F"#$&*+,:;<=>?[\]^`{|}\u007F]/g,
  ba = /^[a-z]:/i;
function Mr(e) {
  const t = ba.exec(e),
    n = t ? t[0] : "";
  return (
    n +
    e
      .slice(n.length)
      .replace(ya, "_")
      .replace(/(^|\/)_+(?=[^/]*$)/, "$1")
  );
}
const Qn = new Set();
function va(e) {
  if (Qn.size === 0) {
    const n =
      (typeof process == "object" && (Jn == null ? void 0 : Jn.VITE_EXTRA_EXTENSIONS)) ||
      (Yn == null ? void 0 : Yn.VITE_EXTRA_EXTENSIONS) ||
      "";
    (
      "3g2,3gp,aac,ai,apng,au,avif,bin,bmp,cer,class,conf,crl,css,csv,dll,doc,eps,epub,exe,gif,gz,ics,ief,jar,jpe,jpeg,jpg,js,json,jsonld,m4a,man,mid,midi,mjs,mov,mp2,mp3,mp4,mpe,mpeg,mpg,mpp,oga,ogg,ogv,ogx,opus,otf,p10,p7c,p7m,p7s,pdf,png,ps,qt,roff,rtf,rtx,ser,svg,t,tif,tiff,tr,ts,tsv,ttf,txt,vtt,wav,weba,webm,webp,woff,woff2,xhtml,xml,yaml,yml,zip" +
      (n && typeof n == "string" ? "," + n : "")
    )
      .split(",")
      .forEach((s) => Qn.add(s));
  }
  const t = e.split(".").pop();
  return t == null || !Qn.has(t.toLowerCase());
}
const wa = Symbol(),
  ct = ri(kc);
function ru(e) {
  const t = se(() => ga(ct.value, e.data.relativePath)),
    n = t.value.appearance,
    s =
      n === "force-dark"
        ? fe(!0)
        : n
          ? la({
              storageKey: aa,
              initialValue: () => (typeof n == "string" ? n : "auto"),
              ...(typeof n == "object" ? n : {}),
            })
          : fe(!1);
  return {
    site: t,
    theme: se(() => t.value.themeConfig),
    page: se(() => e.data),
    frontmatter: se(() => e.data.frontmatter),
    params: se(() => e.data.params),
    lang: se(() => t.value.lang),
    dir: se(() => e.data.frontmatter.dir || t.value.dir),
    localeIndex: se(() => t.value.localeIndex || "root"),
    title: se(() => eo(t.value, e.data)),
    description: se(() => e.data.description || t.value.description),
    isDark: s,
  };
}
function Ea() {
  const e = Et(wa);
  if (!e) throw new Error("vitepress data not properly injected in app");
  return e;
}
function Ca(e, t) {
  return `${e}${t}`.replace(/\/+/g, "/");
}
function Nr(e) {
  return Qi.test(e) || !e.startsWith("/") ? e : Ca(ct.value.base, e);
}
function xa(e) {
  let t = e.replace(/\.html$/, "");
  if (((t = decodeURIComponent(t)), (t = t.replace(/\/$/, "/index")), Ce)) {
    const n = "/";
    t = Mr(t.slice(n.length).replace(/\//g, "_") || "index") + ".md";
    let s = __VP_HASH_MAP__[t.toLowerCase()];
    if (
      (s ||
        ((t = t.endsWith("_index.md") ? t.slice(0, -9) + ".md" : t.slice(0, -3) + "_index.md"),
        (s = __VP_HASH_MAP__[t.toLowerCase()])),
      !s)
    )
      return null;
    t = `${n}assets/${t}.${s}.js`;
  } else t = `./${Mr(t.slice(1).replace(/\//g, "_"))}.md.js`;
  return t;
}
let an = [];
function iu(e) {
  an.push(e),
    Pn(() => {
      an = an.filter((t) => t !== e);
    });
}
function Sa() {
  let e = ct.value.scrollOffset,
    t = 0,
    n = 24;
  if (
    (typeof e == "object" && "padding" in e && ((n = e.padding), (e = e.selector)),
    typeof e == "number")
  )
    t = e;
  else if (typeof e == "string") t = Fr(e, n);
  else if (Array.isArray(e))
    for (const s of e) {
      const r = Fr(s, n);
      if (r) {
        t = r;
        break;
      }
    }
  return t;
}
function Fr(e, t) {
  const n = document.querySelector(e);
  if (!n) return 0;
  const s = n.getBoundingClientRect().bottom;
  return s < 0 ? 0 : s + t;
}
const Ta = Symbol(),
  ms = "http://a.com",
  Aa = () => ({ path: "/", component: null, data: Zi });
function ou(e, t) {
  const n = Cn(Aa()),
    s = { route: n, go: r };
  async function r(l = Ce ? location.href : "/") {
    var c, u;
    if (
      ((l = Zn(l)), (await ((c = s.onBeforeRouteChange) == null ? void 0 : c.call(s, l))) !== !1)
    ) {
      if (Ce) {
        const d = new URL(location.href);
        l !== Zn(d.href) &&
          (history.replaceState({ scrollPosition: window.scrollY }, document.title),
          history.pushState(null, "", l),
          new URL(l, ms).hash !== d.hash && window.dispatchEvent(new Event("hashchange")));
      }
      await o(l), await ((u = s.onAfterRouteChanged) == null ? void 0 : u.call(s, l));
    }
  }
  let i = null;
  async function o(l, c = 0, u = !1) {
    var p;
    if ((await ((p = s.onBeforePageLoad) == null ? void 0 : p.call(s, l))) === !1) return;
    const d = new URL(l, ms),
      h = (i = d.pathname);
    try {
      let v = await e(h);
      if (!v) throw new Error(`Page not found: ${h}`);
      if (i === h) {
        i = null;
        const { default: R, __pageData: M } = v;
        if (!R) throw new Error(`Invalid route component: ${R}`);
        (n.path = Ce ? h : Nr(h)),
          (n.component = Lt(R)),
          (n.data = Lt(M)),
          Ce &&
            Tn(() => {
              let V = ct.value.base + M.relativePath.replace(/(?:(^|\/)index)?\.md$/, "$1");
              if (
                (!ct.value.cleanUrls && !V.endsWith("/") && (V += ".html"),
                V !== d.pathname &&
                  ((d.pathname = V),
                  (l = V + d.search + d.hash),
                  history.replaceState(null, "", l)),
                d.hash && !c)
              ) {
                let q = null;
                try {
                  q = document.getElementById(decodeURIComponent(d.hash).slice(1));
                } catch (J) {
                  console.warn(J);
                }
                if (q) {
                  $r(q, d.hash);
                  return;
                }
              }
              window.scrollTo(0, c);
            });
      }
    } catch (v) {
      if (
        (!/fetch|Page not found/.test(v.message) &&
          !/^\/404(\.html|\/)?$/.test(l) &&
          console.error(v),
        !u)
      )
        try {
          const R = await fetch(ct.value.base + "hashmap.json");
          (window.__VP_HASH_MAP__ = await R.json()), await o(l, c, !0);
          return;
        } catch {}
      i === h &&
        ((i = null), (n.path = Ce ? h : Nr(h)), (n.component = t ? Lt(t) : null), (n.data = Zi));
    }
  }
  return (
    Ce &&
      (window.addEventListener(
        "click",
        (l) => {
          if (l.target.closest("button")) return;
          const u = l.target.closest("a");
          if (u && !u.closest(".vp-raw") && (u instanceof SVGElement || !u.download)) {
            const { target: d } = u,
              {
                href: h,
                origin: p,
                pathname: v,
                hash: R,
                search: M,
              } = new URL(u.href instanceof SVGAnimatedString ? u.href.animVal : u.href, u.baseURI),
              V = new URL(location.href);
            !l.ctrlKey &&
              !l.shiftKey &&
              !l.altKey &&
              !l.metaKey &&
              !d &&
              p === V.origin &&
              va(v) &&
              (l.preventDefault(),
              v === V.pathname && M === V.search
                ? (R !== V.hash &&
                    (history.pushState(null, "", h), window.dispatchEvent(new Event("hashchange"))),
                  R ? $r(u, R, u.classList.contains("header-anchor")) : window.scrollTo(0, 0))
                : r(h));
          }
        },
        { capture: !0 },
      ),
      window.addEventListener("popstate", async (l) => {
        var c;
        await o(Zn(location.href), (l.state && l.state.scrollPosition) || 0),
          (c = s.onAfterRouteChanged) == null || c.call(s, location.href);
      }),
      window.addEventListener("hashchange", (l) => {
        l.preventDefault();
      })),
    s
  );
}
function Ra() {
  const e = Et(Ta);
  if (!e) throw new Error("useRouter() is called without provider.");
  return e;
}
function no() {
  return Ra().route;
}
function $r(e, t, n = !1) {
  let s = null;
  try {
    s = e.classList.contains("header-anchor")
      ? e
      : document.getElementById(decodeURIComponent(t).slice(1));
  } catch (r) {
    console.warn(r);
  }
  if (s) {
    let r = function () {
      !n || Math.abs(o - window.scrollY) > window.innerHeight
        ? window.scrollTo(0, o)
        : window.scrollTo({ left: 0, top: o, behavior: "smooth" });
    };
    const i = parseInt(window.getComputedStyle(s).paddingTop, 10),
      o = window.scrollY + s.getBoundingClientRect().top - Sa() + i;
    requestAnimationFrame(r);
  }
}
function Zn(e) {
  const t = new URL(e, ms);
  return (
    (t.pathname = t.pathname.replace(/(^|\/)index(\.html)?$/, "$1")),
    ct.value.cleanUrls
      ? (t.pathname = t.pathname.replace(/\.html$/, ""))
      : !t.pathname.endsWith("/") && !t.pathname.endsWith(".html") && (t.pathname += ".html"),
    t.pathname + t.search + t.hash
  );
}
const es = () => an.forEach((e) => e()),
  lu = vi({
    name: "VitePressContent",
    props: { as: { type: [Object, String], default: "div" } },
    setup(e) {
      const t = no(),
        { site: n } = Ea();
      return () =>
        ps(e.as, n.value.contentProps ?? { style: { position: "relative" } }, [
          t.component
            ? ps(t.component, { onVnodeMounted: es, onVnodeUpdated: es, onVnodeUnmounted: es })
            : "404 Page Not Found",
        ]);
    },
  }),
  cu = vi({
    setup(e, { slots: t }) {
      const n = fe(!1);
      return (
        Tt(() => {
          n.value = !0;
        }),
        () => (n.value && t.default ? t.default() : null)
      );
    },
  });
function au() {
  Ce &&
    window.addEventListener("click", (e) => {
      var n;
      const t = e.target;
      if (t.matches(".vp-code-group input")) {
        const s = (n = t.parentElement) == null ? void 0 : n.parentElement;
        if (!s) return;
        const r = Array.from(s.querySelectorAll("input")).indexOf(t);
        if (r < 0) return;
        const i = s.querySelector(".blocks");
        if (!i) return;
        const o = Array.from(i.children).find((u) => u.classList.contains("active"));
        if (!o) return;
        const l = i.children[r];
        if (!l || o === l) return;
        o.classList.remove("active"), l.classList.add("active");
        const c = s == null ? void 0 : s.querySelector(`label[for="${t.id}"]`);
        c == null || c.scrollIntoView({ block: "nearest" });
      }
    });
}
function uu() {
  if (Ce) {
    const e = new WeakMap();
    window.addEventListener("click", (t) => {
      var s;
      const n = t.target;
      if (n.matches('div[class*="language-"] > button.copy')) {
        const r = n.parentElement,
          i = (s = n.nextElementSibling) == null ? void 0 : s.nextElementSibling;
        if (!r || !i) return;
        const o = /language-(shellscript|shell|bash|sh|zsh)/.test(r.className),
          l = [".vp-copy-ignore", ".diff.remove"],
          c = i.cloneNode(!0);
        c.querySelectorAll(l.join(",")).forEach((d) => d.remove());
        let u = c.textContent || "";
        o && (u = u.replace(/^ *(\$|>) /gm, "").trim()),
          Oa(u).then(() => {
            n.classList.add("copied"), clearTimeout(e.get(n));
            const d = setTimeout(() => {
              n.classList.remove("copied"), n.blur(), e.delete(n);
            }, 2e3);
            e.set(n, d);
          });
      }
    });
  }
}
async function Oa(e) {
  try {
    return navigator.clipboard.writeText(e);
  } catch {
    const t = document.createElement("textarea"),
      n = document.activeElement;
    (t.value = e),
      t.setAttribute("readonly", ""),
      (t.style.contain = "strict"),
      (t.style.position = "absolute"),
      (t.style.left = "-9999px"),
      (t.style.fontSize = "12pt");
    const s = document.getSelection(),
      r = s ? s.rangeCount > 0 && s.getRangeAt(0) : null;
    document.body.appendChild(t),
      t.select(),
      (t.selectionStart = 0),
      (t.selectionEnd = e.length),
      document.execCommand("copy"),
      document.body.removeChild(t),
      r && (s.removeAllRanges(), s.addRange(r)),
      n && n.focus();
  }
}
function fu(e, t) {
  let n = !0,
    s = [];
  const r = (i) => {
    if (n) {
      (n = !1),
        i.forEach((l) => {
          const c = ts(l);
          for (const u of document.head.children)
            if (u.isEqualNode(c)) {
              s.push(u);
              return;
            }
        });
      return;
    }
    const o = i.map(ts);
    s.forEach((l, c) => {
      const u = o.findIndex((d) => (d == null ? void 0 : d.isEqualNode(l ?? null)));
      u !== -1 ? delete o[u] : (l == null || l.remove(), delete s[c]);
    }),
      o.forEach((l) => l && document.head.appendChild(l)),
      (s = [...s, ...o].filter(Boolean));
  };
  gi(() => {
    const i = e.data,
      o = t.value,
      l = i && i.description,
      c = (i && i.frontmatter.head) || [],
      u = eo(o, i);
    u !== document.title && (document.title = u);
    const d = l || o.description;
    let h = document.querySelector("meta[name=description]");
    h
      ? h.getAttribute("content") !== d && h.setAttribute("content", d)
      : ts(["meta", { name: "description", content: d }]),
      r(to(o.head, Ia(c)));
  });
}
function ts([e, t, n]) {
  const s = document.createElement(e);
  for (const r in t) s.setAttribute(r, t[r]);
  return n && (s.innerHTML = n), e === "script" && !t.async && (s.async = !1), s;
}
function La(e) {
  return e[0] === "meta" && e[1] && e[1].name === "description";
}
function Ia(e) {
  return e.filter((t) => !La(t));
}
const ns = new Set(),
  so = () => document.createElement("link"),
  Pa = (e) => {
    const t = so();
    (t.rel = "prefetch"), (t.href = e), document.head.appendChild(t);
  },
  Ma = (e) => {
    const t = new XMLHttpRequest();
    t.open("GET", e, (t.withCredentials = !0)), t.send();
  };
let rn;
const Na =
  Ce && (rn = so()) && rn.relList && rn.relList.supports && rn.relList.supports("prefetch")
    ? Pa
    : Ma;
function du() {
  if (!Ce || !window.IntersectionObserver) return;
  let e;
  if ((e = navigator.connection) && (e.saveData || /2g/.test(e.effectiveType))) return;
  const t = window.requestIdleCallback || setTimeout;
  let n = null;
  const s = () => {
    n && n.disconnect(),
      (n = new IntersectionObserver((i) => {
        i.forEach((o) => {
          if (o.isIntersecting) {
            const l = o.target;
            n.unobserve(l);
            const { pathname: c } = l;
            if (!ns.has(c)) {
              ns.add(c);
              const u = xa(c);
              u && Na(u);
            }
          }
        });
      })),
      t(() => {
        document.querySelectorAll("#app a").forEach((i) => {
          const { hostname: o, pathname: l } = new URL(
              i.href instanceof SVGAnimatedString ? i.href.animVal : i.href,
              i.baseURI,
            ),
            c = l.match(/\.\w+$/);
          (c && c[0] !== ".html") ||
            (i.target !== "_blank" &&
              o === location.hostname &&
              (l !== location.pathname ? n.observe(i) : ns.add(l)));
        });
      });
  };
  Tt(s);
  const r = no();
  je(() => r.path, s),
    Pn(() => {
      n && n.disconnect();
    });
}
export {
  ka as $,
  Pn as A,
  Da as B,
  El as C,
  Sa as D,
  ja as E,
  me as F,
  Ua as G,
  ri as H,
  iu as I,
  ae as J,
  Va as K,
  Qi as L,
  no as M,
  Ql as N,
  Et as O,
  su as P,
  ws as Q,
  Za as R,
  eu as S,
  ki as T,
  Tn as U,
  nu as V,
  xn as W,
  tu as X,
  $l as Y,
  Xa as Z,
  Ja as _,
  Vi as a,
  za as a0,
  Ka as a1,
  qa as a2,
  fu as a3,
  Ta as a4,
  ru as a5,
  wa as a6,
  lu as a7,
  cu as a8,
  ct as a9,
  Ya as aa,
  ou as ab,
  xa as ac,
  Qa as ad,
  du as ae,
  uu as af,
  au as ag,
  ps as ah,
  $i as b,
  Wa as c,
  vi as d,
  Ga as e,
  va as f,
  Nr as g,
  fe as h,
  pa as i,
  Ce as j,
  se as k,
  Tt as l,
  ji as m,
  Es as n,
  Ni as o,
  oi as p,
  $a as q,
  Ba as r,
  Ha as s,
  Fa as t,
  Ea as u,
  ha as v,
  il as w,
  zi as x,
  je as y,
  gi as z,
};
