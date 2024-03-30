import {
  _ as bg,
  h as vg,
  l as xg,
  o as Zh,
  c as _h,
  J as Sg,
  a2 as $g,
} from "./chunks/framework.CQ12TVIp.js";
function te(n) {
  this.content = n;
}
te.prototype = {
  constructor: te,
  find: function (n) {
    for (var e = 0; e < this.content.length; e += 2) if (this.content[e] === n) return e;
    return -1;
  },
  get: function (n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  update: function (n, e, t) {
    var o = t && t != n ? this.remove(t) : this,
      r = o.find(n),
      i = o.content.slice();
    return r == -1 ? i.push(t || n, e) : ((i[r + 1] = e), t && (i[r] = t)), new te(i);
  },
  remove: function (n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new te(t);
  },
  addToStart: function (n, e) {
    return new te([n, e].concat(this.remove(n).content));
  },
  addToEnd: function (n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new te(t);
  },
  addBefore: function (n, e, t) {
    var o = this.remove(e),
      r = o.content.slice(),
      i = o.find(n);
    return r.splice(i == -1 ? r.length : i, 0, e, t), new te(r);
  },
  forEach: function (n) {
    for (var e = 0; e < this.content.length; e += 2) n(this.content[e], this.content[e + 1]);
  },
  prepend: function (n) {
    return (n = te.from(n)), n.size ? new te(n.content.concat(this.subtract(n).content)) : this;
  },
  append: function (n) {
    return (n = te.from(n)), n.size ? new te(this.subtract(n).content.concat(n.content)) : this;
  },
  subtract: function (n) {
    var e = this;
    n = te.from(n);
    for (var t = 0; t < n.content.length; t += 2) e = e.remove(n.content[t]);
    return e;
  },
  toObject: function () {
    var n = {};
    return (
      this.forEach(function (e, t) {
        n[e] = t;
      }),
      n
    );
  },
  get size() {
    return this.content.length >> 1;
  },
};
te.from = function (n) {
  if (n instanceof te) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new te(e);
};
function ep(n, e, t) {
  for (let o = 0; ; o++) {
    if (o == n.childCount || o == e.childCount) return n.childCount == e.childCount ? null : t;
    let r = n.child(o),
      i = e.child(o);
    if (r == i) {
      t += r.nodeSize;
      continue;
    }
    if (!r.sameMarkup(i)) return t;
    if (r.isText && r.text != i.text) {
      for (let s = 0; r.text[s] == i.text[s]; s++) t++;
      return t;
    }
    if (r.content.size || i.content.size) {
      let s = ep(r.content, i.content, t + 1);
      if (s != null) return s;
    }
    t += r.nodeSize;
  }
}
function tp(n, e, t, o) {
  for (let r = n.childCount, i = e.childCount; ; ) {
    if (r == 0 || i == 0) return r == i ? null : { a: t, b: o };
    let s = n.child(--r),
      l = e.child(--i),
      a = s.nodeSize;
    if (s == l) {
      (t -= a), (o -= a);
      continue;
    }
    if (!s.sameMarkup(l)) return { a: t, b: o };
    if (s.isText && s.text != l.text) {
      let c = 0,
        d = Math.min(s.text.length, l.text.length);
      for (; c < d && s.text[s.text.length - c - 1] == l.text[l.text.length - c - 1]; )
        c++, t--, o--;
      return { a: t, b: o };
    }
    if (s.content.size || l.content.size) {
      let c = tp(s.content, l.content, t - 1, o - 1);
      if (c) return c;
    }
    (t -= a), (o -= a);
  }
}
let k = class me {
  constructor(e, t) {
    if (((this.content = e), (this.size = t || 0), t == null))
      for (let o = 0; o < e.length; o++) this.size += e[o].nodeSize;
  }
  nodesBetween(e, t, o, r = 0, i) {
    for (let s = 0, l = 0; l < t; s++) {
      let a = this.content[s],
        c = l + a.nodeSize;
      if (c > e && o(a, r + l, i || null, s) !== !1 && a.content.size) {
        let d = l + 1;
        a.nodesBetween(Math.max(0, e - d), Math.min(a.content.size, t - d), o, r + d);
      }
      l = c;
    }
  }
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  textBetween(e, t, o, r) {
    let i = "",
      s = !0;
    return (
      this.nodesBetween(
        e,
        t,
        (l, a) => {
          let c = l.isText
            ? l.text.slice(Math.max(e, a) - a, t - a)
            : l.isLeaf
              ? r
                ? typeof r == "function"
                  ? r(l)
                  : r
                : l.type.spec.leafText
                  ? l.type.spec.leafText(l)
                  : ""
              : "";
          l.isBlock && ((l.isLeaf && c) || l.isTextblock) && o && (s ? (s = !1) : (i += o)),
            (i += c);
        },
        0,
      ),
      i
    );
  }
  append(e) {
    if (!e.size) return this;
    if (!this.size) return e;
    let t = this.lastChild,
      o = e.firstChild,
      r = this.content.slice(),
      i = 0;
    for (
      t.isText && t.sameMarkup(o) && ((r[r.length - 1] = t.withText(t.text + o.text)), (i = 1));
      i < e.content.length;
      i++
    )
      r.push(e.content[i]);
    return new me(r, this.size + e.size);
  }
  cut(e, t = this.size) {
    if (e == 0 && t == this.size) return this;
    let o = [],
      r = 0;
    if (t > e)
      for (let i = 0, s = 0; s < t; i++) {
        let l = this.content[i],
          a = s + l.nodeSize;
        a > e &&
          ((s < e || a > t) &&
            (l.isText
              ? (l = l.cut(Math.max(0, e - s), Math.min(l.text.length, t - s)))
              : (l = l.cut(Math.max(0, e - s - 1), Math.min(l.content.size, t - s - 1)))),
          o.push(l),
          (r += l.nodeSize)),
          (s = a);
      }
    return new me(o, r);
  }
  cutByIndex(e, t) {
    return e == t
      ? me.empty
      : e == 0 && t == this.content.length
        ? this
        : new me(this.content.slice(e, t));
  }
  replaceChild(e, t) {
    let o = this.content[e];
    if (o == t) return this;
    let r = this.content.slice(),
      i = this.size + t.nodeSize - o.nodeSize;
    return (r[e] = t), new me(r, i);
  }
  addToStart(e) {
    return new me([e].concat(this.content), this.size + e.nodeSize);
  }
  addToEnd(e) {
    return new me(this.content.concat(e), this.size + e.nodeSize);
  }
  eq(e) {
    if (this.content.length != e.content.length) return !1;
    for (let t = 0; t < this.content.length; t++) if (!this.content[t].eq(e.content[t])) return !1;
    return !0;
  }
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  get childCount() {
    return this.content.length;
  }
  child(e) {
    let t = this.content[e];
    if (!t) throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  maybeChild(e) {
    return this.content[e] || null;
  }
  forEach(e) {
    for (let t = 0, o = 0; t < this.content.length; t++) {
      let r = this.content[t];
      e(r, o, t), (o += r.nodeSize);
    }
  }
  findDiffStart(e, t = 0) {
    return ep(this, e, t);
  }
  findDiffEnd(e, t = this.size, o = e.size) {
    return tp(this, e, t, o);
  }
  findIndex(e, t = -1) {
    if (e == 0) return Rr(0, e);
    if (e == this.size) return Rr(this.content.length, e);
    if (e > this.size || e < 0) throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let o = 0, r = 0; ; o++) {
      let i = this.child(o),
        s = r + i.nodeSize;
      if (s >= e) return s == e || t > 0 ? Rr(o + 1, s) : Rr(o, r);
      r = s;
    }
  }
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  toStringInner() {
    return this.content.join(", ");
  }
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  static fromJSON(e, t) {
    if (!t) return me.empty;
    if (!Array.isArray(t)) throw new RangeError("Invalid input for Fragment.fromJSON");
    return new me(t.map(e.nodeFromJSON));
  }
  static fromArray(e) {
    if (!e.length) return me.empty;
    let t,
      o = 0;
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      (o += i.nodeSize),
        r && i.isText && e[r - 1].sameMarkup(i)
          ? (t || (t = e.slice(0, r)),
            (t[t.length - 1] = i.withText(t[t.length - 1].text + i.text)))
          : t && t.push(i);
    }
    return new me(t || e, o);
  }
  static from(e) {
    if (!e) return me.empty;
    if (e instanceof me) return e;
    if (Array.isArray(e)) return this.fromArray(e);
    if (e.attrs) return new me([e], e.nodeSize);
    throw new RangeError(
      "Can not convert " +
        e +
        " to a Fragment" +
        (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""),
    );
  }
};
k.empty = new k([], 0);
const cs = { index: 0, offset: 0 };
function Rr(n, e) {
  return (cs.index = n), (cs.offset = e), cs;
}
function li(n, e) {
  if (n === e) return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object")) return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t) return !1;
  if (t) {
    if (n.length != e.length) return !1;
    for (let o = 0; o < n.length; o++) if (!li(n[o], e[o])) return !1;
  } else {
    for (let o in n) if (!(o in e) || !li(n[o], e[o])) return !1;
    for (let o in e) if (!(o in n)) return !1;
  }
  return !0;
}
let K = class cl {
  constructor(e, t) {
    (this.type = e), (this.attrs = t);
  }
  addToSet(e) {
    let t,
      o = !1;
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.eq(i)) return e;
      if (this.type.excludes(i.type)) t || (t = e.slice(0, r));
      else {
        if (i.type.excludes(this.type)) return e;
        !o && i.type.rank > this.type.rank && (t || (t = e.slice(0, r)), t.push(this), (o = !0)),
          t && t.push(i);
      }
    }
    return t || (t = e.slice()), o || t.push(this), t;
  }
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  isInSet(e) {
    for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
    return !1;
  }
  eq(e) {
    return this == e || (this.type == e.type && li(this.attrs, e.attrs));
  }
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  static fromJSON(e, t) {
    if (!t) throw new RangeError("Invalid input for Mark.fromJSON");
    let o = e.marks[t.type];
    if (!o) throw new RangeError(`There is no mark type ${t.type} in this schema`);
    return o.create(t.attrs);
  }
  static sameSet(e, t) {
    if (e == t) return !0;
    if (e.length != t.length) return !1;
    for (let o = 0; o < e.length; o++) if (!e[o].eq(t[o])) return !1;
    return !0;
  }
  static setFrom(e) {
    if (!e || (Array.isArray(e) && e.length == 0)) return cl.none;
    if (e instanceof cl) return [e];
    let t = e.slice();
    return t.sort((o, r) => o.type.rank - r.type.rank), t;
  }
};
K.none = [];
let ai = class extends Error {},
  S = class Nn {
    constructor(e, t, o) {
      (this.content = e), (this.openStart = t), (this.openEnd = o);
    }
    get size() {
      return this.content.size - this.openStart - this.openEnd;
    }
    insertAt(e, t) {
      let o = op(this.content, e + this.openStart, t);
      return o && new Nn(o, this.openStart, this.openEnd);
    }
    removeBetween(e, t) {
      return new Nn(
        np(this.content, e + this.openStart, t + this.openStart),
        this.openStart,
        this.openEnd,
      );
    }
    eq(e) {
      return (
        this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd
      );
    }
    toString() {
      return this.content + "(" + this.openStart + "," + this.openEnd + ")";
    }
    toJSON() {
      if (!this.content.size) return null;
      let e = { content: this.content.toJSON() };
      return (
        this.openStart > 0 && (e.openStart = this.openStart),
        this.openEnd > 0 && (e.openEnd = this.openEnd),
        e
      );
    }
    static fromJSON(e, t) {
      if (!t) return Nn.empty;
      let o = t.openStart || 0,
        r = t.openEnd || 0;
      if (typeof o != "number" || typeof r != "number")
        throw new RangeError("Invalid input for Slice.fromJSON");
      return new Nn(k.fromJSON(e, t.content), o, r);
    }
    static maxOpen(e, t = !0) {
      let o = 0,
        r = 0;
      for (let i = e.firstChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.firstChild)
        o++;
      for (let i = e.lastChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.lastChild)
        r++;
      return new Nn(e, o, r);
    }
  };
S.empty = new S(k.empty, 0, 0);
function np(n, e, t) {
  let { index: o, offset: r } = n.findIndex(e),
    i = n.maybeChild(o),
    { index: s, offset: l } = n.findIndex(t);
  if (r == e || i.isText) {
    if (l != t && !n.child(s).isText) throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (o != s) throw new RangeError("Removing non-flat range");
  return n.replaceChild(o, i.copy(np(i.content, e - r - 1, t - r - 1)));
}
function op(n, e, t, o) {
  let { index: r, offset: i } = n.findIndex(e),
    s = n.maybeChild(r);
  if (i == e || s.isText)
    return o && !o.canReplace(r, r, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let l = op(s.content, e - i - 1, t);
  return l && n.replaceChild(r, s.copy(l));
}
function Mg(n, e, t) {
  if (t.openStart > n.depth) throw new ai("Inserted content deeper than insertion position");
  if (n.depth - t.openStart != e.depth - t.openEnd) throw new ai("Inconsistent open depths");
  return rp(n, e, t, 0);
}
function rp(n, e, t, o) {
  let r = n.index(o),
    i = n.node(o);
  if (r == e.index(o) && o < n.depth - t.openStart) {
    let s = rp(n, e, t, o + 1);
    return i.copy(i.content.replaceChild(r, s));
  } else if (t.content.size)
    if (!t.openStart && !t.openEnd && n.depth == o && e.depth == o) {
      let s = n.parent,
        l = s.content;
      return Zt(s, l.cut(0, n.parentOffset).append(t.content).append(l.cut(e.parentOffset)));
    } else {
      let { start: s, end: l } = Cg(t, n);
      return Zt(i, sp(n, s, l, e, o));
    }
  else return Zt(i, ci(n, e, o));
}
function ip(n, e) {
  if (!e.type.compatibleContent(n.type))
    throw new ai("Cannot join " + e.type.name + " onto " + n.type.name);
}
function dl(n, e, t) {
  let o = n.node(t);
  return ip(o, e.node(t)), o;
}
function Qt(n, e) {
  let t = e.length - 1;
  t >= 0 && n.isText && n.sameMarkup(e[t]) ? (e[t] = n.withText(e[t].text + n.text)) : e.push(n);
}
function Lo(n, e, t, o) {
  let r = (e || n).node(t),
    i = 0,
    s = e ? e.index(t) : r.childCount;
  n && ((i = n.index(t)), n.depth > t ? i++ : n.textOffset && (Qt(n.nodeAfter, o), i++));
  for (let l = i; l < s; l++) Qt(r.child(l), o);
  e && e.depth == t && e.textOffset && Qt(e.nodeBefore, o);
}
function Zt(n, e) {
  return n.type.checkContent(e), n.copy(e);
}
function sp(n, e, t, o, r) {
  let i = n.depth > r && dl(n, e, r + 1),
    s = o.depth > r && dl(t, o, r + 1),
    l = [];
  return (
    Lo(null, n, r, l),
    i && s && e.index(r) == t.index(r)
      ? (ip(i, s), Qt(Zt(i, sp(n, e, t, o, r + 1)), l))
      : (i && Qt(Zt(i, ci(n, e, r + 1)), l), Lo(e, t, r, l), s && Qt(Zt(s, ci(t, o, r + 1)), l)),
    Lo(o, null, r, l),
    new k(l)
  );
}
function ci(n, e, t) {
  let o = [];
  if ((Lo(null, n, t, o), n.depth > t)) {
    let r = dl(n, e, t + 1);
    Qt(Zt(r, ci(n, e, t + 1)), o);
  }
  return Lo(e, null, t, o), new k(o);
}
function Cg(n, e) {
  let t = e.depth - n.openStart,
    o = e.node(t).copy(n.content);
  for (let r = t - 1; r >= 0; r--) o = e.node(r).copy(k.from(o));
  return {
    start: o.resolveNoCache(n.openStart + t),
    end: o.resolveNoCache(o.content.size - n.openEnd - t),
  };
}
let Cc = class hl {
    constructor(e, t, o) {
      (this.pos = e), (this.path = t), (this.parentOffset = o), (this.depth = t.length / 3 - 1);
    }
    resolveDepth(e) {
      return e == null ? this.depth : e < 0 ? this.depth + e : e;
    }
    get parent() {
      return this.node(this.depth);
    }
    get doc() {
      return this.node(0);
    }
    node(e) {
      return this.path[this.resolveDepth(e) * 3];
    }
    index(e) {
      return this.path[this.resolveDepth(e) * 3 + 1];
    }
    indexAfter(e) {
      return (
        (e = this.resolveDepth(e)), this.index(e) + (e == this.depth && !this.textOffset ? 0 : 1)
      );
    }
    start(e) {
      return (e = this.resolveDepth(e)), e == 0 ? 0 : this.path[e * 3 - 1] + 1;
    }
    end(e) {
      return (e = this.resolveDepth(e)), this.start(e) + this.node(e).content.size;
    }
    before(e) {
      if (((e = this.resolveDepth(e)), !e))
        throw new RangeError("There is no position before the top-level node");
      return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1];
    }
    after(e) {
      if (((e = this.resolveDepth(e)), !e))
        throw new RangeError("There is no position after the top-level node");
      return e == this.depth + 1 ? this.pos : this.path[e * 3 - 1] + this.path[e * 3].nodeSize;
    }
    get textOffset() {
      return this.pos - this.path[this.path.length - 1];
    }
    get nodeAfter() {
      let e = this.parent,
        t = this.index(this.depth);
      if (t == e.childCount) return null;
      let o = this.pos - this.path[this.path.length - 1],
        r = e.child(t);
      return o ? e.child(t).cut(o) : r;
    }
    get nodeBefore() {
      let e = this.index(this.depth),
        t = this.pos - this.path[this.path.length - 1];
      return t ? this.parent.child(e).cut(0, t) : e == 0 ? null : this.parent.child(e - 1);
    }
    posAtIndex(e, t) {
      t = this.resolveDepth(t);
      let o = this.path[t * 3],
        r = t == 0 ? 0 : this.path[t * 3 - 1] + 1;
      for (let i = 0; i < e; i++) r += o.child(i).nodeSize;
      return r;
    }
    marks() {
      let e = this.parent,
        t = this.index();
      if (e.content.size == 0) return K.none;
      if (this.textOffset) return e.child(t).marks;
      let o = e.maybeChild(t - 1),
        r = e.maybeChild(t);
      if (!o) {
        let l = o;
        (o = r), (r = l);
      }
      let i = o.marks;
      for (var s = 0; s < i.length; s++)
        i[s].type.spec.inclusive === !1 &&
          (!r || !i[s].isInSet(r.marks)) &&
          (i = i[s--].removeFromSet(i));
      return i;
    }
    marksAcross(e) {
      let t = this.parent.maybeChild(this.index());
      if (!t || !t.isInline) return null;
      let o = t.marks,
        r = e.parent.maybeChild(e.index());
      for (var i = 0; i < o.length; i++)
        o[i].type.spec.inclusive === !1 &&
          (!r || !o[i].isInSet(r.marks)) &&
          (o = o[i--].removeFromSet(o));
      return o;
    }
    sharedDepth(e) {
      for (let t = this.depth; t > 0; t--) if (this.start(t) <= e && this.end(t) >= e) return t;
      return 0;
    }
    blockRange(e = this, t) {
      if (e.pos < this.pos) return e.blockRange(this);
      for (
        let o = this.depth - (this.parent.inlineContent || this.pos == e.pos ? 1 : 0);
        o >= 0;
        o--
      )
        if (e.pos <= this.end(o) && (!t || t(this.node(o)))) return new di(this, e, o);
      return null;
    }
    sameParent(e) {
      return this.pos - this.parentOffset == e.pos - e.parentOffset;
    }
    max(e) {
      return e.pos > this.pos ? e : this;
    }
    min(e) {
      return e.pos < this.pos ? e : this;
    }
    toString() {
      let e = "";
      for (let t = 1; t <= this.depth; t++)
        e += (e ? "/" : "") + this.node(t).type.name + "_" + this.index(t - 1);
      return e + ":" + this.parentOffset;
    }
    static resolve(e, t) {
      if (!(t >= 0 && t <= e.content.size)) throw new RangeError("Position " + t + " out of range");
      let o = [],
        r = 0,
        i = t;
      for (let s = e; ; ) {
        let { index: l, offset: a } = s.content.findIndex(i),
          c = i - a;
        if ((o.push(s, l, r + a), !c || ((s = s.child(l)), s.isText))) break;
        (i = c - 1), (r += a + 1);
      }
      return new hl(t, o, i);
    }
    static resolveCached(e, t) {
      for (let r = 0; r < ds.length; r++) {
        let i = ds[r];
        if (i.pos == t && i.doc == e) return i;
      }
      let o = (ds[hs] = hl.resolve(e, t));
      return (hs = (hs + 1) % Og), o;
    }
  },
  ds = [],
  hs = 0,
  Og = 12,
  di = class {
    constructor(e, t, o) {
      (this.$from = e), (this.$to = t), (this.depth = o);
    }
    get start() {
      return this.$from.before(this.depth + 1);
    }
    get end() {
      return this.$to.after(this.depth + 1);
    }
    get parent() {
      return this.$from.node(this.depth);
    }
    get startIndex() {
      return this.$from.index(this.depth);
    }
    get endIndex() {
      return this.$to.indexAfter(this.depth);
    }
  };
const Ng = Object.create(null);
let _t = class pl {
  constructor(e, t, o, r = K.none) {
    (this.type = e), (this.attrs = t), (this.marks = r), (this.content = o || k.empty);
  }
  get nodeSize() {
    return this.isLeaf ? 1 : 2 + this.content.size;
  }
  get childCount() {
    return this.content.childCount;
  }
  child(e) {
    return this.content.child(e);
  }
  maybeChild(e) {
    return this.content.maybeChild(e);
  }
  forEach(e) {
    this.content.forEach(e);
  }
  nodesBetween(e, t, o, r = 0) {
    this.content.nodesBetween(e, t, o, r, this);
  }
  descendants(e) {
    this.nodesBetween(0, this.content.size, e);
  }
  get textContent() {
    return this.isLeaf && this.type.spec.leafText
      ? this.type.spec.leafText(this)
      : this.textBetween(0, this.content.size, "");
  }
  textBetween(e, t, o, r) {
    return this.content.textBetween(e, t, o, r);
  }
  get firstChild() {
    return this.content.firstChild;
  }
  get lastChild() {
    return this.content.lastChild;
  }
  eq(e) {
    return this == e || (this.sameMarkup(e) && this.content.eq(e.content));
  }
  sameMarkup(e) {
    return this.hasMarkup(e.type, e.attrs, e.marks);
  }
  hasMarkup(e, t, o) {
    return (
      this.type == e &&
      li(this.attrs, t || e.defaultAttrs || Ng) &&
      K.sameSet(this.marks, o || K.none)
    );
  }
  copy(e = null) {
    return e == this.content ? this : new pl(this.type, this.attrs, e, this.marks);
  }
  mark(e) {
    return e == this.marks ? this : new pl(this.type, this.attrs, this.content, e);
  }
  cut(e, t = this.content.size) {
    return e == 0 && t == this.content.size ? this : this.copy(this.content.cut(e, t));
  }
  slice(e, t = this.content.size, o = !1) {
    if (e == t) return S.empty;
    let r = this.resolve(e),
      i = this.resolve(t),
      s = o ? 0 : r.sharedDepth(t),
      l = r.start(s),
      a = r.node(s).content.cut(r.pos - l, i.pos - l);
    return new S(a, r.depth - s, i.depth - s);
  }
  replace(e, t, o) {
    return Mg(this.resolve(e), this.resolve(t), o);
  }
  nodeAt(e) {
    for (let t = this; ; ) {
      let { index: o, offset: r } = t.content.findIndex(e);
      if (((t = t.maybeChild(o)), !t)) return null;
      if (r == e || t.isText) return t;
      e -= r + 1;
    }
  }
  childAfter(e) {
    let { index: t, offset: o } = this.content.findIndex(e);
    return { node: this.content.maybeChild(t), index: t, offset: o };
  }
  childBefore(e) {
    if (e == 0) return { node: null, index: 0, offset: 0 };
    let { index: t, offset: o } = this.content.findIndex(e);
    if (o < e) return { node: this.content.child(t), index: t, offset: o };
    let r = this.content.child(t - 1);
    return { node: r, index: t - 1, offset: o - r.nodeSize };
  }
  resolve(e) {
    return Cc.resolveCached(this, e);
  }
  resolveNoCache(e) {
    return Cc.resolve(this, e);
  }
  rangeHasMark(e, t, o) {
    let r = !1;
    return t > e && this.nodesBetween(e, t, (i) => (o.isInSet(i.marks) && (r = !0), !r)), r;
  }
  get isBlock() {
    return this.type.isBlock;
  }
  get isTextblock() {
    return this.type.isTextblock;
  }
  get inlineContent() {
    return this.type.inlineContent;
  }
  get isInline() {
    return this.type.isInline;
  }
  get isText() {
    return this.type.isText;
  }
  get isLeaf() {
    return this.type.isLeaf;
  }
  get isAtom() {
    return this.type.isAtom;
  }
  toString() {
    if (this.type.spec.toDebugString) return this.type.spec.toDebugString(this);
    let e = this.type.name;
    return this.content.size && (e += "(" + this.content.toStringInner() + ")"), lp(this.marks, e);
  }
  contentMatchAt(e) {
    let t = this.type.contentMatch.matchFragment(this.content, 0, e);
    if (!t) throw new Error("Called contentMatchAt on a node with invalid content");
    return t;
  }
  canReplace(e, t, o = k.empty, r = 0, i = o.childCount) {
    let s = this.contentMatchAt(e).matchFragment(o, r, i),
      l = s && s.matchFragment(this.content, t);
    if (!l || !l.validEnd) return !1;
    for (let a = r; a < i; a++) if (!this.type.allowsMarks(o.child(a).marks)) return !1;
    return !0;
  }
  canReplaceWith(e, t, o, r) {
    if (r && !this.type.allowsMarks(r)) return !1;
    let i = this.contentMatchAt(e).matchType(o),
      s = i && i.matchFragment(this.content, t);
    return s ? s.validEnd : !1;
  }
  canAppend(e) {
    return e.content.size
      ? this.canReplace(this.childCount, this.childCount, e.content)
      : this.type.compatibleContent(e.type);
  }
  check() {
    this.type.checkContent(this.content);
    let e = K.none;
    for (let t = 0; t < this.marks.length; t++) e = this.marks[t].addToSet(e);
    if (!K.sameSet(e, this.marks))
      throw new RangeError(
        `Invalid collection of marks for node ${this.type.name}: ${this.marks.map((t) => t.type.name)}`,
      );
    this.content.forEach((t) => t.check());
  }
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return (
      this.content.size && (e.content = this.content.toJSON()),
      this.marks.length && (e.marks = this.marks.map((t) => t.toJSON())),
      e
    );
  }
  static fromJSON(e, t) {
    if (!t) throw new RangeError("Invalid input for Node.fromJSON");
    let o = null;
    if (t.marks) {
      if (!Array.isArray(t.marks)) throw new RangeError("Invalid mark data for Node.fromJSON");
      o = t.marks.map(e.markFromJSON);
    }
    if (t.type == "text") {
      if (typeof t.text != "string") throw new RangeError("Invalid text node in JSON");
      return e.text(t.text, o);
    }
    let r = k.fromJSON(e, t.content);
    return e.nodeType(t.type).create(t.attrs, r, o);
  }
};
_t.prototype.text = void 0;
let Tg = class fl extends _t {
  constructor(e, t, o, r) {
    if ((super(e, t, null, r), !o)) throw new RangeError("Empty text nodes are not allowed");
    this.text = o;
  }
  toString() {
    return this.type.spec.toDebugString
      ? this.type.spec.toDebugString(this)
      : lp(this.marks, JSON.stringify(this.text));
  }
  get textContent() {
    return this.text;
  }
  textBetween(e, t) {
    return this.text.slice(e, t);
  }
  get nodeSize() {
    return this.text.length;
  }
  mark(e) {
    return e == this.marks ? this : new fl(this.type, this.attrs, this.text, e);
  }
  withText(e) {
    return e == this.text ? this : new fl(this.type, this.attrs, e, this.marks);
  }
  cut(e = 0, t = this.text.length) {
    return e == 0 && t == this.text.length ? this : this.withText(this.text.slice(e, t));
  }
  eq(e) {
    return this.sameMarkup(e) && this.text == e.text;
  }
  toJSON() {
    let e = super.toJSON();
    return (e.text = this.text), e;
  }
};
function lp(n, e) {
  for (let t = n.length - 1; t >= 0; t--) e = n[t].type.name + "(" + e + ")";
  return e;
}
let tr = class ap {
  constructor(e) {
    (this.validEnd = e), (this.next = []), (this.wrapCache = []);
  }
  static parse(e, t) {
    let o = new Eg(e, t);
    if (o.next == null) return ap.empty;
    let r = cp(o);
    o.next && o.err("Unexpected trailing text");
    let i = Bg(Pg(r));
    return Fg(i, o), i;
  }
  matchType(e) {
    for (let t = 0; t < this.next.length; t++) if (this.next[t].type == e) return this.next[t].next;
    return null;
  }
  matchFragment(e, t = 0, o = e.childCount) {
    let r = this;
    for (let i = t; r && i < o; i++) r = r.matchType(e.child(i).type);
    return r;
  }
  get inlineContent() {
    return this.next.length != 0 && this.next[0].type.isInline;
  }
  get defaultType() {
    for (let e = 0; e < this.next.length; e++) {
      let { type: t } = this.next[e];
      if (!(t.isText || t.hasRequiredAttrs())) return t;
    }
    return null;
  }
  compatible(e) {
    for (let t = 0; t < this.next.length; t++)
      for (let o = 0; o < e.next.length; o++) if (this.next[t].type == e.next[o].type) return !0;
    return !1;
  }
  fillBefore(e, t = !1, o = 0) {
    let r = [this];
    function i(s, l) {
      let a = s.matchFragment(e, o);
      if (a && (!t || a.validEnd)) return k.from(l.map((c) => c.createAndFill()));
      for (let c = 0; c < s.next.length; c++) {
        let { type: d, next: h } = s.next[c];
        if (!(d.isText || d.hasRequiredAttrs()) && r.indexOf(h) == -1) {
          r.push(h);
          let p = i(h, l.concat(d));
          if (p) return p;
        }
      }
      return null;
    }
    return i(this, []);
  }
  findWrapping(e) {
    for (let o = 0; o < this.wrapCache.length; o += 2)
      if (this.wrapCache[o] == e) return this.wrapCache[o + 1];
    let t = this.computeWrapping(e);
    return this.wrapCache.push(e, t), t;
  }
  computeWrapping(e) {
    let t = Object.create(null),
      o = [{ match: this, type: null, via: null }];
    for (; o.length; ) {
      let r = o.shift(),
        i = r.match;
      if (i.matchType(e)) {
        let s = [];
        for (let l = r; l.type; l = l.via) s.push(l.type);
        return s.reverse();
      }
      for (let s = 0; s < i.next.length; s++) {
        let { type: l, next: a } = i.next[s];
        !l.isLeaf &&
          !l.hasRequiredAttrs() &&
          !(l.name in t) &&
          (!r.type || a.validEnd) &&
          (o.push({ match: l.contentMatch, type: l, via: r }), (t[l.name] = !0));
      }
    }
    return null;
  }
  get edgeCount() {
    return this.next.length;
  }
  edge(e) {
    if (e >= this.next.length) throw new RangeError(`There's no ${e}th edge in this content match`);
    return this.next[e];
  }
  toString() {
    let e = [];
    function t(o) {
      e.push(o);
      for (let r = 0; r < o.next.length; r++) e.indexOf(o.next[r].next) == -1 && t(o.next[r].next);
    }
    return (
      t(this),
      e.map((o, r) => {
        let i = r + (o.validEnd ? "*" : " ") + " ";
        for (let s = 0; s < o.next.length; s++)
          i += (s ? ", " : "") + o.next[s].type.name + "->" + e.indexOf(o.next[s].next);
        return i;
      }).join(`
`)
    );
  }
};
tr.empty = new tr(!0);
let Eg = class {
  constructor(e, t) {
    (this.string = e),
      (this.nodeTypes = t),
      (this.inline = null),
      (this.pos = 0),
      (this.tokens = e.split(/\s*(?=\b|\W|$)/)),
      this.tokens[this.tokens.length - 1] == "" && this.tokens.pop(),
      this.tokens[0] == "" && this.tokens.shift();
  }
  get next() {
    return this.tokens[this.pos];
  }
  eat(e) {
    return this.next == e && (this.pos++ || !0);
  }
  err(e) {
    throw new SyntaxError(e + " (in content expression '" + this.string + "')");
  }
};
function cp(n) {
  let e = [];
  do e.push(Ag(n));
  while (n.eat("|"));
  return e.length == 1 ? e[0] : { type: "choice", exprs: e };
}
function Ag(n) {
  let e = [];
  do e.push(Ig(n));
  while (n.next && n.next != ")" && n.next != "|");
  return e.length == 1 ? e[0] : { type: "seq", exprs: e };
}
function Ig(n) {
  let e = zg(n);
  for (;;)
    if (n.eat("+")) e = { type: "plus", expr: e };
    else if (n.eat("*")) e = { type: "star", expr: e };
    else if (n.eat("?")) e = { type: "opt", expr: e };
    else if (n.eat("{")) e = Dg(n, e);
    else break;
  return e;
}
function Oc(n) {
  /\D/.test(n.next) && n.err("Expected number, got '" + n.next + "'");
  let e = Number(n.next);
  return n.pos++, e;
}
function Dg(n, e) {
  let t = Oc(n),
    o = t;
  return (
    n.eat(",") && (n.next != "}" ? (o = Oc(n)) : (o = -1)),
    n.eat("}") || n.err("Unclosed braced range"),
    { type: "range", min: t, max: o, expr: e }
  );
}
function Rg(n, e) {
  let t = n.nodeTypes,
    o = t[e];
  if (o) return [o];
  let r = [];
  for (let i in t) {
    let s = t[i];
    s.groups.indexOf(e) > -1 && r.push(s);
  }
  return r.length == 0 && n.err("No node type or group '" + e + "' found"), r;
}
function zg(n) {
  if (n.eat("(")) {
    let e = cp(n);
    return n.eat(")") || n.err("Missing closing paren"), e;
  } else if (/\W/.test(n.next)) n.err("Unexpected token '" + n.next + "'");
  else {
    let e = Rg(n, n.next).map(
      (t) => (
        n.inline == null
          ? (n.inline = t.isInline)
          : n.inline != t.isInline && n.err("Mixing inline and block content"),
        { type: "name", value: t }
      ),
    );
    return n.pos++, e.length == 1 ? e[0] : { type: "choice", exprs: e };
  }
}
function Pg(n) {
  let e = [[]];
  return r(i(n, 0), t()), e;
  function t() {
    return e.push([]) - 1;
  }
  function o(s, l, a) {
    let c = { term: a, to: l };
    return e[s].push(c), c;
  }
  function r(s, l) {
    s.forEach((a) => (a.to = l));
  }
  function i(s, l) {
    if (s.type == "choice") return s.exprs.reduce((a, c) => a.concat(i(c, l)), []);
    if (s.type == "seq")
      for (let a = 0; ; a++) {
        let c = i(s.exprs[a], l);
        if (a == s.exprs.length - 1) return c;
        r(c, (l = t()));
      }
    else if (s.type == "star") {
      let a = t();
      return o(l, a), r(i(s.expr, a), a), [o(a)];
    } else if (s.type == "plus") {
      let a = t();
      return r(i(s.expr, l), a), r(i(s.expr, a), a), [o(a)];
    } else {
      if (s.type == "opt") return [o(l)].concat(i(s.expr, l));
      if (s.type == "range") {
        let a = l;
        for (let c = 0; c < s.min; c++) {
          let d = t();
          r(i(s.expr, a), d), (a = d);
        }
        if (s.max == -1) r(i(s.expr, a), a);
        else
          for (let c = s.min; c < s.max; c++) {
            let d = t();
            o(a, d), r(i(s.expr, a), d), (a = d);
          }
        return [o(a)];
      } else {
        if (s.type == "name") return [o(l, void 0, s.value)];
        throw new Error("Unknown expr type");
      }
    }
  }
}
function dp(n, e) {
  return e - n;
}
function Nc(n, e) {
  let t = [];
  return o(e), t.sort(dp);
  function o(r) {
    let i = n[r];
    if (i.length == 1 && !i[0].term) return o(i[0].to);
    t.push(r);
    for (let s = 0; s < i.length; s++) {
      let { term: l, to: a } = i[s];
      !l && t.indexOf(a) == -1 && o(a);
    }
  }
}
function Bg(n) {
  let e = Object.create(null);
  return t(Nc(n, 0));
  function t(o) {
    let r = [];
    o.forEach((s) => {
      n[s].forEach(({ term: l, to: a }) => {
        if (!l) return;
        let c;
        for (let d = 0; d < r.length; d++) r[d][0] == l && (c = r[d][1]);
        Nc(n, a).forEach((d) => {
          c || r.push([l, (c = [])]), c.indexOf(d) == -1 && c.push(d);
        });
      });
    });
    let i = (e[o.join(",")] = new tr(o.indexOf(n.length - 1) > -1));
    for (let s = 0; s < r.length; s++) {
      let l = r[s][1].sort(dp);
      i.next.push({ type: r[s][0], next: e[l.join(",")] || t(l) });
    }
    return i;
  }
}
function Fg(n, e) {
  for (let t = 0, o = [n]; t < o.length; t++) {
    let r = o[t],
      i = !r.validEnd,
      s = [];
    for (let l = 0; l < r.next.length; l++) {
      let { type: a, next: c } = r.next[l];
      s.push(a.name),
        i && !(a.isText || a.hasRequiredAttrs()) && (i = !1),
        o.indexOf(c) == -1 && o.push(c);
    }
    i &&
      e.err(
        "Only non-generatable nodes (" +
          s.join(", ") +
          ") in a required position (see https://prosemirror.net/docs/guide/#generatable)",
      );
  }
}
function hp(n) {
  let e = Object.create(null);
  for (let t in n) {
    let o = n[t];
    if (!o.hasDefault) return null;
    e[t] = o.default;
  }
  return e;
}
function pp(n, e) {
  let t = Object.create(null);
  for (let o in n) {
    let r = e && e[o];
    if (r === void 0) {
      let i = n[o];
      if (i.hasDefault) r = i.default;
      else throw new RangeError("No value supplied for attribute " + o);
    }
    t[o] = r;
  }
  return t;
}
function fp(n) {
  let e = Object.create(null);
  if (n) for (let t in n) e[t] = new Vg(n[t]);
  return e;
}
let Tc = class up {
    constructor(e, t, o) {
      (this.name = e),
        (this.schema = t),
        (this.spec = o),
        (this.markSet = null),
        (this.groups = o.group ? o.group.split(" ") : []),
        (this.attrs = fp(o.attrs)),
        (this.defaultAttrs = hp(this.attrs)),
        (this.contentMatch = null),
        (this.inlineContent = null),
        (this.isBlock = !(o.inline || e == "text")),
        (this.isText = e == "text");
    }
    get isInline() {
      return !this.isBlock;
    }
    get isTextblock() {
      return this.isBlock && this.inlineContent;
    }
    get isLeaf() {
      return this.contentMatch == tr.empty;
    }
    get isAtom() {
      return this.isLeaf || !!this.spec.atom;
    }
    get whitespace() {
      return this.spec.whitespace || (this.spec.code ? "pre" : "normal");
    }
    hasRequiredAttrs() {
      for (let e in this.attrs) if (this.attrs[e].isRequired) return !0;
      return !1;
    }
    compatibleContent(e) {
      return this == e || this.contentMatch.compatible(e.contentMatch);
    }
    computeAttrs(e) {
      return !e && this.defaultAttrs ? this.defaultAttrs : pp(this.attrs, e);
    }
    create(e = null, t, o) {
      if (this.isText) throw new Error("NodeType.create can't construct text nodes");
      return new _t(this, this.computeAttrs(e), k.from(t), K.setFrom(o));
    }
    createChecked(e = null, t, o) {
      return (
        (t = k.from(t)), this.checkContent(t), new _t(this, this.computeAttrs(e), t, K.setFrom(o))
      );
    }
    createAndFill(e = null, t, o) {
      if (((e = this.computeAttrs(e)), (t = k.from(t)), t.size)) {
        let s = this.contentMatch.fillBefore(t);
        if (!s) return null;
        t = s.append(t);
      }
      let r = this.contentMatch.matchFragment(t),
        i = r && r.fillBefore(k.empty, !0);
      return i ? new _t(this, e, t.append(i), K.setFrom(o)) : null;
    }
    validContent(e) {
      let t = this.contentMatch.matchFragment(e);
      if (!t || !t.validEnd) return !1;
      for (let o = 0; o < e.childCount; o++) if (!this.allowsMarks(e.child(o).marks)) return !1;
      return !0;
    }
    checkContent(e) {
      if (!this.validContent(e))
        throw new RangeError(`Invalid content for node ${this.name}: ${e.toString().slice(0, 50)}`);
    }
    allowsMarkType(e) {
      return this.markSet == null || this.markSet.indexOf(e) > -1;
    }
    allowsMarks(e) {
      if (this.markSet == null) return !0;
      for (let t = 0; t < e.length; t++) if (!this.allowsMarkType(e[t].type)) return !1;
      return !0;
    }
    allowedMarks(e) {
      if (this.markSet == null) return e;
      let t;
      for (let o = 0; o < e.length; o++)
        this.allowsMarkType(e[o].type) ? t && t.push(e[o]) : t || (t = e.slice(0, o));
      return t ? (t.length ? t : K.none) : e;
    }
    static compile(e, t) {
      let o = Object.create(null);
      e.forEach((i, s) => (o[i] = new up(i, t, s)));
      let r = t.spec.topNode || "doc";
      if (!o[r]) throw new RangeError("Schema is missing its top node type ('" + r + "')");
      if (!o.text) throw new RangeError("Every schema needs a 'text' type");
      for (let i in o.text.attrs)
        throw new RangeError("The text node type should not have attributes");
      return o;
    }
  },
  Vg = class {
    constructor(e) {
      (this.hasDefault = Object.prototype.hasOwnProperty.call(e, "default")),
        (this.default = e.default);
    }
    get isRequired() {
      return !this.hasDefault;
    }
  },
  mp = class gp {
    constructor(e, t, o, r) {
      (this.name = e),
        (this.rank = t),
        (this.schema = o),
        (this.spec = r),
        (this.attrs = fp(r.attrs)),
        (this.excluded = null);
      let i = hp(this.attrs);
      this.instance = i ? new K(this, i) : null;
    }
    create(e = null) {
      return !e && this.instance ? this.instance : new K(this, pp(this.attrs, e));
    }
    static compile(e, t) {
      let o = Object.create(null),
        r = 0;
      return e.forEach((i, s) => (o[i] = new gp(i, r++, t, s))), o;
    }
    removeFromSet(e) {
      for (var t = 0; t < e.length; t++)
        e[t].type == this && ((e = e.slice(0, t).concat(e.slice(t + 1))), t--);
      return e;
    }
    isInSet(e) {
      for (let t = 0; t < e.length; t++) if (e[t].type == this) return e[t];
    }
    excludes(e) {
      return this.excluded.indexOf(e) > -1;
    }
  },
  jg = class {
    constructor(e) {
      this.cached = Object.create(null);
      let t = (this.spec = {});
      for (let r in e) t[r] = e[r];
      (t.nodes = te.from(e.nodes)),
        (t.marks = te.from(e.marks || {})),
        (this.nodes = Tc.compile(this.spec.nodes, this)),
        (this.marks = mp.compile(this.spec.marks, this));
      let o = Object.create(null);
      for (let r in this.nodes) {
        if (r in this.marks) throw new RangeError(r + " can not be both a node and a mark");
        let i = this.nodes[r],
          s = i.spec.content || "",
          l = i.spec.marks;
        (i.contentMatch = o[s] || (o[s] = tr.parse(s, this.nodes))),
          (i.inlineContent = i.contentMatch.inlineContent),
          (i.markSet =
            l == "_" ? null : l ? Ec(this, l.split(" ")) : l == "" || !i.inlineContent ? [] : null);
      }
      for (let r in this.marks) {
        let i = this.marks[r],
          s = i.spec.excludes;
        i.excluded = s == null ? [i] : s == "" ? [] : Ec(this, s.split(" "));
      }
      (this.nodeFromJSON = this.nodeFromJSON.bind(this)),
        (this.markFromJSON = this.markFromJSON.bind(this)),
        (this.topNodeType = this.nodes[this.spec.topNode || "doc"]),
        (this.cached.wrappings = Object.create(null));
    }
    node(e, t = null, o, r) {
      if (typeof e == "string") e = this.nodeType(e);
      else if (e instanceof Tc) {
        if (e.schema != this)
          throw new RangeError("Node type from different schema used (" + e.name + ")");
      } else throw new RangeError("Invalid node type: " + e);
      return e.createChecked(t, o, r);
    }
    text(e, t) {
      let o = this.nodes.text;
      return new Tg(o, o.defaultAttrs, e, K.setFrom(t));
    }
    mark(e, t) {
      return typeof e == "string" && (e = this.marks[e]), e.create(t);
    }
    nodeFromJSON(e) {
      return _t.fromJSON(this, e);
    }
    markFromJSON(e) {
      return K.fromJSON(this, e);
    }
    nodeType(e) {
      let t = this.nodes[e];
      if (!t) throw new RangeError("Unknown node type: " + e);
      return t;
    }
  };
function Ec(n, e) {
  let t = [];
  for (let o = 0; o < e.length; o++) {
    let r = e[o],
      i = n.marks[r],
      s = i;
    if (i) t.push(i);
    else
      for (let l in n.marks) {
        let a = n.marks[l];
        (r == "_" || (a.spec.group && a.spec.group.split(" ").indexOf(r) > -1)) && t.push((s = a));
      }
    if (!s) throw new SyntaxError("Unknown mark type: '" + e[o] + "'");
  }
  return t;
}
let ba = class ul {
  constructor(e, t) {
    (this.schema = e),
      (this.rules = t),
      (this.tags = []),
      (this.styles = []),
      t.forEach((o) => {
        o.tag ? this.tags.push(o) : o.style && this.styles.push(o);
      }),
      (this.normalizeLists = !this.tags.some((o) => {
        if (!/^(ul|ol)\b/.test(o.tag) || !o.node) return !1;
        let r = e.nodes[o.node];
        return r.contentMatch.matchType(r);
      }));
  }
  parse(e, t = {}) {
    let o = new Ic(this, t, !1);
    return o.addAll(e, t.from, t.to), o.finish();
  }
  parseSlice(e, t = {}) {
    let o = new Ic(this, t, !0);
    return o.addAll(e, t.from, t.to), S.maxOpen(o.finish());
  }
  matchTag(e, t, o) {
    for (let r = o ? this.tags.indexOf(o) + 1 : 0; r < this.tags.length; r++) {
      let i = this.tags[r];
      if (
        qg(e, i.tag) &&
        (i.namespace === void 0 || e.namespaceURI == i.namespace) &&
        (!i.context || t.matchesContext(i.context))
      ) {
        if (i.getAttrs) {
          let s = i.getAttrs(e);
          if (s === !1) continue;
          i.attrs = s || void 0;
        }
        return i;
      }
    }
  }
  matchStyle(e, t, o, r) {
    for (let i = r ? this.styles.indexOf(r) + 1 : 0; i < this.styles.length; i++) {
      let s = this.styles[i],
        l = s.style;
      if (
        !(
          l.indexOf(e) != 0 ||
          (s.context && !o.matchesContext(s.context)) ||
          (l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))
        )
      ) {
        if (s.getAttrs) {
          let a = s.getAttrs(t);
          if (a === !1) continue;
          s.attrs = a || void 0;
        }
        return s;
      }
    }
  }
  static schemaRules(e) {
    let t = [];
    function o(r) {
      let i = r.priority == null ? 50 : r.priority,
        s = 0;
      for (; s < t.length; s++) {
        let l = t[s];
        if ((l.priority == null ? 50 : l.priority) < i) break;
      }
      t.splice(s, 0, r);
    }
    for (let r in e.marks) {
      let i = e.marks[r].spec.parseDOM;
      i &&
        i.forEach((s) => {
          o((s = Dc(s))), s.mark || s.ignore || s.clearMark || (s.mark = r);
        });
    }
    for (let r in e.nodes) {
      let i = e.nodes[r].spec.parseDOM;
      i &&
        i.forEach((s) => {
          o((s = Dc(s))), s.node || s.ignore || s.mark || (s.node = r);
        });
    }
    return t;
  }
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new ul(e, ul.schemaRules(e)));
  }
};
const yp = {
    address: !0,
    article: !0,
    aside: !0,
    blockquote: !0,
    canvas: !0,
    dd: !0,
    div: !0,
    dl: !0,
    fieldset: !0,
    figcaption: !0,
    figure: !0,
    footer: !0,
    form: !0,
    h1: !0,
    h2: !0,
    h3: !0,
    h4: !0,
    h5: !0,
    h6: !0,
    header: !0,
    hgroup: !0,
    hr: !0,
    li: !0,
    noscript: !0,
    ol: !0,
    output: !0,
    p: !0,
    pre: !0,
    section: !0,
    table: !0,
    tfoot: !0,
    ul: !0,
  },
  Jg = { head: !0, noscript: !0, object: !0, script: !0, style: !0, title: !0 },
  kp = { ol: !0, ul: !0 },
  hi = 1,
  pi = 2,
  qo = 4;
function Ac(n, e, t) {
  return e != null
    ? (e ? hi : 0) | (e === "full" ? pi : 0)
    : n && n.whitespace == "pre"
      ? hi | pi
      : t & ~qo;
}
let zr = class {
    constructor(e, t, o, r, i, s, l) {
      (this.type = e),
        (this.attrs = t),
        (this.marks = o),
        (this.pendingMarks = r),
        (this.solid = i),
        (this.options = l),
        (this.content = []),
        (this.activeMarks = K.none),
        (this.stashMarks = []),
        (this.match = s || (l & qo ? null : e.contentMatch));
    }
    findWrapping(e) {
      if (!this.match) {
        if (!this.type) return [];
        let t = this.type.contentMatch.fillBefore(k.from(e));
        if (t) this.match = this.type.contentMatch.matchFragment(t);
        else {
          let o = this.type.contentMatch,
            r;
          return (r = o.findWrapping(e.type)) ? ((this.match = o), r) : null;
        }
      }
      return this.match.findWrapping(e.type);
    }
    finish(e) {
      if (!(this.options & hi)) {
        let o = this.content[this.content.length - 1],
          r;
        if (o && o.isText && (r = /[ \t\r\n\u000c]+$/.exec(o.text))) {
          let i = o;
          o.text.length == r[0].length
            ? this.content.pop()
            : (this.content[this.content.length - 1] = i.withText(
                i.text.slice(0, i.text.length - r[0].length),
              ));
        }
      }
      let t = k.from(this.content);
      return (
        !e && this.match && (t = t.append(this.match.fillBefore(k.empty, !0))),
        this.type ? this.type.create(this.attrs, t, this.marks) : t
      );
    }
    popFromStashMark(e) {
      for (let t = this.stashMarks.length - 1; t >= 0; t--)
        if (e.eq(this.stashMarks[t])) return this.stashMarks.splice(t, 1)[0];
    }
    applyPending(e) {
      for (let t = 0, o = this.pendingMarks; t < o.length; t++) {
        let r = o[t];
        (this.type ? this.type.allowsMarkType(r.type) : Wg(r.type, e)) &&
          !r.isInSet(this.activeMarks) &&
          ((this.activeMarks = r.addToSet(this.activeMarks)),
          (this.pendingMarks = r.removeFromSet(this.pendingMarks)));
      }
    }
    inlineContext(e) {
      return this.type
        ? this.type.inlineContent
        : this.content.length
          ? this.content[0].isInline
          : e.parentNode && !yp.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
    }
  },
  Ic = class {
    constructor(e, t, o) {
      (this.parser = e), (this.options = t), (this.isOpen = o), (this.open = 0);
      let r = t.topNode,
        i,
        s = Ac(null, t.preserveWhitespace, 0) | (o ? qo : 0);
      r
        ? (i = new zr(r.type, r.attrs, K.none, K.none, !0, t.topMatch || r.type.contentMatch, s))
        : o
          ? (i = new zr(null, null, K.none, K.none, !0, null, s))
          : (i = new zr(e.schema.topNodeType, null, K.none, K.none, !0, null, s)),
        (this.nodes = [i]),
        (this.find = t.findPositions),
        (this.needsBlock = !1);
    }
    get top() {
      return this.nodes[this.open];
    }
    addDOM(e) {
      e.nodeType == 3 ? this.addTextNode(e) : e.nodeType == 1 && this.addElement(e);
    }
    withStyleRules(e, t) {
      let o = e.getAttribute("style");
      if (!o) return t();
      let r = this.readStyles(Kg(o));
      if (!r) return;
      let [i, s] = r,
        l = this.top;
      for (let a = 0; a < s.length; a++) this.removePendingMark(s[a], l);
      for (let a = 0; a < i.length; a++) this.addPendingMark(i[a]);
      t();
      for (let a = 0; a < i.length; a++) this.removePendingMark(i[a], l);
      for (let a = 0; a < s.length; a++) this.addPendingMark(s[a]);
    }
    addTextNode(e) {
      let t = e.nodeValue,
        o = this.top;
      if (o.options & pi || o.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
        if (o.options & hi)
          o.options & pi
            ? (t = t.replace(
                /\r\n?/g,
                `
`,
              ))
            : (t = t.replace(/\r?\n|\r/g, " "));
        else if (
          ((t = t.replace(/[ \t\r\n\u000c]+/g, " ")),
          /^[ \t\r\n\u000c]/.test(t) && this.open == this.nodes.length - 1)
        ) {
          let r = o.content[o.content.length - 1],
            i = e.previousSibling;
          (!r || (i && i.nodeName == "BR") || (r.isText && /[ \t\r\n\u000c]$/.test(r.text))) &&
            (t = t.slice(1));
        }
        t && this.insertNode(this.parser.schema.text(t)), this.findInText(e);
      } else this.findInside(e);
    }
    addElement(e, t) {
      let o = e.nodeName.toLowerCase(),
        r;
      kp.hasOwnProperty(o) && this.parser.normalizeLists && Lg(e);
      let i =
        (this.options.ruleFromNode && this.options.ruleFromNode(e)) ||
        (r = this.parser.matchTag(e, this, t));
      if (i ? i.ignore : Jg.hasOwnProperty(o)) this.findInside(e), this.ignoreFallback(e);
      else if (!i || i.skip || i.closeParent) {
        i && i.closeParent
          ? (this.open = Math.max(0, this.open - 1))
          : i && i.skip.nodeType && (e = i.skip);
        let s,
          l = this.top,
          a = this.needsBlock;
        if (yp.hasOwnProperty(o))
          l.content.length && l.content[0].isInline && this.open && (this.open--, (l = this.top)),
            (s = !0),
            l.type || (this.needsBlock = !0);
        else if (!e.firstChild) {
          this.leafFallback(e);
          return;
        }
        i && i.skip ? this.addAll(e) : this.withStyleRules(e, () => this.addAll(e)),
          s && this.sync(l),
          (this.needsBlock = a);
      } else
        this.withStyleRules(e, () => {
          this.addElementByRule(e, i, i.consuming === !1 ? r : void 0);
        });
    }
    leafFallback(e) {
      e.nodeName == "BR" &&
        this.top.type &&
        this.top.type.inlineContent &&
        this.addTextNode(
          e.ownerDocument.createTextNode(`
`),
        );
    }
    ignoreFallback(e) {
      e.nodeName == "BR" &&
        (!this.top.type || !this.top.type.inlineContent) &&
        this.findPlace(this.parser.schema.text("-"));
    }
    readStyles(e) {
      let t = K.none,
        o = K.none;
      for (let r = 0; r < e.length; r += 2)
        for (let i = void 0; ; ) {
          let s = this.parser.matchStyle(e[r], e[r + 1], this, i);
          if (!s) break;
          if (s.ignore) return null;
          if (
            (s.clearMark
              ? this.top.pendingMarks.concat(this.top.activeMarks).forEach((l) => {
                  s.clearMark(l) && (o = l.addToSet(o));
                })
              : (t = this.parser.schema.marks[s.mark].create(s.attrs).addToSet(t)),
            s.consuming === !1)
          )
            i = s;
          else break;
        }
      return [t, o];
    }
    addElementByRule(e, t, o) {
      let r, i, s;
      t.node
        ? ((i = this.parser.schema.nodes[t.node]),
          i.isLeaf
            ? this.insertNode(i.create(t.attrs)) || this.leafFallback(e)
            : (r = this.enter(i, t.attrs || null, t.preserveWhitespace)))
        : ((s = this.parser.schema.marks[t.mark].create(t.attrs)), this.addPendingMark(s));
      let l = this.top;
      if (i && i.isLeaf) this.findInside(e);
      else if (o) this.addElement(e, o);
      else if (t.getContent)
        this.findInside(e), t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a));
      else {
        let a = e;
        typeof t.contentElement == "string"
          ? (a = e.querySelector(t.contentElement))
          : typeof t.contentElement == "function"
            ? (a = t.contentElement(e))
            : t.contentElement && (a = t.contentElement),
          this.findAround(e, a, !0),
          this.addAll(a);
      }
      r && this.sync(l) && this.open--, s && this.removePendingMark(s, l);
    }
    addAll(e, t, o) {
      let r = t || 0;
      for (
        let i = t ? e.childNodes[t] : e.firstChild, s = o == null ? null : e.childNodes[o];
        i != s;
        i = i.nextSibling, ++r
      )
        this.findAtPoint(e, r), this.addDOM(i);
      this.findAtPoint(e, r);
    }
    findPlace(e) {
      let t, o;
      for (let r = this.open; r >= 0; r--) {
        let i = this.nodes[r],
          s = i.findWrapping(e);
        if ((s && (!t || t.length > s.length) && ((t = s), (o = i), !s.length)) || i.solid) break;
      }
      if (!t) return !1;
      this.sync(o);
      for (let r = 0; r < t.length; r++) this.enterInner(t[r], null, !1);
      return !0;
    }
    insertNode(e) {
      if (e.isInline && this.needsBlock && !this.top.type) {
        let t = this.textblockFromContext();
        t && this.enterInner(t);
      }
      if (this.findPlace(e)) {
        this.closeExtra();
        let t = this.top;
        t.applyPending(e.type), t.match && (t.match = t.match.matchType(e.type));
        let o = t.activeMarks;
        for (let r = 0; r < e.marks.length; r++)
          (!t.type || t.type.allowsMarkType(e.marks[r].type)) && (o = e.marks[r].addToSet(o));
        return t.content.push(e.mark(o)), !0;
      }
      return !1;
    }
    enter(e, t, o) {
      let r = this.findPlace(e.create(t));
      return r && this.enterInner(e, t, !0, o), r;
    }
    enterInner(e, t = null, o = !1, r) {
      this.closeExtra();
      let i = this.top;
      i.applyPending(e), (i.match = i.match && i.match.matchType(e));
      let s = Ac(e, r, i.options);
      i.options & qo && i.content.length == 0 && (s |= qo),
        this.nodes.push(new zr(e, t, i.activeMarks, i.pendingMarks, o, null, s)),
        this.open++;
    }
    closeExtra(e = !1) {
      let t = this.nodes.length - 1;
      if (t > this.open) {
        for (; t > this.open; t--) this.nodes[t - 1].content.push(this.nodes[t].finish(e));
        this.nodes.length = this.open + 1;
      }
    }
    finish() {
      return (
        (this.open = 0),
        this.closeExtra(this.isOpen),
        this.nodes[0].finish(this.isOpen || this.options.topOpen)
      );
    }
    sync(e) {
      for (let t = this.open; t >= 0; t--) if (this.nodes[t] == e) return (this.open = t), !0;
      return !1;
    }
    get currentPos() {
      this.closeExtra();
      let e = 0;
      for (let t = this.open; t >= 0; t--) {
        let o = this.nodes[t].content;
        for (let r = o.length - 1; r >= 0; r--) e += o[r].nodeSize;
        t && e++;
      }
      return e;
    }
    findAtPoint(e, t) {
      if (this.find)
        for (let o = 0; o < this.find.length; o++)
          this.find[o].node == e &&
            this.find[o].offset == t &&
            (this.find[o].pos = this.currentPos);
    }
    findInside(e) {
      if (this.find)
        for (let t = 0; t < this.find.length; t++)
          this.find[t].pos == null &&
            e.nodeType == 1 &&
            e.contains(this.find[t].node) &&
            (this.find[t].pos = this.currentPos);
    }
    findAround(e, t, o) {
      if (e != t && this.find)
        for (let r = 0; r < this.find.length; r++)
          this.find[r].pos == null &&
            e.nodeType == 1 &&
            e.contains(this.find[r].node) &&
            t.compareDocumentPosition(this.find[r].node) & (o ? 2 : 4) &&
            (this.find[r].pos = this.currentPos);
    }
    findInText(e) {
      if (this.find)
        for (let t = 0; t < this.find.length; t++)
          this.find[t].node == e &&
            (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
    }
    matchesContext(e) {
      if (e.indexOf("|") > -1) return e.split(/\s*\|\s*/).some(this.matchesContext, this);
      let t = e.split("/"),
        o = this.options.context,
        r = !this.isOpen && (!o || o.parent.type == this.nodes[0].type),
        i = -(o ? o.depth + 1 : 0) + (r ? 0 : 1),
        s = (l, a) => {
          for (; l >= 0; l--) {
            let c = t[l];
            if (c == "") {
              if (l == t.length - 1 || l == 0) continue;
              for (; a >= i; a--) if (s(l - 1, a)) return !0;
              return !1;
            } else {
              let d =
                a > 0 || (a == 0 && r)
                  ? this.nodes[a].type
                  : o && a >= i
                    ? o.node(a - i).type
                    : null;
              if (!d || (d.name != c && d.groups.indexOf(c) == -1)) return !1;
              a--;
            }
          }
          return !0;
        };
      return s(t.length - 1, this.open);
    }
    textblockFromContext() {
      let e = this.options.context;
      if (e)
        for (let t = e.depth; t >= 0; t--) {
          let o = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
          if (o && o.isTextblock && o.defaultAttrs) return o;
        }
      for (let t in this.parser.schema.nodes) {
        let o = this.parser.schema.nodes[t];
        if (o.isTextblock && o.defaultAttrs) return o;
      }
    }
    addPendingMark(e) {
      let t = Hg(e, this.top.pendingMarks);
      t && this.top.stashMarks.push(t), (this.top.pendingMarks = e.addToSet(this.top.pendingMarks));
    }
    removePendingMark(e, t) {
      for (let o = this.open; o >= 0; o--) {
        let r = this.nodes[o];
        if (r.pendingMarks.lastIndexOf(e) > -1) r.pendingMarks = e.removeFromSet(r.pendingMarks);
        else {
          r.activeMarks = e.removeFromSet(r.activeMarks);
          let i = r.popFromStashMark(e);
          i &&
            r.type &&
            r.type.allowsMarkType(i.type) &&
            (r.activeMarks = i.addToSet(r.activeMarks));
        }
        if (r == t) break;
      }
    }
  };
function Lg(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let o = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    o && kp.hasOwnProperty(o) && t
      ? (t.appendChild(e), (e = t))
      : o == "li"
        ? (t = e)
        : o && (t = null);
  }
}
function qg(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(
    n,
    e,
  );
}
function Kg(n) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g,
    t,
    o = [];
  for (; (t = e.exec(n)); ) o.push(t[1], t[2].trim());
  return o;
}
function Dc(n) {
  let e = {};
  for (let t in n) e[t] = n[t];
  return e;
}
function Wg(n, e) {
  let t = e.schema.nodes;
  for (let o in t) {
    let r = t[o];
    if (!r.allowsMarkType(n)) continue;
    let i = [],
      s = (l) => {
        i.push(l);
        for (let a = 0; a < l.edgeCount; a++) {
          let { type: c, next: d } = l.edge(a);
          if (c == e || (i.indexOf(d) < 0 && s(d))) return !0;
        }
      };
    if (s(r.contentMatch)) return !0;
  }
}
function Hg(n, e) {
  for (let t = 0; t < e.length; t++) if (n.eq(e[t])) return e[t];
}
let yr = class yo {
  constructor(e, t) {
    (this.nodes = e), (this.marks = t);
  }
  serializeFragment(e, t = {}, o) {
    o || (o = ps(t).createDocumentFragment());
    let r = o,
      i = [];
    return (
      e.forEach((s) => {
        if (i.length || s.marks.length) {
          let l = 0,
            a = 0;
          for (; l < i.length && a < s.marks.length; ) {
            let c = s.marks[a];
            if (!this.marks[c.type.name]) {
              a++;
              continue;
            }
            if (!c.eq(i[l][0]) || c.type.spec.spanning === !1) break;
            l++, a++;
          }
          for (; l < i.length; ) r = i.pop()[1];
          for (; a < s.marks.length; ) {
            let c = s.marks[a++],
              d = this.serializeMark(c, s.isInline, t);
            d && (i.push([c, r]), r.appendChild(d.dom), (r = d.contentDOM || d.dom));
          }
        }
        r.appendChild(this.serializeNodeInner(s, t));
      }),
      o
    );
  }
  serializeNodeInner(e, t) {
    let { dom: o, contentDOM: r } = yo.renderSpec(ps(t), this.nodes[e.type.name](e));
    if (r) {
      if (e.isLeaf) throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, r);
    }
    return o;
  }
  serializeNode(e, t = {}) {
    let o = this.serializeNodeInner(e, t);
    for (let r = e.marks.length - 1; r >= 0; r--) {
      let i = this.serializeMark(e.marks[r], e.isInline, t);
      i && ((i.contentDOM || i.dom).appendChild(o), (o = i.dom));
    }
    return o;
  }
  serializeMark(e, t, o = {}) {
    let r = this.marks[e.type.name];
    return r && yo.renderSpec(ps(o), r(e, t));
  }
  static renderSpec(e, t, o = null) {
    if (typeof t == "string") return { dom: e.createTextNode(t) };
    if (t.nodeType != null) return { dom: t };
    if (t.dom && t.dom.nodeType != null) return t;
    let r = t[0],
      i = r.indexOf(" ");
    i > 0 && ((o = r.slice(0, i)), (r = r.slice(i + 1)));
    let s,
      l = o ? e.createElementNS(o, r) : e.createElement(r),
      a = t[1],
      c = 1;
    if (a && typeof a == "object" && a.nodeType == null && !Array.isArray(a)) {
      c = 2;
      for (let d in a)
        if (a[d] != null) {
          let h = d.indexOf(" ");
          h > 0 ? l.setAttributeNS(d.slice(0, h), d.slice(h + 1), a[d]) : l.setAttribute(d, a[d]);
        }
    }
    for (let d = c; d < t.length; d++) {
      let h = t[d];
      if (h === 0) {
        if (d < t.length - 1 || d > c)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom: l, contentDOM: l };
      } else {
        let { dom: p, contentDOM: f } = yo.renderSpec(e, h, o);
        if ((l.appendChild(p), f)) {
          if (s) throw new RangeError("Multiple content holes");
          s = f;
        }
      }
    }
    return { dom: l, contentDOM: s };
  }
  static fromSchema(e) {
    return (
      e.cached.domSerializer ||
      (e.cached.domSerializer = new yo(this.nodesFromSchema(e), this.marksFromSchema(e)))
    );
  }
  static nodesFromSchema(e) {
    let t = Rc(e.nodes);
    return t.text || (t.text = (o) => o.text), t;
  }
  static marksFromSchema(e) {
    return Rc(e.marks);
  }
};
function Rc(n) {
  let e = {};
  for (let t in n) {
    let o = n[t].spec.toDOM;
    o && (e[t] = o);
  }
  return e;
}
function ps(n) {
  return n.document || window.document;
}
const wp = 65535,
  bp = Math.pow(2, 16);
function Ug(n, e) {
  return n + e * bp;
}
function zc(n) {
  return n & wp;
}
function Gg(n) {
  return (n - (n & wp)) / bp;
}
const vp = 1,
  xp = 2,
  Hr = 4,
  Sp = 8;
let ml = class {
    constructor(e, t, o) {
      (this.pos = e), (this.delInfo = t), (this.recover = o);
    }
    get deleted() {
      return (this.delInfo & Sp) > 0;
    }
    get deletedBefore() {
      return (this.delInfo & (vp | Hr)) > 0;
    }
    get deletedAfter() {
      return (this.delInfo & (xp | Hr)) > 0;
    }
    get deletedAcross() {
      return (this.delInfo & Hr) > 0;
    }
  },
  cn = class Tn {
    constructor(e, t = !1) {
      if (((this.ranges = e), (this.inverted = t), !e.length && Tn.empty)) return Tn.empty;
    }
    recover(e) {
      let t = 0,
        o = zc(e);
      if (!this.inverted)
        for (let r = 0; r < o; r++) t += this.ranges[r * 3 + 2] - this.ranges[r * 3 + 1];
      return this.ranges[o * 3] + t + Gg(e);
    }
    mapResult(e, t = 1) {
      return this._map(e, t, !1);
    }
    map(e, t = 1) {
      return this._map(e, t, !0);
    }
    _map(e, t, o) {
      let r = 0,
        i = this.inverted ? 2 : 1,
        s = this.inverted ? 1 : 2;
      for (let l = 0; l < this.ranges.length; l += 3) {
        let a = this.ranges[l] - (this.inverted ? r : 0);
        if (a > e) break;
        let c = this.ranges[l + i],
          d = this.ranges[l + s],
          h = a + c;
        if (e <= h) {
          let p = c ? (e == a ? -1 : e == h ? 1 : t) : t,
            f = a + r + (p < 0 ? 0 : d);
          if (o) return f;
          let u = e == (t < 0 ? a : h) ? null : Ug(l / 3, e - a),
            m = e == a ? xp : e == h ? vp : Hr;
          return (t < 0 ? e != a : e != h) && (m |= Sp), new ml(f, m, u);
        }
        r += d - c;
      }
      return o ? e + r : new ml(e + r, 0, null);
    }
    touches(e, t) {
      let o = 0,
        r = zc(t),
        i = this.inverted ? 2 : 1,
        s = this.inverted ? 1 : 2;
      for (let l = 0; l < this.ranges.length; l += 3) {
        let a = this.ranges[l] - (this.inverted ? o : 0);
        if (a > e) break;
        let c = this.ranges[l + i],
          d = a + c;
        if (e <= d && l == r * 3) return !0;
        o += this.ranges[l + s] - c;
      }
      return !1;
    }
    forEach(e) {
      let t = this.inverted ? 2 : 1,
        o = this.inverted ? 1 : 2;
      for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
        let s = this.ranges[r],
          l = s - (this.inverted ? i : 0),
          a = s + (this.inverted ? 0 : i),
          c = this.ranges[r + t],
          d = this.ranges[r + o];
        e(l, l + c, a, a + d), (i += d - c);
      }
    }
    invert() {
      return new Tn(this.ranges, !this.inverted);
    }
    toString() {
      return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
    }
    static offset(e) {
      return e == 0 ? Tn.empty : new Tn(e < 0 ? [0, -e, 0] : [0, 0, e]);
    }
  };
cn.empty = new cn([]);
let Yg = class Ur {
  constructor(e = [], t, o = 0, r = e.length) {
    (this.maps = e), (this.mirror = t), (this.from = o), (this.to = r);
  }
  slice(e = 0, t = this.maps.length) {
    return new Ur(this.maps, this.mirror, e, t);
  }
  copy() {
    return new Ur(this.maps.slice(), this.mirror && this.mirror.slice(), this.from, this.to);
  }
  appendMap(e, t) {
    (this.to = this.maps.push(e)), t != null && this.setMirror(this.maps.length - 1, t);
  }
  appendMapping(e) {
    for (let t = 0, o = this.maps.length; t < e.maps.length; t++) {
      let r = e.getMirror(t);
      this.appendMap(e.maps[t], r != null && r < t ? o + r : void 0);
    }
  }
  getMirror(e) {
    if (this.mirror) {
      for (let t = 0; t < this.mirror.length; t++)
        if (this.mirror[t] == e) return this.mirror[t + (t % 2 ? -1 : 1)];
    }
  }
  setMirror(e, t) {
    this.mirror || (this.mirror = []), this.mirror.push(e, t);
  }
  appendMappingInverted(e) {
    for (let t = e.maps.length - 1, o = this.maps.length + e.maps.length; t >= 0; t--) {
      let r = e.getMirror(t);
      this.appendMap(e.maps[t].invert(), r != null && r > t ? o - r - 1 : void 0);
    }
  }
  invert() {
    let e = new Ur();
    return e.appendMappingInverted(this), e;
  }
  map(e, t = 1) {
    if (this.mirror) return this._map(e, t, !0);
    for (let o = this.from; o < this.to; o++) e = this.maps[o].map(e, t);
    return e;
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  _map(e, t, o) {
    let r = 0;
    for (let i = this.from; i < this.to; i++) {
      let s = this.maps[i],
        l = s.mapResult(e, t);
      if (l.recover != null) {
        let a = this.getMirror(i);
        if (a != null && a > i && a < this.to) {
          (i = a), (e = this.maps[a].recover(l.recover));
          continue;
        }
      }
      (r |= l.delInfo), (e = l.pos);
    }
    return o ? e : new ml(e, r, null);
  }
};
const fs = Object.create(null);
let he = class {
    getMap() {
      return cn.empty;
    }
    merge(e) {
      return null;
    }
    static fromJSON(e, t) {
      if (!t || !t.stepType) throw new RangeError("Invalid input for Step.fromJSON");
      let o = fs[t.stepType];
      if (!o) throw new RangeError(`No step type ${t.stepType} defined`);
      return o.fromJSON(e, t);
    }
    static jsonID(e, t) {
      if (e in fs) throw new RangeError("Duplicate use of step JSON ID " + e);
      return (fs[e] = t), (t.prototype.jsonID = e), t;
    }
  },
  be = class ko {
    constructor(e, t) {
      (this.doc = e), (this.failed = t);
    }
    static ok(e) {
      return new ko(e, null);
    }
    static fail(e) {
      return new ko(null, e);
    }
    static fromReplace(e, t, o, r) {
      try {
        return ko.ok(e.replace(t, o, r));
      } catch (i) {
        if (i instanceof ai) return ko.fail(i.message);
        throw i;
      }
    }
  };
function va(n, e, t) {
  let o = [];
  for (let r = 0; r < n.childCount; r++) {
    let i = n.child(r);
    i.content.size && (i = i.copy(va(i.content, e, i))), i.isInline && (i = e(i, t, r)), o.push(i);
  }
  return k.fromArray(o);
}
let xa = class wo extends he {
  constructor(e, t, o) {
    super(), (this.from = e), (this.to = t), (this.mark = o);
  }
  apply(e) {
    let t = e.slice(this.from, this.to),
      o = e.resolve(this.from),
      r = o.node(o.sharedDepth(this.to)),
      i = new S(
        va(
          t.content,
          (s, l) =>
            !s.isAtom || !l.type.allowsMarkType(this.mark.type)
              ? s
              : s.mark(this.mark.addToSet(s.marks)),
          r,
        ),
        t.openStart,
        t.openEnd,
      );
    return be.fromReplace(e, this.from, this.to, i);
  }
  invert() {
    return new kr(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return (t.deleted && o.deleted) || t.pos >= o.pos ? null : new wo(t.pos, o.pos, this.mark);
  }
  merge(e) {
    return e instanceof wo && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from
      ? new wo(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark)
      : null;
  }
  toJSON() {
    return { stepType: "addMark", mark: this.mark.toJSON(), from: this.from, to: this.to };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new wo(t.from, t.to, e.markFromJSON(t.mark));
  }
};
he.jsonID("addMark", xa);
let kr = class bo extends he {
  constructor(e, t, o) {
    super(), (this.from = e), (this.to = t), (this.mark = o);
  }
  apply(e) {
    let t = e.slice(this.from, this.to),
      o = new S(
        va(t.content, (r) => r.mark(this.mark.removeFromSet(r.marks)), e),
        t.openStart,
        t.openEnd,
      );
    return be.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new xa(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return (t.deleted && o.deleted) || t.pos >= o.pos ? null : new bo(t.pos, o.pos, this.mark);
  }
  merge(e) {
    return e instanceof bo && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from
      ? new bo(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark)
      : null;
  }
  toJSON() {
    return { stepType: "removeMark", mark: this.mark.toJSON(), from: this.from, to: this.to };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new bo(t.from, t.to, e.markFromJSON(t.mark));
  }
};
he.jsonID("removeMark", kr);
let Sa = class vo extends he {
  constructor(e, t) {
    super(), (this.pos = e), (this.mark = t);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return be.fail("No node at mark step's position");
    let o = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return be.fromReplace(e, this.pos, this.pos + 1, new S(k.from(o), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let o = this.mark.addToSet(t.marks);
      if (o.length == t.marks.length) {
        for (let r = 0; r < t.marks.length; r++)
          if (!t.marks[r].isInSet(o)) return new vo(this.pos, t.marks[r]);
        return new vo(this.pos, this.mark);
      }
    }
    return new $a(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new vo(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new vo(t.pos, e.markFromJSON(t.mark));
  }
};
he.jsonID("addNodeMark", Sa);
let $a = class gl extends he {
  constructor(e, t) {
    super(), (this.pos = e), (this.mark = t);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return be.fail("No node at mark step's position");
    let o = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return be.fromReplace(e, this.pos, this.pos + 1, new S(k.from(o), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new Sa(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new gl(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new gl(t.pos, e.markFromJSON(t.mark));
  }
};
he.jsonID("removeNodeMark", $a);
class Z extends he {
  constructor(e, t, o, r = !1) {
    super(), (this.from = e), (this.to = t), (this.slice = o), (this.structure = r);
  }
  apply(e) {
    return this.structure && yl(e, this.from, this.to)
      ? be.fail("Structure replace would overwrite content")
      : be.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new cn([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new Z(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return t.deletedAcross && o.deletedAcross
      ? null
      : new Z(t.pos, Math.max(t.pos, o.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof Z) || e.structure || this.structure) return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t =
        this.slice.size + e.slice.size == 0
          ? S.empty
          : new S(
              this.slice.content.append(e.slice.content),
              this.slice.openStart,
              e.slice.openEnd,
            );
      return new Z(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t =
        this.slice.size + e.slice.size == 0
          ? S.empty
          : new S(
              e.slice.content.append(this.slice.content),
              e.slice.openStart,
              this.slice.openEnd,
            );
      return new Z(e.from, this.to, t, this.structure);
    } else return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return (
      this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e
    );
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new Z(t.from, t.to, S.fromJSON(e, t.slice), !!t.structure);
  }
}
he.jsonID("replace", Z);
let Te = class Gr extends he {
  constructor(e, t, o, r, i, s, l = !1) {
    super(),
      (this.from = e),
      (this.to = t),
      (this.gapFrom = o),
      (this.gapTo = r),
      (this.slice = i),
      (this.insert = s),
      (this.structure = l);
  }
  apply(e) {
    if (this.structure && (yl(e, this.from, this.gapFrom) || yl(e, this.gapTo, this.to)))
      return be.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd) return be.fail("Gap is not a flat range");
    let o = this.slice.insertAt(this.insert, t.content);
    return o ? be.fromReplace(e, this.from, this.to, o) : be.fail("Content does not fit in gap");
  }
  getMap() {
    return new cn([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert,
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new Gr(
      this.from,
      this.from + this.slice.size + t,
      this.from + this.insert,
      this.from + this.insert + t,
      e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from),
      this.gapFrom - this.from,
      this.structure,
    );
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1),
      r = e.map(this.gapFrom, -1),
      i = e.map(this.gapTo, 1);
    return (t.deletedAcross && o.deletedAcross) || r < t.pos || i > o.pos
      ? null
      : new Gr(t.pos, o.pos, r, i, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert,
    };
    return (
      this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e
    );
  }
  static fromJSON(e, t) {
    if (
      typeof t.from != "number" ||
      typeof t.to != "number" ||
      typeof t.gapFrom != "number" ||
      typeof t.gapTo != "number" ||
      typeof t.insert != "number"
    )
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new Gr(
      t.from,
      t.to,
      t.gapFrom,
      t.gapTo,
      S.fromJSON(e, t.slice),
      t.insert,
      !!t.structure,
    );
  }
};
he.jsonID("replaceAround", Te);
function yl(n, e, t) {
  let o = n.resolve(e),
    r = t - e,
    i = o.depth;
  for (; r > 0 && i > 0 && o.indexAfter(i) == o.node(i).childCount; ) i--, r--;
  if (r > 0) {
    let s = o.node(i).maybeChild(o.indexAfter(i));
    for (; r > 0; ) {
      if (!s || s.isLeaf) return !0;
      (s = s.firstChild), r--;
    }
  }
  return !1;
}
function Xg(n, e, t, o) {
  let r = [],
    i = [],
    s,
    l;
  n.doc.nodesBetween(e, t, (a, c, d) => {
    if (!a.isInline) return;
    let h = a.marks;
    if (!o.isInSet(h) && d.type.allowsMarkType(o.type)) {
      let p = Math.max(c, e),
        f = Math.min(c + a.nodeSize, t),
        u = o.addToSet(h);
      for (let m = 0; m < h.length; m++)
        h[m].isInSet(u) ||
          (s && s.to == p && s.mark.eq(h[m]) ? (s.to = f) : r.push((s = new kr(p, f, h[m]))));
      l && l.to == p ? (l.to = f) : i.push((l = new xa(p, f, o)));
    }
  }),
    r.forEach((a) => n.step(a)),
    i.forEach((a) => n.step(a));
}
function Qg(n, e, t, o) {
  let r = [],
    i = 0;
  n.doc.nodesBetween(e, t, (s, l) => {
    if (!s.isInline) return;
    i++;
    let a = null;
    if (o instanceof mp) {
      let c = s.marks,
        d;
      for (; (d = o.isInSet(c)); ) (a || (a = [])).push(d), (c = d.removeFromSet(c));
    } else o ? o.isInSet(s.marks) && (a = [o]) : (a = s.marks);
    if (a && a.length) {
      let c = Math.min(l + s.nodeSize, t);
      for (let d = 0; d < a.length; d++) {
        let h = a[d],
          p;
        for (let f = 0; f < r.length; f++) {
          let u = r[f];
          u.step == i - 1 && h.eq(r[f].style) && (p = u);
        }
        p ? ((p.to = c), (p.step = i)) : r.push({ style: h, from: Math.max(l, e), to: c, step: i });
      }
    }
  }),
    r.forEach((s) => n.step(new kr(s.from, s.to, s.style)));
}
function Zg(n, e, t, o = t.contentMatch) {
  let r = n.doc.nodeAt(e),
    i = [],
    s = e + 1;
  for (let l = 0; l < r.childCount; l++) {
    let a = r.child(l),
      c = s + a.nodeSize,
      d = o.matchType(a.type);
    if (!d) i.push(new Z(s, c, S.empty));
    else {
      o = d;
      for (let h = 0; h < a.marks.length; h++)
        t.allowsMarkType(a.marks[h].type) || n.step(new kr(s, c, a.marks[h]));
      if (a.isText && !t.spec.code) {
        let h,
          p = /\r?\n|\r/g,
          f;
        for (; (h = p.exec(a.text)); )
          f || (f = new S(k.from(t.schema.text(" ", t.allowedMarks(a.marks))), 0, 0)),
            i.push(new Z(s + h.index, s + h.index + h[0].length, f));
      }
    }
    s = c;
  }
  if (!o.validEnd) {
    let l = o.fillBefore(k.empty, !0);
    n.replace(s, s, new S(l, 0, 0));
  }
  for (let l = i.length - 1; l >= 0; l--) n.step(i[l]);
}
function _g(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function lo(n) {
  let e = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let t = n.depth; ; --t) {
    let o = n.$from.node(t),
      r = n.$from.index(t),
      i = n.$to.indexAfter(t);
    if (t < n.depth && o.canReplace(r, i, e)) return t;
    if (t == 0 || o.type.spec.isolating || !_g(o, r, i)) break;
  }
  return null;
}
function e1(n, e, t) {
  let { $from: o, $to: r, depth: i } = e,
    s = o.before(i + 1),
    l = r.after(i + 1),
    a = s,
    c = l,
    d = k.empty,
    h = 0;
  for (let u = i, m = !1; u > t; u--)
    m || o.index(u) > 0 ? ((m = !0), (d = k.from(o.node(u).copy(d))), h++) : a--;
  let p = k.empty,
    f = 0;
  for (let u = i, m = !1; u > t; u--)
    m || r.after(u + 1) < r.end(u) ? ((m = !0), (p = k.from(r.node(u).copy(p))), f++) : c++;
  n.step(new Te(a, c, s, l, new S(d.append(p), h, f), d.size - h, !0));
}
function $p(n, e, t = null, o = n) {
  let r = t1(n, e),
    i = r && n1(o, e);
  return i ? r.map(Pc).concat({ type: e, attrs: t }).concat(i.map(Pc)) : null;
}
function Pc(n) {
  return { type: n, attrs: null };
}
function t1(n, e) {
  let { parent: t, startIndex: o, endIndex: r } = n,
    i = t.contentMatchAt(o).findWrapping(e);
  if (!i) return null;
  let s = i.length ? i[0] : e;
  return t.canReplaceWith(o, r, s) ? i : null;
}
function n1(n, e) {
  let { parent: t, startIndex: o, endIndex: r } = n,
    i = t.child(o),
    s = e.contentMatch.findWrapping(i.type);
  if (!s) return null;
  let l = (s.length ? s[s.length - 1] : e).contentMatch;
  for (let a = o; l && a < r; a++) l = l.matchType(t.child(a).type);
  return !l || !l.validEnd ? null : s;
}
function o1(n, e, t) {
  let o = k.empty;
  for (let s = t.length - 1; s >= 0; s--) {
    if (o.size) {
      let l = t[s].type.contentMatch.matchFragment(o);
      if (!l || !l.validEnd)
        throw new RangeError(
          "Wrapper type given to Transform.wrap does not form valid content of its parent wrapper",
        );
    }
    o = k.from(t[s].type.create(t[s].attrs, o));
  }
  let r = e.start,
    i = e.end;
  n.step(new Te(r, i, r, i, new S(o, 0, 0), t.length, !0));
}
function r1(n, e, t, o, r) {
  if (!o.isTextblock) throw new RangeError("Type given to setBlockType should be a textblock");
  let i = n.steps.length;
  n.doc.nodesBetween(e, t, (s, l) => {
    if (s.isTextblock && !s.hasMarkup(o, r) && i1(n.doc, n.mapping.slice(i).map(l), o)) {
      n.clearIncompatible(n.mapping.slice(i).map(l, 1), o);
      let a = n.mapping.slice(i),
        c = a.map(l, 1),
        d = a.map(l + s.nodeSize, 1);
      return (
        n.step(new Te(c, d, c + 1, d - 1, new S(k.from(o.create(r, null, s.marks)), 0, 0), 1, !0)),
        !1
      );
    }
  });
}
function i1(n, e, t) {
  let o = n.resolve(e),
    r = o.index();
  return o.parent.canReplaceWith(r, r + 1, t);
}
function s1(n, e, t, o, r) {
  let i = n.doc.nodeAt(e);
  if (!i) throw new RangeError("No node at given position");
  t || (t = i.type);
  let s = t.create(o, null, r || i.marks);
  if (i.isLeaf) return n.replaceWith(e, e + i.nodeSize, s);
  if (!t.validContent(i.content)) throw new RangeError("Invalid content for node type " + t.name);
  n.step(new Te(e, e + i.nodeSize, e + 1, e + i.nodeSize - 1, new S(k.from(s), 0, 0), 1, !0));
}
function qn(n, e, t = 1, o) {
  let r = n.resolve(e),
    i = r.depth - t,
    s = (o && o[o.length - 1]) || r.parent;
  if (
    i < 0 ||
    r.parent.type.spec.isolating ||
    !r.parent.canReplace(r.index(), r.parent.childCount) ||
    !s.type.validContent(r.parent.content.cutByIndex(r.index(), r.parent.childCount))
  )
    return !1;
  for (let c = r.depth - 1, d = t - 2; c > i; c--, d--) {
    let h = r.node(c),
      p = r.index(c);
    if (h.type.spec.isolating) return !1;
    let f = h.content.cutByIndex(p, h.childCount),
      u = o && o[d + 1];
    u && (f = f.replaceChild(0, u.type.create(u.attrs)));
    let m = (o && o[d]) || h;
    if (!h.canReplace(p + 1, h.childCount) || !m.type.validContent(f)) return !1;
  }
  let l = r.indexAfter(i),
    a = o && o[0];
  return r.node(i).canReplaceWith(l, l, a ? a.type : r.node(i + 1).type);
}
function l1(n, e, t = 1, o) {
  let r = n.doc.resolve(e),
    i = k.empty,
    s = k.empty;
  for (let l = r.depth, a = r.depth - t, c = t - 1; l > a; l--, c--) {
    i = k.from(r.node(l).copy(i));
    let d = o && o[c];
    s = k.from(d ? d.type.create(d.attrs, s) : r.node(l).copy(s));
  }
  n.step(new Z(e, e, new S(i.append(s), t, t), !0));
}
function un(n, e) {
  let t = n.resolve(e),
    o = t.index();
  return Mp(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(o, o + 1);
}
function Mp(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function Ki(n, e, t = -1) {
  let o = n.resolve(e);
  for (let r = o.depth; ; r--) {
    let i,
      s,
      l = o.index(r);
    if (
      (r == o.depth
        ? ((i = o.nodeBefore), (s = o.nodeAfter))
        : t > 0
          ? ((i = o.node(r + 1)), l++, (s = o.node(r).maybeChild(l)))
          : ((i = o.node(r).maybeChild(l - 1)), (s = o.node(r + 1))),
      i && !i.isTextblock && Mp(i, s) && o.node(r).canReplace(l, l + 1))
    )
      return e;
    if (r == 0) break;
    e = t < 0 ? o.before(r) : o.after(r);
  }
}
function a1(n, e, t) {
  let o = new Z(e - t, e + t, S.empty, !0);
  n.step(o);
}
function c1(n, e, t) {
  let o = n.resolve(e);
  if (o.parent.canReplaceWith(o.index(), o.index(), t)) return e;
  if (o.parentOffset == 0)
    for (let r = o.depth - 1; r >= 0; r--) {
      let i = o.index(r);
      if (o.node(r).canReplaceWith(i, i, t)) return o.before(r + 1);
      if (i > 0) return null;
    }
  if (o.parentOffset == o.parent.content.size)
    for (let r = o.depth - 1; r >= 0; r--) {
      let i = o.indexAfter(r);
      if (o.node(r).canReplaceWith(i, i, t)) return o.after(r + 1);
      if (i < o.node(r).childCount) return null;
    }
  return null;
}
function d1(n, e, t) {
  let o = n.resolve(e);
  if (!t.content.size) return e;
  let r = t.content;
  for (let i = 0; i < t.openStart; i++) r = r.firstChild.content;
  for (let i = 1; i <= (t.openStart == 0 && t.size ? 2 : 1); i++)
    for (let s = o.depth; s >= 0; s--) {
      let l = s == o.depth ? 0 : o.pos <= (o.start(s + 1) + o.end(s + 1)) / 2 ? -1 : 1,
        a = o.index(s) + (l > 0 ? 1 : 0),
        c = o.node(s),
        d = !1;
      if (i == 1) d = c.canReplace(a, a, r);
      else {
        let h = c.contentMatchAt(a).findWrapping(r.firstChild.type);
        d = h && c.canReplaceWith(a, a, h[0]);
      }
      if (d) return l == 0 ? o.pos : l < 0 ? o.before(s + 1) : o.after(s + 1);
    }
  return null;
}
function Wi(n, e, t = e, o = S.empty) {
  if (e == t && !o.size) return null;
  let r = n.resolve(e),
    i = n.resolve(t);
  return Cp(r, i, o) ? new Z(e, t, o) : new h1(r, i, o).fit();
}
function Cp(n, e, t) {
  return (
    !t.openStart &&
    !t.openEnd &&
    n.start() == e.start() &&
    n.parent.canReplace(n.index(), e.index(), t.content)
  );
}
let h1 = class {
  constructor(e, t, o) {
    (this.$from = e),
      (this.$to = t),
      (this.unplaced = o),
      (this.frontier = []),
      (this.placed = k.empty);
    for (let r = 0; r <= e.depth; r++) {
      let i = e.node(r);
      this.frontier.push({ type: i.type, match: i.contentMatchAt(e.indexAfter(r)) });
    }
    for (let r = e.depth; r > 0; r--) this.placed = k.from(e.node(r).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(),
      t = this.placed.size - this.depth - this.$from.depth,
      o = this.$from,
      r = this.close(e < 0 ? this.$to : o.doc.resolve(e));
    if (!r) return null;
    let i = this.placed,
      s = o.depth,
      l = r.depth;
    for (; s && l && i.childCount == 1; ) (i = i.firstChild.content), s--, l--;
    let a = new S(i, s, l);
    return e > -1
      ? new Te(o.pos, e, this.$to.pos, this.$to.end(), a, t)
      : a.size || o.pos != this.$to.pos
        ? new Z(o.pos, r.pos, a)
        : null;
  }
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, o = 0, r = this.unplaced.openEnd; o < e; o++) {
      let i = t.firstChild;
      if ((t.childCount > 1 && (r = 0), i.type.spec.isolating && r <= o)) {
        e = o;
        break;
      }
      t = i.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let o = t == 1 ? e : this.unplaced.openStart; o >= 0; o--) {
        let r,
          i = null;
        o
          ? ((i = us(this.unplaced.content, o - 1).firstChild), (r = i.content))
          : (r = this.unplaced.content);
        let s = r.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l],
            d,
            h = null;
          if (
            t == 1 &&
            (s
              ? c.matchType(s.type) || (h = c.fillBefore(k.from(s), !1))
              : i && a.compatibleContent(i.type))
          )
            return { sliceDepth: o, frontierDepth: l, parent: i, inject: h };
          if (t == 2 && s && (d = c.findWrapping(s.type)))
            return { sliceDepth: o, frontierDepth: l, parent: i, wrap: d };
          if (i && c.matchType(i.type)) break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: o } = this.unplaced,
      r = us(e, t);
    return !r.childCount || r.firstChild.isLeaf
      ? !1
      : ((this.unplaced = new S(e, t + 1, Math.max(o, r.size + t >= e.size - o ? t + 1 : 0))), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: o } = this.unplaced,
      r = us(e, t);
    if (r.childCount <= 1 && t > 0) {
      let i = e.size - t <= t + r.size;
      this.unplaced = new S(xo(e, t - 1, 1), t - 1, i ? t - 1 : o);
    } else this.unplaced = new S(xo(e, t, 1), t, o);
  }
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: o, inject: r, wrap: i }) {
    for (; this.depth > t; ) this.closeFrontierNode();
    if (i) for (let m = 0; m < i.length; m++) this.openFrontierNode(i[m]);
    let s = this.unplaced,
      l = o ? o.content : s.content,
      a = s.openStart - e,
      c = 0,
      d = [],
      { match: h, type: p } = this.frontier[t];
    if (r) {
      for (let m = 0; m < r.childCount; m++) d.push(r.child(m));
      h = h.matchFragment(r);
    }
    let f = l.size + e - (s.content.size - s.openEnd);
    for (; c < l.childCount; ) {
      let m = l.child(c),
        g = h.matchType(m.type);
      if (!g) break;
      c++,
        (c > 1 || a == 0 || m.content.size) &&
          ((h = g),
          d.push(Op(m.mark(p.allowedMarks(m.marks)), c == 1 ? a : 0, c == l.childCount ? f : -1)));
    }
    let u = c == l.childCount;
    u || (f = -1),
      (this.placed = So(this.placed, t, k.from(d))),
      (this.frontier[t].match = h),
      u &&
        f < 0 &&
        o &&
        o.type == this.frontier[this.depth].type &&
        this.frontier.length > 1 &&
        this.closeFrontierNode();
    for (let m = 0, g = l; m < f; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), (g = y.content);
    }
    this.unplaced = u
      ? e == 0
        ? S.empty
        : new S(xo(s.content, e - 1, 1), e - 1, f < 0 ? s.openEnd : e - 1)
      : new S(xo(s.content, e, c), s.openStart, s.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock) return -1;
    let e = this.frontier[this.depth],
      t;
    if (
      !e.type.isTextblock ||
      !ms(this.$to, this.$to.depth, e.type, e.match, !1) ||
      (this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
    )
      return -1;
    let { depth: o } = this.$to,
      r = this.$to.after(o);
    for (; o > 1 && r == this.$to.end(--o); ) ++r;
    return r;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: o, type: r } = this.frontier[t],
        i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)),
        s = ms(e, t, r, o, i);
      if (s) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l],
            d = ms(e, l, c, a, !0);
          if (!d || d.childCount) continue e;
        }
        return { depth: t, fit: s, move: i ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t) return null;
    for (; this.depth > t.depth; ) this.closeFrontierNode();
    t.fit.childCount && (this.placed = So(this.placed, t.depth, t.fit)), (e = t.move);
    for (let o = t.depth + 1; o <= e.depth; o++) {
      let r = e.node(o),
        i = r.type.contentMatch.fillBefore(r.content, !0, e.index(o));
      this.openFrontierNode(r.type, r.attrs, i);
    }
    return e;
  }
  openFrontierNode(e, t = null, o) {
    let r = this.frontier[this.depth];
    (r.match = r.match.matchType(e)),
      (this.placed = So(this.placed, this.depth, k.from(e.create(t, o)))),
      this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let e = this.frontier.pop().match.fillBefore(k.empty, !0);
    e.childCount && (this.placed = So(this.placed, this.frontier.length, e));
  }
};
function xo(n, e, t) {
  return e == 0
    ? n.cutByIndex(t, n.childCount)
    : n.replaceChild(0, n.firstChild.copy(xo(n.firstChild.content, e - 1, t)));
}
function So(n, e, t) {
  return e == 0
    ? n.append(t)
    : n.replaceChild(n.childCount - 1, n.lastChild.copy(So(n.lastChild.content, e - 1, t)));
}
function us(n, e) {
  for (let t = 0; t < e; t++) n = n.firstChild.content;
  return n;
}
function Op(n, e, t) {
  if (e <= 0) return n;
  let o = n.content;
  return (
    e > 1 && (o = o.replaceChild(0, Op(o.firstChild, e - 1, o.childCount == 1 ? t - 1 : 0))),
    e > 0 &&
      ((o = n.type.contentMatch.fillBefore(o).append(o)),
      t <= 0 && (o = o.append(n.type.contentMatch.matchFragment(o).fillBefore(k.empty, !0)))),
    n.copy(o)
  );
}
function ms(n, e, t, o, r) {
  let i = n.node(e),
    s = r ? n.indexAfter(e) : n.index(e);
  if (s == i.childCount && !t.compatibleContent(i.type)) return null;
  let l = o.fillBefore(i.content, !0, s);
  return l && !p1(t, i.content, s) ? l : null;
}
function p1(n, e, t) {
  for (let o = t; o < e.childCount; o++) if (!n.allowsMarks(e.child(o).marks)) return !0;
  return !1;
}
function f1(n) {
  return n.spec.defining || n.spec.definingForContent;
}
function u1(n, e, t, o) {
  if (!o.size) return n.deleteRange(e, t);
  let r = n.doc.resolve(e),
    i = n.doc.resolve(t);
  if (Cp(r, i, o)) return n.step(new Z(e, t, o));
  let s = Tp(r, n.doc.resolve(t));
  s[s.length - 1] == 0 && s.pop();
  let l = -(r.depth + 1);
  s.unshift(l);
  for (let p = r.depth, f = r.pos - 1; p > 0; p--, f--) {
    let u = r.node(p).type.spec;
    if (u.defining || u.definingAsContext || u.isolating) break;
    s.indexOf(p) > -1 ? (l = p) : r.before(p) == f && s.splice(1, 0, -p);
  }
  let a = s.indexOf(l),
    c = [],
    d = o.openStart;
  for (let p = o.content, f = 0; ; f++) {
    let u = p.firstChild;
    if ((c.push(u), f == o.openStart)) break;
    p = u.content;
  }
  for (let p = d - 1; p >= 0; p--) {
    let f = c[p],
      u = f1(f.type);
    if (u && !f.sameMarkup(r.node(Math.abs(l) - 1))) d = p;
    else if (u || !f.type.isTextblock) break;
  }
  for (let p = o.openStart; p >= 0; p--) {
    let f = (p + d + 1) % (o.openStart + 1),
      u = c[f];
    if (u)
      for (let m = 0; m < s.length; m++) {
        let g = s[(m + a) % s.length],
          y = !0;
        g < 0 && ((y = !1), (g = -g));
        let w = r.node(g - 1),
          b = r.index(g - 1);
        if (w.canReplaceWith(b, b, u.type, u.marks))
          return n.replace(
            r.before(g),
            y ? i.after(g) : t,
            new S(Np(o.content, 0, o.openStart, f), f, o.openEnd),
          );
      }
  }
  let h = n.steps.length;
  for (let p = s.length - 1; p >= 0 && (n.replace(e, t, o), !(n.steps.length > h)); p--) {
    let f = s[p];
    f < 0 || ((e = r.before(f)), (t = i.after(f)));
  }
}
function Np(n, e, t, o, r) {
  if (e < t) {
    let i = n.firstChild;
    n = n.replaceChild(0, i.copy(Np(i.content, e + 1, t, o, i)));
  }
  if (e > o) {
    let i = r.contentMatchAt(0),
      s = i.fillBefore(n).append(n);
    n = s.append(i.matchFragment(s).fillBefore(k.empty, !0));
  }
  return n;
}
function m1(n, e, t, o) {
  if (!o.isInline && e == t && n.doc.resolve(e).parent.content.size) {
    let r = c1(n.doc, e, o.type);
    r != null && (e = t = r);
  }
  n.replaceRange(e, t, new S(k.from(o), 0, 0));
}
function g1(n, e, t) {
  let o = n.doc.resolve(e),
    r = n.doc.resolve(t),
    i = Tp(o, r);
  for (let s = 0; s < i.length; s++) {
    let l = i[s],
      a = s == i.length - 1;
    if ((a && l == 0) || o.node(l).type.contentMatch.validEnd)
      return n.delete(o.start(l), r.end(l));
    if (l > 0 && (a || o.node(l - 1).canReplace(o.index(l - 1), r.indexAfter(l - 1))))
      return n.delete(o.before(l), r.after(l));
  }
  for (let s = 1; s <= o.depth && s <= r.depth; s++)
    if (e - o.start(s) == o.depth - s && t > o.end(s) && r.end(s) - t != r.depth - s)
      return n.delete(o.before(s), t);
  n.delete(e, t);
}
function Tp(n, e) {
  let t = [],
    o = Math.min(n.depth, e.depth);
  for (let r = o; r >= 0; r--) {
    let i = n.start(r);
    if (
      i < n.pos - (n.depth - r) ||
      e.end(r) > e.pos + (e.depth - r) ||
      n.node(r).type.spec.isolating ||
      e.node(r).type.spec.isolating
    )
      break;
    (i == e.start(r) ||
      (r == n.depth &&
        r == e.depth &&
        n.parent.inlineContent &&
        e.parent.inlineContent &&
        r &&
        e.start(r - 1) == i - 1)) &&
      t.push(r);
  }
  return t;
}
let Ep = class Yr extends he {
  constructor(e, t, o) {
    super(), (this.pos = e), (this.attr = t), (this.value = o);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return be.fail("No node at attribute step's position");
    let o = Object.create(null);
    for (let i in t.attrs) o[i] = t.attrs[i];
    o[this.attr] = this.value;
    let r = t.type.create(o, null, t.marks);
    return be.fromReplace(e, this.pos, this.pos + 1, new S(k.from(r), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return cn.empty;
  }
  invert(e) {
    return new Yr(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Yr(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Yr(t.pos, t.attr, t.value);
  }
};
he.jsonID("attr", Ep);
let Ap = class kl extends he {
  constructor(e, t) {
    super(), (this.attr = e), (this.value = t);
  }
  apply(e) {
    let t = Object.create(null);
    for (let r in e.attrs) t[r] = e.attrs[r];
    t[this.attr] = this.value;
    let o = e.type.create(t, e.content, e.marks);
    return be.ok(o);
  }
  getMap() {
    return cn.empty;
  }
  invert(e) {
    return new kl(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string") throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new kl(t.attr, t.value);
  }
};
he.jsonID("docAttr", Ap);
let Qn = class extends Error {};
Qn = function n(e) {
  let t = Error.call(this, e);
  return (t.__proto__ = n.prototype), t;
};
Qn.prototype = Object.create(Error.prototype);
Qn.prototype.constructor = Qn;
Qn.prototype.name = "TransformError";
let y1 = class {
  constructor(e) {
    (this.doc = e), (this.steps = []), (this.docs = []), (this.mapping = new Yg());
  }
  get before() {
    return this.docs.length ? this.docs[0] : this.doc;
  }
  step(e) {
    let t = this.maybeStep(e);
    if (t.failed) throw new Qn(t.failed);
    return this;
  }
  maybeStep(e) {
    let t = e.apply(this.doc);
    return t.failed || this.addStep(e, t.doc), t;
  }
  get docChanged() {
    return this.steps.length > 0;
  }
  addStep(e, t) {
    this.docs.push(this.doc),
      this.steps.push(e),
      this.mapping.appendMap(e.getMap()),
      (this.doc = t);
  }
  replace(e, t = e, o = S.empty) {
    let r = Wi(this.doc, e, t, o);
    return r && this.step(r), this;
  }
  replaceWith(e, t, o) {
    return this.replace(e, t, new S(k.from(o), 0, 0));
  }
  delete(e, t) {
    return this.replace(e, t, S.empty);
  }
  insert(e, t) {
    return this.replaceWith(e, e, t);
  }
  replaceRange(e, t, o) {
    return u1(this, e, t, o), this;
  }
  replaceRangeWith(e, t, o) {
    return m1(this, e, t, o), this;
  }
  deleteRange(e, t) {
    return g1(this, e, t), this;
  }
  lift(e, t) {
    return e1(this, e, t), this;
  }
  join(e, t = 1) {
    return a1(this, e, t), this;
  }
  wrap(e, t) {
    return o1(this, e, t), this;
  }
  setBlockType(e, t = e, o, r = null) {
    return r1(this, e, t, o, r), this;
  }
  setNodeMarkup(e, t, o = null, r) {
    return s1(this, e, t, o, r), this;
  }
  setNodeAttribute(e, t, o) {
    return this.step(new Ep(e, t, o)), this;
  }
  setDocAttribute(e, t) {
    return this.step(new Ap(e, t)), this;
  }
  addNodeMark(e, t) {
    return this.step(new Sa(e, t)), this;
  }
  removeNodeMark(e, t) {
    if (!(t instanceof K)) {
      let o = this.doc.nodeAt(e);
      if (!o) throw new RangeError("No node at position " + e);
      if (((t = t.isInSet(o.marks)), !t)) return this;
    }
    return this.step(new $a(e, t)), this;
  }
  split(e, t = 1, o) {
    return l1(this, e, t, o), this;
  }
  addMark(e, t, o) {
    return Xg(this, e, t, o), this;
  }
  removeMark(e, t, o) {
    return Qg(this, e, t, o), this;
  }
  clearIncompatible(e, t, o) {
    return Zg(this, e, t, o), this;
  }
};
const gs = Object.create(null);
let P = class {
  constructor(e, t, o) {
    (this.$anchor = e), (this.$head = t), (this.ranges = o || [new k1(e.min(t), e.max(t))]);
  }
  get anchor() {
    return this.$anchor.pos;
  }
  get head() {
    return this.$head.pos;
  }
  get from() {
    return this.$from.pos;
  }
  get to() {
    return this.$to.pos;
  }
  get $from() {
    return this.ranges[0].$from;
  }
  get $to() {
    return this.ranges[0].$to;
  }
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++) if (e[t].$from.pos != e[t].$to.pos) return !1;
    return !0;
  }
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  replace(e, t = S.empty) {
    let o = t.content.lastChild,
      r = null;
    for (let l = 0; l < t.openEnd; l++) (r = o), (o = o.lastChild);
    let i = e.steps.length,
      s = this.ranges;
    for (let l = 0; l < s.length; l++) {
      let { $from: a, $to: c } = s[l],
        d = e.mapping.slice(i);
      e.replaceRange(d.map(a.pos), d.map(c.pos), l ? S.empty : t),
        l == 0 && Vc(e, i, (o ? o.isInline : r && r.isTextblock) ? -1 : 1);
    }
  }
  replaceWith(e, t) {
    let o = e.steps.length,
      r = this.ranges;
    for (let i = 0; i < r.length; i++) {
      let { $from: s, $to: l } = r[i],
        a = e.mapping.slice(o),
        c = a.map(s.pos),
        d = a.map(l.pos);
      i ? e.deleteRange(c, d) : (e.replaceRangeWith(c, d, t), Vc(e, o, t.isInline ? -1 : 1));
    }
  }
  static findFrom(e, t, o = !1) {
    let r = e.parent.inlineContent ? new J(e) : En(e.node(0), e.parent, e.pos, e.index(), t, o);
    if (r) return r;
    for (let i = e.depth - 1; i >= 0; i--) {
      let s =
        t < 0
          ? En(e.node(0), e.node(i), e.before(i + 1), e.index(i), t, o)
          : En(e.node(0), e.node(i), e.after(i + 1), e.index(i) + 1, t, o);
      if (s) return s;
    }
    return null;
  }
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new en(e.node(0));
  }
  static atStart(e) {
    return En(e, e, 0, 0, 1) || new en(e);
  }
  static atEnd(e) {
    return En(e, e, e.content.size, e.childCount, -1) || new en(e);
  }
  static fromJSON(e, t) {
    if (!t || !t.type) throw new RangeError("Invalid input for Selection.fromJSON");
    let o = gs[t.type];
    if (!o) throw new RangeError(`No selection type ${t.type} defined`);
    return o.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in gs) throw new RangeError("Duplicate use of selection JSON ID " + e);
    return (gs[e] = t), (t.prototype.jsonID = e), t;
  }
  getBookmark() {
    return J.between(this.$anchor, this.$head).getBookmark();
  }
};
P.prototype.visible = !0;
let k1 = class {
    constructor(e, t) {
      (this.$from = e), (this.$to = t);
    }
  },
  Bc = !1;
function Fc(n) {
  !Bc &&
    !n.parent.inlineContent &&
    ((Bc = !0),
    console.warn(
      "TextSelection endpoint not pointing into a node with inline content (" +
        n.parent.type.name +
        ")",
    ));
}
let J = class $o extends P {
  constructor(e, t = e) {
    Fc(e), Fc(t), super(e, t);
  }
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let o = e.resolve(t.map(this.head));
    if (!o.parent.inlineContent) return P.near(o);
    let r = e.resolve(t.map(this.anchor));
    return new $o(r.parent.inlineContent ? r : o, o);
  }
  replace(e, t = S.empty) {
    if ((super.replace(e, t), t == S.empty)) {
      let o = this.$from.marksAcross(this.$to);
      o && e.ensureMarks(o);
    }
  }
  eq(e) {
    return e instanceof $o && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new Ip(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new $o(e.resolve(t.anchor), e.resolve(t.head));
  }
  static create(e, t, o = t) {
    let r = e.resolve(t);
    return new this(r, o == t ? r : e.resolve(o));
  }
  static between(e, t, o) {
    let r = e.pos - t.pos;
    if (((!o || r) && (o = r >= 0 ? 1 : -1), !t.parent.inlineContent)) {
      let i = P.findFrom(t, o, !0) || P.findFrom(t, -o, !0);
      if (i) t = i.$head;
      else return P.near(t, o);
    }
    return (
      e.parent.inlineContent ||
        (r == 0
          ? (e = t)
          : ((e = (P.findFrom(e, -o, !0) || P.findFrom(e, o, !0)).$anchor),
            e.pos < t.pos != r < 0 && (e = t))),
      new $o(e, t)
    );
  }
};
P.jsonID("text", J);
let Ip = class Dp {
    constructor(e, t) {
      (this.anchor = e), (this.head = t);
    }
    map(e) {
      return new Dp(e.map(this.anchor), e.map(this.head));
    }
    resolve(e) {
      return J.between(e.resolve(this.anchor), e.resolve(this.head));
    }
  },
  D = class Mo extends P {
    constructor(e) {
      let t = e.nodeAfter,
        o = e.node(0).resolve(e.pos + t.nodeSize);
      super(e, o), (this.node = t);
    }
    map(e, t) {
      let { deleted: o, pos: r } = t.mapResult(this.anchor),
        i = e.resolve(r);
      return o ? P.near(i) : new Mo(i);
    }
    content() {
      return new S(k.from(this.node), 0, 0);
    }
    eq(e) {
      return e instanceof Mo && e.anchor == this.anchor;
    }
    toJSON() {
      return { type: "node", anchor: this.anchor };
    }
    getBookmark() {
      return new w1(this.anchor);
    }
    static fromJSON(e, t) {
      if (typeof t.anchor != "number")
        throw new RangeError("Invalid input for NodeSelection.fromJSON");
      return new Mo(e.resolve(t.anchor));
    }
    static create(e, t) {
      return new Mo(e.resolve(t));
    }
    static isSelectable(e) {
      return !e.isText && e.type.spec.selectable !== !1;
    }
  };
D.prototype.visible = !1;
P.jsonID("node", D);
let w1 = class Rp {
    constructor(e) {
      this.anchor = e;
    }
    map(e) {
      let { deleted: t, pos: o } = e.mapResult(this.anchor);
      return t ? new Ip(o, o) : new Rp(o);
    }
    resolve(e) {
      let t = e.resolve(this.anchor),
        o = t.nodeAfter;
      return o && D.isSelectable(o) ? new D(t) : P.near(t);
    }
  },
  en = class Xr extends P {
    constructor(e) {
      super(e.resolve(0), e.resolve(e.content.size));
    }
    replace(e, t = S.empty) {
      if (t == S.empty) {
        e.delete(0, e.doc.content.size);
        let o = P.atStart(e.doc);
        o.eq(e.selection) || e.setSelection(o);
      } else super.replace(e, t);
    }
    toJSON() {
      return { type: "all" };
    }
    static fromJSON(e) {
      return new Xr(e);
    }
    map(e) {
      return new Xr(e);
    }
    eq(e) {
      return e instanceof Xr;
    }
    getBookmark() {
      return b1;
    }
  };
P.jsonID("all", en);
const b1 = {
  map() {
    return this;
  },
  resolve(n) {
    return new en(n);
  },
};
function En(n, e, t, o, r, i = !1) {
  if (e.inlineContent) return J.create(n, t);
  for (let s = o - (r > 0 ? 0 : 1); r > 0 ? s < e.childCount : s >= 0; s += r) {
    let l = e.child(s);
    if (l.isAtom) {
      if (!i && D.isSelectable(l)) return D.create(n, t - (r < 0 ? l.nodeSize : 0));
    } else {
      let a = En(n, l, t + r, r < 0 ? l.childCount : 0, r, i);
      if (a) return a;
    }
    t += l.nodeSize * r;
  }
  return null;
}
function Vc(n, e, t) {
  let o = n.steps.length - 1;
  if (o < e) return;
  let r = n.steps[o];
  if (!(r instanceof Z || r instanceof Te)) return;
  let i = n.mapping.maps[o],
    s;
  i.forEach((l, a, c, d) => {
    s == null && (s = d);
  }),
    n.setSelection(P.near(n.doc.resolve(s), t));
}
const jc = 1,
  Pr = 2,
  Jc = 4;
let v1 = class extends y1 {
  constructor(e) {
    super(e.doc),
      (this.curSelectionFor = 0),
      (this.updated = 0),
      (this.meta = Object.create(null)),
      (this.time = Date.now()),
      (this.curSelection = e.selection),
      (this.storedMarks = e.storedMarks);
  }
  get selection() {
    return (
      this.curSelectionFor < this.steps.length &&
        ((this.curSelection = this.curSelection.map(
          this.doc,
          this.mapping.slice(this.curSelectionFor),
        )),
        (this.curSelectionFor = this.steps.length)),
      this.curSelection
    );
  }
  setSelection(e) {
    if (e.$from.doc != this.doc)
      throw new RangeError("Selection passed to setSelection must point at the current document");
    return (
      (this.curSelection = e),
      (this.curSelectionFor = this.steps.length),
      (this.updated = (this.updated | jc) & ~Pr),
      (this.storedMarks = null),
      this
    );
  }
  get selectionSet() {
    return (this.updated & jc) > 0;
  }
  setStoredMarks(e) {
    return (this.storedMarks = e), (this.updated |= Pr), this;
  }
  ensureMarks(e) {
    return (
      K.sameSet(this.storedMarks || this.selection.$from.marks(), e) || this.setStoredMarks(e), this
    );
  }
  addStoredMark(e) {
    return this.ensureMarks(e.addToSet(this.storedMarks || this.selection.$head.marks()));
  }
  removeStoredMark(e) {
    return this.ensureMarks(e.removeFromSet(this.storedMarks || this.selection.$head.marks()));
  }
  get storedMarksSet() {
    return (this.updated & Pr) > 0;
  }
  addStep(e, t) {
    super.addStep(e, t), (this.updated = this.updated & ~Pr), (this.storedMarks = null);
  }
  setTime(e) {
    return (this.time = e), this;
  }
  replaceSelection(e) {
    return this.selection.replace(this, e), this;
  }
  replaceSelectionWith(e, t = !0) {
    let o = this.selection;
    return (
      t &&
        (e = e.mark(
          this.storedMarks || (o.empty ? o.$from.marks() : o.$from.marksAcross(o.$to) || K.none),
        )),
      o.replaceWith(this, e),
      this
    );
  }
  deleteSelection() {
    return this.selection.replace(this), this;
  }
  insertText(e, t, o) {
    let r = this.doc.type.schema;
    if (t == null) return e ? this.replaceSelectionWith(r.text(e), !0) : this.deleteSelection();
    {
      if ((o == null && (o = t), (o = o ?? t), !e)) return this.deleteRange(t, o);
      let i = this.storedMarks;
      if (!i) {
        let s = this.doc.resolve(t);
        i = o == t ? s.marks() : s.marksAcross(this.doc.resolve(o));
      }
      return (
        this.replaceRangeWith(t, o, r.text(e, i)),
        this.selection.empty || this.setSelection(P.near(this.selection.$to)),
        this
      );
    }
  }
  setMeta(e, t) {
    return (this.meta[typeof e == "string" ? e : e.key] = t), this;
  }
  getMeta(e) {
    return this.meta[typeof e == "string" ? e : e.key];
  }
  get isGeneric() {
    for (let e in this.meta) return !1;
    return !0;
  }
  scrollIntoView() {
    return (this.updated |= Jc), this;
  }
  get scrolledIntoView() {
    return (this.updated & Jc) > 0;
  }
};
function Lc(n, e) {
  return !e || !n ? n : n.bind(e);
}
let Co = class {
  constructor(e, t, o) {
    (this.name = e), (this.init = Lc(t.init, o)), (this.apply = Lc(t.apply, o));
  }
};
const x1 = [
  new Co("doc", {
    init(n) {
      return n.doc || n.schema.topNodeType.createAndFill();
    },
    apply(n) {
      return n.doc;
    },
  }),
  new Co("selection", {
    init(n, e) {
      return n.selection || P.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    },
  }),
  new Co("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, o) {
      return o.selection.$cursor ? n.storedMarks : null;
    },
  }),
  new Co("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    },
  }),
];
let ys = class {
    constructor(e, t) {
      (this.schema = e),
        (this.plugins = []),
        (this.pluginsByKey = Object.create(null)),
        (this.fields = x1.slice()),
        t &&
          t.forEach((o) => {
            if (this.pluginsByKey[o.key])
              throw new RangeError("Adding different instances of a keyed plugin (" + o.key + ")");
            this.plugins.push(o),
              (this.pluginsByKey[o.key] = o),
              o.spec.state && this.fields.push(new Co(o.key, o.spec.state, o));
          });
    }
  },
  S1 = class Oo {
    constructor(e) {
      this.config = e;
    }
    get schema() {
      return this.config.schema;
    }
    get plugins() {
      return this.config.plugins;
    }
    apply(e) {
      return this.applyTransaction(e).state;
    }
    filterTransaction(e, t = -1) {
      for (let o = 0; o < this.config.plugins.length; o++)
        if (o != t) {
          let r = this.config.plugins[o];
          if (r.spec.filterTransaction && !r.spec.filterTransaction.call(r, e, this)) return !1;
        }
      return !0;
    }
    applyTransaction(e) {
      if (!this.filterTransaction(e)) return { state: this, transactions: [] };
      let t = [e],
        o = this.applyInner(e),
        r = null;
      for (;;) {
        let i = !1;
        for (let s = 0; s < this.config.plugins.length; s++) {
          let l = this.config.plugins[s];
          if (l.spec.appendTransaction) {
            let a = r ? r[s].n : 0,
              c = r ? r[s].state : this,
              d = a < t.length && l.spec.appendTransaction.call(l, a ? t.slice(a) : t, c, o);
            if (d && o.filterTransaction(d, s)) {
              if ((d.setMeta("appendedTransaction", e), !r)) {
                r = [];
                for (let h = 0; h < this.config.plugins.length; h++)
                  r.push(h < s ? { state: o, n: t.length } : { state: this, n: 0 });
              }
              t.push(d), (o = o.applyInner(d)), (i = !0);
            }
            r && (r[s] = { state: o, n: t.length });
          }
        }
        if (!i) return { state: o, transactions: t };
      }
    }
    applyInner(e) {
      if (!e.before.eq(this.doc)) throw new RangeError("Applying a mismatched transaction");
      let t = new Oo(this.config),
        o = this.config.fields;
      for (let r = 0; r < o.length; r++) {
        let i = o[r];
        t[i.name] = i.apply(e, this[i.name], this, t);
      }
      return t;
    }
    get tr() {
      return new v1(this);
    }
    static create(e) {
      let t = new ys(e.doc ? e.doc.type.schema : e.schema, e.plugins),
        o = new Oo(t);
      for (let r = 0; r < t.fields.length; r++) o[t.fields[r].name] = t.fields[r].init(e, o);
      return o;
    }
    reconfigure(e) {
      let t = new ys(this.schema, e.plugins),
        o = t.fields,
        r = new Oo(t);
      for (let i = 0; i < o.length; i++) {
        let s = o[i].name;
        r[s] = this.hasOwnProperty(s) ? this[s] : o[i].init(e, r);
      }
      return r;
    }
    toJSON(e) {
      let t = { doc: this.doc.toJSON(), selection: this.selection.toJSON() };
      if (
        (this.storedMarks && (t.storedMarks = this.storedMarks.map((o) => o.toJSON())),
        e && typeof e == "object")
      )
        for (let o in e) {
          if (o == "doc" || o == "selection")
            throw new RangeError("The JSON fields `doc` and `selection` are reserved");
          let r = e[o],
            i = r.spec.state;
          i && i.toJSON && (t[o] = i.toJSON.call(r, this[r.key]));
        }
      return t;
    }
    static fromJSON(e, t, o) {
      if (!t) throw new RangeError("Invalid input for EditorState.fromJSON");
      if (!e.schema) throw new RangeError("Required config field 'schema' missing");
      let r = new ys(e.schema, e.plugins),
        i = new Oo(r);
      return (
        r.fields.forEach((s) => {
          if (s.name == "doc") i.doc = _t.fromJSON(e.schema, t.doc);
          else if (s.name == "selection") i.selection = P.fromJSON(i.doc, t.selection);
          else if (s.name == "storedMarks")
            t.storedMarks && (i.storedMarks = t.storedMarks.map(e.schema.markFromJSON));
          else {
            if (o)
              for (let l in o) {
                let a = o[l],
                  c = a.spec.state;
                if (
                  a.key == s.name &&
                  c &&
                  c.fromJSON &&
                  Object.prototype.hasOwnProperty.call(t, l)
                ) {
                  i[s.name] = c.fromJSON.call(a, e, t[l], i);
                  return;
                }
              }
            i[s.name] = s.init(e, i);
          }
        }),
        i
      );
    }
  };
function zp(n, e, t) {
  for (let o in n) {
    let r = n[o];
    r instanceof Function ? (r = r.bind(e)) : o == "handleDOMEvents" && (r = zp(r, e, {})),
      (t[o] = r);
  }
  return t;
}
let Ct = class {
  constructor(e) {
    (this.spec = e),
      (this.props = {}),
      e.props && zp(e.props, this, this.props),
      (this.key = e.key ? e.key.key : Pp("plugin"));
  }
  getState(e) {
    return e[this.key];
  }
};
const ks = Object.create(null);
function Pp(n) {
  return n in ks ? n + "$" + ++ks[n] : ((ks[n] = 0), n + "$");
}
let wr = class {
  constructor(e = "key") {
    this.key = Pp(e);
  }
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  getState(e) {
    return e[this.key];
  }
};
const oe = function (n) {
    for (var e = 0; ; e++) if (((n = n.previousSibling), !n)) return e;
  },
  nr = function (n) {
    let e = n.assignedSlot || n.parentNode;
    return e && e.nodeType == 11 ? e.host : e;
  };
let wl = null;
const st = function (n, e, t) {
    let o = wl || (wl = document.createRange());
    return o.setEnd(n, t ?? n.nodeValue.length), o.setStart(n, e || 0), o;
  },
  $1 = function () {
    wl = null;
  },
  dn = function (n, e, t, o) {
    return t && (qc(n, e, t, o, -1) || qc(n, e, t, o, 1));
  },
  M1 = /^(img|br|input|textarea|hr)$/i;
function qc(n, e, t, o, r) {
  for (;;) {
    if (n == t && e == o) return !0;
    if (e == (r < 0 ? 0 : Xe(n))) {
      let i = n.parentNode;
      if (!i || i.nodeType != 1 || br(n) || M1.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      (e = oe(n) + (r < 0 ? 0 : 1)), (n = i);
    } else if (n.nodeType == 1) {
      if (((n = n.childNodes[e + (r < 0 ? -1 : 0)]), n.contentEditable == "false")) return !1;
      e = r < 0 ? Xe(n) : 0;
    } else return !1;
  }
}
function Xe(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function C1(n, e) {
  for (;;) {
    if (n.nodeType == 3 && e) return n;
    if (n.nodeType == 1 && e > 0) {
      if (n.contentEditable == "false") return null;
      (n = n.childNodes[e - 1]), (e = Xe(n));
    } else if (n.parentNode && !br(n)) (e = oe(n)), (n = n.parentNode);
    else return null;
  }
}
function O1(n, e) {
  for (;;) {
    if (n.nodeType == 3 && e < n.nodeValue.length) return n;
    if (n.nodeType == 1 && e < n.childNodes.length) {
      if (n.contentEditable == "false") return null;
      (n = n.childNodes[e]), (e = 0);
    } else if (n.parentNode && !br(n)) (e = oe(n) + 1), (n = n.parentNode);
    else return null;
  }
}
function N1(n, e, t) {
  for (let o = e == 0, r = e == Xe(n); o || r; ) {
    if (n == t) return !0;
    let i = oe(n);
    if (((n = n.parentNode), !n)) return !1;
    (o = o && i == 0), (r = r && i == Xe(n));
  }
}
function br(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode);
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const Hi = function (n) {
  return n.focusNode && dn(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function Pt(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), (t.keyCode = n), (t.key = t.code = e), t;
}
function T1(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; ) e = e.shadowRoot.activeElement;
  return e;
}
function E1(n, e, t) {
  if (n.caretPositionFromPoint)
    try {
      let o = n.caretPositionFromPoint(e, t);
      if (o) return { node: o.offsetNode, offset: o.offset };
    } catch {}
  if (n.caretRangeFromPoint) {
    let o = n.caretRangeFromPoint(e, t);
    if (o) return { node: o.startContainer, offset: o.startOffset };
  }
}
const _e = typeof navigator < "u" ? navigator : null,
  Kc = typeof document < "u" ? document : null,
  Ot = (_e && _e.userAgent) || "",
  bl = /Edge\/(\d+)/.exec(Ot),
  Bp = /MSIE \d/.exec(Ot),
  vl = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Ot),
  Ce = !!(Bp || vl || bl),
  St = Bp ? document.documentMode : vl ? +vl[1] : bl ? +bl[1] : 0,
  Ke = !Ce && /gecko\/(\d+)/i.test(Ot);
Ke && +(/Firefox\/(\d+)/.exec(Ot) || [0, 0])[1];
const xl = !Ce && /Chrome\/(\d+)/.exec(Ot),
  ve = !!xl,
  A1 = xl ? +xl[1] : 0,
  Se = !Ce && !!_e && /Apple Computer/.test(_e.vendor),
  Zn = Se && (/Mobile\/\w+/.test(Ot) || (!!_e && _e.maxTouchPoints > 2)),
  Be = Zn || (_e ? /Mac/.test(_e.platform) : !1),
  I1 = _e ? /Win/.test(_e.platform) : !1,
  Je = /Android \d/.test(Ot),
  vr = !!Kc && "webkitFontSmoothing" in Kc.documentElement.style,
  D1 = vr ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function R1(n) {
  let e = n.defaultView && n.defaultView.visualViewport;
  return e
    ? { left: 0, right: e.width, top: 0, bottom: e.height }
    : {
        left: 0,
        right: n.documentElement.clientWidth,
        top: 0,
        bottom: n.documentElement.clientHeight,
      };
}
function it(n, e) {
  return typeof n == "number" ? n : n[e];
}
function z1(n) {
  let e = n.getBoundingClientRect(),
    t = e.width / n.offsetWidth || 1,
    o = e.height / n.offsetHeight || 1;
  return {
    left: e.left,
    right: e.left + n.clientWidth * t,
    top: e.top,
    bottom: e.top + n.clientHeight * o,
  };
}
function Wc(n, e, t) {
  let o = n.someProp("scrollThreshold") || 0,
    r = n.someProp("scrollMargin") || 5,
    i = n.dom.ownerDocument;
  for (let s = t || n.dom; s; s = nr(s)) {
    if (s.nodeType != 1) continue;
    let l = s,
      a = l == i.body,
      c = a ? R1(i) : z1(l),
      d = 0,
      h = 0;
    if (
      (e.top < c.top + it(o, "top")
        ? (h = -(c.top - e.top + it(r, "top")))
        : e.bottom > c.bottom - it(o, "bottom") &&
          (h =
            e.bottom - e.top > c.bottom - c.top
              ? e.top + it(r, "top") - c.top
              : e.bottom - c.bottom + it(r, "bottom")),
      e.left < c.left + it(o, "left")
        ? (d = -(c.left - e.left + it(r, "left")))
        : e.right > c.right - it(o, "right") && (d = e.right - c.right + it(r, "right")),
      d || h)
    )
      if (a) i.defaultView.scrollBy(d, h);
      else {
        let p = l.scrollLeft,
          f = l.scrollTop;
        h && (l.scrollTop += h), d && (l.scrollLeft += d);
        let u = l.scrollLeft - p,
          m = l.scrollTop - f;
        e = { left: e.left - u, top: e.top - m, right: e.right - u, bottom: e.bottom - m };
      }
    if (a || /^(fixed|sticky)$/.test(getComputedStyle(s).position)) break;
  }
}
function P1(n) {
  let e = n.dom.getBoundingClientRect(),
    t = Math.max(0, e.top),
    o,
    r;
  for (let i = (e.left + e.right) / 2, s = t + 1; s < Math.min(innerHeight, e.bottom); s += 5) {
    let l = n.root.elementFromPoint(i, s);
    if (!l || l == n.dom || !n.dom.contains(l)) continue;
    let a = l.getBoundingClientRect();
    if (a.top >= t - 20) {
      (o = l), (r = a.top);
      break;
    }
  }
  return { refDOM: o, refTop: r, stack: Fp(n.dom) };
}
function Fp(n) {
  let e = [],
    t = n.ownerDocument;
  for (
    let o = n;
    o && (e.push({ dom: o, top: o.scrollTop, left: o.scrollLeft }), n != t);
    o = nr(o)
  );
  return e;
}
function B1({ refDOM: n, refTop: e, stack: t }) {
  let o = n ? n.getBoundingClientRect().top : 0;
  Vp(t, o == 0 ? 0 : o - e);
}
function Vp(n, e) {
  for (let t = 0; t < n.length; t++) {
    let { dom: o, top: r, left: i } = n[t];
    o.scrollTop != r + e && (o.scrollTop = r + e), o.scrollLeft != i && (o.scrollLeft = i);
  }
}
let $n = null;
function F1(n) {
  if (n.setActive) return n.setActive();
  if ($n) return n.focus($n);
  let e = Fp(n);
  n.focus(
    $n == null
      ? {
          get preventScroll() {
            return ($n = { preventScroll: !0 }), !0;
          },
        }
      : void 0,
  ),
    $n || (($n = !1), Vp(e, 0));
}
function jp(n, e) {
  let t,
    o = 2e8,
    r,
    i = 0,
    s = e.top,
    l = e.top,
    a,
    c;
  for (let d = n.firstChild, h = 0; d; d = d.nextSibling, h++) {
    let p;
    if (d.nodeType == 1) p = d.getClientRects();
    else if (d.nodeType == 3) p = st(d).getClientRects();
    else continue;
    for (let f = 0; f < p.length; f++) {
      let u = p[f];
      if (u.top <= s && u.bottom >= l) {
        (s = Math.max(u.bottom, s)), (l = Math.min(u.top, l));
        let m = u.left > e.left ? u.left - e.left : u.right < e.left ? e.left - u.right : 0;
        if (m < o) {
          (t = d),
            (o = m),
            (r =
              m && t.nodeType == 3 ? { left: u.right < e.left ? u.right : u.left, top: e.top } : e),
            d.nodeType == 1 && m && (i = h + (e.left >= (u.left + u.right) / 2 ? 1 : 0));
          continue;
        }
      } else
        u.top > e.top &&
          !a &&
          u.left <= e.left &&
          u.right >= e.left &&
          ((a = d), (c = { left: Math.max(u.left, Math.min(u.right, e.left)), top: u.top }));
      !t &&
        ((e.left >= u.right && e.top >= u.top) || (e.left >= u.left && e.top >= u.bottom)) &&
        (i = h + 1);
    }
  }
  return (
    !t && a && ((t = a), (r = c), (o = 0)),
    t && t.nodeType == 3
      ? V1(t, r)
      : !t || (o && t.nodeType == 1)
        ? { node: n, offset: i }
        : jp(t, r)
  );
}
function V1(n, e) {
  let t = n.nodeValue.length,
    o = document.createRange();
  for (let r = 0; r < t; r++) {
    o.setEnd(n, r + 1), o.setStart(n, r);
    let i = ft(o, 1);
    if (i.top != i.bottom && Ma(e, i))
      return { node: n, offset: r + (e.left >= (i.left + i.right) / 2 ? 1 : 0) };
  }
  return { node: n, offset: 0 };
}
function Ma(n, e) {
  return (
    n.left >= e.left - 1 && n.left <= e.right + 1 && n.top >= e.top - 1 && n.top <= e.bottom + 1
  );
}
function j1(n, e) {
  let t = n.parentNode;
  return t && /^li$/i.test(t.nodeName) && e.left < n.getBoundingClientRect().left ? t : n;
}
function J1(n, e, t) {
  let { node: o, offset: r } = jp(e, t),
    i = -1;
  if (o.nodeType == 1 && !o.firstChild) {
    let s = o.getBoundingClientRect();
    i = s.left != s.right && t.left > (s.left + s.right) / 2 ? 1 : -1;
  }
  return n.docView.posFromDOM(o, r, i);
}
function L1(n, e, t, o) {
  let r = -1;
  for (let i = e, s = !1; i != n.dom; ) {
    let l = n.docView.nearestDesc(i, !0);
    if (!l) return null;
    if (l.dom.nodeType == 1 && ((l.node.isBlock && l.parent && !s) || !l.contentDOM)) {
      let a = l.dom.getBoundingClientRect();
      if (
        (l.node.isBlock &&
          l.parent &&
          !s &&
          ((s = !0),
          a.left > o.left || a.top > o.top
            ? (r = l.posBefore)
            : (a.right < o.left || a.bottom < o.top) && (r = l.posAfter)),
        !l.contentDOM && r < 0 && !l.node.isText)
      )
        return (l.node.isBlock ? o.top < (a.top + a.bottom) / 2 : o.left < (a.left + a.right) / 2)
          ? l.posBefore
          : l.posAfter;
    }
    i = l.dom.parentNode;
  }
  return r > -1 ? r : n.docView.posFromDOM(e, t, -1);
}
function Jp(n, e, t) {
  let o = n.childNodes.length;
  if (o && t.top < t.bottom)
    for (
      let r = Math.max(
          0,
          Math.min(o - 1, Math.floor((o * (e.top - t.top)) / (t.bottom - t.top)) - 2),
        ),
        i = r;
      ;

    ) {
      let s = n.childNodes[i];
      if (s.nodeType == 1) {
        let l = s.getClientRects();
        for (let a = 0; a < l.length; a++) {
          let c = l[a];
          if (Ma(e, c)) return Jp(s, e, c);
        }
      }
      if ((i = (i + 1) % o) == r) break;
    }
  return n;
}
function q1(n, e) {
  let t = n.dom.ownerDocument,
    o,
    r = 0,
    i = E1(t, e.left, e.top);
  i && ({ node: o, offset: r } = i);
  let s = (n.root.elementFromPoint ? n.root : t).elementFromPoint(e.left, e.top),
    l;
  if (!s || !n.dom.contains(s.nodeType != 1 ? s.parentNode : s)) {
    let c = n.dom.getBoundingClientRect();
    if (!Ma(e, c) || ((s = Jp(n.dom, e, c)), !s)) return null;
  }
  if (Se) for (let c = s; o && c; c = nr(c)) c.draggable && (o = void 0);
  if (((s = j1(s, e)), o)) {
    if (
      Ke &&
      o.nodeType == 1 &&
      ((r = Math.min(r, o.childNodes.length)), r < o.childNodes.length)
    ) {
      let d = o.childNodes[r],
        h;
      d.nodeName == "IMG" &&
        (h = d.getBoundingClientRect()).right <= e.left &&
        h.bottom > e.top &&
        r++;
    }
    let c;
    vr &&
      r &&
      o.nodeType == 1 &&
      (c = o.childNodes[r - 1]).nodeType == 1 &&
      c.contentEditable == "false" &&
      c.getBoundingClientRect().top >= e.top &&
      r--,
      o == n.dom &&
      r == o.childNodes.length - 1 &&
      o.lastChild.nodeType == 1 &&
      e.top > o.lastChild.getBoundingClientRect().bottom
        ? (l = n.state.doc.content.size)
        : (r == 0 || o.nodeType != 1 || o.childNodes[r - 1].nodeName != "BR") &&
          (l = L1(n, o, r, e));
  }
  l == null && (l = J1(n, s, e));
  let a = n.docView.nearestDesc(s, !0);
  return { pos: l, inside: a ? a.posAtStart - a.border : -1 };
}
function Hc(n) {
  return n.top < n.bottom || n.left < n.right;
}
function ft(n, e) {
  let t = n.getClientRects();
  if (t.length) {
    let o = t[e < 0 ? 0 : t.length - 1];
    if (Hc(o)) return o;
  }
  return Array.prototype.find.call(t, Hc) || n.getBoundingClientRect();
}
const K1 = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac]/;
function Lp(n, e, t) {
  let { node: o, offset: r, atom: i } = n.docView.domFromPos(e, t < 0 ? -1 : 1),
    s = vr || Ke;
  if (o.nodeType == 3)
    if (s && (K1.test(o.nodeValue) || (t < 0 ? !r : r == o.nodeValue.length))) {
      let l = ft(st(o, r, r), t);
      if (Ke && r && /\s/.test(o.nodeValue[r - 1]) && r < o.nodeValue.length) {
        let a = ft(st(o, r - 1, r - 1), -1);
        if (a.top == l.top) {
          let c = ft(st(o, r, r + 1), -1);
          if (c.top != l.top) return go(c, c.left < a.left);
        }
      }
      return l;
    } else {
      let l = r,
        a = r,
        c = t < 0 ? 1 : -1;
      return (
        t < 0 && !r
          ? (a++, (c = -1))
          : t >= 0 && r == o.nodeValue.length
            ? (l--, (c = 1))
            : t < 0
              ? l--
              : a++,
        go(ft(st(o, l, a), c), c < 0)
      );
    }
  if (!n.state.doc.resolve(e - (i || 0)).parent.inlineContent) {
    if (i == null && r && (t < 0 || r == Xe(o))) {
      let l = o.childNodes[r - 1];
      if (l.nodeType == 1) return ws(l.getBoundingClientRect(), !1);
    }
    if (i == null && r < Xe(o)) {
      let l = o.childNodes[r];
      if (l.nodeType == 1) return ws(l.getBoundingClientRect(), !0);
    }
    return ws(o.getBoundingClientRect(), t >= 0);
  }
  if (i == null && r && (t < 0 || r == Xe(o))) {
    let l = o.childNodes[r - 1],
      a =
        l.nodeType == 3
          ? st(l, Xe(l) - (s ? 0 : 1))
          : l.nodeType == 1 && (l.nodeName != "BR" || !l.nextSibling)
            ? l
            : null;
    if (a) return go(ft(a, 1), !1);
  }
  if (i == null && r < Xe(o)) {
    let l = o.childNodes[r];
    for (; l.pmViewDesc && l.pmViewDesc.ignoreForCoords; ) l = l.nextSibling;
    let a = l ? (l.nodeType == 3 ? st(l, 0, s ? 0 : 1) : l.nodeType == 1 ? l : null) : null;
    if (a) return go(ft(a, -1), !0);
  }
  return go(ft(o.nodeType == 3 ? st(o) : o, -t), t >= 0);
}
function go(n, e) {
  if (n.width == 0) return n;
  let t = e ? n.left : n.right;
  return { top: n.top, bottom: n.bottom, left: t, right: t };
}
function ws(n, e) {
  if (n.height == 0) return n;
  let t = e ? n.top : n.bottom;
  return { top: t, bottom: t, left: n.left, right: n.right };
}
function qp(n, e, t) {
  let o = n.state,
    r = n.root.activeElement;
  o != e && n.updateState(e), r != n.dom && n.focus();
  try {
    return t();
  } finally {
    o != e && n.updateState(o), r != n.dom && r && r.focus();
  }
}
function W1(n, e, t) {
  let o = e.selection,
    r = t == "up" ? o.$from : o.$to;
  return qp(n, e, () => {
    let { node: i } = n.docView.domFromPos(r.pos, t == "up" ? -1 : 1);
    for (;;) {
      let l = n.docView.nearestDesc(i, !0);
      if (!l) break;
      if (l.node.isBlock) {
        i = l.contentDOM || l.dom;
        break;
      }
      i = l.dom.parentNode;
    }
    let s = Lp(n, r.pos, 1);
    for (let l = i.firstChild; l; l = l.nextSibling) {
      let a;
      if (l.nodeType == 1) a = l.getClientRects();
      else if (l.nodeType == 3) a = st(l, 0, l.nodeValue.length).getClientRects();
      else continue;
      for (let c = 0; c < a.length; c++) {
        let d = a[c];
        if (
          d.bottom > d.top + 1 &&
          (t == "up"
            ? s.top - d.top > (d.bottom - s.top) * 2
            : d.bottom - s.bottom > (s.bottom - d.top) * 2)
        )
          return !1;
      }
    }
    return !0;
  });
}
const H1 = /[\u0590-\u08ac]/;
function U1(n, e, t) {
  let { $head: o } = e.selection;
  if (!o.parent.isTextblock) return !1;
  let r = o.parentOffset,
    i = !r,
    s = r == o.parent.content.size,
    l = n.domSelection();
  return !H1.test(o.parent.textContent) || !l.modify
    ? t == "left" || t == "backward"
      ? i
      : s
    : qp(n, e, () => {
        let {
            focusNode: a,
            focusOffset: c,
            anchorNode: d,
            anchorOffset: h,
          } = n.domSelectionRange(),
          p = l.caretBidiLevel;
        l.modify("move", t, "character");
        let f = o.depth ? n.docView.domAfterPos(o.before()) : n.dom,
          { focusNode: u, focusOffset: m } = n.domSelectionRange(),
          g = (u && !f.contains(u.nodeType == 1 ? u : u.parentNode)) || (a == u && c == m);
        try {
          l.collapse(d, h), a && (a != d || c != h) && l.extend && l.extend(a, c);
        } catch {}
        return p != null && (l.caretBidiLevel = p), g;
      });
}
let Uc = null,
  Gc = null,
  Yc = !1;
function G1(n, e, t) {
  return Uc == e && Gc == t
    ? Yc
    : ((Uc = e), (Gc = t), (Yc = t == "up" || t == "down" ? W1(n, e, t) : U1(n, e, t)));
}
const je = 0,
  Xc = 1,
  Ft = 2,
  et = 3;
let xr = class {
    constructor(e, t, o, r) {
      (this.parent = e),
        (this.children = t),
        (this.dom = o),
        (this.contentDOM = r),
        (this.dirty = je),
        (o.pmViewDesc = this);
    }
    matchesWidget(e) {
      return !1;
    }
    matchesMark(e) {
      return !1;
    }
    matchesNode(e, t, o) {
      return !1;
    }
    matchesHack(e) {
      return !1;
    }
    parseRule() {
      return null;
    }
    stopEvent(e) {
      return !1;
    }
    get size() {
      let e = 0;
      for (let t = 0; t < this.children.length; t++) e += this.children[t].size;
      return e;
    }
    get border() {
      return 0;
    }
    destroy() {
      (this.parent = void 0), this.dom.pmViewDesc == this && (this.dom.pmViewDesc = void 0);
      for (let e = 0; e < this.children.length; e++) this.children[e].destroy();
    }
    posBeforeChild(e) {
      for (let t = 0, o = this.posAtStart; ; t++) {
        let r = this.children[t];
        if (r == e) return o;
        o += r.size;
      }
    }
    get posBefore() {
      return this.parent.posBeforeChild(this);
    }
    get posAtStart() {
      return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
    }
    get posAfter() {
      return this.posBefore + this.size;
    }
    get posAtEnd() {
      return this.posAtStart + this.size - 2 * this.border;
    }
    localPosFromDOM(e, t, o) {
      if (this.contentDOM && this.contentDOM.contains(e.nodeType == 1 ? e : e.parentNode))
        if (o < 0) {
          let i, s;
          if (e == this.contentDOM) i = e.childNodes[t - 1];
          else {
            for (; e.parentNode != this.contentDOM; ) e = e.parentNode;
            i = e.previousSibling;
          }
          for (; i && !((s = i.pmViewDesc) && s.parent == this); ) i = i.previousSibling;
          return i ? this.posBeforeChild(s) + s.size : this.posAtStart;
        } else {
          let i, s;
          if (e == this.contentDOM) i = e.childNodes[t];
          else {
            for (; e.parentNode != this.contentDOM; ) e = e.parentNode;
            i = e.nextSibling;
          }
          for (; i && !((s = i.pmViewDesc) && s.parent == this); ) i = i.nextSibling;
          return i ? this.posBeforeChild(s) : this.posAtEnd;
        }
      let r;
      if (e == this.dom && this.contentDOM) r = t > oe(this.contentDOM);
      else if (this.contentDOM && this.contentDOM != this.dom && this.dom.contains(this.contentDOM))
        r = e.compareDocumentPosition(this.contentDOM) & 2;
      else if (this.dom.firstChild) {
        if (t == 0)
          for (let i = e; ; i = i.parentNode) {
            if (i == this.dom) {
              r = !1;
              break;
            }
            if (i.previousSibling) break;
          }
        if (r == null && t == e.childNodes.length)
          for (let i = e; ; i = i.parentNode) {
            if (i == this.dom) {
              r = !0;
              break;
            }
            if (i.nextSibling) break;
          }
      }
      return r ?? o > 0 ? this.posAtEnd : this.posAtStart;
    }
    nearestDesc(e, t = !1) {
      for (let o = !0, r = e; r; r = r.parentNode) {
        let i = this.getDesc(r),
          s;
        if (i && (!t || i.node))
          if (
            o &&
            (s = i.nodeDOM) &&
            !(s.nodeType == 1 ? s.contains(e.nodeType == 1 ? e : e.parentNode) : s == e)
          )
            o = !1;
          else return i;
      }
    }
    getDesc(e) {
      let t = e.pmViewDesc;
      for (let o = t; o; o = o.parent) if (o == this) return t;
    }
    posFromDOM(e, t, o) {
      for (let r = e; r; r = r.parentNode) {
        let i = this.getDesc(r);
        if (i) return i.localPosFromDOM(e, t, o);
      }
      return -1;
    }
    descAt(e) {
      for (let t = 0, o = 0; t < this.children.length; t++) {
        let r = this.children[t],
          i = o + r.size;
        if (o == e && i != o) {
          for (; !r.border && r.children.length; ) r = r.children[0];
          return r;
        }
        if (e < i) return r.descAt(e - o - r.border);
        o = i;
      }
    }
    domFromPos(e, t) {
      if (!this.contentDOM) return { node: this.dom, offset: 0, atom: e + 1 };
      let o = 0,
        r = 0;
      for (let i = 0; o < this.children.length; o++) {
        let s = this.children[o],
          l = i + s.size;
        if (l > e || s instanceof Gp) {
          r = e - i;
          break;
        }
        i = l;
      }
      if (r) return this.children[o].domFromPos(r - this.children[o].border, t);
      for (let i; o && !(i = this.children[o - 1]).size && i instanceof Kp && i.side >= 0; o--);
      if (t <= 0) {
        let i,
          s = !0;
        for (
          ;
          (i = o ? this.children[o - 1] : null), !(!i || i.dom.parentNode == this.contentDOM);
          o--, s = !1
        );
        return i && t && s && !i.border && !i.domAtom
          ? i.domFromPos(i.size, t)
          : { node: this.contentDOM, offset: i ? oe(i.dom) + 1 : 0 };
      } else {
        let i,
          s = !0;
        for (
          ;
          (i = o < this.children.length ? this.children[o] : null),
            !(!i || i.dom.parentNode == this.contentDOM);
          o++, s = !1
        );
        return i && s && !i.border && !i.domAtom
          ? i.domFromPos(0, t)
          : { node: this.contentDOM, offset: i ? oe(i.dom) : this.contentDOM.childNodes.length };
      }
    }
    parseRange(e, t, o = 0) {
      if (this.children.length == 0)
        return {
          node: this.contentDOM,
          from: e,
          to: t,
          fromOffset: 0,
          toOffset: this.contentDOM.childNodes.length,
        };
      let r = -1,
        i = -1;
      for (let s = o, l = 0; ; l++) {
        let a = this.children[l],
          c = s + a.size;
        if (r == -1 && e <= c) {
          let d = s + a.border;
          if (
            e >= d &&
            t <= c - a.border &&
            a.node &&
            a.contentDOM &&
            this.contentDOM.contains(a.contentDOM)
          )
            return a.parseRange(e, t, d);
          e = s;
          for (let h = l; h > 0; h--) {
            let p = this.children[h - 1];
            if (p.size && p.dom.parentNode == this.contentDOM && !p.emptyChildAt(1)) {
              r = oe(p.dom) + 1;
              break;
            }
            e -= p.size;
          }
          r == -1 && (r = 0);
        }
        if (r > -1 && (c > t || l == this.children.length - 1)) {
          t = c;
          for (let d = l + 1; d < this.children.length; d++) {
            let h = this.children[d];
            if (h.size && h.dom.parentNode == this.contentDOM && !h.emptyChildAt(-1)) {
              i = oe(h.dom);
              break;
            }
            t += h.size;
          }
          i == -1 && (i = this.contentDOM.childNodes.length);
          break;
        }
        s = c;
      }
      return { node: this.contentDOM, from: e, to: t, fromOffset: r, toOffset: i };
    }
    emptyChildAt(e) {
      if (this.border || !this.contentDOM || !this.children.length) return !1;
      let t = this.children[e < 0 ? 0 : this.children.length - 1];
      return t.size == 0 || t.emptyChildAt(e);
    }
    domAfterPos(e) {
      let { node: t, offset: o } = this.domFromPos(e, 0);
      if (t.nodeType != 1 || o == t.childNodes.length)
        throw new RangeError("No node after pos " + e);
      return t.childNodes[o];
    }
    setSelection(e, t, o, r = !1) {
      let i = Math.min(e, t),
        s = Math.max(e, t);
      for (let p = 0, f = 0; p < this.children.length; p++) {
        let u = this.children[p],
          m = f + u.size;
        if (i > f && s < m) return u.setSelection(e - f - u.border, t - f - u.border, o, r);
        f = m;
      }
      let l = this.domFromPos(e, e ? -1 : 1),
        a = t == e ? l : this.domFromPos(t, t ? -1 : 1),
        c = o.getSelection(),
        d = !1;
      if ((Ke || Se) && e == t) {
        let { node: p, offset: f } = l;
        if (p.nodeType == 3) {
          if (
            ((d = !!(
              f &&
              p.nodeValue[f - 1] ==
                `
`
            )),
            d && f == p.nodeValue.length)
          )
            for (let u = p, m; u; u = u.parentNode) {
              if ((m = u.nextSibling)) {
                m.nodeName == "BR" && (l = a = { node: m.parentNode, offset: oe(m) + 1 });
                break;
              }
              let g = u.pmViewDesc;
              if (g && g.node && g.node.isBlock) break;
            }
        } else {
          let u = p.childNodes[f - 1];
          d = u && (u.nodeName == "BR" || u.contentEditable == "false");
        }
      }
      if (Ke && c.focusNode && c.focusNode != a.node && c.focusNode.nodeType == 1) {
        let p = c.focusNode.childNodes[c.focusOffset];
        p && p.contentEditable == "false" && (r = !0);
      }
      if (
        !(r || (d && Se)) &&
        dn(l.node, l.offset, c.anchorNode, c.anchorOffset) &&
        dn(a.node, a.offset, c.focusNode, c.focusOffset)
      )
        return;
      let h = !1;
      if ((c.extend || e == t) && !d) {
        c.collapse(l.node, l.offset);
        try {
          e != t && c.extend(a.node, a.offset), (h = !0);
        } catch {}
      }
      if (!h) {
        if (e > t) {
          let f = l;
          (l = a), (a = f);
        }
        let p = document.createRange();
        p.setEnd(a.node, a.offset),
          p.setStart(l.node, l.offset),
          c.removeAllRanges(),
          c.addRange(p);
      }
    }
    ignoreMutation(e) {
      return !this.contentDOM && e.type != "selection";
    }
    get contentLost() {
      return this.contentDOM && this.contentDOM != this.dom && !this.dom.contains(this.contentDOM);
    }
    markDirty(e, t) {
      for (let o = 0, r = 0; r < this.children.length; r++) {
        let i = this.children[r],
          s = o + i.size;
        if (o == s ? e <= s && t >= o : e < s && t > o) {
          let l = o + i.border,
            a = s - i.border;
          if (e >= l && t <= a) {
            (this.dirty = e == o || t == s ? Ft : Xc),
              e == l && t == a && (i.contentLost || i.dom.parentNode != this.contentDOM)
                ? (i.dirty = et)
                : i.markDirty(e - l, t - l);
            return;
          } else
            i.dirty =
              i.dom == i.contentDOM && i.dom.parentNode == this.contentDOM && !i.children.length
                ? Ft
                : et;
        }
        o = s;
      }
      this.dirty = Ft;
    }
    markParentsDirty() {
      let e = 1;
      for (let t = this.parent; t; t = t.parent, e++) {
        let o = e == 1 ? Ft : Xc;
        t.dirty < o && (t.dirty = o);
      }
    }
    get domAtom() {
      return !1;
    }
    get ignoreForCoords() {
      return !1;
    }
    isText(e) {
      return !1;
    }
  },
  Kp = class extends xr {
    constructor(e, t, o, r) {
      let i,
        s = t.type.toDOM;
      if (
        (typeof s == "function" &&
          (s = s(o, () => {
            if (!i) return r;
            if (i.parent) return i.parent.posBeforeChild(i);
          })),
        !t.type.spec.raw)
      ) {
        if (s.nodeType != 1) {
          let l = document.createElement("span");
          l.appendChild(s), (s = l);
        }
        (s.contentEditable = "false"), s.classList.add("ProseMirror-widget");
      }
      super(e, [], s, null), (this.widget = t), (this.widget = t), (i = this);
    }
    matchesWidget(e) {
      return this.dirty == je && e.type.eq(this.widget.type);
    }
    parseRule() {
      return { ignore: !0 };
    }
    stopEvent(e) {
      let t = this.widget.spec.stopEvent;
      return t ? t(e) : !1;
    }
    ignoreMutation(e) {
      return e.type != "selection" || this.widget.spec.ignoreSelection;
    }
    destroy() {
      this.widget.type.destroy(this.dom), super.destroy();
    }
    get domAtom() {
      return !0;
    }
    get side() {
      return this.widget.type.side;
    }
  },
  Y1 = class extends xr {
    constructor(e, t, o, r) {
      super(e, [], t, null), (this.textDOM = o), (this.text = r);
    }
    get size() {
      return this.text.length;
    }
    localPosFromDOM(e, t) {
      return e != this.textDOM ? this.posAtStart + (t ? this.size : 0) : this.posAtStart + t;
    }
    domFromPos(e) {
      return { node: this.textDOM, offset: e };
    }
    ignoreMutation(e) {
      return e.type === "characterData" && e.target.nodeValue == e.oldValue;
    }
  },
  fi = class Sl extends xr {
    constructor(e, t, o, r) {
      super(e, [], o, r), (this.mark = t);
    }
    static create(e, t, o, r) {
      let i = r.nodeViews[t.type.name],
        s = i && i(t, r, o);
      return (
        (!s || !s.dom) && (s = yr.renderSpec(document, t.type.spec.toDOM(t, o))),
        new Sl(e, t, s.dom, s.contentDOM || s.dom)
      );
    }
    parseRule() {
      return this.dirty & et || this.mark.type.spec.reparseInView
        ? null
        : { mark: this.mark.type.name, attrs: this.mark.attrs, contentElement: this.contentDOM };
    }
    matchesMark(e) {
      return this.dirty != et && this.mark.eq(e);
    }
    markDirty(e, t) {
      if ((super.markDirty(e, t), this.dirty != je)) {
        let o = this.parent;
        for (; !o.node; ) o = o.parent;
        o.dirty < this.dirty && (o.dirty = this.dirty), (this.dirty = je);
      }
    }
    slice(e, t, o) {
      let r = Sl.create(this.parent, this.mark, !0, o),
        i = this.children,
        s = this.size;
      t < s && (i = Cl(i, t, s, o)), e > 0 && (i = Cl(i, 0, e, o));
      for (let l = 0; l < i.length; l++) i[l].parent = r;
      return (r.children = i), r;
    }
  },
  Kn = class Wp extends xr {
    constructor(e, t, o, r, i, s, l, a, c) {
      super(e, [], i, s),
        (this.node = t),
        (this.outerDeco = o),
        (this.innerDeco = r),
        (this.nodeDOM = l);
    }
    static create(e, t, o, r, i, s) {
      let l = i.nodeViews[t.type.name],
        a,
        c =
          l &&
          l(
            t,
            i,
            () => {
              if (!a) return s;
              if (a.parent) return a.parent.posBeforeChild(a);
            },
            o,
            r,
          ),
        d = c && c.dom,
        h = c && c.contentDOM;
      if (t.isText) {
        if (!d) d = document.createTextNode(t.text);
        else if (d.nodeType != 3) throw new RangeError("Text must be rendered as a DOM text node");
      } else d || ({ dom: d, contentDOM: h } = yr.renderSpec(document, t.type.spec.toDOM(t)));
      !h &&
        !t.isText &&
        d.nodeName != "BR" &&
        (d.hasAttribute("contenteditable") || (d.contentEditable = "false"),
        t.type.spec.draggable && (d.draggable = !0));
      let p = d;
      return (
        (d = Qp(d, o, t)),
        c
          ? (a = new X1(e, t, o, r, d, h || null, p, c, i, s + 1))
          : t.isText
            ? new Hp(e, t, o, r, d, p, i)
            : new Wp(e, t, o, r, d, h || null, p, i, s + 1)
      );
    }
    parseRule() {
      if (this.node.type.spec.reparseInView) return null;
      let e = { node: this.node.type.name, attrs: this.node.attrs };
      if ((this.node.type.whitespace == "pre" && (e.preserveWhitespace = "full"), !this.contentDOM))
        e.getContent = () => this.node.content;
      else if (!this.contentLost) e.contentElement = this.contentDOM;
      else {
        for (let t = this.children.length - 1; t >= 0; t--) {
          let o = this.children[t];
          if (this.dom.contains(o.dom.parentNode)) {
            e.contentElement = o.dom.parentNode;
            break;
          }
        }
        e.contentElement || (e.getContent = () => k.empty);
      }
      return e;
    }
    matchesNode(e, t, o) {
      return this.dirty == je && e.eq(this.node) && Ml(t, this.outerDeco) && o.eq(this.innerDeco);
    }
    get size() {
      return this.node.nodeSize;
    }
    get border() {
      return this.node.isLeaf ? 0 : 1;
    }
    updateChildren(e, t) {
      let o = this.node.inlineContent,
        r = t,
        i = e.composing ? this.localCompositionInfo(e, t) : null,
        s = i && i.pos > -1 ? i : null,
        l = i && i.pos < 0,
        a = new Z1(this, s && s.node, e);
      t0(
        this.node,
        this.innerDeco,
        (c, d, h) => {
          c.spec.marks
            ? a.syncToMarks(c.spec.marks, o, e)
            : c.type.side >= 0 &&
              !h &&
              a.syncToMarks(d == this.node.childCount ? K.none : this.node.child(d).marks, o, e),
            a.placeWidget(c, e, r);
        },
        (c, d, h, p) => {
          a.syncToMarks(c.marks, o, e);
          let f;
          a.findNodeMatch(c, d, h, p) ||
            (l &&
              e.state.selection.from > r &&
              e.state.selection.to < r + c.nodeSize &&
              (f = a.findIndexWithChild(i.node)) > -1 &&
              a.updateNodeAt(c, d, h, f, e)) ||
            a.updateNextNode(c, d, h, e, p, r) ||
            a.addNode(c, d, h, e, r),
            (r += c.nodeSize);
        },
      ),
        a.syncToMarks([], o, e),
        this.node.isTextblock && a.addTextblockHacks(),
        a.destroyRest(),
        (a.changed || this.dirty == Ft) &&
          (s && this.protectLocalComposition(e, s),
          Yp(this.contentDOM, this.children, e),
          Zn && n0(this.dom));
    }
    localCompositionInfo(e, t) {
      let { from: o, to: r } = e.state.selection;
      if (!(e.state.selection instanceof J) || o < t || r > t + this.node.content.size) return null;
      let i = e.input.compositionNode;
      if (!i || !this.dom.contains(i.parentNode)) return null;
      if (this.node.inlineContent) {
        let s = i.nodeValue,
          l = o0(this.node.content, s, o - t, r - t);
        return l < 0 ? null : { node: i, pos: l, text: s };
      } else return { node: i, pos: -1, text: "" };
    }
    protectLocalComposition(e, { node: t, pos: o, text: r }) {
      if (this.getDesc(t)) return;
      let i = t;
      for (; i.parentNode != this.contentDOM; i = i.parentNode) {
        for (; i.previousSibling; ) i.parentNode.removeChild(i.previousSibling);
        for (; i.nextSibling; ) i.parentNode.removeChild(i.nextSibling);
        i.pmViewDesc && (i.pmViewDesc = void 0);
      }
      let s = new Y1(this, i, t, r);
      e.input.compositionNodes.push(s), (this.children = Cl(this.children, o, o + r.length, e, s));
    }
    update(e, t, o, r) {
      return this.dirty == et || !e.sameMarkup(this.node) ? !1 : (this.updateInner(e, t, o, r), !0);
    }
    updateInner(e, t, o, r) {
      this.updateOuterDeco(t),
        (this.node = e),
        (this.innerDeco = o),
        this.contentDOM && this.updateChildren(r, this.posAtStart),
        (this.dirty = je);
    }
    updateOuterDeco(e) {
      if (Ml(e, this.outerDeco)) return;
      let t = this.nodeDOM.nodeType != 1,
        o = this.dom;
      (this.dom = Xp(
        this.dom,
        this.nodeDOM,
        $l(this.outerDeco, this.node, t),
        $l(e, this.node, t),
      )),
        this.dom != o && ((o.pmViewDesc = void 0), (this.dom.pmViewDesc = this)),
        (this.outerDeco = e);
    }
    selectNode() {
      this.nodeDOM.nodeType == 1 && this.nodeDOM.classList.add("ProseMirror-selectednode"),
        (this.contentDOM || !this.node.type.spec.draggable) && (this.dom.draggable = !0);
    }
    deselectNode() {
      this.nodeDOM.nodeType == 1 && this.nodeDOM.classList.remove("ProseMirror-selectednode"),
        (this.contentDOM || !this.node.type.spec.draggable) &&
          this.dom.removeAttribute("draggable");
    }
    get domAtom() {
      return this.node.isAtom;
    }
  };
function Qc(n, e, t, o, r) {
  Qp(o, e, n);
  let i = new Kn(void 0, n, e, t, o, o, o, r, 0);
  return i.contentDOM && i.updateChildren(r, 0), i;
}
let Hp = class Up extends Kn {
    constructor(e, t, o, r, i, s, l) {
      super(e, t, o, r, i, null, s, l, 0);
    }
    parseRule() {
      let e = this.nodeDOM.parentNode;
      for (; e && e != this.dom && !e.pmIsDeco; ) e = e.parentNode;
      return { skip: e || !0 };
    }
    update(e, t, o, r) {
      return this.dirty == et || (this.dirty != je && !this.inParent()) || !e.sameMarkup(this.node)
        ? !1
        : (this.updateOuterDeco(t),
          (this.dirty != je || e.text != this.node.text) &&
            e.text != this.nodeDOM.nodeValue &&
            ((this.nodeDOM.nodeValue = e.text),
            r.trackWrites == this.nodeDOM && (r.trackWrites = null)),
          (this.node = e),
          (this.dirty = je),
          !0);
    }
    inParent() {
      let e = this.parent.contentDOM;
      for (let t = this.nodeDOM; t; t = t.parentNode) if (t == e) return !0;
      return !1;
    }
    domFromPos(e) {
      return { node: this.nodeDOM, offset: e };
    }
    localPosFromDOM(e, t, o) {
      return e == this.nodeDOM
        ? this.posAtStart + Math.min(t, this.node.text.length)
        : super.localPosFromDOM(e, t, o);
    }
    ignoreMutation(e) {
      return e.type != "characterData" && e.type != "selection";
    }
    slice(e, t, o) {
      let r = this.node.cut(e, t),
        i = document.createTextNode(r.text);
      return new Up(this.parent, r, this.outerDeco, this.innerDeco, i, i, o);
    }
    markDirty(e, t) {
      super.markDirty(e, t),
        this.dom != this.nodeDOM &&
          (e == 0 || t == this.nodeDOM.nodeValue.length) &&
          (this.dirty = et);
    }
    get domAtom() {
      return !1;
    }
    isText(e) {
      return this.node.text == e;
    }
  },
  Gp = class extends xr {
    parseRule() {
      return { ignore: !0 };
    }
    matchesHack(e) {
      return this.dirty == je && this.dom.nodeName == e;
    }
    get domAtom() {
      return !0;
    }
    get ignoreForCoords() {
      return this.dom.nodeName == "IMG";
    }
  },
  X1 = class extends Kn {
    constructor(e, t, o, r, i, s, l, a, c, d) {
      super(e, t, o, r, i, s, l, c, d), (this.spec = a);
    }
    update(e, t, o, r) {
      if (this.dirty == et) return !1;
      if (this.spec.update) {
        let i = this.spec.update(e, t, o);
        return i && this.updateInner(e, t, o, r), i;
      } else return !this.contentDOM && !e.isLeaf ? !1 : super.update(e, t, o, r);
    }
    selectNode() {
      this.spec.selectNode ? this.spec.selectNode() : super.selectNode();
    }
    deselectNode() {
      this.spec.deselectNode ? this.spec.deselectNode() : super.deselectNode();
    }
    setSelection(e, t, o, r) {
      this.spec.setSelection ? this.spec.setSelection(e, t, o) : super.setSelection(e, t, o, r);
    }
    destroy() {
      this.spec.destroy && this.spec.destroy(), super.destroy();
    }
    stopEvent(e) {
      return this.spec.stopEvent ? this.spec.stopEvent(e) : !1;
    }
    ignoreMutation(e) {
      return this.spec.ignoreMutation ? this.spec.ignoreMutation(e) : super.ignoreMutation(e);
    }
  };
function Yp(n, e, t) {
  let o = n.firstChild,
    r = !1;
  for (let i = 0; i < e.length; i++) {
    let s = e[i],
      l = s.dom;
    if (l.parentNode == n) {
      for (; l != o; ) (o = Zc(o)), (r = !0);
      o = o.nextSibling;
    } else (r = !0), n.insertBefore(l, o);
    if (s instanceof fi) {
      let a = o ? o.previousSibling : n.lastChild;
      Yp(s.contentDOM, s.children, t), (o = a ? a.nextSibling : n.firstChild);
    }
  }
  for (; o; ) (o = Zc(o)), (r = !0);
  r && t.trackWrites == n && (t.trackWrites = null);
}
const Ko = function (n) {
  n && (this.nodeName = n);
};
Ko.prototype = Object.create(null);
const Vt = [new Ko()];
function $l(n, e, t) {
  if (n.length == 0) return Vt;
  let o = t ? Vt[0] : new Ko(),
    r = [o];
  for (let i = 0; i < n.length; i++) {
    let s = n[i].type.attrs;
    if (s) {
      s.nodeName && r.push((o = new Ko(s.nodeName)));
      for (let l in s) {
        let a = s[l];
        a != null &&
          (t && r.length == 1 && r.push((o = new Ko(e.isInline ? "span" : "div"))),
          l == "class"
            ? (o.class = (o.class ? o.class + " " : "") + a)
            : l == "style"
              ? (o.style = (o.style ? o.style + ";" : "") + a)
              : l != "nodeName" && (o[l] = a));
      }
    }
  }
  return r;
}
function Xp(n, e, t, o) {
  if (t == Vt && o == Vt) return e;
  let r = e;
  for (let i = 0; i < o.length; i++) {
    let s = o[i],
      l = t[i];
    if (i) {
      let a;
      (l &&
        l.nodeName == s.nodeName &&
        r != n &&
        (a = r.parentNode) &&
        a.nodeName.toLowerCase() == s.nodeName) ||
        ((a = document.createElement(s.nodeName)),
        (a.pmIsDeco = !0),
        a.appendChild(r),
        (l = Vt[0])),
        (r = a);
    }
    Q1(r, l || Vt[0], s);
  }
  return r;
}
function Q1(n, e, t) {
  for (let o in e)
    o != "class" && o != "style" && o != "nodeName" && !(o in t) && n.removeAttribute(o);
  for (let o in t)
    o != "class" && o != "style" && o != "nodeName" && t[o] != e[o] && n.setAttribute(o, t[o]);
  if (e.class != t.class) {
    let o = e.class ? e.class.split(" ").filter(Boolean) : [],
      r = t.class ? t.class.split(" ").filter(Boolean) : [];
    for (let i = 0; i < o.length; i++) r.indexOf(o[i]) == -1 && n.classList.remove(o[i]);
    for (let i = 0; i < r.length; i++) o.indexOf(r[i]) == -1 && n.classList.add(r[i]);
    n.classList.length == 0 && n.removeAttribute("class");
  }
  if (e.style != t.style) {
    if (e.style) {
      let o = /\s*([\w\-\xa1-\uffff]+)\s*:(?:"(?:\\.|[^"])*"|'(?:\\.|[^'])*'|\(.*?\)|[^;])*/g,
        r;
      for (; (r = o.exec(e.style)); ) n.style.removeProperty(r[1]);
    }
    t.style && (n.style.cssText += t.style);
  }
}
function Qp(n, e, t) {
  return Xp(n, n, Vt, $l(e, t, n.nodeType != 1));
}
function Ml(n, e) {
  if (n.length != e.length) return !1;
  for (let t = 0; t < n.length; t++) if (!n[t].type.eq(e[t].type)) return !1;
  return !0;
}
function Zc(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
let Z1 = class {
  constructor(e, t, o) {
    (this.lock = t),
      (this.view = o),
      (this.index = 0),
      (this.stack = []),
      (this.changed = !1),
      (this.top = e),
      (this.preMatch = _1(e.node.content, e));
  }
  destroyBetween(e, t) {
    if (e != t) {
      for (let o = e; o < t; o++) this.top.children[o].destroy();
      this.top.children.splice(e, t - e), (this.changed = !0);
    }
  }
  destroyRest() {
    this.destroyBetween(this.index, this.top.children.length);
  }
  syncToMarks(e, t, o) {
    let r = 0,
      i = this.stack.length >> 1,
      s = Math.min(i, e.length);
    for (
      ;
      r < s &&
      (r == i - 1 ? this.top : this.stack[(r + 1) << 1]).matchesMark(e[r]) &&
      e[r].type.spec.spanning !== !1;

    )
      r++;
    for (; r < i; )
      this.destroyRest(),
        (this.top.dirty = je),
        (this.index = this.stack.pop()),
        (this.top = this.stack.pop()),
        i--;
    for (; i < e.length; ) {
      this.stack.push(this.top, this.index + 1);
      let l = -1;
      for (let a = this.index; a < Math.min(this.index + 3, this.top.children.length); a++) {
        let c = this.top.children[a];
        if (c.matchesMark(e[i]) && !this.isLocked(c.dom)) {
          l = a;
          break;
        }
      }
      if (l > -1)
        l > this.index && ((this.changed = !0), this.destroyBetween(this.index, l)),
          (this.top = this.top.children[this.index]);
      else {
        let a = fi.create(this.top, e[i], t, o);
        this.top.children.splice(this.index, 0, a), (this.top = a), (this.changed = !0);
      }
      (this.index = 0), i++;
    }
  }
  findNodeMatch(e, t, o, r) {
    let i = -1,
      s;
    if (
      r >= this.preMatch.index &&
      (s = this.preMatch.matches[r - this.preMatch.index]).parent == this.top &&
      s.matchesNode(e, t, o)
    )
      i = this.top.children.indexOf(s, this.index);
    else
      for (let l = this.index, a = Math.min(this.top.children.length, l + 5); l < a; l++) {
        let c = this.top.children[l];
        if (c.matchesNode(e, t, o) && !this.preMatch.matched.has(c)) {
          i = l;
          break;
        }
      }
    return i < 0 ? !1 : (this.destroyBetween(this.index, i), this.index++, !0);
  }
  updateNodeAt(e, t, o, r, i) {
    let s = this.top.children[r];
    return (
      s.dirty == et && s.dom == s.contentDOM && (s.dirty = Ft),
      s.update(e, t, o, i) ? (this.destroyBetween(this.index, r), this.index++, !0) : !1
    );
  }
  findIndexWithChild(e) {
    for (;;) {
      let t = e.parentNode;
      if (!t) return -1;
      if (t == this.top.contentDOM) {
        let o = e.pmViewDesc;
        if (o) {
          for (let r = this.index; r < this.top.children.length; r++)
            if (this.top.children[r] == o) return r;
        }
        return -1;
      }
      e = t;
    }
  }
  updateNextNode(e, t, o, r, i, s) {
    for (let l = this.index; l < this.top.children.length; l++) {
      let a = this.top.children[l];
      if (a instanceof Kn) {
        let c = this.preMatch.matched.get(a);
        if (c != null && c != i) return !1;
        let d = a.dom,
          h,
          p =
            this.isLocked(d) &&
            !(
              e.isText &&
              a.node &&
              a.node.isText &&
              a.nodeDOM.nodeValue == e.text &&
              a.dirty != et &&
              Ml(t, a.outerDeco)
            );
        if (!p && a.update(e, t, o, r))
          return (
            this.destroyBetween(this.index, l), a.dom != d && (this.changed = !0), this.index++, !0
          );
        if (!p && (h = this.recreateWrapper(a, e, t, o, r, s)))
          return (
            (this.top.children[this.index] = h),
            h.contentDOM && ((h.dirty = Ft), h.updateChildren(r, s + 1), (h.dirty = je)),
            (this.changed = !0),
            this.index++,
            !0
          );
        break;
      }
    }
    return !1;
  }
  recreateWrapper(e, t, o, r, i, s) {
    if (e.dirty || t.isAtom || !e.children.length || !e.node.content.eq(t.content)) return null;
    let l = Kn.create(this.top, t, o, r, i, s);
    if (l.contentDOM) {
      (l.children = e.children), (e.children = []);
      for (let a of l.children) a.parent = l;
    }
    return e.destroy(), l;
  }
  addNode(e, t, o, r, i) {
    let s = Kn.create(this.top, e, t, o, r, i);
    s.contentDOM && s.updateChildren(r, i + 1),
      this.top.children.splice(this.index++, 0, s),
      (this.changed = !0);
  }
  placeWidget(e, t, o) {
    let r = this.index < this.top.children.length ? this.top.children[this.index] : null;
    if (r && r.matchesWidget(e) && (e == r.widget || !r.widget.type.toDOM.parentNode)) this.index++;
    else {
      let i = new Kp(this.top, e, t, o);
      this.top.children.splice(this.index++, 0, i), (this.changed = !0);
    }
  }
  addTextblockHacks() {
    let e = this.top.children[this.index - 1],
      t = this.top;
    for (; e instanceof fi; ) (t = e), (e = t.children[t.children.length - 1]);
    (!e ||
      !(e instanceof Hp) ||
      /\n$/.test(e.node.text) ||
      (this.view.requiresGeckoHackNode && /\s$/.test(e.node.text))) &&
      ((Se || ve) && e && e.dom.contentEditable == "false" && this.addHackNode("IMG", t),
      this.addHackNode("BR", this.top));
  }
  addHackNode(e, t) {
    if (t == this.top && this.index < t.children.length && t.children[this.index].matchesHack(e))
      this.index++;
    else {
      let o = document.createElement(e);
      e == "IMG" && ((o.className = "ProseMirror-separator"), (o.alt = "")),
        e == "BR" && (o.className = "ProseMirror-trailingBreak");
      let r = new Gp(this.top, [], o, null);
      t != this.top ? t.children.push(r) : t.children.splice(this.index++, 0, r),
        (this.changed = !0);
    }
  }
  isLocked(e) {
    return this.lock && (e == this.lock || (e.nodeType == 1 && e.contains(this.lock.parentNode)));
  }
};
function _1(n, e) {
  let t = e,
    o = t.children.length,
    r = n.childCount,
    i = new Map(),
    s = [];
  e: for (; r > 0; ) {
    let l;
    for (;;)
      if (o) {
        let c = t.children[o - 1];
        if (c instanceof fi) (t = c), (o = c.children.length);
        else {
          (l = c), o--;
          break;
        }
      } else {
        if (t == e) break e;
        (o = t.parent.children.indexOf(t)), (t = t.parent);
      }
    let a = l.node;
    if (a) {
      if (a != n.child(r - 1)) break;
      --r, i.set(l, r), s.push(l);
    }
  }
  return { index: r, matched: i, matches: s.reverse() };
}
function e0(n, e) {
  return n.type.side - e.type.side;
}
function t0(n, e, t, o) {
  let r = e.locals(n),
    i = 0;
  if (r.length == 0) {
    for (let c = 0; c < n.childCount; c++) {
      let d = n.child(c);
      o(d, r, e.forChild(i, d), c), (i += d.nodeSize);
    }
    return;
  }
  let s = 0,
    l = [],
    a = null;
  for (let c = 0; ; ) {
    let d, h;
    for (; s < r.length && r[s].to == i; ) {
      let g = r[s++];
      g.widget && (d ? (h || (h = [d])).push(g) : (d = g));
    }
    if (d)
      if (h) {
        h.sort(e0);
        for (let g = 0; g < h.length; g++) t(h[g], c, !!a);
      } else t(d, c, !!a);
    let p, f;
    if (a) (f = -1), (p = a), (a = null);
    else if (c < n.childCount) (f = c), (p = n.child(c++));
    else break;
    for (let g = 0; g < l.length; g++) l[g].to <= i && l.splice(g--, 1);
    for (; s < r.length && r[s].from <= i && r[s].to > i; ) l.push(r[s++]);
    let u = i + p.nodeSize;
    if (p.isText) {
      let g = u;
      s < r.length && r[s].from < g && (g = r[s].from);
      for (let y = 0; y < l.length; y++) l[y].to < g && (g = l[y].to);
      g < u && ((a = p.cut(g - i)), (p = p.cut(0, g - i)), (u = g), (f = -1));
    } else for (; s < r.length && r[s].to < u; ) s++;
    let m = p.isInline && !p.isLeaf ? l.filter((g) => !g.inline) : l.slice();
    o(p, m, e.forChild(i, p), f), (i = u);
  }
}
function n0(n) {
  if (n.nodeName == "UL" || n.nodeName == "OL") {
    let e = n.style.cssText;
    (n.style.cssText = e + "; list-style: square !important"),
      window.getComputedStyle(n).listStyle,
      (n.style.cssText = e);
  }
}
function o0(n, e, t, o) {
  for (let r = 0, i = 0; r < n.childCount && i <= o; ) {
    let s = n.child(r++),
      l = i;
    if (((i += s.nodeSize), !s.isText)) continue;
    let a = s.text;
    for (; r < n.childCount; ) {
      let c = n.child(r++);
      if (((i += c.nodeSize), !c.isText)) break;
      a += c.text;
    }
    if (i >= t) {
      if (i >= o && a.slice(o - e.length - l, o - l) == e) return o - e.length;
      let c = l < o ? a.lastIndexOf(e, o - l - 1) : -1;
      if (c >= 0 && c + e.length + l >= t) return l + c;
      if (t == o && a.length >= o + e.length - l && a.slice(o - l, o - l + e.length) == e) return o;
    }
  }
  return -1;
}
function Cl(n, e, t, o, r) {
  let i = [];
  for (let s = 0, l = 0; s < n.length; s++) {
    let a = n[s],
      c = l,
      d = (l += a.size);
    c >= t || d <= e
      ? i.push(a)
      : (c < e && i.push(a.slice(0, e - c, o)),
        r && (i.push(r), (r = void 0)),
        d > t && i.push(a.slice(t - c, a.size, o)));
  }
  return i;
}
function Ca(n, e = null) {
  let t = n.domSelectionRange(),
    o = n.state.doc;
  if (!t.focusNode) return null;
  let r = n.docView.nearestDesc(t.focusNode),
    i = r && r.size == 0,
    s = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (s < 0) return null;
  let l = o.resolve(s),
    a,
    c;
  if (Hi(t)) {
    for (a = l; r && !r.node; ) r = r.parent;
    let d = r.node;
    if (
      r &&
      d.isAtom &&
      D.isSelectable(d) &&
      r.parent &&
      !(d.isInline && N1(t.focusNode, t.focusOffset, r.dom))
    ) {
      let h = r.posBefore;
      c = new D(s == h ? l : o.resolve(h));
    }
  } else {
    let d = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (d < 0) return null;
    a = o.resolve(d);
  }
  if (!c) {
    let d = e == "pointer" || (n.state.selection.head < l.pos && !i) ? 1 : -1;
    c = Oa(n, a, l, d);
  }
  return c;
}
function Zp(n) {
  return n.editable
    ? n.hasFocus()
    : ef(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function ct(n, e = !1) {
  let t = n.state.selection;
  if ((_p(n, t), !!Zp(n))) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && ve) {
      let o = n.domSelectionRange(),
        r = n.domObserver.currentSelection;
      if (
        o.anchorNode &&
        r.anchorNode &&
        dn(o.anchorNode, o.anchorOffset, r.anchorNode, r.anchorOffset)
      ) {
        (n.input.mouseDown.delayedSelectionSync = !0), n.domObserver.setCurSelection();
        return;
      }
    }
    if ((n.domObserver.disconnectSelection(), n.cursorWrapper)) i0(n);
    else {
      let { anchor: o, head: r } = t,
        i,
        s;
      _c &&
        !(t instanceof J) &&
        (t.$from.parent.inlineContent || (i = ed(n, t.from)),
        !t.empty && !t.$from.parent.inlineContent && (s = ed(n, t.to))),
        n.docView.setSelection(o, r, n.root, e),
        _c && (i && td(i), s && td(s)),
        t.visible
          ? n.dom.classList.remove("ProseMirror-hideselection")
          : (n.dom.classList.add("ProseMirror-hideselection"),
            "onselectionchange" in document && r0(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const _c = Se || (ve && A1 < 63);
function ed(n, e) {
  let { node: t, offset: o } = n.docView.domFromPos(e, 0),
    r = o < t.childNodes.length ? t.childNodes[o] : null,
    i = o ? t.childNodes[o - 1] : null;
  if (Se && r && r.contentEditable == "false") return bs(r);
  if ((!r || r.contentEditable == "false") && (!i || i.contentEditable == "false")) {
    if (r) return bs(r);
    if (i) return bs(i);
  }
}
function bs(n) {
  return (
    (n.contentEditable = "true"),
    Se && n.draggable && ((n.draggable = !1), (n.wasDraggable = !0)),
    n
  );
}
function td(n) {
  (n.contentEditable = "false"), n.wasDraggable && ((n.draggable = !0), (n.wasDraggable = null));
}
function r0(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(),
    o = t.anchorNode,
    r = t.anchorOffset;
  e.addEventListener(
    "selectionchange",
    (n.input.hideSelectionGuard = () => {
      (t.anchorNode != o || t.anchorOffset != r) &&
        (e.removeEventListener("selectionchange", n.input.hideSelectionGuard),
        setTimeout(() => {
          (!Zp(n) || n.state.selection.visible) &&
            n.dom.classList.remove("ProseMirror-hideselection");
        }, 20));
    }),
  );
}
function i0(n) {
  let e = n.domSelection(),
    t = document.createRange(),
    o = n.cursorWrapper.dom,
    r = o.nodeName == "IMG";
  r ? t.setEnd(o.parentNode, oe(o) + 1) : t.setEnd(o, 0),
    t.collapse(!1),
    e.removeAllRanges(),
    e.addRange(t),
    !r && !n.state.selection.visible && Ce && St <= 11 && ((o.disabled = !0), (o.disabled = !1));
}
function _p(n, e) {
  if (e instanceof D) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (nd(n), t && t.selectNode(), (n.lastSelectedViewDesc = t));
  } else nd(n);
}
function nd(n) {
  n.lastSelectedViewDesc &&
    (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(),
    (n.lastSelectedViewDesc = void 0));
}
function Oa(n, e, t, o) {
  return n.someProp("createSelectionBetween", (r) => r(n, e, t)) || J.between(e, t, o);
}
function od(n) {
  return n.editable && !n.hasFocus() ? !1 : ef(n);
}
function ef(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode) return !1;
  try {
    return (
      n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) &&
      (n.editable ||
        n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode))
    );
  } catch {
    return !1;
  }
}
function s0(n) {
  let e = n.docView.domFromPos(n.state.selection.anchor, 0),
    t = n.domSelectionRange();
  return dn(e.node, e.offset, t.anchorNode, t.anchorOffset);
}
function Ol(n, e) {
  let { $anchor: t, $head: o } = n.selection,
    r = e > 0 ? t.max(o) : t.min(o),
    i = r.parent.inlineContent
      ? r.depth
        ? n.doc.resolve(e > 0 ? r.after() : r.before())
        : null
      : r;
  return i && P.findFrom(i, e);
}
function gt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function rd(n, e, t) {
  let o = n.state.selection;
  if (o instanceof J)
    if (t.indexOf("s") > -1) {
      let { $head: r } = o,
        i = r.textOffset ? null : e < 0 ? r.nodeBefore : r.nodeAfter;
      if (!i || i.isText || !i.isLeaf) return !1;
      let s = n.state.doc.resolve(r.pos + i.nodeSize * (e < 0 ? -1 : 1));
      return gt(n, new J(o.$anchor, s));
    } else if (o.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let r = Ol(n.state, e);
        return r && r instanceof D ? gt(n, r) : !1;
      } else if (!(Be && t.indexOf("m") > -1)) {
        let r = o.$head,
          i = r.textOffset ? null : e < 0 ? r.nodeBefore : r.nodeAfter,
          s;
        if (!i || i.isText) return !1;
        let l = e < 0 ? r.pos - i.nodeSize : r.pos;
        return i.isAtom || ((s = n.docView.descAt(l)) && !s.contentDOM)
          ? D.isSelectable(i)
            ? gt(n, new D(e < 0 ? n.state.doc.resolve(r.pos - i.nodeSize) : r))
            : vr
              ? gt(n, new J(n.state.doc.resolve(e < 0 ? l : l + i.nodeSize)))
              : !1
          : !1;
      }
    } else return !1;
  else {
    if (o instanceof D && o.node.isInline) return gt(n, new J(e > 0 ? o.$to : o.$from));
    {
      let r = Ol(n.state, e);
      return r ? gt(n, r) : !1;
    }
  }
}
function ui(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Wo(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function Mn(n, e) {
  return e < 0 ? l0(n) : a0(n);
}
function l0(n) {
  let e = n.domSelectionRange(),
    t = e.focusNode,
    o = e.focusOffset;
  if (!t) return;
  let r,
    i,
    s = !1;
  for (Ke && t.nodeType == 1 && o < ui(t) && Wo(t.childNodes[o], -1) && (s = !0); ; )
    if (o > 0) {
      if (t.nodeType != 1) break;
      {
        let l = t.childNodes[o - 1];
        if (Wo(l, -1)) (r = t), (i = --o);
        else if (l.nodeType == 3) (t = l), (o = t.nodeValue.length);
        else break;
      }
    } else {
      if (tf(t)) break;
      {
        let l = t.previousSibling;
        for (; l && Wo(l, -1); ) (r = t.parentNode), (i = oe(l)), (l = l.previousSibling);
        if (l) (t = l), (o = ui(t));
        else {
          if (((t = t.parentNode), t == n.dom)) break;
          o = 0;
        }
      }
    }
  s ? Nl(n, t, o) : r && Nl(n, r, i);
}
function a0(n) {
  let e = n.domSelectionRange(),
    t = e.focusNode,
    o = e.focusOffset;
  if (!t) return;
  let r = ui(t),
    i,
    s;
  for (;;)
    if (o < r) {
      if (t.nodeType != 1) break;
      let l = t.childNodes[o];
      if (Wo(l, 1)) (i = t), (s = ++o);
      else break;
    } else {
      if (tf(t)) break;
      {
        let l = t.nextSibling;
        for (; l && Wo(l, 1); ) (i = l.parentNode), (s = oe(l) + 1), (l = l.nextSibling);
        if (l) (t = l), (o = 0), (r = ui(t));
        else {
          if (((t = t.parentNode), t == n.dom)) break;
          o = r = 0;
        }
      }
    }
  i && Nl(n, i, s);
}
function tf(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function c0(n, e) {
  for (; n && e == n.childNodes.length && !br(n); ) (e = oe(n) + 1), (n = n.parentNode);
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3) return t;
    if (t.nodeType == 1 && t.contentEditable == "false") break;
    (n = t), (e = 0);
  }
}
function d0(n, e) {
  for (; n && !e && !br(n); ) (e = oe(n)), (n = n.parentNode);
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3) return t;
    if (t.nodeType == 1 && t.contentEditable == "false") break;
    (n = t), (e = n.childNodes.length);
  }
}
function Nl(n, e, t) {
  if (e.nodeType != 3) {
    let i, s;
    (s = c0(e, t)) ? ((e = s), (t = 0)) : (i = d0(e, t)) && ((e = i), (t = i.nodeValue.length));
  }
  let o = n.domSelection();
  if (Hi(o)) {
    let i = document.createRange();
    i.setEnd(e, t), i.setStart(e, t), o.removeAllRanges(), o.addRange(i);
  } else o.extend && o.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: r } = n;
  setTimeout(() => {
    n.state == r && ct(n);
  }, 50);
}
function id(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(ve || I1) && t.parent.inlineContent) {
    let o = n.coordsAtPos(e);
    if (e > t.start()) {
      let r = n.coordsAtPos(e - 1),
        i = (r.top + r.bottom) / 2;
      if (i > o.top && i < o.bottom && Math.abs(r.left - o.left) > 1)
        return r.left < o.left ? "ltr" : "rtl";
    }
    if (e < t.end()) {
      let r = n.coordsAtPos(e + 1),
        i = (r.top + r.bottom) / 2;
      if (i > o.top && i < o.bottom && Math.abs(r.left - o.left) > 1)
        return r.left > o.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
}
function sd(n, e, t) {
  let o = n.state.selection;
  if ((o instanceof J && !o.empty) || t.indexOf("s") > -1 || (Be && t.indexOf("m") > -1)) return !1;
  let { $from: r, $to: i } = o;
  if (!r.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let s = Ol(n.state, e);
    if (s && s instanceof D) return gt(n, s);
  }
  if (!r.parent.inlineContent) {
    let s = e < 0 ? r : i,
      l = o instanceof en ? P.near(s, e) : P.findFrom(s, e);
    return l ? gt(n, l) : !1;
  }
  return !1;
}
function ld(n, e) {
  if (!(n.state.selection instanceof J)) return !0;
  let { $head: t, $anchor: o, empty: r } = n.state.selection;
  if (!t.sameParent(o)) return !0;
  if (!r) return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward")) return !0;
  let i = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (i && !i.isText) {
    let s = n.state.tr;
    return (
      e < 0 ? s.delete(t.pos - i.nodeSize, t.pos) : s.delete(t.pos, t.pos + i.nodeSize),
      n.dispatch(s),
      !0
    );
  }
  return !1;
}
function ad(n, e, t) {
  n.domObserver.stop(), (e.contentEditable = t), n.domObserver.start();
}
function h0(n) {
  if (!Se || n.state.selection.$head.parentOffset > 0) return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let o = e.firstChild;
    ad(n, o, "true"), setTimeout(() => ad(n, o, "false"), 20);
  }
  return !1;
}
function p0(n) {
  let e = "";
  return (
    n.ctrlKey && (e += "c"),
    n.metaKey && (e += "m"),
    n.altKey && (e += "a"),
    n.shiftKey && (e += "s"),
    e
  );
}
function f0(n, e) {
  let t = e.keyCode,
    o = p0(e);
  if (t == 8 || (Be && t == 72 && o == "c")) return ld(n, -1) || Mn(n, -1);
  if ((t == 46 && !e.shiftKey) || (Be && t == 68 && o == "c")) return ld(n, 1) || Mn(n, 1);
  if (t == 13 || t == 27) return !0;
  if (t == 37 || (Be && t == 66 && o == "c")) {
    let r = t == 37 ? (id(n, n.state.selection.from) == "ltr" ? -1 : 1) : -1;
    return rd(n, r, o) || Mn(n, r);
  } else if (t == 39 || (Be && t == 70 && o == "c")) {
    let r = t == 39 ? (id(n, n.state.selection.from) == "ltr" ? 1 : -1) : 1;
    return rd(n, r, o) || Mn(n, r);
  } else {
    if (t == 38 || (Be && t == 80 && o == "c")) return sd(n, -1, o) || Mn(n, -1);
    if (t == 40 || (Be && t == 78 && o == "c")) return h0(n) || sd(n, 1, o) || Mn(n, 1);
    if (o == (Be ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90)) return !0;
  }
  return !1;
}
function nf(n, e) {
  n.someProp("transformCopied", (f) => {
    e = f(e, n);
  });
  let t = [],
    { content: o, openStart: r, openEnd: i } = e;
  for (; r > 1 && i > 1 && o.childCount == 1 && o.firstChild.childCount == 1; ) {
    r--, i--;
    let f = o.firstChild;
    t.push(f.type.name, f.attrs != f.type.defaultAttrs ? f.attrs : null), (o = f.content);
  }
  let s = n.someProp("clipboardSerializer") || yr.fromSchema(n.state.schema),
    l = cf(),
    a = l.createElement("div");
  a.appendChild(s.serializeFragment(o, { document: l }));
  let c = a.firstChild,
    d,
    h = 0;
  for (; c && c.nodeType == 1 && (d = af[c.nodeName.toLowerCase()]); ) {
    for (let f = d.length - 1; f >= 0; f--) {
      let u = l.createElement(d[f]);
      for (; a.firstChild; ) u.appendChild(a.firstChild);
      a.appendChild(u), h++;
    }
    c = a.firstChild;
  }
  c &&
    c.nodeType == 1 &&
    c.setAttribute("data-pm-slice", `${r} ${i}${h ? ` -${h}` : ""} ${JSON.stringify(t)}`);
  let p =
    n.someProp("clipboardTextSerializer", (f) => f(e, n)) ||
    e.content.textBetween(
      0,
      e.content.size,
      `

`,
    );
  return { dom: a, text: p };
}
function of(n, e, t, o, r) {
  let i = r.parent.type.spec.code,
    s,
    l;
  if (!t && !e) return null;
  let a = e && (o || i || !t);
  if (a) {
    if (
      (n.someProp("transformPastedText", (p) => {
        e = p(e, i || o, n);
      }),
      i)
    )
      return e
        ? new S(
            k.from(
              n.state.schema.text(
                e.replace(
                  /\r\n?/g,
                  `
`,
                ),
              ),
            ),
            0,
            0,
          )
        : S.empty;
    let h = n.someProp("clipboardTextParser", (p) => p(e, r, o, n));
    if (h) l = h;
    else {
      let p = r.marks(),
        { schema: f } = n.state,
        u = yr.fromSchema(f);
      (s = document.createElement("div")),
        e.split(/(?:\r\n?|\n)+/).forEach((m) => {
          let g = s.appendChild(document.createElement("p"));
          m && g.appendChild(u.serializeNode(f.text(m, p)));
        });
    }
  } else
    n.someProp("transformPastedHTML", (h) => {
      t = h(t, n);
    }),
      (s = g0(t)),
      vr && y0(s);
  let c = s && s.querySelector("[data-pm-slice]"),
    d = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (d && d[3])
    for (let h = +d[3]; h > 0; h--) {
      let p = s.firstChild;
      for (; p && p.nodeType != 1; ) p = p.nextSibling;
      if (!p) break;
      s = p;
    }
  if (
    (l ||
      (l = (
        n.someProp("clipboardParser") ||
        n.someProp("domParser") ||
        ba.fromSchema(n.state.schema)
      ).parseSlice(s, {
        preserveWhitespace: !!(a || d),
        context: r,
        ruleFromNode(h) {
          return h.nodeName == "BR" &&
            !h.nextSibling &&
            h.parentNode &&
            !u0.test(h.parentNode.nodeName)
            ? { ignore: !0 }
            : null;
        },
      })),
    d)
  )
    l = k0(cd(l, +d[1], +d[2]), d[4]);
  else if (((l = S.maxOpen(m0(l.content, r), !0)), l.openStart || l.openEnd)) {
    let h = 0,
      p = 0;
    for (
      let f = l.content.firstChild;
      h < l.openStart && !f.type.spec.isolating;
      h++, f = f.firstChild
    );
    for (
      let f = l.content.lastChild;
      p < l.openEnd && !f.type.spec.isolating;
      p++, f = f.lastChild
    );
    l = cd(l, h, p);
  }
  return (
    n.someProp("transformPasted", (h) => {
      l = h(l, n);
    }),
    l
  );
}
const u0 =
  /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function m0(n, e) {
  if (n.childCount < 2) return n;
  for (let t = e.depth; t >= 0; t--) {
    let o = e.node(t).contentMatchAt(e.index(t)),
      r,
      i = [];
    if (
      (n.forEach((s) => {
        if (!i) return;
        let l = o.findWrapping(s.type),
          a;
        if (!l) return (i = null);
        if ((a = i.length && r.length && sf(l, r, s, i[i.length - 1], 0))) i[i.length - 1] = a;
        else {
          i.length && (i[i.length - 1] = lf(i[i.length - 1], r.length));
          let c = rf(s, l);
          i.push(c), (o = o.matchType(c.type)), (r = l);
        }
      }),
      i)
    )
      return k.from(i);
  }
  return n;
}
function rf(n, e, t = 0) {
  for (let o = e.length - 1; o >= t; o--) n = e[o].create(null, k.from(n));
  return n;
}
function sf(n, e, t, o, r) {
  if (r < n.length && r < e.length && n[r] == e[r]) {
    let i = sf(n, e, t, o.lastChild, r + 1);
    if (i) return o.copy(o.content.replaceChild(o.childCount - 1, i));
    if (o.contentMatchAt(o.childCount).matchType(r == n.length - 1 ? t.type : n[r + 1]))
      return o.copy(o.content.append(k.from(rf(t, n, r + 1))));
  }
}
function lf(n, e) {
  if (e == 0) return n;
  let t = n.content.replaceChild(n.childCount - 1, lf(n.lastChild, e - 1)),
    o = n.contentMatchAt(n.childCount).fillBefore(k.empty, !0);
  return n.copy(t.append(o));
}
function Tl(n, e, t, o, r, i) {
  let s = e < 0 ? n.firstChild : n.lastChild,
    l = s.content;
  return (
    n.childCount > 1 && (i = 0),
    r < o - 1 && (l = Tl(l, e, t, o, r + 1, i)),
    r >= t &&
      (l =
        e < 0
          ? s
              .contentMatchAt(0)
              .fillBefore(l, i <= r)
              .append(l)
          : l.append(s.contentMatchAt(s.childCount).fillBefore(k.empty, !0))),
    n.replaceChild(e < 0 ? 0 : n.childCount - 1, s.copy(l))
  );
}
function cd(n, e, t) {
  return (
    e < n.openStart && (n = new S(Tl(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)),
    t < n.openEnd && (n = new S(Tl(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)),
    n
  );
}
const af = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"],
};
let dd = null;
function cf() {
  return dd || (dd = document.implementation.createHTMLDocument("title"));
}
function g0(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = cf().createElement("div"),
    o = /<([a-z][^>\s]+)/i.exec(n),
    r;
  if (
    ((r = o && af[o[1].toLowerCase()]) &&
      (n =
        r.map((i) => "<" + i + ">").join("") +
        n +
        r
          .map((i) => "</" + i + ">")
          .reverse()
          .join("")),
    (t.innerHTML = n),
    r)
  )
    for (let i = 0; i < r.length; i++) t = t.querySelector(r[i]) || t;
  return t;
}
function y0(n) {
  let e = n.querySelectorAll(ve ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let o = e[t];
    o.childNodes.length == 1 &&
      o.textContent == " " &&
      o.parentNode &&
      o.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), o);
  }
}
function k0(n, e) {
  if (!n.size) return n;
  let t = n.content.firstChild.type.schema,
    o;
  try {
    o = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: r, openStart: i, openEnd: s } = n;
  for (let l = o.length - 2; l >= 0; l -= 2) {
    let a = t.nodes[o[l]];
    if (!a || a.hasRequiredAttrs()) break;
    (r = k.from(a.create(o[l + 1], r))), i++, s++;
  }
  return new S(r, i, s);
}
const $e = {},
  Me = {},
  w0 = { touchstart: !0, touchmove: !0 };
let b0 = class {
  constructor() {
    (this.shiftKey = !1),
      (this.mouseDown = null),
      (this.lastKeyCode = null),
      (this.lastKeyCodeTime = 0),
      (this.lastClick = { time: 0, x: 0, y: 0, type: "" }),
      (this.lastSelectionOrigin = null),
      (this.lastSelectionTime = 0),
      (this.lastIOSEnter = 0),
      (this.lastIOSEnterFallbackTimeout = -1),
      (this.lastFocus = 0),
      (this.lastTouch = 0),
      (this.lastAndroidDelete = 0),
      (this.composing = !1),
      (this.compositionNode = null),
      (this.composingTimeout = -1),
      (this.compositionNodes = []),
      (this.compositionEndedAt = -2e8),
      (this.compositionID = 1),
      (this.compositionPendingChanges = 0),
      (this.domChangeCount = 0),
      (this.eventHandlers = Object.create(null)),
      (this.hideSelectionGuard = null);
  }
};
function v0(n) {
  for (let e in $e) {
    let t = $e[e];
    n.dom.addEventListener(
      e,
      (n.input.eventHandlers[e] = (o) => {
        S0(n, o) && !Na(n, o) && (n.editable || !(o.type in Me)) && t(n, o);
      }),
      w0[e] ? { passive: !0 } : void 0,
    );
  }
  Se && n.dom.addEventListener("input", () => null), El(n);
}
function bt(n, e) {
  (n.input.lastSelectionOrigin = e), (n.input.lastSelectionTime = Date.now());
}
function x0(n) {
  n.domObserver.stop();
  for (let e in n.input.eventHandlers) n.dom.removeEventListener(e, n.input.eventHandlers[e]);
  clearTimeout(n.input.composingTimeout), clearTimeout(n.input.lastIOSEnterFallbackTimeout);
}
function El(n) {
  n.someProp("handleDOMEvents", (e) => {
    for (let t in e)
      n.input.eventHandlers[t] ||
        n.dom.addEventListener(t, (n.input.eventHandlers[t] = (o) => Na(n, o)));
  });
}
function Na(n, e) {
  return n.someProp("handleDOMEvents", (t) => {
    let o = t[e.type];
    return o ? o(n, e) || e.defaultPrevented : !1;
  });
}
function S0(n, e) {
  if (!e.bubbles) return !0;
  if (e.defaultPrevented) return !1;
  for (let t = e.target; t != n.dom; t = t.parentNode)
    if (!t || t.nodeType == 11 || (t.pmViewDesc && t.pmViewDesc.stopEvent(e))) return !1;
  return !0;
}
function $0(n, e) {
  !Na(n, e) && $e[e.type] && (n.editable || !(e.type in Me)) && $e[e.type](n, e);
}
Me.keydown = (n, e) => {
  let t = e;
  if (
    ((n.input.shiftKey = t.keyCode == 16 || t.shiftKey),
    !hf(n, t) &&
      ((n.input.lastKeyCode = t.keyCode),
      (n.input.lastKeyCodeTime = Date.now()),
      !(Je && ve && t.keyCode == 13)))
  )
    if (
      (t.keyCode != 229 && n.domObserver.forceFlush(),
      Zn && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey)
    ) {
      let o = Date.now();
      (n.input.lastIOSEnter = o),
        (n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
          n.input.lastIOSEnter == o &&
            (n.someProp("handleKeyDown", (r) => r(n, Pt(13, "Enter"))), (n.input.lastIOSEnter = 0));
        }, 200));
    } else
      n.someProp("handleKeyDown", (o) => o(n, t)) || f0(n, t) ? t.preventDefault() : bt(n, "key");
};
Me.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
Me.keypress = (n, e) => {
  let t = e;
  if (hf(n, t) || !t.charCode || (t.ctrlKey && !t.altKey) || (Be && t.metaKey)) return;
  if (n.someProp("handleKeyPress", (r) => r(n, t))) {
    t.preventDefault();
    return;
  }
  let o = n.state.selection;
  if (!(o instanceof J) || !o.$from.sameParent(o.$to)) {
    let r = String.fromCharCode(t.charCode);
    !/[\r\n]/.test(r) &&
      !n.someProp("handleTextInput", (i) => i(n, o.$from.pos, o.$to.pos, r)) &&
      n.dispatch(n.state.tr.insertText(r).scrollIntoView()),
      t.preventDefault();
  }
};
function Ui(n) {
  return { left: n.clientX, top: n.clientY };
}
function M0(n, e) {
  let t = e.x - n.clientX,
    o = e.y - n.clientY;
  return t * t + o * o < 100;
}
function Ta(n, e, t, o, r) {
  if (o == -1) return !1;
  let i = n.state.doc.resolve(o);
  for (let s = i.depth + 1; s > 0; s--)
    if (
      n.someProp(e, (l) =>
        s > i.depth
          ? l(n, t, i.nodeAfter, i.before(s), r, !0)
          : l(n, t, i.node(s), i.before(s), r, !1),
      )
    )
      return !0;
  return !1;
}
function Wn(n, e, t) {
  n.focused || n.focus();
  let o = n.state.tr.setSelection(e);
  t == "pointer" && o.setMeta("pointer", !0), n.dispatch(o);
}
function C0(n, e) {
  if (e == -1) return !1;
  let t = n.state.doc.resolve(e),
    o = t.nodeAfter;
  return o && o.isAtom && D.isSelectable(o) ? (Wn(n, new D(t), "pointer"), !0) : !1;
}
function O0(n, e) {
  if (e == -1) return !1;
  let t = n.state.selection,
    o,
    r;
  t instanceof D && (o = t.node);
  let i = n.state.doc.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let l = s > i.depth ? i.nodeAfter : i.node(s);
    if (D.isSelectable(l)) {
      o && t.$from.depth > 0 && s >= t.$from.depth && i.before(t.$from.depth + 1) == t.$from.pos
        ? (r = i.before(t.$from.depth))
        : (r = i.before(s));
      break;
    }
  }
  return r != null ? (Wn(n, D.create(n.state.doc, r), "pointer"), !0) : !1;
}
function N0(n, e, t, o, r) {
  return (
    Ta(n, "handleClickOn", e, t, o) ||
    n.someProp("handleClick", (i) => i(n, e, o)) ||
    (r ? O0(n, t) : C0(n, t))
  );
}
function T0(n, e, t, o) {
  return (
    Ta(n, "handleDoubleClickOn", e, t, o) || n.someProp("handleDoubleClick", (r) => r(n, e, o))
  );
}
function E0(n, e, t, o) {
  return (
    Ta(n, "handleTripleClickOn", e, t, o) ||
    n.someProp("handleTripleClick", (r) => r(n, e, o)) ||
    A0(n, t, o)
  );
}
function A0(n, e, t) {
  if (t.button != 0) return !1;
  let o = n.state.doc;
  if (e == -1) return o.inlineContent ? (Wn(n, J.create(o, 0, o.content.size), "pointer"), !0) : !1;
  let r = o.resolve(e);
  for (let i = r.depth + 1; i > 0; i--) {
    let s = i > r.depth ? r.nodeAfter : r.node(i),
      l = r.before(i);
    if (s.inlineContent) Wn(n, J.create(o, l + 1, l + 1 + s.content.size), "pointer");
    else if (D.isSelectable(s)) Wn(n, D.create(o, l), "pointer");
    else continue;
    return !0;
  }
}
function Ea(n) {
  return mi(n);
}
const df = Be ? "metaKey" : "ctrlKey";
$e.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let o = Ea(n),
    r = Date.now(),
    i = "singleClick";
  r - n.input.lastClick.time < 500 &&
    M0(t, n.input.lastClick) &&
    !t[df] &&
    (n.input.lastClick.type == "singleClick"
      ? (i = "doubleClick")
      : n.input.lastClick.type == "doubleClick" && (i = "tripleClick")),
    (n.input.lastClick = { time: r, x: t.clientX, y: t.clientY, type: i });
  let s = n.posAtCoords(Ui(t));
  s &&
    (i == "singleClick"
      ? (n.input.mouseDown && n.input.mouseDown.done(), (n.input.mouseDown = new I0(n, s, t, !!o)))
      : (i == "doubleClick" ? T0 : E0)(n, s.pos, s.inside, t)
        ? t.preventDefault()
        : bt(n, "pointer"));
};
let I0 = class {
  constructor(e, t, o, r) {
    (this.view = e),
      (this.pos = t),
      (this.event = o),
      (this.flushed = r),
      (this.delayedSelectionSync = !1),
      (this.mightDrag = null),
      (this.startDoc = e.state.doc),
      (this.selectNode = !!o[df]),
      (this.allowDefault = o.shiftKey);
    let i, s;
    if (t.inside > -1) (i = e.state.doc.nodeAt(t.inside)), (s = t.inside);
    else {
      let d = e.state.doc.resolve(t.pos);
      (i = d.parent), (s = d.depth ? d.before() : 0);
    }
    const l = r ? null : o.target,
      a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a ? a.dom : null;
    let { selection: c } = e.state;
    ((o.button == 0 && i.type.spec.draggable && i.type.spec.selectable !== !1) ||
      (c instanceof D && c.from <= s && c.to > s)) &&
      (this.mightDrag = {
        node: i,
        pos: s,
        addAttr: !!(this.target && !this.target.draggable),
        setUneditable: !!(this.target && Ke && !this.target.hasAttribute("contentEditable")),
      }),
      this.target &&
        this.mightDrag &&
        (this.mightDrag.addAttr || this.mightDrag.setUneditable) &&
        (this.view.domObserver.stop(),
        this.mightDrag.addAttr && (this.target.draggable = !0),
        this.mightDrag.setUneditable &&
          setTimeout(() => {
            this.view.input.mouseDown == this &&
              this.target.setAttribute("contentEditable", "false");
          }, 20),
        this.view.domObserver.start()),
      e.root.addEventListener("mouseup", (this.up = this.up.bind(this))),
      e.root.addEventListener("mousemove", (this.move = this.move.bind(this))),
      bt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up),
      this.view.root.removeEventListener("mousemove", this.move),
      this.mightDrag &&
        this.target &&
        (this.view.domObserver.stop(),
        this.mightDrag.addAttr && this.target.removeAttribute("draggable"),
        this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"),
        this.view.domObserver.start()),
      this.delayedSelectionSync && setTimeout(() => ct(this.view)),
      (this.view.input.mouseDown = null);
  }
  up(e) {
    if ((this.done(), !this.view.dom.contains(e.target))) return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(Ui(e))),
      this.updateAllowDefault(e),
      this.allowDefault || !t
        ? bt(this.view, "pointer")
        : N0(this.view, t.pos, t.inside, e, this.selectNode)
          ? e.preventDefault()
          : e.button == 0 &&
              (this.flushed ||
                (Se && this.mightDrag && !this.mightDrag.node.isAtom) ||
                (ve &&
                  !this.view.state.selection.visible &&
                  Math.min(
                    Math.abs(t.pos - this.view.state.selection.from),
                    Math.abs(t.pos - this.view.state.selection.to),
                  ) <= 2))
            ? (Wn(this.view, P.near(this.view.state.doc.resolve(t.pos)), "pointer"),
              e.preventDefault())
            : bt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), bt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault &&
      (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) &&
      (this.allowDefault = !0);
  }
};
$e.touchstart = (n) => {
  (n.input.lastTouch = Date.now()), Ea(n), bt(n, "pointer");
};
$e.touchmove = (n) => {
  (n.input.lastTouch = Date.now()), bt(n, "pointer");
};
$e.contextmenu = (n) => Ea(n);
function hf(n, e) {
  return n.composing
    ? !0
    : Se && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500
      ? ((n.input.compositionEndedAt = -2e8), !0)
      : !1;
}
const D0 = Je ? 5e3 : -1;
Me.compositionstart = Me.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n,
      t = e.selection.$from;
    if (
      e.selection.empty &&
      (e.storedMarks ||
        (!t.textOffset &&
          t.parentOffset &&
          t.nodeBefore.marks.some((o) => o.type.spec.inclusive === !1)))
    )
      (n.markCursor = n.state.storedMarks || t.marks()), mi(n, !0), (n.markCursor = null);
    else if (
      (mi(n),
      Ke && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length)
    ) {
      let o = n.domSelectionRange();
      for (let r = o.focusNode, i = o.focusOffset; r && r.nodeType == 1 && i != 0; ) {
        let s = i < 0 ? r.lastChild : r.childNodes[i - 1];
        if (!s) break;
        if (s.nodeType == 3) {
          n.domSelection().collapse(s, s.nodeValue.length);
          break;
        } else (r = s), (i = -1);
      }
    }
    n.input.composing = !0;
  }
  pf(n, D0);
};
Me.compositionend = (n, e) => {
  n.composing &&
    ((n.input.composing = !1),
    (n.input.compositionEndedAt = e.timeStamp),
    (n.input.compositionPendingChanges = n.domObserver.pendingRecords().length
      ? n.input.compositionID
      : 0),
    (n.input.compositionNode = null),
    n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()),
    n.input.compositionID++,
    pf(n, 20));
};
function pf(n, e) {
  clearTimeout(n.input.composingTimeout),
    e > -1 && (n.input.composingTimeout = setTimeout(() => mi(n), e));
}
function ff(n) {
  for (
    n.composing && ((n.input.composing = !1), (n.input.compositionEndedAt = z0()));
    n.input.compositionNodes.length > 0;

  )
    n.input.compositionNodes.pop().markParentsDirty();
}
function R0(n) {
  let e = n.domSelectionRange();
  if (!e.focusNode) return null;
  let t = C1(e.focusNode, e.focusOffset),
    o = O1(e.focusNode, e.focusOffset);
  if (t && o && t != o) {
    let r = o.pmViewDesc;
    if (!r || !r.isText(o.nodeValue)) return o;
    if (n.input.compositionNode == o) {
      let i = t.pmViewDesc;
      if (!(!i || !i.isText(t.nodeValue))) return o;
    }
  }
  return t;
}
function z0() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function mi(n, e = !1) {
  if (!(Je && n.domObserver.flushingSoon >= 0)) {
    if ((n.domObserver.forceFlush(), ff(n), e || (n.docView && n.docView.dirty))) {
      let t = Ca(n);
      return (
        t && !t.eq(n.state.selection)
          ? n.dispatch(n.state.tr.setSelection(t))
          : n.updateState(n.state),
        !0
      );
    }
    return !1;
  }
}
function P0(n, e) {
  if (!n.dom.parentNode) return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), (t.style.cssText = "position: fixed; left: -10000px; top: 10px");
  let o = getSelection(),
    r = document.createRange();
  r.selectNodeContents(e),
    n.dom.blur(),
    o.removeAllRanges(),
    o.addRange(r),
    setTimeout(() => {
      t.parentNode && t.parentNode.removeChild(t), n.focus();
    }, 50);
}
const or = (Ce && St < 15) || (Zn && D1 < 604);
$e.copy = Me.cut = (n, e) => {
  let t = e,
    o = n.state.selection,
    r = t.type == "cut";
  if (o.empty) return;
  let i = or ? null : t.clipboardData,
    s = o.content(),
    { dom: l, text: a } = nf(n, s);
  i
    ? (t.preventDefault(),
      i.clearData(),
      i.setData("text/html", l.innerHTML),
      i.setData("text/plain", a))
    : P0(n, l),
    r && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function B0(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1
    ? n.content.firstChild
    : null;
}
function F0(n, e) {
  if (!n.dom.parentNode) return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code,
    o = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (o.contentEditable = "true"),
    (o.style.cssText = "position: fixed; left: -10000px; top: 10px"),
    o.focus();
  let r = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(),
      o.parentNode && o.parentNode.removeChild(o),
      t ? rr(n, o.value, null, r, e) : rr(n, o.textContent, o.innerHTML, r, e);
  }, 50);
}
function rr(n, e, t, o, r) {
  let i = of(n, e, t, o, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, r, i || S.empty))) return !0;
  if (!i) return !1;
  let s = B0(i),
    l = s ? n.state.tr.replaceSelectionWith(s, o) : n.state.tr.replaceSelection(i);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function uf(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e) return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
Me.paste = (n, e) => {
  let t = e;
  if (n.composing && !Je) return;
  let o = or ? null : t.clipboardData,
    r = n.input.shiftKey && n.input.lastKeyCode != 45;
  o && rr(n, uf(o), o.getData("text/html"), r, t) ? t.preventDefault() : F0(n, t);
};
let mf = class {
  constructor(e, t, o) {
    (this.slice = e), (this.move = t), (this.node = o);
  }
};
const gf = Be ? "altKey" : "ctrlKey";
$e.dragstart = (n, e) => {
  let t = e,
    o = n.input.mouseDown;
  if ((o && o.done(), !t.dataTransfer)) return;
  let r = n.state.selection,
    i = r.empty ? null : n.posAtCoords(Ui(t)),
    s;
  if (!(i && i.pos >= r.from && i.pos <= (r instanceof D ? r.to - 1 : r.to))) {
    if (o && o.mightDrag) s = D.create(n.state.doc, o.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (s = D.create(n.state.doc, d.posBefore));
    }
  }
  let l = (s || n.state.selection).content(),
    { dom: a, text: c } = nf(n, l);
  t.dataTransfer.clearData(),
    t.dataTransfer.setData(or ? "Text" : "text/html", a.innerHTML),
    (t.dataTransfer.effectAllowed = "copyMove"),
    or || t.dataTransfer.setData("text/plain", c),
    (n.dragging = new mf(l, !t[gf], s));
};
$e.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
Me.dragover = Me.dragenter = (n, e) => e.preventDefault();
Me.drop = (n, e) => {
  let t = e,
    o = n.dragging;
  if (((n.dragging = null), !t.dataTransfer)) return;
  let r = n.posAtCoords(Ui(t));
  if (!r) return;
  let i = n.state.doc.resolve(r.pos),
    s = o && o.slice;
  s
    ? n.someProp("transformPasted", (u) => {
        s = u(s, n);
      })
    : (s = of(n, uf(t.dataTransfer), or ? null : t.dataTransfer.getData("text/html"), !1, i));
  let l = !!(o && !t[gf]);
  if (n.someProp("handleDrop", (u) => u(n, t, s || S.empty, l))) {
    t.preventDefault();
    return;
  }
  if (!s) return;
  t.preventDefault();
  let a = s ? d1(n.state.doc, i.pos, s) : i.pos;
  a == null && (a = i.pos);
  let c = n.state.tr;
  if (l) {
    let { node: u } = o;
    u ? u.replace(c) : c.deleteSelection();
  }
  let d = c.mapping.map(a),
    h = s.openStart == 0 && s.openEnd == 0 && s.content.childCount == 1,
    p = c.doc;
  if ((h ? c.replaceRangeWith(d, d, s.content.firstChild) : c.replaceRange(d, d, s), c.doc.eq(p)))
    return;
  let f = c.doc.resolve(d);
  if (
    h &&
    D.isSelectable(s.content.firstChild) &&
    f.nodeAfter &&
    f.nodeAfter.sameMarkup(s.content.firstChild)
  )
    c.setSelection(new D(f));
  else {
    let u = c.mapping.map(a);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((m, g, y, w) => (u = w)),
      c.setSelection(Oa(n, f, c.doc.resolve(u)));
  }
  n.focus(), n.dispatch(c.setMeta("uiEvent", "drop"));
};
$e.focus = (n) => {
  (n.input.lastFocus = Date.now()),
    n.focused ||
      (n.domObserver.stop(),
      n.dom.classList.add("ProseMirror-focused"),
      n.domObserver.start(),
      (n.focused = !0),
      setTimeout(() => {
        n.docView &&
          n.hasFocus() &&
          !n.domObserver.currentSelection.eq(n.domSelectionRange()) &&
          ct(n);
      }, 20));
};
$e.blur = (n, e) => {
  let t = e;
  n.focused &&
    (n.domObserver.stop(),
    n.dom.classList.remove("ProseMirror-focused"),
    n.domObserver.start(),
    t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(),
    (n.focused = !1));
};
$e.beforeinput = (n, e) => {
  if (ve && Je && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: t } = n.input;
    setTimeout(() => {
      if (
        n.input.domChangeCount != t ||
        (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (r) => r(n, Pt(8, "Backspace"))))
      )
        return;
      let { $cursor: o } = n.state.selection;
      o && o.pos > 0 && n.dispatch(n.state.tr.delete(o.pos - 1, o.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in Me) $e[n] = Me[n];
function ir(n, e) {
  if (n == e) return !0;
  for (let t in n) if (n[t] !== e[t]) return !1;
  for (let t in e) if (!(t in n)) return !1;
  return !0;
}
let hd = class yf {
    constructor(e, t) {
      (this.toDOM = e), (this.spec = t || tn), (this.side = this.spec.side || 0);
    }
    map(e, t, o, r) {
      let { pos: i, deleted: s } = e.mapResult(t.from + r, this.side < 0 ? -1 : 1);
      return s ? null : new ao(i - o, i - o, this);
    }
    valid() {
      return !0;
    }
    eq(e) {
      return (
        this == e ||
        (e instanceof yf &&
          ((this.spec.key && this.spec.key == e.spec.key) ||
            (this.toDOM == e.toDOM && ir(this.spec, e.spec))))
      );
    }
    destroy(e) {
      this.spec.destroy && this.spec.destroy(e);
    }
  },
  Ho = class Al {
    constructor(e, t) {
      (this.attrs = e), (this.spec = t || tn);
    }
    map(e, t, o, r) {
      let i = e.map(t.from + r, this.spec.inclusiveStart ? -1 : 1) - o,
        s = e.map(t.to + r, this.spec.inclusiveEnd ? 1 : -1) - o;
      return i >= s ? null : new ao(i, s, this);
    }
    valid(e, t) {
      return t.from < t.to;
    }
    eq(e) {
      return this == e || (e instanceof Al && ir(this.attrs, e.attrs) && ir(this.spec, e.spec));
    }
    static is(e) {
      return e.type instanceof Al;
    }
    destroy() {}
  },
  V0 = class kf {
    constructor(e, t) {
      (this.attrs = e), (this.spec = t || tn);
    }
    map(e, t, o, r) {
      let i = e.mapResult(t.from + r, 1);
      if (i.deleted) return null;
      let s = e.mapResult(t.to + r, -1);
      return s.deleted || s.pos <= i.pos ? null : new ao(i.pos - o, s.pos - o, this);
    }
    valid(e, t) {
      let { index: o, offset: r } = e.content.findIndex(t.from),
        i;
      return r == t.from && !(i = e.child(o)).isText && r + i.nodeSize == t.to;
    }
    eq(e) {
      return this == e || (e instanceof kf && ir(this.attrs, e.attrs) && ir(this.spec, e.spec));
    }
    destroy() {}
  },
  ao = class No {
    constructor(e, t, o) {
      (this.from = e), (this.to = t), (this.type = o);
    }
    copy(e, t) {
      return new No(e, t, this.type);
    }
    eq(e, t = 0) {
      return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
    }
    map(e, t, o) {
      return this.type.map(e, this, t, o);
    }
    static widget(e, t, o) {
      return new No(e, e, new hd(t, o));
    }
    static inline(e, t, o, r) {
      return new No(e, t, new Ho(o, r));
    }
    static node(e, t, o, r) {
      return new No(e, t, new V0(o, r));
    }
    get spec() {
      return this.type.spec;
    }
    get inline() {
      return this.type instanceof Ho;
    }
    get widget() {
      return this.type instanceof hd;
    }
  };
const An = [],
  tn = {};
let Qe = class ut {
  constructor(e, t) {
    (this.local = e.length ? e : An), (this.children = t.length ? t : An);
  }
  static create(e, t) {
    return t.length ? gi(t, e, 0, tn) : le;
  }
  find(e, t, o) {
    let r = [];
    return this.findInner(e ?? 0, t ?? 1e9, r, 0, o), r;
  }
  findInner(e, t, o, r, i) {
    for (let s = 0; s < this.local.length; s++) {
      let l = this.local[s];
      l.from <= t && l.to >= e && (!i || i(l.spec)) && o.push(l.copy(l.from + r, l.to + r));
    }
    for (let s = 0; s < this.children.length; s += 3)
      if (this.children[s] < t && this.children[s + 1] > e) {
        let l = this.children[s] + 1;
        this.children[s + 2].findInner(e - l, t - l, o, r + l, i);
      }
  }
  map(e, t, o) {
    return this == le || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, o || tn);
  }
  mapInner(e, t, o, r, i) {
    let s;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, o, r);
      a && a.type.valid(t, a)
        ? (s || (s = [])).push(a)
        : i.onRemove && i.onRemove(this.local[l].spec);
    }
    return this.children.length
      ? j0(this.children, s || [], e, t, o, r, i)
      : s
        ? new ut(s.sort(nn), An)
        : le;
  }
  add(e, t) {
    return t.length ? (this == le ? ut.create(e, t) : this.addInner(e, t, 0)) : this;
  }
  addInner(e, t, o) {
    let r,
      i = 0;
    e.forEach((l, a) => {
      let c = a + o,
        d;
      if ((d = vf(t, l, c))) {
        for (r || (r = this.children.slice()); i < r.length && r[i] < a; ) i += 3;
        r[i] == a
          ? (r[i + 2] = r[i + 2].addInner(l, d, c + 1))
          : r.splice(i, 0, a, a + l.nodeSize, gi(d, l, c + 1, tn)),
          (i += 3);
      }
    });
    let s = bf(i ? xf(t) : t, -o);
    for (let l = 0; l < s.length; l++) s[l].type.valid(e, s[l]) || s.splice(l--, 1);
    return new ut(s.length ? this.local.concat(s).sort(nn) : this.local, r || this.children);
  }
  remove(e) {
    return e.length == 0 || this == le ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let o = this.children,
      r = this.local;
    for (let i = 0; i < o.length; i += 3) {
      let s,
        l = o[i] + t,
        a = o[i + 1] + t;
      for (let d = 0, h; d < e.length; d++)
        (h = e[d]) && h.from > l && h.to < a && ((e[d] = null), (s || (s = [])).push(h));
      if (!s) continue;
      o == this.children && (o = this.children.slice());
      let c = o[i + 2].removeInner(s, l + 1);
      c != le ? (o[i + 2] = c) : (o.splice(i, 3), (i -= 3));
    }
    if (r.length) {
      for (let i = 0, s; i < e.length; i++)
        if ((s = e[i]))
          for (let l = 0; l < r.length; l++)
            r[l].eq(s, t) && (r == this.local && (r = this.local.slice()), r.splice(l--, 1));
    }
    return o == this.children && r == this.local ? this : r.length || o.length ? new ut(r, o) : le;
  }
  forChild(e, t) {
    if (this == le) return this;
    if (t.isLeaf) return ut.empty;
    let o, r;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (o = this.children[l + 2]);
        break;
      }
    let i = e + 1,
      s = i + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < s && a.to > i && a.type instanceof Ho) {
        let c = Math.max(i, a.from) - i,
          d = Math.min(s, a.to) - i;
        c < d && (r || (r = [])).push(a.copy(c, d));
      }
    }
    if (r) {
      let l = new ut(r.sort(nn), An);
      return o ? new wf([l, o]) : l;
    }
    return o || le;
  }
  eq(e) {
    if (this == e) return !0;
    if (
      !(e instanceof ut) ||
      this.local.length != e.local.length ||
      this.children.length != e.children.length
    )
      return !1;
    for (let t = 0; t < this.local.length; t++) if (!this.local[t].eq(e.local[t])) return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (
        this.children[t] != e.children[t] ||
        this.children[t + 1] != e.children[t + 1] ||
        !this.children[t + 2].eq(e.children[t + 2])
      )
        return !1;
    return !0;
  }
  locals(e) {
    return Aa(this.localsInner(e));
  }
  localsInner(e) {
    if (this == le) return An;
    if (e.inlineContent || !this.local.some(Ho.is)) return this.local;
    let t = [];
    for (let o = 0; o < this.local.length; o++)
      this.local[o].type instanceof Ho || t.push(this.local[o]);
    return t;
  }
};
Qe.empty = new Qe([], []);
Qe.removeOverlap = Aa;
const le = Qe.empty;
let wf = class In {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const o = this.members.map((r) => r.map(e, t, tn));
    return In.from(o);
  }
  forChild(e, t) {
    if (t.isLeaf) return Qe.empty;
    let o = [];
    for (let r = 0; r < this.members.length; r++) {
      let i = this.members[r].forChild(e, t);
      i != le && (i instanceof In ? (o = o.concat(i.members)) : o.push(i));
    }
    return In.from(o);
  }
  eq(e) {
    if (!(e instanceof In) || e.members.length != this.members.length) return !1;
    for (let t = 0; t < this.members.length; t++) if (!this.members[t].eq(e.members[t])) return !1;
    return !0;
  }
  locals(e) {
    let t,
      o = !0;
    for (let r = 0; r < this.members.length; r++) {
      let i = this.members[r].localsInner(e);
      if (i.length)
        if (!t) t = i;
        else {
          o && ((t = t.slice()), (o = !1));
          for (let s = 0; s < i.length; s++) t.push(i[s]);
        }
    }
    return t ? Aa(o ? t : t.sort(nn)) : An;
  }
  static from(e) {
    switch (e.length) {
      case 0:
        return le;
      case 1:
        return e[0];
      default:
        return new In(
          e.every((t) => t instanceof Qe)
            ? e
            : e.reduce((t, o) => t.concat(o instanceof Qe ? o : o.members), []),
        );
    }
  }
};
function j0(n, e, t, o, r, i, s) {
  let l = n.slice();
  for (let c = 0, d = i; c < t.maps.length; c++) {
    let h = 0;
    t.maps[c].forEach((p, f, u, m) => {
      let g = m - u - (f - p);
      for (let y = 0; y < l.length; y += 3) {
        let w = l[y + 1];
        if (w < 0 || p > w + d - h) continue;
        let b = l[y] + d - h;
        f >= b ? (l[y + 1] = p <= b ? -2 : -1) : p >= d && g && ((l[y] += g), (l[y + 1] += g));
      }
      h += g;
    }),
      (d = t.maps[c].map(d, -1));
  }
  let a = !1;
  for (let c = 0; c < l.length; c += 3)
    if (l[c + 1] < 0) {
      if (l[c + 1] == -2) {
        (a = !0), (l[c + 1] = -1);
        continue;
      }
      let d = t.map(n[c] + i),
        h = d - r;
      if (h < 0 || h >= o.content.size) {
        a = !0;
        continue;
      }
      let p = t.map(n[c + 1] + i, -1),
        f = p - r,
        { index: u, offset: m } = o.content.findIndex(h),
        g = o.maybeChild(u);
      if (g && m == h && m + g.nodeSize == f) {
        let y = l[c + 2].mapInner(t, g, d + 1, n[c] + i + 1, s);
        y != le ? ((l[c] = h), (l[c + 1] = f), (l[c + 2] = y)) : ((l[c + 1] = -2), (a = !0));
      } else a = !0;
    }
  if (a) {
    let c = J0(l, n, e, t, r, i, s),
      d = gi(c, o, 0, s);
    e = d.local;
    for (let h = 0; h < l.length; h += 3) l[h + 1] < 0 && (l.splice(h, 3), (h -= 3));
    for (let h = 0, p = 0; h < d.children.length; h += 3) {
      let f = d.children[h];
      for (; p < l.length && l[p] < f; ) p += 3;
      l.splice(p, 0, d.children[h], d.children[h + 1], d.children[h + 2]);
    }
  }
  return new Qe(e.sort(nn), l);
}
function bf(n, e) {
  if (!e || !n.length) return n;
  let t = [];
  for (let o = 0; o < n.length; o++) {
    let r = n[o];
    t.push(new ao(r.from + e, r.to + e, r.type));
  }
  return t;
}
function J0(n, e, t, o, r, i, s) {
  function l(a, c) {
    for (let d = 0; d < a.local.length; d++) {
      let h = a.local[d].map(o, r, c);
      h ? t.push(h) : s.onRemove && s.onRemove(a.local[d].spec);
    }
    for (let d = 0; d < a.children.length; d += 3) l(a.children[d + 2], a.children[d] + c + 1);
  }
  for (let a = 0; a < n.length; a += 3) n[a + 1] == -1 && l(n[a + 2], e[a] + i + 1);
  return t;
}
function vf(n, e, t) {
  if (e.isLeaf) return null;
  let o = t + e.nodeSize,
    r = null;
  for (let i = 0, s; i < n.length; i++)
    (s = n[i]) && s.from > t && s.to < o && ((r || (r = [])).push(s), (n[i] = null));
  return r;
}
function xf(n) {
  let e = [];
  for (let t = 0; t < n.length; t++) n[t] != null && e.push(n[t]);
  return e;
}
function gi(n, e, t, o) {
  let r = [],
    i = !1;
  e.forEach((l, a) => {
    let c = vf(n, l, a + t);
    if (c) {
      i = !0;
      let d = gi(c, l, t + a + 1, o);
      d != le && r.push(a, a + l.nodeSize, d);
    }
  });
  let s = bf(i ? xf(n) : n, -t).sort(nn);
  for (let l = 0; l < s.length; l++)
    s[l].type.valid(e, s[l]) || (o.onRemove && o.onRemove(s[l].spec), s.splice(l--, 1));
  return s.length || r.length ? new Qe(s, r) : le;
}
function nn(n, e) {
  return n.from - e.from || n.to - e.to;
}
function Aa(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let o = e[t];
    if (o.from != o.to)
      for (let r = t + 1; r < e.length; r++) {
        let i = e[r];
        if (i.from == o.from) {
          i.to != o.to &&
            (e == n && (e = n.slice()),
            (e[r] = i.copy(i.from, o.to)),
            pd(e, r + 1, i.copy(o.to, i.to)));
          continue;
        } else {
          i.from < o.to &&
            (e == n && (e = n.slice()),
            (e[t] = o.copy(o.from, i.from)),
            pd(e, r, o.copy(i.from, o.to)));
          break;
        }
      }
  }
  return e;
}
function pd(n, e, t) {
  for (; e < n.length && nn(t, n[e]) > 0; ) e++;
  n.splice(e, 0, t);
}
function vs(n) {
  let e = [];
  return (
    n.someProp("decorations", (t) => {
      let o = t(n.state);
      o && o != le && e.push(o);
    }),
    n.cursorWrapper && e.push(Qe.create(n.state.doc, [n.cursorWrapper.deco])),
    wf.from(e)
  );
}
const L0 = {
    childList: !0,
    characterData: !0,
    characterDataOldValue: !0,
    attributes: !0,
    attributeOldValue: !0,
    subtree: !0,
  },
  q0 = Ce && St <= 11;
let K0 = class {
    constructor() {
      (this.anchorNode = null),
        (this.anchorOffset = 0),
        (this.focusNode = null),
        (this.focusOffset = 0);
    }
    set(e) {
      (this.anchorNode = e.anchorNode),
        (this.anchorOffset = e.anchorOffset),
        (this.focusNode = e.focusNode),
        (this.focusOffset = e.focusOffset);
    }
    clear() {
      this.anchorNode = this.focusNode = null;
    }
    eq(e) {
      return (
        e.anchorNode == this.anchorNode &&
        e.anchorOffset == this.anchorOffset &&
        e.focusNode == this.focusNode &&
        e.focusOffset == this.focusOffset
      );
    }
  },
  W0 = class {
    constructor(e, t) {
      (this.view = e),
        (this.handleDOMChange = t),
        (this.queue = []),
        (this.flushingSoon = -1),
        (this.observer = null),
        (this.currentSelection = new K0()),
        (this.onCharData = null),
        (this.suppressingSelectionUpdates = !1),
        (this.observer =
          window.MutationObserver &&
          new window.MutationObserver((o) => {
            for (let r = 0; r < o.length; r++) this.queue.push(o[r]);
            Ce &&
            St <= 11 &&
            o.some(
              (r) =>
                (r.type == "childList" && r.removedNodes.length) ||
                (r.type == "characterData" && r.oldValue.length > r.target.nodeValue.length),
            )
              ? this.flushSoon()
              : this.flush();
          })),
        q0 &&
          (this.onCharData = (o) => {
            this.queue.push({ target: o.target, type: "characterData", oldValue: o.prevValue }),
              this.flushSoon();
          }),
        (this.onSelectionChange = this.onSelectionChange.bind(this));
    }
    flushSoon() {
      this.flushingSoon < 0 &&
        (this.flushingSoon = window.setTimeout(() => {
          (this.flushingSoon = -1), this.flush();
        }, 20));
    }
    forceFlush() {
      this.flushingSoon > -1 &&
        (window.clearTimeout(this.flushingSoon), (this.flushingSoon = -1), this.flush());
    }
    start() {
      this.observer && (this.observer.takeRecords(), this.observer.observe(this.view.dom, L0)),
        this.onCharData &&
          this.view.dom.addEventListener("DOMCharacterDataModified", this.onCharData),
        this.connectSelection();
    }
    stop() {
      if (this.observer) {
        let e = this.observer.takeRecords();
        if (e.length) {
          for (let t = 0; t < e.length; t++) this.queue.push(e[t]);
          window.setTimeout(() => this.flush(), 20);
        }
        this.observer.disconnect();
      }
      this.onCharData &&
        this.view.dom.removeEventListener("DOMCharacterDataModified", this.onCharData),
        this.disconnectSelection();
    }
    connectSelection() {
      this.view.dom.ownerDocument.addEventListener("selectionchange", this.onSelectionChange);
    }
    disconnectSelection() {
      this.view.dom.ownerDocument.removeEventListener("selectionchange", this.onSelectionChange);
    }
    suppressSelectionUpdates() {
      (this.suppressingSelectionUpdates = !0),
        setTimeout(() => (this.suppressingSelectionUpdates = !1), 50);
    }
    onSelectionChange() {
      if (od(this.view)) {
        if (this.suppressingSelectionUpdates) return ct(this.view);
        if (Ce && St <= 11 && !this.view.state.selection.empty) {
          let e = this.view.domSelectionRange();
          if (e.focusNode && dn(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset))
            return this.flushSoon();
        }
        this.flush();
      }
    }
    setCurSelection() {
      this.currentSelection.set(this.view.domSelectionRange());
    }
    ignoreSelectionChange(e) {
      if (!e.focusNode) return !0;
      let t = new Set(),
        o;
      for (let i = e.focusNode; i; i = nr(i)) t.add(i);
      for (let i = e.anchorNode; i; i = nr(i))
        if (t.has(i)) {
          o = i;
          break;
        }
      let r = o && this.view.docView.nearestDesc(o);
      if (r && r.ignoreMutation({ type: "selection", target: o.nodeType == 3 ? o.parentNode : o }))
        return this.setCurSelection(), !0;
    }
    pendingRecords() {
      if (this.observer) for (let e of this.observer.takeRecords()) this.queue.push(e);
      return this.queue;
    }
    flush() {
      let { view: e } = this;
      if (!e.docView || this.flushingSoon > -1) return;
      let t = this.pendingRecords();
      t.length && (this.queue = []);
      let o = e.domSelectionRange(),
        r =
          !this.suppressingSelectionUpdates &&
          !this.currentSelection.eq(o) &&
          od(e) &&
          !this.ignoreSelectionChange(o),
        i = -1,
        s = -1,
        l = !1,
        a = [];
      if (e.editable)
        for (let d = 0; d < t.length; d++) {
          let h = this.registerMutation(t[d], a);
          h &&
            ((i = i < 0 ? h.from : Math.min(h.from, i)),
            (s = s < 0 ? h.to : Math.max(h.to, s)),
            h.typeOver && (l = !0));
        }
      if (Ke && a.length > 1) {
        let d = a.filter((h) => h.nodeName == "BR");
        if (d.length == 2) {
          let h = d[0],
            p = d[1];
          h.parentNode && h.parentNode.parentNode == p.parentNode ? p.remove() : h.remove();
        }
      }
      let c = null;
      i < 0 &&
      r &&
      e.input.lastFocus > Date.now() - 200 &&
      Math.max(e.input.lastTouch, e.input.lastClick.time) < Date.now() - 300 &&
      Hi(o) &&
      (c = Ca(e)) &&
      c.eq(P.near(e.state.doc.resolve(0), 1))
        ? ((e.input.lastFocus = 0), ct(e), this.currentSelection.set(o), e.scrollToSelection())
        : (i > -1 || r) &&
          (i > -1 && (e.docView.markDirty(i, s), H0(e)),
          this.handleDOMChange(i, s, l, a),
          e.docView && e.docView.dirty
            ? e.updateState(e.state)
            : this.currentSelection.eq(o) || ct(e),
          this.currentSelection.set(o));
    }
    registerMutation(e, t) {
      if (t.indexOf(e.target) > -1) return null;
      let o = this.view.docView.nearestDesc(e.target);
      if (
        (e.type == "attributes" &&
          (o == this.view.docView ||
            e.attributeName == "contenteditable" ||
            (e.attributeName == "style" && !e.oldValue && !e.target.getAttribute("style")))) ||
        !o ||
        o.ignoreMutation(e)
      )
        return null;
      if (e.type == "childList") {
        for (let d = 0; d < e.addedNodes.length; d++) t.push(e.addedNodes[d]);
        if (o.contentDOM && o.contentDOM != o.dom && !o.contentDOM.contains(e.target))
          return { from: o.posBefore, to: o.posAfter };
        let r = e.previousSibling,
          i = e.nextSibling;
        if (Ce && St <= 11 && e.addedNodes.length)
          for (let d = 0; d < e.addedNodes.length; d++) {
            let { previousSibling: h, nextSibling: p } = e.addedNodes[d];
            (!h || Array.prototype.indexOf.call(e.addedNodes, h) < 0) && (r = h),
              (!p || Array.prototype.indexOf.call(e.addedNodes, p) < 0) && (i = p);
          }
        let s = r && r.parentNode == e.target ? oe(r) + 1 : 0,
          l = o.localPosFromDOM(e.target, s, -1),
          a = i && i.parentNode == e.target ? oe(i) : e.target.childNodes.length,
          c = o.localPosFromDOM(e.target, a, 1);
        return { from: l, to: c };
      } else
        return e.type == "attributes"
          ? { from: o.posAtStart - o.border, to: o.posAtEnd + o.border }
          : { from: o.posAtStart, to: o.posAtEnd, typeOver: e.target.nodeValue == e.oldValue };
    }
  },
  fd = new WeakMap(),
  ud = !1;
function H0(n) {
  if (
    !fd.has(n) &&
    (fd.set(n, null),
    ["normal", "nowrap", "pre-line"].indexOf(getComputedStyle(n.dom).whiteSpace) !== -1)
  ) {
    if (((n.requiresGeckoHackNode = Ke), ud)) return;
    console.warn(
      "ProseMirror expects the CSS white-space property to be set, preferably to 'pre-wrap'. It is recommended to load style/prosemirror.css from the prosemirror-view package.",
    ),
      (ud = !0);
  }
}
function U0(n) {
  let e;
  function t(a) {
    a.preventDefault(), a.stopImmediatePropagation(), (e = a.getTargetRanges()[0]);
  }
  n.dom.addEventListener("beforeinput", t, !0),
    document.execCommand("indent"),
    n.dom.removeEventListener("beforeinput", t, !0);
  let o = e.startContainer,
    r = e.startOffset,
    i = e.endContainer,
    s = e.endOffset,
    l = n.domAtPos(n.state.selection.anchor);
  return (
    dn(l.node, l.offset, i, s) && ([o, r, i, s] = [i, s, o, r]),
    { anchorNode: o, anchorOffset: r, focusNode: i, focusOffset: s }
  );
}
function G0(n, e, t) {
  let { node: o, fromOffset: r, toOffset: i, from: s, to: l } = n.docView.parseRange(e, t),
    a = n.domSelectionRange(),
    c,
    d = a.anchorNode;
  if (
    (d &&
      n.dom.contains(d.nodeType == 1 ? d : d.parentNode) &&
      ((c = [{ node: d, offset: a.anchorOffset }]),
      Hi(a) || c.push({ node: a.focusNode, offset: a.focusOffset })),
    ve && n.input.lastKeyCode === 8)
  )
    for (let g = i; g > r; g--) {
      let y = o.childNodes[g - 1],
        w = y.pmViewDesc;
      if (y.nodeName == "BR" && !w) {
        i = g;
        break;
      }
      if (!w || w.size) break;
    }
  let h = n.state.doc,
    p = n.someProp("domParser") || ba.fromSchema(n.state.schema),
    f = h.resolve(s),
    u = null,
    m = p.parse(o, {
      topNode: f.parent,
      topMatch: f.parent.contentMatchAt(f.index()),
      topOpen: !0,
      from: r,
      to: i,
      preserveWhitespace: f.parent.type.whitespace == "pre" ? "full" : !0,
      findPositions: c,
      ruleFromNode: Y0,
      context: f,
    });
  if (c && c[0].pos != null) {
    let g = c[0].pos,
      y = c[1] && c[1].pos;
    y == null && (y = g), (u = { anchor: g + s, head: y + s });
  }
  return { doc: m, sel: u, from: s, to: l };
}
function Y0(n) {
  let e = n.pmViewDesc;
  if (e) return e.parseRule();
  if (n.nodeName == "BR" && n.parentNode) {
    if (Se && /^(ul|ol)$/i.test(n.parentNode.nodeName)) {
      let t = document.createElement("div");
      return t.appendChild(document.createElement("li")), { skip: t };
    } else if (n.parentNode.lastChild == n || (Se && /^(tr|table)$/i.test(n.parentNode.nodeName)))
      return { ignore: !0 };
  } else if (n.nodeName == "IMG" && n.getAttribute("mark-placeholder")) return { ignore: !0 };
  return null;
}
const X0 =
  /^(a|abbr|acronym|b|bd[io]|big|br|button|cite|code|data(list)?|del|dfn|em|i|ins|kbd|label|map|mark|meter|output|q|ruby|s|samp|small|span|strong|su[bp]|time|u|tt|var)$/i;
function Q0(n, e, t, o, r) {
  let i = n.input.compositionPendingChanges || (n.composing ? n.input.compositionID : 0);
  if (((n.input.compositionPendingChanges = 0), e < 0)) {
    let F = n.input.lastSelectionTime > Date.now() - 50 ? n.input.lastSelectionOrigin : null,
      pt = Ca(n, F);
    if (pt && !n.state.selection.eq(pt)) {
      if (
        ve &&
        Je &&
        n.input.lastKeyCode === 13 &&
        Date.now() - 100 < n.input.lastKeyCodeTime &&
        n.someProp("handleKeyDown", (wg) => wg(n, Pt(13, "Enter")))
      )
        return;
      let Dr = n.state.tr.setSelection(pt);
      F == "pointer" ? Dr.setMeta("pointer", !0) : F == "key" && Dr.scrollIntoView(),
        i && Dr.setMeta("composition", i),
        n.dispatch(Dr);
    }
    return;
  }
  let s = n.state.doc.resolve(e),
    l = s.sharedDepth(t);
  (e = s.before(l + 1)), (t = n.state.doc.resolve(t).after(l + 1));
  let a = n.state.selection,
    c = G0(n, e, t),
    d = n.state.doc,
    h = d.slice(c.from, c.to),
    p,
    f;
  n.input.lastKeyCode === 8 && Date.now() - 100 < n.input.lastKeyCodeTime
    ? ((p = n.state.selection.to), (f = "end"))
    : ((p = n.state.selection.from), (f = "start")),
    (n.input.lastKeyCode = null);
  let u = ey(h.content, c.doc.content, c.from, p, f);
  if (
    ((Zn && n.input.lastIOSEnter > Date.now() - 225) || Je) &&
    r.some((F) => F.nodeType == 1 && !X0.test(F.nodeName)) &&
    (!u || u.endA >= u.endB) &&
    n.someProp("handleKeyDown", (F) => F(n, Pt(13, "Enter")))
  ) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (!u)
    if (
      o &&
      a instanceof J &&
      !a.empty &&
      a.$head.sameParent(a.$anchor) &&
      !n.composing &&
      !(c.sel && c.sel.anchor != c.sel.head)
    )
      u = { start: a.from, endA: a.to, endB: a.to };
    else {
      if (c.sel) {
        let F = md(n, n.state.doc, c.sel);
        if (F && !F.eq(n.state.selection)) {
          let pt = n.state.tr.setSelection(F);
          i && pt.setMeta("composition", i), n.dispatch(pt);
        }
      }
      return;
    }
  n.input.domChangeCount++,
    n.state.selection.from < n.state.selection.to &&
      u.start == u.endB &&
      n.state.selection instanceof J &&
      (u.start > n.state.selection.from &&
      u.start <= n.state.selection.from + 2 &&
      n.state.selection.from >= c.from
        ? (u.start = n.state.selection.from)
        : u.endA < n.state.selection.to &&
          u.endA >= n.state.selection.to - 2 &&
          n.state.selection.to <= c.to &&
          ((u.endB += n.state.selection.to - u.endA), (u.endA = n.state.selection.to))),
    Ce &&
      St <= 11 &&
      u.endB == u.start + 1 &&
      u.endA == u.start &&
      u.start > c.from &&
      c.doc.textBetween(u.start - c.from - 1, u.start - c.from + 1) == "  " &&
      (u.start--, u.endA--, u.endB--);
  let m = c.doc.resolveNoCache(u.start - c.from),
    g = c.doc.resolveNoCache(u.endB - c.from),
    y = d.resolve(u.start),
    w = m.sameParent(g) && m.parent.inlineContent && y.end() >= u.endA,
    b;
  if (
    ((Zn &&
      n.input.lastIOSEnter > Date.now() - 225 &&
      (!w || r.some((F) => F.nodeName == "DIV" || F.nodeName == "P"))) ||
      (!w &&
        m.pos < c.doc.content.size &&
        !m.sameParent(g) &&
        (b = P.findFrom(c.doc.resolve(m.pos + 1), 1, !0)) &&
        b.head == g.pos)) &&
    n.someProp("handleKeyDown", (F) => F(n, Pt(13, "Enter")))
  ) {
    n.input.lastIOSEnter = 0;
    return;
  }
  if (
    n.state.selection.anchor > u.start &&
    _0(d, u.start, u.endA, m, g) &&
    n.someProp("handleKeyDown", (F) => F(n, Pt(8, "Backspace")))
  ) {
    Je && ve && n.domObserver.suppressSelectionUpdates();
    return;
  }
  ve && Je && u.endB == u.start && (n.input.lastAndroidDelete = Date.now()),
    Je &&
      !w &&
      m.start() != g.start() &&
      g.parentOffset == 0 &&
      m.depth == g.depth &&
      c.sel &&
      c.sel.anchor == c.sel.head &&
      c.sel.head == u.endA &&
      ((u.endB -= 2),
      (g = c.doc.resolveNoCache(u.endB - c.from)),
      setTimeout(() => {
        n.someProp("handleKeyDown", function (F) {
          return F(n, Pt(13, "Enter"));
        });
      }, 20));
  let z = u.start,
    $ = u.endA,
    N,
    R,
    G;
  if (w) {
    if (m.pos == g.pos)
      Ce &&
        St <= 11 &&
        m.parentOffset == 0 &&
        (n.domObserver.suppressSelectionUpdates(), setTimeout(() => ct(n), 20)),
        (N = n.state.tr.delete(z, $)),
        (R = d.resolve(u.start).marksAcross(d.resolve(u.endA)));
    else if (
      u.endA == u.endB &&
      (G = Z0(
        m.parent.content.cut(m.parentOffset, g.parentOffset),
        y.parent.content.cut(y.parentOffset, u.endA - y.start()),
      ))
    )
      (N = n.state.tr), G.type == "add" ? N.addMark(z, $, G.mark) : N.removeMark(z, $, G.mark);
    else if (m.parent.child(m.index()).isText && m.index() == g.index() - (g.textOffset ? 0 : 1)) {
      let F = m.parent.textBetween(m.parentOffset, g.parentOffset);
      if (n.someProp("handleTextInput", (pt) => pt(n, z, $, F))) return;
      N = n.state.tr.insertText(F, z, $);
    }
  }
  if (
    (N || (N = n.state.tr.replace(z, $, c.doc.slice(u.start - c.from, u.endB - c.from))), c.sel)
  ) {
    let F = md(n, N.doc, c.sel);
    F &&
      !(
        (ve &&
          Je &&
          n.composing &&
          F.empty &&
          (u.start != u.endB || n.input.lastAndroidDelete < Date.now() - 100) &&
          (F.head == z || F.head == N.mapping.map($) - 1)) ||
        (Ce && F.empty && F.head == z)
      ) &&
      N.setSelection(F);
  }
  R && N.ensureMarks(R), i && N.setMeta("composition", i), n.dispatch(N.scrollIntoView());
}
function md(n, e, t) {
  return Math.max(t.anchor, t.head) > e.content.size
    ? null
    : Oa(n, e.resolve(t.anchor), e.resolve(t.head));
}
function Z0(n, e) {
  let t = n.firstChild.marks,
    o = e.firstChild.marks,
    r = t,
    i = o,
    s,
    l,
    a;
  for (let d = 0; d < o.length; d++) r = o[d].removeFromSet(r);
  for (let d = 0; d < t.length; d++) i = t[d].removeFromSet(i);
  if (r.length == 1 && i.length == 0)
    (l = r[0]), (s = "add"), (a = (d) => d.mark(l.addToSet(d.marks)));
  else if (r.length == 0 && i.length == 1)
    (l = i[0]), (s = "remove"), (a = (d) => d.mark(l.removeFromSet(d.marks)));
  else return null;
  let c = [];
  for (let d = 0; d < e.childCount; d++) c.push(a(e.child(d)));
  if (k.from(c).eq(n)) return { mark: l, type: s };
}
function _0(n, e, t, o, r) {
  if (t - e <= r.pos - o.pos || xs(o, !0, !1) < r.pos) return !1;
  let i = n.resolve(e);
  if (!o.parent.isTextblock) {
    let l = i.nodeAfter;
    return l != null && t == e + l.nodeSize;
  }
  if (i.parentOffset < i.parent.content.size || !i.parent.isTextblock) return !1;
  let s = n.resolve(xs(i, !0, !0));
  return !s.parent.isTextblock || s.pos > t || xs(s, !0, !1) < t
    ? !1
    : o.parent.content.cut(o.parentOffset).eq(s.parent.content);
}
function xs(n, e, t) {
  let o = n.depth,
    r = e ? n.end() : n.pos;
  for (; o > 0 && (e || n.indexAfter(o) == n.node(o).childCount); ) o--, r++, (e = !1);
  if (t) {
    let i = n.node(o).maybeChild(n.indexAfter(o));
    for (; i && !i.isLeaf; ) (i = i.firstChild), r++;
  }
  return r;
}
function ey(n, e, t, o, r) {
  let i = n.findDiffStart(e, t);
  if (i == null) return null;
  let { a: s, b: l } = n.findDiffEnd(e, t + n.size, t + e.size);
  if (r == "end") {
    let a = Math.max(0, i - Math.min(s, l));
    o -= s + a - i;
  }
  if (s < i && n.size < e.size) {
    let a = o <= i && o >= s ? i - o : 0;
    (i -= a),
      i && i < e.size && gd(e.textBetween(i - 1, i + 1)) && (i += a ? 1 : -1),
      (l = i + (l - s)),
      (s = i);
  } else if (l < i) {
    let a = o <= i && o >= l ? i - o : 0;
    (i -= a),
      i && i < n.size && gd(n.textBetween(i - 1, i + 1)) && (i += a ? 1 : -1),
      (s = i + (s - l)),
      (l = i);
  }
  return { start: i, endA: s, endB: l };
}
function gd(n) {
  if (n.length != 2) return !1;
  let e = n.charCodeAt(0),
    t = n.charCodeAt(1);
  return e >= 56320 && e <= 57343 && t >= 55296 && t <= 56319;
}
let ty = class {
  constructor(e, t) {
    (this._root = null),
      (this.focused = !1),
      (this.trackWrites = null),
      (this.mounted = !1),
      (this.markCursor = null),
      (this.cursorWrapper = null),
      (this.lastSelectedViewDesc = void 0),
      (this.input = new b0()),
      (this.prevDirectPlugins = []),
      (this.pluginViews = []),
      (this.requiresGeckoHackNode = !1),
      (this.dragging = null),
      (this._props = t),
      (this.state = t.state),
      (this.directPlugins = t.plugins || []),
      this.directPlugins.forEach(vd),
      (this.dispatch = this.dispatch.bind(this)),
      (this.dom = (e && e.mount) || document.createElement("div")),
      e &&
        (e.appendChild
          ? e.appendChild(this.dom)
          : typeof e == "function"
            ? e(this.dom)
            : e.mount && (this.mounted = !0)),
      (this.editable = wd(this)),
      kd(this),
      (this.nodeViews = bd(this)),
      (this.docView = Qc(this.state.doc, yd(this), vs(this), this.dom, this)),
      (this.domObserver = new W0(this, (o, r, i, s) => Q0(this, o, r, i, s))),
      this.domObserver.start(),
      v0(this),
      this.updatePluginViews();
  }
  get composing() {
    return this.input.composing;
  }
  get props() {
    if (this._props.state != this.state) {
      let e = this._props;
      this._props = {};
      for (let t in e) this._props[t] = e[t];
      this._props.state = this.state;
    }
    return this._props;
  }
  update(e) {
    e.handleDOMEvents != this._props.handleDOMEvents && El(this);
    let t = this._props;
    (this._props = e),
      e.plugins && (e.plugins.forEach(vd), (this.directPlugins = e.plugins)),
      this.updateStateInner(e.state, t);
  }
  setProps(e) {
    let t = {};
    for (let o in this._props) t[o] = this._props[o];
    t.state = this.state;
    for (let o in e) t[o] = e[o];
    this.update(t);
  }
  updateState(e) {
    this.updateStateInner(e, this._props);
  }
  updateStateInner(e, t) {
    var o;
    let r = this.state,
      i = !1,
      s = !1;
    e.storedMarks && this.composing && (ff(this), (s = !0)), (this.state = e);
    let l = r.plugins != e.plugins || this._props.plugins != t.plugins;
    if (l || this._props.plugins != t.plugins || this._props.nodeViews != t.nodeViews) {
      let f = bd(this);
      oy(f, this.nodeViews) && ((this.nodeViews = f), (i = !0));
    }
    (l || t.handleDOMEvents != this._props.handleDOMEvents) && El(this),
      (this.editable = wd(this)),
      kd(this);
    let a = vs(this),
      c = yd(this),
      d =
        r.plugins != e.plugins && !r.doc.eq(e.doc)
          ? "reset"
          : e.scrollToSelection > r.scrollToSelection
            ? "to selection"
            : "preserve",
      h = i || !this.docView.matchesNode(e.doc, c, a);
    (h || !e.selection.eq(r.selection)) && (s = !0);
    let p = d == "preserve" && s && this.dom.style.overflowAnchor == null && P1(this);
    if (s) {
      this.domObserver.stop();
      let f =
        h &&
        (Ce || ve) &&
        !this.composing &&
        !r.selection.empty &&
        !e.selection.empty &&
        ny(r.selection, e.selection);
      if (h) {
        let u = ve ? (this.trackWrites = this.domSelectionRange().focusNode) : null;
        this.composing && (this.input.compositionNode = R0(this)),
          (i || !this.docView.update(e.doc, c, a, this)) &&
            (this.docView.updateOuterDeco(c),
            this.docView.destroy(),
            (this.docView = Qc(e.doc, c, a, this.dom, this))),
          u && !this.trackWrites && (f = !0);
      }
      f ||
      !(
        this.input.mouseDown &&
        this.domObserver.currentSelection.eq(this.domSelectionRange()) &&
        s0(this)
      )
        ? ct(this, f)
        : (_p(this, e.selection), this.domObserver.setCurSelection()),
        this.domObserver.start();
    }
    this.updatePluginViews(r),
      !((o = this.dragging) === null || o === void 0) &&
        o.node &&
        !r.doc.eq(e.doc) &&
        this.updateDraggedNode(this.dragging, r),
      d == "reset"
        ? (this.dom.scrollTop = 0)
        : d == "to selection"
          ? this.scrollToSelection()
          : p && B1(p);
  }
  scrollToSelection() {
    let e = this.domSelectionRange().focusNode;
    if (!this.someProp("handleScrollToSelection", (t) => t(this)))
      if (this.state.selection instanceof D) {
        let t = this.docView.domAfterPos(this.state.selection.from);
        t.nodeType == 1 && Wc(this, t.getBoundingClientRect(), e);
      } else Wc(this, this.coordsAtPos(this.state.selection.head, 1), e);
  }
  destroyPluginViews() {
    let e;
    for (; (e = this.pluginViews.pop()); ) e.destroy && e.destroy();
  }
  updatePluginViews(e) {
    if (!e || e.plugins != this.state.plugins || this.directPlugins != this.prevDirectPlugins) {
      (this.prevDirectPlugins = this.directPlugins), this.destroyPluginViews();
      for (let t = 0; t < this.directPlugins.length; t++) {
        let o = this.directPlugins[t];
        o.spec.view && this.pluginViews.push(o.spec.view(this));
      }
      for (let t = 0; t < this.state.plugins.length; t++) {
        let o = this.state.plugins[t];
        o.spec.view && this.pluginViews.push(o.spec.view(this));
      }
    } else
      for (let t = 0; t < this.pluginViews.length; t++) {
        let o = this.pluginViews[t];
        o.update && o.update(this, e);
      }
  }
  updateDraggedNode(e, t) {
    let o = e.node,
      r = -1;
    if (this.state.doc.nodeAt(o.from) == o.node) r = o.from;
    else {
      let i = o.from + (this.state.doc.content.size - t.doc.content.size);
      (i > 0 && this.state.doc.nodeAt(i)) == o.node && (r = i);
    }
    this.dragging = new mf(e.slice, e.move, r < 0 ? void 0 : D.create(this.state.doc, r));
  }
  someProp(e, t) {
    let o = this._props && this._props[e],
      r;
    if (o != null && (r = t ? t(o) : o)) return r;
    for (let s = 0; s < this.directPlugins.length; s++) {
      let l = this.directPlugins[s].props[e];
      if (l != null && (r = t ? t(l) : l)) return r;
    }
    let i = this.state.plugins;
    if (i)
      for (let s = 0; s < i.length; s++) {
        let l = i[s].props[e];
        if (l != null && (r = t ? t(l) : l)) return r;
      }
  }
  hasFocus() {
    if (Ce) {
      let e = this.root.activeElement;
      if (e == this.dom) return !0;
      if (!e || !this.dom.contains(e)) return !1;
      for (; e && this.dom != e && this.dom.contains(e); ) {
        if (e.contentEditable == "false") return !1;
        e = e.parentElement;
      }
      return !0;
    }
    return this.root.activeElement == this.dom;
  }
  focus() {
    this.domObserver.stop(), this.editable && F1(this.dom), ct(this), this.domObserver.start();
  }
  get root() {
    let e = this._root;
    if (e == null) {
      for (let t = this.dom.parentNode; t; t = t.parentNode)
        if (t.nodeType == 9 || (t.nodeType == 11 && t.host))
          return (
            t.getSelection ||
              (Object.getPrototypeOf(t).getSelection = () => t.ownerDocument.getSelection()),
            (this._root = t)
          );
    }
    return e || document;
  }
  updateRoot() {
    this._root = null;
  }
  posAtCoords(e) {
    return q1(this, e);
  }
  coordsAtPos(e, t = 1) {
    return Lp(this, e, t);
  }
  domAtPos(e, t = 0) {
    return this.docView.domFromPos(e, t);
  }
  nodeDOM(e) {
    let t = this.docView.descAt(e);
    return t ? t.nodeDOM : null;
  }
  posAtDOM(e, t, o = -1) {
    let r = this.docView.posFromDOM(e, t, o);
    if (r == null) throw new RangeError("DOM position not inside the editor");
    return r;
  }
  endOfTextblock(e, t) {
    return G1(this, t || this.state, e);
  }
  pasteHTML(e, t) {
    return rr(this, "", e, !1, t || new ClipboardEvent("paste"));
  }
  pasteText(e, t) {
    return rr(this, e, null, !0, t || new ClipboardEvent("paste"));
  }
  destroy() {
    this.docView &&
      (x0(this),
      this.destroyPluginViews(),
      this.mounted
        ? (this.docView.update(this.state.doc, [], vs(this), this), (this.dom.textContent = ""))
        : this.dom.parentNode && this.dom.parentNode.removeChild(this.dom),
      this.docView.destroy(),
      (this.docView = null),
      $1());
  }
  get isDestroyed() {
    return this.docView == null;
  }
  dispatchEvent(e) {
    return $0(this, e);
  }
  dispatch(e) {
    let t = this._props.dispatchTransaction;
    t ? t.call(this, e) : this.updateState(this.state.apply(e));
  }
  domSelectionRange() {
    return Se && this.root.nodeType === 11 && T1(this.dom.ownerDocument) == this.dom
      ? U0(this)
      : this.domSelection();
  }
  domSelection() {
    return this.root.getSelection();
  }
};
function yd(n) {
  let e = Object.create(null);
  return (
    (e.class = "ProseMirror"),
    (e.contenteditable = String(n.editable)),
    n.someProp("attributes", (t) => {
      if ((typeof t == "function" && (t = t(n.state)), t))
        for (let o in t)
          o == "class"
            ? (e.class += " " + t[o])
            : o == "style"
              ? (e.style = (e.style ? e.style + ";" : "") + t[o])
              : !e[o] && o != "contenteditable" && o != "nodeName" && (e[o] = String(t[o]));
    }),
    e.translate || (e.translate = "no"),
    [ao.node(0, n.state.doc.content.size, e)]
  );
}
function kd(n) {
  if (n.markCursor) {
    let e = document.createElement("img");
    (e.className = "ProseMirror-separator"),
      e.setAttribute("mark-placeholder", "true"),
      e.setAttribute("alt", ""),
      (n.cursorWrapper = {
        dom: e,
        deco: ao.widget(n.state.selection.head, e, { raw: !0, marks: n.markCursor }),
      });
  } else n.cursorWrapper = null;
}
function wd(n) {
  return !n.someProp("editable", (e) => e(n.state) === !1);
}
function ny(n, e) {
  let t = Math.min(n.$anchor.sharedDepth(n.head), e.$anchor.sharedDepth(e.head));
  return n.$anchor.start(t) != e.$anchor.start(t);
}
function bd(n) {
  let e = Object.create(null);
  function t(o) {
    for (let r in o) Object.prototype.hasOwnProperty.call(e, r) || (e[r] = o[r]);
  }
  return n.someProp("nodeViews", t), n.someProp("markViews", t), e;
}
function oy(n, e) {
  let t = 0,
    o = 0;
  for (let r in n) {
    if (n[r] != e[r]) return !0;
    t++;
  }
  for (let r in e) o++;
  return t != o;
}
function vd(n) {
  if (n.spec.state || n.spec.filterTransaction || n.spec.appendTransaction)
    throw new RangeError("Plugins passed directly to the view must not have a state component");
}
var Mt = {
    8: "Backspace",
    9: "Tab",
    10: "Enter",
    12: "NumLock",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    44: "PrintScreen",
    45: "Insert",
    46: "Delete",
    59: ";",
    61: "=",
    91: "Meta",
    92: "Meta",
    106: "*",
    107: "+",
    108: ",",
    109: "-",
    110: ".",
    111: "/",
    144: "NumLock",
    145: "ScrollLock",
    160: "Shift",
    161: "Shift",
    162: "Control",
    163: "Control",
    164: "Alt",
    165: "Alt",
    173: "-",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
  },
  yi = {
    48: ")",
    49: "!",
    50: "@",
    51: "#",
    52: "$",
    53: "%",
    54: "^",
    55: "&",
    56: "*",
    57: "(",
    59: ":",
    61: "+",
    173: "_",
    186: ":",
    187: "+",
    188: "<",
    189: "_",
    190: ">",
    191: "?",
    192: "~",
    219: "{",
    220: "|",
    221: "}",
    222: '"',
  },
  ry = typeof navigator < "u" && /Mac/.test(navigator.platform),
  iy =
    typeof navigator < "u" &&
    /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var re = 0; re < 10; re++) Mt[48 + re] = Mt[96 + re] = String(re);
for (var re = 1; re <= 24; re++) Mt[re + 111] = "F" + re;
for (var re = 65; re <= 90; re++)
  (Mt[re] = String.fromCharCode(re + 32)), (yi[re] = String.fromCharCode(re));
for (var Ss in Mt) yi.hasOwnProperty(Ss) || (yi[Ss] = Mt[Ss]);
function sy(n) {
  var e =
      (ry && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey) ||
      (iy && n.shiftKey && n.key && n.key.length == 1) ||
      n.key == "Unidentified",
    t = (!e && n.key) || (n.shiftKey ? yi : Mt)[n.keyCode] || n.key || "Unidentified";
  return (
    t == "Esc" && (t = "Escape"),
    t == "Del" && (t = "Delete"),
    t == "Left" && (t = "ArrowLeft"),
    t == "Up" && (t = "ArrowUp"),
    t == "Right" && (t = "ArrowRight"),
    t == "Down" && (t = "ArrowDown"),
    t
  );
}
const ly = typeof navigator < "u" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) : !1;
function ay(n) {
  let e = n.split(/-(?!$)/),
    t = e[e.length - 1];
  t == "Space" && (t = " ");
  let o, r, i, s;
  for (let l = 0; l < e.length - 1; l++) {
    let a = e[l];
    if (/^(cmd|meta|m)$/i.test(a)) s = !0;
    else if (/^a(lt)?$/i.test(a)) o = !0;
    else if (/^(c|ctrl|control)$/i.test(a)) r = !0;
    else if (/^s(hift)?$/i.test(a)) i = !0;
    else if (/^mod$/i.test(a)) ly ? (s = !0) : (r = !0);
    else throw new Error("Unrecognized modifier name: " + a);
  }
  return (
    o && (t = "Alt-" + t),
    r && (t = "Ctrl-" + t),
    s && (t = "Meta-" + t),
    i && (t = "Shift-" + t),
    t
  );
}
function cy(n) {
  let e = Object.create(null);
  for (let t in n) e[ay(t)] = n[t];
  return e;
}
function $s(n, e, t = !0) {
  return (
    e.altKey && (n = "Alt-" + n),
    e.ctrlKey && (n = "Ctrl-" + n),
    e.metaKey && (n = "Meta-" + n),
    t && e.shiftKey && (n = "Shift-" + n),
    n
  );
}
function dy(n) {
  return new Ct({ props: { handleKeyDown: hy(n) } });
}
function hy(n) {
  let e = cy(n);
  return function (t, o) {
    let r = sy(o),
      i,
      s = e[$s(r, o)];
    if (s && s(t.state, t.dispatch, t)) return !0;
    if (r.length == 1 && r != " ") {
      if (o.shiftKey) {
        let l = e[$s(r, o, !1)];
        if (l && l(t.state, t.dispatch, t)) return !0;
      }
      if (
        (o.shiftKey || o.altKey || o.metaKey || r.charCodeAt(0) > 127) &&
        (i = Mt[o.keyCode]) &&
        i != r
      ) {
        let l = e[$s(i, o)];
        if (l && l(t.state, t.dispatch, t)) return !0;
      }
    }
    return !1;
  };
}
const py = (n, e) =>
  n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Sf(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const fy = (n, e, t) => {
    let o = Sf(n, t);
    if (!o) return !1;
    let r = Ia(o);
    if (!r) {
      let s = o.blockRange(),
        l = s && lo(s);
      return l == null ? !1 : (e && e(n.tr.lift(s, l).scrollIntoView()), !0);
    }
    let i = r.nodeBefore;
    if (!i.type.spec.isolating && Of(n, r, e)) return !0;
    if (o.parent.content.size == 0 && (_n(i, "end") || D.isSelectable(i))) {
      let s = Wi(n.doc, o.before(), o.after(), S.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let l = n.tr.step(s);
          l.setSelection(
            _n(i, "end")
              ? P.findFrom(l.doc.resolve(l.mapping.map(r.pos, -1)), -1)
              : D.create(l.doc, r.pos - i.nodeSize),
          ),
            e(l.scrollIntoView());
        }
        return !0;
      }
    }
    return i.isAtom && r.depth == o.depth - 1
      ? (e && e(n.tr.delete(r.pos - i.nodeSize, r.pos).scrollIntoView()), !0)
      : !1;
  },
  uy = (n, e, t) => {
    let o = Sf(n, t);
    if (!o) return !1;
    let r = Ia(o);
    return r ? $f(n, r, e) : !1;
  },
  my = (n, e, t) => {
    let o = Mf(n, t);
    if (!o) return !1;
    let r = Da(o);
    return r ? $f(n, r, e) : !1;
  };
function $f(n, e, t) {
  let o = e.nodeBefore,
    r = o,
    i = e.pos - 1;
  for (; !r.isTextblock; i--) {
    if (r.type.spec.isolating) return !1;
    let d = r.lastChild;
    if (!d) return !1;
    r = d;
  }
  let s = e.nodeAfter,
    l = s,
    a = e.pos + 1;
  for (; !l.isTextblock; a++) {
    if (l.type.spec.isolating) return !1;
    let d = l.firstChild;
    if (!d) return !1;
    l = d;
  }
  let c = Wi(n.doc, i, a, S.empty);
  if (!c || c.from != i || (c instanceof Z && c.slice.size >= a - i)) return !1;
  if (t) {
    let d = n.tr.step(c);
    d.setSelection(J.create(d.doc, i)), t(d.scrollIntoView());
  }
  return !0;
}
function _n(n, e, t = !1) {
  for (let o = n; o; o = e == "start" ? o.firstChild : o.lastChild) {
    if (o.isTextblock) return !0;
    if (t && o.childCount != 1) return !1;
  }
  return !1;
}
const gy = (n, e, t) => {
  let { $head: o, empty: r } = n.selection,
    i = o;
  if (!r) return !1;
  if (o.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : o.parentOffset > 0) return !1;
    i = Ia(o);
  }
  let s = i && i.nodeBefore;
  return !s || !D.isSelectable(s)
    ? !1
    : (e && e(n.tr.setSelection(D.create(n.doc, i.pos - s.nodeSize)).scrollIntoView()), !0);
};
function Ia(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0) return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating) break;
    }
  return null;
}
function Mf(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size)
    ? null
    : t;
}
const yy = (n, e, t) => {
    let o = Mf(n, t);
    if (!o) return !1;
    let r = Da(o);
    if (!r) return !1;
    let i = r.nodeAfter;
    if (Of(n, r, e)) return !0;
    if (o.parent.content.size == 0 && (_n(i, "start") || D.isSelectable(i))) {
      let s = Wi(n.doc, o.before(), o.after(), S.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let l = n.tr.step(s);
          l.setSelection(
            _n(i, "start")
              ? P.findFrom(l.doc.resolve(l.mapping.map(r.pos)), 1)
              : D.create(l.doc, l.mapping.map(r.pos)),
          ),
            e(l.scrollIntoView());
        }
        return !0;
      }
    }
    return i.isAtom && r.depth == o.depth - 1
      ? (e && e(n.tr.delete(r.pos, r.pos + i.nodeSize).scrollIntoView()), !0)
      : !1;
  },
  ky = (n, e, t) => {
    let { $head: o, empty: r } = n.selection,
      i = o;
    if (!r) return !1;
    if (o.parent.isTextblock) {
      if (t ? !t.endOfTextblock("forward", n) : o.parentOffset < o.parent.content.size) return !1;
      i = Da(o);
    }
    let s = i && i.nodeAfter;
    return !s || !D.isSelectable(s)
      ? !1
      : (e && e(n.tr.setSelection(D.create(n.doc, i.pos)).scrollIntoView()), !0);
  };
function Da(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount) return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating) break;
    }
  return null;
}
const wy = (n, e) => {
    let t = n.selection,
      o = t instanceof D,
      r;
    if (o) {
      if (t.node.isTextblock || !un(n.doc, t.from)) return !1;
      r = t.from;
    } else if (((r = Ki(n.doc, t.from, -1)), r == null)) return !1;
    if (e) {
      let i = n.tr.join(r);
      o && i.setSelection(D.create(i.doc, r - n.doc.resolve(r).nodeBefore.nodeSize)),
        e(i.scrollIntoView());
    }
    return !0;
  },
  by = (n, e) => {
    let t = n.selection,
      o;
    if (t instanceof D) {
      if (t.node.isTextblock || !un(n.doc, t.to)) return !1;
      o = t.to;
    } else if (((o = Ki(n.doc, t.to, 1)), o == null)) return !1;
    return e && e(n.tr.join(o).scrollIntoView()), !0;
  },
  vy = (n, e) => {
    let { $from: t, $to: o } = n.selection,
      r = t.blockRange(o),
      i = r && lo(r);
    return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
  },
  xy = (n, e) => {
    let { $head: t, $anchor: o } = n.selection;
    return !t.parent.type.spec.code || !t.sameParent(o)
      ? !1
      : (e &&
          e(
            n.tr
              .insertText(
                `
`,
              )
              .scrollIntoView(),
          ),
        !0);
  };
function Cf(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs()) return t;
  }
  return null;
}
const Sy = (n, e) => {
    let { $head: t, $anchor: o } = n.selection;
    if (!t.parent.type.spec.code || !t.sameParent(o)) return !1;
    let r = t.node(-1),
      i = t.indexAfter(-1),
      s = Cf(r.contentMatchAt(i));
    if (!s || !r.canReplaceWith(i, i, s)) return !1;
    if (e) {
      let l = t.after(),
        a = n.tr.replaceWith(l, l, s.createAndFill());
      a.setSelection(P.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
    }
    return !0;
  },
  $y = (n, e) => {
    let t = n.selection,
      { $from: o, $to: r } = t;
    if (t instanceof en || o.parent.inlineContent || r.parent.inlineContent) return !1;
    let i = Cf(r.parent.contentMatchAt(r.indexAfter()));
    if (!i || !i.isTextblock) return !1;
    if (e) {
      let s = (!o.parentOffset && r.index() < r.parent.childCount ? o : r).pos,
        l = n.tr.insert(s, i.createAndFill());
      l.setSelection(J.create(l.doc, s + 1)), e(l.scrollIntoView());
    }
    return !0;
  },
  My = (n, e) => {
    let { $cursor: t } = n.selection;
    if (!t || t.parent.content.size) return !1;
    if (t.depth > 1 && t.after() != t.end(-1)) {
      let i = t.before();
      if (qn(n.doc, i)) return e && e(n.tr.split(i).scrollIntoView()), !0;
    }
    let o = t.blockRange(),
      r = o && lo(o);
    return r == null ? !1 : (e && e(n.tr.lift(o, r).scrollIntoView()), !0);
  },
  Cy = (n, e) => {
    let { $from: t, to: o } = n.selection,
      r,
      i = t.sharedDepth(o);
    return i == 0 ? !1 : ((r = t.before(i)), e && e(n.tr.setSelection(D.create(n.doc, r))), !0);
  };
function Oy(n, e, t) {
  let o = e.nodeBefore,
    r = e.nodeAfter,
    i = e.index();
  return !o || !r || !o.type.compatibleContent(r.type)
    ? !1
    : !o.content.size && e.parent.canReplace(i - 1, i)
      ? (t && t(n.tr.delete(e.pos - o.nodeSize, e.pos).scrollIntoView()), !0)
      : !e.parent.canReplace(i, i + 1) || !(r.isTextblock || un(n.doc, e.pos))
        ? !1
        : (t &&
            t(
              n.tr
                .clearIncompatible(e.pos, o.type, o.contentMatchAt(o.childCount))
                .join(e.pos)
                .scrollIntoView(),
            ),
          !0);
}
function Of(n, e, t) {
  let o = e.nodeBefore,
    r = e.nodeAfter,
    i,
    s;
  if (o.type.spec.isolating || r.type.spec.isolating) return !1;
  if (Oy(n, e, t)) return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (
    l &&
    (i = (s = o.contentMatchAt(o.childCount)).findWrapping(r.type)) &&
    s.matchType(i[0] || r.type).validEnd
  ) {
    if (t) {
      let h = e.pos + r.nodeSize,
        p = k.empty;
      for (let m = i.length - 1; m >= 0; m--) p = k.from(i[m].create(null, p));
      p = k.from(o.copy(p));
      let f = n.tr.step(new Te(e.pos - 1, h, e.pos, h, new S(p, 1, 0), i.length, !0)),
        u = h + 2 * i.length;
      un(f.doc, u) && f.join(u), t(f.scrollIntoView());
    }
    return !0;
  }
  let a = P.findFrom(e, 1),
    c = a && a.$from.blockRange(a.$to),
    d = c && lo(c);
  if (d != null && d >= e.depth) return t && t(n.tr.lift(c, d).scrollIntoView()), !0;
  if (l && _n(r, "start", !0) && _n(o, "end")) {
    let h = o,
      p = [];
    for (; p.push(h), !h.isTextblock; ) h = h.lastChild;
    let f = r,
      u = 1;
    for (; !f.isTextblock; f = f.firstChild) u++;
    if (h.canReplace(h.childCount, h.childCount, f.content)) {
      if (t) {
        let m = k.empty;
        for (let y = p.length - 1; y >= 0; y--) m = k.from(p[y].copy(m));
        let g = n.tr.step(
          new Te(
            e.pos - p.length,
            e.pos + r.nodeSize,
            e.pos + u,
            e.pos + r.nodeSize - u,
            new S(m, p.length, 0),
            0,
            !0,
          ),
        );
        t(g.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Nf(n) {
  return function (e, t) {
    let o = e.selection,
      r = n < 0 ? o.$from : o.$to,
      i = r.depth;
    for (; r.node(i).isInline; ) {
      if (!i) return !1;
      i--;
    }
    return r.node(i).isTextblock
      ? (t && t(e.tr.setSelection(J.create(e.doc, n < 0 ? r.start(i) : r.end(i)))), !0)
      : !1;
  };
}
const Ny = Nf(-1),
  Ty = Nf(1);
function Ey(n, e = null) {
  return function (t, o) {
    let { $from: r, $to: i } = t.selection,
      s = r.blockRange(i),
      l = s && $p(s, n, e);
    return l ? (o && o(t.tr.wrap(s, l).scrollIntoView()), !0) : !1;
  };
}
function xd(n, e = null) {
  return function (t, o) {
    let r = !1;
    for (let i = 0; i < t.selection.ranges.length && !r; i++) {
      let {
        $from: { pos: s },
        $to: { pos: l },
      } = t.selection.ranges[i];
      t.doc.nodesBetween(s, l, (a, c) => {
        if (r) return !1;
        if (!(!a.isTextblock || a.hasMarkup(n, e)))
          if (a.type == n) r = !0;
          else {
            let d = t.doc.resolve(c),
              h = d.index();
            r = d.parent.canReplaceWith(h, h + 1, n);
          }
      });
    }
    if (!r) return !1;
    if (o) {
      let i = t.tr;
      for (let s = 0; s < t.selection.ranges.length; s++) {
        let {
          $from: { pos: l },
          $to: { pos: a },
        } = t.selection.ranges[s];
        i.setBlockType(l, a, n, e);
      }
      o(i.scrollIntoView());
    }
    return !0;
  };
}
typeof navigator < "u"
  ? /Mac|iP(hone|[oa]d)/.test(navigator.platform)
  : typeof os < "u" && os.platform && os.platform() == "darwin";
function Ay(n, e = null) {
  return function (t, o) {
    let { $from: r, $to: i } = t.selection,
      s = r.blockRange(i),
      l = !1,
      a = s;
    if (!s) return !1;
    if (s.depth >= 2 && r.node(s.depth - 1).type.compatibleContent(n) && s.startIndex == 0) {
      if (r.index(s.depth - 1) == 0) return !1;
      let d = t.doc.resolve(s.start - 2);
      (a = new di(d, d, s.depth)),
        s.endIndex < s.parent.childCount && (s = new di(r, t.doc.resolve(i.end(s.depth)), s.depth)),
        (l = !0);
    }
    let c = $p(a, n, e, s);
    return c ? (o && o(Iy(t.tr, s, c, l, n).scrollIntoView()), !0) : !1;
  };
}
function Iy(n, e, t, o, r) {
  let i = k.empty;
  for (let d = t.length - 1; d >= 0; d--) i = k.from(t[d].type.create(t[d].attrs, i));
  n.step(new Te(e.start - (o ? 2 : 0), e.end, e.start, e.end, new S(i, 0, 0), t.length, !0));
  let s = 0;
  for (let d = 0; d < t.length; d++) t[d].type == r && (s = d + 1);
  let l = t.length - s,
    a = e.start + t.length - (o ? 2 : 0),
    c = e.parent;
  for (let d = e.startIndex, h = e.endIndex, p = !0; d < h; d++, p = !1)
    !p && qn(n.doc, a, l) && (n.split(a, l), (a += 2 * l)), (a += c.child(d).nodeSize);
  return n;
}
function Dy(n) {
  return function (e, t) {
    let { $from: o, $to: r } = e.selection,
      i = o.blockRange(r, (s) => s.childCount > 0 && s.firstChild.type == n);
    return i ? (t ? (o.node(i.depth - 1).type == n ? Ry(e, t, n, i) : zy(e, t, i)) : !0) : !1;
  };
}
function Ry(n, e, t, o) {
  let r = n.tr,
    i = o.end,
    s = o.$to.end(o.depth);
  i < s &&
    (r.step(new Te(i - 1, s, i, s, new S(k.from(t.create(null, o.parent.copy())), 1, 0), 1, !0)),
    (o = new di(r.doc.resolve(o.$from.pos), r.doc.resolve(s), o.depth)));
  const l = lo(o);
  if (l == null) return !1;
  r.lift(o, l);
  let a = r.mapping.map(i, -1) - 1;
  return un(r.doc, a) && r.join(a), e(r.scrollIntoView()), !0;
}
function zy(n, e, t) {
  let o = n.tr,
    r = t.parent;
  for (let f = t.end, u = t.endIndex - 1, m = t.startIndex; u > m; u--)
    (f -= r.child(u).nodeSize), o.delete(f - 1, f + 1);
  let i = o.doc.resolve(t.start),
    s = i.nodeAfter;
  if (o.mapping.map(t.end) != t.start + i.nodeAfter.nodeSize) return !1;
  let l = t.startIndex == 0,
    a = t.endIndex == r.childCount,
    c = i.node(-1),
    d = i.index(-1);
  if (!c.canReplace(d + (l ? 0 : 1), d + 1, s.content.append(a ? k.empty : k.from(r)))) return !1;
  let h = i.pos,
    p = h + s.nodeSize;
  return (
    o.step(
      new Te(
        h - (l ? 1 : 0),
        p + (a ? 1 : 0),
        h + 1,
        p - 1,
        new S(
          (l ? k.empty : k.from(r.copy(k.empty))).append(a ? k.empty : k.from(r.copy(k.empty))),
          l ? 0 : 1,
          a ? 0 : 1,
        ),
        l ? 0 : 1,
      ),
    ),
    e(o.scrollIntoView()),
    !0
  );
}
function Py(n) {
  return function (e, t) {
    let { $from: o, $to: r } = e.selection,
      i = o.blockRange(r, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!i) return !1;
    let s = i.startIndex;
    if (s == 0) return !1;
    let l = i.parent,
      a = l.child(s - 1);
    if (a.type != n) return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type,
        d = k.from(c ? n.create() : null),
        h = new S(k.from(n.create(null, k.from(l.type.create(null, d)))), c ? 3 : 1, 0),
        p = i.start,
        f = i.end;
      t(e.tr.step(new Te(p - (c ? 3 : 1), f, p, f, h, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Gi(n) {
  const { state: e, transaction: t } = n;
  let { selection: o } = t,
    { doc: r } = t,
    { storedMarks: i } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return i;
    },
    get selection() {
      return o;
    },
    get doc() {
      return r;
    },
    get tr() {
      return (o = t.selection), (r = t.doc), (i = t.storedMarks), t;
    },
  };
}
let Yi = class {
    constructor(e) {
      (this.editor = e.editor),
        (this.rawCommands = this.editor.extensionManager.commands),
        (this.customState = e.state);
    }
    get hasCustomState() {
      return !!this.customState;
    }
    get state() {
      return this.customState || this.editor.state;
    }
    get commands() {
      const { rawCommands: e, editor: t, state: o } = this,
        { view: r } = t,
        { tr: i } = o,
        s = this.buildProps(i);
      return Object.fromEntries(
        Object.entries(e).map(([l, a]) => [
          l,
          (...c) => {
            const d = a(...c)(s);
            return !i.getMeta("preventDispatch") && !this.hasCustomState && r.dispatch(i), d;
          },
        ]),
      );
    }
    get chain() {
      return () => this.createChain();
    }
    get can() {
      return () => this.createCan();
    }
    createChain(e, t = !0) {
      const { rawCommands: o, editor: r, state: i } = this,
        { view: s } = r,
        l = [],
        a = !!e,
        c = e || i.tr,
        d = () => (
          !a && t && !c.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(c),
          l.every((p) => p === !0)
        ),
        h = {
          ...Object.fromEntries(
            Object.entries(o).map(([p, f]) => [
              p,
              (...u) => {
                const m = this.buildProps(c, t),
                  g = f(...u)(m);
                return l.push(g), h;
              },
            ]),
          ),
          run: d,
        };
      return h;
    }
    createCan(e) {
      const { rawCommands: t, state: o } = this,
        r = !1,
        i = e || o.tr,
        s = this.buildProps(i, r);
      return {
        ...Object.fromEntries(
          Object.entries(t).map(([l, a]) => [l, (...c) => a(...c)({ ...s, dispatch: void 0 })]),
        ),
        chain: () => this.createChain(i, r),
      };
    }
    buildProps(e, t = !0) {
      const { rawCommands: o, editor: r, state: i } = this,
        { view: s } = r,
        l = {
          tr: e,
          editor: r,
          view: s,
          state: Gi({ state: i, transaction: e }),
          dispatch: t ? () => {} : void 0,
          chain: () => this.createChain(e, t),
          can: () => this.createCan(e),
          get commands() {
            return Object.fromEntries(Object.entries(o).map(([a, c]) => [a, (...d) => c(...d)(l)]));
          },
        };
      return l;
    }
  },
  By = class {
    constructor() {
      this.callbacks = {};
    }
    on(e, t) {
      return this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t), this;
    }
    emit(e, ...t) {
      const o = this.callbacks[e];
      return o && o.forEach((r) => r.apply(this, t)), this;
    }
    off(e, t) {
      const o = this.callbacks[e];
      return (
        o && (t ? (this.callbacks[e] = o.filter((r) => r !== t)) : delete this.callbacks[e]), this
      );
    }
    removeAllListeners() {
      this.callbacks = {};
    }
  };
function M(n, e, t) {
  return n.config[e] === void 0 && n.parent
    ? M(n.parent, e, t)
    : typeof n.config[e] == "function"
      ? n.config[e].bind({ ...t, parent: n.parent ? M(n.parent, e, t) : null })
      : n.config[e];
}
function Xi(n) {
  const e = n.filter((r) => r.type === "extension"),
    t = n.filter((r) => r.type === "node"),
    o = n.filter((r) => r.type === "mark");
  return { baseExtensions: e, nodeExtensions: t, markExtensions: o };
}
function Tf(n) {
  const e = [],
    { nodeExtensions: t, markExtensions: o } = Xi(n),
    r = [...t, ...o],
    i = {
      default: null,
      rendered: !0,
      renderHTML: null,
      parseHTML: null,
      keepOnSplit: !0,
      isRequired: !1,
    };
  return (
    n.forEach((s) => {
      const l = { name: s.name, options: s.options, storage: s.storage },
        a = M(s, "addGlobalAttributes", l);
      a &&
        a().forEach((c) => {
          c.types.forEach((d) => {
            Object.entries(c.attributes).forEach(([h, p]) => {
              e.push({ type: d, name: h, attribute: { ...i, ...p } });
            });
          });
        });
    }),
    r.forEach((s) => {
      const l = { name: s.name, options: s.options, storage: s.storage },
        a = M(s, "addAttributes", l);
      if (!a) return;
      const c = a();
      Object.entries(c).forEach(([d, h]) => {
        const p = { ...i, ...h };
        typeof (p == null ? void 0 : p.default) == "function" && (p.default = p.default()),
          p != null &&
            p.isRequired &&
            (p == null ? void 0 : p.default) === void 0 &&
            delete p.default,
          e.push({ type: s.name, name: d, attribute: p });
      });
    }),
    e
  );
}
function ee(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
function Fy(...n) {
  return n
    .filter((e) => !!e)
    .reduce((e, t) => {
      const o = { ...e };
      return (
        Object.entries(t).forEach(([r, i]) => {
          if (!o[r]) {
            o[r] = i;
            return;
          }
          if (r === "class") {
            const s = i ? i.split(" ") : [],
              l = o[r] ? o[r].split(" ") : [],
              a = s.filter((c) => !l.includes(c));
            o[r] = [...l, ...a].join(" ");
          } else r === "style" ? (o[r] = [o[r], i].join("; ")) : (o[r] = i);
        }),
        o
      );
    }, {});
}
function Il(n, e) {
  return e
    .filter((t) => t.attribute.rendered)
    .map((t) =>
      t.attribute.renderHTML
        ? t.attribute.renderHTML(n.attrs) || {}
        : { [t.name]: n.attrs[t.name] },
    )
    .reduce((t, o) => Fy(t, o), {});
}
function Ef(n) {
  return typeof n == "function";
}
function L(n, e = void 0, ...t) {
  return Ef(n) ? (e ? n.bind(e)(...t) : n(...t)) : n;
}
function Vy(n = {}) {
  return Object.keys(n).length === 0 && n.constructor === Object;
}
function jy(n) {
  return typeof n != "string"
    ? n
    : n.match(/^[+-]?(?:\d*\.)?\d+$/)
      ? Number(n)
      : n === "true"
        ? !0
        : n === "false"
          ? !1
          : n;
}
function Sd(n, e) {
  return n.style
    ? n
    : {
        ...n,
        getAttrs: (t) => {
          const o = n.getAttrs ? n.getAttrs(t) : n.attrs;
          if (o === !1) return !1;
          const r = e.reduce((i, s) => {
            const l = s.attribute.parseHTML ? s.attribute.parseHTML(t) : jy(t.getAttribute(s.name));
            return l == null ? i : { ...i, [s.name]: l };
          }, {});
          return { ...o, ...r };
        },
      };
}
function $d(n) {
  return Object.fromEntries(
    Object.entries(n).filter(([e, t]) => (e === "attrs" && Vy(t) ? !1 : t != null)),
  );
}
function Jy(n, e) {
  var t;
  const o = Tf(n),
    { nodeExtensions: r, markExtensions: i } = Xi(n),
    s = (t = r.find((c) => M(c, "topNode"))) === null || t === void 0 ? void 0 : t.name,
    l = Object.fromEntries(
      r.map((c) => {
        const d = o.filter((y) => y.type === c.name),
          h = { name: c.name, options: c.options, storage: c.storage, editor: e },
          p = n.reduce((y, w) => {
            const b = M(w, "extendNodeSchema", h);
            return { ...y, ...(b ? b(c) : {}) };
          }, {}),
          f = $d({
            ...p,
            content: L(M(c, "content", h)),
            marks: L(M(c, "marks", h)),
            group: L(M(c, "group", h)),
            inline: L(M(c, "inline", h)),
            atom: L(M(c, "atom", h)),
            selectable: L(M(c, "selectable", h)),
            draggable: L(M(c, "draggable", h)),
            code: L(M(c, "code", h)),
            defining: L(M(c, "defining", h)),
            isolating: L(M(c, "isolating", h)),
            attrs: Object.fromEntries(
              d.map((y) => {
                var w;
                return [
                  y.name,
                  {
                    default:
                      (w = y == null ? void 0 : y.attribute) === null || w === void 0
                        ? void 0
                        : w.default,
                  },
                ];
              }),
            ),
          }),
          u = L(M(c, "parseHTML", h));
        u && (f.parseDOM = u.map((y) => Sd(y, d)));
        const m = M(c, "renderHTML", h);
        m && (f.toDOM = (y) => m({ node: y, HTMLAttributes: Il(y, d) }));
        const g = M(c, "renderText", h);
        return g && (f.toText = g), [c.name, f];
      }),
    ),
    a = Object.fromEntries(
      i.map((c) => {
        const d = o.filter((g) => g.type === c.name),
          h = { name: c.name, options: c.options, storage: c.storage, editor: e },
          p = n.reduce((g, y) => {
            const w = M(y, "extendMarkSchema", h);
            return { ...g, ...(w ? w(c) : {}) };
          }, {}),
          f = $d({
            ...p,
            inclusive: L(M(c, "inclusive", h)),
            excludes: L(M(c, "excludes", h)),
            group: L(M(c, "group", h)),
            spanning: L(M(c, "spanning", h)),
            code: L(M(c, "code", h)),
            attrs: Object.fromEntries(
              d.map((g) => {
                var y;
                return [
                  g.name,
                  {
                    default:
                      (y = g == null ? void 0 : g.attribute) === null || y === void 0
                        ? void 0
                        : y.default,
                  },
                ];
              }),
            ),
          }),
          u = L(M(c, "parseHTML", h));
        u && (f.parseDOM = u.map((g) => Sd(g, d)));
        const m = M(c, "renderHTML", h);
        return m && (f.toDOM = (g) => m({ mark: g, HTMLAttributes: Il(g, d) })), [c.name, f];
      }),
    );
  return new jg({ topNode: s, nodes: l, marks: a });
}
function Ms(n, e) {
  return e.nodes[n] || e.marks[n] || null;
}
function Md(n, e) {
  return Array.isArray(e) ? e.some((t) => (typeof t == "string" ? t : t.name) === n.name) : e;
}
const Ly = (n, e = 500) => {
  let t = "";
  const o = n.parentOffset;
  return (
    n.parent.nodesBetween(Math.max(0, o - e), o, (r, i, s, l) => {
      var a, c;
      const d =
        ((c = (a = r.type.spec).toText) === null || c === void 0
          ? void 0
          : c.call(a, { node: r, pos: i, parent: s, index: l })) ||
        r.textContent ||
        "%leaf%";
      t += d.slice(0, Math.max(0, o - i));
    }),
    t
  );
};
function Ra(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
const qy = (n, e) => {
  if (Ra(e)) return e.exec(n);
  const t = e(n);
  if (!t) return null;
  const o = [t.text];
  return (
    (o.index = t.index),
    (o.input = n),
    (o.data = t.data),
    t.replaceWith &&
      (t.text.includes(t.replaceWith) ||
        console.warn(
          '[tiptap warn]: "inputRuleMatch.replaceWith" must be part of "inputRuleMatch.text".',
        ),
      o.push(t.replaceWith)),
    o
  );
};
function Cs(n) {
  var e;
  const { editor: t, from: o, to: r, text: i, rules: s, plugin: l } = n,
    { view: a } = t;
  if (a.composing) return !1;
  const c = a.state.doc.resolve(o);
  if (
    c.parent.type.spec.code ||
    (!((e = c.nodeBefore || c.nodeAfter) === null || e === void 0) &&
      e.marks.find((p) => p.type.spec.code))
  )
    return !1;
  let d = !1;
  const h = Ly(c) + i;
  return (
    s.forEach((p) => {
      if (d) return;
      const f = qy(h, p.find);
      if (!f) return;
      const u = a.state.tr,
        m = Gi({ state: a.state, transaction: u }),
        g = { from: o - (f[0].length - i.length), to: r },
        { commands: y, chain: w, can: b } = new Yi({ editor: t, state: m });
      p.handler({ state: m, range: g, match: f, commands: y, chain: w, can: b }) === null ||
        !u.steps.length ||
        (u.setMeta(l, { transform: u, from: o, to: r, text: i }), a.dispatch(u), (d = !0));
    }),
    d
  );
}
function Ky(n) {
  const { editor: e, rules: t } = n,
    o = new Ct({
      state: {
        init() {
          return null;
        },
        apply(r, i) {
          return r.getMeta(o) || (r.selectionSet || r.docChanged ? null : i);
        },
      },
      props: {
        handleTextInput(r, i, s, l) {
          return Cs({ editor: e, from: i, to: s, text: l, rules: t, plugin: o });
        },
        handleDOMEvents: {
          compositionend: (r) => (
            setTimeout(() => {
              const { $cursor: i } = r.state.selection;
              i && Cs({ editor: e, from: i.pos, to: i.pos, text: "", rules: t, plugin: o });
            }),
            !1
          ),
        },
        handleKeyDown(r, i) {
          if (i.key !== "Enter") return !1;
          const { $cursor: s } = r.state.selection;
          return s
            ? Cs({
                editor: e,
                from: s.pos,
                to: s.pos,
                text: `
`,
                rules: t,
                plugin: o,
              })
            : !1;
        },
      },
      isInputRules: !0,
    });
  return o;
}
function Wy(n) {
  return typeof n == "number";
}
const Hy = (n, e, t) => {
  if (Ra(e)) return [...n.matchAll(e)];
  const o = e(n, t);
  return o
    ? o.map((r) => {
        const i = [r.text];
        return (
          (i.index = r.index),
          (i.input = n),
          (i.data = r.data),
          r.replaceWith &&
            (r.text.includes(r.replaceWith) ||
              console.warn(
                '[tiptap warn]: "pasteRuleMatch.replaceWith" must be part of "pasteRuleMatch.text".',
              ),
            i.push(r.replaceWith)),
          i
        );
      })
    : [];
};
function Uy(n) {
  const { editor: e, state: t, from: o, to: r, rule: i, pasteEvent: s, dropEvent: l } = n,
    { commands: a, chain: c, can: d } = new Yi({ editor: e, state: t }),
    h = [];
  return (
    t.doc.nodesBetween(o, r, (p, f) => {
      if (!p.isTextblock || p.type.spec.code) return;
      const u = Math.max(o, f),
        m = Math.min(r, f + p.content.size),
        g = p.textBetween(u - f, m - f, void 0, "￼");
      Hy(g, i.find, s).forEach((y) => {
        if (y.index === void 0) return;
        const w = u + y.index + 1,
          b = w + y[0].length,
          z = { from: t.tr.mapping.map(w), to: t.tr.mapping.map(b) },
          $ = i.handler({
            state: t,
            range: z,
            match: y,
            commands: a,
            chain: c,
            can: d,
            pasteEvent: s,
            dropEvent: l,
          });
        h.push($);
      });
    }),
    h.every((p) => p !== null)
  );
}
function Gy(n) {
  const { editor: e, rules: t } = n;
  let o = null,
    r = !1,
    i = !1,
    s = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null,
    l = typeof DragEvent < "u" ? new DragEvent("drop") : null;
  return t.map(
    (a) =>
      new Ct({
        view(c) {
          const d = (h) => {
            var p;
            o =
              !((p = c.dom.parentElement) === null || p === void 0) && p.contains(h.target)
                ? c.dom.parentElement
                : null;
          };
          return (
            window.addEventListener("dragstart", d),
            {
              destroy() {
                window.removeEventListener("dragstart", d);
              },
            }
          );
        },
        props: {
          handleDOMEvents: {
            drop: (c, d) => ((i = o === c.dom.parentElement), (l = d), !1),
            paste: (c, d) => {
              var h;
              const p =
                (h = d.clipboardData) === null || h === void 0 ? void 0 : h.getData("text/html");
              return (s = d), (r = !!(p != null && p.includes("data-pm-slice"))), !1;
            },
          },
        },
        appendTransaction: (c, d, h) => {
          const p = c[0],
            f = p.getMeta("uiEvent") === "paste" && !r,
            u = p.getMeta("uiEvent") === "drop" && !i;
          if (!f && !u) return;
          const m = d.doc.content.findDiffStart(h.doc.content),
            g = d.doc.content.findDiffEnd(h.doc.content);
          if (!Wy(m) || !g || m === g.b) return;
          const y = h.tr,
            w = Gi({ state: h, transaction: y });
          if (
            !(
              !Uy({
                editor: e,
                state: w,
                from: Math.max(m - 1, 0),
                to: g.b - 1,
                rule: a,
                pasteEvent: s,
                dropEvent: l,
              }) || !y.steps.length
            )
          )
            return (
              (l = typeof DragEvent < "u" ? new DragEvent("drop") : null),
              (s = typeof ClipboardEvent < "u" ? new ClipboardEvent("paste") : null),
              y
            );
        },
      }),
  );
}
function Yy(n) {
  const e = n.filter((t, o) => n.indexOf(t) !== o);
  return [...new Set(e)];
}
let Xy = class To {
  constructor(e, t) {
    (this.splittableMarks = []),
      (this.editor = t),
      (this.extensions = To.resolve(e)),
      (this.schema = Jy(this.extensions, t)),
      this.extensions.forEach((o) => {
        var r;
        this.editor.extensionStorage[o.name] = o.storage;
        const i = {
          name: o.name,
          options: o.options,
          storage: o.storage,
          editor: this.editor,
          type: Ms(o.name, this.schema),
        };
        o.type === "mark" &&
          (!((r = L(M(o, "keepOnSplit", i))) !== null && r !== void 0) || r) &&
          this.splittableMarks.push(o.name);
        const s = M(o, "onBeforeCreate", i);
        s && this.editor.on("beforeCreate", s);
        const l = M(o, "onCreate", i);
        l && this.editor.on("create", l);
        const a = M(o, "onUpdate", i);
        a && this.editor.on("update", a);
        const c = M(o, "onSelectionUpdate", i);
        c && this.editor.on("selectionUpdate", c);
        const d = M(o, "onTransaction", i);
        d && this.editor.on("transaction", d);
        const h = M(o, "onFocus", i);
        h && this.editor.on("focus", h);
        const p = M(o, "onBlur", i);
        p && this.editor.on("blur", p);
        const f = M(o, "onDestroy", i);
        f && this.editor.on("destroy", f);
      });
  }
  static resolve(e) {
    const t = To.sort(To.flatten(e)),
      o = Yy(t.map((r) => r.name));
    return (
      o.length &&
        console.warn(
          `[tiptap warn]: Duplicate extension names found: [${o.map((r) => `'${r}'`).join(", ")}]. This can lead to issues.`,
        ),
      t
    );
  }
  static flatten(e) {
    return e
      .map((t) => {
        const o = { name: t.name, options: t.options, storage: t.storage },
          r = M(t, "addExtensions", o);
        return r ? [t, ...this.flatten(r())] : t;
      })
      .flat(10);
  }
  static sort(e) {
    return e.sort((t, o) => {
      const r = M(t, "priority") || 100,
        i = M(o, "priority") || 100;
      return r > i ? -1 : r < i ? 1 : 0;
    });
  }
  get commands() {
    return this.extensions.reduce((e, t) => {
      const o = {
          name: t.name,
          options: t.options,
          storage: t.storage,
          editor: this.editor,
          type: Ms(t.name, this.schema),
        },
        r = M(t, "addCommands", o);
      return r ? { ...e, ...r() } : e;
    }, {});
  }
  get plugins() {
    const { editor: e } = this,
      t = To.sort([...this.extensions].reverse()),
      o = [],
      r = [],
      i = t
        .map((s) => {
          const l = {
              name: s.name,
              options: s.options,
              storage: s.storage,
              editor: e,
              type: Ms(s.name, this.schema),
            },
            a = [],
            c = M(s, "addKeyboardShortcuts", l);
          let d = {};
          if (
            (s.type === "mark" &&
              s.config.exitable &&
              (d.ArrowRight = () => Ow.handleExit({ editor: e, mark: s })),
            c)
          ) {
            const m = Object.fromEntries(
              Object.entries(c()).map(([g, y]) => [g, () => y({ editor: e })]),
            );
            d = { ...d, ...m };
          }
          const h = dy(d);
          a.push(h);
          const p = M(s, "addInputRules", l);
          Md(s, e.options.enableInputRules) && p && o.push(...p());
          const f = M(s, "addPasteRules", l);
          Md(s, e.options.enablePasteRules) && f && r.push(...f());
          const u = M(s, "addProseMirrorPlugins", l);
          if (u) {
            const m = u();
            a.push(...m);
          }
          return a;
        })
        .flat();
    return [Ky({ editor: e, rules: o }), ...Gy({ editor: e, rules: r }), ...i];
  }
  get attributes() {
    return Tf(this.extensions);
  }
  get nodeViews() {
    const { editor: e } = this,
      { nodeExtensions: t } = Xi(this.extensions);
    return Object.fromEntries(
      t
        .filter((o) => !!M(o, "addNodeView"))
        .map((o) => {
          const r = this.attributes.filter((a) => a.type === o.name),
            i = {
              name: o.name,
              options: o.options,
              storage: o.storage,
              editor: e,
              type: ee(o.name, this.schema),
            },
            s = M(o, "addNodeView", i);
          if (!s) return [];
          const l = (a, c, d, h) => {
            const p = Il(a, r);
            return s()({
              editor: e,
              node: a,
              getPos: d,
              decorations: h,
              HTMLAttributes: p,
              extension: o,
            });
          };
          return [o.name, l];
        }),
    );
  }
};
function Qy(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Os(n) {
  return Qy(n) !== "Object"
    ? !1
    : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function za(n, e) {
  const t = { ...n };
  return (
    Os(n) &&
      Os(e) &&
      Object.keys(e).forEach((o) => {
        Os(e[o])
          ? o in n
            ? (t[o] = za(n[o], e[o]))
            : Object.assign(t, { [o]: e[o] })
          : Object.assign(t, { [o]: e[o] });
      }),
    t
  );
}
let co = class Dl {
  constructor(e = {}) {
    (this.type = "extension"),
      (this.name = "extension"),
      (this.parent = null),
      (this.child = null),
      (this.config = { name: this.name, defaultOptions: {} }),
      (this.config = { ...this.config, ...e }),
      (this.name = this.config.name),
      e.defaultOptions &&
        Object.keys(e.defaultOptions).length > 0 &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`,
        ),
      (this.options = this.config.defaultOptions),
      this.config.addOptions && (this.options = L(M(this, "addOptions", { name: this.name }))),
      (this.storage = L(M(this, "addStorage", { name: this.name, options: this.options })) || {});
  }
  static create(e = {}) {
    return new Dl(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return (
      (t.options = za(this.options, e)),
      (t.storage = L(M(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
  extend(e = {}) {
    const t = new Dl({ ...this.config, ...e });
    return (
      (t.parent = this),
      (this.child = t),
      (t.name = e.name ? e.name : t.parent.name),
      e.defaultOptions &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`,
        ),
      (t.options = L(M(t, "addOptions", { name: t.name }))),
      (t.storage = L(M(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
};
function Af(n, e, t) {
  const { from: o, to: r } = e,
    {
      blockSeparator: i = `

`,
      textSerializers: s = {},
    } = t || {};
  let l = "",
    a = !0;
  return (
    n.nodesBetween(o, r, (c, d, h, p) => {
      var f;
      const u = s == null ? void 0 : s[c.type.name];
      u
        ? (c.isBlock && !a && ((l += i), (a = !0)),
          h && (l += u({ node: c, pos: d, parent: h, index: p, range: e })))
        : c.isText
          ? ((l +=
              (f = c == null ? void 0 : c.text) === null || f === void 0
                ? void 0
                : f.slice(Math.max(o, d) - d, r - d)),
            (a = !1))
          : c.isBlock && !a && ((l += i), (a = !0));
    }),
    l
  );
}
function If(n) {
  return Object.fromEntries(
    Object.entries(n.nodes)
      .filter(([, e]) => e.spec.toText)
      .map(([e, t]) => [e, t.spec.toText]),
  );
}
const Zy = co.create({
    name: "clipboardTextSerializer",
    addProseMirrorPlugins() {
      return [
        new Ct({
          key: new wr("clipboardTextSerializer"),
          props: {
            clipboardTextSerializer: () => {
              const { editor: n } = this,
                { state: e, schema: t } = n,
                { doc: o, selection: r } = e,
                { ranges: i } = r,
                s = Math.min(...i.map((c) => c.$from.pos)),
                l = Math.max(...i.map((c) => c.$to.pos)),
                a = If(t);
              return Af(o, { from: s, to: l }, { textSerializers: a });
            },
          },
        }),
      ];
    },
  }),
  _y =
    () =>
    ({ editor: n, view: e }) => (
      requestAnimationFrame(() => {
        var t;
        n.isDestroyed ||
          (e.dom.blur(),
          (t = window == null ? void 0 : window.getSelection()) === null ||
            t === void 0 ||
            t.removeAllRanges());
      }),
      !0
    ),
  ek =
    (n = !1) =>
    ({ commands: e }) =>
      e.setContent("", n),
  tk =
    () =>
    ({ state: n, tr: e, dispatch: t }) => {
      const { selection: o } = e,
        { ranges: r } = o;
      return (
        t &&
          r.forEach(({ $from: i, $to: s }) => {
            n.doc.nodesBetween(i.pos, s.pos, (l, a) => {
              if (l.type.isText) return;
              const { doc: c, mapping: d } = e,
                h = c.resolve(d.map(a)),
                p = c.resolve(d.map(a + l.nodeSize)),
                f = h.blockRange(p);
              if (!f) return;
              const u = lo(f);
              if (l.type.isTextblock) {
                const { defaultType: m } = h.parent.contentMatchAt(h.index());
                e.setNodeMarkup(f.start, m);
              }
              (u || u === 0) && e.lift(f, u);
            });
          }),
        !0
      );
    },
  nk = (n) => (e) => n(e),
  ok =
    () =>
    ({ state: n, dispatch: e }) =>
      $y(n, e),
  rk =
    (n, e) =>
    ({ editor: t, tr: o }) => {
      const { state: r } = t,
        i = r.doc.slice(n.from, n.to);
      o.deleteRange(n.from, n.to);
      const s = o.mapping.map(e);
      return o.insert(s, i.content), o.setSelection(new J(o.doc.resolve(s - 1))), !0;
    },
  ik =
    () =>
    ({ tr: n, dispatch: e }) => {
      const { selection: t } = n,
        o = t.$anchor.node();
      if (o.content.size > 0) return !1;
      const r = n.selection.$anchor;
      for (let i = r.depth; i > 0; i -= 1)
        if (r.node(i).type === o.type) {
          if (e) {
            const s = r.before(i),
              l = r.after(i);
            n.delete(s, l).scrollIntoView();
          }
          return !0;
        }
      return !1;
    },
  sk =
    (n) =>
    ({ tr: e, state: t, dispatch: o }) => {
      const r = ee(n, t.schema),
        i = e.selection.$anchor;
      for (let s = i.depth; s > 0; s -= 1)
        if (i.node(s).type === r) {
          if (o) {
            const l = i.before(s),
              a = i.after(s);
            e.delete(l, a).scrollIntoView();
          }
          return !0;
        }
      return !1;
    },
  lk =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      const { from: o, to: r } = n;
      return t && e.delete(o, r), !0;
    },
  ak =
    () =>
    ({ state: n, dispatch: e }) =>
      py(n, e),
  ck =
    () =>
    ({ commands: n }) =>
      n.keyboardShortcut("Enter"),
  dk =
    () =>
    ({ state: n, dispatch: e }) =>
      Sy(n, e);
function ki(n, e, t = { strict: !0 }) {
  const o = Object.keys(e);
  return o.length
    ? o.every((r) => (t.strict ? e[r] === n[r] : Ra(e[r]) ? e[r].test(n[r]) : e[r] === n[r]))
    : !0;
}
function Rl(n, e, t = {}) {
  return n.find((o) => o.type === e && ki(o.attrs, t));
}
function hk(n, e, t = {}) {
  return !!Rl(n, e, t);
}
function Df(n, e, t = {}) {
  if (!n || !e) return;
  let o = n.parent.childAfter(n.parentOffset);
  if (
    (n.parentOffset === o.offset && o.offset !== 0 && (o = n.parent.childBefore(n.parentOffset)),
    !o.node)
  )
    return;
  const r = Rl([...o.node.marks], e, t);
  if (!r) return;
  let i = o.index,
    s = n.start() + o.offset,
    l = i + 1,
    a = s + o.node.nodeSize;
  for (Rl([...o.node.marks], e, t); i > 0 && r.isInSet(n.parent.child(i - 1).marks); )
    (i -= 1), (s -= n.parent.child(i).nodeSize);
  for (; l < n.parent.childCount && hk([...n.parent.child(l).marks], e, t); )
    (a += n.parent.child(l).nodeSize), (l += 1);
  return { from: s, to: a };
}
function Nt(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
const pk =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      const i = Nt(n, o.schema),
        { doc: s, selection: l } = t,
        { $from: a, from: c, to: d } = l;
      if (r) {
        const h = Df(a, i, e);
        if (h && h.from <= c && h.to >= d) {
          const p = J.create(s, h.from, h.to);
          t.setSelection(p);
        }
      }
      return !0;
    },
  fk = (n) => (e) => {
    const t = typeof n == "function" ? n(e) : n;
    for (let o = 0; o < t.length; o += 1) if (t[o](e)) return !0;
    return !1;
  };
function Rf(n) {
  return n instanceof J;
}
function jt(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function zf(n, e = null) {
  if (!e) return null;
  const t = P.atStart(n),
    o = P.atEnd(n);
  if (e === "start" || e === !0) return t;
  if (e === "end") return o;
  const r = t.from,
    i = o.to;
  return e === "all"
    ? J.create(n, jt(0, r, i), jt(n.content.size, r, i))
    : J.create(n, jt(e, r, i), jt(e, r, i));
}
function Pa() {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
      navigator.platform,
    ) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}
const uk =
    (n = null, e = {}) =>
    ({ editor: t, view: o, tr: r, dispatch: i }) => {
      e = { scrollIntoView: !0, ...e };
      const s = () => {
        Pa() && o.dom.focus(),
          requestAnimationFrame(() => {
            t.isDestroyed ||
              (o.focus(), e != null && e.scrollIntoView && t.commands.scrollIntoView());
          });
      };
      if ((o.hasFocus() && n === null) || n === !1) return !0;
      if (i && n === null && !Rf(t.state.selection)) return s(), !0;
      const l = zf(r.doc, n) || t.state.selection,
        a = t.state.selection.eq(l);
      return (
        i && (a || r.setSelection(l), a && r.storedMarks && r.setStoredMarks(r.storedMarks), s()),
        !0
      );
    },
  mk = (n, e) => (t) => n.every((o, r) => e(o, { ...t, index: r })),
  gk =
    (n, e) =>
    ({ tr: t, commands: o }) =>
      o.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e),
  Pf = (n) => {
    const e = n.childNodes;
    for (let t = e.length - 1; t >= 0; t -= 1) {
      const o = e[t];
      o.nodeType === 3 && o.nodeValue && /^(\n\s\s|\n)$/.test(o.nodeValue)
        ? n.removeChild(o)
        : o.nodeType === 1 && Pf(o);
    }
    return n;
  };
function Cd(n) {
  const e = `<body>${n}</body>`,
    t = new window.DOMParser().parseFromString(e, "text/html").body;
  return Pf(t);
}
function wi(n, e, t) {
  if (((t = { slice: !0, parseOptions: {}, ...t }), typeof n == "object" && n !== null))
    try {
      return Array.isArray(n) && n.length > 0
        ? k.fromArray(n.map((o) => e.nodeFromJSON(o)))
        : e.nodeFromJSON(n);
    } catch (o) {
      return (
        console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", o),
        wi("", e, t)
      );
    }
  if (typeof n == "string") {
    const o = ba.fromSchema(e);
    return t.slice ? o.parseSlice(Cd(n), t.parseOptions).content : o.parse(Cd(n), t.parseOptions);
  }
  return wi("", e, t);
}
function yk(n, e, t) {
  const o = n.steps.length - 1;
  if (o < e) return;
  const r = n.steps[o];
  if (!(r instanceof Z || r instanceof Te)) return;
  const i = n.mapping.maps[o];
  let s = 0;
  i.forEach((l, a, c, d) => {
    s === 0 && (s = d);
  }),
    n.setSelection(P.near(n.doc.resolve(s), t));
}
const kk = (n) => n.toString().startsWith("<"),
  wk =
    (n, e, t) =>
    ({ tr: o, dispatch: r, editor: i }) => {
      if (r) {
        t = { parseOptions: {}, updateSelection: !0, ...t };
        const s = wi(e, i.schema, {
          parseOptions: { preserveWhitespace: "full", ...t.parseOptions },
        });
        if (s.toString() === "<>") return !0;
        let { from: l, to: a } =
            typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to },
          c = !0,
          d = !0;
        if (
          ((kk(s) ? s : [s]).forEach((h) => {
            h.check(), (c = c ? h.isText && h.marks.length === 0 : !1), (d = d ? h.isBlock : !1);
          }),
          l === a && d)
        ) {
          const { parent: h } = o.doc.resolve(l);
          h.isTextblock && !h.type.spec.code && !h.childCount && ((l -= 1), (a += 1));
        }
        c
          ? Array.isArray(e)
            ? o.insertText(e.map((h) => h.text || "").join(""), l, a)
            : typeof e == "object" && e && e.text
              ? o.insertText(e.text, l, a)
              : o.insertText(e, l, a)
          : o.replaceWith(l, a, s),
          t.updateSelection && yk(o, o.steps.length - 1, -1);
      }
      return !0;
    },
  bk =
    () =>
    ({ state: n, dispatch: e }) =>
      wy(n, e),
  vk =
    () =>
    ({ state: n, dispatch: e }) =>
      by(n, e),
  xk =
    () =>
    ({ state: n, dispatch: e }) =>
      fy(n, e),
  Sk =
    () =>
    ({ state: n, dispatch: e }) =>
      yy(n, e),
  $k =
    () =>
    ({ tr: n, state: e, dispatch: t }) => {
      try {
        const o = Ki(e.doc, e.selection.$from.pos, -1);
        return o == null ? !1 : (n.join(o, 2), t && t(n), !0);
      } catch {
        return !1;
      }
    },
  Mk =
    () =>
    ({ state: n, dispatch: e, tr: t }) => {
      try {
        const o = Ki(n.doc, n.selection.$from.pos, 1);
        return o == null ? !1 : (t.join(o, 2), e && e(t), !0);
      } catch {
        return !1;
      }
    },
  Ck =
    () =>
    ({ state: n, dispatch: e }) =>
      uy(n, e),
  Ok =
    () =>
    ({ state: n, dispatch: e }) =>
      my(n, e);
function Bf() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Nk(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let o, r, i, s;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a)) s = !0;
    else if (/^a(lt)?$/i.test(a)) o = !0;
    else if (/^(c|ctrl|control)$/i.test(a)) r = !0;
    else if (/^s(hift)?$/i.test(a)) i = !0;
    else if (/^mod$/i.test(a)) Pa() || Bf() ? (s = !0) : (r = !0);
    else throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return (
    o && (t = `Alt-${t}`),
    r && (t = `Ctrl-${t}`),
    s && (t = `Meta-${t}`),
    i && (t = `Shift-${t}`),
    t
  );
}
const Tk =
  (n) =>
  ({ editor: e, view: t, tr: o, dispatch: r }) => {
    const i = Nk(n).split(/-(?!$)/),
      s = i.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)),
      l = new KeyboardEvent("keydown", {
        key: s === "Space" ? " " : s,
        altKey: i.includes("Alt"),
        ctrlKey: i.includes("Ctrl"),
        metaKey: i.includes("Meta"),
        shiftKey: i.includes("Shift"),
        bubbles: !0,
        cancelable: !0,
      }),
      a = e.captureTransaction(() => {
        t.someProp("handleKeyDown", (c) => c(t, l));
      });
    return (
      a == null ||
        a.steps.forEach((c) => {
          const d = c.map(o.mapping);
          d && r && o.maybeStep(d);
        }),
      !0
    );
  };
function sr(n, e, t = {}) {
  const { from: o, to: r, empty: i } = n.selection,
    s = e ? ee(e, n.schema) : null,
    l = [];
  n.doc.nodesBetween(o, r, (d, h) => {
    if (d.isText) return;
    const p = Math.max(o, h),
      f = Math.min(r, h + d.nodeSize);
    l.push({ node: d, from: p, to: f });
  });
  const a = r - o,
    c = l
      .filter((d) => (s ? s.name === d.node.type.name : !0))
      .filter((d) => ki(d.node.attrs, t, { strict: !1 }));
  return i ? !!c.length : c.reduce((d, h) => d + h.to - h.from, 0) >= a;
}
const Ek =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = ee(n, t.schema);
      return sr(t, r, e) ? vy(t, o) : !1;
    },
  Ak =
    () =>
    ({ state: n, dispatch: e }) =>
      My(n, e),
  Ik =
    (n) =>
    ({ state: e, dispatch: t }) => {
      const o = ee(n, e.schema);
      return Dy(o)(e, t);
    },
  Dk =
    () =>
    ({ state: n, dispatch: e }) =>
      xy(n, e);
function Qi(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Od(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((o, r) => (t.includes(r) || (o[r] = n[r]), o), {});
}
const Rk =
    (n, e) =>
    ({ tr: t, state: o, dispatch: r }) => {
      let i = null,
        s = null;
      const l = Qi(typeof n == "string" ? n : n.name, o.schema);
      return l
        ? (l === "node" && (i = ee(n, o.schema)),
          l === "mark" && (s = Nt(n, o.schema)),
          r &&
            t.selection.ranges.forEach((a) => {
              o.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, d) => {
                i && i === c.type && t.setNodeMarkup(d, void 0, Od(c.attrs, e)),
                  s &&
                    c.marks.length &&
                    c.marks.forEach((h) => {
                      s === h.type && t.addMark(d, d + c.nodeSize, s.create(Od(h.attrs, e)));
                    });
              });
            }),
          !0)
        : !1;
    },
  zk =
    () =>
    ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0),
  Pk =
    () =>
    ({ tr: n, commands: e }) =>
      e.setTextSelection({ from: 0, to: n.doc.content.size }),
  Bk =
    () =>
    ({ state: n, dispatch: e }) =>
      gy(n, e),
  Fk =
    () =>
    ({ state: n, dispatch: e }) =>
      ky(n, e),
  Vk =
    () =>
    ({ state: n, dispatch: e }) =>
      Cy(n, e),
  jk =
    () =>
    ({ state: n, dispatch: e }) =>
      Ty(n, e),
  Jk =
    () =>
    ({ state: n, dispatch: e }) =>
      Ny(n, e);
function Ff(n, e, t = {}) {
  return wi(n, e, { slice: !1, parseOptions: t });
}
const Lk =
  (n, e = !1, t = {}) =>
  ({ tr: o, editor: r, dispatch: i }) => {
    const { doc: s } = o,
      l = Ff(n, r.schema, t);
    return i && o.replaceWith(0, s.content.size, l).setMeta("preventUpdate", !e), !0;
  };
function Vf(n, e) {
  const t = Nt(e, n.schema),
    { from: o, to: r, empty: i } = n.selection,
    s = [];
  i
    ? (n.storedMarks && s.push(...n.storedMarks), s.push(...n.selection.$head.marks()))
    : n.doc.nodesBetween(o, r, (a) => {
        s.push(...a.marks);
      });
  const l = s.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function qk(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs()) return t;
  }
  return null;
}
function Kk(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const o = n.node(t);
    if (e(o)) return { pos: t > 0 ? n.before(t) : 0, start: n.start(t), depth: t, node: o };
  }
}
function Ba(n) {
  return (e) => Kk(e.$from, n);
}
function Wk(n, e) {
  const t = yr.fromSchema(e).serializeFragment(n),
    o = document.implementation.createHTMLDocument().createElement("div");
  return o.appendChild(t), o.innerHTML;
}
function Hk(n, e) {
  const t = { from: 0, to: n.content.size };
  return Af(n, t, e);
}
function Uk(n, e) {
  const t = ee(e, n.schema),
    { from: o, to: r } = n.selection,
    i = [];
  n.doc.nodesBetween(o, r, (l) => {
    i.push(l);
  });
  const s = i.reverse().find((l) => l.type.name === t.name);
  return s ? { ...s.attrs } : {};
}
function Gk(n, e) {
  const t = Qi(typeof e == "string" ? e : e.name, n.schema);
  return t === "node" ? Uk(n, e) : t === "mark" ? Vf(n, e) : {};
}
function Qr(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([o]) => {
      const r = n.find((i) => i.type === e && i.name === o);
      return r ? r.attribute.keepOnSplit : !1;
    }),
  );
}
function zl(n, e, t = {}) {
  const { empty: o, ranges: r } = n.selection,
    i = e ? Nt(e, n.schema) : null;
  if (o)
    return !!(n.storedMarks || n.selection.$from.marks())
      .filter((d) => (i ? i.name === d.type.name : !0))
      .find((d) => ki(d.attrs, t, { strict: !1 }));
  let s = 0;
  const l = [];
  if (
    (r.forEach(({ $from: d, $to: h }) => {
      const p = d.pos,
        f = h.pos;
      n.doc.nodesBetween(p, f, (u, m) => {
        if (!u.isText && !u.marks.length) return;
        const g = Math.max(p, m),
          y = Math.min(f, m + u.nodeSize),
          w = y - g;
        (s += w), l.push(...u.marks.map((b) => ({ mark: b, from: g, to: y })));
      });
    }),
    s === 0)
  )
    return !1;
  const a = l
      .filter((d) => (i ? i.name === d.mark.type.name : !0))
      .filter((d) => ki(d.mark.attrs, t, { strict: !1 }))
      .reduce((d, h) => d + h.to - h.from, 0),
    c = l
      .filter((d) => (i ? d.mark.type !== i && d.mark.type.excludes(i) : !0))
      .reduce((d, h) => d + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= s;
}
function Yk(n, e, t = {}) {
  if (!e) return sr(n, null, t) || zl(n, null, t);
  const o = Qi(e, n.schema);
  return o === "node" ? sr(n, e, t) : o === "mark" ? zl(n, e, t) : !1;
}
function Nd(n, e) {
  const { nodeExtensions: t } = Xi(e),
    o = t.find((s) => s.name === n);
  if (!o) return !1;
  const r = { name: o.name, options: o.options, storage: o.storage },
    i = L(M(o, "group", r));
  return typeof i != "string" ? !1 : i.split(" ").includes("list");
}
function Xk(n) {
  var e;
  const t = (e = n.type.createAndFill()) === null || e === void 0 ? void 0 : e.toJSON(),
    o = n.toJSON();
  return JSON.stringify(t) === JSON.stringify(o);
}
function Qk(n, e, t) {
  var o;
  const { selection: r } = e;
  let i = null;
  if ((Rf(r) && (i = r.$cursor), i)) {
    const l = (o = n.storedMarks) !== null && o !== void 0 ? o : i.marks();
    return !!t.isInSet(l) || !l.some((a) => a.type.excludes(t));
  }
  const { ranges: s } = r;
  return s.some(({ $from: l, $to: a }) => {
    let c = l.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return (
      n.doc.nodesBetween(l.pos, a.pos, (d, h, p) => {
        if (c) return !1;
        if (d.isInline) {
          const f = !p || p.type.allowsMarkType(t),
            u = !!t.isInSet(d.marks) || !d.marks.some((m) => m.type.excludes(t));
          c = f && u;
        }
        return !c;
      }),
      c
    );
  });
}
const Zk =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      const { selection: i } = t,
        { empty: s, ranges: l } = i,
        a = Nt(n, o.schema);
      if (r)
        if (s) {
          const c = Vf(o, a);
          t.addStoredMark(a.create({ ...c, ...e }));
        } else
          l.forEach((c) => {
            const d = c.$from.pos,
              h = c.$to.pos;
            o.doc.nodesBetween(d, h, (p, f) => {
              const u = Math.max(f, d),
                m = Math.min(f + p.nodeSize, h);
              p.marks.find((g) => g.type === a)
                ? p.marks.forEach((g) => {
                    a === g.type && t.addMark(u, m, a.create({ ...g.attrs, ...e }));
                  })
                : t.addMark(u, m, a.create(e));
            });
          });
      return Qk(o, t, a);
    },
  _k =
    (n, e) =>
    ({ tr: t }) => (t.setMeta(n, e), !0),
  ew =
    (n, e = {}) =>
    ({ state: t, dispatch: o, chain: r }) => {
      const i = ee(n, t.schema);
      return i.isTextblock
        ? r()
            .command(({ commands: s }) => (xd(i, e)(t) ? !0 : s.clearNodes()))
            .command(({ state: s }) => xd(i, e)(s, o))
            .run()
        : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'),
          !1);
    },
  tw =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      if (t) {
        const { doc: o } = e,
          r = jt(n, 0, o.content.size),
          i = D.create(o, r);
        e.setSelection(i);
      }
      return !0;
    },
  nw =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      if (t) {
        const { doc: o } = e,
          { from: r, to: i } = typeof n == "number" ? { from: n, to: n } : n,
          s = J.atStart(o).from,
          l = J.atEnd(o).to,
          a = jt(r, s, l),
          c = jt(i, s, l),
          d = J.create(o, a, c);
        e.setSelection(d);
      }
      return !0;
    },
  ow =
    (n) =>
    ({ state: e, dispatch: t }) => {
      const o = ee(n, e.schema);
      return Py(o)(e, t);
    };
function Td(n, e) {
  const t = n.storedMarks || (n.selection.$to.parentOffset && n.selection.$from.marks());
  if (t) {
    const o = t.filter((r) => (e == null ? void 0 : e.includes(r.type.name)));
    n.tr.ensureMarks(o);
  }
}
const rw =
    ({ keepMarks: n = !0 } = {}) =>
    ({ tr: e, state: t, dispatch: o, editor: r }) => {
      const { selection: i, doc: s } = e,
        { $from: l, $to: a } = i,
        c = r.extensionManager.attributes,
        d = Qr(c, l.node().type.name, l.node().attrs);
      if (i instanceof D && i.node.isBlock)
        return !l.parentOffset || !qn(s, l.pos)
          ? !1
          : (o && (n && Td(t, r.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()),
            !0);
      if (!l.parent.isBlock) return !1;
      if (o) {
        const h = a.parentOffset === a.parent.content.size;
        i instanceof J && e.deleteSelection();
        const p = l.depth === 0 ? void 0 : qk(l.node(-1).contentMatchAt(l.indexAfter(-1)));
        let f = h && p ? [{ type: p, attrs: d }] : void 0,
          u = qn(e.doc, e.mapping.map(l.pos), 1, f);
        if (
          (!f &&
            !u &&
            qn(e.doc, e.mapping.map(l.pos), 1, p ? [{ type: p }] : void 0) &&
            ((u = !0), (f = p ? [{ type: p, attrs: d }] : void 0)),
          u &&
            (e.split(e.mapping.map(l.pos), 1, f),
            p && !h && !l.parentOffset && l.parent.type !== p))
        ) {
          const m = e.mapping.map(l.before()),
            g = e.doc.resolve(m);
          l.node(-1).canReplaceWith(g.index(), g.index() + 1, p) &&
            e.setNodeMarkup(e.mapping.map(l.before()), p);
        }
        n && Td(t, r.extensionManager.splittableMarks), e.scrollIntoView();
      }
      return !0;
    },
  iw =
    (n) =>
    ({ tr: e, state: t, dispatch: o, editor: r }) => {
      var i;
      const s = ee(n, t.schema),
        { $from: l, $to: a } = t.selection,
        c = t.selection.node;
      if ((c && c.isBlock) || l.depth < 2 || !l.sameParent(a)) return !1;
      const d = l.node(-1);
      if (d.type !== s) return !1;
      const h = r.extensionManager.attributes;
      if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
        if (l.depth === 2 || l.node(-3).type !== s || l.index(-2) !== l.node(-2).childCount - 1)
          return !1;
        if (o) {
          let g = k.empty;
          const y = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
          for (let R = l.depth - y; R >= l.depth - 3; R -= 1) g = k.from(l.node(R).copy(g));
          const w =
              l.indexAfter(-1) < l.node(-2).childCount
                ? 1
                : l.indexAfter(-2) < l.node(-3).childCount
                  ? 2
                  : 3,
            b = Qr(h, l.node().type.name, l.node().attrs),
            z =
              ((i = s.contentMatch.defaultType) === null || i === void 0
                ? void 0
                : i.createAndFill(b)) || void 0;
          g = g.append(k.from(s.createAndFill(null, z) || void 0));
          const $ = l.before(l.depth - (y - 1));
          e.replace($, l.after(-w), new S(g, 4 - y, 0));
          let N = -1;
          e.doc.nodesBetween($, e.doc.content.size, (R, G) => {
            if (N > -1) return !1;
            R.isTextblock && R.content.size === 0 && (N = G + 1);
          }),
            N > -1 && e.setSelection(J.near(e.doc.resolve(N))),
            e.scrollIntoView();
        }
        return !0;
      }
      const p = a.pos === l.end() ? d.contentMatchAt(0).defaultType : null,
        f = Qr(h, d.type.name, d.attrs),
        u = Qr(h, l.node().type.name, l.node().attrs);
      e.delete(l.pos, a.pos);
      const m = p
        ? [
            { type: s, attrs: f },
            { type: p, attrs: u },
          ]
        : [{ type: s, attrs: f }];
      if (!qn(e.doc, l.pos, 2)) return !1;
      if (o) {
        const { selection: g, storedMarks: y } = t,
          { splittableMarks: w } = r.extensionManager,
          b = y || (g.$to.parentOffset && g.$from.marks());
        if ((e.split(l.pos, 2, m).scrollIntoView(), !b || !o)) return !0;
        const z = b.filter(($) => w.includes($.type.name));
        e.ensureMarks(z);
      }
      return !0;
    },
  Ns = (n, e) => {
    const t = Ba((i) => i.type === e)(n.selection);
    if (!t) return !0;
    const o = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
    if (o === void 0) return !0;
    const r = n.doc.nodeAt(o);
    return t.node.type === (r == null ? void 0 : r.type) && un(n.doc, t.pos) && n.join(t.pos), !0;
  },
  Ts = (n, e) => {
    const t = Ba((i) => i.type === e)(n.selection);
    if (!t) return !0;
    const o = n.doc.resolve(t.start).after(t.depth);
    if (o === void 0) return !0;
    const r = n.doc.nodeAt(o);
    return t.node.type === (r == null ? void 0 : r.type) && un(n.doc, o) && n.join(o), !0;
  },
  sw =
    (n, e, t, o = {}) =>
    ({ editor: r, tr: i, state: s, dispatch: l, chain: a, commands: c, can: d }) => {
      const { extensions: h, splittableMarks: p } = r.extensionManager,
        f = ee(n, s.schema),
        u = ee(e, s.schema),
        { selection: m, storedMarks: g } = s,
        { $from: y, $to: w } = m,
        b = y.blockRange(w),
        z = g || (m.$to.parentOffset && m.$from.marks());
      if (!b) return !1;
      const $ = Ba((N) => Nd(N.type.name, h))(m);
      if (b.depth >= 1 && $ && b.depth - $.depth <= 1) {
        if ($.node.type === f) return c.liftListItem(u);
        if (Nd($.node.type.name, h) && f.validContent($.node.content) && l)
          return a()
            .command(() => (i.setNodeMarkup($.pos, f), !0))
            .command(() => Ns(i, f))
            .command(() => Ts(i, f))
            .run();
      }
      return !t || !z || !l
        ? a()
            .command(() => (d().wrapInList(f, o) ? !0 : c.clearNodes()))
            .wrapInList(f, o)
            .command(() => Ns(i, f))
            .command(() => Ts(i, f))
            .run()
        : a()
            .command(() => {
              const N = d().wrapInList(f, o),
                R = z.filter((G) => p.includes(G.type.name));
              return i.ensureMarks(R), N ? !0 : c.clearNodes();
            })
            .wrapInList(f, o)
            .command(() => Ns(i, f))
            .command(() => Ts(i, f))
            .run();
    },
  lw =
    (n, e = {}, t = {}) =>
    ({ state: o, commands: r }) => {
      const { extendEmptyMarkRange: i = !1 } = t,
        s = Nt(n, o.schema);
      return zl(o, s, e) ? r.unsetMark(s, { extendEmptyMarkRange: i }) : r.setMark(s, e);
    },
  aw =
    (n, e, t = {}) =>
    ({ state: o, commands: r }) => {
      const i = ee(n, o.schema),
        s = ee(e, o.schema);
      return sr(o, i, t) ? r.setNode(s) : r.setNode(i, t);
    },
  cw =
    (n, e = {}) =>
    ({ state: t, commands: o }) => {
      const r = ee(n, t.schema);
      return sr(t, r, e) ? o.lift(r) : o.wrapIn(r, e);
    },
  dw =
    () =>
    ({ state: n, dispatch: e }) => {
      const t = n.plugins;
      for (let o = 0; o < t.length; o += 1) {
        const r = t[o];
        let i;
        if (r.spec.isInputRules && (i = r.getState(n))) {
          if (e) {
            const s = n.tr,
              l = i.transform;
            for (let a = l.steps.length - 1; a >= 0; a -= 1) s.step(l.steps[a].invert(l.docs[a]));
            if (i.text) {
              const a = s.doc.resolve(i.from).marks();
              s.replaceWith(i.from, i.to, n.schema.text(i.text, a));
            } else s.delete(i.from, i.to);
          }
          return !0;
        }
      }
      return !1;
    },
  hw =
    () =>
    ({ tr: n, dispatch: e }) => {
      const { selection: t } = n,
        { empty: o, ranges: r } = t;
      return (
        o ||
          (e &&
            r.forEach((i) => {
              n.removeMark(i.$from.pos, i.$to.pos);
            })),
        !0
      );
    },
  pw =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      var i;
      const { extendEmptyMarkRange: s = !1 } = e,
        { selection: l } = t,
        a = Nt(n, o.schema),
        { $from: c, empty: d, ranges: h } = l;
      if (!r) return !0;
      if (d && s) {
        let { from: p, to: f } = l;
        const u =
            (i = c.marks().find((g) => g.type === a)) === null || i === void 0 ? void 0 : i.attrs,
          m = Df(c, a, u);
        m && ((p = m.from), (f = m.to)), t.removeMark(p, f, a);
      } else
        h.forEach((p) => {
          t.removeMark(p.$from.pos, p.$to.pos, a);
        });
      return t.removeStoredMark(a), !0;
    },
  fw =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      let i = null,
        s = null;
      const l = Qi(typeof n == "string" ? n : n.name, o.schema);
      return l
        ? (l === "node" && (i = ee(n, o.schema)),
          l === "mark" && (s = Nt(n, o.schema)),
          r &&
            t.selection.ranges.forEach((a) => {
              const c = a.$from.pos,
                d = a.$to.pos;
              o.doc.nodesBetween(c, d, (h, p) => {
                i && i === h.type && t.setNodeMarkup(p, void 0, { ...h.attrs, ...e }),
                  s &&
                    h.marks.length &&
                    h.marks.forEach((f) => {
                      if (s === f.type) {
                        const u = Math.max(p, c),
                          m = Math.min(p + h.nodeSize, d);
                        t.addMark(u, m, s.create({ ...f.attrs, ...e }));
                      }
                    });
              });
            }),
          !0)
        : !1;
    },
  uw =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = ee(n, t.schema);
      return Ey(r, e)(t, o);
    },
  mw =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = ee(n, t.schema);
      return Ay(r, e)(t, o);
    };
var gw = Object.freeze({
  __proto__: null,
  blur: _y,
  clearContent: ek,
  clearNodes: tk,
  command: nk,
  createParagraphNear: ok,
  cut: rk,
  deleteCurrentNode: ik,
  deleteNode: sk,
  deleteRange: lk,
  deleteSelection: ak,
  enter: ck,
  exitCode: dk,
  extendMarkRange: pk,
  first: fk,
  focus: uk,
  forEach: mk,
  insertContent: gk,
  insertContentAt: wk,
  joinUp: bk,
  joinDown: vk,
  joinBackward: xk,
  joinForward: Sk,
  joinItemBackward: $k,
  joinItemForward: Mk,
  joinTextblockBackward: Ck,
  joinTextblockForward: Ok,
  keyboardShortcut: Tk,
  lift: Ek,
  liftEmptyBlock: Ak,
  liftListItem: Ik,
  newlineInCode: Dk,
  resetAttributes: Rk,
  scrollIntoView: zk,
  selectAll: Pk,
  selectNodeBackward: Bk,
  selectNodeForward: Fk,
  selectParentNode: Vk,
  selectTextblockEnd: jk,
  selectTextblockStart: Jk,
  setContent: Lk,
  setMark: Zk,
  setMeta: _k,
  setNode: ew,
  setNodeSelection: tw,
  setTextSelection: nw,
  sinkListItem: ow,
  splitBlock: rw,
  splitListItem: iw,
  toggleList: sw,
  toggleMark: lw,
  toggleNode: aw,
  toggleWrap: cw,
  undoInputRule: dw,
  unsetAllMarks: hw,
  unsetMark: pw,
  updateAttributes: fw,
  wrapIn: uw,
  wrapInList: mw,
});
const yw = co.create({
    name: "commands",
    addCommands() {
      return { ...gw };
    },
  }),
  kw = co.create({
    name: "editable",
    addProseMirrorPlugins() {
      return [
        new Ct({
          key: new wr("editable"),
          props: { editable: () => this.editor.options.editable },
        }),
      ];
    },
  }),
  ww = co.create({
    name: "focusEvents",
    addProseMirrorPlugins() {
      const { editor: n } = this;
      return [
        new Ct({
          key: new wr("focusEvents"),
          props: {
            handleDOMEvents: {
              focus: (e, t) => {
                n.isFocused = !0;
                const o = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
                return e.dispatch(o), !1;
              },
              blur: (e, t) => {
                n.isFocused = !1;
                const o = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
                return e.dispatch(o), !1;
              },
            },
          },
        }),
      ];
    },
  }),
  bw = co.create({
    name: "keymap",
    addKeyboardShortcuts() {
      const n = () =>
          this.editor.commands.first(({ commands: i }) => [
            () => i.undoInputRule(),
            () =>
              i.command(({ tr: s }) => {
                const { selection: l, doc: a } = s,
                  { empty: c, $anchor: d } = l,
                  { pos: h, parent: p } = d,
                  f = d.parent.isTextblock ? s.doc.resolve(h - 1) : d,
                  u = f.parent.type.spec.isolating,
                  m = d.pos - d.parentOffset,
                  g = u && f.parent.childCount === 1 ? m === d.pos : P.atStart(a).from === h;
                return !c || !g || !p.type.isTextblock || p.textContent.length
                  ? !1
                  : i.clearNodes();
              }),
            () => i.deleteSelection(),
            () => i.joinBackward(),
            () => i.selectNodeBackward(),
          ]),
        e = () =>
          this.editor.commands.first(({ commands: i }) => [
            () => i.deleteSelection(),
            () => i.deleteCurrentNode(),
            () => i.joinForward(),
            () => i.selectNodeForward(),
          ]),
        t = {
          Enter: () =>
            this.editor.commands.first(({ commands: i }) => [
              () => i.newlineInCode(),
              () => i.createParagraphNear(),
              () => i.liftEmptyBlock(),
              () => i.splitBlock(),
            ]),
          "Mod-Enter": () => this.editor.commands.exitCode(),
          Backspace: n,
          "Mod-Backspace": n,
          "Shift-Backspace": n,
          Delete: e,
          "Mod-Delete": e,
          "Mod-a": () => this.editor.commands.selectAll(),
        },
        o = { ...t },
        r = {
          ...t,
          "Ctrl-h": n,
          "Alt-Backspace": n,
          "Ctrl-d": e,
          "Ctrl-Alt-Backspace": e,
          "Alt-Delete": e,
          "Alt-d": e,
          "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
          "Ctrl-e": () => this.editor.commands.selectTextblockEnd(),
        };
      return Pa() || Bf() ? r : o;
    },
    addProseMirrorPlugins() {
      return [
        new Ct({
          key: new wr("clearDocument"),
          appendTransaction: (n, e, t) => {
            if (!(n.some((h) => h.docChanged) && !e.doc.eq(t.doc))) return;
            const { empty: o, from: r, to: i } = e.selection,
              s = P.atStart(e.doc).from,
              l = P.atEnd(e.doc).to;
            if (
              o ||
              !(r === s && i === l) ||
              t.doc.textBetween(0, t.doc.content.size, " ", " ").length !== 0
            )
              return;
            const a = t.tr,
              c = Gi({ state: t, transaction: a }),
              { commands: d } = new Yi({ editor: this.editor, state: c });
            if ((d.clearNodes(), !!a.steps.length)) return a;
          },
        }),
      ];
    },
  }),
  vw = co.create({
    name: "tabindex",
    addProseMirrorPlugins() {
      return [
        new Ct({
          key: new wr("tabindex"),
          props: { attributes: this.editor.isEditable ? { tabindex: "0" } : {} },
        }),
      ];
    },
  });
var xw = Object.freeze({
  __proto__: null,
  ClipboardTextSerializer: Zy,
  Commands: yw,
  Editable: kw,
  FocusEvents: ww,
  Keymap: bw,
  Tabindex: vw,
});
let Sw = class Dn {
  constructor(e, t, o = !1, r = null) {
    (this.currentNode = null),
      (this.actualDepth = null),
      (this.isBlock = o),
      (this.resolvedPos = e),
      (this.editor = t),
      (this.currentNode = r);
  }
  get name() {
    return this.node.type.name;
  }
  get node() {
    return this.currentNode || this.resolvedPos.node();
  }
  get element() {
    return this.editor.view.domAtPos(this.pos).node;
  }
  get depth() {
    var e;
    return (e = this.actualDepth) !== null && e !== void 0 ? e : this.resolvedPos.depth;
  }
  get pos() {
    return this.resolvedPos.pos;
  }
  get content() {
    return this.node.content;
  }
  set content(e) {
    let t = this.from,
      o = this.to;
    if (this.isBlock) {
      if (this.content.size === 0) {
        console.error(
          `You can’t set content on a block node. Tried to set content on ${this.name} at ${this.pos}`,
        );
        return;
      }
      (t = this.from + 1), (o = this.to - 1);
    }
    this.editor.commands.insertContentAt({ from: t, to: o }, e);
  }
  get attributes() {
    return this.node.attrs;
  }
  get textContent() {
    return this.node.textContent;
  }
  get size() {
    return this.node.nodeSize;
  }
  get from() {
    return this.isBlock ? this.pos : this.resolvedPos.start(this.resolvedPos.depth);
  }
  get range() {
    return { from: this.from, to: this.to };
  }
  get to() {
    return this.isBlock
      ? this.pos + this.size
      : this.resolvedPos.end(this.resolvedPos.depth) + (this.node.isText ? 0 : 1);
  }
  get parent() {
    if (this.depth === 0) return null;
    const e = this.resolvedPos.start(this.resolvedPos.depth - 1),
      t = this.resolvedPos.doc.resolve(e);
    return new Dn(t, this.editor);
  }
  get before() {
    let e = this.resolvedPos.doc.resolve(this.from - (this.isBlock ? 1 : 2));
    return (
      e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.from - 3)),
      new Dn(e, this.editor)
    );
  }
  get after() {
    let e = this.resolvedPos.doc.resolve(this.to + (this.isBlock ? 2 : 1));
    return (
      e.depth !== this.depth && (e = this.resolvedPos.doc.resolve(this.to + 3)),
      new Dn(e, this.editor)
    );
  }
  get children() {
    const e = [];
    return (
      this.node.content.forEach((t, o) => {
        const r = t.isBlock && !t.isTextblock,
          i = this.pos + o + (r ? 0 : 1),
          s = this.resolvedPos.doc.resolve(i);
        if (!r && s.depth <= this.depth) return;
        const l = new Dn(s, this.editor, r, r ? t : null);
        r && (l.actualDepth = this.depth + 1), e.push(new Dn(s, this.editor, r, r ? t : null));
      }),
      e
    );
  }
  get firstChild() {
    return this.children[0] || null;
  }
  get lastChild() {
    const e = this.children;
    return e[e.length - 1] || null;
  }
  closest(e, t = {}) {
    let o = null,
      r = this.parent;
    for (; r && !o; ) {
      if (r.node.type.name === e)
        if (Object.keys(t).length > 0) {
          const i = r.node.attrs,
            s = Object.keys(t);
          for (let l = 0; l < s.length; l += 1) {
            const a = s[l];
            if (i[a] !== t[a]) break;
          }
        } else o = r;
      r = r.parent;
    }
    return o;
  }
  querySelector(e, t = {}) {
    return this.querySelectorAll(e, t, !0)[0] || null;
  }
  querySelectorAll(e, t = {}, o = !1) {
    let r = [];
    return (
      this.isBlock ||
        !this.children ||
        this.children.length === 0 ||
        this.children.forEach((i) => {
          if (i.node.type.name === e) {
            if (Object.keys(t).length > 0) {
              const s = i.node.attrs,
                l = Object.keys(t);
              for (let a = 0; a < l.length; a += 1) {
                const c = l[a];
                if (s[c] !== t[c]) return;
              }
            }
            if ((r.push(i), o)) return;
          }
          r = r.concat(i.querySelectorAll(e));
        }),
      r
    );
  }
  setAttribute(e) {
    const t = this.editor.state.selection;
    this.editor
      .chain()
      .setTextSelection(this.from)
      .updateAttributes(this.node.type.name, e)
      .setTextSelection(t.from)
      .run();
  }
};
const $w = `.ProseMirror {
  position: relative;
}

.ProseMirror {
  word-wrap: break-word;
  white-space: pre-wrap;
  white-space: break-spaces;
  -webkit-font-variant-ligatures: none;
  font-variant-ligatures: none;
  font-feature-settings: "liga" 0; /* the above doesn't seem to work in Edge */
}

.ProseMirror [contenteditable="false"] {
  white-space: normal;
}

.ProseMirror [contenteditable="false"] [contenteditable="true"] {
  white-space: pre-wrap;
}

.ProseMirror pre {
  white-space: pre-wrap;
}

img.ProseMirror-separator {
  display: inline !important;
  border: none !important;
  margin: 0 !important;
  width: 1px !important;
  height: 1px !important;
}

.ProseMirror-gapcursor {
  display: none;
  pointer-events: none;
  position: absolute;
  margin: 0;
}

.ProseMirror-gapcursor:after {
  content: "";
  display: block;
  position: absolute;
  top: -2px;
  width: 20px;
  border-top: 1px solid black;
  animation: ProseMirror-cursor-blink 1.1s steps(2, start) infinite;
}

@keyframes ProseMirror-cursor-blink {
  to {
    visibility: hidden;
  }
}

.ProseMirror-hideselection *::selection {
  background: transparent;
}

.ProseMirror-hideselection *::-moz-selection {
  background: transparent;
}

.ProseMirror-hideselection * {
  caret-color: transparent;
}

.ProseMirror-focused .ProseMirror-gapcursor {
  display: block;
}

.tippy-box[data-animation=fade][data-state=hidden] {
  opacity: 0
}`;
function Mw(n, e, t) {
  const o = document.querySelector(`style[data-tiptap-style${t ? `-${t}` : ""}]`);
  if (o !== null) return o;
  const r = document.createElement("style");
  return (
    e && r.setAttribute("nonce", e),
    r.setAttribute(`data-tiptap-style${t ? `-${t}` : ""}`, ""),
    (r.innerHTML = n),
    document.getElementsByTagName("head")[0].appendChild(r),
    r
  );
}
class Cw extends By {
  constructor(e = {}) {
    super(),
      (this.isFocused = !1),
      (this.extensionStorage = {}),
      (this.options = {
        element: document.createElement("div"),
        content: "",
        injectCSS: !0,
        injectNonce: void 0,
        extensions: [],
        autofocus: !1,
        editable: !0,
        editorProps: {},
        parseOptions: {},
        enableInputRules: !0,
        enablePasteRules: !0,
        enableCoreExtensions: !0,
        onBeforeCreate: () => null,
        onCreate: () => null,
        onUpdate: () => null,
        onSelectionUpdate: () => null,
        onTransaction: () => null,
        onFocus: () => null,
        onBlur: () => null,
        onDestroy: () => null,
      }),
      (this.isCapturingTransaction = !1),
      (this.capturedTransaction = null),
      this.setOptions(e),
      this.createExtensionManager(),
      this.createCommandManager(),
      this.createSchema(),
      this.on("beforeCreate", this.options.onBeforeCreate),
      this.emit("beforeCreate", { editor: this }),
      this.createView(),
      this.injectCSS(),
      this.on("create", this.options.onCreate),
      this.on("update", this.options.onUpdate),
      this.on("selectionUpdate", this.options.onSelectionUpdate),
      this.on("transaction", this.options.onTransaction),
      this.on("focus", this.options.onFocus),
      this.on("blur", this.options.onBlur),
      this.on("destroy", this.options.onDestroy),
      window.setTimeout(() => {
        this.isDestroyed ||
          (this.commands.focus(this.options.autofocus), this.emit("create", { editor: this }));
      }, 0);
  }
  get storage() {
    return this.extensionStorage;
  }
  get commands() {
    return this.commandManager.commands;
  }
  chain() {
    return this.commandManager.chain();
  }
  can() {
    return this.commandManager.can();
  }
  injectCSS() {
    this.options.injectCSS && document && (this.css = Mw($w, this.options.injectNonce));
  }
  setOptions(e = {}) {
    (this.options = { ...this.options, ...e }),
      !(!this.view || !this.state || this.isDestroyed) &&
        (this.options.editorProps && this.view.setProps(this.options.editorProps),
        this.view.updateState(this.state));
  }
  setEditable(e, t = !0) {
    this.setOptions({ editable: e }),
      t && this.emit("update", { editor: this, transaction: this.state.tr });
  }
  get isEditable() {
    return this.options.editable && this.view && this.view.editable;
  }
  get state() {
    return this.view.state;
  }
  registerPlugin(e, t) {
    const o = Ef(t) ? t(e, [...this.state.plugins]) : [...this.state.plugins, e],
      r = this.state.reconfigure({ plugins: o });
    this.view.updateState(r);
  }
  unregisterPlugin(e) {
    if (this.isDestroyed) return;
    const t = typeof e == "string" ? `${e}$` : e.key,
      o = this.state.reconfigure({
        plugins: this.state.plugins.filter((r) => !r.key.startsWith(t)),
      });
    this.view.updateState(o);
  }
  createExtensionManager() {
    const e = [
      ...(this.options.enableCoreExtensions ? Object.values(xw) : []),
      ...this.options.extensions,
    ].filter((t) => ["extension", "node", "mark"].includes(t == null ? void 0 : t.type));
    this.extensionManager = new Xy(e, this);
  }
  createCommandManager() {
    this.commandManager = new Yi({ editor: this });
  }
  createSchema() {
    this.schema = this.extensionManager.schema;
  }
  createView() {
    const e = Ff(this.options.content, this.schema, this.options.parseOptions),
      t = zf(e, this.options.autofocus);
    this.view = new ty(this.options.element, {
      ...this.options.editorProps,
      dispatchTransaction: this.dispatchTransaction.bind(this),
      state: S1.create({ doc: e, selection: t || void 0 }),
    });
    const o = this.state.reconfigure({ plugins: this.extensionManager.plugins });
    this.view.updateState(o), this.createNodeViews(), this.prependClass();
    const r = this.view.dom;
    r.editor = this;
  }
  createNodeViews() {
    this.view.setProps({ nodeViews: this.extensionManager.nodeViews });
  }
  prependClass() {
    this.view.dom.className = `tiptap ${this.view.dom.className}`;
  }
  captureTransaction(e) {
    (this.isCapturingTransaction = !0), e(), (this.isCapturingTransaction = !1);
    const t = this.capturedTransaction;
    return (this.capturedTransaction = null), t;
  }
  dispatchTransaction(e) {
    if (this.view.isDestroyed) return;
    if (this.isCapturingTransaction) {
      if (!this.capturedTransaction) {
        this.capturedTransaction = e;
        return;
      }
      e.steps.forEach((s) => {
        var l;
        return (l = this.capturedTransaction) === null || l === void 0 ? void 0 : l.step(s);
      });
      return;
    }
    const t = this.state.apply(e),
      o = !this.state.selection.eq(t.selection);
    this.view.updateState(t),
      this.emit("transaction", { editor: this, transaction: e }),
      o && this.emit("selectionUpdate", { editor: this, transaction: e });
    const r = e.getMeta("focus"),
      i = e.getMeta("blur");
    r && this.emit("focus", { editor: this, event: r.event, transaction: e }),
      i && this.emit("blur", { editor: this, event: i.event, transaction: e }),
      !(!e.docChanged || e.getMeta("preventUpdate")) &&
        this.emit("update", { editor: this, transaction: e });
  }
  getAttributes(e) {
    return Gk(this.state, e);
  }
  isActive(e, t) {
    const o = typeof e == "string" ? e : null,
      r = typeof e == "string" ? t : e;
    return Yk(this.state, o, r);
  }
  getJSON() {
    return this.state.doc.toJSON();
  }
  getHTML() {
    return Wk(this.state.doc.content, this.schema);
  }
  getText(e) {
    const {
      blockSeparator: t = `

`,
      textSerializers: o = {},
    } = e || {};
    return Hk(this.state.doc, { blockSeparator: t, textSerializers: { ...If(this.schema), ...o } });
  }
  get isEmpty() {
    return Xk(this.state.doc);
  }
  getCharacterCount() {
    return (
      console.warn(
        '[tiptap warn]: "editor.getCharacterCount()" is deprecated. Please use "editor.storage.characterCount.characters()" instead.',
      ),
      this.state.doc.content.size - 2
    );
  }
  destroy() {
    this.emit("destroy"), this.view && this.view.destroy(), this.removeAllListeners();
  }
  get isDestroyed() {
    var e;
    return !(!((e = this.view) === null || e === void 0) && e.docView);
  }
  $node(e, t) {
    var o;
    return ((o = this.$doc) === null || o === void 0 ? void 0 : o.querySelector(e, t)) || null;
  }
  $nodes(e, t) {
    var o;
    return ((o = this.$doc) === null || o === void 0 ? void 0 : o.querySelectorAll(e, t)) || null;
  }
  $pos(e) {
    const t = this.state.doc.resolve(e);
    return new Sw(t, this);
  }
  get $doc() {
    return this.$pos(0);
  }
}
let Ow = class Pl {
  constructor(e = {}) {
    (this.type = "mark"),
      (this.name = "mark"),
      (this.parent = null),
      (this.child = null),
      (this.config = { name: this.name, defaultOptions: {} }),
      (this.config = { ...this.config, ...e }),
      (this.name = this.config.name),
      e.defaultOptions &&
        Object.keys(e.defaultOptions).length > 0 &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`,
        ),
      (this.options = this.config.defaultOptions),
      this.config.addOptions && (this.options = L(M(this, "addOptions", { name: this.name }))),
      (this.storage = L(M(this, "addStorage", { name: this.name, options: this.options })) || {});
  }
  static create(e = {}) {
    return new Pl(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return (
      (t.options = za(this.options, e)),
      (t.storage = L(M(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
  extend(e = {}) {
    const t = new Pl({ ...this.config, ...e });
    return (
      (t.parent = this),
      (this.child = t),
      (t.name = e.name ? e.name : t.parent.name),
      e.defaultOptions &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`,
        ),
      (t.options = L(M(t, "addOptions", { name: t.name }))),
      (t.storage = L(M(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
  static handleExit({ editor: e, mark: t }) {
    const { tr: o } = e.state,
      r = e.state.selection.$from;
    if (r.pos === r.end()) {
      const i = r.marks();
      if (!i.find((l) => (l == null ? void 0 : l.type.name) === t.name)) return !1;
      const s = i.find((l) => (l == null ? void 0 : l.type.name) === t.name);
      return s && o.removeStoredMark(s), o.insertText(" ", r.pos), e.view.dispatch(o), !0;
    }
    return !1;
  }
};
function ge(n) {
  this.content = n;
}
ge.prototype = {
  constructor: ge,
  find: function (n) {
    for (var e = 0; e < this.content.length; e += 2) if (this.content[e] === n) return e;
    return -1;
  },
  get: function (n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  update: function (n, e, t) {
    var o = t && t != n ? this.remove(t) : this,
      r = o.find(n),
      i = o.content.slice();
    return r == -1 ? i.push(t || n, e) : ((i[r + 1] = e), t && (i[r] = t)), new ge(i);
  },
  remove: function (n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new ge(t);
  },
  addToStart: function (n, e) {
    return new ge([n, e].concat(this.remove(n).content));
  },
  addToEnd: function (n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new ge(t);
  },
  addBefore: function (n, e, t) {
    var o = this.remove(e),
      r = o.content.slice(),
      i = o.find(n);
    return r.splice(i == -1 ? r.length : i, 0, e, t), new ge(r);
  },
  forEach: function (n) {
    for (var e = 0; e < this.content.length; e += 2) n(this.content[e], this.content[e + 1]);
  },
  prepend: function (n) {
    return (n = ge.from(n)), n.size ? new ge(n.content.concat(this.subtract(n).content)) : this;
  },
  append: function (n) {
    return (n = ge.from(n)), n.size ? new ge(this.subtract(n).content.concat(n.content)) : this;
  },
  subtract: function (n) {
    var e = this;
    n = ge.from(n);
    for (var t = 0; t < n.content.length; t += 2) e = e.remove(n.content[t]);
    return e;
  },
  toObject: function () {
    var n = {};
    return (
      this.forEach(function (e, t) {
        n[e] = t;
      }),
      n
    );
  },
  get size() {
    return this.content.length >> 1;
  },
};
ge.from = function (n) {
  if (n instanceof ge) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new ge(e);
};
function jf(n, e, t) {
  for (let o = 0; ; o++) {
    if (o == n.childCount || o == e.childCount) return n.childCount == e.childCount ? null : t;
    let r = n.child(o),
      i = e.child(o);
    if (r == i) {
      t += r.nodeSize;
      continue;
    }
    if (!r.sameMarkup(i)) return t;
    if (r.isText && r.text != i.text) {
      for (let s = 0; r.text[s] == i.text[s]; s++) t++;
      return t;
    }
    if (r.content.size || i.content.size) {
      let s = jf(r.content, i.content, t + 1);
      if (s != null) return s;
    }
    t += r.nodeSize;
  }
}
function Jf(n, e, t, o) {
  for (let r = n.childCount, i = e.childCount; ; ) {
    if (r == 0 || i == 0) return r == i ? null : { a: t, b: o };
    let s = n.child(--r),
      l = e.child(--i),
      a = s.nodeSize;
    if (s == l) {
      (t -= a), (o -= a);
      continue;
    }
    if (!s.sameMarkup(l)) return { a: t, b: o };
    if (s.isText && s.text != l.text) {
      let c = 0,
        d = Math.min(s.text.length, l.text.length);
      for (; c < d && s.text[s.text.length - c - 1] == l.text[l.text.length - c - 1]; )
        c++, t--, o--;
      return { a: t, b: o };
    }
    if (s.content.size || l.content.size) {
      let c = Jf(s.content, l.content, t - 1, o - 1);
      if (c) return c;
    }
    (t -= a), (o -= a);
  }
}
class v {
  constructor(e, t) {
    if (((this.content = e), (this.size = t || 0), t == null))
      for (let o = 0; o < e.length; o++) this.size += e[o].nodeSize;
  }
  nodesBetween(e, t, o, r = 0, i) {
    for (let s = 0, l = 0; l < t; s++) {
      let a = this.content[s],
        c = l + a.nodeSize;
      if (c > e && o(a, r + l, i || null, s) !== !1 && a.content.size) {
        let d = l + 1;
        a.nodesBetween(Math.max(0, e - d), Math.min(a.content.size, t - d), o, r + d);
      }
      l = c;
    }
  }
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  textBetween(e, t, o, r) {
    let i = "",
      s = !0;
    return (
      this.nodesBetween(
        e,
        t,
        (l, a) => {
          let c = l.isText
            ? l.text.slice(Math.max(e, a) - a, t - a)
            : l.isLeaf
              ? r
                ? typeof r == "function"
                  ? r(l)
                  : r
                : l.type.spec.leafText
                  ? l.type.spec.leafText(l)
                  : ""
              : "";
          l.isBlock && ((l.isLeaf && c) || l.isTextblock) && o && (s ? (s = !1) : (i += o)),
            (i += c);
        },
        0,
      ),
      i
    );
  }
  append(e) {
    if (!e.size) return this;
    if (!this.size) return e;
    let t = this.lastChild,
      o = e.firstChild,
      r = this.content.slice(),
      i = 0;
    for (
      t.isText && t.sameMarkup(o) && ((r[r.length - 1] = t.withText(t.text + o.text)), (i = 1));
      i < e.content.length;
      i++
    )
      r.push(e.content[i]);
    return new v(r, this.size + e.size);
  }
  cut(e, t = this.size) {
    if (e == 0 && t == this.size) return this;
    let o = [],
      r = 0;
    if (t > e)
      for (let i = 0, s = 0; s < t; i++) {
        let l = this.content[i],
          a = s + l.nodeSize;
        a > e &&
          ((s < e || a > t) &&
            (l.isText
              ? (l = l.cut(Math.max(0, e - s), Math.min(l.text.length, t - s)))
              : (l = l.cut(Math.max(0, e - s - 1), Math.min(l.content.size, t - s - 1)))),
          o.push(l),
          (r += l.nodeSize)),
          (s = a);
      }
    return new v(o, r);
  }
  cutByIndex(e, t) {
    return e == t
      ? v.empty
      : e == 0 && t == this.content.length
        ? this
        : new v(this.content.slice(e, t));
  }
  replaceChild(e, t) {
    let o = this.content[e];
    if (o == t) return this;
    let r = this.content.slice(),
      i = this.size + t.nodeSize - o.nodeSize;
    return (r[e] = t), new v(r, i);
  }
  addToStart(e) {
    return new v([e].concat(this.content), this.size + e.nodeSize);
  }
  addToEnd(e) {
    return new v(this.content.concat(e), this.size + e.nodeSize);
  }
  eq(e) {
    if (this.content.length != e.content.length) return !1;
    for (let t = 0; t < this.content.length; t++) if (!this.content[t].eq(e.content[t])) return !1;
    return !0;
  }
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  get childCount() {
    return this.content.length;
  }
  child(e) {
    let t = this.content[e];
    if (!t) throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  maybeChild(e) {
    return this.content[e] || null;
  }
  forEach(e) {
    for (let t = 0, o = 0; t < this.content.length; t++) {
      let r = this.content[t];
      e(r, o, t), (o += r.nodeSize);
    }
  }
  findDiffStart(e, t = 0) {
    return jf(this, e, t);
  }
  findDiffEnd(e, t = this.size, o = e.size) {
    return Jf(this, e, t, o);
  }
  findIndex(e, t = -1) {
    if (e == 0) return Br(0, e);
    if (e == this.size) return Br(this.content.length, e);
    if (e > this.size || e < 0) throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let o = 0, r = 0; ; o++) {
      let i = this.child(o),
        s = r + i.nodeSize;
      if (s >= e) return s == e || t > 0 ? Br(o + 1, s) : Br(o, r);
      r = s;
    }
  }
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  toStringInner() {
    return this.content.join(", ");
  }
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  static fromJSON(e, t) {
    if (!t) return v.empty;
    if (!Array.isArray(t)) throw new RangeError("Invalid input for Fragment.fromJSON");
    return new v(t.map(e.nodeFromJSON));
  }
  static fromArray(e) {
    if (!e.length) return v.empty;
    let t,
      o = 0;
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      (o += i.nodeSize),
        r && i.isText && e[r - 1].sameMarkup(i)
          ? (t || (t = e.slice(0, r)),
            (t[t.length - 1] = i.withText(t[t.length - 1].text + i.text)))
          : t && t.push(i);
    }
    return new v(t || e, o);
  }
  static from(e) {
    if (!e) return v.empty;
    if (e instanceof v) return e;
    if (Array.isArray(e)) return this.fromArray(e);
    if (e.attrs) return new v([e], e.nodeSize);
    throw new RangeError(
      "Can not convert " +
        e +
        " to a Fragment" +
        (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""),
    );
  }
}
v.empty = new v([], 0);
const Es = { index: 0, offset: 0 };
function Br(n, e) {
  return (Es.index = n), (Es.offset = e), Es;
}
function Bl(n, e) {
  if (n === e) return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object")) return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t) return !1;
  if (t) {
    if (n.length != e.length) return !1;
    for (let o = 0; o < n.length; o++) if (!Bl(n[o], e[o])) return !1;
  } else {
    for (let o in n) if (!(o in e) || !Bl(n[o], e[o])) return !1;
    for (let o in e) if (!(o in n)) return !1;
  }
  return !0;
}
let Ue = class Fl {
  constructor(e, t) {
    (this.type = e), (this.attrs = t);
  }
  addToSet(e) {
    let t,
      o = !1;
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.eq(i)) return e;
      if (this.type.excludes(i.type)) t || (t = e.slice(0, r));
      else {
        if (i.type.excludes(this.type)) return e;
        !o && i.type.rank > this.type.rank && (t || (t = e.slice(0, r)), t.push(this), (o = !0)),
          t && t.push(i);
      }
    }
    return t || (t = e.slice()), o || t.push(this), t;
  }
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  isInSet(e) {
    for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
    return !1;
  }
  eq(e) {
    return this == e || (this.type == e.type && Bl(this.attrs, e.attrs));
  }
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  static fromJSON(e, t) {
    if (!t) throw new RangeError("Invalid input for Mark.fromJSON");
    let o = e.marks[t.type];
    if (!o) throw new RangeError(`There is no mark type ${t.type} in this schema`);
    return o.create(t.attrs);
  }
  static sameSet(e, t) {
    if (e == t) return !0;
    if (e.length != t.length) return !1;
    for (let o = 0; o < e.length; o++) if (!e[o].eq(t[o])) return !1;
    return !0;
  }
  static setFrom(e) {
    if (!e || (Array.isArray(e) && e.length == 0)) return Fl.none;
    if (e instanceof Fl) return [e];
    let t = e.slice();
    return t.sort((o, r) => o.type.rank - r.type.rank), t;
  }
};
Ue.none = [];
let Nw = class extends Error {},
  T = class Rn {
    constructor(e, t, o) {
      (this.content = e), (this.openStart = t), (this.openEnd = o);
    }
    get size() {
      return this.content.size - this.openStart - this.openEnd;
    }
    insertAt(e, t) {
      let o = qf(this.content, e + this.openStart, t);
      return o && new Rn(o, this.openStart, this.openEnd);
    }
    removeBetween(e, t) {
      return new Rn(
        Lf(this.content, e + this.openStart, t + this.openStart),
        this.openStart,
        this.openEnd,
      );
    }
    eq(e) {
      return (
        this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd
      );
    }
    toString() {
      return this.content + "(" + this.openStart + "," + this.openEnd + ")";
    }
    toJSON() {
      if (!this.content.size) return null;
      let e = { content: this.content.toJSON() };
      return (
        this.openStart > 0 && (e.openStart = this.openStart),
        this.openEnd > 0 && (e.openEnd = this.openEnd),
        e
      );
    }
    static fromJSON(e, t) {
      if (!t) return Rn.empty;
      let o = t.openStart || 0,
        r = t.openEnd || 0;
      if (typeof o != "number" || typeof r != "number")
        throw new RangeError("Invalid input for Slice.fromJSON");
      return new Rn(v.fromJSON(e, t.content), o, r);
    }
    static maxOpen(e, t = !0) {
      let o = 0,
        r = 0;
      for (let i = e.firstChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.firstChild)
        o++;
      for (let i = e.lastChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.lastChild)
        r++;
      return new Rn(e, o, r);
    }
  };
T.empty = new T(v.empty, 0, 0);
function Lf(n, e, t) {
  let { index: o, offset: r } = n.findIndex(e),
    i = n.maybeChild(o),
    { index: s, offset: l } = n.findIndex(t);
  if (r == e || i.isText) {
    if (l != t && !n.child(s).isText) throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (o != s) throw new RangeError("Removing non-flat range");
  return n.replaceChild(o, i.copy(Lf(i.content, e - r - 1, t - r - 1)));
}
function qf(n, e, t, o) {
  let { index: r, offset: i } = n.findIndex(e),
    s = n.maybeChild(r);
  if (i == e || s.isText)
    return o && !o.canReplace(r, r, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let l = qf(s.content, e - i - 1, t);
  return l && n.replaceChild(r, s.copy(l));
}
let Vl = class {
    constructor(e, t, o) {
      (this.$from = e), (this.$to = t), (this.depth = o);
    }
    get start() {
      return this.$from.before(this.depth + 1);
    }
    get end() {
      return this.$to.after(this.depth + 1);
    }
    get parent() {
      return this.$from.node(this.depth);
    }
    get startIndex() {
      return this.$from.index(this.depth);
    }
    get endIndex() {
      return this.$to.indexAfter(this.depth);
    }
  },
  Kf = class jl {
    constructor(e, t) {
      (this.schema = e),
        (this.rules = t),
        (this.tags = []),
        (this.styles = []),
        t.forEach((o) => {
          o.tag ? this.tags.push(o) : o.style && this.styles.push(o);
        }),
        (this.normalizeLists = !this.tags.some((o) => {
          if (!/^(ul|ol)\b/.test(o.tag) || !o.node) return !1;
          let r = e.nodes[o.node];
          return r.contentMatch.matchType(r);
        }));
    }
    parse(e, t = {}) {
      let o = new Ad(this, t, !1);
      return o.addAll(e, t.from, t.to), o.finish();
    }
    parseSlice(e, t = {}) {
      let o = new Ad(this, t, !0);
      return o.addAll(e, t.from, t.to), T.maxOpen(o.finish());
    }
    matchTag(e, t, o) {
      for (let r = o ? this.tags.indexOf(o) + 1 : 0; r < this.tags.length; r++) {
        let i = this.tags[r];
        if (
          Aw(e, i.tag) &&
          (i.namespace === void 0 || e.namespaceURI == i.namespace) &&
          (!i.context || t.matchesContext(i.context))
        ) {
          if (i.getAttrs) {
            let s = i.getAttrs(e);
            if (s === !1) continue;
            i.attrs = s || void 0;
          }
          return i;
        }
      }
    }
    matchStyle(e, t, o, r) {
      for (let i = r ? this.styles.indexOf(r) + 1 : 0; i < this.styles.length; i++) {
        let s = this.styles[i],
          l = s.style;
        if (
          !(
            l.indexOf(e) != 0 ||
            (s.context && !o.matchesContext(s.context)) ||
            (l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))
          )
        ) {
          if (s.getAttrs) {
            let a = s.getAttrs(t);
            if (a === !1) continue;
            s.attrs = a || void 0;
          }
          return s;
        }
      }
    }
    static schemaRules(e) {
      let t = [];
      function o(r) {
        let i = r.priority == null ? 50 : r.priority,
          s = 0;
        for (; s < t.length; s++) {
          let l = t[s];
          if ((l.priority == null ? 50 : l.priority) < i) break;
        }
        t.splice(s, 0, r);
      }
      for (let r in e.marks) {
        let i = e.marks[r].spec.parseDOM;
        i &&
          i.forEach((s) => {
            o((s = Id(s))), s.mark || s.ignore || s.clearMark || (s.mark = r);
          });
      }
      for (let r in e.nodes) {
        let i = e.nodes[r].spec.parseDOM;
        i &&
          i.forEach((s) => {
            o((s = Id(s))), s.node || s.ignore || s.mark || (s.node = r);
          });
      }
      return t;
    }
    static fromSchema(e) {
      return e.cached.domParser || (e.cached.domParser = new jl(e, jl.schemaRules(e)));
    }
  };
const Wf = {
    address: !0,
    article: !0,
    aside: !0,
    blockquote: !0,
    canvas: !0,
    dd: !0,
    div: !0,
    dl: !0,
    fieldset: !0,
    figcaption: !0,
    figure: !0,
    footer: !0,
    form: !0,
    h1: !0,
    h2: !0,
    h3: !0,
    h4: !0,
    h5: !0,
    h6: !0,
    header: !0,
    hgroup: !0,
    hr: !0,
    li: !0,
    noscript: !0,
    ol: !0,
    output: !0,
    p: !0,
    pre: !0,
    section: !0,
    table: !0,
    tfoot: !0,
    ul: !0,
  },
  Tw = { head: !0, noscript: !0, object: !0, script: !0, style: !0, title: !0 },
  Hf = { ol: !0, ul: !0 },
  bi = 1,
  vi = 2,
  Uo = 4;
function Ed(n, e, t) {
  return e != null
    ? (e ? bi : 0) | (e === "full" ? vi : 0)
    : n && n.whitespace == "pre"
      ? bi | vi
      : t & ~Uo;
}
let Fr = class {
    constructor(e, t, o, r, i, s, l) {
      (this.type = e),
        (this.attrs = t),
        (this.marks = o),
        (this.pendingMarks = r),
        (this.solid = i),
        (this.options = l),
        (this.content = []),
        (this.activeMarks = Ue.none),
        (this.stashMarks = []),
        (this.match = s || (l & Uo ? null : e.contentMatch));
    }
    findWrapping(e) {
      if (!this.match) {
        if (!this.type) return [];
        let t = this.type.contentMatch.fillBefore(v.from(e));
        if (t) this.match = this.type.contentMatch.matchFragment(t);
        else {
          let o = this.type.contentMatch,
            r;
          return (r = o.findWrapping(e.type)) ? ((this.match = o), r) : null;
        }
      }
      return this.match.findWrapping(e.type);
    }
    finish(e) {
      if (!(this.options & bi)) {
        let o = this.content[this.content.length - 1],
          r;
        if (o && o.isText && (r = /[ \t\r\n\u000c]+$/.exec(o.text))) {
          let i = o;
          o.text.length == r[0].length
            ? this.content.pop()
            : (this.content[this.content.length - 1] = i.withText(
                i.text.slice(0, i.text.length - r[0].length),
              ));
        }
      }
      let t = v.from(this.content);
      return (
        !e && this.match && (t = t.append(this.match.fillBefore(v.empty, !0))),
        this.type ? this.type.create(this.attrs, t, this.marks) : t
      );
    }
    popFromStashMark(e) {
      for (let t = this.stashMarks.length - 1; t >= 0; t--)
        if (e.eq(this.stashMarks[t])) return this.stashMarks.splice(t, 1)[0];
    }
    applyPending(e) {
      for (let t = 0, o = this.pendingMarks; t < o.length; t++) {
        let r = o[t];
        (this.type ? this.type.allowsMarkType(r.type) : Dw(r.type, e)) &&
          !r.isInSet(this.activeMarks) &&
          ((this.activeMarks = r.addToSet(this.activeMarks)),
          (this.pendingMarks = r.removeFromSet(this.pendingMarks)));
      }
    }
    inlineContext(e) {
      return this.type
        ? this.type.inlineContent
        : this.content.length
          ? this.content[0].isInline
          : e.parentNode && !Wf.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
    }
  },
  Ad = class {
    constructor(e, t, o) {
      (this.parser = e), (this.options = t), (this.isOpen = o), (this.open = 0);
      let r = t.topNode,
        i,
        s = Ed(null, t.preserveWhitespace, 0) | (o ? Uo : 0);
      r
        ? (i = new Fr(r.type, r.attrs, Ue.none, Ue.none, !0, t.topMatch || r.type.contentMatch, s))
        : o
          ? (i = new Fr(null, null, Ue.none, Ue.none, !0, null, s))
          : (i = new Fr(e.schema.topNodeType, null, Ue.none, Ue.none, !0, null, s)),
        (this.nodes = [i]),
        (this.find = t.findPositions),
        (this.needsBlock = !1);
    }
    get top() {
      return this.nodes[this.open];
    }
    addDOM(e) {
      e.nodeType == 3 ? this.addTextNode(e) : e.nodeType == 1 && this.addElement(e);
    }
    withStyleRules(e, t) {
      let o = e.getAttribute("style");
      if (!o) return t();
      let r = this.readStyles(Iw(o));
      if (!r) return;
      let [i, s] = r,
        l = this.top;
      for (let a = 0; a < s.length; a++) this.removePendingMark(s[a], l);
      for (let a = 0; a < i.length; a++) this.addPendingMark(i[a]);
      t();
      for (let a = 0; a < i.length; a++) this.removePendingMark(i[a], l);
      for (let a = 0; a < s.length; a++) this.addPendingMark(s[a]);
    }
    addTextNode(e) {
      let t = e.nodeValue,
        o = this.top;
      if (o.options & vi || o.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
        if (o.options & bi)
          o.options & vi
            ? (t = t.replace(
                /\r\n?/g,
                `
`,
              ))
            : (t = t.replace(/\r?\n|\r/g, " "));
        else if (
          ((t = t.replace(/[ \t\r\n\u000c]+/g, " ")),
          /^[ \t\r\n\u000c]/.test(t) && this.open == this.nodes.length - 1)
        ) {
          let r = o.content[o.content.length - 1],
            i = e.previousSibling;
          (!r || (i && i.nodeName == "BR") || (r.isText && /[ \t\r\n\u000c]$/.test(r.text))) &&
            (t = t.slice(1));
        }
        t && this.insertNode(this.parser.schema.text(t)), this.findInText(e);
      } else this.findInside(e);
    }
    addElement(e, t) {
      let o = e.nodeName.toLowerCase(),
        r;
      Hf.hasOwnProperty(o) && this.parser.normalizeLists && Ew(e);
      let i =
        (this.options.ruleFromNode && this.options.ruleFromNode(e)) ||
        (r = this.parser.matchTag(e, this, t));
      if (i ? i.ignore : Tw.hasOwnProperty(o)) this.findInside(e), this.ignoreFallback(e);
      else if (!i || i.skip || i.closeParent) {
        i && i.closeParent
          ? (this.open = Math.max(0, this.open - 1))
          : i && i.skip.nodeType && (e = i.skip);
        let s,
          l = this.top,
          a = this.needsBlock;
        if (Wf.hasOwnProperty(o))
          l.content.length && l.content[0].isInline && this.open && (this.open--, (l = this.top)),
            (s = !0),
            l.type || (this.needsBlock = !0);
        else if (!e.firstChild) {
          this.leafFallback(e);
          return;
        }
        i && i.skip ? this.addAll(e) : this.withStyleRules(e, () => this.addAll(e)),
          s && this.sync(l),
          (this.needsBlock = a);
      } else
        this.withStyleRules(e, () => {
          this.addElementByRule(e, i, i.consuming === !1 ? r : void 0);
        });
    }
    leafFallback(e) {
      e.nodeName == "BR" &&
        this.top.type &&
        this.top.type.inlineContent &&
        this.addTextNode(
          e.ownerDocument.createTextNode(`
`),
        );
    }
    ignoreFallback(e) {
      e.nodeName == "BR" &&
        (!this.top.type || !this.top.type.inlineContent) &&
        this.findPlace(this.parser.schema.text("-"));
    }
    readStyles(e) {
      let t = Ue.none,
        o = Ue.none;
      for (let r = 0; r < e.length; r += 2)
        for (let i = void 0; ; ) {
          let s = this.parser.matchStyle(e[r], e[r + 1], this, i);
          if (!s) break;
          if (s.ignore) return null;
          if (
            (s.clearMark
              ? this.top.pendingMarks.concat(this.top.activeMarks).forEach((l) => {
                  s.clearMark(l) && (o = l.addToSet(o));
                })
              : (t = this.parser.schema.marks[s.mark].create(s.attrs).addToSet(t)),
            s.consuming === !1)
          )
            i = s;
          else break;
        }
      return [t, o];
    }
    addElementByRule(e, t, o) {
      let r, i, s;
      t.node
        ? ((i = this.parser.schema.nodes[t.node]),
          i.isLeaf
            ? this.insertNode(i.create(t.attrs)) || this.leafFallback(e)
            : (r = this.enter(i, t.attrs || null, t.preserveWhitespace)))
        : ((s = this.parser.schema.marks[t.mark].create(t.attrs)), this.addPendingMark(s));
      let l = this.top;
      if (i && i.isLeaf) this.findInside(e);
      else if (o) this.addElement(e, o);
      else if (t.getContent)
        this.findInside(e), t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a));
      else {
        let a = e;
        typeof t.contentElement == "string"
          ? (a = e.querySelector(t.contentElement))
          : typeof t.contentElement == "function"
            ? (a = t.contentElement(e))
            : t.contentElement && (a = t.contentElement),
          this.findAround(e, a, !0),
          this.addAll(a);
      }
      r && this.sync(l) && this.open--, s && this.removePendingMark(s, l);
    }
    addAll(e, t, o) {
      let r = t || 0;
      for (
        let i = t ? e.childNodes[t] : e.firstChild, s = o == null ? null : e.childNodes[o];
        i != s;
        i = i.nextSibling, ++r
      )
        this.findAtPoint(e, r), this.addDOM(i);
      this.findAtPoint(e, r);
    }
    findPlace(e) {
      let t, o;
      for (let r = this.open; r >= 0; r--) {
        let i = this.nodes[r],
          s = i.findWrapping(e);
        if ((s && (!t || t.length > s.length) && ((t = s), (o = i), !s.length)) || i.solid) break;
      }
      if (!t) return !1;
      this.sync(o);
      for (let r = 0; r < t.length; r++) this.enterInner(t[r], null, !1);
      return !0;
    }
    insertNode(e) {
      if (e.isInline && this.needsBlock && !this.top.type) {
        let t = this.textblockFromContext();
        t && this.enterInner(t);
      }
      if (this.findPlace(e)) {
        this.closeExtra();
        let t = this.top;
        t.applyPending(e.type), t.match && (t.match = t.match.matchType(e.type));
        let o = t.activeMarks;
        for (let r = 0; r < e.marks.length; r++)
          (!t.type || t.type.allowsMarkType(e.marks[r].type)) && (o = e.marks[r].addToSet(o));
        return t.content.push(e.mark(o)), !0;
      }
      return !1;
    }
    enter(e, t, o) {
      let r = this.findPlace(e.create(t));
      return r && this.enterInner(e, t, !0, o), r;
    }
    enterInner(e, t = null, o = !1, r) {
      this.closeExtra();
      let i = this.top;
      i.applyPending(e), (i.match = i.match && i.match.matchType(e));
      let s = Ed(e, r, i.options);
      i.options & Uo && i.content.length == 0 && (s |= Uo),
        this.nodes.push(new Fr(e, t, i.activeMarks, i.pendingMarks, o, null, s)),
        this.open++;
    }
    closeExtra(e = !1) {
      let t = this.nodes.length - 1;
      if (t > this.open) {
        for (; t > this.open; t--) this.nodes[t - 1].content.push(this.nodes[t].finish(e));
        this.nodes.length = this.open + 1;
      }
    }
    finish() {
      return (
        (this.open = 0),
        this.closeExtra(this.isOpen),
        this.nodes[0].finish(this.isOpen || this.options.topOpen)
      );
    }
    sync(e) {
      for (let t = this.open; t >= 0; t--) if (this.nodes[t] == e) return (this.open = t), !0;
      return !1;
    }
    get currentPos() {
      this.closeExtra();
      let e = 0;
      for (let t = this.open; t >= 0; t--) {
        let o = this.nodes[t].content;
        for (let r = o.length - 1; r >= 0; r--) e += o[r].nodeSize;
        t && e++;
      }
      return e;
    }
    findAtPoint(e, t) {
      if (this.find)
        for (let o = 0; o < this.find.length; o++)
          this.find[o].node == e &&
            this.find[o].offset == t &&
            (this.find[o].pos = this.currentPos);
    }
    findInside(e) {
      if (this.find)
        for (let t = 0; t < this.find.length; t++)
          this.find[t].pos == null &&
            e.nodeType == 1 &&
            e.contains(this.find[t].node) &&
            (this.find[t].pos = this.currentPos);
    }
    findAround(e, t, o) {
      if (e != t && this.find)
        for (let r = 0; r < this.find.length; r++)
          this.find[r].pos == null &&
            e.nodeType == 1 &&
            e.contains(this.find[r].node) &&
            t.compareDocumentPosition(this.find[r].node) & (o ? 2 : 4) &&
            (this.find[r].pos = this.currentPos);
    }
    findInText(e) {
      if (this.find)
        for (let t = 0; t < this.find.length; t++)
          this.find[t].node == e &&
            (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
    }
    matchesContext(e) {
      if (e.indexOf("|") > -1) return e.split(/\s*\|\s*/).some(this.matchesContext, this);
      let t = e.split("/"),
        o = this.options.context,
        r = !this.isOpen && (!o || o.parent.type == this.nodes[0].type),
        i = -(o ? o.depth + 1 : 0) + (r ? 0 : 1),
        s = (l, a) => {
          for (; l >= 0; l--) {
            let c = t[l];
            if (c == "") {
              if (l == t.length - 1 || l == 0) continue;
              for (; a >= i; a--) if (s(l - 1, a)) return !0;
              return !1;
            } else {
              let d =
                a > 0 || (a == 0 && r)
                  ? this.nodes[a].type
                  : o && a >= i
                    ? o.node(a - i).type
                    : null;
              if (!d || (d.name != c && d.groups.indexOf(c) == -1)) return !1;
              a--;
            }
          }
          return !0;
        };
      return s(t.length - 1, this.open);
    }
    textblockFromContext() {
      let e = this.options.context;
      if (e)
        for (let t = e.depth; t >= 0; t--) {
          let o = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
          if (o && o.isTextblock && o.defaultAttrs) return o;
        }
      for (let t in this.parser.schema.nodes) {
        let o = this.parser.schema.nodes[t];
        if (o.isTextblock && o.defaultAttrs) return o;
      }
    }
    addPendingMark(e) {
      let t = Rw(e, this.top.pendingMarks);
      t && this.top.stashMarks.push(t), (this.top.pendingMarks = e.addToSet(this.top.pendingMarks));
    }
    removePendingMark(e, t) {
      for (let o = this.open; o >= 0; o--) {
        let r = this.nodes[o];
        if (r.pendingMarks.lastIndexOf(e) > -1) r.pendingMarks = e.removeFromSet(r.pendingMarks);
        else {
          r.activeMarks = e.removeFromSet(r.activeMarks);
          let i = r.popFromStashMark(e);
          i &&
            r.type &&
            r.type.allowsMarkType(i.type) &&
            (r.activeMarks = i.addToSet(r.activeMarks));
        }
        if (r == t) break;
      }
    }
  };
function Ew(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let o = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    o && Hf.hasOwnProperty(o) && t
      ? (t.appendChild(e), (e = t))
      : o == "li"
        ? (t = e)
        : o && (t = null);
  }
}
function Aw(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(
    n,
    e,
  );
}
function Iw(n) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g,
    t,
    o = [];
  for (; (t = e.exec(n)); ) o.push(t[1], t[2].trim());
  return o;
}
function Id(n) {
  let e = {};
  for (let t in n) e[t] = n[t];
  return e;
}
function Dw(n, e) {
  let t = e.schema.nodes;
  for (let o in t) {
    let r = t[o];
    if (!r.allowsMarkType(n)) continue;
    let i = [],
      s = (l) => {
        i.push(l);
        for (let a = 0; a < l.edgeCount; a++) {
          let { type: c, next: d } = l.edge(a);
          if (c == e || (i.indexOf(d) < 0 && s(d))) return !0;
        }
      };
    if (s(r.contentMatch)) return !0;
  }
}
function Rw(n, e) {
  for (let t = 0; t < e.length; t++) if (n.eq(e[t])) return e[t];
}
let Uf = class Eo {
  constructor(e, t) {
    (this.nodes = e), (this.marks = t);
  }
  serializeFragment(e, t = {}, o) {
    o || (o = As(t).createDocumentFragment());
    let r = o,
      i = [];
    return (
      e.forEach((s) => {
        if (i.length || s.marks.length) {
          let l = 0,
            a = 0;
          for (; l < i.length && a < s.marks.length; ) {
            let c = s.marks[a];
            if (!this.marks[c.type.name]) {
              a++;
              continue;
            }
            if (!c.eq(i[l][0]) || c.type.spec.spanning === !1) break;
            l++, a++;
          }
          for (; l < i.length; ) r = i.pop()[1];
          for (; a < s.marks.length; ) {
            let c = s.marks[a++],
              d = this.serializeMark(c, s.isInline, t);
            d && (i.push([c, r]), r.appendChild(d.dom), (r = d.contentDOM || d.dom));
          }
        }
        r.appendChild(this.serializeNodeInner(s, t));
      }),
      o
    );
  }
  serializeNodeInner(e, t) {
    let { dom: o, contentDOM: r } = Eo.renderSpec(As(t), this.nodes[e.type.name](e));
    if (r) {
      if (e.isLeaf) throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, r);
    }
    return o;
  }
  serializeNode(e, t = {}) {
    let o = this.serializeNodeInner(e, t);
    for (let r = e.marks.length - 1; r >= 0; r--) {
      let i = this.serializeMark(e.marks[r], e.isInline, t);
      i && ((i.contentDOM || i.dom).appendChild(o), (o = i.dom));
    }
    return o;
  }
  serializeMark(e, t, o = {}) {
    let r = this.marks[e.type.name];
    return r && Eo.renderSpec(As(o), r(e, t));
  }
  static renderSpec(e, t, o = null) {
    if (typeof t == "string") return { dom: e.createTextNode(t) };
    if (t.nodeType != null) return { dom: t };
    if (t.dom && t.dom.nodeType != null) return t;
    let r = t[0],
      i = r.indexOf(" ");
    i > 0 && ((o = r.slice(0, i)), (r = r.slice(i + 1)));
    let s,
      l = o ? e.createElementNS(o, r) : e.createElement(r),
      a = t[1],
      c = 1;
    if (a && typeof a == "object" && a.nodeType == null && !Array.isArray(a)) {
      c = 2;
      for (let d in a)
        if (a[d] != null) {
          let h = d.indexOf(" ");
          h > 0 ? l.setAttributeNS(d.slice(0, h), d.slice(h + 1), a[d]) : l.setAttribute(d, a[d]);
        }
    }
    for (let d = c; d < t.length; d++) {
      let h = t[d];
      if (h === 0) {
        if (d < t.length - 1 || d > c)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom: l, contentDOM: l };
      } else {
        let { dom: p, contentDOM: f } = Eo.renderSpec(e, h, o);
        if ((l.appendChild(p), f)) {
          if (s) throw new RangeError("Multiple content holes");
          s = f;
        }
      }
    }
    return { dom: l, contentDOM: s };
  }
  static fromSchema(e) {
    return (
      e.cached.domSerializer ||
      (e.cached.domSerializer = new Eo(this.nodesFromSchema(e), this.marksFromSchema(e)))
    );
  }
  static nodesFromSchema(e) {
    let t = Dd(e.nodes);
    return t.text || (t.text = (o) => o.text), t;
  }
  static marksFromSchema(e) {
    return Dd(e.marks);
  }
};
function Dd(n) {
  let e = {};
  for (let t in n) {
    let o = n[t].spec.toDOM;
    o && (e[t] = o);
  }
  return e;
}
function As(n) {
  return n.document || window.document;
}
const Gf = 65535,
  Yf = Math.pow(2, 16);
function zw(n, e) {
  return n + e * Yf;
}
function Rd(n) {
  return n & Gf;
}
function Pw(n) {
  return (n - (n & Gf)) / Yf;
}
const Xf = 1,
  Qf = 2,
  Zr = 4,
  Zf = 8;
let zd = class {
    constructor(e, t, o) {
      (this.pos = e), (this.delInfo = t), (this.recover = o);
    }
    get deleted() {
      return (this.delInfo & Zf) > 0;
    }
    get deletedBefore() {
      return (this.delInfo & (Xf | Zr)) > 0;
    }
    get deletedAfter() {
      return (this.delInfo & (Qf | Zr)) > 0;
    }
    get deletedAcross() {
      return (this.delInfo & Zr) > 0;
    }
  },
  hn = class zn {
    constructor(e, t = !1) {
      if (((this.ranges = e), (this.inverted = t), !e.length && zn.empty)) return zn.empty;
    }
    recover(e) {
      let t = 0,
        o = Rd(e);
      if (!this.inverted)
        for (let r = 0; r < o; r++) t += this.ranges[r * 3 + 2] - this.ranges[r * 3 + 1];
      return this.ranges[o * 3] + t + Pw(e);
    }
    mapResult(e, t = 1) {
      return this._map(e, t, !1);
    }
    map(e, t = 1) {
      return this._map(e, t, !0);
    }
    _map(e, t, o) {
      let r = 0,
        i = this.inverted ? 2 : 1,
        s = this.inverted ? 1 : 2;
      for (let l = 0; l < this.ranges.length; l += 3) {
        let a = this.ranges[l] - (this.inverted ? r : 0);
        if (a > e) break;
        let c = this.ranges[l + i],
          d = this.ranges[l + s],
          h = a + c;
        if (e <= h) {
          let p = c ? (e == a ? -1 : e == h ? 1 : t) : t,
            f = a + r + (p < 0 ? 0 : d);
          if (o) return f;
          let u = e == (t < 0 ? a : h) ? null : zw(l / 3, e - a),
            m = e == a ? Qf : e == h ? Xf : Zr;
          return (t < 0 ? e != a : e != h) && (m |= Zf), new zd(f, m, u);
        }
        r += d - c;
      }
      return o ? e + r : new zd(e + r, 0, null);
    }
    touches(e, t) {
      let o = 0,
        r = Rd(t),
        i = this.inverted ? 2 : 1,
        s = this.inverted ? 1 : 2;
      for (let l = 0; l < this.ranges.length; l += 3) {
        let a = this.ranges[l] - (this.inverted ? o : 0);
        if (a > e) break;
        let c = this.ranges[l + i],
          d = a + c;
        if (e <= d && l == r * 3) return !0;
        o += this.ranges[l + s] - c;
      }
      return !1;
    }
    forEach(e) {
      let t = this.inverted ? 2 : 1,
        o = this.inverted ? 1 : 2;
      for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
        let s = this.ranges[r],
          l = s - (this.inverted ? i : 0),
          a = s + (this.inverted ? 0 : i),
          c = this.ranges[r + t],
          d = this.ranges[r + o];
        e(l, l + c, a, a + d), (i += d - c);
      }
    }
    invert() {
      return new zn(this.ranges, !this.inverted);
    }
    toString() {
      return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
    }
    static offset(e) {
      return e == 0 ? zn.empty : new zn(e < 0 ? [0, -e, 0] : [0, 0, e]);
    }
  };
hn.empty = new hn([]);
const Is = Object.create(null);
class pe {
  getMap() {
    return hn.empty;
  }
  merge(e) {
    return null;
  }
  static fromJSON(e, t) {
    if (!t || !t.stepType) throw new RangeError("Invalid input for Step.fromJSON");
    let o = Is[t.stepType];
    if (!o) throw new RangeError(`No step type ${t.stepType} defined`);
    return o.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in Is) throw new RangeError("Duplicate use of step JSON ID " + e);
    return (Is[e] = t), (t.prototype.jsonID = e), t;
  }
}
let xe = class Ao {
  constructor(e, t) {
    (this.doc = e), (this.failed = t);
  }
  static ok(e) {
    return new Ao(e, null);
  }
  static fail(e) {
    return new Ao(null, e);
  }
  static fromReplace(e, t, o, r) {
    try {
      return Ao.ok(e.replace(t, o, r));
    } catch (i) {
      if (i instanceof Nw) return Ao.fail(i.message);
      throw i;
    }
  }
};
function Fa(n, e, t) {
  let o = [];
  for (let r = 0; r < n.childCount; r++) {
    let i = n.child(r);
    i.content.size && (i = i.copy(Fa(i.content, e, i))), i.isInline && (i = e(i, t, r)), o.push(i);
  }
  return v.fromArray(o);
}
let _f = class Io extends pe {
  constructor(e, t, o) {
    super(), (this.from = e), (this.to = t), (this.mark = o);
  }
  apply(e) {
    let t = e.slice(this.from, this.to),
      o = e.resolve(this.from),
      r = o.node(o.sharedDepth(this.to)),
      i = new T(
        Fa(
          t.content,
          (s, l) =>
            !s.isAtom || !l.type.allowsMarkType(this.mark.type)
              ? s
              : s.mark(this.mark.addToSet(s.marks)),
          r,
        ),
        t.openStart,
        t.openEnd,
      );
    return xe.fromReplace(e, this.from, this.to, i);
  }
  invert() {
    return new eu(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return (t.deleted && o.deleted) || t.pos >= o.pos ? null : new Io(t.pos, o.pos, this.mark);
  }
  merge(e) {
    return e instanceof Io && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from
      ? new Io(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark)
      : null;
  }
  toJSON() {
    return { stepType: "addMark", mark: this.mark.toJSON(), from: this.from, to: this.to };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new Io(t.from, t.to, e.markFromJSON(t.mark));
  }
};
pe.jsonID("addMark", _f);
let eu = class Do extends pe {
  constructor(e, t, o) {
    super(), (this.from = e), (this.to = t), (this.mark = o);
  }
  apply(e) {
    let t = e.slice(this.from, this.to),
      o = new T(
        Fa(t.content, (r) => r.mark(this.mark.removeFromSet(r.marks)), e),
        t.openStart,
        t.openEnd,
      );
    return xe.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new _f(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return (t.deleted && o.deleted) || t.pos >= o.pos ? null : new Do(t.pos, o.pos, this.mark);
  }
  merge(e) {
    return e instanceof Do && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from
      ? new Do(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark)
      : null;
  }
  toJSON() {
    return { stepType: "removeMark", mark: this.mark.toJSON(), from: this.from, to: this.to };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new Do(t.from, t.to, e.markFromJSON(t.mark));
  }
};
pe.jsonID("removeMark", eu);
let tu = class Ro extends pe {
  constructor(e, t) {
    super(), (this.pos = e), (this.mark = t);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return xe.fail("No node at mark step's position");
    let o = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return xe.fromReplace(e, this.pos, this.pos + 1, new T(v.from(o), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let o = this.mark.addToSet(t.marks);
      if (o.length == t.marks.length) {
        for (let r = 0; r < t.marks.length; r++)
          if (!t.marks[r].isInSet(o)) return new Ro(this.pos, t.marks[r]);
        return new Ro(this.pos, this.mark);
      }
    }
    return new nu(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Ro(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new Ro(t.pos, e.markFromJSON(t.mark));
  }
};
pe.jsonID("addNodeMark", tu);
let nu = class Jl extends pe {
  constructor(e, t) {
    super(), (this.pos = e), (this.mark = t);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return xe.fail("No node at mark step's position");
    let o = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return xe.fromReplace(e, this.pos, this.pos + 1, new T(v.from(o), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new tu(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Jl(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new Jl(t.pos, e.markFromJSON(t.mark));
  }
};
pe.jsonID("removeNodeMark", nu);
let ho = class zt extends pe {
  constructor(e, t, o, r = !1) {
    super(), (this.from = e), (this.to = t), (this.slice = o), (this.structure = r);
  }
  apply(e) {
    return this.structure && Ll(e, this.from, this.to)
      ? xe.fail("Structure replace would overwrite content")
      : xe.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new hn([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new zt(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return t.deletedAcross && o.deletedAcross
      ? null
      : new zt(t.pos, Math.max(t.pos, o.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof zt) || e.structure || this.structure) return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t =
        this.slice.size + e.slice.size == 0
          ? T.empty
          : new T(
              this.slice.content.append(e.slice.content),
              this.slice.openStart,
              e.slice.openEnd,
            );
      return new zt(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t =
        this.slice.size + e.slice.size == 0
          ? T.empty
          : new T(
              e.slice.content.append(this.slice.content),
              e.slice.openStart,
              this.slice.openEnd,
            );
      return new zt(e.from, this.to, t, this.structure);
    } else return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return (
      this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e
    );
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new zt(t.from, t.to, T.fromJSON(e, t.slice), !!t.structure);
  }
};
pe.jsonID("replace", ho);
let tt = class _r extends pe {
  constructor(e, t, o, r, i, s, l = !1) {
    super(),
      (this.from = e),
      (this.to = t),
      (this.gapFrom = o),
      (this.gapTo = r),
      (this.slice = i),
      (this.insert = s),
      (this.structure = l);
  }
  apply(e) {
    if (this.structure && (Ll(e, this.from, this.gapFrom) || Ll(e, this.gapTo, this.to)))
      return xe.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd) return xe.fail("Gap is not a flat range");
    let o = this.slice.insertAt(this.insert, t.content);
    return o ? xe.fromReplace(e, this.from, this.to, o) : xe.fail("Content does not fit in gap");
  }
  getMap() {
    return new hn([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert,
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new _r(
      this.from,
      this.from + this.slice.size + t,
      this.from + this.insert,
      this.from + this.insert + t,
      e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from),
      this.gapFrom - this.from,
      this.structure,
    );
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1),
      r = e.map(this.gapFrom, -1),
      i = e.map(this.gapTo, 1);
    return (t.deletedAcross && o.deletedAcross) || r < t.pos || i > o.pos
      ? null
      : new _r(t.pos, o.pos, r, i, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert,
    };
    return (
      this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e
    );
  }
  static fromJSON(e, t) {
    if (
      typeof t.from != "number" ||
      typeof t.to != "number" ||
      typeof t.gapFrom != "number" ||
      typeof t.gapTo != "number" ||
      typeof t.insert != "number"
    )
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new _r(
      t.from,
      t.to,
      t.gapFrom,
      t.gapTo,
      T.fromJSON(e, t.slice),
      t.insert,
      !!t.structure,
    );
  }
};
pe.jsonID("replaceAround", tt);
function Ll(n, e, t) {
  let o = n.resolve(e),
    r = t - e,
    i = o.depth;
  for (; r > 0 && i > 0 && o.indexAfter(i) == o.node(i).childCount; ) i--, r--;
  if (r > 0) {
    let s = o.node(i).maybeChild(o.indexAfter(i));
    for (; r > 0; ) {
      if (!s || s.isLeaf) return !0;
      (s = s.firstChild), r--;
    }
  }
  return !1;
}
function Bw(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function po(n) {
  let e = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let t = n.depth; ; --t) {
    let o = n.$from.node(t),
      r = n.$from.index(t),
      i = n.$to.indexAfter(t);
    if (t < n.depth && o.canReplace(r, i, e)) return t;
    if (t == 0 || o.type.spec.isolating || !Bw(o, r, i)) break;
  }
  return null;
}
function ou(n, e, t = null, o = n) {
  let r = Fw(n, e),
    i = r && Vw(o, e);
  return i ? r.map(Pd).concat({ type: e, attrs: t }).concat(i.map(Pd)) : null;
}
function Pd(n) {
  return { type: n, attrs: null };
}
function Fw(n, e) {
  let { parent: t, startIndex: o, endIndex: r } = n,
    i = t.contentMatchAt(o).findWrapping(e);
  if (!i) return null;
  let s = i.length ? i[0] : e;
  return t.canReplaceWith(o, r, s) ? i : null;
}
function Vw(n, e) {
  let { parent: t, startIndex: o, endIndex: r } = n,
    i = t.child(o),
    s = e.contentMatch.findWrapping(i.type);
  if (!s) return null;
  let l = (s.length ? s[s.length - 1] : e).contentMatch;
  for (let a = o; l && a < r; a++) l = l.matchType(t.child(a).type);
  return !l || !l.validEnd ? null : s;
}
function Hn(n, e, t = 1, o) {
  let r = n.resolve(e),
    i = r.depth - t,
    s = (o && o[o.length - 1]) || r.parent;
  if (
    i < 0 ||
    r.parent.type.spec.isolating ||
    !r.parent.canReplace(r.index(), r.parent.childCount) ||
    !s.type.validContent(r.parent.content.cutByIndex(r.index(), r.parent.childCount))
  )
    return !1;
  for (let c = r.depth - 1, d = t - 2; c > i; c--, d--) {
    let h = r.node(c),
      p = r.index(c);
    if (h.type.spec.isolating) return !1;
    let f = h.content.cutByIndex(p, h.childCount),
      u = o && o[d + 1];
    u && (f = f.replaceChild(0, u.type.create(u.attrs)));
    let m = (o && o[d]) || h;
    if (!h.canReplace(p + 1, h.childCount) || !m.type.validContent(f)) return !1;
  }
  let l = r.indexAfter(i),
    a = o && o[0];
  return r.node(i).canReplaceWith(l, l, a ? a.type : r.node(i + 1).type);
}
function mn(n, e) {
  let t = n.resolve(e),
    o = t.index();
  return ru(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(o, o + 1);
}
function ru(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function Zi(n, e, t = -1) {
  let o = n.resolve(e);
  for (let r = o.depth; ; r--) {
    let i,
      s,
      l = o.index(r);
    if (
      (r == o.depth
        ? ((i = o.nodeBefore), (s = o.nodeAfter))
        : t > 0
          ? ((i = o.node(r + 1)), l++, (s = o.node(r).maybeChild(l)))
          : ((i = o.node(r).maybeChild(l - 1)), (s = o.node(r + 1))),
      i && !i.isTextblock && ru(i, s) && o.node(r).canReplace(l, l + 1))
    )
      return e;
    if (r == 0) break;
    e = t < 0 ? o.before(r) : o.after(r);
  }
}
function jw(n, e, t) {
  let o = n.resolve(e);
  if (!t.content.size) return e;
  let r = t.content;
  for (let i = 0; i < t.openStart; i++) r = r.firstChild.content;
  for (let i = 1; i <= (t.openStart == 0 && t.size ? 2 : 1); i++)
    for (let s = o.depth; s >= 0; s--) {
      let l = s == o.depth ? 0 : o.pos <= (o.start(s + 1) + o.end(s + 1)) / 2 ? -1 : 1,
        a = o.index(s) + (l > 0 ? 1 : 0),
        c = o.node(s),
        d = !1;
      if (i == 1) d = c.canReplace(a, a, r);
      else {
        let h = c.contentMatchAt(a).findWrapping(r.firstChild.type);
        d = h && c.canReplaceWith(a, a, h[0]);
      }
      if (d) return l == 0 ? o.pos : l < 0 ? o.before(s + 1) : o.after(s + 1);
    }
  return null;
}
function Va(n, e, t = e, o = T.empty) {
  if (e == t && !o.size) return null;
  let r = n.resolve(e),
    i = n.resolve(t);
  return Jw(r, i, o) ? new ho(e, t, o) : new Lw(r, i, o).fit();
}
function Jw(n, e, t) {
  return (
    !t.openStart &&
    !t.openEnd &&
    n.start() == e.start() &&
    n.parent.canReplace(n.index(), e.index(), t.content)
  );
}
let Lw = class {
  constructor(e, t, o) {
    (this.$from = e),
      (this.$to = t),
      (this.unplaced = o),
      (this.frontier = []),
      (this.placed = v.empty);
    for (let r = 0; r <= e.depth; r++) {
      let i = e.node(r);
      this.frontier.push({ type: i.type, match: i.contentMatchAt(e.indexAfter(r)) });
    }
    for (let r = e.depth; r > 0; r--) this.placed = v.from(e.node(r).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(),
      t = this.placed.size - this.depth - this.$from.depth,
      o = this.$from,
      r = this.close(e < 0 ? this.$to : o.doc.resolve(e));
    if (!r) return null;
    let i = this.placed,
      s = o.depth,
      l = r.depth;
    for (; s && l && i.childCount == 1; ) (i = i.firstChild.content), s--, l--;
    let a = new T(i, s, l);
    return e > -1
      ? new tt(o.pos, e, this.$to.pos, this.$to.end(), a, t)
      : a.size || o.pos != this.$to.pos
        ? new ho(o.pos, r.pos, a)
        : null;
  }
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, o = 0, r = this.unplaced.openEnd; o < e; o++) {
      let i = t.firstChild;
      if ((t.childCount > 1 && (r = 0), i.type.spec.isolating && r <= o)) {
        e = o;
        break;
      }
      t = i.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let o = t == 1 ? e : this.unplaced.openStart; o >= 0; o--) {
        let r,
          i = null;
        o
          ? ((i = Ds(this.unplaced.content, o - 1).firstChild), (r = i.content))
          : (r = this.unplaced.content);
        let s = r.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l],
            d,
            h = null;
          if (
            t == 1 &&
            (s
              ? c.matchType(s.type) || (h = c.fillBefore(v.from(s), !1))
              : i && a.compatibleContent(i.type))
          )
            return { sliceDepth: o, frontierDepth: l, parent: i, inject: h };
          if (t == 2 && s && (d = c.findWrapping(s.type)))
            return { sliceDepth: o, frontierDepth: l, parent: i, wrap: d };
          if (i && c.matchType(i.type)) break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: o } = this.unplaced,
      r = Ds(e, t);
    return !r.childCount || r.firstChild.isLeaf
      ? !1
      : ((this.unplaced = new T(e, t + 1, Math.max(o, r.size + t >= e.size - o ? t + 1 : 0))), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: o } = this.unplaced,
      r = Ds(e, t);
    if (r.childCount <= 1 && t > 0) {
      let i = e.size - t <= t + r.size;
      this.unplaced = new T(zo(e, t - 1, 1), t - 1, i ? t - 1 : o);
    } else this.unplaced = new T(zo(e, t, 1), t, o);
  }
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: o, inject: r, wrap: i }) {
    for (; this.depth > t; ) this.closeFrontierNode();
    if (i) for (let m = 0; m < i.length; m++) this.openFrontierNode(i[m]);
    let s = this.unplaced,
      l = o ? o.content : s.content,
      a = s.openStart - e,
      c = 0,
      d = [],
      { match: h, type: p } = this.frontier[t];
    if (r) {
      for (let m = 0; m < r.childCount; m++) d.push(r.child(m));
      h = h.matchFragment(r);
    }
    let f = l.size + e - (s.content.size - s.openEnd);
    for (; c < l.childCount; ) {
      let m = l.child(c),
        g = h.matchType(m.type);
      if (!g) break;
      c++,
        (c > 1 || a == 0 || m.content.size) &&
          ((h = g),
          d.push(iu(m.mark(p.allowedMarks(m.marks)), c == 1 ? a : 0, c == l.childCount ? f : -1)));
    }
    let u = c == l.childCount;
    u || (f = -1),
      (this.placed = Po(this.placed, t, v.from(d))),
      (this.frontier[t].match = h),
      u &&
        f < 0 &&
        o &&
        o.type == this.frontier[this.depth].type &&
        this.frontier.length > 1 &&
        this.closeFrontierNode();
    for (let m = 0, g = l; m < f; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), (g = y.content);
    }
    this.unplaced = u
      ? e == 0
        ? T.empty
        : new T(zo(s.content, e - 1, 1), e - 1, f < 0 ? s.openEnd : e - 1)
      : new T(zo(s.content, e, c), s.openStart, s.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock) return -1;
    let e = this.frontier[this.depth],
      t;
    if (
      !e.type.isTextblock ||
      !Rs(this.$to, this.$to.depth, e.type, e.match, !1) ||
      (this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
    )
      return -1;
    let { depth: o } = this.$to,
      r = this.$to.after(o);
    for (; o > 1 && r == this.$to.end(--o); ) ++r;
    return r;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: o, type: r } = this.frontier[t],
        i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)),
        s = Rs(e, t, r, o, i);
      if (s) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l],
            d = Rs(e, l, c, a, !0);
          if (!d || d.childCount) continue e;
        }
        return { depth: t, fit: s, move: i ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t) return null;
    for (; this.depth > t.depth; ) this.closeFrontierNode();
    t.fit.childCount && (this.placed = Po(this.placed, t.depth, t.fit)), (e = t.move);
    for (let o = t.depth + 1; o <= e.depth; o++) {
      let r = e.node(o),
        i = r.type.contentMatch.fillBefore(r.content, !0, e.index(o));
      this.openFrontierNode(r.type, r.attrs, i);
    }
    return e;
  }
  openFrontierNode(e, t = null, o) {
    let r = this.frontier[this.depth];
    (r.match = r.match.matchType(e)),
      (this.placed = Po(this.placed, this.depth, v.from(e.create(t, o)))),
      this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let e = this.frontier.pop().match.fillBefore(v.empty, !0);
    e.childCount && (this.placed = Po(this.placed, this.frontier.length, e));
  }
};
function zo(n, e, t) {
  return e == 0
    ? n.cutByIndex(t, n.childCount)
    : n.replaceChild(0, n.firstChild.copy(zo(n.firstChild.content, e - 1, t)));
}
function Po(n, e, t) {
  return e == 0
    ? n.append(t)
    : n.replaceChild(n.childCount - 1, n.lastChild.copy(Po(n.lastChild.content, e - 1, t)));
}
function Ds(n, e) {
  for (let t = 0; t < e; t++) n = n.firstChild.content;
  return n;
}
function iu(n, e, t) {
  if (e <= 0) return n;
  let o = n.content;
  return (
    e > 1 && (o = o.replaceChild(0, iu(o.firstChild, e - 1, o.childCount == 1 ? t - 1 : 0))),
    e > 0 &&
      ((o = n.type.contentMatch.fillBefore(o).append(o)),
      t <= 0 && (o = o.append(n.type.contentMatch.matchFragment(o).fillBefore(v.empty, !0)))),
    n.copy(o)
  );
}
function Rs(n, e, t, o, r) {
  let i = n.node(e),
    s = r ? n.indexAfter(e) : n.index(e);
  if (s == i.childCount && !t.compatibleContent(i.type)) return null;
  let l = o.fillBefore(i.content, !0, s);
  return l && !qw(t, i.content, s) ? l : null;
}
function qw(n, e, t) {
  for (let o = t; o < e.childCount; o++) if (!n.allowsMarks(e.child(o).marks)) return !0;
  return !1;
}
let Kw = class ei extends pe {
  constructor(e, t, o) {
    super(), (this.pos = e), (this.attr = t), (this.value = o);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return xe.fail("No node at attribute step's position");
    let o = Object.create(null);
    for (let i in t.attrs) o[i] = t.attrs[i];
    o[this.attr] = this.value;
    let r = t.type.create(o, null, t.marks);
    return xe.fromReplace(e, this.pos, this.pos + 1, new T(v.from(r), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return hn.empty;
  }
  invert(e) {
    return new ei(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new ei(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new ei(t.pos, t.attr, t.value);
  }
};
pe.jsonID("attr", Kw);
let Ww = class ql extends pe {
  constructor(e, t) {
    super(), (this.attr = e), (this.value = t);
  }
  apply(e) {
    let t = Object.create(null);
    for (let r in e.attrs) t[r] = e.attrs[r];
    t[this.attr] = this.value;
    let o = e.type.create(t, e.content, e.marks);
    return xe.ok(o);
  }
  getMap() {
    return hn.empty;
  }
  invert(e) {
    return new ql(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string") throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new ql(t.attr, t.value);
  }
};
pe.jsonID("docAttr", Ww);
let lr = class extends Error {};
lr = function n(e) {
  let t = Error.call(this, e);
  return (t.__proto__ = n.prototype), t;
};
lr.prototype = Object.create(Error.prototype);
lr.prototype.constructor = lr;
lr.prototype.name = "TransformError";
const zs = Object.create(null);
let V = class {
  constructor(e, t, o) {
    (this.$anchor = e), (this.$head = t), (this.ranges = o || [new Hw(e.min(t), e.max(t))]);
  }
  get anchor() {
    return this.$anchor.pos;
  }
  get head() {
    return this.$head.pos;
  }
  get from() {
    return this.$from.pos;
  }
  get to() {
    return this.$to.pos;
  }
  get $from() {
    return this.ranges[0].$from;
  }
  get $to() {
    return this.ranges[0].$to;
  }
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++) if (e[t].$from.pos != e[t].$to.pos) return !1;
    return !0;
  }
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  replace(e, t = T.empty) {
    let o = t.content.lastChild,
      r = null;
    for (let l = 0; l < t.openEnd; l++) (r = o), (o = o.lastChild);
    let i = e.steps.length,
      s = this.ranges;
    for (let l = 0; l < s.length; l++) {
      let { $from: a, $to: c } = s[l],
        d = e.mapping.slice(i);
      e.replaceRange(d.map(a.pos), d.map(c.pos), l ? T.empty : t),
        l == 0 && Vd(e, i, (o ? o.isInline : r && r.isTextblock) ? -1 : 1);
    }
  }
  replaceWith(e, t) {
    let o = e.steps.length,
      r = this.ranges;
    for (let i = 0; i < r.length; i++) {
      let { $from: s, $to: l } = r[i],
        a = e.mapping.slice(o),
        c = a.map(s.pos),
        d = a.map(l.pos);
      i ? e.deleteRange(c, d) : (e.replaceRangeWith(c, d, t), Vd(e, o, t.isInline ? -1 : 1));
    }
  }
  static findFrom(e, t, o = !1) {
    let r = e.parent.inlineContent ? new q(e) : Pn(e.node(0), e.parent, e.pos, e.index(), t, o);
    if (r) return r;
    for (let i = e.depth - 1; i >= 0; i--) {
      let s =
        t < 0
          ? Pn(e.node(0), e.node(i), e.before(i + 1), e.index(i), t, o)
          : Pn(e.node(0), e.node(i), e.after(i + 1), e.index(i) + 1, t, o);
      if (s) return s;
    }
    return null;
  }
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new on(e.node(0));
  }
  static atStart(e) {
    return Pn(e, e, 0, 0, 1) || new on(e);
  }
  static atEnd(e) {
    return Pn(e, e, e.content.size, e.childCount, -1) || new on(e);
  }
  static fromJSON(e, t) {
    if (!t || !t.type) throw new RangeError("Invalid input for Selection.fromJSON");
    let o = zs[t.type];
    if (!o) throw new RangeError(`No selection type ${t.type} defined`);
    return o.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in zs) throw new RangeError("Duplicate use of selection JSON ID " + e);
    return (zs[e] = t), (t.prototype.jsonID = e), t;
  }
  getBookmark() {
    return q.between(this.$anchor, this.$head).getBookmark();
  }
};
V.prototype.visible = !0;
let Hw = class {
    constructor(e, t) {
      (this.$from = e), (this.$to = t);
    }
  },
  Bd = !1;
function Fd(n) {
  !Bd &&
    !n.parent.inlineContent &&
    ((Bd = !0),
    console.warn(
      "TextSelection endpoint not pointing into a node with inline content (" +
        n.parent.type.name +
        ")",
    ));
}
let q = class Bo extends V {
  constructor(e, t = e) {
    Fd(e), Fd(t), super(e, t);
  }
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let o = e.resolve(t.map(this.head));
    if (!o.parent.inlineContent) return V.near(o);
    let r = e.resolve(t.map(this.anchor));
    return new Bo(r.parent.inlineContent ? r : o, o);
  }
  replace(e, t = T.empty) {
    if ((super.replace(e, t), t == T.empty)) {
      let o = this.$from.marksAcross(this.$to);
      o && e.ensureMarks(o);
    }
  }
  eq(e) {
    return e instanceof Bo && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new su(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new Bo(e.resolve(t.anchor), e.resolve(t.head));
  }
  static create(e, t, o = t) {
    let r = e.resolve(t);
    return new this(r, o == t ? r : e.resolve(o));
  }
  static between(e, t, o) {
    let r = e.pos - t.pos;
    if (((!o || r) && (o = r >= 0 ? 1 : -1), !t.parent.inlineContent)) {
      let i = V.findFrom(t, o, !0) || V.findFrom(t, -o, !0);
      if (i) t = i.$head;
      else return V.near(t, o);
    }
    return (
      e.parent.inlineContent ||
        (r == 0
          ? (e = t)
          : ((e = (V.findFrom(e, -o, !0) || V.findFrom(e, o, !0)).$anchor),
            e.pos < t.pos != r < 0 && (e = t))),
      new Bo(e, t)
    );
  }
};
V.jsonID("text", q);
let su = class lu {
  constructor(e, t) {
    (this.anchor = e), (this.head = t);
  }
  map(e) {
    return new lu(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return q.between(e.resolve(this.anchor), e.resolve(this.head));
  }
};
class E extends V {
  constructor(e) {
    let t = e.nodeAfter,
      o = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, o), (this.node = t);
  }
  map(e, t) {
    let { deleted: o, pos: r } = t.mapResult(this.anchor),
      i = e.resolve(r);
    return o ? V.near(i) : new E(i);
  }
  content() {
    return new T(v.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof E && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new Uw(this.anchor);
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new E(e.resolve(t.anchor));
  }
  static create(e, t) {
    return new E(e.resolve(t));
  }
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
E.prototype.visible = !1;
V.jsonID("node", E);
let Uw = class au {
    constructor(e) {
      this.anchor = e;
    }
    map(e) {
      let { deleted: t, pos: o } = e.mapResult(this.anchor);
      return t ? new su(o, o) : new au(o);
    }
    resolve(e) {
      let t = e.resolve(this.anchor),
        o = t.nodeAfter;
      return o && E.isSelectable(o) ? new E(t) : V.near(t);
    }
  },
  on = class ti extends V {
    constructor(e) {
      super(e.resolve(0), e.resolve(e.content.size));
    }
    replace(e, t = T.empty) {
      if (t == T.empty) {
        e.delete(0, e.doc.content.size);
        let o = V.atStart(e.doc);
        o.eq(e.selection) || e.setSelection(o);
      } else super.replace(e, t);
    }
    toJSON() {
      return { type: "all" };
    }
    static fromJSON(e) {
      return new ti(e);
    }
    map(e) {
      return new ti(e);
    }
    eq(e) {
      return e instanceof ti;
    }
    getBookmark() {
      return Gw;
    }
  };
V.jsonID("all", on);
const Gw = {
  map() {
    return this;
  },
  resolve(n) {
    return new on(n);
  },
};
function Pn(n, e, t, o, r, i = !1) {
  if (e.inlineContent) return q.create(n, t);
  for (let s = o - (r > 0 ? 0 : 1); r > 0 ? s < e.childCount : s >= 0; s += r) {
    let l = e.child(s);
    if (l.isAtom) {
      if (!i && E.isSelectable(l)) return E.create(n, t - (r < 0 ? l.nodeSize : 0));
    } else {
      let a = Pn(n, l, t + r, r < 0 ? l.childCount : 0, r, i);
      if (a) return a;
    }
    t += l.nodeSize * r;
  }
  return null;
}
function Vd(n, e, t) {
  let o = n.steps.length - 1;
  if (o < e) return;
  let r = n.steps[o];
  if (!(r instanceof ho || r instanceof tt)) return;
  let i = n.mapping.maps[o],
    s;
  i.forEach((l, a, c, d) => {
    s == null && (s = d);
  }),
    n.setSelection(V.near(n.doc.resolve(s), t));
}
function jd(n, e) {
  return !e || !n ? n : n.bind(e);
}
let Vr = class {
  constructor(e, t, o) {
    (this.name = e), (this.init = jd(t.init, o)), (this.apply = jd(t.apply, o));
  }
};
new Vr("doc", {
  init(n) {
    return n.doc || n.schema.topNodeType.createAndFill();
  },
  apply(n) {
    return n.doc;
  },
}),
  new Vr("selection", {
    init(n, e) {
      return n.selection || V.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    },
  }),
  new Vr("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, o) {
      return o.selection.$cursor ? n.storedMarks : null;
    },
  }),
  new Vr("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    },
  });
function cu(n, e, t) {
  for (let o in n) {
    let r = n[o];
    r instanceof Function ? (r = r.bind(e)) : o == "handleDOMEvents" && (r = cu(r, e, {})),
      (t[o] = r);
  }
  return t;
}
let Sr = class {
  constructor(e) {
    (this.spec = e),
      (this.props = {}),
      e.props && cu(e.props, this, this.props),
      (this.key = e.key ? e.key.key : du("plugin"));
  }
  getState(e) {
    return e[this.key];
  }
};
const Ps = Object.create(null);
function du(n) {
  return n in Ps ? n + "$" + ++Ps[n] : ((Ps[n] = 0), n + "$");
}
let $r = class {
  constructor(e = "key") {
    this.key = du(e);
  }
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  getState(e) {
    return e[this.key];
  }
};
const gn = function (n) {
    for (var e = 0; ; e++) if (((n = n.previousSibling), !n)) return e;
  },
  hu = function (n, e, t, o) {
    return t && (Jd(n, e, t, o, -1) || Jd(n, e, t, o, 1));
  },
  Yw = /^(img|br|input|textarea|hr)$/i;
function Jd(n, e, t, o, r) {
  for (;;) {
    if (n == t && e == o) return !0;
    if (e == (r < 0 ? 0 : xi(n))) {
      let i = n.parentNode;
      if (!i || i.nodeType != 1 || ja(n) || Yw.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      (e = gn(n) + (r < 0 ? 0 : 1)), (n = i);
    } else if (n.nodeType == 1) {
      if (((n = n.childNodes[e + (r < 0 ? -1 : 0)]), n.contentEditable == "false")) return !1;
      e = r < 0 ? xi(n) : 0;
    } else return !1;
  }
}
function xi(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Xw(n, e, t) {
  for (let o = e == 0, r = e == xi(n); o || r; ) {
    if (n == t) return !0;
    let i = gn(n);
    if (((n = n.parentNode), !n)) return !1;
    (o = o && i == 0), (r = r && i == xi(n));
  }
}
function ja(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode);
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const pu = function (n) {
  return n.focusNode && hu(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function fu(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), (t.keyCode = n), (t.key = t.code = e), t;
}
const nt = typeof navigator < "u" ? navigator : null,
  Ld = typeof document < "u" ? document : null,
  Tt = (nt && nt.userAgent) || "",
  Kl = /Edge\/(\d+)/.exec(Tt),
  uu = /MSIE \d/.exec(Tt),
  Wl = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Tt),
  Mr = !!(uu || Wl || Kl),
  mu = uu ? document.documentMode : Wl ? +Wl[1] : Kl ? +Kl[1] : 0,
  _i = !Mr && /gecko\/(\d+)/i.test(Tt);
_i && +(/Firefox\/(\d+)/.exec(Tt) || [0, 0])[1];
const Hl = !Mr && /Chrome\/(\d+)/.exec(Tt),
  yn = !!Hl,
  Qw = Hl ? +Hl[1] : 0,
  kn = !Mr && !!nt && /Apple Computer/.test(nt.vendor),
  Ja = kn && (/Mobile\/\w+/.test(Tt) || (!!nt && nt.maxTouchPoints > 2)),
  Fe = Ja || (nt ? /Mac/.test(nt.platform) : !1),
  Zw = nt ? /Win/.test(nt.platform) : !1,
  Cr = /Android \d/.test(Tt),
  La = !!Ld && "webkitFontSmoothing" in Ld.documentElement.style,
  _w = La ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function eb(n, e = null) {
  let t = n.domSelectionRange(),
    o = n.state.doc;
  if (!t.focusNode) return null;
  let r = n.docView.nearestDesc(t.focusNode),
    i = r && r.size == 0,
    s = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (s < 0) return null;
  let l = o.resolve(s),
    a,
    c;
  if (pu(t)) {
    for (a = l; r && !r.node; ) r = r.parent;
    let d = r.node;
    if (
      r &&
      d.isAtom &&
      E.isSelectable(d) &&
      r.parent &&
      !(d.isInline && Xw(t.focusNode, t.focusOffset, r.dom))
    ) {
      let h = r.posBefore;
      c = new E(s == h ? l : o.resolve(h));
    }
  } else {
    let d = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (d < 0) return null;
    a = o.resolve(d);
  }
  if (!c) {
    let d = e == "pointer" || (n.state.selection.head < l.pos && !i) ? 1 : -1;
    c = yu(n, a, l, d);
  }
  return c;
}
function gu(n) {
  return n.editable
    ? n.hasFocus()
    : rb(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function qa(n, e = !1) {
  let t = n.state.selection;
  if ((ob(n, t), !!gu(n))) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && yn) {
      let o = n.domSelectionRange(),
        r = n.domObserver.currentSelection;
      if (
        o.anchorNode &&
        r.anchorNode &&
        hu(o.anchorNode, o.anchorOffset, r.anchorNode, r.anchorOffset)
      ) {
        (n.input.mouseDown.delayedSelectionSync = !0), n.domObserver.setCurSelection();
        return;
      }
    }
    if ((n.domObserver.disconnectSelection(), n.cursorWrapper)) nb(n);
    else {
      let { anchor: o, head: r } = t,
        i,
        s;
      qd &&
        !(t instanceof q) &&
        (t.$from.parent.inlineContent || (i = Kd(n, t.from)),
        !t.empty && !t.$from.parent.inlineContent && (s = Kd(n, t.to))),
        n.docView.setSelection(o, r, n.root, e),
        qd && (i && Wd(i), s && Wd(s)),
        t.visible
          ? n.dom.classList.remove("ProseMirror-hideselection")
          : (n.dom.classList.add("ProseMirror-hideselection"),
            "onselectionchange" in document && tb(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const qd = kn || (yn && Qw < 63);
function Kd(n, e) {
  let { node: t, offset: o } = n.docView.domFromPos(e, 0),
    r = o < t.childNodes.length ? t.childNodes[o] : null,
    i = o ? t.childNodes[o - 1] : null;
  if (kn && r && r.contentEditable == "false") return Bs(r);
  if ((!r || r.contentEditable == "false") && (!i || i.contentEditable == "false")) {
    if (r) return Bs(r);
    if (i) return Bs(i);
  }
}
function Bs(n) {
  return (
    (n.contentEditable = "true"),
    kn && n.draggable && ((n.draggable = !1), (n.wasDraggable = !0)),
    n
  );
}
function Wd(n) {
  (n.contentEditable = "false"), n.wasDraggable && ((n.draggable = !0), (n.wasDraggable = null));
}
function tb(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(),
    o = t.anchorNode,
    r = t.anchorOffset;
  e.addEventListener(
    "selectionchange",
    (n.input.hideSelectionGuard = () => {
      (t.anchorNode != o || t.anchorOffset != r) &&
        (e.removeEventListener("selectionchange", n.input.hideSelectionGuard),
        setTimeout(() => {
          (!gu(n) || n.state.selection.visible) &&
            n.dom.classList.remove("ProseMirror-hideselection");
        }, 20));
    }),
  );
}
function nb(n) {
  let e = n.domSelection(),
    t = document.createRange(),
    o = n.cursorWrapper.dom,
    r = o.nodeName == "IMG";
  r ? t.setEnd(o.parentNode, gn(o) + 1) : t.setEnd(o, 0),
    t.collapse(!1),
    e.removeAllRanges(),
    e.addRange(t),
    !r && !n.state.selection.visible && Mr && mu <= 11 && ((o.disabled = !0), (o.disabled = !1));
}
function ob(n, e) {
  if (e instanceof E) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (Hd(n), t && t.selectNode(), (n.lastSelectedViewDesc = t));
  } else Hd(n);
}
function Hd(n) {
  n.lastSelectedViewDesc &&
    (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(),
    (n.lastSelectedViewDesc = void 0));
}
function yu(n, e, t, o) {
  return n.someProp("createSelectionBetween", (r) => r(n, e, t)) || q.between(e, t, o);
}
function rb(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode) return !1;
  try {
    return (
      n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) &&
      (n.editable ||
        n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode))
    );
  } catch {
    return !1;
  }
}
function Ul(n, e) {
  let { $anchor: t, $head: o } = n.selection,
    r = e > 0 ? t.max(o) : t.min(o),
    i = r.parent.inlineContent
      ? r.depth
        ? n.doc.resolve(e > 0 ? r.after() : r.before())
        : null
      : r;
  return i && V.findFrom(i, e);
}
function yt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function Ud(n, e, t) {
  let o = n.state.selection;
  if (o instanceof q)
    if (t.indexOf("s") > -1) {
      let { $head: r } = o,
        i = r.textOffset ? null : e < 0 ? r.nodeBefore : r.nodeAfter;
      if (!i || i.isText || !i.isLeaf) return !1;
      let s = n.state.doc.resolve(r.pos + i.nodeSize * (e < 0 ? -1 : 1));
      return yt(n, new q(o.$anchor, s));
    } else if (o.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let r = Ul(n.state, e);
        return r && r instanceof E ? yt(n, r) : !1;
      } else if (!(Fe && t.indexOf("m") > -1)) {
        let r = o.$head,
          i = r.textOffset ? null : e < 0 ? r.nodeBefore : r.nodeAfter,
          s;
        if (!i || i.isText) return !1;
        let l = e < 0 ? r.pos - i.nodeSize : r.pos;
        return i.isAtom || ((s = n.docView.descAt(l)) && !s.contentDOM)
          ? E.isSelectable(i)
            ? yt(n, new E(e < 0 ? n.state.doc.resolve(r.pos - i.nodeSize) : r))
            : La
              ? yt(n, new q(n.state.doc.resolve(e < 0 ? l : l + i.nodeSize)))
              : !1
          : !1;
      }
    } else return !1;
  else {
    if (o instanceof E && o.node.isInline) return yt(n, new q(e > 0 ? o.$to : o.$from));
    {
      let r = Ul(n.state, e);
      return r ? yt(n, r) : !1;
    }
  }
}
function Si(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Go(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function Cn(n, e) {
  return e < 0 ? ib(n) : sb(n);
}
function ib(n) {
  let e = n.domSelectionRange(),
    t = e.focusNode,
    o = e.focusOffset;
  if (!t) return;
  let r,
    i,
    s = !1;
  for (_i && t.nodeType == 1 && o < Si(t) && Go(t.childNodes[o], -1) && (s = !0); ; )
    if (o > 0) {
      if (t.nodeType != 1) break;
      {
        let l = t.childNodes[o - 1];
        if (Go(l, -1)) (r = t), (i = --o);
        else if (l.nodeType == 3) (t = l), (o = t.nodeValue.length);
        else break;
      }
    } else {
      if (ku(t)) break;
      {
        let l = t.previousSibling;
        for (; l && Go(l, -1); ) (r = t.parentNode), (i = gn(l)), (l = l.previousSibling);
        if (l) (t = l), (o = Si(t));
        else {
          if (((t = t.parentNode), t == n.dom)) break;
          o = 0;
        }
      }
    }
  s ? Gl(n, t, o) : r && Gl(n, r, i);
}
function sb(n) {
  let e = n.domSelectionRange(),
    t = e.focusNode,
    o = e.focusOffset;
  if (!t) return;
  let r = Si(t),
    i,
    s;
  for (;;)
    if (o < r) {
      if (t.nodeType != 1) break;
      let l = t.childNodes[o];
      if (Go(l, 1)) (i = t), (s = ++o);
      else break;
    } else {
      if (ku(t)) break;
      {
        let l = t.nextSibling;
        for (; l && Go(l, 1); ) (i = l.parentNode), (s = gn(l) + 1), (l = l.nextSibling);
        if (l) (t = l), (o = 0), (r = Si(t));
        else {
          if (((t = t.parentNode), t == n.dom)) break;
          o = r = 0;
        }
      }
    }
  i && Gl(n, i, s);
}
function ku(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function lb(n, e) {
  for (; n && e == n.childNodes.length && !ja(n); ) (e = gn(n) + 1), (n = n.parentNode);
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3) return t;
    if (t.nodeType == 1 && t.contentEditable == "false") break;
    (n = t), (e = 0);
  }
}
function ab(n, e) {
  for (; n && !e && !ja(n); ) (e = gn(n)), (n = n.parentNode);
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3) return t;
    if (t.nodeType == 1 && t.contentEditable == "false") break;
    (n = t), (e = n.childNodes.length);
  }
}
function Gl(n, e, t) {
  if (e.nodeType != 3) {
    let i, s;
    (s = lb(e, t)) ? ((e = s), (t = 0)) : (i = ab(e, t)) && ((e = i), (t = i.nodeValue.length));
  }
  let o = n.domSelection();
  if (pu(o)) {
    let i = document.createRange();
    i.setEnd(e, t), i.setStart(e, t), o.removeAllRanges(), o.addRange(i);
  } else o.extend && o.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: r } = n;
  setTimeout(() => {
    n.state == r && qa(n);
  }, 50);
}
function Gd(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(yn || Zw) && t.parent.inlineContent) {
    let o = n.coordsAtPos(e);
    if (e > t.start()) {
      let r = n.coordsAtPos(e - 1),
        i = (r.top + r.bottom) / 2;
      if (i > o.top && i < o.bottom && Math.abs(r.left - o.left) > 1)
        return r.left < o.left ? "ltr" : "rtl";
    }
    if (e < t.end()) {
      let r = n.coordsAtPos(e + 1),
        i = (r.top + r.bottom) / 2;
      if (i > o.top && i < o.bottom && Math.abs(r.left - o.left) > 1)
        return r.left > o.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
}
function Yd(n, e, t) {
  let o = n.state.selection;
  if ((o instanceof q && !o.empty) || t.indexOf("s") > -1 || (Fe && t.indexOf("m") > -1)) return !1;
  let { $from: r, $to: i } = o;
  if (!r.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let s = Ul(n.state, e);
    if (s && s instanceof E) return yt(n, s);
  }
  if (!r.parent.inlineContent) {
    let s = e < 0 ? r : i,
      l = o instanceof on ? V.near(s, e) : V.findFrom(s, e);
    return l ? yt(n, l) : !1;
  }
  return !1;
}
function Xd(n, e) {
  if (!(n.state.selection instanceof q)) return !0;
  let { $head: t, $anchor: o, empty: r } = n.state.selection;
  if (!t.sameParent(o)) return !0;
  if (!r) return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward")) return !0;
  let i = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (i && !i.isText) {
    let s = n.state.tr;
    return (
      e < 0 ? s.delete(t.pos - i.nodeSize, t.pos) : s.delete(t.pos, t.pos + i.nodeSize),
      n.dispatch(s),
      !0
    );
  }
  return !1;
}
function Qd(n, e, t) {
  n.domObserver.stop(), (e.contentEditable = t), n.domObserver.start();
}
function cb(n) {
  if (!kn || n.state.selection.$head.parentOffset > 0) return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let o = e.firstChild;
    Qd(n, o, "true"), setTimeout(() => Qd(n, o, "false"), 20);
  }
  return !1;
}
function db(n) {
  let e = "";
  return (
    n.ctrlKey && (e += "c"),
    n.metaKey && (e += "m"),
    n.altKey && (e += "a"),
    n.shiftKey && (e += "s"),
    e
  );
}
function hb(n, e) {
  let t = e.keyCode,
    o = db(e);
  if (t == 8 || (Fe && t == 72 && o == "c")) return Xd(n, -1) || Cn(n, -1);
  if ((t == 46 && !e.shiftKey) || (Fe && t == 68 && o == "c")) return Xd(n, 1) || Cn(n, 1);
  if (t == 13 || t == 27) return !0;
  if (t == 37 || (Fe && t == 66 && o == "c")) {
    let r = t == 37 ? (Gd(n, n.state.selection.from) == "ltr" ? -1 : 1) : -1;
    return Ud(n, r, o) || Cn(n, r);
  } else if (t == 39 || (Fe && t == 70 && o == "c")) {
    let r = t == 39 ? (Gd(n, n.state.selection.from) == "ltr" ? 1 : -1) : 1;
    return Ud(n, r, o) || Cn(n, r);
  } else {
    if (t == 38 || (Fe && t == 80 && o == "c")) return Yd(n, -1, o) || Cn(n, -1);
    if (t == 40 || (Fe && t == 78 && o == "c")) return cb(n) || Yd(n, 1, o) || Cn(n, 1);
    if (o == (Fe ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90)) return !0;
  }
  return !1;
}
function wu(n, e) {
  n.someProp("transformCopied", (f) => {
    e = f(e, n);
  });
  let t = [],
    { content: o, openStart: r, openEnd: i } = e;
  for (; r > 1 && i > 1 && o.childCount == 1 && o.firstChild.childCount == 1; ) {
    r--, i--;
    let f = o.firstChild;
    t.push(f.type.name, f.attrs != f.type.defaultAttrs ? f.attrs : null), (o = f.content);
  }
  let s = n.someProp("clipboardSerializer") || Uf.fromSchema(n.state.schema),
    l = Mu(),
    a = l.createElement("div");
  a.appendChild(s.serializeFragment(o, { document: l }));
  let c = a.firstChild,
    d,
    h = 0;
  for (; c && c.nodeType == 1 && (d = $u[c.nodeName.toLowerCase()]); ) {
    for (let f = d.length - 1; f >= 0; f--) {
      let u = l.createElement(d[f]);
      for (; a.firstChild; ) u.appendChild(a.firstChild);
      a.appendChild(u), h++;
    }
    c = a.firstChild;
  }
  c &&
    c.nodeType == 1 &&
    c.setAttribute("data-pm-slice", `${r} ${i}${h ? ` -${h}` : ""} ${JSON.stringify(t)}`);
  let p =
    n.someProp("clipboardTextSerializer", (f) => f(e, n)) ||
    e.content.textBetween(
      0,
      e.content.size,
      `

`,
    );
  return { dom: a, text: p };
}
function bu(n, e, t, o, r) {
  let i = r.parent.type.spec.code,
    s,
    l;
  if (!t && !e) return null;
  let a = e && (o || i || !t);
  if (a) {
    if (
      (n.someProp("transformPastedText", (p) => {
        e = p(e, i || o, n);
      }),
      i)
    )
      return e
        ? new T(
            v.from(
              n.state.schema.text(
                e.replace(
                  /\r\n?/g,
                  `
`,
                ),
              ),
            ),
            0,
            0,
          )
        : T.empty;
    let h = n.someProp("clipboardTextParser", (p) => p(e, r, o, n));
    if (h) l = h;
    else {
      let p = r.marks(),
        { schema: f } = n.state,
        u = Uf.fromSchema(f);
      (s = document.createElement("div")),
        e.split(/(?:\r\n?|\n)+/).forEach((m) => {
          let g = s.appendChild(document.createElement("p"));
          m && g.appendChild(u.serializeNode(f.text(m, p)));
        });
    }
  } else
    n.someProp("transformPastedHTML", (h) => {
      t = h(t, n);
    }),
      (s = ub(t)),
      La && mb(s);
  let c = s && s.querySelector("[data-pm-slice]"),
    d = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (d && d[3])
    for (let h = +d[3]; h > 0; h--) {
      let p = s.firstChild;
      for (; p && p.nodeType != 1; ) p = p.nextSibling;
      if (!p) break;
      s = p;
    }
  if (
    (l ||
      (l = (
        n.someProp("clipboardParser") ||
        n.someProp("domParser") ||
        Kf.fromSchema(n.state.schema)
      ).parseSlice(s, {
        preserveWhitespace: !!(a || d),
        context: r,
        ruleFromNode(h) {
          return h.nodeName == "BR" &&
            !h.nextSibling &&
            h.parentNode &&
            !pb.test(h.parentNode.nodeName)
            ? { ignore: !0 }
            : null;
        },
      })),
    d)
  )
    l = gb(Zd(l, +d[1], +d[2]), d[4]);
  else if (((l = T.maxOpen(fb(l.content, r), !0)), l.openStart || l.openEnd)) {
    let h = 0,
      p = 0;
    for (
      let f = l.content.firstChild;
      h < l.openStart && !f.type.spec.isolating;
      h++, f = f.firstChild
    );
    for (
      let f = l.content.lastChild;
      p < l.openEnd && !f.type.spec.isolating;
      p++, f = f.lastChild
    );
    l = Zd(l, h, p);
  }
  return (
    n.someProp("transformPasted", (h) => {
      l = h(l, n);
    }),
    l
  );
}
const pb =
  /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function fb(n, e) {
  if (n.childCount < 2) return n;
  for (let t = e.depth; t >= 0; t--) {
    let o = e.node(t).contentMatchAt(e.index(t)),
      r,
      i = [];
    if (
      (n.forEach((s) => {
        if (!i) return;
        let l = o.findWrapping(s.type),
          a;
        if (!l) return (i = null);
        if ((a = i.length && r.length && xu(l, r, s, i[i.length - 1], 0))) i[i.length - 1] = a;
        else {
          i.length && (i[i.length - 1] = Su(i[i.length - 1], r.length));
          let c = vu(s, l);
          i.push(c), (o = o.matchType(c.type)), (r = l);
        }
      }),
      i)
    )
      return v.from(i);
  }
  return n;
}
function vu(n, e, t = 0) {
  for (let o = e.length - 1; o >= t; o--) n = e[o].create(null, v.from(n));
  return n;
}
function xu(n, e, t, o, r) {
  if (r < n.length && r < e.length && n[r] == e[r]) {
    let i = xu(n, e, t, o.lastChild, r + 1);
    if (i) return o.copy(o.content.replaceChild(o.childCount - 1, i));
    if (o.contentMatchAt(o.childCount).matchType(r == n.length - 1 ? t.type : n[r + 1]))
      return o.copy(o.content.append(v.from(vu(t, n, r + 1))));
  }
}
function Su(n, e) {
  if (e == 0) return n;
  let t = n.content.replaceChild(n.childCount - 1, Su(n.lastChild, e - 1)),
    o = n.contentMatchAt(n.childCount).fillBefore(v.empty, !0);
  return n.copy(t.append(o));
}
function Yl(n, e, t, o, r, i) {
  let s = e < 0 ? n.firstChild : n.lastChild,
    l = s.content;
  return (
    n.childCount > 1 && (i = 0),
    r < o - 1 && (l = Yl(l, e, t, o, r + 1, i)),
    r >= t &&
      (l =
        e < 0
          ? s
              .contentMatchAt(0)
              .fillBefore(l, i <= r)
              .append(l)
          : l.append(s.contentMatchAt(s.childCount).fillBefore(v.empty, !0))),
    n.replaceChild(e < 0 ? 0 : n.childCount - 1, s.copy(l))
  );
}
function Zd(n, e, t) {
  return (
    e < n.openStart && (n = new T(Yl(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)),
    t < n.openEnd && (n = new T(Yl(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)),
    n
  );
}
const $u = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"],
};
let _d = null;
function Mu() {
  return _d || (_d = document.implementation.createHTMLDocument("title"));
}
function ub(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = Mu().createElement("div"),
    o = /<([a-z][^>\s]+)/i.exec(n),
    r;
  if (
    ((r = o && $u[o[1].toLowerCase()]) &&
      (n =
        r.map((i) => "<" + i + ">").join("") +
        n +
        r
          .map((i) => "</" + i + ">")
          .reverse()
          .join("")),
    (t.innerHTML = n),
    r)
  )
    for (let i = 0; i < r.length; i++) t = t.querySelector(r[i]) || t;
  return t;
}
function mb(n) {
  let e = n.querySelectorAll(yn ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let o = e[t];
    o.childNodes.length == 1 &&
      o.textContent == " " &&
      o.parentNode &&
      o.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), o);
  }
}
function gb(n, e) {
  if (!n.size) return n;
  let t = n.content.firstChild.type.schema,
    o;
  try {
    o = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: r, openStart: i, openEnd: s } = n;
  for (let l = o.length - 2; l >= 0; l -= 2) {
    let a = t.nodes[o[l]];
    if (!a || a.hasRequiredAttrs()) break;
    (r = v.from(a.create(o[l + 1], r))), i++, s++;
  }
  return new T(r, i, s);
}
const We = {},
  ze = {};
function vt(n, e) {
  (n.input.lastSelectionOrigin = e), (n.input.lastSelectionTime = Date.now());
}
ze.keydown = (n, e) => {
  let t = e;
  if (
    ((n.input.shiftKey = t.keyCode == 16 || t.shiftKey),
    !Ou(n, t) &&
      ((n.input.lastKeyCode = t.keyCode),
      (n.input.lastKeyCodeTime = Date.now()),
      !(Cr && yn && t.keyCode == 13)))
  )
    if (
      (t.keyCode != 229 && n.domObserver.forceFlush(),
      Ja && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey)
    ) {
      let o = Date.now();
      (n.input.lastIOSEnter = o),
        (n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
          n.input.lastIOSEnter == o &&
            (n.someProp("handleKeyDown", (r) => r(n, fu(13, "Enter"))), (n.input.lastIOSEnter = 0));
        }, 200));
    } else
      n.someProp("handleKeyDown", (o) => o(n, t)) || hb(n, t) ? t.preventDefault() : vt(n, "key");
};
ze.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
ze.keypress = (n, e) => {
  let t = e;
  if (Ou(n, t) || !t.charCode || (t.ctrlKey && !t.altKey) || (Fe && t.metaKey)) return;
  if (n.someProp("handleKeyPress", (r) => r(n, t))) {
    t.preventDefault();
    return;
  }
  let o = n.state.selection;
  if (!(o instanceof q) || !o.$from.sameParent(o.$to)) {
    let r = String.fromCharCode(t.charCode);
    !/[\r\n]/.test(r) &&
      !n.someProp("handleTextInput", (i) => i(n, o.$from.pos, o.$to.pos, r)) &&
      n.dispatch(n.state.tr.insertText(r).scrollIntoView()),
      t.preventDefault();
  }
};
function es(n) {
  return { left: n.clientX, top: n.clientY };
}
function yb(n, e) {
  let t = e.x - n.clientX,
    o = e.y - n.clientY;
  return t * t + o * o < 100;
}
function Ka(n, e, t, o, r) {
  if (o == -1) return !1;
  let i = n.state.doc.resolve(o);
  for (let s = i.depth + 1; s > 0; s--)
    if (
      n.someProp(e, (l) =>
        s > i.depth
          ? l(n, t, i.nodeAfter, i.before(s), r, !0)
          : l(n, t, i.node(s), i.before(s), r, !1),
      )
    )
      return !0;
  return !1;
}
function Un(n, e, t) {
  n.focused || n.focus();
  let o = n.state.tr.setSelection(e);
  t == "pointer" && o.setMeta("pointer", !0), n.dispatch(o);
}
function kb(n, e) {
  if (e == -1) return !1;
  let t = n.state.doc.resolve(e),
    o = t.nodeAfter;
  return o && o.isAtom && E.isSelectable(o) ? (Un(n, new E(t), "pointer"), !0) : !1;
}
function wb(n, e) {
  if (e == -1) return !1;
  let t = n.state.selection,
    o,
    r;
  t instanceof E && (o = t.node);
  let i = n.state.doc.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let l = s > i.depth ? i.nodeAfter : i.node(s);
    if (E.isSelectable(l)) {
      o && t.$from.depth > 0 && s >= t.$from.depth && i.before(t.$from.depth + 1) == t.$from.pos
        ? (r = i.before(t.$from.depth))
        : (r = i.before(s));
      break;
    }
  }
  return r != null ? (Un(n, E.create(n.state.doc, r), "pointer"), !0) : !1;
}
function bb(n, e, t, o, r) {
  return (
    Ka(n, "handleClickOn", e, t, o) ||
    n.someProp("handleClick", (i) => i(n, e, o)) ||
    (r ? wb(n, t) : kb(n, t))
  );
}
function vb(n, e, t, o) {
  return (
    Ka(n, "handleDoubleClickOn", e, t, o) || n.someProp("handleDoubleClick", (r) => r(n, e, o))
  );
}
function xb(n, e, t, o) {
  return (
    Ka(n, "handleTripleClickOn", e, t, o) ||
    n.someProp("handleTripleClick", (r) => r(n, e, o)) ||
    Sb(n, t, o)
  );
}
function Sb(n, e, t) {
  if (t.button != 0) return !1;
  let o = n.state.doc;
  if (e == -1) return o.inlineContent ? (Un(n, q.create(o, 0, o.content.size), "pointer"), !0) : !1;
  let r = o.resolve(e);
  for (let i = r.depth + 1; i > 0; i--) {
    let s = i > r.depth ? r.nodeAfter : r.node(i),
      l = r.before(i);
    if (s.inlineContent) Un(n, q.create(o, l + 1, l + 1 + s.content.size), "pointer");
    else if (E.isSelectable(s)) Un(n, E.create(o, l), "pointer");
    else continue;
    return !0;
  }
}
function Wa(n) {
  return $i(n);
}
const Cu = Fe ? "metaKey" : "ctrlKey";
We.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let o = Wa(n),
    r = Date.now(),
    i = "singleClick";
  r - n.input.lastClick.time < 500 &&
    yb(t, n.input.lastClick) &&
    !t[Cu] &&
    (n.input.lastClick.type == "singleClick"
      ? (i = "doubleClick")
      : n.input.lastClick.type == "doubleClick" && (i = "tripleClick")),
    (n.input.lastClick = { time: r, x: t.clientX, y: t.clientY, type: i });
  let s = n.posAtCoords(es(t));
  s &&
    (i == "singleClick"
      ? (n.input.mouseDown && n.input.mouseDown.done(), (n.input.mouseDown = new $b(n, s, t, !!o)))
      : (i == "doubleClick" ? vb : xb)(n, s.pos, s.inside, t)
        ? t.preventDefault()
        : vt(n, "pointer"));
};
let $b = class {
  constructor(e, t, o, r) {
    (this.view = e),
      (this.pos = t),
      (this.event = o),
      (this.flushed = r),
      (this.delayedSelectionSync = !1),
      (this.mightDrag = null),
      (this.startDoc = e.state.doc),
      (this.selectNode = !!o[Cu]),
      (this.allowDefault = o.shiftKey);
    let i, s;
    if (t.inside > -1) (i = e.state.doc.nodeAt(t.inside)), (s = t.inside);
    else {
      let d = e.state.doc.resolve(t.pos);
      (i = d.parent), (s = d.depth ? d.before() : 0);
    }
    const l = r ? null : o.target,
      a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a ? a.dom : null;
    let { selection: c } = e.state;
    ((o.button == 0 && i.type.spec.draggable && i.type.spec.selectable !== !1) ||
      (c instanceof E && c.from <= s && c.to > s)) &&
      (this.mightDrag = {
        node: i,
        pos: s,
        addAttr: !!(this.target && !this.target.draggable),
        setUneditable: !!(this.target && _i && !this.target.hasAttribute("contentEditable")),
      }),
      this.target &&
        this.mightDrag &&
        (this.mightDrag.addAttr || this.mightDrag.setUneditable) &&
        (this.view.domObserver.stop(),
        this.mightDrag.addAttr && (this.target.draggable = !0),
        this.mightDrag.setUneditable &&
          setTimeout(() => {
            this.view.input.mouseDown == this &&
              this.target.setAttribute("contentEditable", "false");
          }, 20),
        this.view.domObserver.start()),
      e.root.addEventListener("mouseup", (this.up = this.up.bind(this))),
      e.root.addEventListener("mousemove", (this.move = this.move.bind(this))),
      vt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up),
      this.view.root.removeEventListener("mousemove", this.move),
      this.mightDrag &&
        this.target &&
        (this.view.domObserver.stop(),
        this.mightDrag.addAttr && this.target.removeAttribute("draggable"),
        this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"),
        this.view.domObserver.start()),
      this.delayedSelectionSync && setTimeout(() => qa(this.view)),
      (this.view.input.mouseDown = null);
  }
  up(e) {
    if ((this.done(), !this.view.dom.contains(e.target))) return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(es(e))),
      this.updateAllowDefault(e),
      this.allowDefault || !t
        ? vt(this.view, "pointer")
        : bb(this.view, t.pos, t.inside, e, this.selectNode)
          ? e.preventDefault()
          : e.button == 0 &&
              (this.flushed ||
                (kn && this.mightDrag && !this.mightDrag.node.isAtom) ||
                (yn &&
                  !this.view.state.selection.visible &&
                  Math.min(
                    Math.abs(t.pos - this.view.state.selection.from),
                    Math.abs(t.pos - this.view.state.selection.to),
                  ) <= 2))
            ? (Un(this.view, V.near(this.view.state.doc.resolve(t.pos)), "pointer"),
              e.preventDefault())
            : vt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), vt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault &&
      (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) &&
      (this.allowDefault = !0);
  }
};
We.touchstart = (n) => {
  (n.input.lastTouch = Date.now()), Wa(n), vt(n, "pointer");
};
We.touchmove = (n) => {
  (n.input.lastTouch = Date.now()), vt(n, "pointer");
};
We.contextmenu = (n) => Wa(n);
function Ou(n, e) {
  return n.composing
    ? !0
    : kn && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500
      ? ((n.input.compositionEndedAt = -2e8), !0)
      : !1;
}
const Mb = Cr ? 5e3 : -1;
ze.compositionstart = ze.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n,
      t = e.selection.$from;
    if (
      e.selection.empty &&
      (e.storedMarks ||
        (!t.textOffset &&
          t.parentOffset &&
          t.nodeBefore.marks.some((o) => o.type.spec.inclusive === !1)))
    )
      (n.markCursor = n.state.storedMarks || t.marks()), $i(n, !0), (n.markCursor = null);
    else if (
      ($i(n),
      _i && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length)
    ) {
      let o = n.domSelectionRange();
      for (let r = o.focusNode, i = o.focusOffset; r && r.nodeType == 1 && i != 0; ) {
        let s = i < 0 ? r.lastChild : r.childNodes[i - 1];
        if (!s) break;
        if (s.nodeType == 3) {
          n.domSelection().collapse(s, s.nodeValue.length);
          break;
        } else (r = s), (i = -1);
      }
    }
    n.input.composing = !0;
  }
  Nu(n, Mb);
};
ze.compositionend = (n, e) => {
  n.composing &&
    ((n.input.composing = !1),
    (n.input.compositionEndedAt = e.timeStamp),
    (n.input.compositionPendingChanges = n.domObserver.pendingRecords().length
      ? n.input.compositionID
      : 0),
    (n.input.compositionNode = null),
    n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()),
    n.input.compositionID++,
    Nu(n, 20));
};
function Nu(n, e) {
  clearTimeout(n.input.composingTimeout),
    e > -1 && (n.input.composingTimeout = setTimeout(() => $i(n), e));
}
function Cb(n) {
  for (
    n.composing && ((n.input.composing = !1), (n.input.compositionEndedAt = Ob()));
    n.input.compositionNodes.length > 0;

  )
    n.input.compositionNodes.pop().markParentsDirty();
}
function Ob() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function $i(n, e = !1) {
  if (!(Cr && n.domObserver.flushingSoon >= 0)) {
    if ((n.domObserver.forceFlush(), Cb(n), e || (n.docView && n.docView.dirty))) {
      let t = eb(n);
      return (
        t && !t.eq(n.state.selection)
          ? n.dispatch(n.state.tr.setSelection(t))
          : n.updateState(n.state),
        !0
      );
    }
    return !1;
  }
}
function Nb(n, e) {
  if (!n.dom.parentNode) return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), (t.style.cssText = "position: fixed; left: -10000px; top: 10px");
  let o = getSelection(),
    r = document.createRange();
  r.selectNodeContents(e),
    n.dom.blur(),
    o.removeAllRanges(),
    o.addRange(r),
    setTimeout(() => {
      t.parentNode && t.parentNode.removeChild(t), n.focus();
    }, 50);
}
const ar = (Mr && mu < 15) || (Ja && _w < 604);
We.copy = ze.cut = (n, e) => {
  let t = e,
    o = n.state.selection,
    r = t.type == "cut";
  if (o.empty) return;
  let i = ar ? null : t.clipboardData,
    s = o.content(),
    { dom: l, text: a } = wu(n, s);
  i
    ? (t.preventDefault(),
      i.clearData(),
      i.setData("text/html", l.innerHTML),
      i.setData("text/plain", a))
    : Nb(n, l),
    r && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function Tb(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1
    ? n.content.firstChild
    : null;
}
function Eb(n, e) {
  if (!n.dom.parentNode) return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code,
    o = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (o.contentEditable = "true"),
    (o.style.cssText = "position: fixed; left: -10000px; top: 10px"),
    o.focus();
  let r = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(),
      o.parentNode && o.parentNode.removeChild(o),
      t ? Xl(n, o.value, null, r, e) : Xl(n, o.textContent, o.innerHTML, r, e);
  }, 50);
}
function Xl(n, e, t, o, r) {
  let i = bu(n, e, t, o, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, r, i || T.empty))) return !0;
  if (!i) return !1;
  let s = Tb(i),
    l = s ? n.state.tr.replaceSelectionWith(s, o) : n.state.tr.replaceSelection(i);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Tu(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e) return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
ze.paste = (n, e) => {
  let t = e;
  if (n.composing && !Cr) return;
  let o = ar ? null : t.clipboardData,
    r = n.input.shiftKey && n.input.lastKeyCode != 45;
  o && Xl(n, Tu(o), o.getData("text/html"), r, t) ? t.preventDefault() : Eb(n, t);
};
let Ab = class {
  constructor(e, t, o) {
    (this.slice = e), (this.move = t), (this.node = o);
  }
};
const Eu = Fe ? "altKey" : "ctrlKey";
We.dragstart = (n, e) => {
  let t = e,
    o = n.input.mouseDown;
  if ((o && o.done(), !t.dataTransfer)) return;
  let r = n.state.selection,
    i = r.empty ? null : n.posAtCoords(es(t)),
    s;
  if (!(i && i.pos >= r.from && i.pos <= (r instanceof E ? r.to - 1 : r.to))) {
    if (o && o.mightDrag) s = E.create(n.state.doc, o.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (s = E.create(n.state.doc, d.posBefore));
    }
  }
  let l = (s || n.state.selection).content(),
    { dom: a, text: c } = wu(n, l);
  t.dataTransfer.clearData(),
    t.dataTransfer.setData(ar ? "Text" : "text/html", a.innerHTML),
    (t.dataTransfer.effectAllowed = "copyMove"),
    ar || t.dataTransfer.setData("text/plain", c),
    (n.dragging = new Ab(l, !t[Eu], s));
};
We.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
ze.dragover = ze.dragenter = (n, e) => e.preventDefault();
ze.drop = (n, e) => {
  let t = e,
    o = n.dragging;
  if (((n.dragging = null), !t.dataTransfer)) return;
  let r = n.posAtCoords(es(t));
  if (!r) return;
  let i = n.state.doc.resolve(r.pos),
    s = o && o.slice;
  s
    ? n.someProp("transformPasted", (u) => {
        s = u(s, n);
      })
    : (s = bu(n, Tu(t.dataTransfer), ar ? null : t.dataTransfer.getData("text/html"), !1, i));
  let l = !!(o && !t[Eu]);
  if (n.someProp("handleDrop", (u) => u(n, t, s || T.empty, l))) {
    t.preventDefault();
    return;
  }
  if (!s) return;
  t.preventDefault();
  let a = s ? jw(n.state.doc, i.pos, s) : i.pos;
  a == null && (a = i.pos);
  let c = n.state.tr;
  if (l) {
    let { node: u } = o;
    u ? u.replace(c) : c.deleteSelection();
  }
  let d = c.mapping.map(a),
    h = s.openStart == 0 && s.openEnd == 0 && s.content.childCount == 1,
    p = c.doc;
  if ((h ? c.replaceRangeWith(d, d, s.content.firstChild) : c.replaceRange(d, d, s), c.doc.eq(p)))
    return;
  let f = c.doc.resolve(d);
  if (
    h &&
    E.isSelectable(s.content.firstChild) &&
    f.nodeAfter &&
    f.nodeAfter.sameMarkup(s.content.firstChild)
  )
    c.setSelection(new E(f));
  else {
    let u = c.mapping.map(a);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((m, g, y, w) => (u = w)),
      c.setSelection(yu(n, f, c.doc.resolve(u)));
  }
  n.focus(), n.dispatch(c.setMeta("uiEvent", "drop"));
};
We.focus = (n) => {
  (n.input.lastFocus = Date.now()),
    n.focused ||
      (n.domObserver.stop(),
      n.dom.classList.add("ProseMirror-focused"),
      n.domObserver.start(),
      (n.focused = !0),
      setTimeout(() => {
        n.docView &&
          n.hasFocus() &&
          !n.domObserver.currentSelection.eq(n.domSelectionRange()) &&
          qa(n);
      }, 20));
};
We.blur = (n, e) => {
  let t = e;
  n.focused &&
    (n.domObserver.stop(),
    n.dom.classList.remove("ProseMirror-focused"),
    n.domObserver.start(),
    t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(),
    (n.focused = !1));
};
We.beforeinput = (n, e) => {
  if (yn && Cr && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: t } = n.input;
    setTimeout(() => {
      if (
        n.input.domChangeCount != t ||
        (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (r) => r(n, fu(8, "Backspace"))))
      )
        return;
      let { $cursor: o } = n.state.selection;
      o && o.pos > 0 && n.dispatch(n.state.tr.delete(o.pos - 1, o.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in ze) We[n] = ze[n];
function cr(n, e) {
  if (n == e) return !0;
  for (let t in n) if (n[t] !== e[t]) return !1;
  for (let t in e) if (!(t in n)) return !1;
  return !0;
}
let eh = class Au {
    constructor(e, t) {
      (this.toDOM = e), (this.spec = t || rn), (this.side = this.spec.side || 0);
    }
    map(e, t, o, r) {
      let { pos: i, deleted: s } = e.mapResult(t.from + r, this.side < 0 ? -1 : 1);
      return s ? null : new lt(i - o, i - o, this);
    }
    valid() {
      return !0;
    }
    eq(e) {
      return (
        this == e ||
        (e instanceof Au &&
          ((this.spec.key && this.spec.key == e.spec.key) ||
            (this.toDOM == e.toDOM && cr(this.spec, e.spec))))
      );
    }
    destroy(e) {
      this.spec.destroy && this.spec.destroy(e);
    }
  },
  Yo = class Ql {
    constructor(e, t) {
      (this.attrs = e), (this.spec = t || rn);
    }
    map(e, t, o, r) {
      let i = e.map(t.from + r, this.spec.inclusiveStart ? -1 : 1) - o,
        s = e.map(t.to + r, this.spec.inclusiveEnd ? 1 : -1) - o;
      return i >= s ? null : new lt(i, s, this);
    }
    valid(e, t) {
      return t.from < t.to;
    }
    eq(e) {
      return this == e || (e instanceof Ql && cr(this.attrs, e.attrs) && cr(this.spec, e.spec));
    }
    static is(e) {
      return e.type instanceof Ql;
    }
    destroy() {}
  },
  Ib = class Iu {
    constructor(e, t) {
      (this.attrs = e), (this.spec = t || rn);
    }
    map(e, t, o, r) {
      let i = e.mapResult(t.from + r, 1);
      if (i.deleted) return null;
      let s = e.mapResult(t.to + r, -1);
      return s.deleted || s.pos <= i.pos ? null : new lt(i.pos - o, s.pos - o, this);
    }
    valid(e, t) {
      let { index: o, offset: r } = e.content.findIndex(t.from),
        i;
      return r == t.from && !(i = e.child(o)).isText && r + i.nodeSize == t.to;
    }
    eq(e) {
      return this == e || (e instanceof Iu && cr(this.attrs, e.attrs) && cr(this.spec, e.spec));
    }
    destroy() {}
  };
class lt {
  constructor(e, t, o) {
    (this.from = e), (this.to = t), (this.type = o);
  }
  copy(e, t) {
    return new lt(e, t, this.type);
  }
  eq(e, t = 0) {
    return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
  }
  map(e, t, o) {
    return this.type.map(e, this, t, o);
  }
  static widget(e, t, o) {
    return new lt(e, e, new eh(t, o));
  }
  static inline(e, t, o, r) {
    return new lt(e, t, new Yo(o, r));
  }
  static node(e, t, o, r) {
    return new lt(e, t, new Ib(o, r));
  }
  get spec() {
    return this.type.spec;
  }
  get inline() {
    return this.type instanceof Yo;
  }
  get widget() {
    return this.type instanceof eh;
  }
}
const Bn = [],
  rn = {};
let dt = class mt {
  constructor(e, t) {
    (this.local = e.length ? e : Bn), (this.children = t.length ? t : Bn);
  }
  static create(e, t) {
    return t.length ? Mi(t, e, 0, rn) : ke;
  }
  find(e, t, o) {
    let r = [];
    return this.findInner(e ?? 0, t ?? 1e9, r, 0, o), r;
  }
  findInner(e, t, o, r, i) {
    for (let s = 0; s < this.local.length; s++) {
      let l = this.local[s];
      l.from <= t && l.to >= e && (!i || i(l.spec)) && o.push(l.copy(l.from + r, l.to + r));
    }
    for (let s = 0; s < this.children.length; s += 3)
      if (this.children[s] < t && this.children[s + 1] > e) {
        let l = this.children[s] + 1;
        this.children[s + 2].findInner(e - l, t - l, o, r + l, i);
      }
  }
  map(e, t, o) {
    return this == ke || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, o || rn);
  }
  mapInner(e, t, o, r, i) {
    let s;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, o, r);
      a && a.type.valid(t, a)
        ? (s || (s = [])).push(a)
        : i.onRemove && i.onRemove(this.local[l].spec);
    }
    return this.children.length
      ? Rb(this.children, s || [], e, t, o, r, i)
      : s
        ? new mt(s.sort(sn), Bn)
        : ke;
  }
  add(e, t) {
    return t.length ? (this == ke ? mt.create(e, t) : this.addInner(e, t, 0)) : this;
  }
  addInner(e, t, o) {
    let r,
      i = 0;
    e.forEach((l, a) => {
      let c = a + o,
        d;
      if ((d = Ru(t, l, c))) {
        for (r || (r = this.children.slice()); i < r.length && r[i] < a; ) i += 3;
        r[i] == a
          ? (r[i + 2] = r[i + 2].addInner(l, d, c + 1))
          : r.splice(i, 0, a, a + l.nodeSize, Mi(d, l, c + 1, rn)),
          (i += 3);
      }
    });
    let s = Du(i ? zu(t) : t, -o);
    for (let l = 0; l < s.length; l++) s[l].type.valid(e, s[l]) || s.splice(l--, 1);
    return new mt(s.length ? this.local.concat(s).sort(sn) : this.local, r || this.children);
  }
  remove(e) {
    return e.length == 0 || this == ke ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let o = this.children,
      r = this.local;
    for (let i = 0; i < o.length; i += 3) {
      let s,
        l = o[i] + t,
        a = o[i + 1] + t;
      for (let d = 0, h; d < e.length; d++)
        (h = e[d]) && h.from > l && h.to < a && ((e[d] = null), (s || (s = [])).push(h));
      if (!s) continue;
      o == this.children && (o = this.children.slice());
      let c = o[i + 2].removeInner(s, l + 1);
      c != ke ? (o[i + 2] = c) : (o.splice(i, 3), (i -= 3));
    }
    if (r.length) {
      for (let i = 0, s; i < e.length; i++)
        if ((s = e[i]))
          for (let l = 0; l < r.length; l++)
            r[l].eq(s, t) && (r == this.local && (r = this.local.slice()), r.splice(l--, 1));
    }
    return o == this.children && r == this.local ? this : r.length || o.length ? new mt(r, o) : ke;
  }
  forChild(e, t) {
    if (this == ke) return this;
    if (t.isLeaf) return mt.empty;
    let o, r;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (o = this.children[l + 2]);
        break;
      }
    let i = e + 1,
      s = i + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < s && a.to > i && a.type instanceof Yo) {
        let c = Math.max(i, a.from) - i,
          d = Math.min(s, a.to) - i;
        c < d && (r || (r = [])).push(a.copy(c, d));
      }
    }
    if (r) {
      let l = new mt(r.sort(sn), Bn);
      return o ? new Db([l, o]) : l;
    }
    return o || ke;
  }
  eq(e) {
    if (this == e) return !0;
    if (
      !(e instanceof mt) ||
      this.local.length != e.local.length ||
      this.children.length != e.children.length
    )
      return !1;
    for (let t = 0; t < this.local.length; t++) if (!this.local[t].eq(e.local[t])) return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (
        this.children[t] != e.children[t] ||
        this.children[t + 1] != e.children[t + 1] ||
        !this.children[t + 2].eq(e.children[t + 2])
      )
        return !1;
    return !0;
  }
  locals(e) {
    return Ha(this.localsInner(e));
  }
  localsInner(e) {
    if (this == ke) return Bn;
    if (e.inlineContent || !this.local.some(Yo.is)) return this.local;
    let t = [];
    for (let o = 0; o < this.local.length; o++)
      this.local[o].type instanceof Yo || t.push(this.local[o]);
    return t;
  }
};
dt.empty = new dt([], []);
dt.removeOverlap = Ha;
const ke = dt.empty;
let Db = class Fn {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const o = this.members.map((r) => r.map(e, t, rn));
    return Fn.from(o);
  }
  forChild(e, t) {
    if (t.isLeaf) return dt.empty;
    let o = [];
    for (let r = 0; r < this.members.length; r++) {
      let i = this.members[r].forChild(e, t);
      i != ke && (i instanceof Fn ? (o = o.concat(i.members)) : o.push(i));
    }
    return Fn.from(o);
  }
  eq(e) {
    if (!(e instanceof Fn) || e.members.length != this.members.length) return !1;
    for (let t = 0; t < this.members.length; t++) if (!this.members[t].eq(e.members[t])) return !1;
    return !0;
  }
  locals(e) {
    let t,
      o = !0;
    for (let r = 0; r < this.members.length; r++) {
      let i = this.members[r].localsInner(e);
      if (i.length)
        if (!t) t = i;
        else {
          o && ((t = t.slice()), (o = !1));
          for (let s = 0; s < i.length; s++) t.push(i[s]);
        }
    }
    return t ? Ha(o ? t : t.sort(sn)) : Bn;
  }
  static from(e) {
    switch (e.length) {
      case 0:
        return ke;
      case 1:
        return e[0];
      default:
        return new Fn(
          e.every((t) => t instanceof dt)
            ? e
            : e.reduce((t, o) => t.concat(o instanceof dt ? o : o.members), []),
        );
    }
  }
};
function Rb(n, e, t, o, r, i, s) {
  let l = n.slice();
  for (let c = 0, d = i; c < t.maps.length; c++) {
    let h = 0;
    t.maps[c].forEach((p, f, u, m) => {
      let g = m - u - (f - p);
      for (let y = 0; y < l.length; y += 3) {
        let w = l[y + 1];
        if (w < 0 || p > w + d - h) continue;
        let b = l[y] + d - h;
        f >= b ? (l[y + 1] = p <= b ? -2 : -1) : p >= d && g && ((l[y] += g), (l[y + 1] += g));
      }
      h += g;
    }),
      (d = t.maps[c].map(d, -1));
  }
  let a = !1;
  for (let c = 0; c < l.length; c += 3)
    if (l[c + 1] < 0) {
      if (l[c + 1] == -2) {
        (a = !0), (l[c + 1] = -1);
        continue;
      }
      let d = t.map(n[c] + i),
        h = d - r;
      if (h < 0 || h >= o.content.size) {
        a = !0;
        continue;
      }
      let p = t.map(n[c + 1] + i, -1),
        f = p - r,
        { index: u, offset: m } = o.content.findIndex(h),
        g = o.maybeChild(u);
      if (g && m == h && m + g.nodeSize == f) {
        let y = l[c + 2].mapInner(t, g, d + 1, n[c] + i + 1, s);
        y != ke ? ((l[c] = h), (l[c + 1] = f), (l[c + 2] = y)) : ((l[c + 1] = -2), (a = !0));
      } else a = !0;
    }
  if (a) {
    let c = zb(l, n, e, t, r, i, s),
      d = Mi(c, o, 0, s);
    e = d.local;
    for (let h = 0; h < l.length; h += 3) l[h + 1] < 0 && (l.splice(h, 3), (h -= 3));
    for (let h = 0, p = 0; h < d.children.length; h += 3) {
      let f = d.children[h];
      for (; p < l.length && l[p] < f; ) p += 3;
      l.splice(p, 0, d.children[h], d.children[h + 1], d.children[h + 2]);
    }
  }
  return new dt(e.sort(sn), l);
}
function Du(n, e) {
  if (!e || !n.length) return n;
  let t = [];
  for (let o = 0; o < n.length; o++) {
    let r = n[o];
    t.push(new lt(r.from + e, r.to + e, r.type));
  }
  return t;
}
function zb(n, e, t, o, r, i, s) {
  function l(a, c) {
    for (let d = 0; d < a.local.length; d++) {
      let h = a.local[d].map(o, r, c);
      h ? t.push(h) : s.onRemove && s.onRemove(a.local[d].spec);
    }
    for (let d = 0; d < a.children.length; d += 3) l(a.children[d + 2], a.children[d] + c + 1);
  }
  for (let a = 0; a < n.length; a += 3) n[a + 1] == -1 && l(n[a + 2], e[a] + i + 1);
  return t;
}
function Ru(n, e, t) {
  if (e.isLeaf) return null;
  let o = t + e.nodeSize,
    r = null;
  for (let i = 0, s; i < n.length; i++)
    (s = n[i]) && s.from > t && s.to < o && ((r || (r = [])).push(s), (n[i] = null));
  return r;
}
function zu(n) {
  let e = [];
  for (let t = 0; t < n.length; t++) n[t] != null && e.push(n[t]);
  return e;
}
function Mi(n, e, t, o) {
  let r = [],
    i = !1;
  e.forEach((l, a) => {
    let c = Ru(n, l, a + t);
    if (c) {
      i = !0;
      let d = Mi(c, l, t + a + 1, o);
      d != ke && r.push(a, a + l.nodeSize, d);
    }
  });
  let s = Du(i ? zu(n) : n, -t).sort(sn);
  for (let l = 0; l < s.length; l++)
    s[l].type.valid(e, s[l]) || (o.onRemove && o.onRemove(s[l].spec), s.splice(l--, 1));
  return s.length || r.length ? new dt(s, r) : ke;
}
function sn(n, e) {
  return n.from - e.from || n.to - e.to;
}
function Ha(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let o = e[t];
    if (o.from != o.to)
      for (let r = t + 1; r < e.length; r++) {
        let i = e[r];
        if (i.from == o.from) {
          i.to != o.to &&
            (e == n && (e = n.slice()),
            (e[r] = i.copy(i.from, o.to)),
            th(e, r + 1, i.copy(o.to, i.to)));
          continue;
        } else {
          i.from < o.to &&
            (e == n && (e = n.slice()),
            (e[t] = o.copy(o.from, i.from)),
            th(e, r, o.copy(i.from, o.to)));
          break;
        }
      }
  }
  return e;
}
function th(n, e, t) {
  for (; e < n.length && sn(t, n[e]) > 0; ) e++;
  n.splice(e, 0, t);
}
var eo = {
    8: "Backspace",
    9: "Tab",
    10: "Enter",
    12: "NumLock",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    44: "PrintScreen",
    45: "Insert",
    46: "Delete",
    59: ";",
    61: "=",
    91: "Meta",
    92: "Meta",
    106: "*",
    107: "+",
    108: ",",
    109: "-",
    110: ".",
    111: "/",
    144: "NumLock",
    145: "ScrollLock",
    160: "Shift",
    161: "Shift",
    162: "Control",
    163: "Control",
    164: "Alt",
    165: "Alt",
    173: "-",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
  },
  Zl = {
    48: ")",
    49: "!",
    50: "@",
    51: "#",
    52: "$",
    53: "%",
    54: "^",
    55: "&",
    56: "*",
    57: "(",
    59: ":",
    61: "+",
    173: "_",
    186: ":",
    187: "+",
    188: "<",
    189: "_",
    190: ">",
    191: "?",
    192: "~",
    219: "{",
    220: "|",
    221: "}",
    222: '"',
  };
for (var ie = 0; ie < 10; ie++) eo[48 + ie] = eo[96 + ie] = String(ie);
for (var ie = 1; ie <= 24; ie++) eo[ie + 111] = "F" + ie;
for (var ie = 65; ie <= 90; ie++)
  (eo[ie] = String.fromCharCode(ie + 32)), (Zl[ie] = String.fromCharCode(ie));
for (var Fs in eo) Zl.hasOwnProperty(Fs) || (Zl[Fs] = eo[Fs]);
const Pb = (n, e) =>
  n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Pu(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const Bb = (n, e, t) => {
    let o = Pu(n, t);
    if (!o) return !1;
    let r = Ua(o);
    if (!r) {
      let s = o.blockRange(),
        l = s && po(s);
      return l == null ? !1 : (e && e(n.tr.lift(s, l).scrollIntoView()), !0);
    }
    let i = r.nodeBefore;
    if (!i.type.spec.isolating && ju(n, r, e)) return !0;
    if (o.parent.content.size == 0 && (to(i, "end") || E.isSelectable(i))) {
      let s = Va(n.doc, o.before(), o.after(), T.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let l = n.tr.step(s);
          l.setSelection(
            to(i, "end")
              ? V.findFrom(l.doc.resolve(l.mapping.map(r.pos, -1)), -1)
              : E.create(l.doc, r.pos - i.nodeSize),
          ),
            e(l.scrollIntoView());
        }
        return !0;
      }
    }
    return i.isAtom && r.depth == o.depth - 1
      ? (e && e(n.tr.delete(r.pos - i.nodeSize, r.pos).scrollIntoView()), !0)
      : !1;
  },
  Fb = (n, e, t) => {
    let o = Pu(n, t);
    if (!o) return !1;
    let r = Ua(o);
    return r ? Bu(n, r, e) : !1;
  },
  Vb = (n, e, t) => {
    let o = Fu(n, t);
    if (!o) return !1;
    let r = Ga(o);
    return r ? Bu(n, r, e) : !1;
  };
function Bu(n, e, t) {
  let o = e.nodeBefore,
    r = o,
    i = e.pos - 1;
  for (; !r.isTextblock; i--) {
    if (r.type.spec.isolating) return !1;
    let d = r.lastChild;
    if (!d) return !1;
    r = d;
  }
  let s = e.nodeAfter,
    l = s,
    a = e.pos + 1;
  for (; !l.isTextblock; a++) {
    if (l.type.spec.isolating) return !1;
    let d = l.firstChild;
    if (!d) return !1;
    l = d;
  }
  let c = Va(n.doc, i, a, T.empty);
  if (!c || c.from != i || (c instanceof ho && c.slice.size >= a - i)) return !1;
  if (t) {
    let d = n.tr.step(c);
    d.setSelection(q.create(d.doc, i)), t(d.scrollIntoView());
  }
  return !0;
}
function to(n, e, t = !1) {
  for (let o = n; o; o = e == "start" ? o.firstChild : o.lastChild) {
    if (o.isTextblock) return !0;
    if (t && o.childCount != 1) return !1;
  }
  return !1;
}
const jb = (n, e, t) => {
  let { $head: o, empty: r } = n.selection,
    i = o;
  if (!r) return !1;
  if (o.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : o.parentOffset > 0) return !1;
    i = Ua(o);
  }
  let s = i && i.nodeBefore;
  return !s || !E.isSelectable(s)
    ? !1
    : (e && e(n.tr.setSelection(E.create(n.doc, i.pos - s.nodeSize)).scrollIntoView()), !0);
};
function Ua(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0) return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating) break;
    }
  return null;
}
function Fu(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size)
    ? null
    : t;
}
const Jb = (n, e, t) => {
    let o = Fu(n, t);
    if (!o) return !1;
    let r = Ga(o);
    if (!r) return !1;
    let i = r.nodeAfter;
    if (ju(n, r, e)) return !0;
    if (o.parent.content.size == 0 && (to(i, "start") || E.isSelectable(i))) {
      let s = Va(n.doc, o.before(), o.after(), T.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let l = n.tr.step(s);
          l.setSelection(
            to(i, "start")
              ? V.findFrom(l.doc.resolve(l.mapping.map(r.pos)), 1)
              : E.create(l.doc, l.mapping.map(r.pos)),
          ),
            e(l.scrollIntoView());
        }
        return !0;
      }
    }
    return i.isAtom && r.depth == o.depth - 1
      ? (e && e(n.tr.delete(r.pos, r.pos + i.nodeSize).scrollIntoView()), !0)
      : !1;
  },
  Lb = (n, e, t) => {
    let { $head: o, empty: r } = n.selection,
      i = o;
    if (!r) return !1;
    if (o.parent.isTextblock) {
      if (t ? !t.endOfTextblock("forward", n) : o.parentOffset < o.parent.content.size) return !1;
      i = Ga(o);
    }
    let s = i && i.nodeAfter;
    return !s || !E.isSelectable(s)
      ? !1
      : (e && e(n.tr.setSelection(E.create(n.doc, i.pos)).scrollIntoView()), !0);
  };
function Ga(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount) return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating) break;
    }
  return null;
}
const qb = (n, e) => {
    let t = n.selection,
      o = t instanceof E,
      r;
    if (o) {
      if (t.node.isTextblock || !mn(n.doc, t.from)) return !1;
      r = t.from;
    } else if (((r = Zi(n.doc, t.from, -1)), r == null)) return !1;
    if (e) {
      let i = n.tr.join(r);
      o && i.setSelection(E.create(i.doc, r - n.doc.resolve(r).nodeBefore.nodeSize)),
        e(i.scrollIntoView());
    }
    return !0;
  },
  Kb = (n, e) => {
    let t = n.selection,
      o;
    if (t instanceof E) {
      if (t.node.isTextblock || !mn(n.doc, t.to)) return !1;
      o = t.to;
    } else if (((o = Zi(n.doc, t.to, 1)), o == null)) return !1;
    return e && e(n.tr.join(o).scrollIntoView()), !0;
  },
  Wb = (n, e) => {
    let { $from: t, $to: o } = n.selection,
      r = t.blockRange(o),
      i = r && po(r);
    return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
  },
  Hb = (n, e) => {
    let { $head: t, $anchor: o } = n.selection;
    return !t.parent.type.spec.code || !t.sameParent(o)
      ? !1
      : (e &&
          e(
            n.tr
              .insertText(
                `
`,
              )
              .scrollIntoView(),
          ),
        !0);
  };
function Vu(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs()) return t;
  }
  return null;
}
const Ub = (n, e) => {
    let { $head: t, $anchor: o } = n.selection;
    if (!t.parent.type.spec.code || !t.sameParent(o)) return !1;
    let r = t.node(-1),
      i = t.indexAfter(-1),
      s = Vu(r.contentMatchAt(i));
    if (!s || !r.canReplaceWith(i, i, s)) return !1;
    if (e) {
      let l = t.after(),
        a = n.tr.replaceWith(l, l, s.createAndFill());
      a.setSelection(V.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
    }
    return !0;
  },
  Gb = (n, e) => {
    let t = n.selection,
      { $from: o, $to: r } = t;
    if (t instanceof on || o.parent.inlineContent || r.parent.inlineContent) return !1;
    let i = Vu(r.parent.contentMatchAt(r.indexAfter()));
    if (!i || !i.isTextblock) return !1;
    if (e) {
      let s = (!o.parentOffset && r.index() < r.parent.childCount ? o : r).pos,
        l = n.tr.insert(s, i.createAndFill());
      l.setSelection(q.create(l.doc, s + 1)), e(l.scrollIntoView());
    }
    return !0;
  },
  Yb = (n, e) => {
    let { $cursor: t } = n.selection;
    if (!t || t.parent.content.size) return !1;
    if (t.depth > 1 && t.after() != t.end(-1)) {
      let i = t.before();
      if (Hn(n.doc, i)) return e && e(n.tr.split(i).scrollIntoView()), !0;
    }
    let o = t.blockRange(),
      r = o && po(o);
    return r == null ? !1 : (e && e(n.tr.lift(o, r).scrollIntoView()), !0);
  },
  Xb = (n, e) => {
    let { $from: t, to: o } = n.selection,
      r,
      i = t.sharedDepth(o);
    return i == 0 ? !1 : ((r = t.before(i)), e && e(n.tr.setSelection(E.create(n.doc, r))), !0);
  };
function Qb(n, e, t) {
  let o = e.nodeBefore,
    r = e.nodeAfter,
    i = e.index();
  return !o || !r || !o.type.compatibleContent(r.type)
    ? !1
    : !o.content.size && e.parent.canReplace(i - 1, i)
      ? (t && t(n.tr.delete(e.pos - o.nodeSize, e.pos).scrollIntoView()), !0)
      : !e.parent.canReplace(i, i + 1) || !(r.isTextblock || mn(n.doc, e.pos))
        ? !1
        : (t &&
            t(
              n.tr
                .clearIncompatible(e.pos, o.type, o.contentMatchAt(o.childCount))
                .join(e.pos)
                .scrollIntoView(),
            ),
          !0);
}
function ju(n, e, t) {
  let o = e.nodeBefore,
    r = e.nodeAfter,
    i,
    s;
  if (o.type.spec.isolating || r.type.spec.isolating) return !1;
  if (Qb(n, e, t)) return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (
    l &&
    (i = (s = o.contentMatchAt(o.childCount)).findWrapping(r.type)) &&
    s.matchType(i[0] || r.type).validEnd
  ) {
    if (t) {
      let h = e.pos + r.nodeSize,
        p = v.empty;
      for (let m = i.length - 1; m >= 0; m--) p = v.from(i[m].create(null, p));
      p = v.from(o.copy(p));
      let f = n.tr.step(new tt(e.pos - 1, h, e.pos, h, new T(p, 1, 0), i.length, !0)),
        u = h + 2 * i.length;
      mn(f.doc, u) && f.join(u), t(f.scrollIntoView());
    }
    return !0;
  }
  let a = V.findFrom(e, 1),
    c = a && a.$from.blockRange(a.$to),
    d = c && po(c);
  if (d != null && d >= e.depth) return t && t(n.tr.lift(c, d).scrollIntoView()), !0;
  if (l && to(r, "start", !0) && to(o, "end")) {
    let h = o,
      p = [];
    for (; p.push(h), !h.isTextblock; ) h = h.lastChild;
    let f = r,
      u = 1;
    for (; !f.isTextblock; f = f.firstChild) u++;
    if (h.canReplace(h.childCount, h.childCount, f.content)) {
      if (t) {
        let m = v.empty;
        for (let y = p.length - 1; y >= 0; y--) m = v.from(p[y].copy(m));
        let g = n.tr.step(
          new tt(
            e.pos - p.length,
            e.pos + r.nodeSize,
            e.pos + u,
            e.pos + r.nodeSize - u,
            new T(m, p.length, 0),
            0,
            !0,
          ),
        );
        t(g.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Ju(n) {
  return function (e, t) {
    let o = e.selection,
      r = n < 0 ? o.$from : o.$to,
      i = r.depth;
    for (; r.node(i).isInline; ) {
      if (!i) return !1;
      i--;
    }
    return r.node(i).isTextblock
      ? (t && t(e.tr.setSelection(q.create(e.doc, n < 0 ? r.start(i) : r.end(i)))), !0)
      : !1;
  };
}
const Zb = Ju(-1),
  _b = Ju(1);
function ev(n, e = null) {
  return function (t, o) {
    let { $from: r, $to: i } = t.selection,
      s = r.blockRange(i),
      l = s && ou(s, n, e);
    return l ? (o && o(t.tr.wrap(s, l).scrollIntoView()), !0) : !1;
  };
}
function nh(n, e = null) {
  return function (t, o) {
    let r = !1;
    for (let i = 0; i < t.selection.ranges.length && !r; i++) {
      let {
        $from: { pos: s },
        $to: { pos: l },
      } = t.selection.ranges[i];
      t.doc.nodesBetween(s, l, (a, c) => {
        if (r) return !1;
        if (!(!a.isTextblock || a.hasMarkup(n, e)))
          if (a.type == n) r = !0;
          else {
            let d = t.doc.resolve(c),
              h = d.index();
            r = d.parent.canReplaceWith(h, h + 1, n);
          }
      });
    }
    if (!r) return !1;
    if (o) {
      let i = t.tr;
      for (let s = 0; s < t.selection.ranges.length; s++) {
        let {
          $from: { pos: l },
          $to: { pos: a },
        } = t.selection.ranges[s];
        i.setBlockType(l, a, n, e);
      }
      o(i.scrollIntoView());
    }
    return !0;
  };
}
typeof navigator < "u"
  ? /Mac|iP(hone|[oa]d)/.test(navigator.platform)
  : typeof os < "u" && os.platform && os.platform() == "darwin";
function tv(n, e = null) {
  return function (t, o) {
    let { $from: r, $to: i } = t.selection,
      s = r.blockRange(i),
      l = !1,
      a = s;
    if (!s) return !1;
    if (s.depth >= 2 && r.node(s.depth - 1).type.compatibleContent(n) && s.startIndex == 0) {
      if (r.index(s.depth - 1) == 0) return !1;
      let d = t.doc.resolve(s.start - 2);
      (a = new Vl(d, d, s.depth)),
        s.endIndex < s.parent.childCount && (s = new Vl(r, t.doc.resolve(i.end(s.depth)), s.depth)),
        (l = !0);
    }
    let c = ou(a, n, e, s);
    return c ? (o && o(nv(t.tr, s, c, l, n).scrollIntoView()), !0) : !1;
  };
}
function nv(n, e, t, o, r) {
  let i = v.empty;
  for (let d = t.length - 1; d >= 0; d--) i = v.from(t[d].type.create(t[d].attrs, i));
  n.step(new tt(e.start - (o ? 2 : 0), e.end, e.start, e.end, new T(i, 0, 0), t.length, !0));
  let s = 0;
  for (let d = 0; d < t.length; d++) t[d].type == r && (s = d + 1);
  let l = t.length - s,
    a = e.start + t.length - (o ? 2 : 0),
    c = e.parent;
  for (let d = e.startIndex, h = e.endIndex, p = !0; d < h; d++, p = !1)
    !p && Hn(n.doc, a, l) && (n.split(a, l), (a += 2 * l)), (a += c.child(d).nodeSize);
  return n;
}
function ov(n) {
  return function (e, t) {
    let { $from: o, $to: r } = e.selection,
      i = o.blockRange(r, (s) => s.childCount > 0 && s.firstChild.type == n);
    return i ? (t ? (o.node(i.depth - 1).type == n ? rv(e, t, n, i) : iv(e, t, i)) : !0) : !1;
  };
}
function rv(n, e, t, o) {
  let r = n.tr,
    i = o.end,
    s = o.$to.end(o.depth);
  i < s &&
    (r.step(new tt(i - 1, s, i, s, new T(v.from(t.create(null, o.parent.copy())), 1, 0), 1, !0)),
    (o = new Vl(r.doc.resolve(o.$from.pos), r.doc.resolve(s), o.depth)));
  const l = po(o);
  if (l == null) return !1;
  r.lift(o, l);
  let a = r.mapping.map(i, -1) - 1;
  return mn(r.doc, a) && r.join(a), e(r.scrollIntoView()), !0;
}
function iv(n, e, t) {
  let o = n.tr,
    r = t.parent;
  for (let f = t.end, u = t.endIndex - 1, m = t.startIndex; u > m; u--)
    (f -= r.child(u).nodeSize), o.delete(f - 1, f + 1);
  let i = o.doc.resolve(t.start),
    s = i.nodeAfter;
  if (o.mapping.map(t.end) != t.start + i.nodeAfter.nodeSize) return !1;
  let l = t.startIndex == 0,
    a = t.endIndex == r.childCount,
    c = i.node(-1),
    d = i.index(-1);
  if (!c.canReplace(d + (l ? 0 : 1), d + 1, s.content.append(a ? v.empty : v.from(r)))) return !1;
  let h = i.pos,
    p = h + s.nodeSize;
  return (
    o.step(
      new tt(
        h - (l ? 1 : 0),
        p + (a ? 1 : 0),
        h + 1,
        p - 1,
        new T(
          (l ? v.empty : v.from(r.copy(v.empty))).append(a ? v.empty : v.from(r.copy(v.empty))),
          l ? 0 : 1,
          a ? 0 : 1,
        ),
        l ? 0 : 1,
      ),
    ),
    e(o.scrollIntoView()),
    !0
  );
}
function sv(n) {
  return function (e, t) {
    let { $from: o, $to: r } = e.selection,
      i = o.blockRange(r, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!i) return !1;
    let s = i.startIndex;
    if (s == 0) return !1;
    let l = i.parent,
      a = l.child(s - 1);
    if (a.type != n) return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type,
        d = v.from(c ? n.create() : null),
        h = new T(v.from(n.create(null, v.from(l.type.create(null, d)))), c ? 3 : 1, 0),
        p = i.start,
        f = i.end;
      t(e.tr.step(new tt(p - (c ? 3 : 1), f, p, f, h, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Lu(n) {
  const { state: e, transaction: t } = n;
  let { selection: o } = t,
    { doc: r } = t,
    { storedMarks: i } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return i;
    },
    get selection() {
      return o;
    },
    get doc() {
      return r;
    },
    get tr() {
      return (o = t.selection), (r = t.doc), (i = t.storedMarks), t;
    },
  };
}
let lv = class {
  constructor(e) {
    (this.editor = e.editor),
      (this.rawCommands = this.editor.extensionManager.commands),
      (this.customState = e.state);
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: t, state: o } = this,
      { view: r } = t,
      { tr: i } = o,
      s = this.buildProps(i);
    return Object.fromEntries(
      Object.entries(e).map(([l, a]) => [
        l,
        (...c) => {
          const d = a(...c)(s);
          return !i.getMeta("preventDispatch") && !this.hasCustomState && r.dispatch(i), d;
        },
      ]),
    );
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: o, editor: r, state: i } = this,
      { view: s } = r,
      l = [],
      a = !!e,
      c = e || i.tr,
      d = () => (
        !a && t && !c.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(c),
        l.every((p) => p === !0)
      ),
      h = {
        ...Object.fromEntries(
          Object.entries(o).map(([p, f]) => [
            p,
            (...u) => {
              const m = this.buildProps(c, t),
                g = f(...u)(m);
              return l.push(g), h;
            },
          ]),
        ),
        run: d,
      };
    return h;
  }
  createCan(e) {
    const { rawCommands: t, state: o } = this,
      r = !1,
      i = e || o.tr,
      s = this.buildProps(i, r);
    return {
      ...Object.fromEntries(
        Object.entries(t).map(([l, a]) => [l, (...c) => a(...c)({ ...s, dispatch: void 0 })]),
      ),
      chain: () => this.createChain(i, r),
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: o, editor: r, state: i } = this,
      { view: s } = r,
      l = {
        tr: e,
        editor: r,
        view: s,
        state: Lu({ state: i, transaction: e }),
        dispatch: t ? () => {} : void 0,
        chain: () => this.createChain(e, t),
        can: () => this.createCan(e),
        get commands() {
          return Object.fromEntries(Object.entries(o).map(([a, c]) => [a, (...d) => c(...d)(l)]));
        },
      };
    return l;
  }
};
function Ie(n, e, t) {
  return n.config[e] === void 0 && n.parent
    ? Ie(n.parent, e, t)
    : typeof n.config[e] == "function"
      ? n.config[e].bind({ ...t, parent: n.parent ? Ie(n.parent, e, t) : null })
      : n.config[e];
}
function av(n) {
  const e = n.filter((r) => r.type === "extension"),
    t = n.filter((r) => r.type === "node"),
    o = n.filter((r) => r.type === "mark");
  return { baseExtensions: e, nodeExtensions: t, markExtensions: o };
}
function ae(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
function cv(n) {
  return typeof n == "function";
}
function Le(n, e = void 0, ...t) {
  return cv(n) ? (e ? n.bind(e)(...t) : n(...t)) : n;
}
function dv(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function hv(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Vs(n) {
  return hv(n) !== "Object"
    ? !1
    : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function Ya(n, e) {
  const t = { ...n };
  return (
    Vs(n) &&
      Vs(e) &&
      Object.keys(e).forEach((o) => {
        Vs(e[o])
          ? o in n
            ? (t[o] = Ya(n[o], e[o]))
            : Object.assign(t, { [o]: e[o] })
          : Object.assign(t, { [o]: e[o] });
      }),
    t
  );
}
let fo = class _l {
  constructor(e = {}) {
    (this.type = "extension"),
      (this.name = "extension"),
      (this.parent = null),
      (this.child = null),
      (this.config = { name: this.name, defaultOptions: {} }),
      (this.config = { ...this.config, ...e }),
      (this.name = this.config.name),
      e.defaultOptions &&
        Object.keys(e.defaultOptions).length > 0 &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`,
        ),
      (this.options = this.config.defaultOptions),
      this.config.addOptions && (this.options = Le(Ie(this, "addOptions", { name: this.name }))),
      (this.storage = Le(Ie(this, "addStorage", { name: this.name, options: this.options })) || {});
  }
  static create(e = {}) {
    return new _l(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return (
      (t.options = Ya(this.options, e)),
      (t.storage = Le(Ie(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
  extend(e = {}) {
    const t = new _l({ ...this.config, ...e });
    return (
      (t.parent = this),
      (this.child = t),
      (t.name = e.name ? e.name : t.parent.name),
      e.defaultOptions &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`,
        ),
      (t.options = Le(Ie(t, "addOptions", { name: t.name }))),
      (t.storage = Le(Ie(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
};
function pv(n, e, t) {
  const { from: o, to: r } = e,
    {
      blockSeparator: i = `

`,
      textSerializers: s = {},
    } = t || {};
  let l = "",
    a = !0;
  return (
    n.nodesBetween(o, r, (c, d, h, p) => {
      var f;
      const u = s == null ? void 0 : s[c.type.name];
      u
        ? (c.isBlock && !a && ((l += i), (a = !0)),
          h && (l += u({ node: c, pos: d, parent: h, index: p, range: e })))
        : c.isText
          ? ((l +=
              (f = c == null ? void 0 : c.text) === null || f === void 0
                ? void 0
                : f.slice(Math.max(o, d) - d, r - d)),
            (a = !1))
          : c.isBlock && !a && ((l += i), (a = !0));
    }),
    l
  );
}
function fv(n) {
  return Object.fromEntries(
    Object.entries(n.nodes)
      .filter(([, e]) => e.spec.toText)
      .map(([e, t]) => [e, t.spec.toText]),
  );
}
fo.create({
  name: "clipboardTextSerializer",
  addProseMirrorPlugins() {
    return [
      new Sr({
        key: new $r("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this,
              { state: e, schema: t } = n,
              { doc: o, selection: r } = e,
              { ranges: i } = r,
              s = Math.min(...i.map((c) => c.$from.pos)),
              l = Math.max(...i.map((c) => c.$to.pos)),
              a = fv(t);
            return pv(o, { from: s, to: l }, { textSerializers: a });
          },
        },
      }),
    ];
  },
});
const uv =
    () =>
    ({ editor: n, view: e }) => (
      requestAnimationFrame(() => {
        var t;
        n.isDestroyed ||
          (e.dom.blur(),
          (t = window == null ? void 0 : window.getSelection()) === null ||
            t === void 0 ||
            t.removeAllRanges());
      }),
      !0
    ),
  mv =
    (n = !1) =>
    ({ commands: e }) =>
      e.setContent("", n),
  gv =
    () =>
    ({ state: n, tr: e, dispatch: t }) => {
      const { selection: o } = e,
        { ranges: r } = o;
      return (
        t &&
          r.forEach(({ $from: i, $to: s }) => {
            n.doc.nodesBetween(i.pos, s.pos, (l, a) => {
              if (l.type.isText) return;
              const { doc: c, mapping: d } = e,
                h = c.resolve(d.map(a)),
                p = c.resolve(d.map(a + l.nodeSize)),
                f = h.blockRange(p);
              if (!f) return;
              const u = po(f);
              if (l.type.isTextblock) {
                const { defaultType: m } = h.parent.contentMatchAt(h.index());
                e.setNodeMarkup(f.start, m);
              }
              (u || u === 0) && e.lift(f, u);
            });
          }),
        !0
      );
    },
  yv = (n) => (e) => n(e),
  kv =
    () =>
    ({ state: n, dispatch: e }) =>
      Gb(n, e),
  wv =
    (n, e) =>
    ({ editor: t, tr: o }) => {
      const { state: r } = t,
        i = r.doc.slice(n.from, n.to);
      o.deleteRange(n.from, n.to);
      const s = o.mapping.map(e);
      return o.insert(s, i.content), o.setSelection(new q(o.doc.resolve(s - 1))), !0;
    },
  bv =
    () =>
    ({ tr: n, dispatch: e }) => {
      const { selection: t } = n,
        o = t.$anchor.node();
      if (o.content.size > 0) return !1;
      const r = n.selection.$anchor;
      for (let i = r.depth; i > 0; i -= 1)
        if (r.node(i).type === o.type) {
          if (e) {
            const s = r.before(i),
              l = r.after(i);
            n.delete(s, l).scrollIntoView();
          }
          return !0;
        }
      return !1;
    },
  vv =
    (n) =>
    ({ tr: e, state: t, dispatch: o }) => {
      const r = ae(n, t.schema),
        i = e.selection.$anchor;
      for (let s = i.depth; s > 0; s -= 1)
        if (i.node(s).type === r) {
          if (o) {
            const l = i.before(s),
              a = i.after(s);
            e.delete(l, a).scrollIntoView();
          }
          return !0;
        }
      return !1;
    },
  xv =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      const { from: o, to: r } = n;
      return t && e.delete(o, r), !0;
    },
  Sv =
    () =>
    ({ state: n, dispatch: e }) =>
      Pb(n, e),
  $v =
    () =>
    ({ commands: n }) =>
      n.keyboardShortcut("Enter"),
  Mv =
    () =>
    ({ state: n, dispatch: e }) =>
      Ub(n, e);
function Ci(n, e, t = { strict: !0 }) {
  const o = Object.keys(e);
  return o.length
    ? o.every((r) => (t.strict ? e[r] === n[r] : dv(e[r]) ? e[r].test(n[r]) : e[r] === n[r]))
    : !0;
}
function ea(n, e, t = {}) {
  return n.find((o) => o.type === e && Ci(o.attrs, t));
}
function Cv(n, e, t = {}) {
  return !!ea(n, e, t);
}
function qu(n, e, t = {}) {
  if (!n || !e) return;
  let o = n.parent.childAfter(n.parentOffset);
  if (
    (n.parentOffset === o.offset && o.offset !== 0 && (o = n.parent.childBefore(n.parentOffset)),
    !o.node)
  )
    return;
  const r = ea([...o.node.marks], e, t);
  if (!r) return;
  let i = o.index,
    s = n.start() + o.offset,
    l = i + 1,
    a = s + o.node.nodeSize;
  for (ea([...o.node.marks], e, t); i > 0 && r.isInSet(n.parent.child(i - 1).marks); )
    (i -= 1), (s -= n.parent.child(i).nodeSize);
  for (; l < n.parent.childCount && Cv([...n.parent.child(l).marks], e, t); )
    (a += n.parent.child(l).nodeSize), (l += 1);
  return { from: s, to: a };
}
function Et(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
const Ov =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      const i = Et(n, o.schema),
        { doc: s, selection: l } = t,
        { $from: a, from: c, to: d } = l;
      if (r) {
        const h = qu(a, i, e);
        if (h && h.from <= c && h.to >= d) {
          const p = q.create(s, h.from, h.to);
          t.setSelection(p);
        }
      }
      return !0;
    },
  Nv = (n) => (e) => {
    const t = typeof n == "function" ? n(e) : n;
    for (let o = 0; o < t.length; o += 1) if (t[o](e)) return !0;
    return !1;
  };
function Ku(n) {
  return n instanceof q;
}
function Jt(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function Tv(n, e = null) {
  if (!e) return null;
  const t = V.atStart(n),
    o = V.atEnd(n);
  if (e === "start" || e === !0) return t;
  if (e === "end") return o;
  const r = t.from,
    i = o.to;
  return e === "all"
    ? q.create(n, Jt(0, r, i), Jt(n.content.size, r, i))
    : q.create(n, Jt(e, r, i), Jt(e, r, i));
}
function Xa() {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
      navigator.platform,
    ) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}
const Ev =
    (n = null, e = {}) =>
    ({ editor: t, view: o, tr: r, dispatch: i }) => {
      e = { scrollIntoView: !0, ...e };
      const s = () => {
        Xa() && o.dom.focus(),
          requestAnimationFrame(() => {
            t.isDestroyed ||
              (o.focus(), e != null && e.scrollIntoView && t.commands.scrollIntoView());
          });
      };
      if ((o.hasFocus() && n === null) || n === !1) return !0;
      if (i && n === null && !Ku(t.state.selection)) return s(), !0;
      const l = Tv(r.doc, n) || t.state.selection,
        a = t.state.selection.eq(l);
      return (
        i && (a || r.setSelection(l), a && r.storedMarks && r.setStoredMarks(r.storedMarks), s()),
        !0
      );
    },
  Av = (n, e) => (t) => n.every((o, r) => e(o, { ...t, index: r })),
  Iv =
    (n, e) =>
    ({ tr: t, commands: o }) =>
      o.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e),
  Wu = (n) => {
    const e = n.childNodes;
    for (let t = e.length - 1; t >= 0; t -= 1) {
      const o = e[t];
      o.nodeType === 3 && o.nodeValue && /^(\n\s\s|\n)$/.test(o.nodeValue)
        ? n.removeChild(o)
        : o.nodeType === 1 && Wu(o);
    }
    return n;
  };
function oh(n) {
  const e = `<body>${n}</body>`,
    t = new window.DOMParser().parseFromString(e, "text/html").body;
  return Wu(t);
}
function Oi(n, e, t) {
  if (((t = { slice: !0, parseOptions: {}, ...t }), typeof n == "object" && n !== null))
    try {
      return Array.isArray(n) && n.length > 0
        ? v.fromArray(n.map((o) => e.nodeFromJSON(o)))
        : e.nodeFromJSON(n);
    } catch (o) {
      return (
        console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", o),
        Oi("", e, t)
      );
    }
  if (typeof n == "string") {
    const o = Kf.fromSchema(e);
    return t.slice ? o.parseSlice(oh(n), t.parseOptions).content : o.parse(oh(n), t.parseOptions);
  }
  return Oi("", e, t);
}
function Dv(n, e, t) {
  const o = n.steps.length - 1;
  if (o < e) return;
  const r = n.steps[o];
  if (!(r instanceof ho || r instanceof tt)) return;
  const i = n.mapping.maps[o];
  let s = 0;
  i.forEach((l, a, c, d) => {
    s === 0 && (s = d);
  }),
    n.setSelection(V.near(n.doc.resolve(s), t));
}
const Rv = (n) => n.toString().startsWith("<"),
  zv =
    (n, e, t) =>
    ({ tr: o, dispatch: r, editor: i }) => {
      if (r) {
        t = { parseOptions: {}, updateSelection: !0, ...t };
        const s = Oi(e, i.schema, {
          parseOptions: { preserveWhitespace: "full", ...t.parseOptions },
        });
        if (s.toString() === "<>") return !0;
        let { from: l, to: a } =
            typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to },
          c = !0,
          d = !0;
        if (
          ((Rv(s) ? s : [s]).forEach((h) => {
            h.check(), (c = c ? h.isText && h.marks.length === 0 : !1), (d = d ? h.isBlock : !1);
          }),
          l === a && d)
        ) {
          const { parent: h } = o.doc.resolve(l);
          h.isTextblock && !h.type.spec.code && !h.childCount && ((l -= 1), (a += 1));
        }
        c
          ? Array.isArray(e)
            ? o.insertText(e.map((h) => h.text || "").join(""), l, a)
            : typeof e == "object" && e && e.text
              ? o.insertText(e.text, l, a)
              : o.insertText(e, l, a)
          : o.replaceWith(l, a, s),
          t.updateSelection && Dv(o, o.steps.length - 1, -1);
      }
      return !0;
    },
  Pv =
    () =>
    ({ state: n, dispatch: e }) =>
      qb(n, e),
  Bv =
    () =>
    ({ state: n, dispatch: e }) =>
      Kb(n, e),
  Fv =
    () =>
    ({ state: n, dispatch: e }) =>
      Bb(n, e),
  Vv =
    () =>
    ({ state: n, dispatch: e }) =>
      Jb(n, e),
  jv =
    () =>
    ({ tr: n, state: e, dispatch: t }) => {
      try {
        const o = Zi(e.doc, e.selection.$from.pos, -1);
        return o == null ? !1 : (n.join(o, 2), t && t(n), !0);
      } catch {
        return !1;
      }
    },
  Jv =
    () =>
    ({ state: n, dispatch: e, tr: t }) => {
      try {
        const o = Zi(n.doc, n.selection.$from.pos, 1);
        return o == null ? !1 : (t.join(o, 2), e && e(t), !0);
      } catch {
        return !1;
      }
    },
  Lv =
    () =>
    ({ state: n, dispatch: e }) =>
      Fb(n, e),
  qv =
    () =>
    ({ state: n, dispatch: e }) =>
      Vb(n, e);
function Hu() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function Kv(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let o, r, i, s;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a)) s = !0;
    else if (/^a(lt)?$/i.test(a)) o = !0;
    else if (/^(c|ctrl|control)$/i.test(a)) r = !0;
    else if (/^s(hift)?$/i.test(a)) i = !0;
    else if (/^mod$/i.test(a)) Xa() || Hu() ? (s = !0) : (r = !0);
    else throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return (
    o && (t = `Alt-${t}`),
    r && (t = `Ctrl-${t}`),
    s && (t = `Meta-${t}`),
    i && (t = `Shift-${t}`),
    t
  );
}
const Wv =
  (n) =>
  ({ editor: e, view: t, tr: o, dispatch: r }) => {
    const i = Kv(n).split(/-(?!$)/),
      s = i.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)),
      l = new KeyboardEvent("keydown", {
        key: s === "Space" ? " " : s,
        altKey: i.includes("Alt"),
        ctrlKey: i.includes("Ctrl"),
        metaKey: i.includes("Meta"),
        shiftKey: i.includes("Shift"),
        bubbles: !0,
        cancelable: !0,
      }),
      a = e.captureTransaction(() => {
        t.someProp("handleKeyDown", (c) => c(t, l));
      });
    return (
      a == null ||
        a.steps.forEach((c) => {
          const d = c.map(o.mapping);
          d && r && o.maybeStep(d);
        }),
      !0
    );
  };
function Qa(n, e, t = {}) {
  const { from: o, to: r, empty: i } = n.selection,
    s = e ? ae(e, n.schema) : null,
    l = [];
  n.doc.nodesBetween(o, r, (d, h) => {
    if (d.isText) return;
    const p = Math.max(o, h),
      f = Math.min(r, h + d.nodeSize);
    l.push({ node: d, from: p, to: f });
  });
  const a = r - o,
    c = l
      .filter((d) => (s ? s.name === d.node.type.name : !0))
      .filter((d) => Ci(d.node.attrs, t, { strict: !1 }));
  return i ? !!c.length : c.reduce((d, h) => d + h.to - h.from, 0) >= a;
}
const Hv =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = ae(n, t.schema);
      return Qa(t, r, e) ? Wb(t, o) : !1;
    },
  Uv =
    () =>
    ({ state: n, dispatch: e }) =>
      Yb(n, e),
  Gv =
    (n) =>
    ({ state: e, dispatch: t }) => {
      const o = ae(n, e.schema);
      return ov(o)(e, t);
    },
  Yv =
    () =>
    ({ state: n, dispatch: e }) =>
      Hb(n, e);
function Uu(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function rh(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((o, r) => (t.includes(r) || (o[r] = n[r]), o), {});
}
const Xv =
    (n, e) =>
    ({ tr: t, state: o, dispatch: r }) => {
      let i = null,
        s = null;
      const l = Uu(typeof n == "string" ? n : n.name, o.schema);
      return l
        ? (l === "node" && (i = ae(n, o.schema)),
          l === "mark" && (s = Et(n, o.schema)),
          r &&
            t.selection.ranges.forEach((a) => {
              o.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, d) => {
                i && i === c.type && t.setNodeMarkup(d, void 0, rh(c.attrs, e)),
                  s &&
                    c.marks.length &&
                    c.marks.forEach((h) => {
                      s === h.type && t.addMark(d, d + c.nodeSize, s.create(rh(h.attrs, e)));
                    });
              });
            }),
          !0)
        : !1;
    },
  Qv =
    () =>
    ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0),
  Zv =
    () =>
    ({ tr: n, commands: e }) =>
      e.setTextSelection({ from: 0, to: n.doc.content.size }),
  _v =
    () =>
    ({ state: n, dispatch: e }) =>
      jb(n, e),
  ex =
    () =>
    ({ state: n, dispatch: e }) =>
      Lb(n, e),
  tx =
    () =>
    ({ state: n, dispatch: e }) =>
      Xb(n, e),
  nx =
    () =>
    ({ state: n, dispatch: e }) =>
      _b(n, e),
  ox =
    () =>
    ({ state: n, dispatch: e }) =>
      Zb(n, e);
function rx(n, e, t = {}) {
  return Oi(n, e, { slice: !1, parseOptions: t });
}
const ix =
  (n, e = !1, t = {}) =>
  ({ tr: o, editor: r, dispatch: i }) => {
    const { doc: s } = o,
      l = rx(n, r.schema, t);
    return i && o.replaceWith(0, s.content.size, l).setMeta("preventUpdate", !e), !0;
  };
function sx(n, e) {
  const t = Et(e, n.schema),
    { from: o, to: r, empty: i } = n.selection,
    s = [];
  i
    ? (n.storedMarks && s.push(...n.storedMarks), s.push(...n.selection.$head.marks()))
    : n.doc.nodesBetween(o, r, (a) => {
        s.push(...a.marks);
      });
  const l = s.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function lx(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs()) return t;
  }
  return null;
}
function ax(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const o = n.node(t);
    if (e(o)) return { pos: t > 0 ? n.before(t) : 0, start: n.start(t), depth: t, node: o };
  }
}
function Za(n) {
  return (e) => ax(e.$from, n);
}
function ni(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([o]) => {
      const r = n.find((i) => i.type === e && i.name === o);
      return r ? r.attribute.keepOnSplit : !1;
    }),
  );
}
function cx(n, e, t = {}) {
  const { empty: o, ranges: r } = n.selection,
    i = e ? Et(e, n.schema) : null;
  if (o)
    return !!(n.storedMarks || n.selection.$from.marks())
      .filter((d) => (i ? i.name === d.type.name : !0))
      .find((d) => Ci(d.attrs, t, { strict: !1 }));
  let s = 0;
  const l = [];
  if (
    (r.forEach(({ $from: d, $to: h }) => {
      const p = d.pos,
        f = h.pos;
      n.doc.nodesBetween(p, f, (u, m) => {
        if (!u.isText && !u.marks.length) return;
        const g = Math.max(p, m),
          y = Math.min(f, m + u.nodeSize),
          w = y - g;
        (s += w), l.push(...u.marks.map((b) => ({ mark: b, from: g, to: y })));
      });
    }),
    s === 0)
  )
    return !1;
  const a = l
      .filter((d) => (i ? i.name === d.mark.type.name : !0))
      .filter((d) => Ci(d.mark.attrs, t, { strict: !1 }))
      .reduce((d, h) => d + h.to - h.from, 0),
    c = l
      .filter((d) => (i ? d.mark.type !== i && d.mark.type.excludes(i) : !0))
      .reduce((d, h) => d + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= s;
}
function ih(n, e) {
  const { nodeExtensions: t } = av(e),
    o = t.find((s) => s.name === n);
  if (!o) return !1;
  const r = { name: o.name, options: o.options, storage: o.storage },
    i = Le(Ie(o, "group", r));
  return typeof i != "string" ? !1 : i.split(" ").includes("list");
}
function dx(n, e, t) {
  var o;
  const { selection: r } = e;
  let i = null;
  if ((Ku(r) && (i = r.$cursor), i)) {
    const l = (o = n.storedMarks) !== null && o !== void 0 ? o : i.marks();
    return !!t.isInSet(l) || !l.some((a) => a.type.excludes(t));
  }
  const { ranges: s } = r;
  return s.some(({ $from: l, $to: a }) => {
    let c = l.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return (
      n.doc.nodesBetween(l.pos, a.pos, (d, h, p) => {
        if (c) return !1;
        if (d.isInline) {
          const f = !p || p.type.allowsMarkType(t),
            u = !!t.isInSet(d.marks) || !d.marks.some((m) => m.type.excludes(t));
          c = f && u;
        }
        return !c;
      }),
      c
    );
  });
}
const hx =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      const { selection: i } = t,
        { empty: s, ranges: l } = i,
        a = Et(n, o.schema);
      if (r)
        if (s) {
          const c = sx(o, a);
          t.addStoredMark(a.create({ ...c, ...e }));
        } else
          l.forEach((c) => {
            const d = c.$from.pos,
              h = c.$to.pos;
            o.doc.nodesBetween(d, h, (p, f) => {
              const u = Math.max(f, d),
                m = Math.min(f + p.nodeSize, h);
              p.marks.find((g) => g.type === a)
                ? p.marks.forEach((g) => {
                    a === g.type && t.addMark(u, m, a.create({ ...g.attrs, ...e }));
                  })
                : t.addMark(u, m, a.create(e));
            });
          });
      return dx(o, t, a);
    },
  px =
    (n, e) =>
    ({ tr: t }) => (t.setMeta(n, e), !0),
  fx =
    (n, e = {}) =>
    ({ state: t, dispatch: o, chain: r }) => {
      const i = ae(n, t.schema);
      return i.isTextblock
        ? r()
            .command(({ commands: s }) => (nh(i, e)(t) ? !0 : s.clearNodes()))
            .command(({ state: s }) => nh(i, e)(s, o))
            .run()
        : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'),
          !1);
    },
  ux =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      if (t) {
        const { doc: o } = e,
          r = Jt(n, 0, o.content.size),
          i = E.create(o, r);
        e.setSelection(i);
      }
      return !0;
    },
  mx =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      if (t) {
        const { doc: o } = e,
          { from: r, to: i } = typeof n == "number" ? { from: n, to: n } : n,
          s = q.atStart(o).from,
          l = q.atEnd(o).to,
          a = Jt(r, s, l),
          c = Jt(i, s, l),
          d = q.create(o, a, c);
        e.setSelection(d);
      }
      return !0;
    },
  gx =
    (n) =>
    ({ state: e, dispatch: t }) => {
      const o = ae(n, e.schema);
      return sv(o)(e, t);
    };
function sh(n, e) {
  const t = n.storedMarks || (n.selection.$to.parentOffset && n.selection.$from.marks());
  if (t) {
    const o = t.filter((r) => (e == null ? void 0 : e.includes(r.type.name)));
    n.tr.ensureMarks(o);
  }
}
const yx =
    ({ keepMarks: n = !0 } = {}) =>
    ({ tr: e, state: t, dispatch: o, editor: r }) => {
      const { selection: i, doc: s } = e,
        { $from: l, $to: a } = i,
        c = r.extensionManager.attributes,
        d = ni(c, l.node().type.name, l.node().attrs);
      if (i instanceof E && i.node.isBlock)
        return !l.parentOffset || !Hn(s, l.pos)
          ? !1
          : (o && (n && sh(t, r.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()),
            !0);
      if (!l.parent.isBlock) return !1;
      if (o) {
        const h = a.parentOffset === a.parent.content.size;
        i instanceof q && e.deleteSelection();
        const p = l.depth === 0 ? void 0 : lx(l.node(-1).contentMatchAt(l.indexAfter(-1)));
        let f = h && p ? [{ type: p, attrs: d }] : void 0,
          u = Hn(e.doc, e.mapping.map(l.pos), 1, f);
        if (
          (!f &&
            !u &&
            Hn(e.doc, e.mapping.map(l.pos), 1, p ? [{ type: p }] : void 0) &&
            ((u = !0), (f = p ? [{ type: p, attrs: d }] : void 0)),
          u &&
            (e.split(e.mapping.map(l.pos), 1, f),
            p && !h && !l.parentOffset && l.parent.type !== p))
        ) {
          const m = e.mapping.map(l.before()),
            g = e.doc.resolve(m);
          l.node(-1).canReplaceWith(g.index(), g.index() + 1, p) &&
            e.setNodeMarkup(e.mapping.map(l.before()), p);
        }
        n && sh(t, r.extensionManager.splittableMarks), e.scrollIntoView();
      }
      return !0;
    },
  kx =
    (n) =>
    ({ tr: e, state: t, dispatch: o, editor: r }) => {
      var i;
      const s = ae(n, t.schema),
        { $from: l, $to: a } = t.selection,
        c = t.selection.node;
      if ((c && c.isBlock) || l.depth < 2 || !l.sameParent(a)) return !1;
      const d = l.node(-1);
      if (d.type !== s) return !1;
      const h = r.extensionManager.attributes;
      if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
        if (l.depth === 2 || l.node(-3).type !== s || l.index(-2) !== l.node(-2).childCount - 1)
          return !1;
        if (o) {
          let g = v.empty;
          const y = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
          for (let R = l.depth - y; R >= l.depth - 3; R -= 1) g = v.from(l.node(R).copy(g));
          const w =
              l.indexAfter(-1) < l.node(-2).childCount
                ? 1
                : l.indexAfter(-2) < l.node(-3).childCount
                  ? 2
                  : 3,
            b = ni(h, l.node().type.name, l.node().attrs),
            z =
              ((i = s.contentMatch.defaultType) === null || i === void 0
                ? void 0
                : i.createAndFill(b)) || void 0;
          g = g.append(v.from(s.createAndFill(null, z) || void 0));
          const $ = l.before(l.depth - (y - 1));
          e.replace($, l.after(-w), new T(g, 4 - y, 0));
          let N = -1;
          e.doc.nodesBetween($, e.doc.content.size, (R, G) => {
            if (N > -1) return !1;
            R.isTextblock && R.content.size === 0 && (N = G + 1);
          }),
            N > -1 && e.setSelection(q.near(e.doc.resolve(N))),
            e.scrollIntoView();
        }
        return !0;
      }
      const p = a.pos === l.end() ? d.contentMatchAt(0).defaultType : null,
        f = ni(h, d.type.name, d.attrs),
        u = ni(h, l.node().type.name, l.node().attrs);
      e.delete(l.pos, a.pos);
      const m = p
        ? [
            { type: s, attrs: f },
            { type: p, attrs: u },
          ]
        : [{ type: s, attrs: f }];
      if (!Hn(e.doc, l.pos, 2)) return !1;
      if (o) {
        const { selection: g, storedMarks: y } = t,
          { splittableMarks: w } = r.extensionManager,
          b = y || (g.$to.parentOffset && g.$from.marks());
        if ((e.split(l.pos, 2, m).scrollIntoView(), !b || !o)) return !0;
        const z = b.filter(($) => w.includes($.type.name));
        e.ensureMarks(z);
      }
      return !0;
    },
  js = (n, e) => {
    const t = Za((i) => i.type === e)(n.selection);
    if (!t) return !0;
    const o = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
    if (o === void 0) return !0;
    const r = n.doc.nodeAt(o);
    return t.node.type === (r == null ? void 0 : r.type) && mn(n.doc, t.pos) && n.join(t.pos), !0;
  },
  Js = (n, e) => {
    const t = Za((i) => i.type === e)(n.selection);
    if (!t) return !0;
    const o = n.doc.resolve(t.start).after(t.depth);
    if (o === void 0) return !0;
    const r = n.doc.nodeAt(o);
    return t.node.type === (r == null ? void 0 : r.type) && mn(n.doc, o) && n.join(o), !0;
  },
  wx =
    (n, e, t, o = {}) =>
    ({ editor: r, tr: i, state: s, dispatch: l, chain: a, commands: c, can: d }) => {
      const { extensions: h, splittableMarks: p } = r.extensionManager,
        f = ae(n, s.schema),
        u = ae(e, s.schema),
        { selection: m, storedMarks: g } = s,
        { $from: y, $to: w } = m,
        b = y.blockRange(w),
        z = g || (m.$to.parentOffset && m.$from.marks());
      if (!b) return !1;
      const $ = Za((N) => ih(N.type.name, h))(m);
      if (b.depth >= 1 && $ && b.depth - $.depth <= 1) {
        if ($.node.type === f) return c.liftListItem(u);
        if (ih($.node.type.name, h) && f.validContent($.node.content) && l)
          return a()
            .command(() => (i.setNodeMarkup($.pos, f), !0))
            .command(() => js(i, f))
            .command(() => Js(i, f))
            .run();
      }
      return !t || !z || !l
        ? a()
            .command(() => (d().wrapInList(f, o) ? !0 : c.clearNodes()))
            .wrapInList(f, o)
            .command(() => js(i, f))
            .command(() => Js(i, f))
            .run()
        : a()
            .command(() => {
              const N = d().wrapInList(f, o),
                R = z.filter((G) => p.includes(G.type.name));
              return i.ensureMarks(R), N ? !0 : c.clearNodes();
            })
            .wrapInList(f, o)
            .command(() => js(i, f))
            .command(() => Js(i, f))
            .run();
    },
  bx =
    (n, e = {}, t = {}) =>
    ({ state: o, commands: r }) => {
      const { extendEmptyMarkRange: i = !1 } = t,
        s = Et(n, o.schema);
      return cx(o, s, e) ? r.unsetMark(s, { extendEmptyMarkRange: i }) : r.setMark(s, e);
    },
  vx =
    (n, e, t = {}) =>
    ({ state: o, commands: r }) => {
      const i = ae(n, o.schema),
        s = ae(e, o.schema);
      return Qa(o, i, t) ? r.setNode(s) : r.setNode(i, t);
    },
  xx =
    (n, e = {}) =>
    ({ state: t, commands: o }) => {
      const r = ae(n, t.schema);
      return Qa(t, r, e) ? o.lift(r) : o.wrapIn(r, e);
    },
  Sx =
    () =>
    ({ state: n, dispatch: e }) => {
      const t = n.plugins;
      for (let o = 0; o < t.length; o += 1) {
        const r = t[o];
        let i;
        if (r.spec.isInputRules && (i = r.getState(n))) {
          if (e) {
            const s = n.tr,
              l = i.transform;
            for (let a = l.steps.length - 1; a >= 0; a -= 1) s.step(l.steps[a].invert(l.docs[a]));
            if (i.text) {
              const a = s.doc.resolve(i.from).marks();
              s.replaceWith(i.from, i.to, n.schema.text(i.text, a));
            } else s.delete(i.from, i.to);
          }
          return !0;
        }
      }
      return !1;
    },
  $x =
    () =>
    ({ tr: n, dispatch: e }) => {
      const { selection: t } = n,
        { empty: o, ranges: r } = t;
      return (
        o ||
          (e &&
            r.forEach((i) => {
              n.removeMark(i.$from.pos, i.$to.pos);
            })),
        !0
      );
    },
  Mx =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      var i;
      const { extendEmptyMarkRange: s = !1 } = e,
        { selection: l } = t,
        a = Et(n, o.schema),
        { $from: c, empty: d, ranges: h } = l;
      if (!r) return !0;
      if (d && s) {
        let { from: p, to: f } = l;
        const u =
            (i = c.marks().find((g) => g.type === a)) === null || i === void 0 ? void 0 : i.attrs,
          m = qu(c, a, u);
        m && ((p = m.from), (f = m.to)), t.removeMark(p, f, a);
      } else
        h.forEach((p) => {
          t.removeMark(p.$from.pos, p.$to.pos, a);
        });
      return t.removeStoredMark(a), !0;
    },
  Cx =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      let i = null,
        s = null;
      const l = Uu(typeof n == "string" ? n : n.name, o.schema);
      return l
        ? (l === "node" && (i = ae(n, o.schema)),
          l === "mark" && (s = Et(n, o.schema)),
          r &&
            t.selection.ranges.forEach((a) => {
              const c = a.$from.pos,
                d = a.$to.pos;
              o.doc.nodesBetween(c, d, (h, p) => {
                i && i === h.type && t.setNodeMarkup(p, void 0, { ...h.attrs, ...e }),
                  s &&
                    h.marks.length &&
                    h.marks.forEach((f) => {
                      if (s === f.type) {
                        const u = Math.max(p, c),
                          m = Math.min(p + h.nodeSize, d);
                        t.addMark(u, m, s.create({ ...f.attrs, ...e }));
                      }
                    });
              });
            }),
          !0)
        : !1;
    },
  Ox =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = ae(n, t.schema);
      return ev(r, e)(t, o);
    },
  Nx =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = ae(n, t.schema);
      return tv(r, e)(t, o);
    };
var Tx = Object.freeze({
  __proto__: null,
  blur: uv,
  clearContent: mv,
  clearNodes: gv,
  command: yv,
  createParagraphNear: kv,
  cut: wv,
  deleteCurrentNode: bv,
  deleteNode: vv,
  deleteRange: xv,
  deleteSelection: Sv,
  enter: $v,
  exitCode: Mv,
  extendMarkRange: Ov,
  first: Nv,
  focus: Ev,
  forEach: Av,
  insertContent: Iv,
  insertContentAt: zv,
  joinUp: Pv,
  joinDown: Bv,
  joinBackward: Fv,
  joinForward: Vv,
  joinItemBackward: jv,
  joinItemForward: Jv,
  joinTextblockBackward: Lv,
  joinTextblockForward: qv,
  keyboardShortcut: Wv,
  lift: Hv,
  liftEmptyBlock: Uv,
  liftListItem: Gv,
  newlineInCode: Yv,
  resetAttributes: Xv,
  scrollIntoView: Qv,
  selectAll: Zv,
  selectNodeBackward: _v,
  selectNodeForward: ex,
  selectParentNode: tx,
  selectTextblockEnd: nx,
  selectTextblockStart: ox,
  setContent: ix,
  setMark: hx,
  setMeta: px,
  setNode: fx,
  setNodeSelection: ux,
  setTextSelection: mx,
  sinkListItem: gx,
  splitBlock: yx,
  splitListItem: kx,
  toggleList: wx,
  toggleMark: bx,
  toggleNode: vx,
  toggleWrap: xx,
  undoInputRule: Sx,
  unsetAllMarks: $x,
  unsetMark: Mx,
  updateAttributes: Cx,
  wrapIn: Ox,
  wrapInList: Nx,
});
fo.create({
  name: "commands",
  addCommands() {
    return { ...Tx };
  },
});
fo.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new Sr({ key: new $r("editable"), props: { editable: () => this.editor.options.editable } }),
    ];
  },
});
fo.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new Sr({
        key: new $r("focusEvents"),
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              n.isFocused = !0;
              const o = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(o), !1;
            },
            blur: (e, t) => {
              n.isFocused = !1;
              const o = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(o), !1;
            },
          },
        },
      }),
    ];
  },
});
fo.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () =>
        this.editor.commands.first(({ commands: i }) => [
          () => i.undoInputRule(),
          () =>
            i.command(({ tr: s }) => {
              const { selection: l, doc: a } = s,
                { empty: c, $anchor: d } = l,
                { pos: h, parent: p } = d,
                f = d.parent.isTextblock ? s.doc.resolve(h - 1) : d,
                u = f.parent.type.spec.isolating,
                m = d.pos - d.parentOffset,
                g = u && f.parent.childCount === 1 ? m === d.pos : V.atStart(a).from === h;
              return !c || !g || !p.type.isTextblock || p.textContent.length ? !1 : i.clearNodes();
            }),
          () => i.deleteSelection(),
          () => i.joinBackward(),
          () => i.selectNodeBackward(),
        ]),
      e = () =>
        this.editor.commands.first(({ commands: i }) => [
          () => i.deleteSelection(),
          () => i.deleteCurrentNode(),
          () => i.joinForward(),
          () => i.selectNodeForward(),
        ]),
      t = {
        Enter: () =>
          this.editor.commands.first(({ commands: i }) => [
            () => i.newlineInCode(),
            () => i.createParagraphNear(),
            () => i.liftEmptyBlock(),
            () => i.splitBlock(),
          ]),
        "Mod-Enter": () => this.editor.commands.exitCode(),
        Backspace: n,
        "Mod-Backspace": n,
        "Shift-Backspace": n,
        Delete: e,
        "Mod-Delete": e,
        "Mod-a": () => this.editor.commands.selectAll(),
      },
      o = { ...t },
      r = {
        ...t,
        "Ctrl-h": n,
        "Alt-Backspace": n,
        "Ctrl-d": e,
        "Ctrl-Alt-Backspace": e,
        "Alt-Delete": e,
        "Alt-d": e,
        "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
        "Ctrl-e": () => this.editor.commands.selectTextblockEnd(),
      };
    return Xa() || Hu() ? r : o;
  },
  addProseMirrorPlugins() {
    return [
      new Sr({
        key: new $r("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (!(n.some((h) => h.docChanged) && !e.doc.eq(t.doc))) return;
          const { empty: o, from: r, to: i } = e.selection,
            s = V.atStart(e.doc).from,
            l = V.atEnd(e.doc).to;
          if (
            o ||
            !(r === s && i === l) ||
            t.doc.textBetween(0, t.doc.content.size, " ", " ").length !== 0
          )
            return;
          const a = t.tr,
            c = Lu({ state: t, transaction: a }),
            { commands: d } = new lv({ editor: this.editor, state: c });
          if ((d.clearNodes(), !!a.steps.length)) return a;
        },
      }),
    ];
  },
});
fo.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new Sr({
        key: new $r("tabindex"),
        props: { attributes: this.editor.isEditable ? { tabindex: "0" } : {} },
      }),
    ];
  },
});
let Ex = class ta {
  constructor(e = {}) {
    (this.type = "node"),
      (this.name = "node"),
      (this.parent = null),
      (this.child = null),
      (this.config = { name: this.name, defaultOptions: {} }),
      (this.config = { ...this.config, ...e }),
      (this.name = this.config.name),
      e.defaultOptions &&
        Object.keys(e.defaultOptions).length > 0 &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`,
        ),
      (this.options = this.config.defaultOptions),
      this.config.addOptions && (this.options = Le(Ie(this, "addOptions", { name: this.name }))),
      (this.storage = Le(Ie(this, "addStorage", { name: this.name, options: this.options })) || {});
  }
  static create(e = {}) {
    return new ta(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return (
      (t.options = Ya(this.options, e)),
      (t.storage = Le(Ie(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
  extend(e = {}) {
    const t = new ta({ ...this.config, ...e });
    return (
      (t.parent = this),
      (this.child = t),
      (t.name = e.name ? e.name : t.parent.name),
      e.defaultOptions &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`,
        ),
      (t.options = Le(Ie(t, "addOptions", { name: t.name }))),
      (t.storage = Le(Ie(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
};
const Ax = Ex.create({ name: "doc", topNode: !0, content: "block+" });
function ye(n) {
  this.content = n;
}
ye.prototype = {
  constructor: ye,
  find: function (n) {
    for (var e = 0; e < this.content.length; e += 2) if (this.content[e] === n) return e;
    return -1;
  },
  get: function (n) {
    var e = this.find(n);
    return e == -1 ? void 0 : this.content[e + 1];
  },
  update: function (n, e, t) {
    var o = t && t != n ? this.remove(t) : this,
      r = o.find(n),
      i = o.content.slice();
    return r == -1 ? i.push(t || n, e) : ((i[r + 1] = e), t && (i[r] = t)), new ye(i);
  },
  remove: function (n) {
    var e = this.find(n);
    if (e == -1) return this;
    var t = this.content.slice();
    return t.splice(e, 2), new ye(t);
  },
  addToStart: function (n, e) {
    return new ye([n, e].concat(this.remove(n).content));
  },
  addToEnd: function (n, e) {
    var t = this.remove(n).content.slice();
    return t.push(n, e), new ye(t);
  },
  addBefore: function (n, e, t) {
    var o = this.remove(e),
      r = o.content.slice(),
      i = o.find(n);
    return r.splice(i == -1 ? r.length : i, 0, e, t), new ye(r);
  },
  forEach: function (n) {
    for (var e = 0; e < this.content.length; e += 2) n(this.content[e], this.content[e + 1]);
  },
  prepend: function (n) {
    return (n = ye.from(n)), n.size ? new ye(n.content.concat(this.subtract(n).content)) : this;
  },
  append: function (n) {
    return (n = ye.from(n)), n.size ? new ye(this.subtract(n).content.concat(n.content)) : this;
  },
  subtract: function (n) {
    var e = this;
    n = ye.from(n);
    for (var t = 0; t < n.content.length; t += 2) e = e.remove(n.content[t]);
    return e;
  },
  toObject: function () {
    var n = {};
    return (
      this.forEach(function (e, t) {
        n[e] = t;
      }),
      n
    );
  },
  get size() {
    return this.content.length >> 1;
  },
};
ye.from = function (n) {
  if (n instanceof ye) return n;
  var e = [];
  if (n) for (var t in n) e.push(t, n[t]);
  return new ye(e);
};
function Gu(n, e, t) {
  for (let o = 0; ; o++) {
    if (o == n.childCount || o == e.childCount) return n.childCount == e.childCount ? null : t;
    let r = n.child(o),
      i = e.child(o);
    if (r == i) {
      t += r.nodeSize;
      continue;
    }
    if (!r.sameMarkup(i)) return t;
    if (r.isText && r.text != i.text) {
      for (let s = 0; r.text[s] == i.text[s]; s++) t++;
      return t;
    }
    if (r.content.size || i.content.size) {
      let s = Gu(r.content, i.content, t + 1);
      if (s != null) return s;
    }
    t += r.nodeSize;
  }
}
function Yu(n, e, t, o) {
  for (let r = n.childCount, i = e.childCount; ; ) {
    if (r == 0 || i == 0) return r == i ? null : { a: t, b: o };
    let s = n.child(--r),
      l = e.child(--i),
      a = s.nodeSize;
    if (s == l) {
      (t -= a), (o -= a);
      continue;
    }
    if (!s.sameMarkup(l)) return { a: t, b: o };
    if (s.isText && s.text != l.text) {
      let c = 0,
        d = Math.min(s.text.length, l.text.length);
      for (; c < d && s.text[s.text.length - c - 1] == l.text[l.text.length - c - 1]; )
        c++, t--, o--;
      return { a: t, b: o };
    }
    if (s.content.size || l.content.size) {
      let c = Yu(s.content, l.content, t - 1, o - 1);
      if (c) return c;
    }
    (t -= a), (o -= a);
  }
}
class x {
  constructor(e, t) {
    if (((this.content = e), (this.size = t || 0), t == null))
      for (let o = 0; o < e.length; o++) this.size += e[o].nodeSize;
  }
  nodesBetween(e, t, o, r = 0, i) {
    for (let s = 0, l = 0; l < t; s++) {
      let a = this.content[s],
        c = l + a.nodeSize;
      if (c > e && o(a, r + l, i || null, s) !== !1 && a.content.size) {
        let d = l + 1;
        a.nodesBetween(Math.max(0, e - d), Math.min(a.content.size, t - d), o, r + d);
      }
      l = c;
    }
  }
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  textBetween(e, t, o, r) {
    let i = "",
      s = !0;
    return (
      this.nodesBetween(
        e,
        t,
        (l, a) => {
          let c = l.isText
            ? l.text.slice(Math.max(e, a) - a, t - a)
            : l.isLeaf
              ? r
                ? typeof r == "function"
                  ? r(l)
                  : r
                : l.type.spec.leafText
                  ? l.type.spec.leafText(l)
                  : ""
              : "";
          l.isBlock && ((l.isLeaf && c) || l.isTextblock) && o && (s ? (s = !1) : (i += o)),
            (i += c);
        },
        0,
      ),
      i
    );
  }
  append(e) {
    if (!e.size) return this;
    if (!this.size) return e;
    let t = this.lastChild,
      o = e.firstChild,
      r = this.content.slice(),
      i = 0;
    for (
      t.isText && t.sameMarkup(o) && ((r[r.length - 1] = t.withText(t.text + o.text)), (i = 1));
      i < e.content.length;
      i++
    )
      r.push(e.content[i]);
    return new x(r, this.size + e.size);
  }
  cut(e, t = this.size) {
    if (e == 0 && t == this.size) return this;
    let o = [],
      r = 0;
    if (t > e)
      for (let i = 0, s = 0; s < t; i++) {
        let l = this.content[i],
          a = s + l.nodeSize;
        a > e &&
          ((s < e || a > t) &&
            (l.isText
              ? (l = l.cut(Math.max(0, e - s), Math.min(l.text.length, t - s)))
              : (l = l.cut(Math.max(0, e - s - 1), Math.min(l.content.size, t - s - 1)))),
          o.push(l),
          (r += l.nodeSize)),
          (s = a);
      }
    return new x(o, r);
  }
  cutByIndex(e, t) {
    return e == t
      ? x.empty
      : e == 0 && t == this.content.length
        ? this
        : new x(this.content.slice(e, t));
  }
  replaceChild(e, t) {
    let o = this.content[e];
    if (o == t) return this;
    let r = this.content.slice(),
      i = this.size + t.nodeSize - o.nodeSize;
    return (r[e] = t), new x(r, i);
  }
  addToStart(e) {
    return new x([e].concat(this.content), this.size + e.nodeSize);
  }
  addToEnd(e) {
    return new x(this.content.concat(e), this.size + e.nodeSize);
  }
  eq(e) {
    if (this.content.length != e.content.length) return !1;
    for (let t = 0; t < this.content.length; t++) if (!this.content[t].eq(e.content[t])) return !1;
    return !0;
  }
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  get childCount() {
    return this.content.length;
  }
  child(e) {
    let t = this.content[e];
    if (!t) throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  maybeChild(e) {
    return this.content[e] || null;
  }
  forEach(e) {
    for (let t = 0, o = 0; t < this.content.length; t++) {
      let r = this.content[t];
      e(r, o, t), (o += r.nodeSize);
    }
  }
  findDiffStart(e, t = 0) {
    return Gu(this, e, t);
  }
  findDiffEnd(e, t = this.size, o = e.size) {
    return Yu(this, e, t, o);
  }
  findIndex(e, t = -1) {
    if (e == 0) return jr(0, e);
    if (e == this.size) return jr(this.content.length, e);
    if (e > this.size || e < 0) throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let o = 0, r = 0; ; o++) {
      let i = this.child(o),
        s = r + i.nodeSize;
      if (s >= e) return s == e || t > 0 ? jr(o + 1, s) : jr(o, r);
      r = s;
    }
  }
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  toStringInner() {
    return this.content.join(", ");
  }
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  static fromJSON(e, t) {
    if (!t) return x.empty;
    if (!Array.isArray(t)) throw new RangeError("Invalid input for Fragment.fromJSON");
    return new x(t.map(e.nodeFromJSON));
  }
  static fromArray(e) {
    if (!e.length) return x.empty;
    let t,
      o = 0;
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      (o += i.nodeSize),
        r && i.isText && e[r - 1].sameMarkup(i)
          ? (t || (t = e.slice(0, r)),
            (t[t.length - 1] = i.withText(t[t.length - 1].text + i.text)))
          : t && t.push(i);
    }
    return new x(t || e, o);
  }
  static from(e) {
    if (!e) return x.empty;
    if (e instanceof x) return e;
    if (Array.isArray(e)) return this.fromArray(e);
    if (e.attrs) return new x([e], e.nodeSize);
    throw new RangeError(
      "Can not convert " +
        e +
        " to a Fragment" +
        (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""),
    );
  }
}
x.empty = new x([], 0);
const Ls = { index: 0, offset: 0 };
function jr(n, e) {
  return (Ls.index = n), (Ls.offset = e), Ls;
}
function na(n, e) {
  if (n === e) return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object")) return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t) return !1;
  if (t) {
    if (n.length != e.length) return !1;
    for (let o = 0; o < n.length; o++) if (!na(n[o], e[o])) return !1;
  } else {
    for (let o in n) if (!(o in e) || !na(n[o], e[o])) return !1;
    for (let o in e) if (!(o in n)) return !1;
  }
  return !0;
}
let Ge = class oa {
  constructor(e, t) {
    (this.type = e), (this.attrs = t);
  }
  addToSet(e) {
    let t,
      o = !1;
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.eq(i)) return e;
      if (this.type.excludes(i.type)) t || (t = e.slice(0, r));
      else {
        if (i.type.excludes(this.type)) return e;
        !o && i.type.rank > this.type.rank && (t || (t = e.slice(0, r)), t.push(this), (o = !0)),
          t && t.push(i);
      }
    }
    return t || (t = e.slice()), o || t.push(this), t;
  }
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  isInSet(e) {
    for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
    return !1;
  }
  eq(e) {
    return this == e || (this.type == e.type && na(this.attrs, e.attrs));
  }
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  static fromJSON(e, t) {
    if (!t) throw new RangeError("Invalid input for Mark.fromJSON");
    let o = e.marks[t.type];
    if (!o) throw new RangeError(`There is no mark type ${t.type} in this schema`);
    return o.create(t.attrs);
  }
  static sameSet(e, t) {
    if (e == t) return !0;
    if (e.length != t.length) return !1;
    for (let o = 0; o < e.length; o++) if (!e[o].eq(t[o])) return !1;
    return !0;
  }
  static setFrom(e) {
    if (!e || (Array.isArray(e) && e.length == 0)) return oa.none;
    if (e instanceof oa) return [e];
    let t = e.slice();
    return t.sort((o, r) => o.type.rank - r.type.rank), t;
  }
};
Ge.none = [];
class Ix extends Error {}
class O {
  constructor(e, t, o) {
    (this.content = e), (this.openStart = t), (this.openEnd = o);
  }
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  insertAt(e, t) {
    let o = Qu(this.content, e + this.openStart, t);
    return o && new O(o, this.openStart, this.openEnd);
  }
  removeBetween(e, t) {
    return new O(
      Xu(this.content, e + this.openStart, t + this.openStart),
      this.openStart,
      this.openEnd,
    );
  }
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  toJSON() {
    if (!this.content.size) return null;
    let e = { content: this.content.toJSON() };
    return (
      this.openStart > 0 && (e.openStart = this.openStart),
      this.openEnd > 0 && (e.openEnd = this.openEnd),
      e
    );
  }
  static fromJSON(e, t) {
    if (!t) return O.empty;
    let o = t.openStart || 0,
      r = t.openEnd || 0;
    if (typeof o != "number" || typeof r != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new O(x.fromJSON(e, t.content), o, r);
  }
  static maxOpen(e, t = !0) {
    let o = 0,
      r = 0;
    for (let i = e.firstChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.firstChild)
      o++;
    for (let i = e.lastChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.lastChild) r++;
    return new O(e, o, r);
  }
}
O.empty = new O(x.empty, 0, 0);
function Xu(n, e, t) {
  let { index: o, offset: r } = n.findIndex(e),
    i = n.maybeChild(o),
    { index: s, offset: l } = n.findIndex(t);
  if (r == e || i.isText) {
    if (l != t && !n.child(s).isText) throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (o != s) throw new RangeError("Removing non-flat range");
  return n.replaceChild(o, i.copy(Xu(i.content, e - r - 1, t - r - 1)));
}
function Qu(n, e, t, o) {
  let { index: r, offset: i } = n.findIndex(e),
    s = n.maybeChild(r);
  if (i == e || s.isText)
    return o && !o.canReplace(r, r, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let l = Qu(s.content, e - i - 1, t);
  return l && n.replaceChild(r, s.copy(l));
}
class ra {
  constructor(e, t, o) {
    (this.$from = e), (this.$to = t), (this.depth = o);
  }
  get start() {
    return this.$from.before(this.depth + 1);
  }
  get end() {
    return this.$to.after(this.depth + 1);
  }
  get parent() {
    return this.$from.node(this.depth);
  }
  get startIndex() {
    return this.$from.index(this.depth);
  }
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
class dr {
  constructor(e, t) {
    (this.schema = e),
      (this.rules = t),
      (this.tags = []),
      (this.styles = []),
      t.forEach((o) => {
        o.tag ? this.tags.push(o) : o.style && this.styles.push(o);
      }),
      (this.normalizeLists = !this.tags.some((o) => {
        if (!/^(ul|ol)\b/.test(o.tag) || !o.node) return !1;
        let r = e.nodes[o.node];
        return r.contentMatch.matchType(r);
      }));
  }
  parse(e, t = {}) {
    let o = new ah(this, t, !1);
    return o.addAll(e, t.from, t.to), o.finish();
  }
  parseSlice(e, t = {}) {
    let o = new ah(this, t, !0);
    return o.addAll(e, t.from, t.to), O.maxOpen(o.finish());
  }
  matchTag(e, t, o) {
    for (let r = o ? this.tags.indexOf(o) + 1 : 0; r < this.tags.length; r++) {
      let i = this.tags[r];
      if (
        zx(e, i.tag) &&
        (i.namespace === void 0 || e.namespaceURI == i.namespace) &&
        (!i.context || t.matchesContext(i.context))
      ) {
        if (i.getAttrs) {
          let s = i.getAttrs(e);
          if (s === !1) continue;
          i.attrs = s || void 0;
        }
        return i;
      }
    }
  }
  matchStyle(e, t, o, r) {
    for (let i = r ? this.styles.indexOf(r) + 1 : 0; i < this.styles.length; i++) {
      let s = this.styles[i],
        l = s.style;
      if (
        !(
          l.indexOf(e) != 0 ||
          (s.context && !o.matchesContext(s.context)) ||
          (l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))
        )
      ) {
        if (s.getAttrs) {
          let a = s.getAttrs(t);
          if (a === !1) continue;
          s.attrs = a || void 0;
        }
        return s;
      }
    }
  }
  static schemaRules(e) {
    let t = [];
    function o(r) {
      let i = r.priority == null ? 50 : r.priority,
        s = 0;
      for (; s < t.length; s++) {
        let l = t[s];
        if ((l.priority == null ? 50 : l.priority) < i) break;
      }
      t.splice(s, 0, r);
    }
    for (let r in e.marks) {
      let i = e.marks[r].spec.parseDOM;
      i &&
        i.forEach((s) => {
          o((s = ch(s))), s.mark || s.ignore || s.clearMark || (s.mark = r);
        });
    }
    for (let r in e.nodes) {
      let i = e.nodes[r].spec.parseDOM;
      i &&
        i.forEach((s) => {
          o((s = ch(s))), s.node || s.ignore || s.mark || (s.node = r);
        });
    }
    return t;
  }
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new dr(e, dr.schemaRules(e)));
  }
}
const Zu = {
    address: !0,
    article: !0,
    aside: !0,
    blockquote: !0,
    canvas: !0,
    dd: !0,
    div: !0,
    dl: !0,
    fieldset: !0,
    figcaption: !0,
    figure: !0,
    footer: !0,
    form: !0,
    h1: !0,
    h2: !0,
    h3: !0,
    h4: !0,
    h5: !0,
    h6: !0,
    header: !0,
    hgroup: !0,
    hr: !0,
    li: !0,
    noscript: !0,
    ol: !0,
    output: !0,
    p: !0,
    pre: !0,
    section: !0,
    table: !0,
    tfoot: !0,
    ul: !0,
  },
  Dx = { head: !0, noscript: !0, object: !0, script: !0, style: !0, title: !0 },
  _u = { ol: !0, ul: !0 },
  Ni = 1,
  Ti = 2,
  Xo = 4;
function lh(n, e, t) {
  return e != null
    ? (e ? Ni : 0) | (e === "full" ? Ti : 0)
    : n && n.whitespace == "pre"
      ? Ni | Ti
      : t & ~Xo;
}
class Jr {
  constructor(e, t, o, r, i, s, l) {
    (this.type = e),
      (this.attrs = t),
      (this.marks = o),
      (this.pendingMarks = r),
      (this.solid = i),
      (this.options = l),
      (this.content = []),
      (this.activeMarks = Ge.none),
      (this.stashMarks = []),
      (this.match = s || (l & Xo ? null : e.contentMatch));
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type) return [];
      let t = this.type.contentMatch.fillBefore(x.from(e));
      if (t) this.match = this.type.contentMatch.matchFragment(t);
      else {
        let o = this.type.contentMatch,
          r;
        return (r = o.findWrapping(e.type)) ? ((this.match = o), r) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & Ni)) {
      let o = this.content[this.content.length - 1],
        r;
      if (o && o.isText && (r = /[ \t\r\n\u000c]+$/.exec(o.text))) {
        let i = o;
        o.text.length == r[0].length
          ? this.content.pop()
          : (this.content[this.content.length - 1] = i.withText(
              i.text.slice(0, i.text.length - r[0].length),
            ));
      }
    }
    let t = x.from(this.content);
    return (
      !e && this.match && (t = t.append(this.match.fillBefore(x.empty, !0))),
      this.type ? this.type.create(this.attrs, t, this.marks) : t
    );
  }
  popFromStashMark(e) {
    for (let t = this.stashMarks.length - 1; t >= 0; t--)
      if (e.eq(this.stashMarks[t])) return this.stashMarks.splice(t, 1)[0];
  }
  applyPending(e) {
    for (let t = 0, o = this.pendingMarks; t < o.length; t++) {
      let r = o[t];
      (this.type ? this.type.allowsMarkType(r.type) : Bx(r.type, e)) &&
        !r.isInSet(this.activeMarks) &&
        ((this.activeMarks = r.addToSet(this.activeMarks)),
        (this.pendingMarks = r.removeFromSet(this.pendingMarks)));
    }
  }
  inlineContext(e) {
    return this.type
      ? this.type.inlineContent
      : this.content.length
        ? this.content[0].isInline
        : e.parentNode && !Zu.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class ah {
  constructor(e, t, o) {
    (this.parser = e), (this.options = t), (this.isOpen = o), (this.open = 0);
    let r = t.topNode,
      i,
      s = lh(null, t.preserveWhitespace, 0) | (o ? Xo : 0);
    r
      ? (i = new Jr(r.type, r.attrs, Ge.none, Ge.none, !0, t.topMatch || r.type.contentMatch, s))
      : o
        ? (i = new Jr(null, null, Ge.none, Ge.none, !0, null, s))
        : (i = new Jr(e.schema.topNodeType, null, Ge.none, Ge.none, !0, null, s)),
      (this.nodes = [i]),
      (this.find = t.findPositions),
      (this.needsBlock = !1);
  }
  get top() {
    return this.nodes[this.open];
  }
  addDOM(e) {
    e.nodeType == 3 ? this.addTextNode(e) : e.nodeType == 1 && this.addElement(e);
  }
  withStyleRules(e, t) {
    let o = e.getAttribute("style");
    if (!o) return t();
    let r = this.readStyles(Px(o));
    if (!r) return;
    let [i, s] = r,
      l = this.top;
    for (let a = 0; a < s.length; a++) this.removePendingMark(s[a], l);
    for (let a = 0; a < i.length; a++) this.addPendingMark(i[a]);
    t();
    for (let a = 0; a < i.length; a++) this.removePendingMark(i[a], l);
    for (let a = 0; a < s.length; a++) this.addPendingMark(s[a]);
  }
  addTextNode(e) {
    let t = e.nodeValue,
      o = this.top;
    if (o.options & Ti || o.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
      if (o.options & Ni)
        o.options & Ti
          ? (t = t.replace(
              /\r\n?/g,
              `
`,
            ))
          : (t = t.replace(/\r?\n|\r/g, " "));
      else if (
        ((t = t.replace(/[ \t\r\n\u000c]+/g, " ")),
        /^[ \t\r\n\u000c]/.test(t) && this.open == this.nodes.length - 1)
      ) {
        let r = o.content[o.content.length - 1],
          i = e.previousSibling;
        (!r || (i && i.nodeName == "BR") || (r.isText && /[ \t\r\n\u000c]$/.test(r.text))) &&
          (t = t.slice(1));
      }
      t && this.insertNode(this.parser.schema.text(t)), this.findInText(e);
    } else this.findInside(e);
  }
  addElement(e, t) {
    let o = e.nodeName.toLowerCase(),
      r;
    _u.hasOwnProperty(o) && this.parser.normalizeLists && Rx(e);
    let i =
      (this.options.ruleFromNode && this.options.ruleFromNode(e)) ||
      (r = this.parser.matchTag(e, this, t));
    if (i ? i.ignore : Dx.hasOwnProperty(o)) this.findInside(e), this.ignoreFallback(e);
    else if (!i || i.skip || i.closeParent) {
      i && i.closeParent
        ? (this.open = Math.max(0, this.open - 1))
        : i && i.skip.nodeType && (e = i.skip);
      let s,
        l = this.top,
        a = this.needsBlock;
      if (Zu.hasOwnProperty(o))
        l.content.length && l.content[0].isInline && this.open && (this.open--, (l = this.top)),
          (s = !0),
          l.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      i && i.skip ? this.addAll(e) : this.withStyleRules(e, () => this.addAll(e)),
        s && this.sync(l),
        (this.needsBlock = a);
    } else
      this.withStyleRules(e, () => {
        this.addElementByRule(e, i, i.consuming === !1 ? r : void 0);
      });
  }
  leafFallback(e) {
    e.nodeName == "BR" &&
      this.top.type &&
      this.top.type.inlineContent &&
      this.addTextNode(
        e.ownerDocument.createTextNode(`
`),
      );
  }
  ignoreFallback(e) {
    e.nodeName == "BR" &&
      (!this.top.type || !this.top.type.inlineContent) &&
      this.findPlace(this.parser.schema.text("-"));
  }
  readStyles(e) {
    let t = Ge.none,
      o = Ge.none;
    for (let r = 0; r < e.length; r += 2)
      for (let i = void 0; ; ) {
        let s = this.parser.matchStyle(e[r], e[r + 1], this, i);
        if (!s) break;
        if (s.ignore) return null;
        if (
          (s.clearMark
            ? this.top.pendingMarks.concat(this.top.activeMarks).forEach((l) => {
                s.clearMark(l) && (o = l.addToSet(o));
              })
            : (t = this.parser.schema.marks[s.mark].create(s.attrs).addToSet(t)),
          s.consuming === !1)
        )
          i = s;
        else break;
      }
    return [t, o];
  }
  addElementByRule(e, t, o) {
    let r, i, s;
    t.node
      ? ((i = this.parser.schema.nodes[t.node]),
        i.isLeaf
          ? this.insertNode(i.create(t.attrs)) || this.leafFallback(e)
          : (r = this.enter(i, t.attrs || null, t.preserveWhitespace)))
      : ((s = this.parser.schema.marks[t.mark].create(t.attrs)), this.addPendingMark(s));
    let l = this.top;
    if (i && i.isLeaf) this.findInside(e);
    else if (o) this.addElement(e, o);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a));
    else {
      let a = e;
      typeof t.contentElement == "string"
        ? (a = e.querySelector(t.contentElement))
        : typeof t.contentElement == "function"
          ? (a = t.contentElement(e))
          : t.contentElement && (a = t.contentElement),
        this.findAround(e, a, !0),
        this.addAll(a);
    }
    r && this.sync(l) && this.open--, s && this.removePendingMark(s, l);
  }
  addAll(e, t, o) {
    let r = t || 0;
    for (
      let i = t ? e.childNodes[t] : e.firstChild, s = o == null ? null : e.childNodes[o];
      i != s;
      i = i.nextSibling, ++r
    )
      this.findAtPoint(e, r), this.addDOM(i);
    this.findAtPoint(e, r);
  }
  findPlace(e) {
    let t, o;
    for (let r = this.open; r >= 0; r--) {
      let i = this.nodes[r],
        s = i.findWrapping(e);
      if ((s && (!t || t.length > s.length) && ((t = s), (o = i), !s.length)) || i.solid) break;
    }
    if (!t) return !1;
    this.sync(o);
    for (let r = 0; r < t.length; r++) this.enterInner(t[r], null, !1);
    return !0;
  }
  insertNode(e) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let t = this.textblockFromContext();
      t && this.enterInner(t);
    }
    if (this.findPlace(e)) {
      this.closeExtra();
      let t = this.top;
      t.applyPending(e.type), t.match && (t.match = t.match.matchType(e.type));
      let o = t.activeMarks;
      for (let r = 0; r < e.marks.length; r++)
        (!t.type || t.type.allowsMarkType(e.marks[r].type)) && (o = e.marks[r].addToSet(o));
      return t.content.push(e.mark(o)), !0;
    }
    return !1;
  }
  enter(e, t, o) {
    let r = this.findPlace(e.create(t));
    return r && this.enterInner(e, t, !0, o), r;
  }
  enterInner(e, t = null, o = !1, r) {
    this.closeExtra();
    let i = this.top;
    i.applyPending(e), (i.match = i.match && i.match.matchType(e));
    let s = lh(e, r, i.options);
    i.options & Xo && i.content.length == 0 && (s |= Xo),
      this.nodes.push(new Jr(e, t, i.activeMarks, i.pendingMarks, o, null, s)),
      this.open++;
  }
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--) this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return (
      (this.open = 0),
      this.closeExtra(this.isOpen),
      this.nodes[0].finish(this.isOpen || this.options.topOpen)
    );
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--) if (this.nodes[t] == e) return (this.open = t), !0;
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let o = this.nodes[t].content;
      for (let r = o.length - 1; r >= 0; r--) e += o[r].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let o = 0; o < this.find.length; o++)
        this.find[o].node == e && this.find[o].offset == t && (this.find[o].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null &&
          e.nodeType == 1 &&
          e.contains(this.find[t].node) &&
          (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, o) {
    if (e != t && this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].pos == null &&
          e.nodeType == 1 &&
          e.contains(this.find[r].node) &&
          t.compareDocumentPosition(this.find[r].node) & (o ? 2 : 4) &&
          (this.find[r].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e &&
          (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  matchesContext(e) {
    if (e.indexOf("|") > -1) return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"),
      o = this.options.context,
      r = !this.isOpen && (!o || o.parent.type == this.nodes[0].type),
      i = -(o ? o.depth + 1 : 0) + (r ? 0 : 1),
      s = (l, a) => {
        for (; l >= 0; l--) {
          let c = t[l];
          if (c == "") {
            if (l == t.length - 1 || l == 0) continue;
            for (; a >= i; a--) if (s(l - 1, a)) return !0;
            return !1;
          } else {
            let d =
              a > 0 || (a == 0 && r) ? this.nodes[a].type : o && a >= i ? o.node(a - i).type : null;
            if (!d || (d.name != c && d.groups.indexOf(c) == -1)) return !1;
            a--;
          }
        }
        return !0;
      };
    return s(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let o = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (o && o.isTextblock && o.defaultAttrs) return o;
      }
    for (let t in this.parser.schema.nodes) {
      let o = this.parser.schema.nodes[t];
      if (o.isTextblock && o.defaultAttrs) return o;
    }
  }
  addPendingMark(e) {
    let t = Fx(e, this.top.pendingMarks);
    t && this.top.stashMarks.push(t), (this.top.pendingMarks = e.addToSet(this.top.pendingMarks));
  }
  removePendingMark(e, t) {
    for (let o = this.open; o >= 0; o--) {
      let r = this.nodes[o];
      if (r.pendingMarks.lastIndexOf(e) > -1) r.pendingMarks = e.removeFromSet(r.pendingMarks);
      else {
        r.activeMarks = e.removeFromSet(r.activeMarks);
        let i = r.popFromStashMark(e);
        i && r.type && r.type.allowsMarkType(i.type) && (r.activeMarks = i.addToSet(r.activeMarks));
      }
      if (r == t) break;
    }
  }
}
function Rx(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let o = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    o && _u.hasOwnProperty(o) && t
      ? (t.appendChild(e), (e = t))
      : o == "li"
        ? (t = e)
        : o && (t = null);
  }
}
function zx(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(
    n,
    e,
  );
}
function Px(n) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g,
    t,
    o = [];
  for (; (t = e.exec(n)); ) o.push(t[1], t[2].trim());
  return o;
}
function ch(n) {
  let e = {};
  for (let t in n) e[t] = n[t];
  return e;
}
function Bx(n, e) {
  let t = e.schema.nodes;
  for (let o in t) {
    let r = t[o];
    if (!r.allowsMarkType(n)) continue;
    let i = [],
      s = (l) => {
        i.push(l);
        for (let a = 0; a < l.edgeCount; a++) {
          let { type: c, next: d } = l.edge(a);
          if (c == e || (i.indexOf(d) < 0 && s(d))) return !0;
        }
      };
    if (s(r.contentMatch)) return !0;
  }
}
function Fx(n, e) {
  for (let t = 0; t < e.length; t++) if (n.eq(e[t])) return e[t];
}
class Lt {
  constructor(e, t) {
    (this.nodes = e), (this.marks = t);
  }
  serializeFragment(e, t = {}, o) {
    o || (o = qs(t).createDocumentFragment());
    let r = o,
      i = [];
    return (
      e.forEach((s) => {
        if (i.length || s.marks.length) {
          let l = 0,
            a = 0;
          for (; l < i.length && a < s.marks.length; ) {
            let c = s.marks[a];
            if (!this.marks[c.type.name]) {
              a++;
              continue;
            }
            if (!c.eq(i[l][0]) || c.type.spec.spanning === !1) break;
            l++, a++;
          }
          for (; l < i.length; ) r = i.pop()[1];
          for (; a < s.marks.length; ) {
            let c = s.marks[a++],
              d = this.serializeMark(c, s.isInline, t);
            d && (i.push([c, r]), r.appendChild(d.dom), (r = d.contentDOM || d.dom));
          }
        }
        r.appendChild(this.serializeNodeInner(s, t));
      }),
      o
    );
  }
  serializeNodeInner(e, t) {
    let { dom: o, contentDOM: r } = Lt.renderSpec(qs(t), this.nodes[e.type.name](e));
    if (r) {
      if (e.isLeaf) throw new RangeError("Content hole not allowed in a leaf node spec");
      this.serializeFragment(e.content, t, r);
    }
    return o;
  }
  serializeNode(e, t = {}) {
    let o = this.serializeNodeInner(e, t);
    for (let r = e.marks.length - 1; r >= 0; r--) {
      let i = this.serializeMark(e.marks[r], e.isInline, t);
      i && ((i.contentDOM || i.dom).appendChild(o), (o = i.dom));
    }
    return o;
  }
  serializeMark(e, t, o = {}) {
    let r = this.marks[e.type.name];
    return r && Lt.renderSpec(qs(o), r(e, t));
  }
  static renderSpec(e, t, o = null) {
    if (typeof t == "string") return { dom: e.createTextNode(t) };
    if (t.nodeType != null) return { dom: t };
    if (t.dom && t.dom.nodeType != null) return t;
    let r = t[0],
      i = r.indexOf(" ");
    i > 0 && ((o = r.slice(0, i)), (r = r.slice(i + 1)));
    let s,
      l = o ? e.createElementNS(o, r) : e.createElement(r),
      a = t[1],
      c = 1;
    if (a && typeof a == "object" && a.nodeType == null && !Array.isArray(a)) {
      c = 2;
      for (let d in a)
        if (a[d] != null) {
          let h = d.indexOf(" ");
          h > 0 ? l.setAttributeNS(d.slice(0, h), d.slice(h + 1), a[d]) : l.setAttribute(d, a[d]);
        }
    }
    for (let d = c; d < t.length; d++) {
      let h = t[d];
      if (h === 0) {
        if (d < t.length - 1 || d > c)
          throw new RangeError("Content hole must be the only child of its parent node");
        return { dom: l, contentDOM: l };
      } else {
        let { dom: p, contentDOM: f } = Lt.renderSpec(e, h, o);
        if ((l.appendChild(p), f)) {
          if (s) throw new RangeError("Multiple content holes");
          s = f;
        }
      }
    }
    return { dom: l, contentDOM: s };
  }
  static fromSchema(e) {
    return (
      e.cached.domSerializer ||
      (e.cached.domSerializer = new Lt(this.nodesFromSchema(e), this.marksFromSchema(e)))
    );
  }
  static nodesFromSchema(e) {
    let t = dh(e.nodes);
    return t.text || (t.text = (o) => o.text), t;
  }
  static marksFromSchema(e) {
    return dh(e.marks);
  }
}
function dh(n) {
  let e = {};
  for (let t in n) {
    let o = n[t].spec.toDOM;
    o && (e[t] = o);
  }
  return e;
}
function qs(n) {
  return n.document || window.document;
}
const em = 65535,
  tm = Math.pow(2, 16);
function Vx(n, e) {
  return n + e * tm;
}
function hh(n) {
  return n & em;
}
function jx(n) {
  return (n - (n & em)) / tm;
}
const nm = 1,
  om = 2,
  oi = 4,
  rm = 8;
class ph {
  constructor(e, t, o) {
    (this.pos = e), (this.delInfo = t), (this.recover = o);
  }
  get deleted() {
    return (this.delInfo & rm) > 0;
  }
  get deletedBefore() {
    return (this.delInfo & (nm | oi)) > 0;
  }
  get deletedAfter() {
    return (this.delInfo & (om | oi)) > 0;
  }
  get deletedAcross() {
    return (this.delInfo & oi) > 0;
  }
}
class De {
  constructor(e, t = !1) {
    if (((this.ranges = e), (this.inverted = t), !e.length && De.empty)) return De.empty;
  }
  recover(e) {
    let t = 0,
      o = hh(e);
    if (!this.inverted)
      for (let r = 0; r < o; r++) t += this.ranges[r * 3 + 2] - this.ranges[r * 3 + 1];
    return this.ranges[o * 3] + t + jx(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  _map(e, t, o) {
    let r = 0,
      i = this.inverted ? 2 : 1,
      s = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? r : 0);
      if (a > e) break;
      let c = this.ranges[l + i],
        d = this.ranges[l + s],
        h = a + c;
      if (e <= h) {
        let p = c ? (e == a ? -1 : e == h ? 1 : t) : t,
          f = a + r + (p < 0 ? 0 : d);
        if (o) return f;
        let u = e == (t < 0 ? a : h) ? null : Vx(l / 3, e - a),
          m = e == a ? om : e == h ? nm : oi;
        return (t < 0 ? e != a : e != h) && (m |= rm), new ph(f, m, u);
      }
      r += d - c;
    }
    return o ? e + r : new ph(e + r, 0, null);
  }
  touches(e, t) {
    let o = 0,
      r = hh(t),
      i = this.inverted ? 2 : 1,
      s = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? o : 0);
      if (a > e) break;
      let c = this.ranges[l + i],
        d = a + c;
      if (e <= d && l == r * 3) return !0;
      o += this.ranges[l + s] - c;
    }
    return !1;
  }
  forEach(e) {
    let t = this.inverted ? 2 : 1,
      o = this.inverted ? 1 : 2;
    for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
      let s = this.ranges[r],
        l = s - (this.inverted ? i : 0),
        a = s + (this.inverted ? 0 : i),
        c = this.ranges[r + t],
        d = this.ranges[r + o];
      e(l, l + c, a, a + d), (i += d - c);
    }
  }
  invert() {
    return new De(this.ranges, !this.inverted);
  }
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  static offset(e) {
    return e == 0 ? De.empty : new De(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
De.empty = new De([]);
const Ks = Object.create(null);
class fe {
  getMap() {
    return De.empty;
  }
  merge(e) {
    return null;
  }
  static fromJSON(e, t) {
    if (!t || !t.stepType) throw new RangeError("Invalid input for Step.fromJSON");
    let o = Ks[t.stepType];
    if (!o) throw new RangeError(`No step type ${t.stepType} defined`);
    return o.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in Ks) throw new RangeError("Duplicate use of step JSON ID " + e);
    return (Ks[e] = t), (t.prototype.jsonID = e), t;
  }
}
class Y {
  constructor(e, t) {
    (this.doc = e), (this.failed = t);
  }
  static ok(e) {
    return new Y(e, null);
  }
  static fail(e) {
    return new Y(null, e);
  }
  static fromReplace(e, t, o, r) {
    try {
      return Y.ok(e.replace(t, o, r));
    } catch (i) {
      if (i instanceof Ix) return Y.fail(i.message);
      throw i;
    }
  }
}
function _a(n, e, t) {
  let o = [];
  for (let r = 0; r < n.childCount; r++) {
    let i = n.child(r);
    i.content.size && (i = i.copy(_a(i.content, e, i))), i.isInline && (i = e(i, t, r)), o.push(i);
  }
  return x.fromArray(o);
}
class qt extends fe {
  constructor(e, t, o) {
    super(), (this.from = e), (this.to = t), (this.mark = o);
  }
  apply(e) {
    let t = e.slice(this.from, this.to),
      o = e.resolve(this.from),
      r = o.node(o.sharedDepth(this.to)),
      i = new O(
        _a(
          t.content,
          (s, l) =>
            !s.isAtom || !l.type.allowsMarkType(this.mark.type)
              ? s
              : s.mark(this.mark.addToSet(s.marks)),
          r,
        ),
        t.openStart,
        t.openEnd,
      );
    return Y.fromReplace(e, this.from, this.to, i);
  }
  invert() {
    return new Kt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return (t.deleted && o.deleted) || t.pos >= o.pos ? null : new qt(t.pos, o.pos, this.mark);
  }
  merge(e) {
    return e instanceof qt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from
      ? new qt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark)
      : null;
  }
  toJSON() {
    return { stepType: "addMark", mark: this.mark.toJSON(), from: this.from, to: this.to };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new qt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
fe.jsonID("addMark", qt);
class Kt extends fe {
  constructor(e, t, o) {
    super(), (this.from = e), (this.to = t), (this.mark = o);
  }
  apply(e) {
    let t = e.slice(this.from, this.to),
      o = new O(
        _a(t.content, (r) => r.mark(this.mark.removeFromSet(r.marks)), e),
        t.openStart,
        t.openEnd,
      );
    return Y.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new qt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return (t.deleted && o.deleted) || t.pos >= o.pos ? null : new Kt(t.pos, o.pos, this.mark);
  }
  merge(e) {
    return e instanceof Kt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from
      ? new Kt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark)
      : null;
  }
  toJSON() {
    return { stepType: "removeMark", mark: this.mark.toJSON(), from: this.from, to: this.to };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new Kt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
fe.jsonID("removeMark", Kt);
class Wt extends fe {
  constructor(e, t) {
    super(), (this.pos = e), (this.mark = t);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return Y.fail("No node at mark step's position");
    let o = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return Y.fromReplace(e, this.pos, this.pos + 1, new O(x.from(o), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let o = this.mark.addToSet(t.marks);
      if (o.length == t.marks.length) {
        for (let r = 0; r < t.marks.length; r++)
          if (!t.marks[r].isInSet(o)) return new Wt(this.pos, t.marks[r]);
        return new Wt(this.pos, this.mark);
      }
    }
    return new hr(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Wt(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new Wt(t.pos, e.markFromJSON(t.mark));
  }
}
fe.jsonID("addNodeMark", Wt);
class hr extends fe {
  constructor(e, t) {
    super(), (this.pos = e), (this.mark = t);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return Y.fail("No node at mark step's position");
    let o = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return Y.fromReplace(e, this.pos, this.pos + 1, new O(x.from(o), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new Wt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new hr(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new hr(t.pos, e.markFromJSON(t.mark));
  }
}
fe.jsonID("removeNodeMark", hr);
class Ee extends fe {
  constructor(e, t, o, r = !1) {
    super(), (this.from = e), (this.to = t), (this.slice = o), (this.structure = r);
  }
  apply(e) {
    return this.structure && ia(e, this.from, this.to)
      ? Y.fail("Structure replace would overwrite content")
      : Y.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new De([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new Ee(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return t.deletedAcross && o.deletedAcross
      ? null
      : new Ee(t.pos, Math.max(t.pos, o.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof Ee) || e.structure || this.structure) return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t =
        this.slice.size + e.slice.size == 0
          ? O.empty
          : new O(
              this.slice.content.append(e.slice.content),
              this.slice.openStart,
              e.slice.openEnd,
            );
      return new Ee(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t =
        this.slice.size + e.slice.size == 0
          ? O.empty
          : new O(
              e.slice.content.append(this.slice.content),
              e.slice.openStart,
              this.slice.openEnd,
            );
      return new Ee(e.from, this.to, t, this.structure);
    } else return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return (
      this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e
    );
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new Ee(t.from, t.to, O.fromJSON(e, t.slice), !!t.structure);
  }
}
fe.jsonID("replace", Ee);
class Oe extends fe {
  constructor(e, t, o, r, i, s, l = !1) {
    super(),
      (this.from = e),
      (this.to = t),
      (this.gapFrom = o),
      (this.gapTo = r),
      (this.slice = i),
      (this.insert = s),
      (this.structure = l);
  }
  apply(e) {
    if (this.structure && (ia(e, this.from, this.gapFrom) || ia(e, this.gapTo, this.to)))
      return Y.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd) return Y.fail("Gap is not a flat range");
    let o = this.slice.insertAt(this.insert, t.content);
    return o ? Y.fromReplace(e, this.from, this.to, o) : Y.fail("Content does not fit in gap");
  }
  getMap() {
    return new De([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert,
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new Oe(
      this.from,
      this.from + this.slice.size + t,
      this.from + this.insert,
      this.from + this.insert + t,
      e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from),
      this.gapFrom - this.from,
      this.structure,
    );
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1),
      r = e.map(this.gapFrom, -1),
      i = e.map(this.gapTo, 1);
    return (t.deletedAcross && o.deletedAcross) || r < t.pos || i > o.pos
      ? null
      : new Oe(t.pos, o.pos, r, i, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert,
    };
    return (
      this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e
    );
  }
  static fromJSON(e, t) {
    if (
      typeof t.from != "number" ||
      typeof t.to != "number" ||
      typeof t.gapFrom != "number" ||
      typeof t.gapTo != "number" ||
      typeof t.insert != "number"
    )
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new Oe(
      t.from,
      t.to,
      t.gapFrom,
      t.gapTo,
      O.fromJSON(e, t.slice),
      t.insert,
      !!t.structure,
    );
  }
}
fe.jsonID("replaceAround", Oe);
function ia(n, e, t) {
  let o = n.resolve(e),
    r = t - e,
    i = o.depth;
  for (; r > 0 && i > 0 && o.indexAfter(i) == o.node(i).childCount; ) i--, r--;
  if (r > 0) {
    let s = o.node(i).maybeChild(o.indexAfter(i));
    for (; r > 0; ) {
      if (!s || s.isLeaf) return !0;
      (s = s.firstChild), r--;
    }
  }
  return !1;
}
function Jx(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function uo(n) {
  let e = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let t = n.depth; ; --t) {
    let o = n.$from.node(t),
      r = n.$from.index(t),
      i = n.$to.indexAfter(t);
    if (t < n.depth && o.canReplace(r, i, e)) return t;
    if (t == 0 || o.type.spec.isolating || !Jx(o, r, i)) break;
  }
  return null;
}
function im(n, e, t = null, o = n) {
  let r = Lx(n, e),
    i = r && qx(o, e);
  return i ? r.map(fh).concat({ type: e, attrs: t }).concat(i.map(fh)) : null;
}
function fh(n) {
  return { type: n, attrs: null };
}
function Lx(n, e) {
  let { parent: t, startIndex: o, endIndex: r } = n,
    i = t.contentMatchAt(o).findWrapping(e);
  if (!i) return null;
  let s = i.length ? i[0] : e;
  return t.canReplaceWith(o, r, s) ? i : null;
}
function qx(n, e) {
  let { parent: t, startIndex: o, endIndex: r } = n,
    i = t.child(o),
    s = e.contentMatch.findWrapping(i.type);
  if (!s) return null;
  let l = (s.length ? s[s.length - 1] : e).contentMatch;
  for (let a = o; l && a < r; a++) l = l.matchType(t.child(a).type);
  return !l || !l.validEnd ? null : s;
}
function Gn(n, e, t = 1, o) {
  let r = n.resolve(e),
    i = r.depth - t,
    s = (o && o[o.length - 1]) || r.parent;
  if (
    i < 0 ||
    r.parent.type.spec.isolating ||
    !r.parent.canReplace(r.index(), r.parent.childCount) ||
    !s.type.validContent(r.parent.content.cutByIndex(r.index(), r.parent.childCount))
  )
    return !1;
  for (let c = r.depth - 1, d = t - 2; c > i; c--, d--) {
    let h = r.node(c),
      p = r.index(c);
    if (h.type.spec.isolating) return !1;
    let f = h.content.cutByIndex(p, h.childCount),
      u = o && o[d + 1];
    u && (f = f.replaceChild(0, u.type.create(u.attrs)));
    let m = (o && o[d]) || h;
    if (!h.canReplace(p + 1, h.childCount) || !m.type.validContent(f)) return !1;
  }
  let l = r.indexAfter(i),
    a = o && o[0];
  return r.node(i).canReplaceWith(l, l, a ? a.type : r.node(i + 1).type);
}
function wn(n, e) {
  let t = n.resolve(e),
    o = t.index();
  return sm(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(o, o + 1);
}
function sm(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function ts(n, e, t = -1) {
  let o = n.resolve(e);
  for (let r = o.depth; ; r--) {
    let i,
      s,
      l = o.index(r);
    if (
      (r == o.depth
        ? ((i = o.nodeBefore), (s = o.nodeAfter))
        : t > 0
          ? ((i = o.node(r + 1)), l++, (s = o.node(r).maybeChild(l)))
          : ((i = o.node(r).maybeChild(l - 1)), (s = o.node(r + 1))),
      i && !i.isTextblock && sm(i, s) && o.node(r).canReplace(l, l + 1))
    )
      return e;
    if (r == 0) break;
    e = t < 0 ? o.before(r) : o.after(r);
  }
}
function Kx(n, e, t) {
  let o = n.resolve(e);
  if (!t.content.size) return e;
  let r = t.content;
  for (let i = 0; i < t.openStart; i++) r = r.firstChild.content;
  for (let i = 1; i <= (t.openStart == 0 && t.size ? 2 : 1); i++)
    for (let s = o.depth; s >= 0; s--) {
      let l = s == o.depth ? 0 : o.pos <= (o.start(s + 1) + o.end(s + 1)) / 2 ? -1 : 1,
        a = o.index(s) + (l > 0 ? 1 : 0),
        c = o.node(s),
        d = !1;
      if (i == 1) d = c.canReplace(a, a, r);
      else {
        let h = c.contentMatchAt(a).findWrapping(r.firstChild.type);
        d = h && c.canReplaceWith(a, a, h[0]);
      }
      if (d) return l == 0 ? o.pos : l < 0 ? o.before(s + 1) : o.after(s + 1);
    }
  return null;
}
function ec(n, e, t = e, o = O.empty) {
  if (e == t && !o.size) return null;
  let r = n.resolve(e),
    i = n.resolve(t);
  return Wx(r, i, o) ? new Ee(e, t, o) : new Hx(r, i, o).fit();
}
function Wx(n, e, t) {
  return (
    !t.openStart &&
    !t.openEnd &&
    n.start() == e.start() &&
    n.parent.canReplace(n.index(), e.index(), t.content)
  );
}
class Hx {
  constructor(e, t, o) {
    (this.$from = e),
      (this.$to = t),
      (this.unplaced = o),
      (this.frontier = []),
      (this.placed = x.empty);
    for (let r = 0; r <= e.depth; r++) {
      let i = e.node(r);
      this.frontier.push({ type: i.type, match: i.contentMatchAt(e.indexAfter(r)) });
    }
    for (let r = e.depth; r > 0; r--) this.placed = x.from(e.node(r).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(),
      t = this.placed.size - this.depth - this.$from.depth,
      o = this.$from,
      r = this.close(e < 0 ? this.$to : o.doc.resolve(e));
    if (!r) return null;
    let i = this.placed,
      s = o.depth,
      l = r.depth;
    for (; s && l && i.childCount == 1; ) (i = i.firstChild.content), s--, l--;
    let a = new O(i, s, l);
    return e > -1
      ? new Oe(o.pos, e, this.$to.pos, this.$to.end(), a, t)
      : a.size || o.pos != this.$to.pos
        ? new Ee(o.pos, r.pos, a)
        : null;
  }
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, o = 0, r = this.unplaced.openEnd; o < e; o++) {
      let i = t.firstChild;
      if ((t.childCount > 1 && (r = 0), i.type.spec.isolating && r <= o)) {
        e = o;
        break;
      }
      t = i.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let o = t == 1 ? e : this.unplaced.openStart; o >= 0; o--) {
        let r,
          i = null;
        o
          ? ((i = Ws(this.unplaced.content, o - 1).firstChild), (r = i.content))
          : (r = this.unplaced.content);
        let s = r.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l],
            d,
            h = null;
          if (
            t == 1 &&
            (s
              ? c.matchType(s.type) || (h = c.fillBefore(x.from(s), !1))
              : i && a.compatibleContent(i.type))
          )
            return { sliceDepth: o, frontierDepth: l, parent: i, inject: h };
          if (t == 2 && s && (d = c.findWrapping(s.type)))
            return { sliceDepth: o, frontierDepth: l, parent: i, wrap: d };
          if (i && c.matchType(i.type)) break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: o } = this.unplaced,
      r = Ws(e, t);
    return !r.childCount || r.firstChild.isLeaf
      ? !1
      : ((this.unplaced = new O(e, t + 1, Math.max(o, r.size + t >= e.size - o ? t + 1 : 0))), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: o } = this.unplaced,
      r = Ws(e, t);
    if (r.childCount <= 1 && t > 0) {
      let i = e.size - t <= t + r.size;
      this.unplaced = new O(Fo(e, t - 1, 1), t - 1, i ? t - 1 : o);
    } else this.unplaced = new O(Fo(e, t, 1), t, o);
  }
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: o, inject: r, wrap: i }) {
    for (; this.depth > t; ) this.closeFrontierNode();
    if (i) for (let m = 0; m < i.length; m++) this.openFrontierNode(i[m]);
    let s = this.unplaced,
      l = o ? o.content : s.content,
      a = s.openStart - e,
      c = 0,
      d = [],
      { match: h, type: p } = this.frontier[t];
    if (r) {
      for (let m = 0; m < r.childCount; m++) d.push(r.child(m));
      h = h.matchFragment(r);
    }
    let f = l.size + e - (s.content.size - s.openEnd);
    for (; c < l.childCount; ) {
      let m = l.child(c),
        g = h.matchType(m.type);
      if (!g) break;
      c++,
        (c > 1 || a == 0 || m.content.size) &&
          ((h = g),
          d.push(lm(m.mark(p.allowedMarks(m.marks)), c == 1 ? a : 0, c == l.childCount ? f : -1)));
    }
    let u = c == l.childCount;
    u || (f = -1),
      (this.placed = Vo(this.placed, t, x.from(d))),
      (this.frontier[t].match = h),
      u &&
        f < 0 &&
        o &&
        o.type == this.frontier[this.depth].type &&
        this.frontier.length > 1 &&
        this.closeFrontierNode();
    for (let m = 0, g = l; m < f; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), (g = y.content);
    }
    this.unplaced = u
      ? e == 0
        ? O.empty
        : new O(Fo(s.content, e - 1, 1), e - 1, f < 0 ? s.openEnd : e - 1)
      : new O(Fo(s.content, e, c), s.openStart, s.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock) return -1;
    let e = this.frontier[this.depth],
      t;
    if (
      !e.type.isTextblock ||
      !Hs(this.$to, this.$to.depth, e.type, e.match, !1) ||
      (this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
    )
      return -1;
    let { depth: o } = this.$to,
      r = this.$to.after(o);
    for (; o > 1 && r == this.$to.end(--o); ) ++r;
    return r;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: o, type: r } = this.frontier[t],
        i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)),
        s = Hs(e, t, r, o, i);
      if (s) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l],
            d = Hs(e, l, c, a, !0);
          if (!d || d.childCount) continue e;
        }
        return { depth: t, fit: s, move: i ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t) return null;
    for (; this.depth > t.depth; ) this.closeFrontierNode();
    t.fit.childCount && (this.placed = Vo(this.placed, t.depth, t.fit)), (e = t.move);
    for (let o = t.depth + 1; o <= e.depth; o++) {
      let r = e.node(o),
        i = r.type.contentMatch.fillBefore(r.content, !0, e.index(o));
      this.openFrontierNode(r.type, r.attrs, i);
    }
    return e;
  }
  openFrontierNode(e, t = null, o) {
    let r = this.frontier[this.depth];
    (r.match = r.match.matchType(e)),
      (this.placed = Vo(this.placed, this.depth, x.from(e.create(t, o)))),
      this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let e = this.frontier.pop().match.fillBefore(x.empty, !0);
    e.childCount && (this.placed = Vo(this.placed, this.frontier.length, e));
  }
}
function Fo(n, e, t) {
  return e == 0
    ? n.cutByIndex(t, n.childCount)
    : n.replaceChild(0, n.firstChild.copy(Fo(n.firstChild.content, e - 1, t)));
}
function Vo(n, e, t) {
  return e == 0
    ? n.append(t)
    : n.replaceChild(n.childCount - 1, n.lastChild.copy(Vo(n.lastChild.content, e - 1, t)));
}
function Ws(n, e) {
  for (let t = 0; t < e; t++) n = n.firstChild.content;
  return n;
}
function lm(n, e, t) {
  if (e <= 0) return n;
  let o = n.content;
  return (
    e > 1 && (o = o.replaceChild(0, lm(o.firstChild, e - 1, o.childCount == 1 ? t - 1 : 0))),
    e > 0 &&
      ((o = n.type.contentMatch.fillBefore(o).append(o)),
      t <= 0 && (o = o.append(n.type.contentMatch.matchFragment(o).fillBefore(x.empty, !0)))),
    n.copy(o)
  );
}
function Hs(n, e, t, o, r) {
  let i = n.node(e),
    s = r ? n.indexAfter(e) : n.index(e);
  if (s == i.childCount && !t.compatibleContent(i.type)) return null;
  let l = o.fillBefore(i.content, !0, s);
  return l && !Ux(t, i.content, s) ? l : null;
}
function Ux(n, e, t) {
  for (let o = t; o < e.childCount; o++) if (!n.allowsMarks(e.child(o).marks)) return !0;
  return !1;
}
class Qo extends fe {
  constructor(e, t, o) {
    super(), (this.pos = e), (this.attr = t), (this.value = o);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return Y.fail("No node at attribute step's position");
    let o = Object.create(null);
    for (let i in t.attrs) o[i] = t.attrs[i];
    o[this.attr] = this.value;
    let r = t.type.create(o, null, t.marks);
    return Y.fromReplace(e, this.pos, this.pos + 1, new O(x.from(r), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return De.empty;
  }
  invert(e) {
    return new Qo(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Qo(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new Qo(t.pos, t.attr, t.value);
  }
}
fe.jsonID("attr", Qo);
class Ei extends fe {
  constructor(e, t) {
    super(), (this.attr = e), (this.value = t);
  }
  apply(e) {
    let t = Object.create(null);
    for (let r in e.attrs) t[r] = e.attrs[r];
    t[this.attr] = this.value;
    let o = e.type.create(t, e.content, e.marks);
    return Y.ok(o);
  }
  getMap() {
    return De.empty;
  }
  invert(e) {
    return new Ei(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string") throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new Ei(t.attr, t.value);
  }
}
fe.jsonID("docAttr", Ei);
let pr = class extends Error {};
pr = function n(e) {
  let t = Error.call(this, e);
  return (t.__proto__ = n.prototype), t;
};
pr.prototype = Object.create(Error.prototype);
pr.prototype.constructor = pr;
pr.prototype.name = "TransformError";
const Us = Object.create(null);
class j {
  constructor(e, t, o) {
    (this.$anchor = e), (this.$head = t), (this.ranges = o || [new Gx(e.min(t), e.max(t))]);
  }
  get anchor() {
    return this.$anchor.pos;
  }
  get head() {
    return this.$head.pos;
  }
  get from() {
    return this.$from.pos;
  }
  get to() {
    return this.$to.pos;
  }
  get $from() {
    return this.ranges[0].$from;
  }
  get $to() {
    return this.ranges[0].$to;
  }
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++) if (e[t].$from.pos != e[t].$to.pos) return !1;
    return !0;
  }
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  replace(e, t = O.empty) {
    let o = t.content.lastChild,
      r = null;
    for (let l = 0; l < t.openEnd; l++) (r = o), (o = o.lastChild);
    let i = e.steps.length,
      s = this.ranges;
    for (let l = 0; l < s.length; l++) {
      let { $from: a, $to: c } = s[l],
        d = e.mapping.slice(i);
      e.replaceRange(d.map(a.pos), d.map(c.pos), l ? O.empty : t),
        l == 0 && gh(e, i, (o ? o.isInline : r && r.isTextblock) ? -1 : 1);
    }
  }
  replaceWith(e, t) {
    let o = e.steps.length,
      r = this.ranges;
    for (let i = 0; i < r.length; i++) {
      let { $from: s, $to: l } = r[i],
        a = e.mapping.slice(o),
        c = a.map(s.pos),
        d = a.map(l.pos);
      i ? e.deleteRange(c, d) : (e.replaceRangeWith(c, d, t), gh(e, o, t.isInline ? -1 : 1));
    }
  }
  static findFrom(e, t, o = !1) {
    let r = e.parent.inlineContent ? new B(e) : Vn(e.node(0), e.parent, e.pos, e.index(), t, o);
    if (r) return r;
    for (let i = e.depth - 1; i >= 0; i--) {
      let s =
        t < 0
          ? Vn(e.node(0), e.node(i), e.before(i + 1), e.index(i), t, o)
          : Vn(e.node(0), e.node(i), e.after(i + 1), e.index(i) + 1, t, o);
      if (s) return s;
    }
    return null;
  }
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new qe(e.node(0));
  }
  static atStart(e) {
    return Vn(e, e, 0, 0, 1) || new qe(e);
  }
  static atEnd(e) {
    return Vn(e, e, e.content.size, e.childCount, -1) || new qe(e);
  }
  static fromJSON(e, t) {
    if (!t || !t.type) throw new RangeError("Invalid input for Selection.fromJSON");
    let o = Us[t.type];
    if (!o) throw new RangeError(`No selection type ${t.type} defined`);
    return o.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in Us) throw new RangeError("Duplicate use of selection JSON ID " + e);
    return (Us[e] = t), (t.prototype.jsonID = e), t;
  }
  getBookmark() {
    return B.between(this.$anchor, this.$head).getBookmark();
  }
}
j.prototype.visible = !0;
class Gx {
  constructor(e, t) {
    (this.$from = e), (this.$to = t);
  }
}
let uh = !1;
function mh(n) {
  !uh &&
    !n.parent.inlineContent &&
    ((uh = !0),
    console.warn(
      "TextSelection endpoint not pointing into a node with inline content (" +
        n.parent.type.name +
        ")",
    ));
}
class B extends j {
  constructor(e, t = e) {
    mh(e), mh(t), super(e, t);
  }
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let o = e.resolve(t.map(this.head));
    if (!o.parent.inlineContent) return j.near(o);
    let r = e.resolve(t.map(this.anchor));
    return new B(r.parent.inlineContent ? r : o, o);
  }
  replace(e, t = O.empty) {
    if ((super.replace(e, t), t == O.empty)) {
      let o = this.$from.marksAcross(this.$to);
      o && e.ensureMarks(o);
    }
  }
  eq(e) {
    return e instanceof B && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new ns(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new B(e.resolve(t.anchor), e.resolve(t.head));
  }
  static create(e, t, o = t) {
    let r = e.resolve(t);
    return new this(r, o == t ? r : e.resolve(o));
  }
  static between(e, t, o) {
    let r = e.pos - t.pos;
    if (((!o || r) && (o = r >= 0 ? 1 : -1), !t.parent.inlineContent)) {
      let i = j.findFrom(t, o, !0) || j.findFrom(t, -o, !0);
      if (i) t = i.$head;
      else return j.near(t, o);
    }
    return (
      e.parent.inlineContent ||
        (r == 0
          ? (e = t)
          : ((e = (j.findFrom(e, -o, !0) || j.findFrom(e, o, !0)).$anchor),
            e.pos < t.pos != r < 0 && (e = t))),
      new B(e, t)
    );
  }
}
j.jsonID("text", B);
class ns {
  constructor(e, t) {
    (this.anchor = e), (this.head = t);
  }
  map(e) {
    return new ns(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return B.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class A extends j {
  constructor(e) {
    let t = e.nodeAfter,
      o = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, o), (this.node = t);
  }
  map(e, t) {
    let { deleted: o, pos: r } = t.mapResult(this.anchor),
      i = e.resolve(r);
    return o ? j.near(i) : new A(i);
  }
  content() {
    return new O(x.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof A && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new tc(this.anchor);
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new A(e.resolve(t.anchor));
  }
  static create(e, t) {
    return new A(e.resolve(t));
  }
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
A.prototype.visible = !1;
j.jsonID("node", A);
class tc {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: o } = e.mapResult(this.anchor);
    return t ? new ns(o, o) : new tc(o);
  }
  resolve(e) {
    let t = e.resolve(this.anchor),
      o = t.nodeAfter;
    return o && A.isSelectable(o) ? new A(t) : j.near(t);
  }
}
class qe extends j {
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = O.empty) {
    if (t == O.empty) {
      e.delete(0, e.doc.content.size);
      let o = j.atStart(e.doc);
      o.eq(e.selection) || e.setSelection(o);
    } else super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  static fromJSON(e) {
    return new qe(e);
  }
  map(e) {
    return new qe(e);
  }
  eq(e) {
    return e instanceof qe;
  }
  getBookmark() {
    return Yx;
  }
}
j.jsonID("all", qe);
const Yx = {
  map() {
    return this;
  },
  resolve(n) {
    return new qe(n);
  },
};
function Vn(n, e, t, o, r, i = !1) {
  if (e.inlineContent) return B.create(n, t);
  for (let s = o - (r > 0 ? 0 : 1); r > 0 ? s < e.childCount : s >= 0; s += r) {
    let l = e.child(s);
    if (l.isAtom) {
      if (!i && A.isSelectable(l)) return A.create(n, t - (r < 0 ? l.nodeSize : 0));
    } else {
      let a = Vn(n, l, t + r, r < 0 ? l.childCount : 0, r, i);
      if (a) return a;
    }
    t += l.nodeSize * r;
  }
  return null;
}
function gh(n, e, t) {
  let o = n.steps.length - 1;
  if (o < e) return;
  let r = n.steps[o];
  if (!(r instanceof Ee || r instanceof Oe)) return;
  let i = n.mapping.maps[o],
    s;
  i.forEach((l, a, c, d) => {
    s == null && (s = d);
  }),
    n.setSelection(j.near(n.doc.resolve(s), t));
}
function yh(n, e) {
  return !e || !n ? n : n.bind(e);
}
class Lr {
  constructor(e, t, o) {
    (this.name = e), (this.init = yh(t.init, o)), (this.apply = yh(t.apply, o));
  }
}
new Lr("doc", {
  init(n) {
    return n.doc || n.schema.topNodeType.createAndFill();
  },
  apply(n) {
    return n.doc;
  },
}),
  new Lr("selection", {
    init(n, e) {
      return n.selection || j.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    },
  }),
  new Lr("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, o) {
      return o.selection.$cursor ? n.storedMarks : null;
    },
  }),
  new Lr("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    },
  });
function am(n, e, t) {
  for (let o in n) {
    let r = n[o];
    r instanceof Function ? (r = r.bind(e)) : o == "handleDOMEvents" && (r = am(r, e, {})),
      (t[o] = r);
  }
  return t;
}
class Or {
  constructor(e) {
    (this.spec = e),
      (this.props = {}),
      e.props && am(e.props, this, this.props),
      (this.key = e.key ? e.key.key : cm("plugin"));
  }
  getState(e) {
    return e[this.key];
  }
}
const Gs = Object.create(null);
function cm(n) {
  return n in Gs ? n + "$" + ++Gs[n] : ((Gs[n] = 0), n + "$");
}
class Nr {
  constructor(e = "key") {
    this.key = cm(e);
  }
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  getState(e) {
    return e[this.key];
  }
}
const bn = function (n) {
    for (var e = 0; ; e++) if (((n = n.previousSibling), !n)) return e;
  },
  dm = function (n, e, t, o) {
    return t && (kh(n, e, t, o, -1) || kh(n, e, t, o, 1));
  },
  Xx = /^(img|br|input|textarea|hr)$/i;
function kh(n, e, t, o, r) {
  for (;;) {
    if (n == t && e == o) return !0;
    if (e == (r < 0 ? 0 : Ai(n))) {
      let i = n.parentNode;
      if (!i || i.nodeType != 1 || nc(n) || Xx.test(n.nodeName) || n.contentEditable == "false")
        return !1;
      (e = bn(n) + (r < 0 ? 0 : 1)), (n = i);
    } else if (n.nodeType == 1) {
      if (((n = n.childNodes[e + (r < 0 ? -1 : 0)]), n.contentEditable == "false")) return !1;
      e = r < 0 ? Ai(n) : 0;
    } else return !1;
  }
}
function Ai(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Qx(n, e, t) {
  for (let o = e == 0, r = e == Ai(n); o || r; ) {
    if (n == t) return !0;
    let i = bn(n);
    if (((n = n.parentNode), !n)) return !1;
    (o = o && i == 0), (r = r && i == Ai(n));
  }
}
function nc(n) {
  let e;
  for (let t = n; t && !(e = t.pmViewDesc); t = t.parentNode);
  return e && e.node && e.node.isBlock && (e.dom == n || e.contentDOM == n);
}
const hm = function (n) {
  return n.focusNode && dm(n.focusNode, n.focusOffset, n.anchorNode, n.anchorOffset);
};
function pm(n, e) {
  let t = document.createEvent("Event");
  return t.initEvent("keydown", !0, !0), (t.keyCode = n), (t.key = t.code = e), t;
}
const ot = typeof navigator < "u" ? navigator : null,
  wh = typeof document < "u" ? document : null,
  At = (ot && ot.userAgent) || "",
  sa = /Edge\/(\d+)/.exec(At),
  fm = /MSIE \d/.exec(At),
  la = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(At),
  Tr = !!(fm || la || sa),
  um = fm ? document.documentMode : la ? +la[1] : sa ? +sa[1] : 0,
  rs = !Tr && /gecko\/(\d+)/i.test(At);
rs && +(/Firefox\/(\d+)/.exec(At) || [0, 0])[1];
const aa = !Tr && /Chrome\/(\d+)/.exec(At),
  vn = !!aa,
  Zx = aa ? +aa[1] : 0,
  xn = !Tr && !!ot && /Apple Computer/.test(ot.vendor),
  oc = xn && (/Mobile\/\w+/.test(At) || (!!ot && ot.maxTouchPoints > 2)),
  Ve = oc || (ot ? /Mac/.test(ot.platform) : !1),
  _x = ot ? /Win/.test(ot.platform) : !1,
  Er = /Android \d/.test(At),
  rc = !!wh && "webkitFontSmoothing" in wh.documentElement.style,
  eS = rc ? +(/\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0;
function tS(n, e = null) {
  let t = n.domSelectionRange(),
    o = n.state.doc;
  if (!t.focusNode) return null;
  let r = n.docView.nearestDesc(t.focusNode),
    i = r && r.size == 0,
    s = n.docView.posFromDOM(t.focusNode, t.focusOffset, 1);
  if (s < 0) return null;
  let l = o.resolve(s),
    a,
    c;
  if (hm(t)) {
    for (a = l; r && !r.node; ) r = r.parent;
    let d = r.node;
    if (
      r &&
      d.isAtom &&
      A.isSelectable(d) &&
      r.parent &&
      !(d.isInline && Qx(t.focusNode, t.focusOffset, r.dom))
    ) {
      let h = r.posBefore;
      c = new A(s == h ? l : o.resolve(h));
    }
  } else {
    let d = n.docView.posFromDOM(t.anchorNode, t.anchorOffset, 1);
    if (d < 0) return null;
    a = o.resolve(d);
  }
  if (!c) {
    let d = e == "pointer" || (n.state.selection.head < l.pos && !i) ? 1 : -1;
    c = gm(n, a, l, d);
  }
  return c;
}
function mm(n) {
  return n.editable
    ? n.hasFocus()
    : iS(n) && document.activeElement && document.activeElement.contains(n.dom);
}
function ic(n, e = !1) {
  let t = n.state.selection;
  if ((rS(n, t), !!mm(n))) {
    if (!e && n.input.mouseDown && n.input.mouseDown.allowDefault && vn) {
      let o = n.domSelectionRange(),
        r = n.domObserver.currentSelection;
      if (
        o.anchorNode &&
        r.anchorNode &&
        dm(o.anchorNode, o.anchorOffset, r.anchorNode, r.anchorOffset)
      ) {
        (n.input.mouseDown.delayedSelectionSync = !0), n.domObserver.setCurSelection();
        return;
      }
    }
    if ((n.domObserver.disconnectSelection(), n.cursorWrapper)) oS(n);
    else {
      let { anchor: o, head: r } = t,
        i,
        s;
      bh &&
        !(t instanceof B) &&
        (t.$from.parent.inlineContent || (i = vh(n, t.from)),
        !t.empty && !t.$from.parent.inlineContent && (s = vh(n, t.to))),
        n.docView.setSelection(o, r, n.root, e),
        bh && (i && xh(i), s && xh(s)),
        t.visible
          ? n.dom.classList.remove("ProseMirror-hideselection")
          : (n.dom.classList.add("ProseMirror-hideselection"),
            "onselectionchange" in document && nS(n));
    }
    n.domObserver.setCurSelection(), n.domObserver.connectSelection();
  }
}
const bh = xn || (vn && Zx < 63);
function vh(n, e) {
  let { node: t, offset: o } = n.docView.domFromPos(e, 0),
    r = o < t.childNodes.length ? t.childNodes[o] : null,
    i = o ? t.childNodes[o - 1] : null;
  if (xn && r && r.contentEditable == "false") return Ys(r);
  if ((!r || r.contentEditable == "false") && (!i || i.contentEditable == "false")) {
    if (r) return Ys(r);
    if (i) return Ys(i);
  }
}
function Ys(n) {
  return (
    (n.contentEditable = "true"),
    xn && n.draggable && ((n.draggable = !1), (n.wasDraggable = !0)),
    n
  );
}
function xh(n) {
  (n.contentEditable = "false"), n.wasDraggable && ((n.draggable = !0), (n.wasDraggable = null));
}
function nS(n) {
  let e = n.dom.ownerDocument;
  e.removeEventListener("selectionchange", n.input.hideSelectionGuard);
  let t = n.domSelectionRange(),
    o = t.anchorNode,
    r = t.anchorOffset;
  e.addEventListener(
    "selectionchange",
    (n.input.hideSelectionGuard = () => {
      (t.anchorNode != o || t.anchorOffset != r) &&
        (e.removeEventListener("selectionchange", n.input.hideSelectionGuard),
        setTimeout(() => {
          (!mm(n) || n.state.selection.visible) &&
            n.dom.classList.remove("ProseMirror-hideselection");
        }, 20));
    }),
  );
}
function oS(n) {
  let e = n.domSelection(),
    t = document.createRange(),
    o = n.cursorWrapper.dom,
    r = o.nodeName == "IMG";
  r ? t.setEnd(o.parentNode, bn(o) + 1) : t.setEnd(o, 0),
    t.collapse(!1),
    e.removeAllRanges(),
    e.addRange(t),
    !r && !n.state.selection.visible && Tr && um <= 11 && ((o.disabled = !0), (o.disabled = !1));
}
function rS(n, e) {
  if (e instanceof A) {
    let t = n.docView.descAt(e.from);
    t != n.lastSelectedViewDesc && (Sh(n), t && t.selectNode(), (n.lastSelectedViewDesc = t));
  } else Sh(n);
}
function Sh(n) {
  n.lastSelectedViewDesc &&
    (n.lastSelectedViewDesc.parent && n.lastSelectedViewDesc.deselectNode(),
    (n.lastSelectedViewDesc = void 0));
}
function gm(n, e, t, o) {
  return n.someProp("createSelectionBetween", (r) => r(n, e, t)) || B.between(e, t, o);
}
function iS(n) {
  let e = n.domSelectionRange();
  if (!e.anchorNode) return !1;
  try {
    return (
      n.dom.contains(e.anchorNode.nodeType == 3 ? e.anchorNode.parentNode : e.anchorNode) &&
      (n.editable ||
        n.dom.contains(e.focusNode.nodeType == 3 ? e.focusNode.parentNode : e.focusNode))
    );
  } catch {
    return !1;
  }
}
function ca(n, e) {
  let { $anchor: t, $head: o } = n.selection,
    r = e > 0 ? t.max(o) : t.min(o),
    i = r.parent.inlineContent
      ? r.depth
        ? n.doc.resolve(e > 0 ? r.after() : r.before())
        : null
      : r;
  return i && j.findFrom(i, e);
}
function kt(n, e) {
  return n.dispatch(n.state.tr.setSelection(e).scrollIntoView()), !0;
}
function $h(n, e, t) {
  let o = n.state.selection;
  if (o instanceof B)
    if (t.indexOf("s") > -1) {
      let { $head: r } = o,
        i = r.textOffset ? null : e < 0 ? r.nodeBefore : r.nodeAfter;
      if (!i || i.isText || !i.isLeaf) return !1;
      let s = n.state.doc.resolve(r.pos + i.nodeSize * (e < 0 ? -1 : 1));
      return kt(n, new B(o.$anchor, s));
    } else if (o.empty) {
      if (n.endOfTextblock(e > 0 ? "forward" : "backward")) {
        let r = ca(n.state, e);
        return r && r instanceof A ? kt(n, r) : !1;
      } else if (!(Ve && t.indexOf("m") > -1)) {
        let r = o.$head,
          i = r.textOffset ? null : e < 0 ? r.nodeBefore : r.nodeAfter,
          s;
        if (!i || i.isText) return !1;
        let l = e < 0 ? r.pos - i.nodeSize : r.pos;
        return i.isAtom || ((s = n.docView.descAt(l)) && !s.contentDOM)
          ? A.isSelectable(i)
            ? kt(n, new A(e < 0 ? n.state.doc.resolve(r.pos - i.nodeSize) : r))
            : rc
              ? kt(n, new B(n.state.doc.resolve(e < 0 ? l : l + i.nodeSize)))
              : !1
          : !1;
      }
    } else return !1;
  else {
    if (o instanceof A && o.node.isInline) return kt(n, new B(e > 0 ? o.$to : o.$from));
    {
      let r = ca(n.state, e);
      return r ? kt(n, r) : !1;
    }
  }
}
function Ii(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Zo(n, e) {
  let t = n.pmViewDesc;
  return t && t.size == 0 && (e < 0 || n.nextSibling || n.nodeName != "BR");
}
function On(n, e) {
  return e < 0 ? sS(n) : lS(n);
}
function sS(n) {
  let e = n.domSelectionRange(),
    t = e.focusNode,
    o = e.focusOffset;
  if (!t) return;
  let r,
    i,
    s = !1;
  for (rs && t.nodeType == 1 && o < Ii(t) && Zo(t.childNodes[o], -1) && (s = !0); ; )
    if (o > 0) {
      if (t.nodeType != 1) break;
      {
        let l = t.childNodes[o - 1];
        if (Zo(l, -1)) (r = t), (i = --o);
        else if (l.nodeType == 3) (t = l), (o = t.nodeValue.length);
        else break;
      }
    } else {
      if (ym(t)) break;
      {
        let l = t.previousSibling;
        for (; l && Zo(l, -1); ) (r = t.parentNode), (i = bn(l)), (l = l.previousSibling);
        if (l) (t = l), (o = Ii(t));
        else {
          if (((t = t.parentNode), t == n.dom)) break;
          o = 0;
        }
      }
    }
  s ? da(n, t, o) : r && da(n, r, i);
}
function lS(n) {
  let e = n.domSelectionRange(),
    t = e.focusNode,
    o = e.focusOffset;
  if (!t) return;
  let r = Ii(t),
    i,
    s;
  for (;;)
    if (o < r) {
      if (t.nodeType != 1) break;
      let l = t.childNodes[o];
      if (Zo(l, 1)) (i = t), (s = ++o);
      else break;
    } else {
      if (ym(t)) break;
      {
        let l = t.nextSibling;
        for (; l && Zo(l, 1); ) (i = l.parentNode), (s = bn(l) + 1), (l = l.nextSibling);
        if (l) (t = l), (o = 0), (r = Ii(t));
        else {
          if (((t = t.parentNode), t == n.dom)) break;
          o = r = 0;
        }
      }
    }
  i && da(n, i, s);
}
function ym(n) {
  let e = n.pmViewDesc;
  return e && e.node && e.node.isBlock;
}
function aS(n, e) {
  for (; n && e == n.childNodes.length && !nc(n); ) (e = bn(n) + 1), (n = n.parentNode);
  for (; n && e < n.childNodes.length; ) {
    let t = n.childNodes[e];
    if (t.nodeType == 3) return t;
    if (t.nodeType == 1 && t.contentEditable == "false") break;
    (n = t), (e = 0);
  }
}
function cS(n, e) {
  for (; n && !e && !nc(n); ) (e = bn(n)), (n = n.parentNode);
  for (; n && e; ) {
    let t = n.childNodes[e - 1];
    if (t.nodeType == 3) return t;
    if (t.nodeType == 1 && t.contentEditable == "false") break;
    (n = t), (e = n.childNodes.length);
  }
}
function da(n, e, t) {
  if (e.nodeType != 3) {
    let i, s;
    (s = aS(e, t)) ? ((e = s), (t = 0)) : (i = cS(e, t)) && ((e = i), (t = i.nodeValue.length));
  }
  let o = n.domSelection();
  if (hm(o)) {
    let i = document.createRange();
    i.setEnd(e, t), i.setStart(e, t), o.removeAllRanges(), o.addRange(i);
  } else o.extend && o.extend(e, t);
  n.domObserver.setCurSelection();
  let { state: r } = n;
  setTimeout(() => {
    n.state == r && ic(n);
  }, 50);
}
function Mh(n, e) {
  let t = n.state.doc.resolve(e);
  if (!(vn || _x) && t.parent.inlineContent) {
    let o = n.coordsAtPos(e);
    if (e > t.start()) {
      let r = n.coordsAtPos(e - 1),
        i = (r.top + r.bottom) / 2;
      if (i > o.top && i < o.bottom && Math.abs(r.left - o.left) > 1)
        return r.left < o.left ? "ltr" : "rtl";
    }
    if (e < t.end()) {
      let r = n.coordsAtPos(e + 1),
        i = (r.top + r.bottom) / 2;
      if (i > o.top && i < o.bottom && Math.abs(r.left - o.left) > 1)
        return r.left > o.left ? "ltr" : "rtl";
    }
  }
  return getComputedStyle(n.dom).direction == "rtl" ? "rtl" : "ltr";
}
function Ch(n, e, t) {
  let o = n.state.selection;
  if ((o instanceof B && !o.empty) || t.indexOf("s") > -1 || (Ve && t.indexOf("m") > -1)) return !1;
  let { $from: r, $to: i } = o;
  if (!r.parent.inlineContent || n.endOfTextblock(e < 0 ? "up" : "down")) {
    let s = ca(n.state, e);
    if (s && s instanceof A) return kt(n, s);
  }
  if (!r.parent.inlineContent) {
    let s = e < 0 ? r : i,
      l = o instanceof qe ? j.near(s, e) : j.findFrom(s, e);
    return l ? kt(n, l) : !1;
  }
  return !1;
}
function Oh(n, e) {
  if (!(n.state.selection instanceof B)) return !0;
  let { $head: t, $anchor: o, empty: r } = n.state.selection;
  if (!t.sameParent(o)) return !0;
  if (!r) return !1;
  if (n.endOfTextblock(e > 0 ? "forward" : "backward")) return !0;
  let i = !t.textOffset && (e < 0 ? t.nodeBefore : t.nodeAfter);
  if (i && !i.isText) {
    let s = n.state.tr;
    return (
      e < 0 ? s.delete(t.pos - i.nodeSize, t.pos) : s.delete(t.pos, t.pos + i.nodeSize),
      n.dispatch(s),
      !0
    );
  }
  return !1;
}
function Nh(n, e, t) {
  n.domObserver.stop(), (e.contentEditable = t), n.domObserver.start();
}
function dS(n) {
  if (!xn || n.state.selection.$head.parentOffset > 0) return !1;
  let { focusNode: e, focusOffset: t } = n.domSelectionRange();
  if (e && e.nodeType == 1 && t == 0 && e.firstChild && e.firstChild.contentEditable == "false") {
    let o = e.firstChild;
    Nh(n, o, "true"), setTimeout(() => Nh(n, o, "false"), 20);
  }
  return !1;
}
function hS(n) {
  let e = "";
  return (
    n.ctrlKey && (e += "c"),
    n.metaKey && (e += "m"),
    n.altKey && (e += "a"),
    n.shiftKey && (e += "s"),
    e
  );
}
function pS(n, e) {
  let t = e.keyCode,
    o = hS(e);
  if (t == 8 || (Ve && t == 72 && o == "c")) return Oh(n, -1) || On(n, -1);
  if ((t == 46 && !e.shiftKey) || (Ve && t == 68 && o == "c")) return Oh(n, 1) || On(n, 1);
  if (t == 13 || t == 27) return !0;
  if (t == 37 || (Ve && t == 66 && o == "c")) {
    let r = t == 37 ? (Mh(n, n.state.selection.from) == "ltr" ? -1 : 1) : -1;
    return $h(n, r, o) || On(n, r);
  } else if (t == 39 || (Ve && t == 70 && o == "c")) {
    let r = t == 39 ? (Mh(n, n.state.selection.from) == "ltr" ? 1 : -1) : 1;
    return $h(n, r, o) || On(n, r);
  } else {
    if (t == 38 || (Ve && t == 80 && o == "c")) return Ch(n, -1, o) || On(n, -1);
    if (t == 40 || (Ve && t == 78 && o == "c")) return dS(n) || Ch(n, 1, o) || On(n, 1);
    if (o == (Ve ? "m" : "c") && (t == 66 || t == 73 || t == 89 || t == 90)) return !0;
  }
  return !1;
}
function km(n, e) {
  n.someProp("transformCopied", (f) => {
    e = f(e, n);
  });
  let t = [],
    { content: o, openStart: r, openEnd: i } = e;
  for (; r > 1 && i > 1 && o.childCount == 1 && o.firstChild.childCount == 1; ) {
    r--, i--;
    let f = o.firstChild;
    t.push(f.type.name, f.attrs != f.type.defaultAttrs ? f.attrs : null), (o = f.content);
  }
  let s = n.someProp("clipboardSerializer") || Lt.fromSchema(n.state.schema),
    l = $m(),
    a = l.createElement("div");
  a.appendChild(s.serializeFragment(o, { document: l }));
  let c = a.firstChild,
    d,
    h = 0;
  for (; c && c.nodeType == 1 && (d = Sm[c.nodeName.toLowerCase()]); ) {
    for (let f = d.length - 1; f >= 0; f--) {
      let u = l.createElement(d[f]);
      for (; a.firstChild; ) u.appendChild(a.firstChild);
      a.appendChild(u), h++;
    }
    c = a.firstChild;
  }
  c &&
    c.nodeType == 1 &&
    c.setAttribute("data-pm-slice", `${r} ${i}${h ? ` -${h}` : ""} ${JSON.stringify(t)}`);
  let p =
    n.someProp("clipboardTextSerializer", (f) => f(e, n)) ||
    e.content.textBetween(
      0,
      e.content.size,
      `

`,
    );
  return { dom: a, text: p };
}
function wm(n, e, t, o, r) {
  let i = r.parent.type.spec.code,
    s,
    l;
  if (!t && !e) return null;
  let a = e && (o || i || !t);
  if (a) {
    if (
      (n.someProp("transformPastedText", (p) => {
        e = p(e, i || o, n);
      }),
      i)
    )
      return e
        ? new O(
            x.from(
              n.state.schema.text(
                e.replace(
                  /\r\n?/g,
                  `
`,
                ),
              ),
            ),
            0,
            0,
          )
        : O.empty;
    let h = n.someProp("clipboardTextParser", (p) => p(e, r, o, n));
    if (h) l = h;
    else {
      let p = r.marks(),
        { schema: f } = n.state,
        u = Lt.fromSchema(f);
      (s = document.createElement("div")),
        e.split(/(?:\r\n?|\n)+/).forEach((m) => {
          let g = s.appendChild(document.createElement("p"));
          m && g.appendChild(u.serializeNode(f.text(m, p)));
        });
    }
  } else
    n.someProp("transformPastedHTML", (h) => {
      t = h(t, n);
    }),
      (s = mS(t)),
      rc && gS(s);
  let c = s && s.querySelector("[data-pm-slice]"),
    d = c && /^(\d+) (\d+)(?: -(\d+))? (.*)/.exec(c.getAttribute("data-pm-slice") || "");
  if (d && d[3])
    for (let h = +d[3]; h > 0; h--) {
      let p = s.firstChild;
      for (; p && p.nodeType != 1; ) p = p.nextSibling;
      if (!p) break;
      s = p;
    }
  if (
    (l ||
      (l = (
        n.someProp("clipboardParser") ||
        n.someProp("domParser") ||
        dr.fromSchema(n.state.schema)
      ).parseSlice(s, {
        preserveWhitespace: !!(a || d),
        context: r,
        ruleFromNode(h) {
          return h.nodeName == "BR" &&
            !h.nextSibling &&
            h.parentNode &&
            !fS.test(h.parentNode.nodeName)
            ? { ignore: !0 }
            : null;
        },
      })),
    d)
  )
    l = yS(Th(l, +d[1], +d[2]), d[4]);
  else if (((l = O.maxOpen(uS(l.content, r), !0)), l.openStart || l.openEnd)) {
    let h = 0,
      p = 0;
    for (
      let f = l.content.firstChild;
      h < l.openStart && !f.type.spec.isolating;
      h++, f = f.firstChild
    );
    for (
      let f = l.content.lastChild;
      p < l.openEnd && !f.type.spec.isolating;
      p++, f = f.lastChild
    );
    l = Th(l, h, p);
  }
  return (
    n.someProp("transformPasted", (h) => {
      l = h(l, n);
    }),
    l
  );
}
const fS =
  /^(a|abbr|acronym|b|cite|code|del|em|i|ins|kbd|label|output|q|ruby|s|samp|span|strong|sub|sup|time|u|tt|var)$/i;
function uS(n, e) {
  if (n.childCount < 2) return n;
  for (let t = e.depth; t >= 0; t--) {
    let o = e.node(t).contentMatchAt(e.index(t)),
      r,
      i = [];
    if (
      (n.forEach((s) => {
        if (!i) return;
        let l = o.findWrapping(s.type),
          a;
        if (!l) return (i = null);
        if ((a = i.length && r.length && vm(l, r, s, i[i.length - 1], 0))) i[i.length - 1] = a;
        else {
          i.length && (i[i.length - 1] = xm(i[i.length - 1], r.length));
          let c = bm(s, l);
          i.push(c), (o = o.matchType(c.type)), (r = l);
        }
      }),
      i)
    )
      return x.from(i);
  }
  return n;
}
function bm(n, e, t = 0) {
  for (let o = e.length - 1; o >= t; o--) n = e[o].create(null, x.from(n));
  return n;
}
function vm(n, e, t, o, r) {
  if (r < n.length && r < e.length && n[r] == e[r]) {
    let i = vm(n, e, t, o.lastChild, r + 1);
    if (i) return o.copy(o.content.replaceChild(o.childCount - 1, i));
    if (o.contentMatchAt(o.childCount).matchType(r == n.length - 1 ? t.type : n[r + 1]))
      return o.copy(o.content.append(x.from(bm(t, n, r + 1))));
  }
}
function xm(n, e) {
  if (e == 0) return n;
  let t = n.content.replaceChild(n.childCount - 1, xm(n.lastChild, e - 1)),
    o = n.contentMatchAt(n.childCount).fillBefore(x.empty, !0);
  return n.copy(t.append(o));
}
function ha(n, e, t, o, r, i) {
  let s = e < 0 ? n.firstChild : n.lastChild,
    l = s.content;
  return (
    n.childCount > 1 && (i = 0),
    r < o - 1 && (l = ha(l, e, t, o, r + 1, i)),
    r >= t &&
      (l =
        e < 0
          ? s
              .contentMatchAt(0)
              .fillBefore(l, i <= r)
              .append(l)
          : l.append(s.contentMatchAt(s.childCount).fillBefore(x.empty, !0))),
    n.replaceChild(e < 0 ? 0 : n.childCount - 1, s.copy(l))
  );
}
function Th(n, e, t) {
  return (
    e < n.openStart && (n = new O(ha(n.content, -1, e, n.openStart, 0, n.openEnd), e, n.openEnd)),
    t < n.openEnd && (n = new O(ha(n.content, 1, t, n.openEnd, 0, 0), n.openStart, t)),
    n
  );
}
const Sm = {
  thead: ["table"],
  tbody: ["table"],
  tfoot: ["table"],
  caption: ["table"],
  colgroup: ["table"],
  col: ["table", "colgroup"],
  tr: ["table", "tbody"],
  td: ["table", "tbody", "tr"],
  th: ["table", "tbody", "tr"],
};
let Eh = null;
function $m() {
  return Eh || (Eh = document.implementation.createHTMLDocument("title"));
}
function mS(n) {
  let e = /^(\s*<meta [^>]*>)*/.exec(n);
  e && (n = n.slice(e[0].length));
  let t = $m().createElement("div"),
    o = /<([a-z][^>\s]+)/i.exec(n),
    r;
  if (
    ((r = o && Sm[o[1].toLowerCase()]) &&
      (n =
        r.map((i) => "<" + i + ">").join("") +
        n +
        r
          .map((i) => "</" + i + ">")
          .reverse()
          .join("")),
    (t.innerHTML = n),
    r)
  )
    for (let i = 0; i < r.length; i++) t = t.querySelector(r[i]) || t;
  return t;
}
function gS(n) {
  let e = n.querySelectorAll(vn ? "span:not([class]):not([style])" : "span.Apple-converted-space");
  for (let t = 0; t < e.length; t++) {
    let o = e[t];
    o.childNodes.length == 1 &&
      o.textContent == " " &&
      o.parentNode &&
      o.parentNode.replaceChild(n.ownerDocument.createTextNode(" "), o);
  }
}
function yS(n, e) {
  if (!n.size) return n;
  let t = n.content.firstChild.type.schema,
    o;
  try {
    o = JSON.parse(e);
  } catch {
    return n;
  }
  let { content: r, openStart: i, openEnd: s } = n;
  for (let l = o.length - 2; l >= 0; l -= 2) {
    let a = t.nodes[o[l]];
    if (!a || a.hasRequiredAttrs()) break;
    (r = x.from(a.create(o[l + 1], r))), i++, s++;
  }
  return new O(r, i, s);
}
const He = {},
  Pe = {};
function xt(n, e) {
  (n.input.lastSelectionOrigin = e), (n.input.lastSelectionTime = Date.now());
}
Pe.keydown = (n, e) => {
  let t = e;
  if (
    ((n.input.shiftKey = t.keyCode == 16 || t.shiftKey),
    !Cm(n, t) &&
      ((n.input.lastKeyCode = t.keyCode),
      (n.input.lastKeyCodeTime = Date.now()),
      !(Er && vn && t.keyCode == 13)))
  )
    if (
      (t.keyCode != 229 && n.domObserver.forceFlush(),
      oc && t.keyCode == 13 && !t.ctrlKey && !t.altKey && !t.metaKey)
    ) {
      let o = Date.now();
      (n.input.lastIOSEnter = o),
        (n.input.lastIOSEnterFallbackTimeout = setTimeout(() => {
          n.input.lastIOSEnter == o &&
            (n.someProp("handleKeyDown", (r) => r(n, pm(13, "Enter"))), (n.input.lastIOSEnter = 0));
        }, 200));
    } else
      n.someProp("handleKeyDown", (o) => o(n, t)) || pS(n, t) ? t.preventDefault() : xt(n, "key");
};
Pe.keyup = (n, e) => {
  e.keyCode == 16 && (n.input.shiftKey = !1);
};
Pe.keypress = (n, e) => {
  let t = e;
  if (Cm(n, t) || !t.charCode || (t.ctrlKey && !t.altKey) || (Ve && t.metaKey)) return;
  if (n.someProp("handleKeyPress", (r) => r(n, t))) {
    t.preventDefault();
    return;
  }
  let o = n.state.selection;
  if (!(o instanceof B) || !o.$from.sameParent(o.$to)) {
    let r = String.fromCharCode(t.charCode);
    !/[\r\n]/.test(r) &&
      !n.someProp("handleTextInput", (i) => i(n, o.$from.pos, o.$to.pos, r)) &&
      n.dispatch(n.state.tr.insertText(r).scrollIntoView()),
      t.preventDefault();
  }
};
function is(n) {
  return { left: n.clientX, top: n.clientY };
}
function kS(n, e) {
  let t = e.x - n.clientX,
    o = e.y - n.clientY;
  return t * t + o * o < 100;
}
function sc(n, e, t, o, r) {
  if (o == -1) return !1;
  let i = n.state.doc.resolve(o);
  for (let s = i.depth + 1; s > 0; s--)
    if (
      n.someProp(e, (l) =>
        s > i.depth
          ? l(n, t, i.nodeAfter, i.before(s), r, !0)
          : l(n, t, i.node(s), i.before(s), r, !1),
      )
    )
      return !0;
  return !1;
}
function Yn(n, e, t) {
  n.focused || n.focus();
  let o = n.state.tr.setSelection(e);
  t == "pointer" && o.setMeta("pointer", !0), n.dispatch(o);
}
function wS(n, e) {
  if (e == -1) return !1;
  let t = n.state.doc.resolve(e),
    o = t.nodeAfter;
  return o && o.isAtom && A.isSelectable(o) ? (Yn(n, new A(t), "pointer"), !0) : !1;
}
function bS(n, e) {
  if (e == -1) return !1;
  let t = n.state.selection,
    o,
    r;
  t instanceof A && (o = t.node);
  let i = n.state.doc.resolve(e);
  for (let s = i.depth + 1; s > 0; s--) {
    let l = s > i.depth ? i.nodeAfter : i.node(s);
    if (A.isSelectable(l)) {
      o && t.$from.depth > 0 && s >= t.$from.depth && i.before(t.$from.depth + 1) == t.$from.pos
        ? (r = i.before(t.$from.depth))
        : (r = i.before(s));
      break;
    }
  }
  return r != null ? (Yn(n, A.create(n.state.doc, r), "pointer"), !0) : !1;
}
function vS(n, e, t, o, r) {
  return (
    sc(n, "handleClickOn", e, t, o) ||
    n.someProp("handleClick", (i) => i(n, e, o)) ||
    (r ? bS(n, t) : wS(n, t))
  );
}
function xS(n, e, t, o) {
  return (
    sc(n, "handleDoubleClickOn", e, t, o) || n.someProp("handleDoubleClick", (r) => r(n, e, o))
  );
}
function SS(n, e, t, o) {
  return (
    sc(n, "handleTripleClickOn", e, t, o) ||
    n.someProp("handleTripleClick", (r) => r(n, e, o)) ||
    $S(n, t, o)
  );
}
function $S(n, e, t) {
  if (t.button != 0) return !1;
  let o = n.state.doc;
  if (e == -1) return o.inlineContent ? (Yn(n, B.create(o, 0, o.content.size), "pointer"), !0) : !1;
  let r = o.resolve(e);
  for (let i = r.depth + 1; i > 0; i--) {
    let s = i > r.depth ? r.nodeAfter : r.node(i),
      l = r.before(i);
    if (s.inlineContent) Yn(n, B.create(o, l + 1, l + 1 + s.content.size), "pointer");
    else if (A.isSelectable(s)) Yn(n, A.create(o, l), "pointer");
    else continue;
    return !0;
  }
}
function lc(n) {
  return Di(n);
}
const Mm = Ve ? "metaKey" : "ctrlKey";
He.mousedown = (n, e) => {
  let t = e;
  n.input.shiftKey = t.shiftKey;
  let o = lc(n),
    r = Date.now(),
    i = "singleClick";
  r - n.input.lastClick.time < 500 &&
    kS(t, n.input.lastClick) &&
    !t[Mm] &&
    (n.input.lastClick.type == "singleClick"
      ? (i = "doubleClick")
      : n.input.lastClick.type == "doubleClick" && (i = "tripleClick")),
    (n.input.lastClick = { time: r, x: t.clientX, y: t.clientY, type: i });
  let s = n.posAtCoords(is(t));
  s &&
    (i == "singleClick"
      ? (n.input.mouseDown && n.input.mouseDown.done(), (n.input.mouseDown = new MS(n, s, t, !!o)))
      : (i == "doubleClick" ? xS : SS)(n, s.pos, s.inside, t)
        ? t.preventDefault()
        : xt(n, "pointer"));
};
class MS {
  constructor(e, t, o, r) {
    (this.view = e),
      (this.pos = t),
      (this.event = o),
      (this.flushed = r),
      (this.delayedSelectionSync = !1),
      (this.mightDrag = null),
      (this.startDoc = e.state.doc),
      (this.selectNode = !!o[Mm]),
      (this.allowDefault = o.shiftKey);
    let i, s;
    if (t.inside > -1) (i = e.state.doc.nodeAt(t.inside)), (s = t.inside);
    else {
      let d = e.state.doc.resolve(t.pos);
      (i = d.parent), (s = d.depth ? d.before() : 0);
    }
    const l = r ? null : o.target,
      a = l ? e.docView.nearestDesc(l, !0) : null;
    this.target = a ? a.dom : null;
    let { selection: c } = e.state;
    ((o.button == 0 && i.type.spec.draggable && i.type.spec.selectable !== !1) ||
      (c instanceof A && c.from <= s && c.to > s)) &&
      (this.mightDrag = {
        node: i,
        pos: s,
        addAttr: !!(this.target && !this.target.draggable),
        setUneditable: !!(this.target && rs && !this.target.hasAttribute("contentEditable")),
      }),
      this.target &&
        this.mightDrag &&
        (this.mightDrag.addAttr || this.mightDrag.setUneditable) &&
        (this.view.domObserver.stop(),
        this.mightDrag.addAttr && (this.target.draggable = !0),
        this.mightDrag.setUneditable &&
          setTimeout(() => {
            this.view.input.mouseDown == this &&
              this.target.setAttribute("contentEditable", "false");
          }, 20),
        this.view.domObserver.start()),
      e.root.addEventListener("mouseup", (this.up = this.up.bind(this))),
      e.root.addEventListener("mousemove", (this.move = this.move.bind(this))),
      xt(e, "pointer");
  }
  done() {
    this.view.root.removeEventListener("mouseup", this.up),
      this.view.root.removeEventListener("mousemove", this.move),
      this.mightDrag &&
        this.target &&
        (this.view.domObserver.stop(),
        this.mightDrag.addAttr && this.target.removeAttribute("draggable"),
        this.mightDrag.setUneditable && this.target.removeAttribute("contentEditable"),
        this.view.domObserver.start()),
      this.delayedSelectionSync && setTimeout(() => ic(this.view)),
      (this.view.input.mouseDown = null);
  }
  up(e) {
    if ((this.done(), !this.view.dom.contains(e.target))) return;
    let t = this.pos;
    this.view.state.doc != this.startDoc && (t = this.view.posAtCoords(is(e))),
      this.updateAllowDefault(e),
      this.allowDefault || !t
        ? xt(this.view, "pointer")
        : vS(this.view, t.pos, t.inside, e, this.selectNode)
          ? e.preventDefault()
          : e.button == 0 &&
              (this.flushed ||
                (xn && this.mightDrag && !this.mightDrag.node.isAtom) ||
                (vn &&
                  !this.view.state.selection.visible &&
                  Math.min(
                    Math.abs(t.pos - this.view.state.selection.from),
                    Math.abs(t.pos - this.view.state.selection.to),
                  ) <= 2))
            ? (Yn(this.view, j.near(this.view.state.doc.resolve(t.pos)), "pointer"),
              e.preventDefault())
            : xt(this.view, "pointer");
  }
  move(e) {
    this.updateAllowDefault(e), xt(this.view, "pointer"), e.buttons == 0 && this.done();
  }
  updateAllowDefault(e) {
    !this.allowDefault &&
      (Math.abs(this.event.x - e.clientX) > 4 || Math.abs(this.event.y - e.clientY) > 4) &&
      (this.allowDefault = !0);
  }
}
He.touchstart = (n) => {
  (n.input.lastTouch = Date.now()), lc(n), xt(n, "pointer");
};
He.touchmove = (n) => {
  (n.input.lastTouch = Date.now()), xt(n, "pointer");
};
He.contextmenu = (n) => lc(n);
function Cm(n, e) {
  return n.composing
    ? !0
    : xn && Math.abs(e.timeStamp - n.input.compositionEndedAt) < 500
      ? ((n.input.compositionEndedAt = -2e8), !0)
      : !1;
}
const CS = Er ? 5e3 : -1;
Pe.compositionstart = Pe.compositionupdate = (n) => {
  if (!n.composing) {
    n.domObserver.flush();
    let { state: e } = n,
      t = e.selection.$from;
    if (
      e.selection.empty &&
      (e.storedMarks ||
        (!t.textOffset &&
          t.parentOffset &&
          t.nodeBefore.marks.some((o) => o.type.spec.inclusive === !1)))
    )
      (n.markCursor = n.state.storedMarks || t.marks()), Di(n, !0), (n.markCursor = null);
    else if (
      (Di(n),
      rs && e.selection.empty && t.parentOffset && !t.textOffset && t.nodeBefore.marks.length)
    ) {
      let o = n.domSelectionRange();
      for (let r = o.focusNode, i = o.focusOffset; r && r.nodeType == 1 && i != 0; ) {
        let s = i < 0 ? r.lastChild : r.childNodes[i - 1];
        if (!s) break;
        if (s.nodeType == 3) {
          n.domSelection().collapse(s, s.nodeValue.length);
          break;
        } else (r = s), (i = -1);
      }
    }
    n.input.composing = !0;
  }
  Om(n, CS);
};
Pe.compositionend = (n, e) => {
  n.composing &&
    ((n.input.composing = !1),
    (n.input.compositionEndedAt = e.timeStamp),
    (n.input.compositionPendingChanges = n.domObserver.pendingRecords().length
      ? n.input.compositionID
      : 0),
    (n.input.compositionNode = null),
    n.input.compositionPendingChanges && Promise.resolve().then(() => n.domObserver.flush()),
    n.input.compositionID++,
    Om(n, 20));
};
function Om(n, e) {
  clearTimeout(n.input.composingTimeout),
    e > -1 && (n.input.composingTimeout = setTimeout(() => Di(n), e));
}
function OS(n) {
  for (
    n.composing && ((n.input.composing = !1), (n.input.compositionEndedAt = NS()));
    n.input.compositionNodes.length > 0;

  )
    n.input.compositionNodes.pop().markParentsDirty();
}
function NS() {
  let n = document.createEvent("Event");
  return n.initEvent("event", !0, !0), n.timeStamp;
}
function Di(n, e = !1) {
  if (!(Er && n.domObserver.flushingSoon >= 0)) {
    if ((n.domObserver.forceFlush(), OS(n), e || (n.docView && n.docView.dirty))) {
      let t = tS(n);
      return (
        t && !t.eq(n.state.selection)
          ? n.dispatch(n.state.tr.setSelection(t))
          : n.updateState(n.state),
        !0
      );
    }
    return !1;
  }
}
function TS(n, e) {
  if (!n.dom.parentNode) return;
  let t = n.dom.parentNode.appendChild(document.createElement("div"));
  t.appendChild(e), (t.style.cssText = "position: fixed; left: -10000px; top: 10px");
  let o = getSelection(),
    r = document.createRange();
  r.selectNodeContents(e),
    n.dom.blur(),
    o.removeAllRanges(),
    o.addRange(r),
    setTimeout(() => {
      t.parentNode && t.parentNode.removeChild(t), n.focus();
    }, 50);
}
const fr = (Tr && um < 15) || (oc && eS < 604);
He.copy = Pe.cut = (n, e) => {
  let t = e,
    o = n.state.selection,
    r = t.type == "cut";
  if (o.empty) return;
  let i = fr ? null : t.clipboardData,
    s = o.content(),
    { dom: l, text: a } = km(n, s);
  i
    ? (t.preventDefault(),
      i.clearData(),
      i.setData("text/html", l.innerHTML),
      i.setData("text/plain", a))
    : TS(n, l),
    r && n.dispatch(n.state.tr.deleteSelection().scrollIntoView().setMeta("uiEvent", "cut"));
};
function ES(n) {
  return n.openStart == 0 && n.openEnd == 0 && n.content.childCount == 1
    ? n.content.firstChild
    : null;
}
function AS(n, e) {
  if (!n.dom.parentNode) return;
  let t = n.input.shiftKey || n.state.selection.$from.parent.type.spec.code,
    o = n.dom.parentNode.appendChild(document.createElement(t ? "textarea" : "div"));
  t || (o.contentEditable = "true"),
    (o.style.cssText = "position: fixed; left: -10000px; top: 10px"),
    o.focus();
  let r = n.input.shiftKey && n.input.lastKeyCode != 45;
  setTimeout(() => {
    n.focus(),
      o.parentNode && o.parentNode.removeChild(o),
      t ? pa(n, o.value, null, r, e) : pa(n, o.textContent, o.innerHTML, r, e);
  }, 50);
}
function pa(n, e, t, o, r) {
  let i = wm(n, e, t, o, n.state.selection.$from);
  if (n.someProp("handlePaste", (a) => a(n, r, i || O.empty))) return !0;
  if (!i) return !1;
  let s = ES(i),
    l = s ? n.state.tr.replaceSelectionWith(s, o) : n.state.tr.replaceSelection(i);
  return n.dispatch(l.scrollIntoView().setMeta("paste", !0).setMeta("uiEvent", "paste")), !0;
}
function Nm(n) {
  let e = n.getData("text/plain") || n.getData("Text");
  if (e) return e;
  let t = n.getData("text/uri-list");
  return t ? t.replace(/\r?\n/g, " ") : "";
}
Pe.paste = (n, e) => {
  let t = e;
  if (n.composing && !Er) return;
  let o = fr ? null : t.clipboardData,
    r = n.input.shiftKey && n.input.lastKeyCode != 45;
  o && pa(n, Nm(o), o.getData("text/html"), r, t) ? t.preventDefault() : AS(n, t);
};
class IS {
  constructor(e, t, o) {
    (this.slice = e), (this.move = t), (this.node = o);
  }
}
const Tm = Ve ? "altKey" : "ctrlKey";
He.dragstart = (n, e) => {
  let t = e,
    o = n.input.mouseDown;
  if ((o && o.done(), !t.dataTransfer)) return;
  let r = n.state.selection,
    i = r.empty ? null : n.posAtCoords(is(t)),
    s;
  if (!(i && i.pos >= r.from && i.pos <= (r instanceof A ? r.to - 1 : r.to))) {
    if (o && o.mightDrag) s = A.create(n.state.doc, o.mightDrag.pos);
    else if (t.target && t.target.nodeType == 1) {
      let d = n.docView.nearestDesc(t.target, !0);
      d && d.node.type.spec.draggable && d != n.docView && (s = A.create(n.state.doc, d.posBefore));
    }
  }
  let l = (s || n.state.selection).content(),
    { dom: a, text: c } = km(n, l);
  t.dataTransfer.clearData(),
    t.dataTransfer.setData(fr ? "Text" : "text/html", a.innerHTML),
    (t.dataTransfer.effectAllowed = "copyMove"),
    fr || t.dataTransfer.setData("text/plain", c),
    (n.dragging = new IS(l, !t[Tm], s));
};
He.dragend = (n) => {
  let e = n.dragging;
  window.setTimeout(() => {
    n.dragging == e && (n.dragging = null);
  }, 50);
};
Pe.dragover = Pe.dragenter = (n, e) => e.preventDefault();
Pe.drop = (n, e) => {
  let t = e,
    o = n.dragging;
  if (((n.dragging = null), !t.dataTransfer)) return;
  let r = n.posAtCoords(is(t));
  if (!r) return;
  let i = n.state.doc.resolve(r.pos),
    s = o && o.slice;
  s
    ? n.someProp("transformPasted", (u) => {
        s = u(s, n);
      })
    : (s = wm(n, Nm(t.dataTransfer), fr ? null : t.dataTransfer.getData("text/html"), !1, i));
  let l = !!(o && !t[Tm]);
  if (n.someProp("handleDrop", (u) => u(n, t, s || O.empty, l))) {
    t.preventDefault();
    return;
  }
  if (!s) return;
  t.preventDefault();
  let a = s ? Kx(n.state.doc, i.pos, s) : i.pos;
  a == null && (a = i.pos);
  let c = n.state.tr;
  if (l) {
    let { node: u } = o;
    u ? u.replace(c) : c.deleteSelection();
  }
  let d = c.mapping.map(a),
    h = s.openStart == 0 && s.openEnd == 0 && s.content.childCount == 1,
    p = c.doc;
  if ((h ? c.replaceRangeWith(d, d, s.content.firstChild) : c.replaceRange(d, d, s), c.doc.eq(p)))
    return;
  let f = c.doc.resolve(d);
  if (
    h &&
    A.isSelectable(s.content.firstChild) &&
    f.nodeAfter &&
    f.nodeAfter.sameMarkup(s.content.firstChild)
  )
    c.setSelection(new A(f));
  else {
    let u = c.mapping.map(a);
    c.mapping.maps[c.mapping.maps.length - 1].forEach((m, g, y, w) => (u = w)),
      c.setSelection(gm(n, f, c.doc.resolve(u)));
  }
  n.focus(), n.dispatch(c.setMeta("uiEvent", "drop"));
};
He.focus = (n) => {
  (n.input.lastFocus = Date.now()),
    n.focused ||
      (n.domObserver.stop(),
      n.dom.classList.add("ProseMirror-focused"),
      n.domObserver.start(),
      (n.focused = !0),
      setTimeout(() => {
        n.docView &&
          n.hasFocus() &&
          !n.domObserver.currentSelection.eq(n.domSelectionRange()) &&
          ic(n);
      }, 20));
};
He.blur = (n, e) => {
  let t = e;
  n.focused &&
    (n.domObserver.stop(),
    n.dom.classList.remove("ProseMirror-focused"),
    n.domObserver.start(),
    t.relatedTarget && n.dom.contains(t.relatedTarget) && n.domObserver.currentSelection.clear(),
    (n.focused = !1));
};
He.beforeinput = (n, e) => {
  if (vn && Er && e.inputType == "deleteContentBackward") {
    n.domObserver.flushSoon();
    let { domChangeCount: t } = n.input;
    setTimeout(() => {
      if (
        n.input.domChangeCount != t ||
        (n.dom.blur(), n.focus(), n.someProp("handleKeyDown", (r) => r(n, pm(8, "Backspace"))))
      )
        return;
      let { $cursor: o } = n.state.selection;
      o && o.pos > 0 && n.dispatch(n.state.tr.delete(o.pos - 1, o.pos).scrollIntoView());
    }, 50);
  }
};
for (let n in Pe) He[n] = Pe[n];
function ur(n, e) {
  if (n == e) return !0;
  for (let t in n) if (n[t] !== e[t]) return !1;
  for (let t in e) if (!(t in n)) return !1;
  return !0;
}
class Ri {
  constructor(e, t) {
    (this.toDOM = e), (this.spec = t || ln), (this.side = this.spec.side || 0);
  }
  map(e, t, o, r) {
    let { pos: i, deleted: s } = e.mapResult(t.from + r, this.side < 0 ? -1 : 1);
    return s ? null : new at(i - o, i - o, this);
  }
  valid() {
    return !0;
  }
  eq(e) {
    return (
      this == e ||
      (e instanceof Ri &&
        ((this.spec.key && this.spec.key == e.spec.key) ||
          (this.toDOM == e.toDOM && ur(this.spec, e.spec))))
    );
  }
  destroy(e) {
    this.spec.destroy && this.spec.destroy(e);
  }
}
class $t {
  constructor(e, t) {
    (this.attrs = e), (this.spec = t || ln);
  }
  map(e, t, o, r) {
    let i = e.map(t.from + r, this.spec.inclusiveStart ? -1 : 1) - o,
      s = e.map(t.to + r, this.spec.inclusiveEnd ? 1 : -1) - o;
    return i >= s ? null : new at(i, s, this);
  }
  valid(e, t) {
    return t.from < t.to;
  }
  eq(e) {
    return this == e || (e instanceof $t && ur(this.attrs, e.attrs) && ur(this.spec, e.spec));
  }
  static is(e) {
    return e.type instanceof $t;
  }
  destroy() {}
}
class ac {
  constructor(e, t) {
    (this.attrs = e), (this.spec = t || ln);
  }
  map(e, t, o, r) {
    let i = e.mapResult(t.from + r, 1);
    if (i.deleted) return null;
    let s = e.mapResult(t.to + r, -1);
    return s.deleted || s.pos <= i.pos ? null : new at(i.pos - o, s.pos - o, this);
  }
  valid(e, t) {
    let { index: o, offset: r } = e.content.findIndex(t.from),
      i;
    return r == t.from && !(i = e.child(o)).isText && r + i.nodeSize == t.to;
  }
  eq(e) {
    return this == e || (e instanceof ac && ur(this.attrs, e.attrs) && ur(this.spec, e.spec));
  }
  destroy() {}
}
class at {
  constructor(e, t, o) {
    (this.from = e), (this.to = t), (this.type = o);
  }
  copy(e, t) {
    return new at(e, t, this.type);
  }
  eq(e, t = 0) {
    return this.type.eq(e.type) && this.from + t == e.from && this.to + t == e.to;
  }
  map(e, t, o) {
    return this.type.map(e, this, t, o);
  }
  static widget(e, t, o) {
    return new at(e, e, new Ri(t, o));
  }
  static inline(e, t, o, r) {
    return new at(e, t, new $t(o, r));
  }
  static node(e, t, o, r) {
    return new at(e, t, new ac(o, r));
  }
  get spec() {
    return this.type.spec;
  }
  get inline() {
    return this.type instanceof $t;
  }
  get widget() {
    return this.type instanceof Ri;
  }
}
const jn = [],
  ln = {};
class ne {
  constructor(e, t) {
    (this.local = e.length ? e : jn), (this.children = t.length ? t : jn);
  }
  static create(e, t) {
    return t.length ? zi(t, e, 0, ln) : we;
  }
  find(e, t, o) {
    let r = [];
    return this.findInner(e ?? 0, t ?? 1e9, r, 0, o), r;
  }
  findInner(e, t, o, r, i) {
    for (let s = 0; s < this.local.length; s++) {
      let l = this.local[s];
      l.from <= t && l.to >= e && (!i || i(l.spec)) && o.push(l.copy(l.from + r, l.to + r));
    }
    for (let s = 0; s < this.children.length; s += 3)
      if (this.children[s] < t && this.children[s + 1] > e) {
        let l = this.children[s] + 1;
        this.children[s + 2].findInner(e - l, t - l, o, r + l, i);
      }
  }
  map(e, t, o) {
    return this == we || e.maps.length == 0 ? this : this.mapInner(e, t, 0, 0, o || ln);
  }
  mapInner(e, t, o, r, i) {
    let s;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l].map(e, o, r);
      a && a.type.valid(t, a)
        ? (s || (s = [])).push(a)
        : i.onRemove && i.onRemove(this.local[l].spec);
    }
    return this.children.length
      ? DS(this.children, s || [], e, t, o, r, i)
      : s
        ? new ne(s.sort(an), jn)
        : we;
  }
  add(e, t) {
    return t.length ? (this == we ? ne.create(e, t) : this.addInner(e, t, 0)) : this;
  }
  addInner(e, t, o) {
    let r,
      i = 0;
    e.forEach((l, a) => {
      let c = a + o,
        d;
      if ((d = Am(t, l, c))) {
        for (r || (r = this.children.slice()); i < r.length && r[i] < a; ) i += 3;
        r[i] == a
          ? (r[i + 2] = r[i + 2].addInner(l, d, c + 1))
          : r.splice(i, 0, a, a + l.nodeSize, zi(d, l, c + 1, ln)),
          (i += 3);
      }
    });
    let s = Em(i ? Im(t) : t, -o);
    for (let l = 0; l < s.length; l++) s[l].type.valid(e, s[l]) || s.splice(l--, 1);
    return new ne(s.length ? this.local.concat(s).sort(an) : this.local, r || this.children);
  }
  remove(e) {
    return e.length == 0 || this == we ? this : this.removeInner(e, 0);
  }
  removeInner(e, t) {
    let o = this.children,
      r = this.local;
    for (let i = 0; i < o.length; i += 3) {
      let s,
        l = o[i] + t,
        a = o[i + 1] + t;
      for (let d = 0, h; d < e.length; d++)
        (h = e[d]) && h.from > l && h.to < a && ((e[d] = null), (s || (s = [])).push(h));
      if (!s) continue;
      o == this.children && (o = this.children.slice());
      let c = o[i + 2].removeInner(s, l + 1);
      c != we ? (o[i + 2] = c) : (o.splice(i, 3), (i -= 3));
    }
    if (r.length) {
      for (let i = 0, s; i < e.length; i++)
        if ((s = e[i]))
          for (let l = 0; l < r.length; l++)
            r[l].eq(s, t) && (r == this.local && (r = this.local.slice()), r.splice(l--, 1));
    }
    return o == this.children && r == this.local ? this : r.length || o.length ? new ne(r, o) : we;
  }
  forChild(e, t) {
    if (this == we) return this;
    if (t.isLeaf) return ne.empty;
    let o, r;
    for (let l = 0; l < this.children.length; l += 3)
      if (this.children[l] >= e) {
        this.children[l] == e && (o = this.children[l + 2]);
        break;
      }
    let i = e + 1,
      s = i + t.content.size;
    for (let l = 0; l < this.local.length; l++) {
      let a = this.local[l];
      if (a.from < s && a.to > i && a.type instanceof $t) {
        let c = Math.max(i, a.from) - i,
          d = Math.min(s, a.to) - i;
        c < d && (r || (r = [])).push(a.copy(c, d));
      }
    }
    if (r) {
      let l = new ne(r.sort(an), jn);
      return o ? new Bt([l, o]) : l;
    }
    return o || we;
  }
  eq(e) {
    if (this == e) return !0;
    if (
      !(e instanceof ne) ||
      this.local.length != e.local.length ||
      this.children.length != e.children.length
    )
      return !1;
    for (let t = 0; t < this.local.length; t++) if (!this.local[t].eq(e.local[t])) return !1;
    for (let t = 0; t < this.children.length; t += 3)
      if (
        this.children[t] != e.children[t] ||
        this.children[t + 1] != e.children[t + 1] ||
        !this.children[t + 2].eq(e.children[t + 2])
      )
        return !1;
    return !0;
  }
  locals(e) {
    return cc(this.localsInner(e));
  }
  localsInner(e) {
    if (this == we) return jn;
    if (e.inlineContent || !this.local.some($t.is)) return this.local;
    let t = [];
    for (let o = 0; o < this.local.length; o++)
      this.local[o].type instanceof $t || t.push(this.local[o]);
    return t;
  }
}
ne.empty = new ne([], []);
ne.removeOverlap = cc;
const we = ne.empty;
class Bt {
  constructor(e) {
    this.members = e;
  }
  map(e, t) {
    const o = this.members.map((r) => r.map(e, t, ln));
    return Bt.from(o);
  }
  forChild(e, t) {
    if (t.isLeaf) return ne.empty;
    let o = [];
    for (let r = 0; r < this.members.length; r++) {
      let i = this.members[r].forChild(e, t);
      i != we && (i instanceof Bt ? (o = o.concat(i.members)) : o.push(i));
    }
    return Bt.from(o);
  }
  eq(e) {
    if (!(e instanceof Bt) || e.members.length != this.members.length) return !1;
    for (let t = 0; t < this.members.length; t++) if (!this.members[t].eq(e.members[t])) return !1;
    return !0;
  }
  locals(e) {
    let t,
      o = !0;
    for (let r = 0; r < this.members.length; r++) {
      let i = this.members[r].localsInner(e);
      if (i.length)
        if (!t) t = i;
        else {
          o && ((t = t.slice()), (o = !1));
          for (let s = 0; s < i.length; s++) t.push(i[s]);
        }
    }
    return t ? cc(o ? t : t.sort(an)) : jn;
  }
  static from(e) {
    switch (e.length) {
      case 0:
        return we;
      case 1:
        return e[0];
      default:
        return new Bt(
          e.every((t) => t instanceof ne)
            ? e
            : e.reduce((t, o) => t.concat(o instanceof ne ? o : o.members), []),
        );
    }
  }
}
function DS(n, e, t, o, r, i, s) {
  let l = n.slice();
  for (let c = 0, d = i; c < t.maps.length; c++) {
    let h = 0;
    t.maps[c].forEach((p, f, u, m) => {
      let g = m - u - (f - p);
      for (let y = 0; y < l.length; y += 3) {
        let w = l[y + 1];
        if (w < 0 || p > w + d - h) continue;
        let b = l[y] + d - h;
        f >= b ? (l[y + 1] = p <= b ? -2 : -1) : p >= d && g && ((l[y] += g), (l[y + 1] += g));
      }
      h += g;
    }),
      (d = t.maps[c].map(d, -1));
  }
  let a = !1;
  for (let c = 0; c < l.length; c += 3)
    if (l[c + 1] < 0) {
      if (l[c + 1] == -2) {
        (a = !0), (l[c + 1] = -1);
        continue;
      }
      let d = t.map(n[c] + i),
        h = d - r;
      if (h < 0 || h >= o.content.size) {
        a = !0;
        continue;
      }
      let p = t.map(n[c + 1] + i, -1),
        f = p - r,
        { index: u, offset: m } = o.content.findIndex(h),
        g = o.maybeChild(u);
      if (g && m == h && m + g.nodeSize == f) {
        let y = l[c + 2].mapInner(t, g, d + 1, n[c] + i + 1, s);
        y != we ? ((l[c] = h), (l[c + 1] = f), (l[c + 2] = y)) : ((l[c + 1] = -2), (a = !0));
      } else a = !0;
    }
  if (a) {
    let c = RS(l, n, e, t, r, i, s),
      d = zi(c, o, 0, s);
    e = d.local;
    for (let h = 0; h < l.length; h += 3) l[h + 1] < 0 && (l.splice(h, 3), (h -= 3));
    for (let h = 0, p = 0; h < d.children.length; h += 3) {
      let f = d.children[h];
      for (; p < l.length && l[p] < f; ) p += 3;
      l.splice(p, 0, d.children[h], d.children[h + 1], d.children[h + 2]);
    }
  }
  return new ne(e.sort(an), l);
}
function Em(n, e) {
  if (!e || !n.length) return n;
  let t = [];
  for (let o = 0; o < n.length; o++) {
    let r = n[o];
    t.push(new at(r.from + e, r.to + e, r.type));
  }
  return t;
}
function RS(n, e, t, o, r, i, s) {
  function l(a, c) {
    for (let d = 0; d < a.local.length; d++) {
      let h = a.local[d].map(o, r, c);
      h ? t.push(h) : s.onRemove && s.onRemove(a.local[d].spec);
    }
    for (let d = 0; d < a.children.length; d += 3) l(a.children[d + 2], a.children[d] + c + 1);
  }
  for (let a = 0; a < n.length; a += 3) n[a + 1] == -1 && l(n[a + 2], e[a] + i + 1);
  return t;
}
function Am(n, e, t) {
  if (e.isLeaf) return null;
  let o = t + e.nodeSize,
    r = null;
  for (let i = 0, s; i < n.length; i++)
    (s = n[i]) && s.from > t && s.to < o && ((r || (r = [])).push(s), (n[i] = null));
  return r;
}
function Im(n) {
  let e = [];
  for (let t = 0; t < n.length; t++) n[t] != null && e.push(n[t]);
  return e;
}
function zi(n, e, t, o) {
  let r = [],
    i = !1;
  e.forEach((l, a) => {
    let c = Am(n, l, a + t);
    if (c) {
      i = !0;
      let d = zi(c, l, t + a + 1, o);
      d != we && r.push(a, a + l.nodeSize, d);
    }
  });
  let s = Em(i ? Im(n) : n, -t).sort(an);
  for (let l = 0; l < s.length; l++)
    s[l].type.valid(e, s[l]) || (o.onRemove && o.onRemove(s[l].spec), s.splice(l--, 1));
  return s.length || r.length ? new ne(s, r) : we;
}
function an(n, e) {
  return n.from - e.from || n.to - e.to;
}
function cc(n) {
  let e = n;
  for (let t = 0; t < e.length - 1; t++) {
    let o = e[t];
    if (o.from != o.to)
      for (let r = t + 1; r < e.length; r++) {
        let i = e[r];
        if (i.from == o.from) {
          i.to != o.to &&
            (e == n && (e = n.slice()),
            (e[r] = i.copy(i.from, o.to)),
            Ah(e, r + 1, i.copy(o.to, i.to)));
          continue;
        } else {
          i.from < o.to &&
            (e == n && (e = n.slice()),
            (e[t] = o.copy(o.from, i.from)),
            Ah(e, r, o.copy(i.from, o.to)));
          break;
        }
      }
  }
  return e;
}
function Ah(n, e, t) {
  for (; e < n.length && an(t, n[e]) > 0; ) e++;
  n.splice(e, 0, t);
}
var no = {
    8: "Backspace",
    9: "Tab",
    10: "Enter",
    12: "NumLock",
    13: "Enter",
    16: "Shift",
    17: "Control",
    18: "Alt",
    20: "CapsLock",
    27: "Escape",
    32: " ",
    33: "PageUp",
    34: "PageDown",
    35: "End",
    36: "Home",
    37: "ArrowLeft",
    38: "ArrowUp",
    39: "ArrowRight",
    40: "ArrowDown",
    44: "PrintScreen",
    45: "Insert",
    46: "Delete",
    59: ";",
    61: "=",
    91: "Meta",
    92: "Meta",
    106: "*",
    107: "+",
    108: ",",
    109: "-",
    110: ".",
    111: "/",
    144: "NumLock",
    145: "ScrollLock",
    160: "Shift",
    161: "Shift",
    162: "Control",
    163: "Control",
    164: "Alt",
    165: "Alt",
    173: "-",
    186: ";",
    187: "=",
    188: ",",
    189: "-",
    190: ".",
    191: "/",
    192: "`",
    219: "[",
    220: "\\",
    221: "]",
    222: "'",
  },
  fa = {
    48: ")",
    49: "!",
    50: "@",
    51: "#",
    52: "$",
    53: "%",
    54: "^",
    55: "&",
    56: "*",
    57: "(",
    59: ":",
    61: "+",
    173: "_",
    186: ":",
    187: "+",
    188: "<",
    189: "_",
    190: ">",
    191: "?",
    192: "~",
    219: "{",
    220: "|",
    221: "}",
    222: '"',
  };
for (var se = 0; se < 10; se++) no[48 + se] = no[96 + se] = String(se);
for (var se = 1; se <= 24; se++) no[se + 111] = "F" + se;
for (var se = 65; se <= 90; se++)
  (no[se] = String.fromCharCode(se + 32)), (fa[se] = String.fromCharCode(se));
for (var Xs in no) fa.hasOwnProperty(Xs) || (fa[Xs] = no[Xs]);
const zS = (n, e) =>
  n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function Dm(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const PS = (n, e, t) => {
    let o = Dm(n, t);
    if (!o) return !1;
    let r = dc(o);
    if (!r) {
      let s = o.blockRange(),
        l = s && uo(s);
      return l == null ? !1 : (e && e(n.tr.lift(s, l).scrollIntoView()), !0);
    }
    let i = r.nodeBefore;
    if (!i.type.spec.isolating && Bm(n, r, e)) return !0;
    if (o.parent.content.size == 0 && (oo(i, "end") || A.isSelectable(i))) {
      let s = ec(n.doc, o.before(), o.after(), O.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let l = n.tr.step(s);
          l.setSelection(
            oo(i, "end")
              ? j.findFrom(l.doc.resolve(l.mapping.map(r.pos, -1)), -1)
              : A.create(l.doc, r.pos - i.nodeSize),
          ),
            e(l.scrollIntoView());
        }
        return !0;
      }
    }
    return i.isAtom && r.depth == o.depth - 1
      ? (e && e(n.tr.delete(r.pos - i.nodeSize, r.pos).scrollIntoView()), !0)
      : !1;
  },
  BS = (n, e, t) => {
    let o = Dm(n, t);
    if (!o) return !1;
    let r = dc(o);
    return r ? Rm(n, r, e) : !1;
  },
  FS = (n, e, t) => {
    let o = zm(n, t);
    if (!o) return !1;
    let r = hc(o);
    return r ? Rm(n, r, e) : !1;
  };
function Rm(n, e, t) {
  let o = e.nodeBefore,
    r = o,
    i = e.pos - 1;
  for (; !r.isTextblock; i--) {
    if (r.type.spec.isolating) return !1;
    let d = r.lastChild;
    if (!d) return !1;
    r = d;
  }
  let s = e.nodeAfter,
    l = s,
    a = e.pos + 1;
  for (; !l.isTextblock; a++) {
    if (l.type.spec.isolating) return !1;
    let d = l.firstChild;
    if (!d) return !1;
    l = d;
  }
  let c = ec(n.doc, i, a, O.empty);
  if (!c || c.from != i || (c instanceof Ee && c.slice.size >= a - i)) return !1;
  if (t) {
    let d = n.tr.step(c);
    d.setSelection(B.create(d.doc, i)), t(d.scrollIntoView());
  }
  return !0;
}
function oo(n, e, t = !1) {
  for (let o = n; o; o = e == "start" ? o.firstChild : o.lastChild) {
    if (o.isTextblock) return !0;
    if (t && o.childCount != 1) return !1;
  }
  return !1;
}
const VS = (n, e, t) => {
  let { $head: o, empty: r } = n.selection,
    i = o;
  if (!r) return !1;
  if (o.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : o.parentOffset > 0) return !1;
    i = dc(o);
  }
  let s = i && i.nodeBefore;
  return !s || !A.isSelectable(s)
    ? !1
    : (e && e(n.tr.setSelection(A.create(n.doc, i.pos - s.nodeSize)).scrollIntoView()), !0);
};
function dc(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0) return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating) break;
    }
  return null;
}
function zm(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size)
    ? null
    : t;
}
const jS = (n, e, t) => {
    let o = zm(n, t);
    if (!o) return !1;
    let r = hc(o);
    if (!r) return !1;
    let i = r.nodeAfter;
    if (Bm(n, r, e)) return !0;
    if (o.parent.content.size == 0 && (oo(i, "start") || A.isSelectable(i))) {
      let s = ec(n.doc, o.before(), o.after(), O.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let l = n.tr.step(s);
          l.setSelection(
            oo(i, "start")
              ? j.findFrom(l.doc.resolve(l.mapping.map(r.pos)), 1)
              : A.create(l.doc, l.mapping.map(r.pos)),
          ),
            e(l.scrollIntoView());
        }
        return !0;
      }
    }
    return i.isAtom && r.depth == o.depth - 1
      ? (e && e(n.tr.delete(r.pos, r.pos + i.nodeSize).scrollIntoView()), !0)
      : !1;
  },
  JS = (n, e, t) => {
    let { $head: o, empty: r } = n.selection,
      i = o;
    if (!r) return !1;
    if (o.parent.isTextblock) {
      if (t ? !t.endOfTextblock("forward", n) : o.parentOffset < o.parent.content.size) return !1;
      i = hc(o);
    }
    let s = i && i.nodeAfter;
    return !s || !A.isSelectable(s)
      ? !1
      : (e && e(n.tr.setSelection(A.create(n.doc, i.pos)).scrollIntoView()), !0);
  };
function hc(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount) return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating) break;
    }
  return null;
}
const LS = (n, e) => {
    let t = n.selection,
      o = t instanceof A,
      r;
    if (o) {
      if (t.node.isTextblock || !wn(n.doc, t.from)) return !1;
      r = t.from;
    } else if (((r = ts(n.doc, t.from, -1)), r == null)) return !1;
    if (e) {
      let i = n.tr.join(r);
      o && i.setSelection(A.create(i.doc, r - n.doc.resolve(r).nodeBefore.nodeSize)),
        e(i.scrollIntoView());
    }
    return !0;
  },
  qS = (n, e) => {
    let t = n.selection,
      o;
    if (t instanceof A) {
      if (t.node.isTextblock || !wn(n.doc, t.to)) return !1;
      o = t.to;
    } else if (((o = ts(n.doc, t.to, 1)), o == null)) return !1;
    return e && e(n.tr.join(o).scrollIntoView()), !0;
  },
  KS = (n, e) => {
    let { $from: t, $to: o } = n.selection,
      r = t.blockRange(o),
      i = r && uo(r);
    return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
  },
  WS = (n, e) => {
    let { $head: t, $anchor: o } = n.selection;
    return !t.parent.type.spec.code || !t.sameParent(o)
      ? !1
      : (e &&
          e(
            n.tr
              .insertText(
                `
`,
              )
              .scrollIntoView(),
          ),
        !0);
  };
function Pm(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs()) return t;
  }
  return null;
}
const HS = (n, e) => {
    let { $head: t, $anchor: o } = n.selection;
    if (!t.parent.type.spec.code || !t.sameParent(o)) return !1;
    let r = t.node(-1),
      i = t.indexAfter(-1),
      s = Pm(r.contentMatchAt(i));
    if (!s || !r.canReplaceWith(i, i, s)) return !1;
    if (e) {
      let l = t.after(),
        a = n.tr.replaceWith(l, l, s.createAndFill());
      a.setSelection(j.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
    }
    return !0;
  },
  US = (n, e) => {
    let t = n.selection,
      { $from: o, $to: r } = t;
    if (t instanceof qe || o.parent.inlineContent || r.parent.inlineContent) return !1;
    let i = Pm(r.parent.contentMatchAt(r.indexAfter()));
    if (!i || !i.isTextblock) return !1;
    if (e) {
      let s = (!o.parentOffset && r.index() < r.parent.childCount ? o : r).pos,
        l = n.tr.insert(s, i.createAndFill());
      l.setSelection(B.create(l.doc, s + 1)), e(l.scrollIntoView());
    }
    return !0;
  },
  GS = (n, e) => {
    let { $cursor: t } = n.selection;
    if (!t || t.parent.content.size) return !1;
    if (t.depth > 1 && t.after() != t.end(-1)) {
      let i = t.before();
      if (Gn(n.doc, i)) return e && e(n.tr.split(i).scrollIntoView()), !0;
    }
    let o = t.blockRange(),
      r = o && uo(o);
    return r == null ? !1 : (e && e(n.tr.lift(o, r).scrollIntoView()), !0);
  },
  YS = (n, e) => {
    let { $from: t, to: o } = n.selection,
      r,
      i = t.sharedDepth(o);
    return i == 0 ? !1 : ((r = t.before(i)), e && e(n.tr.setSelection(A.create(n.doc, r))), !0);
  };
function XS(n, e, t) {
  let o = e.nodeBefore,
    r = e.nodeAfter,
    i = e.index();
  return !o || !r || !o.type.compatibleContent(r.type)
    ? !1
    : !o.content.size && e.parent.canReplace(i - 1, i)
      ? (t && t(n.tr.delete(e.pos - o.nodeSize, e.pos).scrollIntoView()), !0)
      : !e.parent.canReplace(i, i + 1) || !(r.isTextblock || wn(n.doc, e.pos))
        ? !1
        : (t &&
            t(
              n.tr
                .clearIncompatible(e.pos, o.type, o.contentMatchAt(o.childCount))
                .join(e.pos)
                .scrollIntoView(),
            ),
          !0);
}
function Bm(n, e, t) {
  let o = e.nodeBefore,
    r = e.nodeAfter,
    i,
    s;
  if (o.type.spec.isolating || r.type.spec.isolating) return !1;
  if (XS(n, e, t)) return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (
    l &&
    (i = (s = o.contentMatchAt(o.childCount)).findWrapping(r.type)) &&
    s.matchType(i[0] || r.type).validEnd
  ) {
    if (t) {
      let h = e.pos + r.nodeSize,
        p = x.empty;
      for (let m = i.length - 1; m >= 0; m--) p = x.from(i[m].create(null, p));
      p = x.from(o.copy(p));
      let f = n.tr.step(new Oe(e.pos - 1, h, e.pos, h, new O(p, 1, 0), i.length, !0)),
        u = h + 2 * i.length;
      wn(f.doc, u) && f.join(u), t(f.scrollIntoView());
    }
    return !0;
  }
  let a = j.findFrom(e, 1),
    c = a && a.$from.blockRange(a.$to),
    d = c && uo(c);
  if (d != null && d >= e.depth) return t && t(n.tr.lift(c, d).scrollIntoView()), !0;
  if (l && oo(r, "start", !0) && oo(o, "end")) {
    let h = o,
      p = [];
    for (; p.push(h), !h.isTextblock; ) h = h.lastChild;
    let f = r,
      u = 1;
    for (; !f.isTextblock; f = f.firstChild) u++;
    if (h.canReplace(h.childCount, h.childCount, f.content)) {
      if (t) {
        let m = x.empty;
        for (let y = p.length - 1; y >= 0; y--) m = x.from(p[y].copy(m));
        let g = n.tr.step(
          new Oe(
            e.pos - p.length,
            e.pos + r.nodeSize,
            e.pos + u,
            e.pos + r.nodeSize - u,
            new O(m, p.length, 0),
            0,
            !0,
          ),
        );
        t(g.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function Fm(n) {
  return function (e, t) {
    let o = e.selection,
      r = n < 0 ? o.$from : o.$to,
      i = r.depth;
    for (; r.node(i).isInline; ) {
      if (!i) return !1;
      i--;
    }
    return r.node(i).isTextblock
      ? (t && t(e.tr.setSelection(B.create(e.doc, n < 0 ? r.start(i) : r.end(i)))), !0)
      : !1;
  };
}
const QS = Fm(-1),
  ZS = Fm(1);
function _S(n, e = null) {
  return function (t, o) {
    let { $from: r, $to: i } = t.selection,
      s = r.blockRange(i),
      l = s && im(s, n, e);
    return l ? (o && o(t.tr.wrap(s, l).scrollIntoView()), !0) : !1;
  };
}
function Ih(n, e = null) {
  return function (t, o) {
    let r = !1;
    for (let i = 0; i < t.selection.ranges.length && !r; i++) {
      let {
        $from: { pos: s },
        $to: { pos: l },
      } = t.selection.ranges[i];
      t.doc.nodesBetween(s, l, (a, c) => {
        if (r) return !1;
        if (!(!a.isTextblock || a.hasMarkup(n, e)))
          if (a.type == n) r = !0;
          else {
            let d = t.doc.resolve(c),
              h = d.index();
            r = d.parent.canReplaceWith(h, h + 1, n);
          }
      });
    }
    if (!r) return !1;
    if (o) {
      let i = t.tr;
      for (let s = 0; s < t.selection.ranges.length; s++) {
        let {
          $from: { pos: l },
          $to: { pos: a },
        } = t.selection.ranges[s];
        i.setBlockType(l, a, n, e);
      }
      o(i.scrollIntoView());
    }
    return !0;
  };
}
typeof navigator < "u"
  ? /Mac|iP(hone|[oa]d)/.test(navigator.platform)
  : typeof os < "u" && os.platform && os.platform() == "darwin";
function e$(n, e = null) {
  return function (t, o) {
    let { $from: r, $to: i } = t.selection,
      s = r.blockRange(i),
      l = !1,
      a = s;
    if (!s) return !1;
    if (s.depth >= 2 && r.node(s.depth - 1).type.compatibleContent(n) && s.startIndex == 0) {
      if (r.index(s.depth - 1) == 0) return !1;
      let d = t.doc.resolve(s.start - 2);
      (a = new ra(d, d, s.depth)),
        s.endIndex < s.parent.childCount && (s = new ra(r, t.doc.resolve(i.end(s.depth)), s.depth)),
        (l = !0);
    }
    let c = im(a, n, e, s);
    return c ? (o && o(t$(t.tr, s, c, l, n).scrollIntoView()), !0) : !1;
  };
}
function t$(n, e, t, o, r) {
  let i = x.empty;
  for (let d = t.length - 1; d >= 0; d--) i = x.from(t[d].type.create(t[d].attrs, i));
  n.step(new Oe(e.start - (o ? 2 : 0), e.end, e.start, e.end, new O(i, 0, 0), t.length, !0));
  let s = 0;
  for (let d = 0; d < t.length; d++) t[d].type == r && (s = d + 1);
  let l = t.length - s,
    a = e.start + t.length - (o ? 2 : 0),
    c = e.parent;
  for (let d = e.startIndex, h = e.endIndex, p = !0; d < h; d++, p = !1)
    !p && Gn(n.doc, a, l) && (n.split(a, l), (a += 2 * l)), (a += c.child(d).nodeSize);
  return n;
}
function n$(n) {
  return function (e, t) {
    let { $from: o, $to: r } = e.selection,
      i = o.blockRange(r, (s) => s.childCount > 0 && s.firstChild.type == n);
    return i ? (t ? (o.node(i.depth - 1).type == n ? o$(e, t, n, i) : r$(e, t, i)) : !0) : !1;
  };
}
function o$(n, e, t, o) {
  let r = n.tr,
    i = o.end,
    s = o.$to.end(o.depth);
  i < s &&
    (r.step(new Oe(i - 1, s, i, s, new O(x.from(t.create(null, o.parent.copy())), 1, 0), 1, !0)),
    (o = new ra(r.doc.resolve(o.$from.pos), r.doc.resolve(s), o.depth)));
  const l = uo(o);
  if (l == null) return !1;
  r.lift(o, l);
  let a = r.mapping.map(i, -1) - 1;
  return wn(r.doc, a) && r.join(a), e(r.scrollIntoView()), !0;
}
function r$(n, e, t) {
  let o = n.tr,
    r = t.parent;
  for (let f = t.end, u = t.endIndex - 1, m = t.startIndex; u > m; u--)
    (f -= r.child(u).nodeSize), o.delete(f - 1, f + 1);
  let i = o.doc.resolve(t.start),
    s = i.nodeAfter;
  if (o.mapping.map(t.end) != t.start + i.nodeAfter.nodeSize) return !1;
  let l = t.startIndex == 0,
    a = t.endIndex == r.childCount,
    c = i.node(-1),
    d = i.index(-1);
  if (!c.canReplace(d + (l ? 0 : 1), d + 1, s.content.append(a ? x.empty : x.from(r)))) return !1;
  let h = i.pos,
    p = h + s.nodeSize;
  return (
    o.step(
      new Oe(
        h - (l ? 1 : 0),
        p + (a ? 1 : 0),
        h + 1,
        p - 1,
        new O(
          (l ? x.empty : x.from(r.copy(x.empty))).append(a ? x.empty : x.from(r.copy(x.empty))),
          l ? 0 : 1,
          a ? 0 : 1,
        ),
        l ? 0 : 1,
      ),
    ),
    e(o.scrollIntoView()),
    !0
  );
}
function i$(n) {
  return function (e, t) {
    let { $from: o, $to: r } = e.selection,
      i = o.blockRange(r, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!i) return !1;
    let s = i.startIndex;
    if (s == 0) return !1;
    let l = i.parent,
      a = l.child(s - 1);
    if (a.type != n) return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type,
        d = x.from(c ? n.create() : null),
        h = new O(x.from(n.create(null, x.from(l.type.create(null, d)))), c ? 3 : 1, 0),
        p = i.start,
        f = i.end;
      t(e.tr.step(new Oe(p - (c ? 3 : 1), f, p, f, h, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function Vm(n) {
  const { state: e, transaction: t } = n;
  let { selection: o } = t,
    { doc: r } = t,
    { storedMarks: i } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return i;
    },
    get selection() {
      return o;
    },
    get doc() {
      return r;
    },
    get tr() {
      return (o = t.selection), (r = t.doc), (i = t.storedMarks), t;
    },
  };
}
class s$ {
  constructor(e) {
    (this.editor = e.editor),
      (this.rawCommands = this.editor.extensionManager.commands),
      (this.customState = e.state);
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: t, state: o } = this,
      { view: r } = t,
      { tr: i } = o,
      s = this.buildProps(i);
    return Object.fromEntries(
      Object.entries(e).map(([l, a]) => [
        l,
        (...c) => {
          const d = a(...c)(s);
          return !i.getMeta("preventDispatch") && !this.hasCustomState && r.dispatch(i), d;
        },
      ]),
    );
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: o, editor: r, state: i } = this,
      { view: s } = r,
      l = [],
      a = !!e,
      c = e || i.tr,
      d = () => (
        !a && t && !c.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(c),
        l.every((p) => p === !0)
      ),
      h = {
        ...Object.fromEntries(
          Object.entries(o).map(([p, f]) => [
            p,
            (...u) => {
              const m = this.buildProps(c, t),
                g = f(...u)(m);
              return l.push(g), h;
            },
          ]),
        ),
        run: d,
      };
    return h;
  }
  createCan(e) {
    const { rawCommands: t, state: o } = this,
      r = !1,
      i = e || o.tr,
      s = this.buildProps(i, r);
    return {
      ...Object.fromEntries(
        Object.entries(t).map(([l, a]) => [l, (...c) => a(...c)({ ...s, dispatch: void 0 })]),
      ),
      chain: () => this.createChain(i, r),
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: o, editor: r, state: i } = this,
      { view: s } = r,
      l = {
        tr: e,
        editor: r,
        view: s,
        state: Vm({ state: i, transaction: e }),
        dispatch: t ? () => {} : void 0,
        chain: () => this.createChain(e, t),
        can: () => this.createCan(e),
        get commands() {
          return Object.fromEntries(Object.entries(o).map(([a, c]) => [a, (...d) => c(...d)(l)]));
        },
      };
    return l;
  }
}
function wt(n, e, t) {
  return n.config[e] === void 0 && n.parent
    ? wt(n.parent, e, t)
    : typeof n.config[e] == "function"
      ? n.config[e].bind({ ...t, parent: n.parent ? wt(n.parent, e, t) : null })
      : n.config[e];
}
function l$(n) {
  const e = n.filter((r) => r.type === "extension"),
    t = n.filter((r) => r.type === "node"),
    o = n.filter((r) => r.type === "mark");
  return { baseExtensions: e, nodeExtensions: t, markExtensions: o };
}
function ce(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
function a$(n) {
  return typeof n == "function";
}
function Jn(n, e = void 0, ...t) {
  return a$(n) ? (e ? n.bind(e)(...t) : n(...t)) : n;
}
function c$(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
function d$(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function Qs(n) {
  return d$(n) !== "Object"
    ? !1
    : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function jm(n, e) {
  const t = { ...n };
  return (
    Qs(n) &&
      Qs(e) &&
      Object.keys(e).forEach((o) => {
        Qs(e[o])
          ? o in n
            ? (t[o] = jm(n[o], e[o]))
            : Object.assign(t, { [o]: e[o] })
          : Object.assign(t, { [o]: e[o] });
      }),
    t
  );
}
class rt {
  constructor(e = {}) {
    (this.type = "extension"),
      (this.name = "extension"),
      (this.parent = null),
      (this.child = null),
      (this.config = { name: this.name, defaultOptions: {} }),
      (this.config = { ...this.config, ...e }),
      (this.name = this.config.name),
      e.defaultOptions &&
        Object.keys(e.defaultOptions).length > 0 &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`,
        ),
      (this.options = this.config.defaultOptions),
      this.config.addOptions && (this.options = Jn(wt(this, "addOptions", { name: this.name }))),
      (this.storage = Jn(wt(this, "addStorage", { name: this.name, options: this.options })) || {});
  }
  static create(e = {}) {
    return new rt(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return (
      (t.options = jm(this.options, e)),
      (t.storage = Jn(wt(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
  extend(e = {}) {
    const t = new rt({ ...this.config, ...e });
    return (
      (t.parent = this),
      (this.child = t),
      (t.name = e.name ? e.name : t.parent.name),
      e.defaultOptions &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`,
        ),
      (t.options = Jn(wt(t, "addOptions", { name: t.name }))),
      (t.storage = Jn(wt(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
}
function h$(n, e, t) {
  const { from: o, to: r } = e,
    {
      blockSeparator: i = `

`,
      textSerializers: s = {},
    } = t || {};
  let l = "",
    a = !0;
  return (
    n.nodesBetween(o, r, (c, d, h, p) => {
      var f;
      const u = s == null ? void 0 : s[c.type.name];
      u
        ? (c.isBlock && !a && ((l += i), (a = !0)),
          h && (l += u({ node: c, pos: d, parent: h, index: p, range: e })))
        : c.isText
          ? ((l +=
              (f = c == null ? void 0 : c.text) === null || f === void 0
                ? void 0
                : f.slice(Math.max(o, d) - d, r - d)),
            (a = !1))
          : c.isBlock && !a && ((l += i), (a = !0));
    }),
    l
  );
}
function p$(n) {
  return Object.fromEntries(
    Object.entries(n.nodes)
      .filter(([, e]) => e.spec.toText)
      .map(([e, t]) => [e, t.spec.toText]),
  );
}
rt.create({
  name: "clipboardTextSerializer",
  addProseMirrorPlugins() {
    return [
      new Or({
        key: new Nr("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this,
              { state: e, schema: t } = n,
              { doc: o, selection: r } = e,
              { ranges: i } = r,
              s = Math.min(...i.map((c) => c.$from.pos)),
              l = Math.max(...i.map((c) => c.$to.pos)),
              a = p$(t);
            return h$(o, { from: s, to: l }, { textSerializers: a });
          },
        },
      }),
    ];
  },
});
const f$ =
    () =>
    ({ editor: n, view: e }) => (
      requestAnimationFrame(() => {
        var t;
        n.isDestroyed ||
          (e.dom.blur(),
          (t = window == null ? void 0 : window.getSelection()) === null ||
            t === void 0 ||
            t.removeAllRanges());
      }),
      !0
    ),
  u$ =
    (n = !1) =>
    ({ commands: e }) =>
      e.setContent("", n),
  m$ =
    () =>
    ({ state: n, tr: e, dispatch: t }) => {
      const { selection: o } = e,
        { ranges: r } = o;
      return (
        t &&
          r.forEach(({ $from: i, $to: s }) => {
            n.doc.nodesBetween(i.pos, s.pos, (l, a) => {
              if (l.type.isText) return;
              const { doc: c, mapping: d } = e,
                h = c.resolve(d.map(a)),
                p = c.resolve(d.map(a + l.nodeSize)),
                f = h.blockRange(p);
              if (!f) return;
              const u = uo(f);
              if (l.type.isTextblock) {
                const { defaultType: m } = h.parent.contentMatchAt(h.index());
                e.setNodeMarkup(f.start, m);
              }
              (u || u === 0) && e.lift(f, u);
            });
          }),
        !0
      );
    },
  g$ = (n) => (e) => n(e),
  y$ =
    () =>
    ({ state: n, dispatch: e }) =>
      US(n, e),
  k$ =
    (n, e) =>
    ({ editor: t, tr: o }) => {
      const { state: r } = t,
        i = r.doc.slice(n.from, n.to);
      o.deleteRange(n.from, n.to);
      const s = o.mapping.map(e);
      return o.insert(s, i.content), o.setSelection(new B(o.doc.resolve(s - 1))), !0;
    },
  w$ =
    () =>
    ({ tr: n, dispatch: e }) => {
      const { selection: t } = n,
        o = t.$anchor.node();
      if (o.content.size > 0) return !1;
      const r = n.selection.$anchor;
      for (let i = r.depth; i > 0; i -= 1)
        if (r.node(i).type === o.type) {
          if (e) {
            const s = r.before(i),
              l = r.after(i);
            n.delete(s, l).scrollIntoView();
          }
          return !0;
        }
      return !1;
    },
  b$ =
    (n) =>
    ({ tr: e, state: t, dispatch: o }) => {
      const r = ce(n, t.schema),
        i = e.selection.$anchor;
      for (let s = i.depth; s > 0; s -= 1)
        if (i.node(s).type === r) {
          if (o) {
            const l = i.before(s),
              a = i.after(s);
            e.delete(l, a).scrollIntoView();
          }
          return !0;
        }
      return !1;
    },
  v$ =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      const { from: o, to: r } = n;
      return t && e.delete(o, r), !0;
    },
  x$ =
    () =>
    ({ state: n, dispatch: e }) =>
      zS(n, e),
  S$ =
    () =>
    ({ commands: n }) =>
      n.keyboardShortcut("Enter"),
  $$ =
    () =>
    ({ state: n, dispatch: e }) =>
      HS(n, e);
function Pi(n, e, t = { strict: !0 }) {
  const o = Object.keys(e);
  return o.length
    ? o.every((r) => (t.strict ? e[r] === n[r] : c$(e[r]) ? e[r].test(n[r]) : e[r] === n[r]))
    : !0;
}
function ua(n, e, t = {}) {
  return n.find((o) => o.type === e && Pi(o.attrs, t));
}
function M$(n, e, t = {}) {
  return !!ua(n, e, t);
}
function Jm(n, e, t = {}) {
  if (!n || !e) return;
  let o = n.parent.childAfter(n.parentOffset);
  if (
    (n.parentOffset === o.offset && o.offset !== 0 && (o = n.parent.childBefore(n.parentOffset)),
    !o.node)
  )
    return;
  const r = ua([...o.node.marks], e, t);
  if (!r) return;
  let i = o.index,
    s = n.start() + o.offset,
    l = i + 1,
    a = s + o.node.nodeSize;
  for (ua([...o.node.marks], e, t); i > 0 && r.isInSet(n.parent.child(i - 1).marks); )
    (i -= 1), (s -= n.parent.child(i).nodeSize);
  for (; l < n.parent.childCount && M$([...n.parent.child(l).marks], e, t); )
    (a += n.parent.child(l).nodeSize), (l += 1);
  return { from: s, to: a };
}
function It(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
const C$ =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      const i = It(n, o.schema),
        { doc: s, selection: l } = t,
        { $from: a, from: c, to: d } = l;
      if (r) {
        const h = Jm(a, i, e);
        if (h && h.from <= c && h.to >= d) {
          const p = B.create(s, h.from, h.to);
          t.setSelection(p);
        }
      }
      return !0;
    },
  O$ = (n) => (e) => {
    const t = typeof n == "function" ? n(e) : n;
    for (let o = 0; o < t.length; o += 1) if (t[o](e)) return !0;
    return !1;
  };
function Lm(n) {
  return n instanceof B;
}
function Ht(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function N$(n, e = null) {
  if (!e) return null;
  const t = j.atStart(n),
    o = j.atEnd(n);
  if (e === "start" || e === !0) return t;
  if (e === "end") return o;
  const r = t.from,
    i = o.to;
  return e === "all"
    ? B.create(n, Ht(0, r, i), Ht(n.content.size, r, i))
    : B.create(n, Ht(e, r, i), Ht(e, r, i));
}
function pc() {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
      navigator.platform,
    ) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}
const T$ =
    (n = null, e = {}) =>
    ({ editor: t, view: o, tr: r, dispatch: i }) => {
      e = { scrollIntoView: !0, ...e };
      const s = () => {
        pc() && o.dom.focus(),
          requestAnimationFrame(() => {
            t.isDestroyed ||
              (o.focus(), e != null && e.scrollIntoView && t.commands.scrollIntoView());
          });
      };
      if ((o.hasFocus() && n === null) || n === !1) return !0;
      if (i && n === null && !Lm(t.state.selection)) return s(), !0;
      const l = N$(r.doc, n) || t.state.selection,
        a = t.state.selection.eq(l);
      return (
        i && (a || r.setSelection(l), a && r.storedMarks && r.setStoredMarks(r.storedMarks), s()),
        !0
      );
    },
  E$ = (n, e) => (t) => n.every((o, r) => e(o, { ...t, index: r })),
  A$ =
    (n, e) =>
    ({ tr: t, commands: o }) =>
      o.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e),
  qm = (n) => {
    const e = n.childNodes;
    for (let t = e.length - 1; t >= 0; t -= 1) {
      const o = e[t];
      o.nodeType === 3 && o.nodeValue && /^(\n\s\s|\n)$/.test(o.nodeValue)
        ? n.removeChild(o)
        : o.nodeType === 1 && qm(o);
    }
    return n;
  };
function Dh(n) {
  const e = `<body>${n}</body>`,
    t = new window.DOMParser().parseFromString(e, "text/html").body;
  return qm(t);
}
function Bi(n, e, t) {
  if (((t = { slice: !0, parseOptions: {}, ...t }), typeof n == "object" && n !== null))
    try {
      return Array.isArray(n) && n.length > 0
        ? x.fromArray(n.map((o) => e.nodeFromJSON(o)))
        : e.nodeFromJSON(n);
    } catch (o) {
      return (
        console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", o),
        Bi("", e, t)
      );
    }
  if (typeof n == "string") {
    const o = dr.fromSchema(e);
    return t.slice ? o.parseSlice(Dh(n), t.parseOptions).content : o.parse(Dh(n), t.parseOptions);
  }
  return Bi("", e, t);
}
function I$(n, e, t) {
  const o = n.steps.length - 1;
  if (o < e) return;
  const r = n.steps[o];
  if (!(r instanceof Ee || r instanceof Oe)) return;
  const i = n.mapping.maps[o];
  let s = 0;
  i.forEach((l, a, c, d) => {
    s === 0 && (s = d);
  }),
    n.setSelection(j.near(n.doc.resolve(s), t));
}
const D$ = (n) => n.toString().startsWith("<"),
  R$ =
    (n, e, t) =>
    ({ tr: o, dispatch: r, editor: i }) => {
      if (r) {
        t = { parseOptions: {}, updateSelection: !0, ...t };
        const s = Bi(e, i.schema, {
          parseOptions: { preserveWhitespace: "full", ...t.parseOptions },
        });
        if (s.toString() === "<>") return !0;
        let { from: l, to: a } =
            typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to },
          c = !0,
          d = !0;
        if (
          ((D$(s) ? s : [s]).forEach((h) => {
            h.check(), (c = c ? h.isText && h.marks.length === 0 : !1), (d = d ? h.isBlock : !1);
          }),
          l === a && d)
        ) {
          const { parent: h } = o.doc.resolve(l);
          h.isTextblock && !h.type.spec.code && !h.childCount && ((l -= 1), (a += 1));
        }
        c
          ? Array.isArray(e)
            ? o.insertText(e.map((h) => h.text || "").join(""), l, a)
            : typeof e == "object" && e && e.text
              ? o.insertText(e.text, l, a)
              : o.insertText(e, l, a)
          : o.replaceWith(l, a, s),
          t.updateSelection && I$(o, o.steps.length - 1, -1);
      }
      return !0;
    },
  z$ =
    () =>
    ({ state: n, dispatch: e }) =>
      LS(n, e),
  P$ =
    () =>
    ({ state: n, dispatch: e }) =>
      qS(n, e),
  B$ =
    () =>
    ({ state: n, dispatch: e }) =>
      PS(n, e),
  F$ =
    () =>
    ({ state: n, dispatch: e }) =>
      jS(n, e),
  V$ =
    () =>
    ({ tr: n, state: e, dispatch: t }) => {
      try {
        const o = ts(e.doc, e.selection.$from.pos, -1);
        return o == null ? !1 : (n.join(o, 2), t && t(n), !0);
      } catch {
        return !1;
      }
    },
  j$ =
    () =>
    ({ state: n, dispatch: e, tr: t }) => {
      try {
        const o = ts(n.doc, n.selection.$from.pos, 1);
        return o == null ? !1 : (t.join(o, 2), e && e(t), !0);
      } catch {
        return !1;
      }
    },
  J$ =
    () =>
    ({ state: n, dispatch: e }) =>
      BS(n, e),
  L$ =
    () =>
    ({ state: n, dispatch: e }) =>
      FS(n, e);
function Km() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function q$(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let o, r, i, s;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a)) s = !0;
    else if (/^a(lt)?$/i.test(a)) o = !0;
    else if (/^(c|ctrl|control)$/i.test(a)) r = !0;
    else if (/^s(hift)?$/i.test(a)) i = !0;
    else if (/^mod$/i.test(a)) pc() || Km() ? (s = !0) : (r = !0);
    else throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return (
    o && (t = `Alt-${t}`),
    r && (t = `Ctrl-${t}`),
    s && (t = `Meta-${t}`),
    i && (t = `Shift-${t}`),
    t
  );
}
const K$ =
  (n) =>
  ({ editor: e, view: t, tr: o, dispatch: r }) => {
    const i = q$(n).split(/-(?!$)/),
      s = i.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)),
      l = new KeyboardEvent("keydown", {
        key: s === "Space" ? " " : s,
        altKey: i.includes("Alt"),
        ctrlKey: i.includes("Ctrl"),
        metaKey: i.includes("Meta"),
        shiftKey: i.includes("Shift"),
        bubbles: !0,
        cancelable: !0,
      }),
      a = e.captureTransaction(() => {
        t.someProp("handleKeyDown", (c) => c(t, l));
      });
    return (
      a == null ||
        a.steps.forEach((c) => {
          const d = c.map(o.mapping);
          d && r && o.maybeStep(d);
        }),
      !0
    );
  };
function fc(n, e, t = {}) {
  const { from: o, to: r, empty: i } = n.selection,
    s = e ? ce(e, n.schema) : null,
    l = [];
  n.doc.nodesBetween(o, r, (d, h) => {
    if (d.isText) return;
    const p = Math.max(o, h),
      f = Math.min(r, h + d.nodeSize);
    l.push({ node: d, from: p, to: f });
  });
  const a = r - o,
    c = l
      .filter((d) => (s ? s.name === d.node.type.name : !0))
      .filter((d) => Pi(d.node.attrs, t, { strict: !1 }));
  return i ? !!c.length : c.reduce((d, h) => d + h.to - h.from, 0) >= a;
}
const W$ =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = ce(n, t.schema);
      return fc(t, r, e) ? KS(t, o) : !1;
    },
  H$ =
    () =>
    ({ state: n, dispatch: e }) =>
      GS(n, e),
  U$ =
    (n) =>
    ({ state: e, dispatch: t }) => {
      const o = ce(n, e.schema);
      return n$(o)(e, t);
    },
  G$ =
    () =>
    ({ state: n, dispatch: e }) =>
      WS(n, e);
function Wm(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Rh(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((o, r) => (t.includes(r) || (o[r] = n[r]), o), {});
}
const Y$ =
    (n, e) =>
    ({ tr: t, state: o, dispatch: r }) => {
      let i = null,
        s = null;
      const l = Wm(typeof n == "string" ? n : n.name, o.schema);
      return l
        ? (l === "node" && (i = ce(n, o.schema)),
          l === "mark" && (s = It(n, o.schema)),
          r &&
            t.selection.ranges.forEach((a) => {
              o.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, d) => {
                i && i === c.type && t.setNodeMarkup(d, void 0, Rh(c.attrs, e)),
                  s &&
                    c.marks.length &&
                    c.marks.forEach((h) => {
                      s === h.type && t.addMark(d, d + c.nodeSize, s.create(Rh(h.attrs, e)));
                    });
              });
            }),
          !0)
        : !1;
    },
  X$ =
    () =>
    ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0),
  Q$ =
    () =>
    ({ tr: n, commands: e }) =>
      e.setTextSelection({ from: 0, to: n.doc.content.size }),
  Z$ =
    () =>
    ({ state: n, dispatch: e }) =>
      VS(n, e),
  _$ =
    () =>
    ({ state: n, dispatch: e }) =>
      JS(n, e),
  eM =
    () =>
    ({ state: n, dispatch: e }) =>
      YS(n, e),
  tM =
    () =>
    ({ state: n, dispatch: e }) =>
      ZS(n, e),
  nM =
    () =>
    ({ state: n, dispatch: e }) =>
      QS(n, e);
function oM(n, e, t = {}) {
  return Bi(n, e, { slice: !1, parseOptions: t });
}
const rM =
  (n, e = !1, t = {}) =>
  ({ tr: o, editor: r, dispatch: i }) => {
    const { doc: s } = o,
      l = oM(n, r.schema, t);
    return i && o.replaceWith(0, s.content.size, l).setMeta("preventUpdate", !e), !0;
  };
function iM(n, e) {
  const t = It(e, n.schema),
    { from: o, to: r, empty: i } = n.selection,
    s = [];
  i
    ? (n.storedMarks && s.push(...n.storedMarks), s.push(...n.selection.$head.marks()))
    : n.doc.nodesBetween(o, r, (a) => {
        s.push(...a.marks);
      });
  const l = s.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function sM(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs()) return t;
  }
  return null;
}
function lM(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const o = n.node(t);
    if (e(o)) return { pos: t > 0 ? n.before(t) : 0, start: n.start(t), depth: t, node: o };
  }
}
function uc(n) {
  return (e) => lM(e.$from, n);
}
function ri(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([o]) => {
      const r = n.find((i) => i.type === e && i.name === o);
      return r ? r.attribute.keepOnSplit : !1;
    }),
  );
}
function aM(n, e, t = {}) {
  const { empty: o, ranges: r } = n.selection,
    i = e ? It(e, n.schema) : null;
  if (o)
    return !!(n.storedMarks || n.selection.$from.marks())
      .filter((d) => (i ? i.name === d.type.name : !0))
      .find((d) => Pi(d.attrs, t, { strict: !1 }));
  let s = 0;
  const l = [];
  if (
    (r.forEach(({ $from: d, $to: h }) => {
      const p = d.pos,
        f = h.pos;
      n.doc.nodesBetween(p, f, (u, m) => {
        if (!u.isText && !u.marks.length) return;
        const g = Math.max(p, m),
          y = Math.min(f, m + u.nodeSize),
          w = y - g;
        (s += w), l.push(...u.marks.map((b) => ({ mark: b, from: g, to: y })));
      });
    }),
    s === 0)
  )
    return !1;
  const a = l
      .filter((d) => (i ? i.name === d.mark.type.name : !0))
      .filter((d) => Pi(d.mark.attrs, t, { strict: !1 }))
      .reduce((d, h) => d + h.to - h.from, 0),
    c = l
      .filter((d) => (i ? d.mark.type !== i && d.mark.type.excludes(i) : !0))
      .reduce((d, h) => d + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= s;
}
function zh(n, e) {
  const { nodeExtensions: t } = l$(e),
    o = t.find((s) => s.name === n);
  if (!o) return !1;
  const r = { name: o.name, options: o.options, storage: o.storage },
    i = Jn(wt(o, "group", r));
  return typeof i != "string" ? !1 : i.split(" ").includes("list");
}
function cM(n, e, t) {
  var o;
  const { selection: r } = e;
  let i = null;
  if ((Lm(r) && (i = r.$cursor), i)) {
    const l = (o = n.storedMarks) !== null && o !== void 0 ? o : i.marks();
    return !!t.isInSet(l) || !l.some((a) => a.type.excludes(t));
  }
  const { ranges: s } = r;
  return s.some(({ $from: l, $to: a }) => {
    let c = l.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return (
      n.doc.nodesBetween(l.pos, a.pos, (d, h, p) => {
        if (c) return !1;
        if (d.isInline) {
          const f = !p || p.type.allowsMarkType(t),
            u = !!t.isInSet(d.marks) || !d.marks.some((m) => m.type.excludes(t));
          c = f && u;
        }
        return !c;
      }),
      c
    );
  });
}
const dM =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      const { selection: i } = t,
        { empty: s, ranges: l } = i,
        a = It(n, o.schema);
      if (r)
        if (s) {
          const c = iM(o, a);
          t.addStoredMark(a.create({ ...c, ...e }));
        } else
          l.forEach((c) => {
            const d = c.$from.pos,
              h = c.$to.pos;
            o.doc.nodesBetween(d, h, (p, f) => {
              const u = Math.max(f, d),
                m = Math.min(f + p.nodeSize, h);
              p.marks.find((g) => g.type === a)
                ? p.marks.forEach((g) => {
                    a === g.type && t.addMark(u, m, a.create({ ...g.attrs, ...e }));
                  })
                : t.addMark(u, m, a.create(e));
            });
          });
      return cM(o, t, a);
    },
  hM =
    (n, e) =>
    ({ tr: t }) => (t.setMeta(n, e), !0),
  pM =
    (n, e = {}) =>
    ({ state: t, dispatch: o, chain: r }) => {
      const i = ce(n, t.schema);
      return i.isTextblock
        ? r()
            .command(({ commands: s }) => (Ih(i, e)(t) ? !0 : s.clearNodes()))
            .command(({ state: s }) => Ih(i, e)(s, o))
            .run()
        : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'),
          !1);
    },
  fM =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      if (t) {
        const { doc: o } = e,
          r = Ht(n, 0, o.content.size),
          i = A.create(o, r);
        e.setSelection(i);
      }
      return !0;
    },
  uM =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      if (t) {
        const { doc: o } = e,
          { from: r, to: i } = typeof n == "number" ? { from: n, to: n } : n,
          s = B.atStart(o).from,
          l = B.atEnd(o).to,
          a = Ht(r, s, l),
          c = Ht(i, s, l),
          d = B.create(o, a, c);
        e.setSelection(d);
      }
      return !0;
    },
  mM =
    (n) =>
    ({ state: e, dispatch: t }) => {
      const o = ce(n, e.schema);
      return i$(o)(e, t);
    };
function Ph(n, e) {
  const t = n.storedMarks || (n.selection.$to.parentOffset && n.selection.$from.marks());
  if (t) {
    const o = t.filter((r) => (e == null ? void 0 : e.includes(r.type.name)));
    n.tr.ensureMarks(o);
  }
}
const gM =
    ({ keepMarks: n = !0 } = {}) =>
    ({ tr: e, state: t, dispatch: o, editor: r }) => {
      const { selection: i, doc: s } = e,
        { $from: l, $to: a } = i,
        c = r.extensionManager.attributes,
        d = ri(c, l.node().type.name, l.node().attrs);
      if (i instanceof A && i.node.isBlock)
        return !l.parentOffset || !Gn(s, l.pos)
          ? !1
          : (o && (n && Ph(t, r.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()),
            !0);
      if (!l.parent.isBlock) return !1;
      if (o) {
        const h = a.parentOffset === a.parent.content.size;
        i instanceof B && e.deleteSelection();
        const p = l.depth === 0 ? void 0 : sM(l.node(-1).contentMatchAt(l.indexAfter(-1)));
        let f = h && p ? [{ type: p, attrs: d }] : void 0,
          u = Gn(e.doc, e.mapping.map(l.pos), 1, f);
        if (
          (!f &&
            !u &&
            Gn(e.doc, e.mapping.map(l.pos), 1, p ? [{ type: p }] : void 0) &&
            ((u = !0), (f = p ? [{ type: p, attrs: d }] : void 0)),
          u &&
            (e.split(e.mapping.map(l.pos), 1, f),
            p && !h && !l.parentOffset && l.parent.type !== p))
        ) {
          const m = e.mapping.map(l.before()),
            g = e.doc.resolve(m);
          l.node(-1).canReplaceWith(g.index(), g.index() + 1, p) &&
            e.setNodeMarkup(e.mapping.map(l.before()), p);
        }
        n && Ph(t, r.extensionManager.splittableMarks), e.scrollIntoView();
      }
      return !0;
    },
  yM =
    (n) =>
    ({ tr: e, state: t, dispatch: o, editor: r }) => {
      var i;
      const s = ce(n, t.schema),
        { $from: l, $to: a } = t.selection,
        c = t.selection.node;
      if ((c && c.isBlock) || l.depth < 2 || !l.sameParent(a)) return !1;
      const d = l.node(-1);
      if (d.type !== s) return !1;
      const h = r.extensionManager.attributes;
      if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
        if (l.depth === 2 || l.node(-3).type !== s || l.index(-2) !== l.node(-2).childCount - 1)
          return !1;
        if (o) {
          let g = x.empty;
          const y = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
          for (let R = l.depth - y; R >= l.depth - 3; R -= 1) g = x.from(l.node(R).copy(g));
          const w =
              l.indexAfter(-1) < l.node(-2).childCount
                ? 1
                : l.indexAfter(-2) < l.node(-3).childCount
                  ? 2
                  : 3,
            b = ri(h, l.node().type.name, l.node().attrs),
            z =
              ((i = s.contentMatch.defaultType) === null || i === void 0
                ? void 0
                : i.createAndFill(b)) || void 0;
          g = g.append(x.from(s.createAndFill(null, z) || void 0));
          const $ = l.before(l.depth - (y - 1));
          e.replace($, l.after(-w), new O(g, 4 - y, 0));
          let N = -1;
          e.doc.nodesBetween($, e.doc.content.size, (R, G) => {
            if (N > -1) return !1;
            R.isTextblock && R.content.size === 0 && (N = G + 1);
          }),
            N > -1 && e.setSelection(B.near(e.doc.resolve(N))),
            e.scrollIntoView();
        }
        return !0;
      }
      const p = a.pos === l.end() ? d.contentMatchAt(0).defaultType : null,
        f = ri(h, d.type.name, d.attrs),
        u = ri(h, l.node().type.name, l.node().attrs);
      e.delete(l.pos, a.pos);
      const m = p
        ? [
            { type: s, attrs: f },
            { type: p, attrs: u },
          ]
        : [{ type: s, attrs: f }];
      if (!Gn(e.doc, l.pos, 2)) return !1;
      if (o) {
        const { selection: g, storedMarks: y } = t,
          { splittableMarks: w } = r.extensionManager,
          b = y || (g.$to.parentOffset && g.$from.marks());
        if ((e.split(l.pos, 2, m).scrollIntoView(), !b || !o)) return !0;
        const z = b.filter(($) => w.includes($.type.name));
        e.ensureMarks(z);
      }
      return !0;
    },
  Zs = (n, e) => {
    const t = uc((i) => i.type === e)(n.selection);
    if (!t) return !0;
    const o = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
    if (o === void 0) return !0;
    const r = n.doc.nodeAt(o);
    return t.node.type === (r == null ? void 0 : r.type) && wn(n.doc, t.pos) && n.join(t.pos), !0;
  },
  _s = (n, e) => {
    const t = uc((i) => i.type === e)(n.selection);
    if (!t) return !0;
    const o = n.doc.resolve(t.start).after(t.depth);
    if (o === void 0) return !0;
    const r = n.doc.nodeAt(o);
    return t.node.type === (r == null ? void 0 : r.type) && wn(n.doc, o) && n.join(o), !0;
  },
  kM =
    (n, e, t, o = {}) =>
    ({ editor: r, tr: i, state: s, dispatch: l, chain: a, commands: c, can: d }) => {
      const { extensions: h, splittableMarks: p } = r.extensionManager,
        f = ce(n, s.schema),
        u = ce(e, s.schema),
        { selection: m, storedMarks: g } = s,
        { $from: y, $to: w } = m,
        b = y.blockRange(w),
        z = g || (m.$to.parentOffset && m.$from.marks());
      if (!b) return !1;
      const $ = uc((N) => zh(N.type.name, h))(m);
      if (b.depth >= 1 && $ && b.depth - $.depth <= 1) {
        if ($.node.type === f) return c.liftListItem(u);
        if (zh($.node.type.name, h) && f.validContent($.node.content) && l)
          return a()
            .command(() => (i.setNodeMarkup($.pos, f), !0))
            .command(() => Zs(i, f))
            .command(() => _s(i, f))
            .run();
      }
      return !t || !z || !l
        ? a()
            .command(() => (d().wrapInList(f, o) ? !0 : c.clearNodes()))
            .wrapInList(f, o)
            .command(() => Zs(i, f))
            .command(() => _s(i, f))
            .run()
        : a()
            .command(() => {
              const N = d().wrapInList(f, o),
                R = z.filter((G) => p.includes(G.type.name));
              return i.ensureMarks(R), N ? !0 : c.clearNodes();
            })
            .wrapInList(f, o)
            .command(() => Zs(i, f))
            .command(() => _s(i, f))
            .run();
    },
  wM =
    (n, e = {}, t = {}) =>
    ({ state: o, commands: r }) => {
      const { extendEmptyMarkRange: i = !1 } = t,
        s = It(n, o.schema);
      return aM(o, s, e) ? r.unsetMark(s, { extendEmptyMarkRange: i }) : r.setMark(s, e);
    },
  bM =
    (n, e, t = {}) =>
    ({ state: o, commands: r }) => {
      const i = ce(n, o.schema),
        s = ce(e, o.schema);
      return fc(o, i, t) ? r.setNode(s) : r.setNode(i, t);
    },
  vM =
    (n, e = {}) =>
    ({ state: t, commands: o }) => {
      const r = ce(n, t.schema);
      return fc(t, r, e) ? o.lift(r) : o.wrapIn(r, e);
    },
  xM =
    () =>
    ({ state: n, dispatch: e }) => {
      const t = n.plugins;
      for (let o = 0; o < t.length; o += 1) {
        const r = t[o];
        let i;
        if (r.spec.isInputRules && (i = r.getState(n))) {
          if (e) {
            const s = n.tr,
              l = i.transform;
            for (let a = l.steps.length - 1; a >= 0; a -= 1) s.step(l.steps[a].invert(l.docs[a]));
            if (i.text) {
              const a = s.doc.resolve(i.from).marks();
              s.replaceWith(i.from, i.to, n.schema.text(i.text, a));
            } else s.delete(i.from, i.to);
          }
          return !0;
        }
      }
      return !1;
    },
  SM =
    () =>
    ({ tr: n, dispatch: e }) => {
      const { selection: t } = n,
        { empty: o, ranges: r } = t;
      return (
        o ||
          (e &&
            r.forEach((i) => {
              n.removeMark(i.$from.pos, i.$to.pos);
            })),
        !0
      );
    },
  $M =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      var i;
      const { extendEmptyMarkRange: s = !1 } = e,
        { selection: l } = t,
        a = It(n, o.schema),
        { $from: c, empty: d, ranges: h } = l;
      if (!r) return !0;
      if (d && s) {
        let { from: p, to: f } = l;
        const u =
            (i = c.marks().find((g) => g.type === a)) === null || i === void 0 ? void 0 : i.attrs,
          m = Jm(c, a, u);
        m && ((p = m.from), (f = m.to)), t.removeMark(p, f, a);
      } else
        h.forEach((p) => {
          t.removeMark(p.$from.pos, p.$to.pos, a);
        });
      return t.removeStoredMark(a), !0;
    },
  MM =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      let i = null,
        s = null;
      const l = Wm(typeof n == "string" ? n : n.name, o.schema);
      return l
        ? (l === "node" && (i = ce(n, o.schema)),
          l === "mark" && (s = It(n, o.schema)),
          r &&
            t.selection.ranges.forEach((a) => {
              const c = a.$from.pos,
                d = a.$to.pos;
              o.doc.nodesBetween(c, d, (h, p) => {
                i && i === h.type && t.setNodeMarkup(p, void 0, { ...h.attrs, ...e }),
                  s &&
                    h.marks.length &&
                    h.marks.forEach((f) => {
                      if (s === f.type) {
                        const u = Math.max(p, c),
                          m = Math.min(p + h.nodeSize, d);
                        t.addMark(u, m, s.create({ ...f.attrs, ...e }));
                      }
                    });
              });
            }),
          !0)
        : !1;
    },
  CM =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = ce(n, t.schema);
      return _S(r, e)(t, o);
    },
  OM =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = ce(n, t.schema);
      return e$(r, e)(t, o);
    };
var NM = Object.freeze({
  __proto__: null,
  blur: f$,
  clearContent: u$,
  clearNodes: m$,
  command: g$,
  createParagraphNear: y$,
  cut: k$,
  deleteCurrentNode: w$,
  deleteNode: b$,
  deleteRange: v$,
  deleteSelection: x$,
  enter: S$,
  exitCode: $$,
  extendMarkRange: C$,
  first: O$,
  focus: T$,
  forEach: E$,
  insertContent: A$,
  insertContentAt: R$,
  joinUp: z$,
  joinDown: P$,
  joinBackward: B$,
  joinForward: F$,
  joinItemBackward: V$,
  joinItemForward: j$,
  joinTextblockBackward: J$,
  joinTextblockForward: L$,
  keyboardShortcut: K$,
  lift: W$,
  liftEmptyBlock: H$,
  liftListItem: U$,
  newlineInCode: G$,
  resetAttributes: Y$,
  scrollIntoView: X$,
  selectAll: Q$,
  selectNodeBackward: Z$,
  selectNodeForward: _$,
  selectParentNode: eM,
  selectTextblockEnd: tM,
  selectTextblockStart: nM,
  setContent: rM,
  setMark: dM,
  setMeta: hM,
  setNode: pM,
  setNodeSelection: fM,
  setTextSelection: uM,
  sinkListItem: mM,
  splitBlock: gM,
  splitListItem: yM,
  toggleList: kM,
  toggleMark: wM,
  toggleNode: bM,
  toggleWrap: vM,
  undoInputRule: xM,
  unsetAllMarks: SM,
  unsetMark: $M,
  updateAttributes: MM,
  wrapIn: CM,
  wrapInList: OM,
});
rt.create({
  name: "commands",
  addCommands() {
    return { ...NM };
  },
});
rt.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new Or({ key: new Nr("editable"), props: { editable: () => this.editor.options.editable } }),
    ];
  },
});
rt.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new Or({
        key: new Nr("focusEvents"),
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              n.isFocused = !0;
              const o = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(o), !1;
            },
            blur: (e, t) => {
              n.isFocused = !1;
              const o = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(o), !1;
            },
          },
        },
      }),
    ];
  },
});
rt.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () =>
        this.editor.commands.first(({ commands: i }) => [
          () => i.undoInputRule(),
          () =>
            i.command(({ tr: s }) => {
              const { selection: l, doc: a } = s,
                { empty: c, $anchor: d } = l,
                { pos: h, parent: p } = d,
                f = d.parent.isTextblock ? s.doc.resolve(h - 1) : d,
                u = f.parent.type.spec.isolating,
                m = d.pos - d.parentOffset,
                g = u && f.parent.childCount === 1 ? m === d.pos : j.atStart(a).from === h;
              return !c || !g || !p.type.isTextblock || p.textContent.length ? !1 : i.clearNodes();
            }),
          () => i.deleteSelection(),
          () => i.joinBackward(),
          () => i.selectNodeBackward(),
        ]),
      e = () =>
        this.editor.commands.first(({ commands: i }) => [
          () => i.deleteSelection(),
          () => i.deleteCurrentNode(),
          () => i.joinForward(),
          () => i.selectNodeForward(),
        ]),
      t = {
        Enter: () =>
          this.editor.commands.first(({ commands: i }) => [
            () => i.newlineInCode(),
            () => i.createParagraphNear(),
            () => i.liftEmptyBlock(),
            () => i.splitBlock(),
          ]),
        "Mod-Enter": () => this.editor.commands.exitCode(),
        Backspace: n,
        "Mod-Backspace": n,
        "Shift-Backspace": n,
        Delete: e,
        "Mod-Delete": e,
        "Mod-a": () => this.editor.commands.selectAll(),
      },
      o = { ...t },
      r = {
        ...t,
        "Ctrl-h": n,
        "Alt-Backspace": n,
        "Ctrl-d": e,
        "Ctrl-Alt-Backspace": e,
        "Alt-Delete": e,
        "Alt-d": e,
        "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
        "Ctrl-e": () => this.editor.commands.selectTextblockEnd(),
      };
    return pc() || Km() ? r : o;
  },
  addProseMirrorPlugins() {
    return [
      new Or({
        key: new Nr("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (!(n.some((h) => h.docChanged) && !e.doc.eq(t.doc))) return;
          const { empty: o, from: r, to: i } = e.selection,
            s = j.atStart(e.doc).from,
            l = j.atEnd(e.doc).to;
          if (
            o ||
            !(r === s && i === l) ||
            t.doc.textBetween(0, t.doc.content.size, " ", " ").length !== 0
          )
            return;
          const a = t.tr,
            c = Vm({ state: t, transaction: a }),
            { commands: d } = new s$({ editor: this.editor, state: c });
          if ((d.clearNodes(), !!a.steps.length)) return a;
        },
      }),
    ];
  },
});
rt.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new Or({
        key: new Nr("tabindex"),
        props: { attributes: this.editor.isEditable ? { tabindex: "0" } : {} },
      }),
    ];
  },
});
function Hm(n, e, t) {
  for (let o = 0; ; o++) {
    if (o == n.childCount || o == e.childCount) return n.childCount == e.childCount ? null : t;
    let r = n.child(o),
      i = e.child(o);
    if (r == i) {
      t += r.nodeSize;
      continue;
    }
    if (!r.sameMarkup(i)) return t;
    if (r.isText && r.text != i.text) {
      for (let s = 0; r.text[s] == i.text[s]; s++) t++;
      return t;
    }
    if (r.content.size || i.content.size) {
      let s = Hm(r.content, i.content, t + 1);
      if (s != null) return s;
    }
    t += r.nodeSize;
  }
}
function Um(n, e, t, o) {
  for (let r = n.childCount, i = e.childCount; ; ) {
    if (r == 0 || i == 0) return r == i ? null : { a: t, b: o };
    let s = n.child(--r),
      l = e.child(--i),
      a = s.nodeSize;
    if (s == l) {
      (t -= a), (o -= a);
      continue;
    }
    if (!s.sameMarkup(l)) return { a: t, b: o };
    if (s.isText && s.text != l.text) {
      let c = 0,
        d = Math.min(s.text.length, l.text.length);
      for (; c < d && s.text[s.text.length - c - 1] == l.text[l.text.length - c - 1]; )
        c++, t--, o--;
      return { a: t, b: o };
    }
    if (s.content.size || l.content.size) {
      let c = Um(s.content, l.content, t - 1, o - 1);
      if (c) return c;
    }
    (t -= a), (o -= a);
  }
}
class C {
  constructor(e, t) {
    if (((this.content = e), (this.size = t || 0), t == null))
      for (let o = 0; o < e.length; o++) this.size += e[o].nodeSize;
  }
  nodesBetween(e, t, o, r = 0, i) {
    for (let s = 0, l = 0; l < t; s++) {
      let a = this.content[s],
        c = l + a.nodeSize;
      if (c > e && o(a, r + l, i || null, s) !== !1 && a.content.size) {
        let d = l + 1;
        a.nodesBetween(Math.max(0, e - d), Math.min(a.content.size, t - d), o, r + d);
      }
      l = c;
    }
  }
  descendants(e) {
    this.nodesBetween(0, this.size, e);
  }
  textBetween(e, t, o, r) {
    let i = "",
      s = !0;
    return (
      this.nodesBetween(
        e,
        t,
        (l, a) => {
          let c = l.isText
            ? l.text.slice(Math.max(e, a) - a, t - a)
            : l.isLeaf
              ? r
                ? typeof r == "function"
                  ? r(l)
                  : r
                : l.type.spec.leafText
                  ? l.type.spec.leafText(l)
                  : ""
              : "";
          l.isBlock && ((l.isLeaf && c) || l.isTextblock) && o && (s ? (s = !1) : (i += o)),
            (i += c);
        },
        0,
      ),
      i
    );
  }
  append(e) {
    if (!e.size) return this;
    if (!this.size) return e;
    let t = this.lastChild,
      o = e.firstChild,
      r = this.content.slice(),
      i = 0;
    for (
      t.isText && t.sameMarkup(o) && ((r[r.length - 1] = t.withText(t.text + o.text)), (i = 1));
      i < e.content.length;
      i++
    )
      r.push(e.content[i]);
    return new C(r, this.size + e.size);
  }
  cut(e, t = this.size) {
    if (e == 0 && t == this.size) return this;
    let o = [],
      r = 0;
    if (t > e)
      for (let i = 0, s = 0; s < t; i++) {
        let l = this.content[i],
          a = s + l.nodeSize;
        a > e &&
          ((s < e || a > t) &&
            (l.isText
              ? (l = l.cut(Math.max(0, e - s), Math.min(l.text.length, t - s)))
              : (l = l.cut(Math.max(0, e - s - 1), Math.min(l.content.size, t - s - 1)))),
          o.push(l),
          (r += l.nodeSize)),
          (s = a);
      }
    return new C(o, r);
  }
  cutByIndex(e, t) {
    return e == t
      ? C.empty
      : e == 0 && t == this.content.length
        ? this
        : new C(this.content.slice(e, t));
  }
  replaceChild(e, t) {
    let o = this.content[e];
    if (o == t) return this;
    let r = this.content.slice(),
      i = this.size + t.nodeSize - o.nodeSize;
    return (r[e] = t), new C(r, i);
  }
  addToStart(e) {
    return new C([e].concat(this.content), this.size + e.nodeSize);
  }
  addToEnd(e) {
    return new C(this.content.concat(e), this.size + e.nodeSize);
  }
  eq(e) {
    if (this.content.length != e.content.length) return !1;
    for (let t = 0; t < this.content.length; t++) if (!this.content[t].eq(e.content[t])) return !1;
    return !0;
  }
  get firstChild() {
    return this.content.length ? this.content[0] : null;
  }
  get lastChild() {
    return this.content.length ? this.content[this.content.length - 1] : null;
  }
  get childCount() {
    return this.content.length;
  }
  child(e) {
    let t = this.content[e];
    if (!t) throw new RangeError("Index " + e + " out of range for " + this);
    return t;
  }
  maybeChild(e) {
    return this.content[e] || null;
  }
  forEach(e) {
    for (let t = 0, o = 0; t < this.content.length; t++) {
      let r = this.content[t];
      e(r, o, t), (o += r.nodeSize);
    }
  }
  findDiffStart(e, t = 0) {
    return Hm(this, e, t);
  }
  findDiffEnd(e, t = this.size, o = e.size) {
    return Um(this, e, t, o);
  }
  findIndex(e, t = -1) {
    if (e == 0) return qr(0, e);
    if (e == this.size) return qr(this.content.length, e);
    if (e > this.size || e < 0) throw new RangeError(`Position ${e} outside of fragment (${this})`);
    for (let o = 0, r = 0; ; o++) {
      let i = this.child(o),
        s = r + i.nodeSize;
      if (s >= e) return s == e || t > 0 ? qr(o + 1, s) : qr(o, r);
      r = s;
    }
  }
  toString() {
    return "<" + this.toStringInner() + ">";
  }
  toStringInner() {
    return this.content.join(", ");
  }
  toJSON() {
    return this.content.length ? this.content.map((e) => e.toJSON()) : null;
  }
  static fromJSON(e, t) {
    if (!t) return C.empty;
    if (!Array.isArray(t)) throw new RangeError("Invalid input for Fragment.fromJSON");
    return new C(t.map(e.nodeFromJSON));
  }
  static fromArray(e) {
    if (!e.length) return C.empty;
    let t,
      o = 0;
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      (o += i.nodeSize),
        r && i.isText && e[r - 1].sameMarkup(i)
          ? (t || (t = e.slice(0, r)),
            (t[t.length - 1] = i.withText(t[t.length - 1].text + i.text)))
          : t && t.push(i);
    }
    return new C(t || e, o);
  }
  static from(e) {
    if (!e) return C.empty;
    if (e instanceof C) return e;
    if (Array.isArray(e)) return this.fromArray(e);
    if (e.attrs) return new C([e], e.nodeSize);
    throw new RangeError(
      "Can not convert " +
        e +
        " to a Fragment" +
        (e.nodesBetween ? " (looks like multiple versions of prosemirror-model were loaded)" : ""),
    );
  }
}
C.empty = new C([], 0);
const el = { index: 0, offset: 0 };
function qr(n, e) {
  return (el.index = n), (el.offset = e), el;
}
function ma(n, e) {
  if (n === e) return !0;
  if (!(n && typeof n == "object") || !(e && typeof e == "object")) return !1;
  let t = Array.isArray(n);
  if (Array.isArray(e) != t) return !1;
  if (t) {
    if (n.length != e.length) return !1;
    for (let o = 0; o < n.length; o++) if (!ma(n[o], e[o])) return !1;
  } else {
    for (let o in n) if (!(o in e) || !ma(n[o], e[o])) return !1;
    for (let o in e) if (!(o in n)) return !1;
  }
  return !0;
}
let Ye = class ga {
  constructor(e, t) {
    (this.type = e), (this.attrs = t);
  }
  addToSet(e) {
    let t,
      o = !1;
    for (let r = 0; r < e.length; r++) {
      let i = e[r];
      if (this.eq(i)) return e;
      if (this.type.excludes(i.type)) t || (t = e.slice(0, r));
      else {
        if (i.type.excludes(this.type)) return e;
        !o && i.type.rank > this.type.rank && (t || (t = e.slice(0, r)), t.push(this), (o = !0)),
          t && t.push(i);
      }
    }
    return t || (t = e.slice()), o || t.push(this), t;
  }
  removeFromSet(e) {
    for (let t = 0; t < e.length; t++)
      if (this.eq(e[t])) return e.slice(0, t).concat(e.slice(t + 1));
    return e;
  }
  isInSet(e) {
    for (let t = 0; t < e.length; t++) if (this.eq(e[t])) return !0;
    return !1;
  }
  eq(e) {
    return this == e || (this.type == e.type && ma(this.attrs, e.attrs));
  }
  toJSON() {
    let e = { type: this.type.name };
    for (let t in this.attrs) {
      e.attrs = this.attrs;
      break;
    }
    return e;
  }
  static fromJSON(e, t) {
    if (!t) throw new RangeError("Invalid input for Mark.fromJSON");
    let o = e.marks[t.type];
    if (!o) throw new RangeError(`There is no mark type ${t.type} in this schema`);
    return o.create(t.attrs);
  }
  static sameSet(e, t) {
    if (e == t) return !0;
    if (e.length != t.length) return !1;
    for (let o = 0; o < e.length; o++) if (!e[o].eq(t[o])) return !1;
    return !0;
  }
  static setFrom(e) {
    if (!e || (Array.isArray(e) && e.length == 0)) return ga.none;
    if (e instanceof ga) return [e];
    let t = e.slice();
    return t.sort((o, r) => o.type.rank - r.type.rank), t;
  }
};
Ye.none = [];
class TM extends Error {}
class I {
  constructor(e, t, o) {
    (this.content = e), (this.openStart = t), (this.openEnd = o);
  }
  get size() {
    return this.content.size - this.openStart - this.openEnd;
  }
  insertAt(e, t) {
    let o = Ym(this.content, e + this.openStart, t);
    return o && new I(o, this.openStart, this.openEnd);
  }
  removeBetween(e, t) {
    return new I(
      Gm(this.content, e + this.openStart, t + this.openStart),
      this.openStart,
      this.openEnd,
    );
  }
  eq(e) {
    return this.content.eq(e.content) && this.openStart == e.openStart && this.openEnd == e.openEnd;
  }
  toString() {
    return this.content + "(" + this.openStart + "," + this.openEnd + ")";
  }
  toJSON() {
    if (!this.content.size) return null;
    let e = { content: this.content.toJSON() };
    return (
      this.openStart > 0 && (e.openStart = this.openStart),
      this.openEnd > 0 && (e.openEnd = this.openEnd),
      e
    );
  }
  static fromJSON(e, t) {
    if (!t) return I.empty;
    let o = t.openStart || 0,
      r = t.openEnd || 0;
    if (typeof o != "number" || typeof r != "number")
      throw new RangeError("Invalid input for Slice.fromJSON");
    return new I(C.fromJSON(e, t.content), o, r);
  }
  static maxOpen(e, t = !0) {
    let o = 0,
      r = 0;
    for (let i = e.firstChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.firstChild)
      o++;
    for (let i = e.lastChild; i && !i.isLeaf && (t || !i.type.spec.isolating); i = i.lastChild) r++;
    return new I(e, o, r);
  }
}
I.empty = new I(C.empty, 0, 0);
function Gm(n, e, t) {
  let { index: o, offset: r } = n.findIndex(e),
    i = n.maybeChild(o),
    { index: s, offset: l } = n.findIndex(t);
  if (r == e || i.isText) {
    if (l != t && !n.child(s).isText) throw new RangeError("Removing non-flat range");
    return n.cut(0, e).append(n.cut(t));
  }
  if (o != s) throw new RangeError("Removing non-flat range");
  return n.replaceChild(o, i.copy(Gm(i.content, e - r - 1, t - r - 1)));
}
function Ym(n, e, t, o) {
  let { index: r, offset: i } = n.findIndex(e),
    s = n.maybeChild(r);
  if (i == e || s.isText)
    return o && !o.canReplace(r, r, t) ? null : n.cut(0, e).append(t).append(n.cut(e));
  let l = Ym(s.content, e - i - 1, t);
  return l && n.replaceChild(r, s.copy(l));
}
class ya {
  constructor(e, t, o) {
    (this.$from = e), (this.$to = t), (this.depth = o);
  }
  get start() {
    return this.$from.before(this.depth + 1);
  }
  get end() {
    return this.$to.after(this.depth + 1);
  }
  get parent() {
    return this.$from.node(this.depth);
  }
  get startIndex() {
    return this.$from.index(this.depth);
  }
  get endIndex() {
    return this.$to.indexAfter(this.depth);
  }
}
class Fi {
  constructor(e, t) {
    (this.schema = e),
      (this.rules = t),
      (this.tags = []),
      (this.styles = []),
      t.forEach((o) => {
        o.tag ? this.tags.push(o) : o.style && this.styles.push(o);
      }),
      (this.normalizeLists = !this.tags.some((o) => {
        if (!/^(ul|ol)\b/.test(o.tag) || !o.node) return !1;
        let r = e.nodes[o.node];
        return r.contentMatch.matchType(r);
      }));
  }
  parse(e, t = {}) {
    let o = new Fh(this, t, !1);
    return o.addAll(e, t.from, t.to), o.finish();
  }
  parseSlice(e, t = {}) {
    let o = new Fh(this, t, !0);
    return o.addAll(e, t.from, t.to), I.maxOpen(o.finish());
  }
  matchTag(e, t, o) {
    for (let r = o ? this.tags.indexOf(o) + 1 : 0; r < this.tags.length; r++) {
      let i = this.tags[r];
      if (
        IM(e, i.tag) &&
        (i.namespace === void 0 || e.namespaceURI == i.namespace) &&
        (!i.context || t.matchesContext(i.context))
      ) {
        if (i.getAttrs) {
          let s = i.getAttrs(e);
          if (s === !1) continue;
          i.attrs = s || void 0;
        }
        return i;
      }
    }
  }
  matchStyle(e, t, o, r) {
    for (let i = r ? this.styles.indexOf(r) + 1 : 0; i < this.styles.length; i++) {
      let s = this.styles[i],
        l = s.style;
      if (
        !(
          l.indexOf(e) != 0 ||
          (s.context && !o.matchesContext(s.context)) ||
          (l.length > e.length && (l.charCodeAt(e.length) != 61 || l.slice(e.length + 1) != t))
        )
      ) {
        if (s.getAttrs) {
          let a = s.getAttrs(t);
          if (a === !1) continue;
          s.attrs = a || void 0;
        }
        return s;
      }
    }
  }
  static schemaRules(e) {
    let t = [];
    function o(r) {
      let i = r.priority == null ? 50 : r.priority,
        s = 0;
      for (; s < t.length; s++) {
        let l = t[s];
        if ((l.priority == null ? 50 : l.priority) < i) break;
      }
      t.splice(s, 0, r);
    }
    for (let r in e.marks) {
      let i = e.marks[r].spec.parseDOM;
      i &&
        i.forEach((s) => {
          o((s = Vh(s))), s.mark || s.ignore || s.clearMark || (s.mark = r);
        });
    }
    for (let r in e.nodes) {
      let i = e.nodes[r].spec.parseDOM;
      i &&
        i.forEach((s) => {
          o((s = Vh(s))), s.node || s.ignore || s.mark || (s.node = r);
        });
    }
    return t;
  }
  static fromSchema(e) {
    return e.cached.domParser || (e.cached.domParser = new Fi(e, Fi.schemaRules(e)));
  }
}
const Xm = {
    address: !0,
    article: !0,
    aside: !0,
    blockquote: !0,
    canvas: !0,
    dd: !0,
    div: !0,
    dl: !0,
    fieldset: !0,
    figcaption: !0,
    figure: !0,
    footer: !0,
    form: !0,
    h1: !0,
    h2: !0,
    h3: !0,
    h4: !0,
    h5: !0,
    h6: !0,
    header: !0,
    hgroup: !0,
    hr: !0,
    li: !0,
    noscript: !0,
    ol: !0,
    output: !0,
    p: !0,
    pre: !0,
    section: !0,
    table: !0,
    tfoot: !0,
    ul: !0,
  },
  EM = { head: !0, noscript: !0, object: !0, script: !0, style: !0, title: !0 },
  Qm = { ol: !0, ul: !0 },
  Vi = 1,
  ji = 2,
  _o = 4;
function Bh(n, e, t) {
  return e != null
    ? (e ? Vi : 0) | (e === "full" ? ji : 0)
    : n && n.whitespace == "pre"
      ? Vi | ji
      : t & ~_o;
}
class Kr {
  constructor(e, t, o, r, i, s, l) {
    (this.type = e),
      (this.attrs = t),
      (this.marks = o),
      (this.pendingMarks = r),
      (this.solid = i),
      (this.options = l),
      (this.content = []),
      (this.activeMarks = Ye.none),
      (this.stashMarks = []),
      (this.match = s || (l & _o ? null : e.contentMatch));
  }
  findWrapping(e) {
    if (!this.match) {
      if (!this.type) return [];
      let t = this.type.contentMatch.fillBefore(C.from(e));
      if (t) this.match = this.type.contentMatch.matchFragment(t);
      else {
        let o = this.type.contentMatch,
          r;
        return (r = o.findWrapping(e.type)) ? ((this.match = o), r) : null;
      }
    }
    return this.match.findWrapping(e.type);
  }
  finish(e) {
    if (!(this.options & Vi)) {
      let o = this.content[this.content.length - 1],
        r;
      if (o && o.isText && (r = /[ \t\r\n\u000c]+$/.exec(o.text))) {
        let i = o;
        o.text.length == r[0].length
          ? this.content.pop()
          : (this.content[this.content.length - 1] = i.withText(
              i.text.slice(0, i.text.length - r[0].length),
            ));
      }
    }
    let t = C.from(this.content);
    return (
      !e && this.match && (t = t.append(this.match.fillBefore(C.empty, !0))),
      this.type ? this.type.create(this.attrs, t, this.marks) : t
    );
  }
  popFromStashMark(e) {
    for (let t = this.stashMarks.length - 1; t >= 0; t--)
      if (e.eq(this.stashMarks[t])) return this.stashMarks.splice(t, 1)[0];
  }
  applyPending(e) {
    for (let t = 0, o = this.pendingMarks; t < o.length; t++) {
      let r = o[t];
      (this.type ? this.type.allowsMarkType(r.type) : RM(r.type, e)) &&
        !r.isInSet(this.activeMarks) &&
        ((this.activeMarks = r.addToSet(this.activeMarks)),
        (this.pendingMarks = r.removeFromSet(this.pendingMarks)));
    }
  }
  inlineContext(e) {
    return this.type
      ? this.type.inlineContent
      : this.content.length
        ? this.content[0].isInline
        : e.parentNode && !Xm.hasOwnProperty(e.parentNode.nodeName.toLowerCase());
  }
}
class Fh {
  constructor(e, t, o) {
    (this.parser = e), (this.options = t), (this.isOpen = o), (this.open = 0);
    let r = t.topNode,
      i,
      s = Bh(null, t.preserveWhitespace, 0) | (o ? _o : 0);
    r
      ? (i = new Kr(r.type, r.attrs, Ye.none, Ye.none, !0, t.topMatch || r.type.contentMatch, s))
      : o
        ? (i = new Kr(null, null, Ye.none, Ye.none, !0, null, s))
        : (i = new Kr(e.schema.topNodeType, null, Ye.none, Ye.none, !0, null, s)),
      (this.nodes = [i]),
      (this.find = t.findPositions),
      (this.needsBlock = !1);
  }
  get top() {
    return this.nodes[this.open];
  }
  addDOM(e) {
    e.nodeType == 3 ? this.addTextNode(e) : e.nodeType == 1 && this.addElement(e);
  }
  withStyleRules(e, t) {
    let o = e.getAttribute("style");
    if (!o) return t();
    let r = this.readStyles(DM(o));
    if (!r) return;
    let [i, s] = r,
      l = this.top;
    for (let a = 0; a < s.length; a++) this.removePendingMark(s[a], l);
    for (let a = 0; a < i.length; a++) this.addPendingMark(i[a]);
    t();
    for (let a = 0; a < i.length; a++) this.removePendingMark(i[a], l);
    for (let a = 0; a < s.length; a++) this.addPendingMark(s[a]);
  }
  addTextNode(e) {
    let t = e.nodeValue,
      o = this.top;
    if (o.options & ji || o.inlineContext(e) || /[^ \t\r\n\u000c]/.test(t)) {
      if (o.options & Vi)
        o.options & ji
          ? (t = t.replace(
              /\r\n?/g,
              `
`,
            ))
          : (t = t.replace(/\r?\n|\r/g, " "));
      else if (
        ((t = t.replace(/[ \t\r\n\u000c]+/g, " ")),
        /^[ \t\r\n\u000c]/.test(t) && this.open == this.nodes.length - 1)
      ) {
        let r = o.content[o.content.length - 1],
          i = e.previousSibling;
        (!r || (i && i.nodeName == "BR") || (r.isText && /[ \t\r\n\u000c]$/.test(r.text))) &&
          (t = t.slice(1));
      }
      t && this.insertNode(this.parser.schema.text(t)), this.findInText(e);
    } else this.findInside(e);
  }
  addElement(e, t) {
    let o = e.nodeName.toLowerCase(),
      r;
    Qm.hasOwnProperty(o) && this.parser.normalizeLists && AM(e);
    let i =
      (this.options.ruleFromNode && this.options.ruleFromNode(e)) ||
      (r = this.parser.matchTag(e, this, t));
    if (i ? i.ignore : EM.hasOwnProperty(o)) this.findInside(e), this.ignoreFallback(e);
    else if (!i || i.skip || i.closeParent) {
      i && i.closeParent
        ? (this.open = Math.max(0, this.open - 1))
        : i && i.skip.nodeType && (e = i.skip);
      let s,
        l = this.top,
        a = this.needsBlock;
      if (Xm.hasOwnProperty(o))
        l.content.length && l.content[0].isInline && this.open && (this.open--, (l = this.top)),
          (s = !0),
          l.type || (this.needsBlock = !0);
      else if (!e.firstChild) {
        this.leafFallback(e);
        return;
      }
      i && i.skip ? this.addAll(e) : this.withStyleRules(e, () => this.addAll(e)),
        s && this.sync(l),
        (this.needsBlock = a);
    } else
      this.withStyleRules(e, () => {
        this.addElementByRule(e, i, i.consuming === !1 ? r : void 0);
      });
  }
  leafFallback(e) {
    e.nodeName == "BR" &&
      this.top.type &&
      this.top.type.inlineContent &&
      this.addTextNode(
        e.ownerDocument.createTextNode(`
`),
      );
  }
  ignoreFallback(e) {
    e.nodeName == "BR" &&
      (!this.top.type || !this.top.type.inlineContent) &&
      this.findPlace(this.parser.schema.text("-"));
  }
  readStyles(e) {
    let t = Ye.none,
      o = Ye.none;
    for (let r = 0; r < e.length; r += 2)
      for (let i = void 0; ; ) {
        let s = this.parser.matchStyle(e[r], e[r + 1], this, i);
        if (!s) break;
        if (s.ignore) return null;
        if (
          (s.clearMark
            ? this.top.pendingMarks.concat(this.top.activeMarks).forEach((l) => {
                s.clearMark(l) && (o = l.addToSet(o));
              })
            : (t = this.parser.schema.marks[s.mark].create(s.attrs).addToSet(t)),
          s.consuming === !1)
        )
          i = s;
        else break;
      }
    return [t, o];
  }
  addElementByRule(e, t, o) {
    let r, i, s;
    t.node
      ? ((i = this.parser.schema.nodes[t.node]),
        i.isLeaf
          ? this.insertNode(i.create(t.attrs)) || this.leafFallback(e)
          : (r = this.enter(i, t.attrs || null, t.preserveWhitespace)))
      : ((s = this.parser.schema.marks[t.mark].create(t.attrs)), this.addPendingMark(s));
    let l = this.top;
    if (i && i.isLeaf) this.findInside(e);
    else if (o) this.addElement(e, o);
    else if (t.getContent)
      this.findInside(e), t.getContent(e, this.parser.schema).forEach((a) => this.insertNode(a));
    else {
      let a = e;
      typeof t.contentElement == "string"
        ? (a = e.querySelector(t.contentElement))
        : typeof t.contentElement == "function"
          ? (a = t.contentElement(e))
          : t.contentElement && (a = t.contentElement),
        this.findAround(e, a, !0),
        this.addAll(a);
    }
    r && this.sync(l) && this.open--, s && this.removePendingMark(s, l);
  }
  addAll(e, t, o) {
    let r = t || 0;
    for (
      let i = t ? e.childNodes[t] : e.firstChild, s = o == null ? null : e.childNodes[o];
      i != s;
      i = i.nextSibling, ++r
    )
      this.findAtPoint(e, r), this.addDOM(i);
    this.findAtPoint(e, r);
  }
  findPlace(e) {
    let t, o;
    for (let r = this.open; r >= 0; r--) {
      let i = this.nodes[r],
        s = i.findWrapping(e);
      if ((s && (!t || t.length > s.length) && ((t = s), (o = i), !s.length)) || i.solid) break;
    }
    if (!t) return !1;
    this.sync(o);
    for (let r = 0; r < t.length; r++) this.enterInner(t[r], null, !1);
    return !0;
  }
  insertNode(e) {
    if (e.isInline && this.needsBlock && !this.top.type) {
      let t = this.textblockFromContext();
      t && this.enterInner(t);
    }
    if (this.findPlace(e)) {
      this.closeExtra();
      let t = this.top;
      t.applyPending(e.type), t.match && (t.match = t.match.matchType(e.type));
      let o = t.activeMarks;
      for (let r = 0; r < e.marks.length; r++)
        (!t.type || t.type.allowsMarkType(e.marks[r].type)) && (o = e.marks[r].addToSet(o));
      return t.content.push(e.mark(o)), !0;
    }
    return !1;
  }
  enter(e, t, o) {
    let r = this.findPlace(e.create(t));
    return r && this.enterInner(e, t, !0, o), r;
  }
  enterInner(e, t = null, o = !1, r) {
    this.closeExtra();
    let i = this.top;
    i.applyPending(e), (i.match = i.match && i.match.matchType(e));
    let s = Bh(e, r, i.options);
    i.options & _o && i.content.length == 0 && (s |= _o),
      this.nodes.push(new Kr(e, t, i.activeMarks, i.pendingMarks, o, null, s)),
      this.open++;
  }
  closeExtra(e = !1) {
    let t = this.nodes.length - 1;
    if (t > this.open) {
      for (; t > this.open; t--) this.nodes[t - 1].content.push(this.nodes[t].finish(e));
      this.nodes.length = this.open + 1;
    }
  }
  finish() {
    return (
      (this.open = 0),
      this.closeExtra(this.isOpen),
      this.nodes[0].finish(this.isOpen || this.options.topOpen)
    );
  }
  sync(e) {
    for (let t = this.open; t >= 0; t--) if (this.nodes[t] == e) return (this.open = t), !0;
    return !1;
  }
  get currentPos() {
    this.closeExtra();
    let e = 0;
    for (let t = this.open; t >= 0; t--) {
      let o = this.nodes[t].content;
      for (let r = o.length - 1; r >= 0; r--) e += o[r].nodeSize;
      t && e++;
    }
    return e;
  }
  findAtPoint(e, t) {
    if (this.find)
      for (let o = 0; o < this.find.length; o++)
        this.find[o].node == e && this.find[o].offset == t && (this.find[o].pos = this.currentPos);
  }
  findInside(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].pos == null &&
          e.nodeType == 1 &&
          e.contains(this.find[t].node) &&
          (this.find[t].pos = this.currentPos);
  }
  findAround(e, t, o) {
    if (e != t && this.find)
      for (let r = 0; r < this.find.length; r++)
        this.find[r].pos == null &&
          e.nodeType == 1 &&
          e.contains(this.find[r].node) &&
          t.compareDocumentPosition(this.find[r].node) & (o ? 2 : 4) &&
          (this.find[r].pos = this.currentPos);
  }
  findInText(e) {
    if (this.find)
      for (let t = 0; t < this.find.length; t++)
        this.find[t].node == e &&
          (this.find[t].pos = this.currentPos - (e.nodeValue.length - this.find[t].offset));
  }
  matchesContext(e) {
    if (e.indexOf("|") > -1) return e.split(/\s*\|\s*/).some(this.matchesContext, this);
    let t = e.split("/"),
      o = this.options.context,
      r = !this.isOpen && (!o || o.parent.type == this.nodes[0].type),
      i = -(o ? o.depth + 1 : 0) + (r ? 0 : 1),
      s = (l, a) => {
        for (; l >= 0; l--) {
          let c = t[l];
          if (c == "") {
            if (l == t.length - 1 || l == 0) continue;
            for (; a >= i; a--) if (s(l - 1, a)) return !0;
            return !1;
          } else {
            let d =
              a > 0 || (a == 0 && r) ? this.nodes[a].type : o && a >= i ? o.node(a - i).type : null;
            if (!d || (d.name != c && d.groups.indexOf(c) == -1)) return !1;
            a--;
          }
        }
        return !0;
      };
    return s(t.length - 1, this.open);
  }
  textblockFromContext() {
    let e = this.options.context;
    if (e)
      for (let t = e.depth; t >= 0; t--) {
        let o = e.node(t).contentMatchAt(e.indexAfter(t)).defaultType;
        if (o && o.isTextblock && o.defaultAttrs) return o;
      }
    for (let t in this.parser.schema.nodes) {
      let o = this.parser.schema.nodes[t];
      if (o.isTextblock && o.defaultAttrs) return o;
    }
  }
  addPendingMark(e) {
    let t = zM(e, this.top.pendingMarks);
    t && this.top.stashMarks.push(t), (this.top.pendingMarks = e.addToSet(this.top.pendingMarks));
  }
  removePendingMark(e, t) {
    for (let o = this.open; o >= 0; o--) {
      let r = this.nodes[o];
      if (r.pendingMarks.lastIndexOf(e) > -1) r.pendingMarks = e.removeFromSet(r.pendingMarks);
      else {
        r.activeMarks = e.removeFromSet(r.activeMarks);
        let i = r.popFromStashMark(e);
        i && r.type && r.type.allowsMarkType(i.type) && (r.activeMarks = i.addToSet(r.activeMarks));
      }
      if (r == t) break;
    }
  }
}
function AM(n) {
  for (let e = n.firstChild, t = null; e; e = e.nextSibling) {
    let o = e.nodeType == 1 ? e.nodeName.toLowerCase() : null;
    o && Qm.hasOwnProperty(o) && t
      ? (t.appendChild(e), (e = t))
      : o == "li"
        ? (t = e)
        : o && (t = null);
  }
}
function IM(n, e) {
  return (n.matches || n.msMatchesSelector || n.webkitMatchesSelector || n.mozMatchesSelector).call(
    n,
    e,
  );
}
function DM(n) {
  let e = /\s*([\w-]+)\s*:\s*([^;]+)/g,
    t,
    o = [];
  for (; (t = e.exec(n)); ) o.push(t[1], t[2].trim());
  return o;
}
function Vh(n) {
  let e = {};
  for (let t in n) e[t] = n[t];
  return e;
}
function RM(n, e) {
  let t = e.schema.nodes;
  for (let o in t) {
    let r = t[o];
    if (!r.allowsMarkType(n)) continue;
    let i = [],
      s = (l) => {
        i.push(l);
        for (let a = 0; a < l.edgeCount; a++) {
          let { type: c, next: d } = l.edge(a);
          if (c == e || (i.indexOf(d) < 0 && s(d))) return !0;
        }
      };
    if (s(r.contentMatch)) return !0;
  }
}
function zM(n, e) {
  for (let t = 0; t < e.length; t++) if (n.eq(e[t])) return e[t];
}
const Zm = 65535,
  _m = Math.pow(2, 16);
function PM(n, e) {
  return n + e * _m;
}
function jh(n) {
  return n & Zm;
}
function BM(n) {
  return (n - (n & Zm)) / _m;
}
const eg = 1,
  tg = 2,
  ii = 4,
  ng = 8;
class Jh {
  constructor(e, t, o) {
    (this.pos = e), (this.delInfo = t), (this.recover = o);
  }
  get deleted() {
    return (this.delInfo & ng) > 0;
  }
  get deletedBefore() {
    return (this.delInfo & (eg | ii)) > 0;
  }
  get deletedAfter() {
    return (this.delInfo & (tg | ii)) > 0;
  }
  get deletedAcross() {
    return (this.delInfo & ii) > 0;
  }
}
class Re {
  constructor(e, t = !1) {
    if (((this.ranges = e), (this.inverted = t), !e.length && Re.empty)) return Re.empty;
  }
  recover(e) {
    let t = 0,
      o = jh(e);
    if (!this.inverted)
      for (let r = 0; r < o; r++) t += this.ranges[r * 3 + 2] - this.ranges[r * 3 + 1];
    return this.ranges[o * 3] + t + BM(e);
  }
  mapResult(e, t = 1) {
    return this._map(e, t, !1);
  }
  map(e, t = 1) {
    return this._map(e, t, !0);
  }
  _map(e, t, o) {
    let r = 0,
      i = this.inverted ? 2 : 1,
      s = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? r : 0);
      if (a > e) break;
      let c = this.ranges[l + i],
        d = this.ranges[l + s],
        h = a + c;
      if (e <= h) {
        let p = c ? (e == a ? -1 : e == h ? 1 : t) : t,
          f = a + r + (p < 0 ? 0 : d);
        if (o) return f;
        let u = e == (t < 0 ? a : h) ? null : PM(l / 3, e - a),
          m = e == a ? tg : e == h ? eg : ii;
        return (t < 0 ? e != a : e != h) && (m |= ng), new Jh(f, m, u);
      }
      r += d - c;
    }
    return o ? e + r : new Jh(e + r, 0, null);
  }
  touches(e, t) {
    let o = 0,
      r = jh(t),
      i = this.inverted ? 2 : 1,
      s = this.inverted ? 1 : 2;
    for (let l = 0; l < this.ranges.length; l += 3) {
      let a = this.ranges[l] - (this.inverted ? o : 0);
      if (a > e) break;
      let c = this.ranges[l + i],
        d = a + c;
      if (e <= d && l == r * 3) return !0;
      o += this.ranges[l + s] - c;
    }
    return !1;
  }
  forEach(e) {
    let t = this.inverted ? 2 : 1,
      o = this.inverted ? 1 : 2;
    for (let r = 0, i = 0; r < this.ranges.length; r += 3) {
      let s = this.ranges[r],
        l = s - (this.inverted ? i : 0),
        a = s + (this.inverted ? 0 : i),
        c = this.ranges[r + t],
        d = this.ranges[r + o];
      e(l, l + c, a, a + d), (i += d - c);
    }
  }
  invert() {
    return new Re(this.ranges, !this.inverted);
  }
  toString() {
    return (this.inverted ? "-" : "") + JSON.stringify(this.ranges);
  }
  static offset(e) {
    return e == 0 ? Re.empty : new Re(e < 0 ? [0, -e, 0] : [0, 0, e]);
  }
}
Re.empty = new Re([]);
const tl = Object.create(null);
class ue {
  getMap() {
    return Re.empty;
  }
  merge(e) {
    return null;
  }
  static fromJSON(e, t) {
    if (!t || !t.stepType) throw new RangeError("Invalid input for Step.fromJSON");
    let o = tl[t.stepType];
    if (!o) throw new RangeError(`No step type ${t.stepType} defined`);
    return o.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in tl) throw new RangeError("Duplicate use of step JSON ID " + e);
    return (tl[e] = t), (t.prototype.jsonID = e), t;
  }
}
class X {
  constructor(e, t) {
    (this.doc = e), (this.failed = t);
  }
  static ok(e) {
    return new X(e, null);
  }
  static fail(e) {
    return new X(null, e);
  }
  static fromReplace(e, t, o, r) {
    try {
      return X.ok(e.replace(t, o, r));
    } catch (i) {
      if (i instanceof TM) return X.fail(i.message);
      throw i;
    }
  }
}
function mc(n, e, t) {
  let o = [];
  for (let r = 0; r < n.childCount; r++) {
    let i = n.child(r);
    i.content.size && (i = i.copy(mc(i.content, e, i))), i.isInline && (i = e(i, t, r)), o.push(i);
  }
  return C.fromArray(o);
}
class Ut extends ue {
  constructor(e, t, o) {
    super(), (this.from = e), (this.to = t), (this.mark = o);
  }
  apply(e) {
    let t = e.slice(this.from, this.to),
      o = e.resolve(this.from),
      r = o.node(o.sharedDepth(this.to)),
      i = new I(
        mc(
          t.content,
          (s, l) =>
            !s.isAtom || !l.type.allowsMarkType(this.mark.type)
              ? s
              : s.mark(this.mark.addToSet(s.marks)),
          r,
        ),
        t.openStart,
        t.openEnd,
      );
    return X.fromReplace(e, this.from, this.to, i);
  }
  invert() {
    return new Gt(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return (t.deleted && o.deleted) || t.pos >= o.pos ? null : new Ut(t.pos, o.pos, this.mark);
  }
  merge(e) {
    return e instanceof Ut && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from
      ? new Ut(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark)
      : null;
  }
  toJSON() {
    return { stepType: "addMark", mark: this.mark.toJSON(), from: this.from, to: this.to };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for AddMarkStep.fromJSON");
    return new Ut(t.from, t.to, e.markFromJSON(t.mark));
  }
}
ue.jsonID("addMark", Ut);
class Gt extends ue {
  constructor(e, t, o) {
    super(), (this.from = e), (this.to = t), (this.mark = o);
  }
  apply(e) {
    let t = e.slice(this.from, this.to),
      o = new I(
        mc(t.content, (r) => r.mark(this.mark.removeFromSet(r.marks)), e),
        t.openStart,
        t.openEnd,
      );
    return X.fromReplace(e, this.from, this.to, o);
  }
  invert() {
    return new Ut(this.from, this.to, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return (t.deleted && o.deleted) || t.pos >= o.pos ? null : new Gt(t.pos, o.pos, this.mark);
  }
  merge(e) {
    return e instanceof Gt && e.mark.eq(this.mark) && this.from <= e.to && this.to >= e.from
      ? new Gt(Math.min(this.from, e.from), Math.max(this.to, e.to), this.mark)
      : null;
  }
  toJSON() {
    return { stepType: "removeMark", mark: this.mark.toJSON(), from: this.from, to: this.to };
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for RemoveMarkStep.fromJSON");
    return new Gt(t.from, t.to, e.markFromJSON(t.mark));
  }
}
ue.jsonID("removeMark", Gt);
class Yt extends ue {
  constructor(e, t) {
    super(), (this.pos = e), (this.mark = t);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return X.fail("No node at mark step's position");
    let o = t.type.create(t.attrs, null, this.mark.addToSet(t.marks));
    return X.fromReplace(e, this.pos, this.pos + 1, new I(C.from(o), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    if (t) {
      let o = this.mark.addToSet(t.marks);
      if (o.length == t.marks.length) {
        for (let r = 0; r < t.marks.length; r++)
          if (!t.marks[r].isInSet(o)) return new Yt(this.pos, t.marks[r]);
        return new Yt(this.pos, this.mark);
      }
    }
    return new mr(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new Yt(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "addNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for AddNodeMarkStep.fromJSON");
    return new Yt(t.pos, e.markFromJSON(t.mark));
  }
}
ue.jsonID("addNodeMark", Yt);
class mr extends ue {
  constructor(e, t) {
    super(), (this.pos = e), (this.mark = t);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return X.fail("No node at mark step's position");
    let o = t.type.create(t.attrs, null, this.mark.removeFromSet(t.marks));
    return X.fromReplace(e, this.pos, this.pos + 1, new I(C.from(o), 0, t.isLeaf ? 0 : 1));
  }
  invert(e) {
    let t = e.nodeAt(this.pos);
    return !t || !this.mark.isInSet(t.marks) ? this : new Yt(this.pos, this.mark);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new mr(t.pos, this.mark);
  }
  toJSON() {
    return { stepType: "removeNodeMark", pos: this.pos, mark: this.mark.toJSON() };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number")
      throw new RangeError("Invalid input for RemoveNodeMarkStep.fromJSON");
    return new mr(t.pos, e.markFromJSON(t.mark));
  }
}
ue.jsonID("removeNodeMark", mr);
class Ae extends ue {
  constructor(e, t, o, r = !1) {
    super(), (this.from = e), (this.to = t), (this.slice = o), (this.structure = r);
  }
  apply(e) {
    return this.structure && ka(e, this.from, this.to)
      ? X.fail("Structure replace would overwrite content")
      : X.fromReplace(e, this.from, this.to, this.slice);
  }
  getMap() {
    return new Re([this.from, this.to - this.from, this.slice.size]);
  }
  invert(e) {
    return new Ae(this.from, this.from + this.slice.size, e.slice(this.from, this.to));
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1);
    return t.deletedAcross && o.deletedAcross
      ? null
      : new Ae(t.pos, Math.max(t.pos, o.pos), this.slice);
  }
  merge(e) {
    if (!(e instanceof Ae) || e.structure || this.structure) return null;
    if (this.from + this.slice.size == e.from && !this.slice.openEnd && !e.slice.openStart) {
      let t =
        this.slice.size + e.slice.size == 0
          ? I.empty
          : new I(
              this.slice.content.append(e.slice.content),
              this.slice.openStart,
              e.slice.openEnd,
            );
      return new Ae(this.from, this.to + (e.to - e.from), t, this.structure);
    } else if (e.to == this.from && !this.slice.openStart && !e.slice.openEnd) {
      let t =
        this.slice.size + e.slice.size == 0
          ? I.empty
          : new I(
              e.slice.content.append(this.slice.content),
              e.slice.openStart,
              this.slice.openEnd,
            );
      return new Ae(e.from, this.to, t, this.structure);
    } else return null;
  }
  toJSON() {
    let e = { stepType: "replace", from: this.from, to: this.to };
    return (
      this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e
    );
  }
  static fromJSON(e, t) {
    if (typeof t.from != "number" || typeof t.to != "number")
      throw new RangeError("Invalid input for ReplaceStep.fromJSON");
    return new Ae(t.from, t.to, I.fromJSON(e, t.slice), !!t.structure);
  }
}
ue.jsonID("replace", Ae);
class Ne extends ue {
  constructor(e, t, o, r, i, s, l = !1) {
    super(),
      (this.from = e),
      (this.to = t),
      (this.gapFrom = o),
      (this.gapTo = r),
      (this.slice = i),
      (this.insert = s),
      (this.structure = l);
  }
  apply(e) {
    if (this.structure && (ka(e, this.from, this.gapFrom) || ka(e, this.gapTo, this.to)))
      return X.fail("Structure gap-replace would overwrite content");
    let t = e.slice(this.gapFrom, this.gapTo);
    if (t.openStart || t.openEnd) return X.fail("Gap is not a flat range");
    let o = this.slice.insertAt(this.insert, t.content);
    return o ? X.fromReplace(e, this.from, this.to, o) : X.fail("Content does not fit in gap");
  }
  getMap() {
    return new Re([
      this.from,
      this.gapFrom - this.from,
      this.insert,
      this.gapTo,
      this.to - this.gapTo,
      this.slice.size - this.insert,
    ]);
  }
  invert(e) {
    let t = this.gapTo - this.gapFrom;
    return new Ne(
      this.from,
      this.from + this.slice.size + t,
      this.from + this.insert,
      this.from + this.insert + t,
      e.slice(this.from, this.to).removeBetween(this.gapFrom - this.from, this.gapTo - this.from),
      this.gapFrom - this.from,
      this.structure,
    );
  }
  map(e) {
    let t = e.mapResult(this.from, 1),
      o = e.mapResult(this.to, -1),
      r = e.map(this.gapFrom, -1),
      i = e.map(this.gapTo, 1);
    return (t.deletedAcross && o.deletedAcross) || r < t.pos || i > o.pos
      ? null
      : new Ne(t.pos, o.pos, r, i, this.slice, this.insert, this.structure);
  }
  toJSON() {
    let e = {
      stepType: "replaceAround",
      from: this.from,
      to: this.to,
      gapFrom: this.gapFrom,
      gapTo: this.gapTo,
      insert: this.insert,
    };
    return (
      this.slice.size && (e.slice = this.slice.toJSON()), this.structure && (e.structure = !0), e
    );
  }
  static fromJSON(e, t) {
    if (
      typeof t.from != "number" ||
      typeof t.to != "number" ||
      typeof t.gapFrom != "number" ||
      typeof t.gapTo != "number" ||
      typeof t.insert != "number"
    )
      throw new RangeError("Invalid input for ReplaceAroundStep.fromJSON");
    return new Ne(
      t.from,
      t.to,
      t.gapFrom,
      t.gapTo,
      I.fromJSON(e, t.slice),
      t.insert,
      !!t.structure,
    );
  }
}
ue.jsonID("replaceAround", Ne);
function ka(n, e, t) {
  let o = n.resolve(e),
    r = t - e,
    i = o.depth;
  for (; r > 0 && i > 0 && o.indexAfter(i) == o.node(i).childCount; ) i--, r--;
  if (r > 0) {
    let s = o.node(i).maybeChild(o.indexAfter(i));
    for (; r > 0; ) {
      if (!s || s.isLeaf) return !0;
      (s = s.firstChild), r--;
    }
  }
  return !1;
}
function FM(n, e, t) {
  return (e == 0 || n.canReplace(e, n.childCount)) && (t == n.childCount || n.canReplace(0, t));
}
function mo(n) {
  let e = n.parent.content.cutByIndex(n.startIndex, n.endIndex);
  for (let t = n.depth; ; --t) {
    let o = n.$from.node(t),
      r = n.$from.index(t),
      i = n.$to.indexAfter(t);
    if (t < n.depth && o.canReplace(r, i, e)) return t;
    if (t == 0 || o.type.spec.isolating || !FM(o, r, i)) break;
  }
  return null;
}
function gc(n, e, t = null, o = n) {
  let r = VM(n, e),
    i = r && jM(o, e);
  return i ? r.map(Lh).concat({ type: e, attrs: t }).concat(i.map(Lh)) : null;
}
function Lh(n) {
  return { type: n, attrs: null };
}
function VM(n, e) {
  let { parent: t, startIndex: o, endIndex: r } = n,
    i = t.contentMatchAt(o).findWrapping(e);
  if (!i) return null;
  let s = i.length ? i[0] : e;
  return t.canReplaceWith(o, r, s) ? i : null;
}
function jM(n, e) {
  let { parent: t, startIndex: o, endIndex: r } = n,
    i = t.child(o),
    s = e.contentMatch.findWrapping(i.type);
  if (!s) return null;
  let l = (s.length ? s[s.length - 1] : e).contentMatch;
  for (let a = o; l && a < r; a++) l = l.matchType(t.child(a).type);
  return !l || !l.validEnd ? null : s;
}
function Xn(n, e, t = 1, o) {
  let r = n.resolve(e),
    i = r.depth - t,
    s = (o && o[o.length - 1]) || r.parent;
  if (
    i < 0 ||
    r.parent.type.spec.isolating ||
    !r.parent.canReplace(r.index(), r.parent.childCount) ||
    !s.type.validContent(r.parent.content.cutByIndex(r.index(), r.parent.childCount))
  )
    return !1;
  for (let c = r.depth - 1, d = t - 2; c > i; c--, d--) {
    let h = r.node(c),
      p = r.index(c);
    if (h.type.spec.isolating) return !1;
    let f = h.content.cutByIndex(p, h.childCount),
      u = o && o[d + 1];
    u && (f = f.replaceChild(0, u.type.create(u.attrs)));
    let m = (o && o[d]) || h;
    if (!h.canReplace(p + 1, h.childCount) || !m.type.validContent(f)) return !1;
  }
  let l = r.indexAfter(i),
    a = o && o[0];
  return r.node(i).canReplaceWith(l, l, a ? a.type : r.node(i + 1).type);
}
function Dt(n, e) {
  let t = n.resolve(e),
    o = t.index();
  return og(t.nodeBefore, t.nodeAfter) && t.parent.canReplace(o, o + 1);
}
function og(n, e) {
  return !!(n && e && !n.isLeaf && n.canAppend(e));
}
function ss(n, e, t = -1) {
  let o = n.resolve(e);
  for (let r = o.depth; ; r--) {
    let i,
      s,
      l = o.index(r);
    if (
      (r == o.depth
        ? ((i = o.nodeBefore), (s = o.nodeAfter))
        : t > 0
          ? ((i = o.node(r + 1)), l++, (s = o.node(r).maybeChild(l)))
          : ((i = o.node(r).maybeChild(l - 1)), (s = o.node(r + 1))),
      i && !i.isTextblock && og(i, s) && o.node(r).canReplace(l, l + 1))
    )
      return e;
    if (r == 0) break;
    e = t < 0 ? o.before(r) : o.after(r);
  }
}
function yc(n, e, t = e, o = I.empty) {
  if (e == t && !o.size) return null;
  let r = n.resolve(e),
    i = n.resolve(t);
  return JM(r, i, o) ? new Ae(e, t, o) : new LM(r, i, o).fit();
}
function JM(n, e, t) {
  return (
    !t.openStart &&
    !t.openEnd &&
    n.start() == e.start() &&
    n.parent.canReplace(n.index(), e.index(), t.content)
  );
}
class LM {
  constructor(e, t, o) {
    (this.$from = e),
      (this.$to = t),
      (this.unplaced = o),
      (this.frontier = []),
      (this.placed = C.empty);
    for (let r = 0; r <= e.depth; r++) {
      let i = e.node(r);
      this.frontier.push({ type: i.type, match: i.contentMatchAt(e.indexAfter(r)) });
    }
    for (let r = e.depth; r > 0; r--) this.placed = C.from(e.node(r).copy(this.placed));
  }
  get depth() {
    return this.frontier.length - 1;
  }
  fit() {
    for (; this.unplaced.size; ) {
      let c = this.findFittable();
      c ? this.placeNodes(c) : this.openMore() || this.dropNode();
    }
    let e = this.mustMoveInline(),
      t = this.placed.size - this.depth - this.$from.depth,
      o = this.$from,
      r = this.close(e < 0 ? this.$to : o.doc.resolve(e));
    if (!r) return null;
    let i = this.placed,
      s = o.depth,
      l = r.depth;
    for (; s && l && i.childCount == 1; ) (i = i.firstChild.content), s--, l--;
    let a = new I(i, s, l);
    return e > -1
      ? new Ne(o.pos, e, this.$to.pos, this.$to.end(), a, t)
      : a.size || o.pos != this.$to.pos
        ? new Ae(o.pos, r.pos, a)
        : null;
  }
  findFittable() {
    let e = this.unplaced.openStart;
    for (let t = this.unplaced.content, o = 0, r = this.unplaced.openEnd; o < e; o++) {
      let i = t.firstChild;
      if ((t.childCount > 1 && (r = 0), i.type.spec.isolating && r <= o)) {
        e = o;
        break;
      }
      t = i.content;
    }
    for (let t = 1; t <= 2; t++)
      for (let o = t == 1 ? e : this.unplaced.openStart; o >= 0; o--) {
        let r,
          i = null;
        o
          ? ((i = nl(this.unplaced.content, o - 1).firstChild), (r = i.content))
          : (r = this.unplaced.content);
        let s = r.firstChild;
        for (let l = this.depth; l >= 0; l--) {
          let { type: a, match: c } = this.frontier[l],
            d,
            h = null;
          if (
            t == 1 &&
            (s
              ? c.matchType(s.type) || (h = c.fillBefore(C.from(s), !1))
              : i && a.compatibleContent(i.type))
          )
            return { sliceDepth: o, frontierDepth: l, parent: i, inject: h };
          if (t == 2 && s && (d = c.findWrapping(s.type)))
            return { sliceDepth: o, frontierDepth: l, parent: i, wrap: d };
          if (i && c.matchType(i.type)) break;
        }
      }
  }
  openMore() {
    let { content: e, openStart: t, openEnd: o } = this.unplaced,
      r = nl(e, t);
    return !r.childCount || r.firstChild.isLeaf
      ? !1
      : ((this.unplaced = new I(e, t + 1, Math.max(o, r.size + t >= e.size - o ? t + 1 : 0))), !0);
  }
  dropNode() {
    let { content: e, openStart: t, openEnd: o } = this.unplaced,
      r = nl(e, t);
    if (r.childCount <= 1 && t > 0) {
      let i = e.size - t <= t + r.size;
      this.unplaced = new I(jo(e, t - 1, 1), t - 1, i ? t - 1 : o);
    } else this.unplaced = new I(jo(e, t, 1), t, o);
  }
  placeNodes({ sliceDepth: e, frontierDepth: t, parent: o, inject: r, wrap: i }) {
    for (; this.depth > t; ) this.closeFrontierNode();
    if (i) for (let m = 0; m < i.length; m++) this.openFrontierNode(i[m]);
    let s = this.unplaced,
      l = o ? o.content : s.content,
      a = s.openStart - e,
      c = 0,
      d = [],
      { match: h, type: p } = this.frontier[t];
    if (r) {
      for (let m = 0; m < r.childCount; m++) d.push(r.child(m));
      h = h.matchFragment(r);
    }
    let f = l.size + e - (s.content.size - s.openEnd);
    for (; c < l.childCount; ) {
      let m = l.child(c),
        g = h.matchType(m.type);
      if (!g) break;
      c++,
        (c > 1 || a == 0 || m.content.size) &&
          ((h = g),
          d.push(rg(m.mark(p.allowedMarks(m.marks)), c == 1 ? a : 0, c == l.childCount ? f : -1)));
    }
    let u = c == l.childCount;
    u || (f = -1),
      (this.placed = Jo(this.placed, t, C.from(d))),
      (this.frontier[t].match = h),
      u &&
        f < 0 &&
        o &&
        o.type == this.frontier[this.depth].type &&
        this.frontier.length > 1 &&
        this.closeFrontierNode();
    for (let m = 0, g = l; m < f; m++) {
      let y = g.lastChild;
      this.frontier.push({ type: y.type, match: y.contentMatchAt(y.childCount) }), (g = y.content);
    }
    this.unplaced = u
      ? e == 0
        ? I.empty
        : new I(jo(s.content, e - 1, 1), e - 1, f < 0 ? s.openEnd : e - 1)
      : new I(jo(s.content, e, c), s.openStart, s.openEnd);
  }
  mustMoveInline() {
    if (!this.$to.parent.isTextblock) return -1;
    let e = this.frontier[this.depth],
      t;
    if (
      !e.type.isTextblock ||
      !ol(this.$to, this.$to.depth, e.type, e.match, !1) ||
      (this.$to.depth == this.depth && (t = this.findCloseLevel(this.$to)) && t.depth == this.depth)
    )
      return -1;
    let { depth: o } = this.$to,
      r = this.$to.after(o);
    for (; o > 1 && r == this.$to.end(--o); ) ++r;
    return r;
  }
  findCloseLevel(e) {
    e: for (let t = Math.min(this.depth, e.depth); t >= 0; t--) {
      let { match: o, type: r } = this.frontier[t],
        i = t < e.depth && e.end(t + 1) == e.pos + (e.depth - (t + 1)),
        s = ol(e, t, r, o, i);
      if (s) {
        for (let l = t - 1; l >= 0; l--) {
          let { match: a, type: c } = this.frontier[l],
            d = ol(e, l, c, a, !0);
          if (!d || d.childCount) continue e;
        }
        return { depth: t, fit: s, move: i ? e.doc.resolve(e.after(t + 1)) : e };
      }
    }
  }
  close(e) {
    let t = this.findCloseLevel(e);
    if (!t) return null;
    for (; this.depth > t.depth; ) this.closeFrontierNode();
    t.fit.childCount && (this.placed = Jo(this.placed, t.depth, t.fit)), (e = t.move);
    for (let o = t.depth + 1; o <= e.depth; o++) {
      let r = e.node(o),
        i = r.type.contentMatch.fillBefore(r.content, !0, e.index(o));
      this.openFrontierNode(r.type, r.attrs, i);
    }
    return e;
  }
  openFrontierNode(e, t = null, o) {
    let r = this.frontier[this.depth];
    (r.match = r.match.matchType(e)),
      (this.placed = Jo(this.placed, this.depth, C.from(e.create(t, o)))),
      this.frontier.push({ type: e, match: e.contentMatch });
  }
  closeFrontierNode() {
    let e = this.frontier.pop().match.fillBefore(C.empty, !0);
    e.childCount && (this.placed = Jo(this.placed, this.frontier.length, e));
  }
}
function jo(n, e, t) {
  return e == 0
    ? n.cutByIndex(t, n.childCount)
    : n.replaceChild(0, n.firstChild.copy(jo(n.firstChild.content, e - 1, t)));
}
function Jo(n, e, t) {
  return e == 0
    ? n.append(t)
    : n.replaceChild(n.childCount - 1, n.lastChild.copy(Jo(n.lastChild.content, e - 1, t)));
}
function nl(n, e) {
  for (let t = 0; t < e; t++) n = n.firstChild.content;
  return n;
}
function rg(n, e, t) {
  if (e <= 0) return n;
  let o = n.content;
  return (
    e > 1 && (o = o.replaceChild(0, rg(o.firstChild, e - 1, o.childCount == 1 ? t - 1 : 0))),
    e > 0 &&
      ((o = n.type.contentMatch.fillBefore(o).append(o)),
      t <= 0 && (o = o.append(n.type.contentMatch.matchFragment(o).fillBefore(C.empty, !0)))),
    n.copy(o)
  );
}
function ol(n, e, t, o, r) {
  let i = n.node(e),
    s = r ? n.indexAfter(e) : n.index(e);
  if (s == i.childCount && !t.compatibleContent(i.type)) return null;
  let l = o.fillBefore(i.content, !0, s);
  return l && !qM(t, i.content, s) ? l : null;
}
function qM(n, e, t) {
  for (let o = t; o < e.childCount; o++) if (!n.allowsMarks(e.child(o).marks)) return !0;
  return !1;
}
class er extends ue {
  constructor(e, t, o) {
    super(), (this.pos = e), (this.attr = t), (this.value = o);
  }
  apply(e) {
    let t = e.nodeAt(this.pos);
    if (!t) return X.fail("No node at attribute step's position");
    let o = Object.create(null);
    for (let i in t.attrs) o[i] = t.attrs[i];
    o[this.attr] = this.value;
    let r = t.type.create(o, null, t.marks);
    return X.fromReplace(e, this.pos, this.pos + 1, new I(C.from(r), 0, t.isLeaf ? 0 : 1));
  }
  getMap() {
    return Re.empty;
  }
  invert(e) {
    return new er(this.pos, this.attr, e.nodeAt(this.pos).attrs[this.attr]);
  }
  map(e) {
    let t = e.mapResult(this.pos, 1);
    return t.deletedAfter ? null : new er(t.pos, this.attr, this.value);
  }
  toJSON() {
    return { stepType: "attr", pos: this.pos, attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.pos != "number" || typeof t.attr != "string")
      throw new RangeError("Invalid input for AttrStep.fromJSON");
    return new er(t.pos, t.attr, t.value);
  }
}
ue.jsonID("attr", er);
class Ji extends ue {
  constructor(e, t) {
    super(), (this.attr = e), (this.value = t);
  }
  apply(e) {
    let t = Object.create(null);
    for (let r in e.attrs) t[r] = e.attrs[r];
    t[this.attr] = this.value;
    let o = e.type.create(t, e.content, e.marks);
    return X.ok(o);
  }
  getMap() {
    return Re.empty;
  }
  invert(e) {
    return new Ji(this.attr, e.attrs[this.attr]);
  }
  map(e) {
    return this;
  }
  toJSON() {
    return { stepType: "docAttr", attr: this.attr, value: this.value };
  }
  static fromJSON(e, t) {
    if (typeof t.attr != "string") throw new RangeError("Invalid input for DocAttrStep.fromJSON");
    return new Ji(t.attr, t.value);
  }
}
ue.jsonID("docAttr", Ji);
let gr = class extends Error {};
gr = function n(e) {
  let t = Error.call(this, e);
  return (t.__proto__ = n.prototype), t;
};
gr.prototype = Object.create(Error.prototype);
gr.prototype.constructor = gr;
gr.prototype.name = "TransformError";
const rl = Object.create(null);
class W {
  constructor(e, t, o) {
    (this.$anchor = e), (this.$head = t), (this.ranges = o || [new KM(e.min(t), e.max(t))]);
  }
  get anchor() {
    return this.$anchor.pos;
  }
  get head() {
    return this.$head.pos;
  }
  get from() {
    return this.$from.pos;
  }
  get to() {
    return this.$to.pos;
  }
  get $from() {
    return this.ranges[0].$from;
  }
  get $to() {
    return this.ranges[0].$to;
  }
  get empty() {
    let e = this.ranges;
    for (let t = 0; t < e.length; t++) if (e[t].$from.pos != e[t].$to.pos) return !1;
    return !0;
  }
  content() {
    return this.$from.doc.slice(this.from, this.to, !0);
  }
  replace(e, t = I.empty) {
    let o = t.content.lastChild,
      r = null;
    for (let l = 0; l < t.openEnd; l++) (r = o), (o = o.lastChild);
    let i = e.steps.length,
      s = this.ranges;
    for (let l = 0; l < s.length; l++) {
      let { $from: a, $to: c } = s[l],
        d = e.mapping.slice(i);
      e.replaceRange(d.map(a.pos), d.map(c.pos), l ? I.empty : t),
        l == 0 && Wh(e, i, (o ? o.isInline : r && r.isTextblock) ? -1 : 1);
    }
  }
  replaceWith(e, t) {
    let o = e.steps.length,
      r = this.ranges;
    for (let i = 0; i < r.length; i++) {
      let { $from: s, $to: l } = r[i],
        a = e.mapping.slice(o),
        c = a.map(s.pos),
        d = a.map(l.pos);
      i ? e.deleteRange(c, d) : (e.replaceRangeWith(c, d, t), Wh(e, o, t.isInline ? -1 : 1));
    }
  }
  static findFrom(e, t, o = !1) {
    let r = e.parent.inlineContent ? new U(e) : Ln(e.node(0), e.parent, e.pos, e.index(), t, o);
    if (r) return r;
    for (let i = e.depth - 1; i >= 0; i--) {
      let s =
        t < 0
          ? Ln(e.node(0), e.node(i), e.before(i + 1), e.index(i), t, o)
          : Ln(e.node(0), e.node(i), e.after(i + 1), e.index(i) + 1, t, o);
      if (s) return s;
    }
    return null;
  }
  static near(e, t = 1) {
    return this.findFrom(e, t) || this.findFrom(e, -t) || new Ze(e.node(0));
  }
  static atStart(e) {
    return Ln(e, e, 0, 0, 1) || new Ze(e);
  }
  static atEnd(e) {
    return Ln(e, e, e.content.size, e.childCount, -1) || new Ze(e);
  }
  static fromJSON(e, t) {
    if (!t || !t.type) throw new RangeError("Invalid input for Selection.fromJSON");
    let o = rl[t.type];
    if (!o) throw new RangeError(`No selection type ${t.type} defined`);
    return o.fromJSON(e, t);
  }
  static jsonID(e, t) {
    if (e in rl) throw new RangeError("Duplicate use of selection JSON ID " + e);
    return (rl[e] = t), (t.prototype.jsonID = e), t;
  }
  getBookmark() {
    return U.between(this.$anchor, this.$head).getBookmark();
  }
}
W.prototype.visible = !0;
class KM {
  constructor(e, t) {
    (this.$from = e), (this.$to = t);
  }
}
let qh = !1;
function Kh(n) {
  !qh &&
    !n.parent.inlineContent &&
    ((qh = !0),
    console.warn(
      "TextSelection endpoint not pointing into a node with inline content (" +
        n.parent.type.name +
        ")",
    ));
}
class U extends W {
  constructor(e, t = e) {
    Kh(e), Kh(t), super(e, t);
  }
  get $cursor() {
    return this.$anchor.pos == this.$head.pos ? this.$head : null;
  }
  map(e, t) {
    let o = e.resolve(t.map(this.head));
    if (!o.parent.inlineContent) return W.near(o);
    let r = e.resolve(t.map(this.anchor));
    return new U(r.parent.inlineContent ? r : o, o);
  }
  replace(e, t = I.empty) {
    if ((super.replace(e, t), t == I.empty)) {
      let o = this.$from.marksAcross(this.$to);
      o && e.ensureMarks(o);
    }
  }
  eq(e) {
    return e instanceof U && e.anchor == this.anchor && e.head == this.head;
  }
  getBookmark() {
    return new ls(this.anchor, this.head);
  }
  toJSON() {
    return { type: "text", anchor: this.anchor, head: this.head };
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number" || typeof t.head != "number")
      throw new RangeError("Invalid input for TextSelection.fromJSON");
    return new U(e.resolve(t.anchor), e.resolve(t.head));
  }
  static create(e, t, o = t) {
    let r = e.resolve(t);
    return new this(r, o == t ? r : e.resolve(o));
  }
  static between(e, t, o) {
    let r = e.pos - t.pos;
    if (((!o || r) && (o = r >= 0 ? 1 : -1), !t.parent.inlineContent)) {
      let i = W.findFrom(t, o, !0) || W.findFrom(t, -o, !0);
      if (i) t = i.$head;
      else return W.near(t, o);
    }
    return (
      e.parent.inlineContent ||
        (r == 0
          ? (e = t)
          : ((e = (W.findFrom(e, -o, !0) || W.findFrom(e, o, !0)).$anchor),
            e.pos < t.pos != r < 0 && (e = t))),
      new U(e, t)
    );
  }
}
W.jsonID("text", U);
class ls {
  constructor(e, t) {
    (this.anchor = e), (this.head = t);
  }
  map(e) {
    return new ls(e.map(this.anchor), e.map(this.head));
  }
  resolve(e) {
    return U.between(e.resolve(this.anchor), e.resolve(this.head));
  }
}
class H extends W {
  constructor(e) {
    let t = e.nodeAfter,
      o = e.node(0).resolve(e.pos + t.nodeSize);
    super(e, o), (this.node = t);
  }
  map(e, t) {
    let { deleted: o, pos: r } = t.mapResult(this.anchor),
      i = e.resolve(r);
    return o ? W.near(i) : new H(i);
  }
  content() {
    return new I(C.from(this.node), 0, 0);
  }
  eq(e) {
    return e instanceof H && e.anchor == this.anchor;
  }
  toJSON() {
    return { type: "node", anchor: this.anchor };
  }
  getBookmark() {
    return new kc(this.anchor);
  }
  static fromJSON(e, t) {
    if (typeof t.anchor != "number")
      throw new RangeError("Invalid input for NodeSelection.fromJSON");
    return new H(e.resolve(t.anchor));
  }
  static create(e, t) {
    return new H(e.resolve(t));
  }
  static isSelectable(e) {
    return !e.isText && e.type.spec.selectable !== !1;
  }
}
H.prototype.visible = !1;
W.jsonID("node", H);
class kc {
  constructor(e) {
    this.anchor = e;
  }
  map(e) {
    let { deleted: t, pos: o } = e.mapResult(this.anchor);
    return t ? new ls(o, o) : new kc(o);
  }
  resolve(e) {
    let t = e.resolve(this.anchor),
      o = t.nodeAfter;
    return o && H.isSelectable(o) ? new H(t) : W.near(t);
  }
}
class Ze extends W {
  constructor(e) {
    super(e.resolve(0), e.resolve(e.content.size));
  }
  replace(e, t = I.empty) {
    if (t == I.empty) {
      e.delete(0, e.doc.content.size);
      let o = W.atStart(e.doc);
      o.eq(e.selection) || e.setSelection(o);
    } else super.replace(e, t);
  }
  toJSON() {
    return { type: "all" };
  }
  static fromJSON(e) {
    return new Ze(e);
  }
  map(e) {
    return new Ze(e);
  }
  eq(e) {
    return e instanceof Ze;
  }
  getBookmark() {
    return WM;
  }
}
W.jsonID("all", Ze);
const WM = {
  map() {
    return this;
  },
  resolve(n) {
    return new Ze(n);
  },
};
function Ln(n, e, t, o, r, i = !1) {
  if (e.inlineContent) return U.create(n, t);
  for (let s = o - (r > 0 ? 0 : 1); r > 0 ? s < e.childCount : s >= 0; s += r) {
    let l = e.child(s);
    if (l.isAtom) {
      if (!i && H.isSelectable(l)) return H.create(n, t - (r < 0 ? l.nodeSize : 0));
    } else {
      let a = Ln(n, l, t + r, r < 0 ? l.childCount : 0, r, i);
      if (a) return a;
    }
    t += l.nodeSize * r;
  }
  return null;
}
function Wh(n, e, t) {
  let o = n.steps.length - 1;
  if (o < e) return;
  let r = n.steps[o];
  if (!(r instanceof Ae || r instanceof Ne)) return;
  let i = n.mapping.maps[o],
    s;
  i.forEach((l, a, c, d) => {
    s == null && (s = d);
  }),
    n.setSelection(W.near(n.doc.resolve(s), t));
}
function Hh(n, e) {
  return !e || !n ? n : n.bind(e);
}
class Wr {
  constructor(e, t, o) {
    (this.name = e), (this.init = Hh(t.init, o)), (this.apply = Hh(t.apply, o));
  }
}
new Wr("doc", {
  init(n) {
    return n.doc || n.schema.topNodeType.createAndFill();
  },
  apply(n) {
    return n.doc;
  },
}),
  new Wr("selection", {
    init(n, e) {
      return n.selection || W.atStart(e.doc);
    },
    apply(n) {
      return n.selection;
    },
  }),
  new Wr("storedMarks", {
    init(n) {
      return n.storedMarks || null;
    },
    apply(n, e, t, o) {
      return o.selection.$cursor ? n.storedMarks : null;
    },
  }),
  new Wr("scrollToSelection", {
    init() {
      return 0;
    },
    apply(n, e) {
      return n.scrolledIntoView ? e + 1 : e;
    },
  });
function ig(n, e, t) {
  for (let o in n) {
    let r = n[o];
    r instanceof Function ? (r = r.bind(e)) : o == "handleDOMEvents" && (r = ig(r, e, {})),
      (t[o] = r);
  }
  return t;
}
class Ar {
  constructor(e) {
    (this.spec = e),
      (this.props = {}),
      e.props && ig(e.props, this, this.props),
      (this.key = e.key ? e.key.key : sg("plugin"));
  }
  getState(e) {
    return e[this.key];
  }
}
const il = Object.create(null);
function sg(n) {
  return n in il ? n + "$" + ++il[n] : ((il[n] = 0), n + "$");
}
class Ir {
  constructor(e = "key") {
    this.key = sg(e);
  }
  get(e) {
    return e.config.pluginsByKey[this.key];
  }
  getState(e) {
    return e[this.key];
  }
}
const HM = (n, e) =>
  n.selection.empty ? !1 : (e && e(n.tr.deleteSelection().scrollIntoView()), !0);
function lg(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("backward", n) : t.parentOffset > 0) ? null : t;
}
const UM = (n, e, t) => {
    let o = lg(n, t);
    if (!o) return !1;
    let r = wc(o);
    if (!r) {
      let s = o.blockRange(),
        l = s && mo(s);
      return l == null ? !1 : (e && e(n.tr.lift(s, l).scrollIntoView()), !0);
    }
    let i = r.nodeBefore;
    if (!i.type.spec.isolating && hg(n, r, e)) return !0;
    if (o.parent.content.size == 0 && (ro(i, "end") || H.isSelectable(i))) {
      let s = yc(n.doc, o.before(), o.after(), I.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let l = n.tr.step(s);
          l.setSelection(
            ro(i, "end")
              ? W.findFrom(l.doc.resolve(l.mapping.map(r.pos, -1)), -1)
              : H.create(l.doc, r.pos - i.nodeSize),
          ),
            e(l.scrollIntoView());
        }
        return !0;
      }
    }
    return i.isAtom && r.depth == o.depth - 1
      ? (e && e(n.tr.delete(r.pos - i.nodeSize, r.pos).scrollIntoView()), !0)
      : !1;
  },
  GM = (n, e, t) => {
    let o = lg(n, t);
    if (!o) return !1;
    let r = wc(o);
    return r ? ag(n, r, e) : !1;
  },
  YM = (n, e, t) => {
    let o = cg(n, t);
    if (!o) return !1;
    let r = bc(o);
    return r ? ag(n, r, e) : !1;
  };
function ag(n, e, t) {
  let o = e.nodeBefore,
    r = o,
    i = e.pos - 1;
  for (; !r.isTextblock; i--) {
    if (r.type.spec.isolating) return !1;
    let d = r.lastChild;
    if (!d) return !1;
    r = d;
  }
  let s = e.nodeAfter,
    l = s,
    a = e.pos + 1;
  for (; !l.isTextblock; a++) {
    if (l.type.spec.isolating) return !1;
    let d = l.firstChild;
    if (!d) return !1;
    l = d;
  }
  let c = yc(n.doc, i, a, I.empty);
  if (!c || c.from != i || (c instanceof Ae && c.slice.size >= a - i)) return !1;
  if (t) {
    let d = n.tr.step(c);
    d.setSelection(U.create(d.doc, i)), t(d.scrollIntoView());
  }
  return !0;
}
function ro(n, e, t = !1) {
  for (let o = n; o; o = e == "start" ? o.firstChild : o.lastChild) {
    if (o.isTextblock) return !0;
    if (t && o.childCount != 1) return !1;
  }
  return !1;
}
const XM = (n, e, t) => {
  let { $head: o, empty: r } = n.selection,
    i = o;
  if (!r) return !1;
  if (o.parent.isTextblock) {
    if (t ? !t.endOfTextblock("backward", n) : o.parentOffset > 0) return !1;
    i = wc(o);
  }
  let s = i && i.nodeBefore;
  return !s || !H.isSelectable(s)
    ? !1
    : (e && e(n.tr.setSelection(H.create(n.doc, i.pos - s.nodeSize)).scrollIntoView()), !0);
};
function wc(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      if (n.index(e) > 0) return n.doc.resolve(n.before(e + 1));
      if (n.node(e).type.spec.isolating) break;
    }
  return null;
}
function cg(n, e) {
  let { $cursor: t } = n.selection;
  return !t || (e ? !e.endOfTextblock("forward", n) : t.parentOffset < t.parent.content.size)
    ? null
    : t;
}
const QM = (n, e, t) => {
    let o = cg(n, t);
    if (!o) return !1;
    let r = bc(o);
    if (!r) return !1;
    let i = r.nodeAfter;
    if (hg(n, r, e)) return !0;
    if (o.parent.content.size == 0 && (ro(i, "start") || H.isSelectable(i))) {
      let s = yc(n.doc, o.before(), o.after(), I.empty);
      if (s && s.slice.size < s.to - s.from) {
        if (e) {
          let l = n.tr.step(s);
          l.setSelection(
            ro(i, "start")
              ? W.findFrom(l.doc.resolve(l.mapping.map(r.pos)), 1)
              : H.create(l.doc, l.mapping.map(r.pos)),
          ),
            e(l.scrollIntoView());
        }
        return !0;
      }
    }
    return i.isAtom && r.depth == o.depth - 1
      ? (e && e(n.tr.delete(r.pos, r.pos + i.nodeSize).scrollIntoView()), !0)
      : !1;
  },
  ZM = (n, e, t) => {
    let { $head: o, empty: r } = n.selection,
      i = o;
    if (!r) return !1;
    if (o.parent.isTextblock) {
      if (t ? !t.endOfTextblock("forward", n) : o.parentOffset < o.parent.content.size) return !1;
      i = bc(o);
    }
    let s = i && i.nodeAfter;
    return !s || !H.isSelectable(s)
      ? !1
      : (e && e(n.tr.setSelection(H.create(n.doc, i.pos)).scrollIntoView()), !0);
  };
function bc(n) {
  if (!n.parent.type.spec.isolating)
    for (let e = n.depth - 1; e >= 0; e--) {
      let t = n.node(e);
      if (n.index(e) + 1 < t.childCount) return n.doc.resolve(n.after(e + 1));
      if (t.type.spec.isolating) break;
    }
  return null;
}
const _M = (n, e) => {
    let t = n.selection,
      o = t instanceof H,
      r;
    if (o) {
      if (t.node.isTextblock || !Dt(n.doc, t.from)) return !1;
      r = t.from;
    } else if (((r = ss(n.doc, t.from, -1)), r == null)) return !1;
    if (e) {
      let i = n.tr.join(r);
      o && i.setSelection(H.create(i.doc, r - n.doc.resolve(r).nodeBefore.nodeSize)),
        e(i.scrollIntoView());
    }
    return !0;
  },
  eC = (n, e) => {
    let t = n.selection,
      o;
    if (t instanceof H) {
      if (t.node.isTextblock || !Dt(n.doc, t.to)) return !1;
      o = t.to;
    } else if (((o = ss(n.doc, t.to, 1)), o == null)) return !1;
    return e && e(n.tr.join(o).scrollIntoView()), !0;
  },
  tC = (n, e) => {
    let { $from: t, $to: o } = n.selection,
      r = t.blockRange(o),
      i = r && mo(r);
    return i == null ? !1 : (e && e(n.tr.lift(r, i).scrollIntoView()), !0);
  },
  nC = (n, e) => {
    let { $head: t, $anchor: o } = n.selection;
    return !t.parent.type.spec.code || !t.sameParent(o)
      ? !1
      : (e &&
          e(
            n.tr
              .insertText(
                `
`,
              )
              .scrollIntoView(),
          ),
        !0);
  };
function dg(n) {
  for (let e = 0; e < n.edgeCount; e++) {
    let { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs()) return t;
  }
  return null;
}
const oC = (n, e) => {
    let { $head: t, $anchor: o } = n.selection;
    if (!t.parent.type.spec.code || !t.sameParent(o)) return !1;
    let r = t.node(-1),
      i = t.indexAfter(-1),
      s = dg(r.contentMatchAt(i));
    if (!s || !r.canReplaceWith(i, i, s)) return !1;
    if (e) {
      let l = t.after(),
        a = n.tr.replaceWith(l, l, s.createAndFill());
      a.setSelection(W.near(a.doc.resolve(l), 1)), e(a.scrollIntoView());
    }
    return !0;
  },
  rC = (n, e) => {
    let t = n.selection,
      { $from: o, $to: r } = t;
    if (t instanceof Ze || o.parent.inlineContent || r.parent.inlineContent) return !1;
    let i = dg(r.parent.contentMatchAt(r.indexAfter()));
    if (!i || !i.isTextblock) return !1;
    if (e) {
      let s = (!o.parentOffset && r.index() < r.parent.childCount ? o : r).pos,
        l = n.tr.insert(s, i.createAndFill());
      l.setSelection(U.create(l.doc, s + 1)), e(l.scrollIntoView());
    }
    return !0;
  },
  iC = (n, e) => {
    let { $cursor: t } = n.selection;
    if (!t || t.parent.content.size) return !1;
    if (t.depth > 1 && t.after() != t.end(-1)) {
      let i = t.before();
      if (Xn(n.doc, i)) return e && e(n.tr.split(i).scrollIntoView()), !0;
    }
    let o = t.blockRange(),
      r = o && mo(o);
    return r == null ? !1 : (e && e(n.tr.lift(o, r).scrollIntoView()), !0);
  },
  sC = (n, e) => {
    let { $from: t, to: o } = n.selection,
      r,
      i = t.sharedDepth(o);
    return i == 0 ? !1 : ((r = t.before(i)), e && e(n.tr.setSelection(H.create(n.doc, r))), !0);
  };
function lC(n, e, t) {
  let o = e.nodeBefore,
    r = e.nodeAfter,
    i = e.index();
  return !o || !r || !o.type.compatibleContent(r.type)
    ? !1
    : !o.content.size && e.parent.canReplace(i - 1, i)
      ? (t && t(n.tr.delete(e.pos - o.nodeSize, e.pos).scrollIntoView()), !0)
      : !e.parent.canReplace(i, i + 1) || !(r.isTextblock || Dt(n.doc, e.pos))
        ? !1
        : (t &&
            t(
              n.tr
                .clearIncompatible(e.pos, o.type, o.contentMatchAt(o.childCount))
                .join(e.pos)
                .scrollIntoView(),
            ),
          !0);
}
function hg(n, e, t) {
  let o = e.nodeBefore,
    r = e.nodeAfter,
    i,
    s;
  if (o.type.spec.isolating || r.type.spec.isolating) return !1;
  if (lC(n, e, t)) return !0;
  let l = e.parent.canReplace(e.index(), e.index() + 1);
  if (
    l &&
    (i = (s = o.contentMatchAt(o.childCount)).findWrapping(r.type)) &&
    s.matchType(i[0] || r.type).validEnd
  ) {
    if (t) {
      let h = e.pos + r.nodeSize,
        p = C.empty;
      for (let m = i.length - 1; m >= 0; m--) p = C.from(i[m].create(null, p));
      p = C.from(o.copy(p));
      let f = n.tr.step(new Ne(e.pos - 1, h, e.pos, h, new I(p, 1, 0), i.length, !0)),
        u = h + 2 * i.length;
      Dt(f.doc, u) && f.join(u), t(f.scrollIntoView());
    }
    return !0;
  }
  let a = W.findFrom(e, 1),
    c = a && a.$from.blockRange(a.$to),
    d = c && mo(c);
  if (d != null && d >= e.depth) return t && t(n.tr.lift(c, d).scrollIntoView()), !0;
  if (l && ro(r, "start", !0) && ro(o, "end")) {
    let h = o,
      p = [];
    for (; p.push(h), !h.isTextblock; ) h = h.lastChild;
    let f = r,
      u = 1;
    for (; !f.isTextblock; f = f.firstChild) u++;
    if (h.canReplace(h.childCount, h.childCount, f.content)) {
      if (t) {
        let m = C.empty;
        for (let y = p.length - 1; y >= 0; y--) m = C.from(p[y].copy(m));
        let g = n.tr.step(
          new Ne(
            e.pos - p.length,
            e.pos + r.nodeSize,
            e.pos + u,
            e.pos + r.nodeSize - u,
            new I(m, p.length, 0),
            0,
            !0,
          ),
        );
        t(g.scrollIntoView());
      }
      return !0;
    }
  }
  return !1;
}
function pg(n) {
  return function (e, t) {
    let o = e.selection,
      r = n < 0 ? o.$from : o.$to,
      i = r.depth;
    for (; r.node(i).isInline; ) {
      if (!i) return !1;
      i--;
    }
    return r.node(i).isTextblock
      ? (t && t(e.tr.setSelection(U.create(e.doc, n < 0 ? r.start(i) : r.end(i)))), !0)
      : !1;
  };
}
const aC = pg(-1),
  cC = pg(1);
function dC(n, e = null) {
  return function (t, o) {
    let { $from: r, $to: i } = t.selection,
      s = r.blockRange(i),
      l = s && gc(s, n, e);
    return l ? (o && o(t.tr.wrap(s, l).scrollIntoView()), !0) : !1;
  };
}
function Uh(n, e = null) {
  return function (t, o) {
    let r = !1;
    for (let i = 0; i < t.selection.ranges.length && !r; i++) {
      let {
        $from: { pos: s },
        $to: { pos: l },
      } = t.selection.ranges[i];
      t.doc.nodesBetween(s, l, (a, c) => {
        if (r) return !1;
        if (!(!a.isTextblock || a.hasMarkup(n, e)))
          if (a.type == n) r = !0;
          else {
            let d = t.doc.resolve(c),
              h = d.index();
            r = d.parent.canReplaceWith(h, h + 1, n);
          }
      });
    }
    if (!r) return !1;
    if (o) {
      let i = t.tr;
      for (let s = 0; s < t.selection.ranges.length; s++) {
        let {
          $from: { pos: l },
          $to: { pos: a },
        } = t.selection.ranges[s];
        i.setBlockType(l, a, n, e);
      }
      o(i.scrollIntoView());
    }
    return !0;
  };
}
typeof navigator < "u"
  ? /Mac|iP(hone|[oa]d)/.test(navigator.platform)
  : typeof os < "u" && os.platform && os.platform() == "darwin";
function hC(n, e = null) {
  return function (t, o) {
    let { $from: r, $to: i } = t.selection,
      s = r.blockRange(i),
      l = !1,
      a = s;
    if (!s) return !1;
    if (s.depth >= 2 && r.node(s.depth - 1).type.compatibleContent(n) && s.startIndex == 0) {
      if (r.index(s.depth - 1) == 0) return !1;
      let d = t.doc.resolve(s.start - 2);
      (a = new ya(d, d, s.depth)),
        s.endIndex < s.parent.childCount && (s = new ya(r, t.doc.resolve(i.end(s.depth)), s.depth)),
        (l = !0);
    }
    let c = gc(a, n, e, s);
    return c ? (o && o(pC(t.tr, s, c, l, n).scrollIntoView()), !0) : !1;
  };
}
function pC(n, e, t, o, r) {
  let i = C.empty;
  for (let d = t.length - 1; d >= 0; d--) i = C.from(t[d].type.create(t[d].attrs, i));
  n.step(new Ne(e.start - (o ? 2 : 0), e.end, e.start, e.end, new I(i, 0, 0), t.length, !0));
  let s = 0;
  for (let d = 0; d < t.length; d++) t[d].type == r && (s = d + 1);
  let l = t.length - s,
    a = e.start + t.length - (o ? 2 : 0),
    c = e.parent;
  for (let d = e.startIndex, h = e.endIndex, p = !0; d < h; d++, p = !1)
    !p && Xn(n.doc, a, l) && (n.split(a, l), (a += 2 * l)), (a += c.child(d).nodeSize);
  return n;
}
function fC(n) {
  return function (e, t) {
    let { $from: o, $to: r } = e.selection,
      i = o.blockRange(r, (s) => s.childCount > 0 && s.firstChild.type == n);
    return i ? (t ? (o.node(i.depth - 1).type == n ? uC(e, t, n, i) : mC(e, t, i)) : !0) : !1;
  };
}
function uC(n, e, t, o) {
  let r = n.tr,
    i = o.end,
    s = o.$to.end(o.depth);
  i < s &&
    (r.step(new Ne(i - 1, s, i, s, new I(C.from(t.create(null, o.parent.copy())), 1, 0), 1, !0)),
    (o = new ya(r.doc.resolve(o.$from.pos), r.doc.resolve(s), o.depth)));
  const l = mo(o);
  if (l == null) return !1;
  r.lift(o, l);
  let a = r.mapping.map(i, -1) - 1;
  return Dt(r.doc, a) && r.join(a), e(r.scrollIntoView()), !0;
}
function mC(n, e, t) {
  let o = n.tr,
    r = t.parent;
  for (let f = t.end, u = t.endIndex - 1, m = t.startIndex; u > m; u--)
    (f -= r.child(u).nodeSize), o.delete(f - 1, f + 1);
  let i = o.doc.resolve(t.start),
    s = i.nodeAfter;
  if (o.mapping.map(t.end) != t.start + i.nodeAfter.nodeSize) return !1;
  let l = t.startIndex == 0,
    a = t.endIndex == r.childCount,
    c = i.node(-1),
    d = i.index(-1);
  if (!c.canReplace(d + (l ? 0 : 1), d + 1, s.content.append(a ? C.empty : C.from(r)))) return !1;
  let h = i.pos,
    p = h + s.nodeSize;
  return (
    o.step(
      new Ne(
        h - (l ? 1 : 0),
        p + (a ? 1 : 0),
        h + 1,
        p - 1,
        new I(
          (l ? C.empty : C.from(r.copy(C.empty))).append(a ? C.empty : C.from(r.copy(C.empty))),
          l ? 0 : 1,
          a ? 0 : 1,
        ),
        l ? 0 : 1,
      ),
    ),
    e(o.scrollIntoView()),
    !0
  );
}
function gC(n) {
  return function (e, t) {
    let { $from: o, $to: r } = e.selection,
      i = o.blockRange(r, (c) => c.childCount > 0 && c.firstChild.type == n);
    if (!i) return !1;
    let s = i.startIndex;
    if (s == 0) return !1;
    let l = i.parent,
      a = l.child(s - 1);
    if (a.type != n) return !1;
    if (t) {
      let c = a.lastChild && a.lastChild.type == l.type,
        d = C.from(c ? n.create() : null),
        h = new I(C.from(n.create(null, C.from(l.type.create(null, d)))), c ? 3 : 1, 0),
        p = i.start,
        f = i.end;
      t(e.tr.step(new Ne(p - (c ? 3 : 1), f, p, f, h, 1, !0)).scrollIntoView());
    }
    return !0;
  };
}
function fg(n) {
  const { state: e, transaction: t } = n;
  let { selection: o } = t,
    { doc: r } = t,
    { storedMarks: i } = t;
  return {
    ...e,
    apply: e.apply.bind(e),
    applyTransaction: e.applyTransaction.bind(e),
    plugins: e.plugins,
    schema: e.schema,
    reconfigure: e.reconfigure.bind(e),
    toJSON: e.toJSON.bind(e),
    get storedMarks() {
      return i;
    },
    get selection() {
      return o;
    },
    get doc() {
      return r;
    },
    get tr() {
      return (o = t.selection), (r = t.doc), (i = t.storedMarks), t;
    },
  };
}
class yC {
  constructor(e) {
    (this.editor = e.editor),
      (this.rawCommands = this.editor.extensionManager.commands),
      (this.customState = e.state);
  }
  get hasCustomState() {
    return !!this.customState;
  }
  get state() {
    return this.customState || this.editor.state;
  }
  get commands() {
    const { rawCommands: e, editor: t, state: o } = this,
      { view: r } = t,
      { tr: i } = o,
      s = this.buildProps(i);
    return Object.fromEntries(
      Object.entries(e).map(([l, a]) => [
        l,
        (...c) => {
          const d = a(...c)(s);
          return !i.getMeta("preventDispatch") && !this.hasCustomState && r.dispatch(i), d;
        },
      ]),
    );
  }
  get chain() {
    return () => this.createChain();
  }
  get can() {
    return () => this.createCan();
  }
  createChain(e, t = !0) {
    const { rawCommands: o, editor: r, state: i } = this,
      { view: s } = r,
      l = [],
      a = !!e,
      c = e || i.tr,
      d = () => (
        !a && t && !c.getMeta("preventDispatch") && !this.hasCustomState && s.dispatch(c),
        l.every((p) => p === !0)
      ),
      h = {
        ...Object.fromEntries(
          Object.entries(o).map(([p, f]) => [
            p,
            (...u) => {
              const m = this.buildProps(c, t),
                g = f(...u)(m);
              return l.push(g), h;
            },
          ]),
        ),
        run: d,
      };
    return h;
  }
  createCan(e) {
    const { rawCommands: t, state: o } = this,
      r = !1,
      i = e || o.tr,
      s = this.buildProps(i, r);
    return {
      ...Object.fromEntries(
        Object.entries(t).map(([l, a]) => [l, (...c) => a(...c)({ ...s, dispatch: void 0 })]),
      ),
      chain: () => this.createChain(i, r),
    };
  }
  buildProps(e, t = !0) {
    const { rawCommands: o, editor: r, state: i } = this,
      { view: s } = r,
      l = {
        tr: e,
        editor: r,
        view: s,
        state: fg({ state: i, transaction: e }),
        dispatch: t ? () => {} : void 0,
        chain: () => this.createChain(e, t),
        can: () => this.createCan(e),
        get commands() {
          return Object.fromEntries(Object.entries(o).map(([a, c]) => [a, (...d) => c(...d)(l)]));
        },
      };
    return l;
  }
}
function _(n, e, t) {
  return n.config[e] === void 0 && n.parent
    ? _(n.parent, e, t)
    : typeof n.config[e] == "function"
      ? n.config[e].bind({ ...t, parent: n.parent ? _(n.parent, e, t) : null })
      : n.config[e];
}
function kC(n) {
  const e = n.filter((r) => r.type === "extension"),
    t = n.filter((r) => r.type === "node"),
    o = n.filter((r) => r.type === "mark");
  return { baseExtensions: e, nodeExtensions: t, markExtensions: o };
}
function de(n, e) {
  if (typeof n == "string") {
    if (!e.nodes[n])
      throw Error(`There is no node type named '${n}'. Maybe you forgot to add the extension?`);
    return e.nodes[n];
  }
  return n;
}
function Sn(...n) {
  return n
    .filter((e) => !!e)
    .reduce((e, t) => {
      const o = { ...e };
      return (
        Object.entries(t).forEach(([r, i]) => {
          if (!o[r]) {
            o[r] = i;
            return;
          }
          if (r === "class") {
            const s = i ? i.split(" ") : [],
              l = o[r] ? o[r].split(" ") : [],
              a = s.filter((c) => !l.includes(c));
            o[r] = [...l, ...a].join(" ");
          } else r === "style" ? (o[r] = [o[r], i].join("; ")) : (o[r] = i);
        }),
        o
      );
    }, {});
}
function wC(n) {
  return typeof n == "function";
}
function Q(n, e = void 0, ...t) {
  return wC(n) ? (e ? n.bind(e)(...t) : n(...t)) : n;
}
function bC(n) {
  return Object.prototype.toString.call(n) === "[object RegExp]";
}
class ug {
  constructor(e) {
    (this.find = e.find), (this.handler = e.handler);
  }
}
class vC {
  constructor(e) {
    (this.find = e.find), (this.handler = e.handler);
  }
}
function xC(n) {
  return Object.prototype.toString.call(n).slice(8, -1);
}
function sl(n) {
  return xC(n) !== "Object"
    ? !1
    : n.constructor === Object && Object.getPrototypeOf(n) === Object.prototype;
}
function as(n, e) {
  const t = { ...n };
  return (
    sl(n) &&
      sl(e) &&
      Object.keys(e).forEach((o) => {
        sl(e[o])
          ? o in n
            ? (t[o] = as(n[o], e[o]))
            : Object.assign(t, { [o]: e[o] })
          : Object.assign(t, { [o]: e[o] });
      }),
    t
  );
}
class ht {
  constructor(e = {}) {
    (this.type = "extension"),
      (this.name = "extension"),
      (this.parent = null),
      (this.child = null),
      (this.config = { name: this.name, defaultOptions: {} }),
      (this.config = { ...this.config, ...e }),
      (this.name = this.config.name),
      e.defaultOptions &&
        Object.keys(e.defaultOptions).length > 0 &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`,
        ),
      (this.options = this.config.defaultOptions),
      this.config.addOptions && (this.options = Q(_(this, "addOptions", { name: this.name }))),
      (this.storage = Q(_(this, "addStorage", { name: this.name, options: this.options })) || {});
  }
  static create(e = {}) {
    return new ht(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return (
      (t.options = as(this.options, e)),
      (t.storage = Q(_(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
  extend(e = {}) {
    const t = new ht({ ...this.config, ...e });
    return (
      (t.parent = this),
      (this.child = t),
      (t.name = e.name ? e.name : t.parent.name),
      e.defaultOptions &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`,
        ),
      (t.options = Q(_(t, "addOptions", { name: t.name }))),
      (t.storage = Q(_(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
}
function SC(n, e, t) {
  const { from: o, to: r } = e,
    {
      blockSeparator: i = `

`,
      textSerializers: s = {},
    } = t || {};
  let l = "",
    a = !0;
  return (
    n.nodesBetween(o, r, (c, d, h, p) => {
      var f;
      const u = s == null ? void 0 : s[c.type.name];
      u
        ? (c.isBlock && !a && ((l += i), (a = !0)),
          h && (l += u({ node: c, pos: d, parent: h, index: p, range: e })))
        : c.isText
          ? ((l +=
              (f = c == null ? void 0 : c.text) === null || f === void 0
                ? void 0
                : f.slice(Math.max(o, d) - d, r - d)),
            (a = !1))
          : c.isBlock && !a && ((l += i), (a = !0));
    }),
    l
  );
}
function $C(n) {
  return Object.fromEntries(
    Object.entries(n.nodes)
      .filter(([, e]) => e.spec.toText)
      .map(([e, t]) => [e, t.spec.toText]),
  );
}
ht.create({
  name: "clipboardTextSerializer",
  addProseMirrorPlugins() {
    return [
      new Ar({
        key: new Ir("clipboardTextSerializer"),
        props: {
          clipboardTextSerializer: () => {
            const { editor: n } = this,
              { state: e, schema: t } = n,
              { doc: o, selection: r } = e,
              { ranges: i } = r,
              s = Math.min(...i.map((c) => c.$from.pos)),
              l = Math.max(...i.map((c) => c.$to.pos)),
              a = $C(t);
            return SC(o, { from: s, to: l }, { textSerializers: a });
          },
        },
      }),
    ];
  },
});
const MC =
    () =>
    ({ editor: n, view: e }) => (
      requestAnimationFrame(() => {
        var t;
        n.isDestroyed ||
          (e.dom.blur(),
          (t = window == null ? void 0 : window.getSelection()) === null ||
            t === void 0 ||
            t.removeAllRanges());
      }),
      !0
    ),
  CC =
    (n = !1) =>
    ({ commands: e }) =>
      e.setContent("", n),
  OC =
    () =>
    ({ state: n, tr: e, dispatch: t }) => {
      const { selection: o } = e,
        { ranges: r } = o;
      return (
        t &&
          r.forEach(({ $from: i, $to: s }) => {
            n.doc.nodesBetween(i.pos, s.pos, (l, a) => {
              if (l.type.isText) return;
              const { doc: c, mapping: d } = e,
                h = c.resolve(d.map(a)),
                p = c.resolve(d.map(a + l.nodeSize)),
                f = h.blockRange(p);
              if (!f) return;
              const u = mo(f);
              if (l.type.isTextblock) {
                const { defaultType: m } = h.parent.contentMatchAt(h.index());
                e.setNodeMarkup(f.start, m);
              }
              (u || u === 0) && e.lift(f, u);
            });
          }),
        !0
      );
    },
  NC = (n) => (e) => n(e),
  TC =
    () =>
    ({ state: n, dispatch: e }) =>
      rC(n, e),
  EC =
    (n, e) =>
    ({ editor: t, tr: o }) => {
      const { state: r } = t,
        i = r.doc.slice(n.from, n.to);
      o.deleteRange(n.from, n.to);
      const s = o.mapping.map(e);
      return o.insert(s, i.content), o.setSelection(new U(o.doc.resolve(s - 1))), !0;
    },
  AC =
    () =>
    ({ tr: n, dispatch: e }) => {
      const { selection: t } = n,
        o = t.$anchor.node();
      if (o.content.size > 0) return !1;
      const r = n.selection.$anchor;
      for (let i = r.depth; i > 0; i -= 1)
        if (r.node(i).type === o.type) {
          if (e) {
            const s = r.before(i),
              l = r.after(i);
            n.delete(s, l).scrollIntoView();
          }
          return !0;
        }
      return !1;
    },
  IC =
    (n) =>
    ({ tr: e, state: t, dispatch: o }) => {
      const r = de(n, t.schema),
        i = e.selection.$anchor;
      for (let s = i.depth; s > 0; s -= 1)
        if (i.node(s).type === r) {
          if (o) {
            const l = i.before(s),
              a = i.after(s);
            e.delete(l, a).scrollIntoView();
          }
          return !0;
        }
      return !1;
    },
  DC =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      const { from: o, to: r } = n;
      return t && e.delete(o, r), !0;
    },
  RC =
    () =>
    ({ state: n, dispatch: e }) =>
      HM(n, e),
  zC =
    () =>
    ({ commands: n }) =>
      n.keyboardShortcut("Enter"),
  PC =
    () =>
    ({ state: n, dispatch: e }) =>
      oC(n, e);
function Li(n, e, t = { strict: !0 }) {
  const o = Object.keys(e);
  return o.length
    ? o.every((r) => (t.strict ? e[r] === n[r] : bC(e[r]) ? e[r].test(n[r]) : e[r] === n[r]))
    : !0;
}
function wa(n, e, t = {}) {
  return n.find((o) => o.type === e && Li(o.attrs, t));
}
function BC(n, e, t = {}) {
  return !!wa(n, e, t);
}
function vc(n, e, t = {}) {
  if (!n || !e) return;
  let o = n.parent.childAfter(n.parentOffset);
  if (
    (n.parentOffset === o.offset && o.offset !== 0 && (o = n.parent.childBefore(n.parentOffset)),
    !o.node)
  )
    return;
  const r = wa([...o.node.marks], e, t);
  if (!r) return;
  let i = o.index,
    s = n.start() + o.offset,
    l = i + 1,
    a = s + o.node.nodeSize;
  for (wa([...o.node.marks], e, t); i > 0 && r.isInSet(n.parent.child(i - 1).marks); )
    (i -= 1), (s -= n.parent.child(i).nodeSize);
  for (; l < n.parent.childCount && BC([...n.parent.child(l).marks], e, t); )
    (a += n.parent.child(l).nodeSize), (l += 1);
  return { from: s, to: a };
}
function Rt(n, e) {
  if (typeof n == "string") {
    if (!e.marks[n])
      throw Error(`There is no mark type named '${n}'. Maybe you forgot to add the extension?`);
    return e.marks[n];
  }
  return n;
}
const FC =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      const i = Rt(n, o.schema),
        { doc: s, selection: l } = t,
        { $from: a, from: c, to: d } = l;
      if (r) {
        const h = vc(a, i, e);
        if (h && h.from <= c && h.to >= d) {
          const p = U.create(s, h.from, h.to);
          t.setSelection(p);
        }
      }
      return !0;
    },
  VC = (n) => (e) => {
    const t = typeof n == "function" ? n(e) : n;
    for (let o = 0; o < t.length; o += 1) if (t[o](e)) return !0;
    return !1;
  };
function mg(n) {
  return n instanceof U;
}
function Xt(n = 0, e = 0, t = 0) {
  return Math.min(Math.max(n, e), t);
}
function jC(n, e = null) {
  if (!e) return null;
  const t = W.atStart(n),
    o = W.atEnd(n);
  if (e === "start" || e === !0) return t;
  if (e === "end") return o;
  const r = t.from,
    i = o.to;
  return e === "all"
    ? U.create(n, Xt(0, r, i), Xt(n.content.size, r, i))
    : U.create(n, Xt(e, r, i), Xt(e, r, i));
}
function xc() {
  return (
    ["iPad Simulator", "iPhone Simulator", "iPod Simulator", "iPad", "iPhone", "iPod"].includes(
      navigator.platform,
    ) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}
const JC =
    (n = null, e = {}) =>
    ({ editor: t, view: o, tr: r, dispatch: i }) => {
      e = { scrollIntoView: !0, ...e };
      const s = () => {
        xc() && o.dom.focus(),
          requestAnimationFrame(() => {
            t.isDestroyed ||
              (o.focus(), e != null && e.scrollIntoView && t.commands.scrollIntoView());
          });
      };
      if ((o.hasFocus() && n === null) || n === !1) return !0;
      if (i && n === null && !mg(t.state.selection)) return s(), !0;
      const l = jC(r.doc, n) || t.state.selection,
        a = t.state.selection.eq(l);
      return (
        i && (a || r.setSelection(l), a && r.storedMarks && r.setStoredMarks(r.storedMarks), s()),
        !0
      );
    },
  LC = (n, e) => (t) => n.every((o, r) => e(o, { ...t, index: r })),
  qC =
    (n, e) =>
    ({ tr: t, commands: o }) =>
      o.insertContentAt({ from: t.selection.from, to: t.selection.to }, n, e),
  gg = (n) => {
    const e = n.childNodes;
    for (let t = e.length - 1; t >= 0; t -= 1) {
      const o = e[t];
      o.nodeType === 3 && o.nodeValue && /^(\n\s\s|\n)$/.test(o.nodeValue)
        ? n.removeChild(o)
        : o.nodeType === 1 && gg(o);
    }
    return n;
  };
function Gh(n) {
  const e = `<body>${n}</body>`,
    t = new window.DOMParser().parseFromString(e, "text/html").body;
  return gg(t);
}
function qi(n, e, t) {
  if (((t = { slice: !0, parseOptions: {}, ...t }), typeof n == "object" && n !== null))
    try {
      return Array.isArray(n) && n.length > 0
        ? C.fromArray(n.map((o) => e.nodeFromJSON(o)))
        : e.nodeFromJSON(n);
    } catch (o) {
      return (
        console.warn("[tiptap warn]: Invalid content.", "Passed value:", n, "Error:", o),
        qi("", e, t)
      );
    }
  if (typeof n == "string") {
    const o = Fi.fromSchema(e);
    return t.slice ? o.parseSlice(Gh(n), t.parseOptions).content : o.parse(Gh(n), t.parseOptions);
  }
  return qi("", e, t);
}
function KC(n, e, t) {
  const o = n.steps.length - 1;
  if (o < e) return;
  const r = n.steps[o];
  if (!(r instanceof Ae || r instanceof Ne)) return;
  const i = n.mapping.maps[o];
  let s = 0;
  i.forEach((l, a, c, d) => {
    s === 0 && (s = d);
  }),
    n.setSelection(W.near(n.doc.resolve(s), t));
}
const WC = (n) => n.toString().startsWith("<"),
  HC =
    (n, e, t) =>
    ({ tr: o, dispatch: r, editor: i }) => {
      if (r) {
        t = { parseOptions: {}, updateSelection: !0, ...t };
        const s = qi(e, i.schema, {
          parseOptions: { preserveWhitespace: "full", ...t.parseOptions },
        });
        if (s.toString() === "<>") return !0;
        let { from: l, to: a } =
            typeof n == "number" ? { from: n, to: n } : { from: n.from, to: n.to },
          c = !0,
          d = !0;
        if (
          ((WC(s) ? s : [s]).forEach((h) => {
            h.check(), (c = c ? h.isText && h.marks.length === 0 : !1), (d = d ? h.isBlock : !1);
          }),
          l === a && d)
        ) {
          const { parent: h } = o.doc.resolve(l);
          h.isTextblock && !h.type.spec.code && !h.childCount && ((l -= 1), (a += 1));
        }
        c
          ? Array.isArray(e)
            ? o.insertText(e.map((h) => h.text || "").join(""), l, a)
            : typeof e == "object" && e && e.text
              ? o.insertText(e.text, l, a)
              : o.insertText(e, l, a)
          : o.replaceWith(l, a, s),
          t.updateSelection && KC(o, o.steps.length - 1, -1);
      }
      return !0;
    },
  UC =
    () =>
    ({ state: n, dispatch: e }) =>
      _M(n, e),
  GC =
    () =>
    ({ state: n, dispatch: e }) =>
      eC(n, e),
  YC =
    () =>
    ({ state: n, dispatch: e }) =>
      UM(n, e),
  XC =
    () =>
    ({ state: n, dispatch: e }) =>
      QM(n, e),
  QC =
    () =>
    ({ tr: n, state: e, dispatch: t }) => {
      try {
        const o = ss(e.doc, e.selection.$from.pos, -1);
        return o == null ? !1 : (n.join(o, 2), t && t(n), !0);
      } catch {
        return !1;
      }
    },
  ZC =
    () =>
    ({ state: n, dispatch: e, tr: t }) => {
      try {
        const o = ss(n.doc, n.selection.$from.pos, 1);
        return o == null ? !1 : (t.join(o, 2), e && e(t), !0);
      } catch {
        return !1;
      }
    },
  _C =
    () =>
    ({ state: n, dispatch: e }) =>
      GM(n, e),
  eO =
    () =>
    ({ state: n, dispatch: e }) =>
      YM(n, e);
function Sc() {
  return typeof navigator < "u" ? /Mac/.test(navigator.platform) : !1;
}
function tO(n) {
  const e = n.split(/-(?!$)/);
  let t = e[e.length - 1];
  t === "Space" && (t = " ");
  let o, r, i, s;
  for (let l = 0; l < e.length - 1; l += 1) {
    const a = e[l];
    if (/^(cmd|meta|m)$/i.test(a)) s = !0;
    else if (/^a(lt)?$/i.test(a)) o = !0;
    else if (/^(c|ctrl|control)$/i.test(a)) r = !0;
    else if (/^s(hift)?$/i.test(a)) i = !0;
    else if (/^mod$/i.test(a)) xc() || Sc() ? (s = !0) : (r = !0);
    else throw new Error(`Unrecognized modifier name: ${a}`);
  }
  return (
    o && (t = `Alt-${t}`),
    r && (t = `Ctrl-${t}`),
    s && (t = `Meta-${t}`),
    i && (t = `Shift-${t}`),
    t
  );
}
const nO =
  (n) =>
  ({ editor: e, view: t, tr: o, dispatch: r }) => {
    const i = tO(n).split(/-(?!$)/),
      s = i.find((c) => !["Alt", "Ctrl", "Meta", "Shift"].includes(c)),
      l = new KeyboardEvent("keydown", {
        key: s === "Space" ? " " : s,
        altKey: i.includes("Alt"),
        ctrlKey: i.includes("Ctrl"),
        metaKey: i.includes("Meta"),
        shiftKey: i.includes("Shift"),
        bubbles: !0,
        cancelable: !0,
      }),
      a = e.captureTransaction(() => {
        t.someProp("handleKeyDown", (c) => c(t, l));
      });
    return (
      a == null ||
        a.steps.forEach((c) => {
          const d = c.map(o.mapping);
          d && r && o.maybeStep(d);
        }),
      !0
    );
  };
function $c(n, e, t = {}) {
  const { from: o, to: r, empty: i } = n.selection,
    s = e ? de(e, n.schema) : null,
    l = [];
  n.doc.nodesBetween(o, r, (d, h) => {
    if (d.isText) return;
    const p = Math.max(o, h),
      f = Math.min(r, h + d.nodeSize);
    l.push({ node: d, from: p, to: f });
  });
  const a = r - o,
    c = l
      .filter((d) => (s ? s.name === d.node.type.name : !0))
      .filter((d) => Li(d.node.attrs, t, { strict: !1 }));
  return i ? !!c.length : c.reduce((d, h) => d + h.to - h.from, 0) >= a;
}
const oO =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = de(n, t.schema);
      return $c(t, r, e) ? tC(t, o) : !1;
    },
  rO =
    () =>
    ({ state: n, dispatch: e }) =>
      iC(n, e),
  iO =
    (n) =>
    ({ state: e, dispatch: t }) => {
      const o = de(n, e.schema);
      return fC(o)(e, t);
    },
  sO =
    () =>
    ({ state: n, dispatch: e }) =>
      nC(n, e);
function yg(n, e) {
  return e.nodes[n] ? "node" : e.marks[n] ? "mark" : null;
}
function Yh(n, e) {
  const t = typeof e == "string" ? [e] : e;
  return Object.keys(n).reduce((o, r) => (t.includes(r) || (o[r] = n[r]), o), {});
}
const lO =
    (n, e) =>
    ({ tr: t, state: o, dispatch: r }) => {
      let i = null,
        s = null;
      const l = yg(typeof n == "string" ? n : n.name, o.schema);
      return l
        ? (l === "node" && (i = de(n, o.schema)),
          l === "mark" && (s = Rt(n, o.schema)),
          r &&
            t.selection.ranges.forEach((a) => {
              o.doc.nodesBetween(a.$from.pos, a.$to.pos, (c, d) => {
                i && i === c.type && t.setNodeMarkup(d, void 0, Yh(c.attrs, e)),
                  s &&
                    c.marks.length &&
                    c.marks.forEach((h) => {
                      s === h.type && t.addMark(d, d + c.nodeSize, s.create(Yh(h.attrs, e)));
                    });
              });
            }),
          !0)
        : !1;
    },
  aO =
    () =>
    ({ tr: n, dispatch: e }) => (e && n.scrollIntoView(), !0),
  cO =
    () =>
    ({ tr: n, commands: e }) =>
      e.setTextSelection({ from: 0, to: n.doc.content.size }),
  dO =
    () =>
    ({ state: n, dispatch: e }) =>
      XM(n, e),
  hO =
    () =>
    ({ state: n, dispatch: e }) =>
      ZM(n, e),
  pO =
    () =>
    ({ state: n, dispatch: e }) =>
      sC(n, e),
  fO =
    () =>
    ({ state: n, dispatch: e }) =>
      cC(n, e),
  uO =
    () =>
    ({ state: n, dispatch: e }) =>
      aC(n, e);
function mO(n, e, t = {}) {
  return qi(n, e, { slice: !1, parseOptions: t });
}
const gO =
  (n, e = !1, t = {}) =>
  ({ tr: o, editor: r, dispatch: i }) => {
    const { doc: s } = o,
      l = mO(n, r.schema, t);
    return i && o.replaceWith(0, s.content.size, l).setMeta("preventUpdate", !e), !0;
  };
function yO(n, e) {
  const t = Rt(e, n.schema),
    { from: o, to: r, empty: i } = n.selection,
    s = [];
  i
    ? (n.storedMarks && s.push(...n.storedMarks), s.push(...n.selection.$head.marks()))
    : n.doc.nodesBetween(o, r, (a) => {
        s.push(...a.marks);
      });
  const l = s.find((a) => a.type.name === t.name);
  return l ? { ...l.attrs } : {};
}
function kO(n) {
  for (let e = 0; e < n.edgeCount; e += 1) {
    const { type: t } = n.edge(e);
    if (t.isTextblock && !t.hasRequiredAttrs()) return t;
  }
  return null;
}
function wO(n, e) {
  for (let t = n.depth; t > 0; t -= 1) {
    const o = n.node(t);
    if (e(o)) return { pos: t > 0 ? n.before(t) : 0, start: n.start(t), depth: t, node: o };
  }
}
function Mc(n) {
  return (e) => wO(e.$from, n);
}
function kg(n, e, t) {
  const o = [];
  return (
    n === e
      ? t
          .resolve(n)
          .marks()
          .forEach((r) => {
            const i = t.resolve(n - 1),
              s = vc(i, r.type);
            s && o.push({ mark: r, ...s });
          })
      : t.nodesBetween(n, e, (r, i) => {
          !r ||
            (r == null ? void 0 : r.nodeSize) === void 0 ||
            o.push(...r.marks.map((s) => ({ from: i, to: i + r.nodeSize, mark: s })));
        }),
    o
  );
}
function si(n, e, t) {
  return Object.fromEntries(
    Object.entries(t).filter(([o]) => {
      const r = n.find((i) => i.type === e && i.name === o);
      return r ? r.attribute.keepOnSplit : !1;
    }),
  );
}
function bO(n, e, t = {}) {
  const { empty: o, ranges: r } = n.selection,
    i = e ? Rt(e, n.schema) : null;
  if (o)
    return !!(n.storedMarks || n.selection.$from.marks())
      .filter((d) => (i ? i.name === d.type.name : !0))
      .find((d) => Li(d.attrs, t, { strict: !1 }));
  let s = 0;
  const l = [];
  if (
    (r.forEach(({ $from: d, $to: h }) => {
      const p = d.pos,
        f = h.pos;
      n.doc.nodesBetween(p, f, (u, m) => {
        if (!u.isText && !u.marks.length) return;
        const g = Math.max(p, m),
          y = Math.min(f, m + u.nodeSize),
          w = y - g;
        (s += w), l.push(...u.marks.map((b) => ({ mark: b, from: g, to: y })));
      });
    }),
    s === 0)
  )
    return !1;
  const a = l
      .filter((d) => (i ? i.name === d.mark.type.name : !0))
      .filter((d) => Li(d.mark.attrs, t, { strict: !1 }))
      .reduce((d, h) => d + h.to - h.from, 0),
    c = l
      .filter((d) => (i ? d.mark.type !== i && d.mark.type.excludes(i) : !0))
      .reduce((d, h) => d + h.to - h.from, 0);
  return (a > 0 ? a + c : a) >= s;
}
function Xh(n, e) {
  const { nodeExtensions: t } = kC(e),
    o = t.find((s) => s.name === n);
  if (!o) return !1;
  const r = { name: o.name, options: o.options, storage: o.storage },
    i = Q(_(o, "group", r));
  return typeof i != "string" ? !1 : i.split(" ").includes("list");
}
function vO(n, e, t) {
  var o;
  const { selection: r } = e;
  let i = null;
  if ((mg(r) && (i = r.$cursor), i)) {
    const l = (o = n.storedMarks) !== null && o !== void 0 ? o : i.marks();
    return !!t.isInSet(l) || !l.some((a) => a.type.excludes(t));
  }
  const { ranges: s } = r;
  return s.some(({ $from: l, $to: a }) => {
    let c = l.depth === 0 ? n.doc.inlineContent && n.doc.type.allowsMarkType(t) : !1;
    return (
      n.doc.nodesBetween(l.pos, a.pos, (d, h, p) => {
        if (c) return !1;
        if (d.isInline) {
          const f = !p || p.type.allowsMarkType(t),
            u = !!t.isInSet(d.marks) || !d.marks.some((m) => m.type.excludes(t));
          c = f && u;
        }
        return !c;
      }),
      c
    );
  });
}
const xO =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      const { selection: i } = t,
        { empty: s, ranges: l } = i,
        a = Rt(n, o.schema);
      if (r)
        if (s) {
          const c = yO(o, a);
          t.addStoredMark(a.create({ ...c, ...e }));
        } else
          l.forEach((c) => {
            const d = c.$from.pos,
              h = c.$to.pos;
            o.doc.nodesBetween(d, h, (p, f) => {
              const u = Math.max(f, d),
                m = Math.min(f + p.nodeSize, h);
              p.marks.find((g) => g.type === a)
                ? p.marks.forEach((g) => {
                    a === g.type && t.addMark(u, m, a.create({ ...g.attrs, ...e }));
                  })
                : t.addMark(u, m, a.create(e));
            });
          });
      return vO(o, t, a);
    },
  SO =
    (n, e) =>
    ({ tr: t }) => (t.setMeta(n, e), !0),
  $O =
    (n, e = {}) =>
    ({ state: t, dispatch: o, chain: r }) => {
      const i = de(n, t.schema);
      return i.isTextblock
        ? r()
            .command(({ commands: s }) => (Uh(i, e)(t) ? !0 : s.clearNodes()))
            .command(({ state: s }) => Uh(i, e)(s, o))
            .run()
        : (console.warn('[tiptap warn]: Currently "setNode()" only supports text block nodes.'),
          !1);
    },
  MO =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      if (t) {
        const { doc: o } = e,
          r = Xt(n, 0, o.content.size),
          i = H.create(o, r);
        e.setSelection(i);
      }
      return !0;
    },
  CO =
    (n) =>
    ({ tr: e, dispatch: t }) => {
      if (t) {
        const { doc: o } = e,
          { from: r, to: i } = typeof n == "number" ? { from: n, to: n } : n,
          s = U.atStart(o).from,
          l = U.atEnd(o).to,
          a = Xt(r, s, l),
          c = Xt(i, s, l),
          d = U.create(o, a, c);
        e.setSelection(d);
      }
      return !0;
    },
  OO =
    (n) =>
    ({ state: e, dispatch: t }) => {
      const o = de(n, e.schema);
      return gC(o)(e, t);
    };
function Qh(n, e) {
  const t = n.storedMarks || (n.selection.$to.parentOffset && n.selection.$from.marks());
  if (t) {
    const o = t.filter((r) => (e == null ? void 0 : e.includes(r.type.name)));
    n.tr.ensureMarks(o);
  }
}
const NO =
    ({ keepMarks: n = !0 } = {}) =>
    ({ tr: e, state: t, dispatch: o, editor: r }) => {
      const { selection: i, doc: s } = e,
        { $from: l, $to: a } = i,
        c = r.extensionManager.attributes,
        d = si(c, l.node().type.name, l.node().attrs);
      if (i instanceof H && i.node.isBlock)
        return !l.parentOffset || !Xn(s, l.pos)
          ? !1
          : (o && (n && Qh(t, r.extensionManager.splittableMarks), e.split(l.pos).scrollIntoView()),
            !0);
      if (!l.parent.isBlock) return !1;
      if (o) {
        const h = a.parentOffset === a.parent.content.size;
        i instanceof U && e.deleteSelection();
        const p = l.depth === 0 ? void 0 : kO(l.node(-1).contentMatchAt(l.indexAfter(-1)));
        let f = h && p ? [{ type: p, attrs: d }] : void 0,
          u = Xn(e.doc, e.mapping.map(l.pos), 1, f);
        if (
          (!f &&
            !u &&
            Xn(e.doc, e.mapping.map(l.pos), 1, p ? [{ type: p }] : void 0) &&
            ((u = !0), (f = p ? [{ type: p, attrs: d }] : void 0)),
          u &&
            (e.split(e.mapping.map(l.pos), 1, f),
            p && !h && !l.parentOffset && l.parent.type !== p))
        ) {
          const m = e.mapping.map(l.before()),
            g = e.doc.resolve(m);
          l.node(-1).canReplaceWith(g.index(), g.index() + 1, p) &&
            e.setNodeMarkup(e.mapping.map(l.before()), p);
        }
        n && Qh(t, r.extensionManager.splittableMarks), e.scrollIntoView();
      }
      return !0;
    },
  TO =
    (n) =>
    ({ tr: e, state: t, dispatch: o, editor: r }) => {
      var i;
      const s = de(n, t.schema),
        { $from: l, $to: a } = t.selection,
        c = t.selection.node;
      if ((c && c.isBlock) || l.depth < 2 || !l.sameParent(a)) return !1;
      const d = l.node(-1);
      if (d.type !== s) return !1;
      const h = r.extensionManager.attributes;
      if (l.parent.content.size === 0 && l.node(-1).childCount === l.indexAfter(-1)) {
        if (l.depth === 2 || l.node(-3).type !== s || l.index(-2) !== l.node(-2).childCount - 1)
          return !1;
        if (o) {
          let g = C.empty;
          const y = l.index(-1) ? 1 : l.index(-2) ? 2 : 3;
          for (let R = l.depth - y; R >= l.depth - 3; R -= 1) g = C.from(l.node(R).copy(g));
          const w =
              l.indexAfter(-1) < l.node(-2).childCount
                ? 1
                : l.indexAfter(-2) < l.node(-3).childCount
                  ? 2
                  : 3,
            b = si(h, l.node().type.name, l.node().attrs),
            z =
              ((i = s.contentMatch.defaultType) === null || i === void 0
                ? void 0
                : i.createAndFill(b)) || void 0;
          g = g.append(C.from(s.createAndFill(null, z) || void 0));
          const $ = l.before(l.depth - (y - 1));
          e.replace($, l.after(-w), new I(g, 4 - y, 0));
          let N = -1;
          e.doc.nodesBetween($, e.doc.content.size, (R, G) => {
            if (N > -1) return !1;
            R.isTextblock && R.content.size === 0 && (N = G + 1);
          }),
            N > -1 && e.setSelection(U.near(e.doc.resolve(N))),
            e.scrollIntoView();
        }
        return !0;
      }
      const p = a.pos === l.end() ? d.contentMatchAt(0).defaultType : null,
        f = si(h, d.type.name, d.attrs),
        u = si(h, l.node().type.name, l.node().attrs);
      e.delete(l.pos, a.pos);
      const m = p
        ? [
            { type: s, attrs: f },
            { type: p, attrs: u },
          ]
        : [{ type: s, attrs: f }];
      if (!Xn(e.doc, l.pos, 2)) return !1;
      if (o) {
        const { selection: g, storedMarks: y } = t,
          { splittableMarks: w } = r.extensionManager,
          b = y || (g.$to.parentOffset && g.$from.marks());
        if ((e.split(l.pos, 2, m).scrollIntoView(), !b || !o)) return !0;
        const z = b.filter(($) => w.includes($.type.name));
        e.ensureMarks(z);
      }
      return !0;
    },
  ll = (n, e) => {
    const t = Mc((i) => i.type === e)(n.selection);
    if (!t) return !0;
    const o = n.doc.resolve(Math.max(0, t.pos - 1)).before(t.depth);
    if (o === void 0) return !0;
    const r = n.doc.nodeAt(o);
    return t.node.type === (r == null ? void 0 : r.type) && Dt(n.doc, t.pos) && n.join(t.pos), !0;
  },
  al = (n, e) => {
    const t = Mc((i) => i.type === e)(n.selection);
    if (!t) return !0;
    const o = n.doc.resolve(t.start).after(t.depth);
    if (o === void 0) return !0;
    const r = n.doc.nodeAt(o);
    return t.node.type === (r == null ? void 0 : r.type) && Dt(n.doc, o) && n.join(o), !0;
  },
  EO =
    (n, e, t, o = {}) =>
    ({ editor: r, tr: i, state: s, dispatch: l, chain: a, commands: c, can: d }) => {
      const { extensions: h, splittableMarks: p } = r.extensionManager,
        f = de(n, s.schema),
        u = de(e, s.schema),
        { selection: m, storedMarks: g } = s,
        { $from: y, $to: w } = m,
        b = y.blockRange(w),
        z = g || (m.$to.parentOffset && m.$from.marks());
      if (!b) return !1;
      const $ = Mc((N) => Xh(N.type.name, h))(m);
      if (b.depth >= 1 && $ && b.depth - $.depth <= 1) {
        if ($.node.type === f) return c.liftListItem(u);
        if (Xh($.node.type.name, h) && f.validContent($.node.content) && l)
          return a()
            .command(() => (i.setNodeMarkup($.pos, f), !0))
            .command(() => ll(i, f))
            .command(() => al(i, f))
            .run();
      }
      return !t || !z || !l
        ? a()
            .command(() => (d().wrapInList(f, o) ? !0 : c.clearNodes()))
            .wrapInList(f, o)
            .command(() => ll(i, f))
            .command(() => al(i, f))
            .run()
        : a()
            .command(() => {
              const N = d().wrapInList(f, o),
                R = z.filter((G) => p.includes(G.type.name));
              return i.ensureMarks(R), N ? !0 : c.clearNodes();
            })
            .wrapInList(f, o)
            .command(() => ll(i, f))
            .command(() => al(i, f))
            .run();
    },
  AO =
    (n, e = {}, t = {}) =>
    ({ state: o, commands: r }) => {
      const { extendEmptyMarkRange: i = !1 } = t,
        s = Rt(n, o.schema);
      return bO(o, s, e) ? r.unsetMark(s, { extendEmptyMarkRange: i }) : r.setMark(s, e);
    },
  IO =
    (n, e, t = {}) =>
    ({ state: o, commands: r }) => {
      const i = de(n, o.schema),
        s = de(e, o.schema);
      return $c(o, i, t) ? r.setNode(s) : r.setNode(i, t);
    },
  DO =
    (n, e = {}) =>
    ({ state: t, commands: o }) => {
      const r = de(n, t.schema);
      return $c(t, r, e) ? o.lift(r) : o.wrapIn(r, e);
    },
  RO =
    () =>
    ({ state: n, dispatch: e }) => {
      const t = n.plugins;
      for (let o = 0; o < t.length; o += 1) {
        const r = t[o];
        let i;
        if (r.spec.isInputRules && (i = r.getState(n))) {
          if (e) {
            const s = n.tr,
              l = i.transform;
            for (let a = l.steps.length - 1; a >= 0; a -= 1) s.step(l.steps[a].invert(l.docs[a]));
            if (i.text) {
              const a = s.doc.resolve(i.from).marks();
              s.replaceWith(i.from, i.to, n.schema.text(i.text, a));
            } else s.delete(i.from, i.to);
          }
          return !0;
        }
      }
      return !1;
    },
  zO =
    () =>
    ({ tr: n, dispatch: e }) => {
      const { selection: t } = n,
        { empty: o, ranges: r } = t;
      return (
        o ||
          (e &&
            r.forEach((i) => {
              n.removeMark(i.$from.pos, i.$to.pos);
            })),
        !0
      );
    },
  PO =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      var i;
      const { extendEmptyMarkRange: s = !1 } = e,
        { selection: l } = t,
        a = Rt(n, o.schema),
        { $from: c, empty: d, ranges: h } = l;
      if (!r) return !0;
      if (d && s) {
        let { from: p, to: f } = l;
        const u =
            (i = c.marks().find((g) => g.type === a)) === null || i === void 0 ? void 0 : i.attrs,
          m = vc(c, a, u);
        m && ((p = m.from), (f = m.to)), t.removeMark(p, f, a);
      } else
        h.forEach((p) => {
          t.removeMark(p.$from.pos, p.$to.pos, a);
        });
      return t.removeStoredMark(a), !0;
    },
  BO =
    (n, e = {}) =>
    ({ tr: t, state: o, dispatch: r }) => {
      let i = null,
        s = null;
      const l = yg(typeof n == "string" ? n : n.name, o.schema);
      return l
        ? (l === "node" && (i = de(n, o.schema)),
          l === "mark" && (s = Rt(n, o.schema)),
          r &&
            t.selection.ranges.forEach((a) => {
              const c = a.$from.pos,
                d = a.$to.pos;
              o.doc.nodesBetween(c, d, (h, p) => {
                i && i === h.type && t.setNodeMarkup(p, void 0, { ...h.attrs, ...e }),
                  s &&
                    h.marks.length &&
                    h.marks.forEach((f) => {
                      if (s === f.type) {
                        const u = Math.max(p, c),
                          m = Math.min(p + h.nodeSize, d);
                        t.addMark(u, m, s.create({ ...f.attrs, ...e }));
                      }
                    });
              });
            }),
          !0)
        : !1;
    },
  FO =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = de(n, t.schema);
      return dC(r, e)(t, o);
    },
  VO =
    (n, e = {}) =>
    ({ state: t, dispatch: o }) => {
      const r = de(n, t.schema);
      return hC(r, e)(t, o);
    };
var jO = Object.freeze({
  __proto__: null,
  blur: MC,
  clearContent: CC,
  clearNodes: OC,
  command: NC,
  createParagraphNear: TC,
  cut: EC,
  deleteCurrentNode: AC,
  deleteNode: IC,
  deleteRange: DC,
  deleteSelection: RC,
  enter: zC,
  exitCode: PC,
  extendMarkRange: FC,
  first: VC,
  focus: JC,
  forEach: LC,
  insertContent: qC,
  insertContentAt: HC,
  joinUp: UC,
  joinDown: GC,
  joinBackward: YC,
  joinForward: XC,
  joinItemBackward: QC,
  joinItemForward: ZC,
  joinTextblockBackward: _C,
  joinTextblockForward: eO,
  keyboardShortcut: nO,
  lift: oO,
  liftEmptyBlock: rO,
  liftListItem: iO,
  newlineInCode: sO,
  resetAttributes: lO,
  scrollIntoView: aO,
  selectAll: cO,
  selectNodeBackward: dO,
  selectNodeForward: hO,
  selectParentNode: pO,
  selectTextblockEnd: fO,
  selectTextblockStart: uO,
  setContent: gO,
  setMark: xO,
  setMeta: SO,
  setNode: $O,
  setNodeSelection: MO,
  setTextSelection: CO,
  sinkListItem: OO,
  splitBlock: NO,
  splitListItem: TO,
  toggleList: EO,
  toggleMark: AO,
  toggleNode: IO,
  toggleWrap: DO,
  undoInputRule: RO,
  unsetAllMarks: zO,
  unsetMark: PO,
  updateAttributes: BO,
  wrapIn: FO,
  wrapInList: VO,
});
ht.create({
  name: "commands",
  addCommands() {
    return { ...jO };
  },
});
ht.create({
  name: "editable",
  addProseMirrorPlugins() {
    return [
      new Ar({ key: new Ir("editable"), props: { editable: () => this.editor.options.editable } }),
    ];
  },
});
ht.create({
  name: "focusEvents",
  addProseMirrorPlugins() {
    const { editor: n } = this;
    return [
      new Ar({
        key: new Ir("focusEvents"),
        props: {
          handleDOMEvents: {
            focus: (e, t) => {
              n.isFocused = !0;
              const o = n.state.tr.setMeta("focus", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(o), !1;
            },
            blur: (e, t) => {
              n.isFocused = !1;
              const o = n.state.tr.setMeta("blur", { event: t }).setMeta("addToHistory", !1);
              return e.dispatch(o), !1;
            },
          },
        },
      }),
    ];
  },
});
ht.create({
  name: "keymap",
  addKeyboardShortcuts() {
    const n = () =>
        this.editor.commands.first(({ commands: i }) => [
          () => i.undoInputRule(),
          () =>
            i.command(({ tr: s }) => {
              const { selection: l, doc: a } = s,
                { empty: c, $anchor: d } = l,
                { pos: h, parent: p } = d,
                f = d.parent.isTextblock ? s.doc.resolve(h - 1) : d,
                u = f.parent.type.spec.isolating,
                m = d.pos - d.parentOffset,
                g = u && f.parent.childCount === 1 ? m === d.pos : W.atStart(a).from === h;
              return !c || !g || !p.type.isTextblock || p.textContent.length ? !1 : i.clearNodes();
            }),
          () => i.deleteSelection(),
          () => i.joinBackward(),
          () => i.selectNodeBackward(),
        ]),
      e = () =>
        this.editor.commands.first(({ commands: i }) => [
          () => i.deleteSelection(),
          () => i.deleteCurrentNode(),
          () => i.joinForward(),
          () => i.selectNodeForward(),
        ]),
      t = {
        Enter: () =>
          this.editor.commands.first(({ commands: i }) => [
            () => i.newlineInCode(),
            () => i.createParagraphNear(),
            () => i.liftEmptyBlock(),
            () => i.splitBlock(),
          ]),
        "Mod-Enter": () => this.editor.commands.exitCode(),
        Backspace: n,
        "Mod-Backspace": n,
        "Shift-Backspace": n,
        Delete: e,
        "Mod-Delete": e,
        "Mod-a": () => this.editor.commands.selectAll(),
      },
      o = { ...t },
      r = {
        ...t,
        "Ctrl-h": n,
        "Alt-Backspace": n,
        "Ctrl-d": e,
        "Ctrl-Alt-Backspace": e,
        "Alt-Delete": e,
        "Alt-d": e,
        "Ctrl-a": () => this.editor.commands.selectTextblockStart(),
        "Ctrl-e": () => this.editor.commands.selectTextblockEnd(),
      };
    return xc() || Sc() ? r : o;
  },
  addProseMirrorPlugins() {
    return [
      new Ar({
        key: new Ir("clearDocument"),
        appendTransaction: (n, e, t) => {
          if (!(n.some((h) => h.docChanged) && !e.doc.eq(t.doc))) return;
          const { empty: o, from: r, to: i } = e.selection,
            s = W.atStart(e.doc).from,
            l = W.atEnd(e.doc).to;
          if (
            o ||
            !(r === s && i === l) ||
            t.doc.textBetween(0, t.doc.content.size, " ", " ").length !== 0
          )
            return;
          const a = t.tr,
            c = fg({ state: t, transaction: a }),
            { commands: d } = new yC({ editor: this.editor, state: c });
          if ((d.clearNodes(), !!a.steps.length)) return a;
        },
      }),
    ];
  },
});
ht.create({
  name: "tabindex",
  addProseMirrorPlugins() {
    return [
      new Ar({
        key: new Ir("tabindex"),
        props: { attributes: this.editor.isEditable ? { tabindex: "0" } : {} },
      }),
    ];
  },
});
function io(n) {
  return new ug({
    find: n.find,
    handler: ({ state: e, range: t, match: o }) => {
      const r = Q(n.getAttributes, void 0, o);
      if (r === !1 || r === null) return null;
      const { tr: i } = e,
        s = o[o.length - 1],
        l = o[0];
      if (s) {
        const a = l.search(/\S/),
          c = t.from + l.indexOf(s),
          d = c + s.length;
        if (
          kg(t.from, t.to, e.doc)
            .filter((p) => p.mark.type.excluded.find((f) => f === n.type && f !== p.mark.type))
            .filter((p) => p.to > c).length
        )
          return null;
        d < t.to && i.delete(d, t.to), c > t.from && i.delete(t.from + a, c);
        const h = t.from + a + s.length;
        i.addMark(t.from + a, h, n.type.create(r || {})), i.removeStoredMark(n.type);
      }
    },
  });
}
function JO(n) {
  return new ug({
    find: n.find,
    handler: ({ state: e, range: t, match: o, chain: r }) => {
      const i = Q(n.getAttributes, void 0, o) || {},
        s = e.tr.delete(t.from, t.to),
        l = s.doc.resolve(t.from).blockRange(),
        a = l && gc(l, n.type, i);
      if (!a) return null;
      if ((s.wrap(l, a), n.keepMarks && n.editor)) {
        const { selection: d, storedMarks: h } = e,
          { splittableMarks: p } = n.editor.extensionManager,
          f = h || (d.$to.parentOffset && d.$from.marks());
        if (f) {
          const u = f.filter((m) => p.includes(m.type.name));
          s.ensureMarks(u);
        }
      }
      if (n.keepAttributes) {
        const d =
          n.type.name === "bulletList" || n.type.name === "orderedList" ? "listItem" : "taskList";
        r().updateAttributes(d, i).run();
      }
      const c = s.doc.resolve(t.from - 1).nodeBefore;
      c &&
        c.type === n.type &&
        Dt(s.doc, t.from - 1) &&
        (!n.joinPredicate || n.joinPredicate(o, c)) &&
        s.join(t.from - 1);
    },
  });
}
class pn {
  constructor(e = {}) {
    (this.type = "mark"),
      (this.name = "mark"),
      (this.parent = null),
      (this.child = null),
      (this.config = { name: this.name, defaultOptions: {} }),
      (this.config = { ...this.config, ...e }),
      (this.name = this.config.name),
      e.defaultOptions &&
        Object.keys(e.defaultOptions).length > 0 &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`,
        ),
      (this.options = this.config.defaultOptions),
      this.config.addOptions && (this.options = Q(_(this, "addOptions", { name: this.name }))),
      (this.storage = Q(_(this, "addStorage", { name: this.name, options: this.options })) || {});
  }
  static create(e = {}) {
    return new pn(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return (
      (t.options = as(this.options, e)),
      (t.storage = Q(_(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
  extend(e = {}) {
    const t = new pn({ ...this.config, ...e });
    return (
      (t.parent = this),
      (this.child = t),
      (t.name = e.name ? e.name : t.parent.name),
      e.defaultOptions &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`,
        ),
      (t.options = Q(_(t, "addOptions", { name: t.name }))),
      (t.storage = Q(_(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
  static handleExit({ editor: e, mark: t }) {
    const { tr: o } = e.state,
      r = e.state.selection.$from;
    if (r.pos === r.end()) {
      const i = r.marks();
      if (!i.find((l) => (l == null ? void 0 : l.type.name) === t.name)) return !1;
      const s = i.find((l) => (l == null ? void 0 : l.type.name) === t.name);
      return s && o.removeStoredMark(s), o.insertText(" ", r.pos), e.view.dispatch(o), !0;
    }
    return !1;
  }
}
class fn {
  constructor(e = {}) {
    (this.type = "node"),
      (this.name = "node"),
      (this.parent = null),
      (this.child = null),
      (this.config = { name: this.name, defaultOptions: {} }),
      (this.config = { ...this.config, ...e }),
      (this.name = this.config.name),
      e.defaultOptions &&
        Object.keys(e.defaultOptions).length > 0 &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${this.name}".`,
        ),
      (this.options = this.config.defaultOptions),
      this.config.addOptions && (this.options = Q(_(this, "addOptions", { name: this.name }))),
      (this.storage = Q(_(this, "addStorage", { name: this.name, options: this.options })) || {});
  }
  static create(e = {}) {
    return new fn(e);
  }
  configure(e = {}) {
    const t = this.extend();
    return (
      (t.options = as(this.options, e)),
      (t.storage = Q(_(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
  extend(e = {}) {
    const t = new fn({ ...this.config, ...e });
    return (
      (t.parent = this),
      (this.child = t),
      (t.name = e.name ? e.name : t.parent.name),
      e.defaultOptions &&
        console.warn(
          `[tiptap warn]: BREAKING CHANGE: "defaultOptions" is deprecated. Please use "addOptions" instead. Found in extension: "${t.name}".`,
        ),
      (t.options = Q(_(t, "addOptions", { name: t.name }))),
      (t.storage = Q(_(t, "addStorage", { name: t.name, options: t.options }))),
      t
    );
  }
}
function so(n) {
  return new vC({
    find: n.find,
    handler: ({ state: e, range: t, match: o, pasteEvent: r }) => {
      const i = Q(n.getAttributes, void 0, o, r);
      if (i === !1 || i === null) return null;
      const { tr: s } = e,
        l = o[o.length - 1],
        a = o[0];
      let c = t.to;
      if (l) {
        const d = a.search(/\S/),
          h = t.from + a.indexOf(l),
          p = h + l.length;
        if (
          kg(t.from, t.to, e.doc)
            .filter((f) => f.mark.type.excluded.find((u) => u === n.type && u !== f.mark.type))
            .filter((f) => f.to > h).length
        )
          return null;
        p < t.to && s.delete(p, t.to),
          h > t.from && s.delete(t.from + d, h),
          (c = t.from + d + l.length),
          s.addMark(t.from + d, c, n.type.create(i || {})),
          s.removeStoredMark(n.type);
      }
    },
  });
}
const LO = /^\s*>\s$/,
  qO = fn.create({
    name: "blockquote",
    addOptions() {
      return { HTMLAttributes: {} };
    },
    content: "block+",
    group: "block",
    defining: !0,
    parseHTML() {
      return [{ tag: "blockquote" }];
    },
    renderHTML({ HTMLAttributes: n }) {
      return ["blockquote", Sn(this.options.HTMLAttributes, n), 0];
    },
    addCommands() {
      return {
        setBlockquote:
          () =>
          ({ commands: n }) =>
            n.wrapIn(this.name),
        toggleBlockquote:
          () =>
          ({ commands: n }) =>
            n.toggleWrap(this.name),
        unsetBlockquote:
          () =>
          ({ commands: n }) =>
            n.lift(this.name),
      };
    },
    addKeyboardShortcuts() {
      return { "Mod-Shift-b": () => this.editor.commands.toggleBlockquote() };
    },
    addInputRules() {
      return [JO({ find: LO, type: this.type })];
    },
  }),
  KO = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))$/,
  WO = /(?:^|\s)((?:\*\*)((?:[^*]+))(?:\*\*))/g,
  HO = /(?:^|\s)((?:__)((?:[^__]+))(?:__))$/,
  UO = /(?:^|\s)((?:__)((?:[^__]+))(?:__))/g,
  GO = pn.create({
    name: "bold",
    addOptions() {
      return { HTMLAttributes: {} };
    },
    parseHTML() {
      return [
        { tag: "strong" },
        { tag: "b", getAttrs: (n) => n.style.fontWeight !== "normal" && null },
        { style: "font-weight", getAttrs: (n) => /^(bold(er)?|[5-9]\d{2,})$/.test(n) && null },
      ];
    },
    renderHTML({ HTMLAttributes: n }) {
      return ["strong", Sn(this.options.HTMLAttributes, n), 0];
    },
    addCommands() {
      return {
        setBold:
          () =>
          ({ commands: n }) =>
            n.setMark(this.name),
        toggleBold:
          () =>
          ({ commands: n }) =>
            n.toggleMark(this.name),
        unsetBold:
          () =>
          ({ commands: n }) =>
            n.unsetMark(this.name),
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-b": () => this.editor.commands.toggleBold(),
        "Mod-B": () => this.editor.commands.toggleBold(),
      };
    },
    addInputRules() {
      return [io({ find: KO, type: this.type }), io({ find: HO, type: this.type })];
    },
    addPasteRules() {
      return [so({ find: WO, type: this.type }), so({ find: UO, type: this.type })];
    },
  }),
  YO = /(?:^|\s)((?:`)((?:[^`]+))(?:`))$/,
  XO = /(?:^|\s)((?:`)((?:[^`]+))(?:`))/g,
  QO = pn.create({
    name: "code",
    addOptions() {
      return { HTMLAttributes: {} };
    },
    excludes: "_",
    code: !0,
    exitable: !0,
    parseHTML() {
      return [{ tag: "code" }];
    },
    renderHTML({ HTMLAttributes: n }) {
      return ["code", Sn(this.options.HTMLAttributes, n), 0];
    },
    addCommands() {
      return {
        setCode:
          () =>
          ({ commands: n }) =>
            n.setMark(this.name),
        toggleCode:
          () =>
          ({ commands: n }) =>
            n.toggleMark(this.name),
        unsetCode:
          () =>
          ({ commands: n }) =>
            n.unsetMark(this.name),
      };
    },
    addKeyboardShortcuts() {
      return { "Mod-e": () => this.editor.commands.toggleCode() };
    },
    addInputRules() {
      return [io({ find: YO, type: this.type })];
    },
    addPasteRules() {
      return [so({ find: XO, type: this.type })];
    },
  }),
  ZO = fn.create({
    name: "hardBreak",
    addOptions() {
      return { keepMarks: !0, HTMLAttributes: {} };
    },
    inline: !0,
    group: "inline",
    selectable: !1,
    parseHTML() {
      return [{ tag: "br" }];
    },
    renderHTML({ HTMLAttributes: n }) {
      return ["br", Sn(this.options.HTMLAttributes, n)];
    },
    renderText() {
      return `
`;
    },
    addCommands() {
      return {
        setHardBreak:
          () =>
          ({ commands: n, chain: e, state: t, editor: o }) =>
            n.first([
              () => n.exitCode(),
              () =>
                n.command(() => {
                  const { selection: r, storedMarks: i } = t;
                  if (r.$from.parent.type.spec.isolating) return !1;
                  const { keepMarks: s } = this.options,
                    { splittableMarks: l } = o.extensionManager,
                    a = i || (r.$to.parentOffset && r.$from.marks());
                  return e()
                    .insertContent({ type: this.name })
                    .command(({ tr: c, dispatch: d }) => {
                      if (d && a && s) {
                        const h = a.filter((p) => l.includes(p.type.name));
                        c.ensureMarks(h);
                      }
                      return !0;
                    })
                    .run();
                }),
            ]),
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-Enter": () => this.editor.commands.setHardBreak(),
        "Shift-Enter": () => this.editor.commands.setHardBreak(),
      };
    },
  }),
  _O = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))$/,
  eN = /(?:^|\s)((?:\*)((?:[^*]+))(?:\*))/g,
  tN = /(?:^|\s)((?:_)((?:[^_]+))(?:_))$/,
  nN = /(?:^|\s)((?:_)((?:[^_]+))(?:_))/g,
  oN = pn.create({
    name: "italic",
    addOptions() {
      return { HTMLAttributes: {} };
    },
    parseHTML() {
      return [
        { tag: "em" },
        { tag: "i", getAttrs: (n) => n.style.fontStyle !== "normal" && null },
        { style: "font-style=italic" },
      ];
    },
    renderHTML({ HTMLAttributes: n }) {
      return ["em", Sn(this.options.HTMLAttributes, n), 0];
    },
    addCommands() {
      return {
        setItalic:
          () =>
          ({ commands: n }) =>
            n.setMark(this.name),
        toggleItalic:
          () =>
          ({ commands: n }) =>
            n.toggleMark(this.name),
        unsetItalic:
          () =>
          ({ commands: n }) =>
            n.unsetMark(this.name),
      };
    },
    addKeyboardShortcuts() {
      return {
        "Mod-i": () => this.editor.commands.toggleItalic(),
        "Mod-I": () => this.editor.commands.toggleItalic(),
      };
    },
    addInputRules() {
      return [io({ find: _O, type: this.type }), io({ find: tN, type: this.type })];
    },
    addPasteRules() {
      return [so({ find: eN, type: this.type }), so({ find: nN, type: this.type })];
    },
  }),
  rN = fn.create({
    name: "paragraph",
    priority: 1e3,
    addOptions() {
      return { HTMLAttributes: {} };
    },
    group: "block",
    content: "inline*",
    parseHTML() {
      return [{ tag: "p" }];
    },
    renderHTML({ HTMLAttributes: n }) {
      return ["p", Sn(this.options.HTMLAttributes, n), 0];
    },
    addCommands() {
      return {
        setParagraph:
          () =>
          ({ commands: n }) =>
            n.setNode(this.name),
      };
    },
    addKeyboardShortcuts() {
      return { "Mod-Alt-0": () => this.editor.commands.setParagraph() };
    },
  }),
  iN = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))$/,
  sN = /(?:^|\s)((?:~~)((?:[^~]+))(?:~~))/g,
  lN = pn.create({
    name: "strike",
    addOptions() {
      return { HTMLAttributes: {} };
    },
    parseHTML() {
      return [
        { tag: "s" },
        { tag: "del" },
        { tag: "strike" },
        {
          style: "text-decoration",
          consuming: !1,
          getAttrs: (n) => (n.includes("line-through") ? {} : !1),
        },
      ];
    },
    renderHTML({ HTMLAttributes: n }) {
      return ["s", Sn(this.options.HTMLAttributes, n), 0];
    },
    addCommands() {
      return {
        setStrike:
          () =>
          ({ commands: n }) =>
            n.setMark(this.name),
        toggleStrike:
          () =>
          ({ commands: n }) =>
            n.toggleMark(this.name),
        unsetStrike:
          () =>
          ({ commands: n }) =>
            n.unsetMark(this.name),
      };
    },
    addKeyboardShortcuts() {
      const n = {};
      return (
        Sc()
          ? (n["Mod-Shift-s"] = () => this.editor.commands.toggleStrike())
          : (n["Ctrl-Shift-s"] = () => this.editor.commands.toggleStrike()),
        n
      );
    },
    addInputRules() {
      return [io({ find: iN, type: this.type })];
    },
    addPasteRules() {
      return [so({ find: sN, type: this.type })];
    },
  }),
  aN = fn.create({ name: "text", group: "inline" }),
  cN = rt.create({
    name: "textKit",
    addExtensions() {
      var n, e, t, o, r, i, s, l;
      const a = [];
      return (
        this.options.blockquote !== !1 &&
          a.push(qO.configure((n = this.options) == null ? void 0 : n.blockquote)),
        this.options.bold !== !1 &&
          a.push(GO.configure((e = this.options) == null ? void 0 : e.bold)),
        this.options.code !== !1 &&
          a.push(QO.configure((t = this.options) == null ? void 0 : t.code)),
        this.options.hardBreak !== !1 &&
          a.push(ZO.configure((o = this.options) == null ? void 0 : o.hardBreak)),
        this.options.italic !== !1 &&
          a.push(oN.configure((r = this.options) == null ? void 0 : r.italic)),
        this.options.paragraph !== !1 &&
          a.push(rN.configure((i = this.options) == null ? void 0 : i.paragraph)),
        this.options.strike !== !1 &&
          a.push(lN.configure((s = this.options) == null ? void 0 : s.strike)),
        this.options.text !== !1 &&
          a.push(aN.configure((l = this.options) == null ? void 0 : l.text)),
        a
      );
    },
  }),
  dN = {
    __name: "base-text-editor",
    setup(n) {
      const e = vg(null);
      return (
        xg(() => {
          new Cw({ element: e.value, extensions: [Ax, cN] });
        }),
        (t, o) => (Zh(), _h("div", { class: "container", ref_key: "container", ref: e }, null, 512))
      );
    },
  },
  hN = bg(dN, [["__scopeId", "data-v-93bf26ed"]]),
  pN = $g("", 3),
  cT = JSON.parse(
    '{"title":"Base Text Editor","description":"","frontmatter":{"outline":"deep"},"headers":[],"relativePath":"api.md","filePath":"api.md"}',
  ),
  fN = { name: "api.md" },
  dT = Object.assign(fN, {
    setup(n) {
      return (e, t) => (Zh(), _h("div", null, [pN, Sg(hN)]));
    },
  });
export { cT as __pageData, dT as default };
