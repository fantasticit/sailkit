import {
  d as _,
  o as a,
  c,
  r as l,
  n as T,
  a as F,
  t as S,
  b,
  w as d,
  T as de,
  e as f,
  _ as k,
  u as Oe,
  i as Ue,
  f as Ge,
  g as ve,
  h as w,
  j as J,
  k as $,
  l as z,
  m as v,
  p as i,
  q as C,
  s as H,
  v as j,
  x as ie,
  y as q,
  z as x,
  A as pe,
  B as ye,
  C as je,
  D as ze,
  E as W,
  F as M,
  G as E,
  H as Pe,
  I as ee,
  J as m,
  K as R,
  L as Ve,
  M as te,
  N as Q,
  O as oe,
  P as qe,
  Q as Le,
  R as We,
  S as Ke,
  U as Re,
  V as Se,
  W as Je,
  X as we,
  Y as Ie,
  Z as Ye,
  $ as Qe,
  a0 as Xe,
  a1 as Ze,
} from "./framework.CQ12TVIp.js";
const xe = _({
    __name: "VPBadge",
    props: { text: {}, type: { default: "tip" } },
    setup(o) {
      return (e, t) => (
        a(),
        c(
          "span",
          { class: T(["VPBadge", e.type]) },
          [l(e.$slots, "default", {}, () => [F(S(e.text), 1)])],
          2,
        )
      );
    },
  }),
  et = { key: 0, class: "VPBackdrop" },
  tt = _({
    __name: "VPBackdrop",
    props: { show: { type: Boolean } },
    setup(o) {
      return (e, t) => (
        a(),
        b(
          de,
          { name: "fade" },
          { default: d(() => [e.show ? (a(), c("div", et)) : f("", !0)]), _: 1 },
        )
      );
    },
  }),
  ot = k(tt, [["__scopeId", "data-v-8398d00b"]]),
  V = Oe;
function st(o, e) {
  let t,
    s = !1;
  return () => {
    t && clearTimeout(t),
      s ? (t = setTimeout(o, e)) : (o(), (s = !0) && setTimeout(() => (s = !1), e));
  };
}
function le(o) {
  return /^\//.test(o) ? o : `/${o}`;
}
function he(o) {
  const { pathname: e, search: t, hash: s, protocol: n } = new URL(o, "http://a.com");
  if (Ue(o) || o.startsWith("#") || !n.startsWith("http") || !Ge(e)) return o;
  const { site: r } = V(),
    u =
      e.endsWith("/") || e.endsWith(".html")
        ? o
        : o.replace(
            /(?:(^\.+)\/)?.*$/,
            `$1${e.replace(/(\.md)?$/, r.value.cleanUrls ? "" : ".html")}${t}${s}`,
          );
  return ve(u);
}
const fe = w(J ? location.hash : "");
J &&
  window.addEventListener("hashchange", () => {
    fe.value = location.hash;
  });
function Y({ removeCurrent: o = !0, correspondingLink: e = !1 } = {}) {
  const { site: t, localeIndex: s, page: n, theme: r } = V(),
    u = $(() => {
      var p, g;
      return {
        label: (p = t.value.locales[s.value]) == null ? void 0 : p.label,
        link:
          ((g = t.value.locales[s.value]) == null ? void 0 : g.link) ||
          (s.value === "root" ? "/" : `/${s.value}/`),
      };
    });
  return {
    localeLinks: $(() =>
      Object.entries(t.value.locales).flatMap(([p, g]) =>
        o && u.value.label === g.label
          ? []
          : {
              text: g.label,
              link:
                nt(
                  g.link || (p === "root" ? "/" : `/${p}/`),
                  r.value.i18nRouting !== !1 && e,
                  n.value.relativePath.slice(u.value.link.length - 1),
                  !t.value.cleanUrls,
                ) + fe.value,
            },
      ),
    ),
    currentLang: u,
  };
}
function nt(o, e, t, s) {
  return e
    ? o.replace(/\/$/, "") +
        le(t.replace(/(^|\/)index\.md$/, "$1").replace(/\.md$/, s ? ".html" : ""))
    : o;
}
const at = (o) => (C("data-v-ea17ab60"), (o = o()), H(), o),
  rt = { class: "NotFound" },
  it = { class: "code" },
  lt = { class: "title" },
  ct = at(() => v("div", { class: "divider" }, null, -1)),
  ut = { class: "quote" },
  dt = { class: "action" },
  vt = ["href", "aria-label"],
  pt = _({
    __name: "NotFound",
    setup(o) {
      const { site: e, theme: t } = V(),
        { localeLinks: s } = Y({ removeCurrent: !1 }),
        n = w("/");
      return (
        z(() => {
          var u;
          const r = window.location.pathname
            .replace(e.value.base, "")
            .replace(/(^.*?\/).*$/, "/$1");
          s.value.length &&
            (n.value =
              ((u = s.value.find(({ link: h }) => h.startsWith(r))) == null ? void 0 : u.link) ||
              s.value[0].link);
        }),
        (r, u) => {
          var h, p, g, y, P;
          return (
            a(),
            c("div", rt, [
              v("p", it, S(((h = i(t).notFound) == null ? void 0 : h.code) ?? "404"), 1),
              v(
                "h1",
                lt,
                S(((p = i(t).notFound) == null ? void 0 : p.title) ?? "PAGE NOT FOUND"),
                1,
              ),
              ct,
              v(
                "blockquote",
                ut,
                S(
                  ((g = i(t).notFound) == null ? void 0 : g.quote) ??
                    "But if you don't change your direction, and if you keep looking, you may end up where you are heading.",
                ),
                1,
              ),
              v("div", dt, [
                v(
                  "a",
                  {
                    class: "link",
                    href: i(ve)(n.value),
                    "aria-label":
                      ((y = i(t).notFound) == null ? void 0 : y.linkLabel) ?? "go to home",
                  },
                  S(((P = i(t).notFound) == null ? void 0 : P.linkText) ?? "Take me home"),
                  9,
                  vt,
                ),
              ]),
            ])
          );
        }
      );
    },
  }),
  ht = k(pt, [["__scopeId", "data-v-ea17ab60"]]);
function Te(o, e) {
  if (Array.isArray(o)) return X(o);
  if (o == null) return [];
  e = le(e);
  const t = Object.keys(o)
      .sort((n, r) => r.split("/").length - n.split("/").length)
      .find((n) => e.startsWith(le(n))),
    s = t ? o[t] : [];
  return Array.isArray(s) ? X(s) : X(s.items, s.base);
}
function ft(o) {
  const e = [];
  let t = 0;
  for (const s in o) {
    const n = o[s];
    if (n.items) {
      t = e.push(n);
      continue;
    }
    e[t] || e.push({ items: [] }), e[t].items.push(n);
  }
  return e;
}
function _t(o) {
  const e = [];
  function t(s) {
    for (const n of s)
      n.text && n.link && e.push({ text: n.text, link: n.link, docFooterText: n.docFooterText }),
        n.items && t(n.items);
  }
  return t(o), e;
}
function ce(o, e) {
  return Array.isArray(e)
    ? e.some((t) => ce(o, t))
    : j(o, e.link)
      ? !0
      : e.items
        ? ce(o, e.items)
        : !1;
}
function X(o, e) {
  return [...o].map((t) => {
    const s = { ...t },
      n = s.base || e;
    return n && s.link && (s.link = n + s.link), s.items && (s.items = X(s.items, n)), s;
  });
}
function O() {
  const { frontmatter: o, page: e, theme: t } = V(),
    s = ie("(min-width: 960px)"),
    n = w(!1),
    r = $(() => {
      const B = t.value.sidebar,
        L = e.value.relativePath;
      return B ? Te(B, L) : [];
    }),
    u = w(r.value);
  q(r, (B, L) => {
    JSON.stringify(B) !== JSON.stringify(L) && (u.value = r.value);
  });
  const h = $(() => o.value.sidebar !== !1 && u.value.length > 0 && o.value.layout !== "home"),
    p = $(() =>
      g ? (o.value.aside == null ? t.value.aside === "left" : o.value.aside === "left") : !1,
    ),
    g = $(() =>
      o.value.layout === "home"
        ? !1
        : o.value.aside != null
          ? !!o.value.aside
          : t.value.aside !== !1,
    ),
    y = $(() => h.value && s.value),
    P = $(() => (h.value ? ft(u.value) : []));
  function I() {
    n.value = !0;
  }
  function N() {
    n.value = !1;
  }
  function A() {
    n.value ? N() : I();
  }
  return {
    isOpen: n,
    sidebar: u,
    sidebarGroups: P,
    hasSidebar: h,
    hasAside: g,
    leftAside: p,
    isSidebarEnabled: y,
    open: I,
    close: N,
    toggle: A,
  };
}
function mt(o, e) {
  let t;
  x(() => {
    t = o.value ? document.activeElement : void 0;
  }),
    z(() => {
      window.addEventListener("keyup", s);
    }),
    pe(() => {
      window.removeEventListener("keyup", s);
    });
  function s(n) {
    n.key === "Escape" && o.value && (e(), t == null || t.focus());
  }
}
function kt(o) {
  const { page: e } = V(),
    t = w(!1),
    s = $(() => o.value.collapsed != null),
    n = $(() => !!o.value.link),
    r = w(!1),
    u = () => {
      r.value = j(e.value.relativePath, o.value.link);
    };
  q([e, o, fe], u), z(u);
  const h = $(() => (r.value ? !0 : o.value.items ? ce(e.value.relativePath, o.value.items) : !1)),
    p = $(() => !!(o.value.items && o.value.items.length));
  x(() => {
    t.value = !!(s.value && o.value.collapsed);
  }),
    ye(() => {
      (r.value || h.value) && (t.value = !1);
    });
  function g() {
    s.value && (t.value = !t.value);
  }
  return {
    collapsed: t,
    collapsible: s,
    isLink: n,
    isActiveLink: r,
    hasActiveLink: h,
    hasChildren: p,
    toggle: g,
  };
}
function bt() {
  const { hasSidebar: o } = O(),
    e = ie("(min-width: 960px)"),
    t = ie("(min-width: 1280px)");
  return { isAsideEnabled: $(() => (!t.value && !e.value ? !1 : o.value ? t.value : e.value)) };
}
const ue = [];
function Ne(o) {
  return (
    (typeof o.outline == "object" && !Array.isArray(o.outline) && o.outline.label) ||
    o.outlineTitle ||
    "On this page"
  );
}
function _e(o) {
  const e = [...document.querySelectorAll(".VPDoc :where(h1,h2,h3,h4,h5,h6)")]
    .filter((t) => t.id && t.hasChildNodes())
    .map((t) => {
      const s = Number(t.tagName[1]);
      return { element: t, title: $t(t), link: "#" + t.id, level: s };
    });
  return gt(e, o);
}
function $t(o) {
  let e = "";
  for (const t of o.childNodes)
    if (t.nodeType === 1) {
      if (
        t.classList.contains("VPBadge") ||
        t.classList.contains("header-anchor") ||
        t.classList.contains("ignore-header")
      )
        continue;
      e += t.textContent;
    } else t.nodeType === 3 && (e += t.textContent);
  return e.trim();
}
function gt(o, e) {
  if (e === !1) return [];
  const t = (typeof e == "object" && !Array.isArray(e) ? e.level : e) || 2,
    [s, n] = typeof t == "number" ? [t, t] : t === "deep" ? [2, 6] : t;
  (o = o.filter((u) => u.level >= s && u.level <= n)), (ue.length = 0);
  for (const { element: u, link: h } of o) ue.push({ element: u, link: h });
  const r = [];
  e: for (let u = 0; u < o.length; u++) {
    const h = o[u];
    if (u === 0) r.push(h);
    else {
      for (let p = u - 1; p >= 0; p--) {
        const g = o[p];
        if (g.level < h.level) {
          (g.children || (g.children = [])).push(h);
          continue e;
        }
      }
      r.push(h);
    }
  }
  return r;
}
function yt(o, e) {
  const { isAsideEnabled: t } = bt(),
    s = st(r, 100);
  let n = null;
  z(() => {
    requestAnimationFrame(r), window.addEventListener("scroll", s);
  }),
    je(() => {
      u(location.hash);
    }),
    pe(() => {
      window.removeEventListener("scroll", s);
    });
  function r() {
    if (!t.value) return;
    const h = window.scrollY,
      p = window.innerHeight,
      g = document.body.offsetHeight,
      y = Math.abs(h + p - g) < 1,
      P = ue
        .map(({ element: N, link: A }) => ({ link: A, top: Pt(N) }))
        .filter(({ top: N }) => !Number.isNaN(N))
        .sort((N, A) => N.top - A.top);
    if (!P.length) {
      u(null);
      return;
    }
    if (h < 1) {
      u(null);
      return;
    }
    if (y) {
      u(P[P.length - 1].link);
      return;
    }
    let I = null;
    for (const { link: N, top: A } of P) {
      if (A > h + ze() + 4) break;
      I = N;
    }
    u(I);
  }
  function u(h) {
    n && n.classList.remove("active"),
      h == null ? (n = null) : (n = o.value.querySelector(`a[href="${decodeURIComponent(h)}"]`));
    const p = n;
    p
      ? (p.classList.add("active"),
        (e.value.style.top = p.offsetTop + 39 + "px"),
        (e.value.style.opacity = "1"))
      : ((e.value.style.top = "33px"), (e.value.style.opacity = "0"));
  }
}
function Pt(o) {
  let e = 0;
  for (; o !== document.body; ) {
    if (o === null) return NaN;
    (e += o.offsetTop), (o = o.offsetParent);
  }
  return e;
}
const Vt = ["href", "title"],
  Lt = _({
    __name: "VPDocOutlineItem",
    props: { headers: {}, root: { type: Boolean } },
    setup(o) {
      function e({ target: t }) {
        const s = t.href.split("#")[1],
          n = document.getElementById(decodeURIComponent(s));
        n == null || n.focus({ preventScroll: !0 });
      }
      return (t, s) => {
        const n = W("VPDocOutlineItem", !0);
        return (
          a(),
          c(
            "ul",
            { class: T(["VPDocOutlineItem", t.root ? "root" : "nested"]) },
            [
              (a(!0),
              c(
                M,
                null,
                E(
                  t.headers,
                  ({ children: r, link: u, title: h }) => (
                    a(),
                    c("li", null, [
                      v("a", { class: "outline-link", href: u, onClick: e, title: h }, S(h), 9, Vt),
                      r != null && r.length
                        ? (a(), b(n, { key: 0, headers: r }, null, 8, ["headers"]))
                        : f("", !0),
                    ])
                  ),
                ),
                256,
              )),
            ],
            2,
          )
        );
      };
    },
  }),
  Me = k(Lt, [["__scopeId", "data-v-2d44e95a"]]),
  St = (o) => (C("data-v-8aeb4c9c"), (o = o()), H(), o),
  wt = { class: "content" },
  It = { class: "outline-title", role: "heading", "aria-level": "2" },
  Tt = { "aria-labelledby": "doc-outline-aria-label" },
  Nt = St(() =>
    v(
      "span",
      { class: "visually-hidden", id: "doc-outline-aria-label" },
      " Table of Contents for current page ",
      -1,
    ),
  ),
  Mt = _({
    __name: "VPDocAsideOutline",
    setup(o) {
      const { frontmatter: e, theme: t } = V(),
        s = Pe([]);
      ee(() => {
        s.value = _e(e.value.outline ?? t.value.outline);
      });
      const n = w(),
        r = w();
      return (
        yt(n, r),
        (u, h) => (
          a(),
          c(
            "div",
            {
              class: T(["VPDocAsideOutline", { "has-outline": s.value.length > 0 }]),
              ref_key: "container",
              ref: n,
              role: "navigation",
            },
            [
              v("div", wt, [
                v("div", { class: "outline-marker", ref_key: "marker", ref: r }, null, 512),
                v("div", It, S(i(Ne)(i(t))), 1),
                v("nav", Tt, [Nt, m(Me, { headers: s.value, root: !0 }, null, 8, ["headers"])]),
              ]),
            ],
            2,
          )
        )
      );
    },
  }),
  At = k(Mt, [["__scopeId", "data-v-8aeb4c9c"]]),
  Bt = { class: "VPDocAsideCarbonAds" },
  Ct = _({
    __name: "VPDocAsideCarbonAds",
    props: { carbonAds: {} },
    setup(o) {
      const e = () => null;
      return (t, s) => (
        a(), c("div", Bt, [m(i(e), { "carbon-ads": t.carbonAds }, null, 8, ["carbon-ads"])])
      );
    },
  }),
  Ht = (o) => (C("data-v-fa71de44"), (o = o()), H(), o),
  Et = { class: "VPDocAside" },
  Ft = Ht(() => v("div", { class: "spacer" }, null, -1)),
  Dt = _({
    __name: "VPDocAside",
    setup(o) {
      const { theme: e } = V();
      return (t, s) => (
        a(),
        c("div", Et, [
          l(t.$slots, "aside-top", {}, void 0, !0),
          l(t.$slots, "aside-outline-before", {}, void 0, !0),
          m(At),
          l(t.$slots, "aside-outline-after", {}, void 0, !0),
          Ft,
          l(t.$slots, "aside-ads-before", {}, void 0, !0),
          i(e).carbonAds
            ? (a(), b(Ct, { key: 0, "carbon-ads": i(e).carbonAds }, null, 8, ["carbon-ads"]))
            : f("", !0),
          l(t.$slots, "aside-ads-after", {}, void 0, !0),
          l(t.$slots, "aside-bottom", {}, void 0, !0),
        ])
      );
    },
  }),
  Ot = k(Dt, [["__scopeId", "data-v-fa71de44"]]);
function Ut() {
  const { theme: o, page: e } = V();
  return $(() => {
    const { text: t = "Edit this page", pattern: s = "" } = o.value.editLink || {};
    let n;
    return (
      typeof s == "function" ? (n = s(e.value)) : (n = s.replace(/:path/g, e.value.filePath)),
      { url: n, text: t }
    );
  });
}
function Gt() {
  const { page: o, theme: e, frontmatter: t } = V();
  return $(() => {
    var g, y, P, I, N, A, B, L;
    const s = Te(e.value.sidebar, o.value.relativePath),
      n = _t(s),
      r = jt(n, (U) => U.link.replace(/[?#].*$/, "")),
      u = r.findIndex((U) => j(o.value.relativePath, U.link)),
      h =
        (((g = e.value.docFooter) == null ? void 0 : g.prev) === !1 && !t.value.prev) ||
        t.value.prev === !1,
      p =
        (((y = e.value.docFooter) == null ? void 0 : y.next) === !1 && !t.value.next) ||
        t.value.next === !1;
    return {
      prev: h
        ? void 0
        : {
            text:
              (typeof t.value.prev == "string"
                ? t.value.prev
                : typeof t.value.prev == "object"
                  ? t.value.prev.text
                  : void 0) ??
              ((P = r[u - 1]) == null ? void 0 : P.docFooterText) ??
              ((I = r[u - 1]) == null ? void 0 : I.text),
            link:
              (typeof t.value.prev == "object" ? t.value.prev.link : void 0) ??
              ((N = r[u - 1]) == null ? void 0 : N.link),
          },
      next: p
        ? void 0
        : {
            text:
              (typeof t.value.next == "string"
                ? t.value.next
                : typeof t.value.next == "object"
                  ? t.value.next.text
                  : void 0) ??
              ((A = r[u + 1]) == null ? void 0 : A.docFooterText) ??
              ((B = r[u + 1]) == null ? void 0 : B.text),
            link:
              (typeof t.value.next == "object" ? t.value.next.link : void 0) ??
              ((L = r[u + 1]) == null ? void 0 : L.link),
          },
    };
  });
}
function jt(o, e) {
  const t = new Set();
  return o.filter((s) => {
    const n = e(s);
    return t.has(n) ? !1 : t.add(n);
  });
}
const D = _({
    __name: "VPLink",
    props: { tag: {}, href: {}, noIcon: { type: Boolean }, target: {}, rel: {} },
    setup(o) {
      const e = o,
        t = $(() => e.tag ?? (e.href ? "a" : "span")),
        s = $(() => e.href && Ve.test(e.href));
      return (n, r) => (
        a(),
        b(
          R(t.value),
          {
            class: T([
              "VPLink",
              { link: n.href, "vp-external-link-icon": s.value, "no-icon": n.noIcon },
            ]),
            href: n.href ? i(he)(n.href) : void 0,
            target: n.target ?? (s.value ? "_blank" : void 0),
            rel: n.rel ?? (s.value ? "noreferrer" : void 0),
          },
          { default: d(() => [l(n.$slots, "default")]), _: 3 },
          8,
          ["class", "href", "target", "rel"],
        )
      );
    },
  }),
  zt = { class: "VPLastUpdated" },
  qt = ["datetime"],
  Wt = _({
    __name: "VPDocFooterLastUpdated",
    setup(o) {
      const { theme: e, page: t, frontmatter: s, lang: n } = V(),
        r = $(() => new Date(s.value.lastUpdated ?? t.value.lastUpdated)),
        u = $(() => r.value.toISOString()),
        h = w("");
      return (
        z(() => {
          x(() => {
            var p, g, y;
            h.value = new Intl.DateTimeFormat(
              (g = (p = e.value.lastUpdated) == null ? void 0 : p.formatOptions) != null &&
              g.forceLocale
                ? n.value
                : void 0,
              ((y = e.value.lastUpdated) == null ? void 0 : y.formatOptions) ?? {
                dateStyle: "short",
                timeStyle: "short",
              },
            ).format(r.value);
          });
        }),
        (p, g) => {
          var y;
          return (
            a(),
            c("p", zt, [
              F(
                S(
                  ((y = i(e).lastUpdated) == null ? void 0 : y.text) ||
                    i(e).lastUpdatedText ||
                    "Last updated",
                ) + ": ",
                1,
              ),
              v("time", { datetime: u.value }, S(h.value), 9, qt),
            ])
          );
        }
      );
    },
  }),
  Kt = k(Wt, [["__scopeId", "data-v-23f3f82c"]]),
  Rt = (o) => (C("data-v-91928579"), (o = o()), H(), o),
  Jt = { key: 0, class: "VPDocFooter" },
  Yt = { key: 0, class: "edit-info" },
  Qt = { key: 0, class: "edit-link" },
  Xt = Rt(() => v("span", { class: "vpi-square-pen edit-link-icon" }, null, -1)),
  Zt = { key: 1, class: "last-updated" },
  xt = { key: 1, class: "prev-next" },
  eo = { class: "pager" },
  to = ["innerHTML"],
  oo = ["innerHTML"],
  so = { class: "pager" },
  no = ["innerHTML"],
  ao = ["innerHTML"],
  ro = _({
    __name: "VPDocFooter",
    setup(o) {
      const { theme: e, page: t, frontmatter: s } = V(),
        n = Ut(),
        r = Gt(),
        u = $(() => e.value.editLink && s.value.editLink !== !1),
        h = $(() => t.value.lastUpdated && s.value.lastUpdated !== !1),
        p = $(() => u.value || h.value || r.value.prev || r.value.next);
      return (g, y) => {
        var P, I, N, A;
        return p.value
          ? (a(),
            c("footer", Jt, [
              l(g.$slots, "doc-footer-before", {}, void 0, !0),
              u.value || h.value
                ? (a(),
                  c("div", Yt, [
                    u.value
                      ? (a(),
                        c("div", Qt, [
                          m(
                            D,
                            { class: "edit-link-button", href: i(n).url, "no-icon": !0 },
                            { default: d(() => [Xt, F(" " + S(i(n).text), 1)]), _: 1 },
                            8,
                            ["href"],
                          ),
                        ]))
                      : f("", !0),
                    h.value ? (a(), c("div", Zt, [m(Kt)])) : f("", !0),
                  ]))
                : f("", !0),
              ((P = i(r).prev) != null && P.link) || ((I = i(r).next) != null && I.link)
                ? (a(),
                  c("nav", xt, [
                    v("div", eo, [
                      (N = i(r).prev) != null && N.link
                        ? (a(),
                          b(
                            D,
                            { key: 0, class: "pager-link prev", href: i(r).prev.link },
                            {
                              default: d(() => {
                                var B;
                                return [
                                  v(
                                    "span",
                                    {
                                      class: "desc",
                                      innerHTML:
                                        ((B = i(e).docFooter) == null ? void 0 : B.prev) ||
                                        "Previous page",
                                    },
                                    null,
                                    8,
                                    to,
                                  ),
                                  v(
                                    "span",
                                    { class: "title", innerHTML: i(r).prev.text },
                                    null,
                                    8,
                                    oo,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                            8,
                            ["href"],
                          ))
                        : f("", !0),
                    ]),
                    v("div", so, [
                      (A = i(r).next) != null && A.link
                        ? (a(),
                          b(
                            D,
                            { key: 0, class: "pager-link next", href: i(r).next.link },
                            {
                              default: d(() => {
                                var B;
                                return [
                                  v(
                                    "span",
                                    {
                                      class: "desc",
                                      innerHTML:
                                        ((B = i(e).docFooter) == null ? void 0 : B.next) ||
                                        "Next page",
                                    },
                                    null,
                                    8,
                                    no,
                                  ),
                                  v(
                                    "span",
                                    { class: "title", innerHTML: i(r).next.text },
                                    null,
                                    8,
                                    ao,
                                  ),
                                ];
                              }),
                              _: 1,
                            },
                            8,
                            ["href"],
                          ))
                        : f("", !0),
                    ]),
                  ]))
                : f("", !0),
            ]))
          : f("", !0);
      };
    },
  }),
  io = k(ro, [["__scopeId", "data-v-91928579"]]),
  lo = (o) => (C("data-v-7a804511"), (o = o()), H(), o),
  co = { class: "container" },
  uo = lo(() => v("div", { class: "aside-curtain" }, null, -1)),
  vo = { class: "aside-container" },
  po = { class: "aside-content" },
  ho = { class: "content" },
  fo = { class: "content-container" },
  _o = { class: "main" },
  mo = _({
    __name: "VPDoc",
    setup(o) {
      const { theme: e } = V(),
        t = te(),
        { hasSidebar: s, hasAside: n, leftAside: r } = O(),
        u = $(() => t.path.replace(/[./]+/g, "_").replace(/_html$/, ""));
      return (h, p) => {
        const g = W("Content");
        return (
          a(),
          c(
            "div",
            { class: T(["VPDoc", { "has-sidebar": i(s), "has-aside": i(n) }]) },
            [
              l(h.$slots, "doc-top", {}, void 0, !0),
              v("div", co, [
                i(n)
                  ? (a(),
                    c(
                      "div",
                      { key: 0, class: T(["aside", { "left-aside": i(r) }]) },
                      [
                        uo,
                        v("div", vo, [
                          v("div", po, [
                            m(Ot, null, {
                              "aside-top": d(() => [l(h.$slots, "aside-top", {}, void 0, !0)]),
                              "aside-bottom": d(() => [
                                l(h.$slots, "aside-bottom", {}, void 0, !0),
                              ]),
                              "aside-outline-before": d(() => [
                                l(h.$slots, "aside-outline-before", {}, void 0, !0),
                              ]),
                              "aside-outline-after": d(() => [
                                l(h.$slots, "aside-outline-after", {}, void 0, !0),
                              ]),
                              "aside-ads-before": d(() => [
                                l(h.$slots, "aside-ads-before", {}, void 0, !0),
                              ]),
                              "aside-ads-after": d(() => [
                                l(h.$slots, "aside-ads-after", {}, void 0, !0),
                              ]),
                              _: 3,
                            }),
                          ]),
                        ]),
                      ],
                      2,
                    ))
                  : f("", !0),
                v("div", ho, [
                  v("div", fo, [
                    l(h.$slots, "doc-before", {}, void 0, !0),
                    v("main", _o, [
                      m(
                        g,
                        {
                          class: T([
                            "vp-doc",
                            [u.value, i(e).externalLinkIcon && "external-link-icon-enabled"],
                          ]),
                        },
                        null,
                        8,
                        ["class"],
                      ),
                    ]),
                    m(io, null, {
                      "doc-footer-before": d(() => [
                        l(h.$slots, "doc-footer-before", {}, void 0, !0),
                      ]),
                      _: 3,
                    }),
                    l(h.$slots, "doc-after", {}, void 0, !0),
                  ]),
                ]),
              ]),
              l(h.$slots, "doc-bottom", {}, void 0, !0),
            ],
            2,
          )
        );
      };
    },
  }),
  ko = k(mo, [["__scopeId", "data-v-7a804511"]]),
  bo = _({
    __name: "VPButton",
    props: {
      tag: {},
      size: { default: "medium" },
      theme: { default: "brand" },
      text: {},
      href: {},
      target: {},
      rel: {},
    },
    setup(o) {
      const e = o,
        t = $(() => e.href && Ve.test(e.href)),
        s = $(() => (e.tag || e.href ? "a" : "button"));
      return (n, r) => (
        a(),
        b(
          R(s.value),
          {
            class: T(["VPButton", [n.size, n.theme]]),
            href: n.href ? i(he)(n.href) : void 0,
            target: e.target ?? (t.value ? "_blank" : void 0),
            rel: e.rel ?? (t.value ? "noreferrer" : void 0),
          },
          { default: d(() => [F(S(n.text), 1)]), _: 1 },
          8,
          ["class", "href", "target", "rel"],
        )
      );
    },
  }),
  $o = k(bo, [["__scopeId", "data-v-6f6c232a"]]),
  go = ["src", "alt"],
  yo = _({
    inheritAttrs: !1,
    __name: "VPImage",
    props: { image: {}, alt: {} },
    setup(o) {
      return (e, t) => {
        const s = W("VPImage", !0);
        return e.image
          ? (a(),
            c(
              M,
              { key: 0 },
              [
                typeof e.image == "string" || "src" in e.image
                  ? (a(),
                    c(
                      "img",
                      Q(
                        { key: 0, class: "VPImage" },
                        typeof e.image == "string" ? e.$attrs : { ...e.image, ...e.$attrs },
                        {
                          src: i(ve)(typeof e.image == "string" ? e.image : e.image.src),
                          alt: e.alt ?? (typeof e.image == "string" ? "" : e.image.alt || ""),
                        },
                      ),
                      null,
                      16,
                      go,
                    ))
                  : (a(),
                    c(
                      M,
                      { key: 1 },
                      [
                        m(
                          s,
                          Q({ class: "dark", image: e.image.dark, alt: e.image.alt }, e.$attrs),
                          null,
                          16,
                          ["image", "alt"],
                        ),
                        m(
                          s,
                          Q({ class: "light", image: e.image.light, alt: e.image.alt }, e.$attrs),
                          null,
                          16,
                          ["image", "alt"],
                        ),
                      ],
                      64,
                    )),
              ],
              64,
            ))
          : f("", !0);
      };
    },
  }),
  Z = k(yo, [["__scopeId", "data-v-4227bf10"]]),
  Po = (o) => (C("data-v-f217fb8f"), (o = o()), H(), o),
  Vo = { class: "container" },
  Lo = { class: "main" },
  So = { key: 0, class: "name" },
  wo = ["innerHTML"],
  Io = ["innerHTML"],
  To = ["innerHTML"],
  No = { key: 0, class: "actions" },
  Mo = { key: 0, class: "image" },
  Ao = { class: "image-container" },
  Bo = Po(() => v("div", { class: "image-bg" }, null, -1)),
  Co = _({
    __name: "VPHero",
    props: { name: {}, text: {}, tagline: {}, image: {}, actions: {} },
    setup(o) {
      const e = oe("hero-image-slot-exists");
      return (t, s) => (
        a(),
        c(
          "div",
          { class: T(["VPHero", { "has-image": t.image || i(e) }]) },
          [
            v("div", Vo, [
              v("div", Lo, [
                l(t.$slots, "home-hero-info-before", {}, void 0, !0),
                l(
                  t.$slots,
                  "home-hero-info",
                  {},
                  () => [
                    t.name
                      ? (a(),
                        c("h1", So, [v("span", { innerHTML: t.name, class: "clip" }, null, 8, wo)]))
                      : f("", !0),
                    t.text
                      ? (a(), c("p", { key: 1, innerHTML: t.text, class: "text" }, null, 8, Io))
                      : f("", !0),
                    t.tagline
                      ? (a(),
                        c("p", { key: 2, innerHTML: t.tagline, class: "tagline" }, null, 8, To))
                      : f("", !0),
                  ],
                  !0,
                ),
                l(t.$slots, "home-hero-info-after", {}, void 0, !0),
                t.actions
                  ? (a(),
                    c("div", No, [
                      (a(!0),
                      c(
                        M,
                        null,
                        E(
                          t.actions,
                          (n) => (
                            a(),
                            c("div", { key: n.link, class: "action" }, [
                              m(
                                $o,
                                {
                                  tag: "a",
                                  size: "medium",
                                  theme: n.theme,
                                  text: n.text,
                                  href: n.link,
                                  target: n.target,
                                  rel: n.rel,
                                },
                                null,
                                8,
                                ["theme", "text", "href", "target", "rel"],
                              ),
                            ])
                          ),
                        ),
                        128,
                      )),
                    ]))
                  : f("", !0),
                l(t.$slots, "home-hero-actions-after", {}, void 0, !0),
              ]),
              t.image || i(e)
                ? (a(),
                  c("div", Mo, [
                    v("div", Ao, [
                      Bo,
                      l(
                        t.$slots,
                        "home-hero-image",
                        {},
                        () => [
                          t.image
                            ? (a(),
                              b(Z, { key: 0, class: "image-src", image: t.image }, null, 8, [
                                "image",
                              ]))
                            : f("", !0),
                        ],
                        !0,
                      ),
                    ]),
                  ]))
                : f("", !0),
            ]),
          ],
          2,
        )
      );
    },
  }),
  Ho = k(Co, [["__scopeId", "data-v-f217fb8f"]]),
  Eo = _({
    __name: "VPHomeHero",
    setup(o) {
      const { frontmatter: e } = V();
      return (t, s) =>
        i(e).hero
          ? (a(),
            b(
              Ho,
              {
                key: 0,
                class: "VPHomeHero",
                name: i(e).hero.name,
                text: i(e).hero.text,
                tagline: i(e).hero.tagline,
                image: i(e).hero.image,
                actions: i(e).hero.actions,
              },
              {
                "home-hero-info-before": d(() => [l(t.$slots, "home-hero-info-before")]),
                "home-hero-info": d(() => [l(t.$slots, "home-hero-info")]),
                "home-hero-info-after": d(() => [l(t.$slots, "home-hero-info-after")]),
                "home-hero-actions-after": d(() => [l(t.$slots, "home-hero-actions-after")]),
                "home-hero-image": d(() => [l(t.$slots, "home-hero-image")]),
                _: 3,
              },
              8,
              ["name", "text", "tagline", "image", "actions"],
            ))
          : f("", !0);
    },
  }),
  Fo = (o) => (C("data-v-57eff742"), (o = o()), H(), o),
  Do = { class: "box" },
  Oo = { key: 0, class: "icon" },
  Uo = ["innerHTML"],
  Go = ["innerHTML"],
  jo = ["innerHTML"],
  zo = { key: 4, class: "link-text" },
  qo = { class: "link-text-value" },
  Wo = Fo(() => v("span", { class: "vpi-arrow-right link-text-icon" }, null, -1)),
  Ko = _({
    __name: "VPFeature",
    props: { icon: {}, title: {}, details: {}, link: {}, linkText: {}, rel: {}, target: {} },
    setup(o) {
      return (e, t) => (
        a(),
        b(
          D,
          {
            class: "VPFeature",
            href: e.link,
            rel: e.rel,
            target: e.target,
            "no-icon": !0,
            tag: e.link ? "a" : "div",
          },
          {
            default: d(() => [
              v("article", Do, [
                typeof e.icon == "object" && e.icon.wrap
                  ? (a(),
                    c("div", Oo, [
                      m(
                        Z,
                        {
                          image: e.icon,
                          alt: e.icon.alt,
                          height: e.icon.height || 48,
                          width: e.icon.width || 48,
                        },
                        null,
                        8,
                        ["image", "alt", "height", "width"],
                      ),
                    ]))
                  : typeof e.icon == "object"
                    ? (a(),
                      b(
                        Z,
                        {
                          key: 1,
                          image: e.icon,
                          alt: e.icon.alt,
                          height: e.icon.height || 48,
                          width: e.icon.width || 48,
                        },
                        null,
                        8,
                        ["image", "alt", "height", "width"],
                      ))
                    : e.icon
                      ? (a(), c("div", { key: 2, class: "icon", innerHTML: e.icon }, null, 8, Uo))
                      : f("", !0),
                v("h2", { class: "title", innerHTML: e.title }, null, 8, Go),
                e.details
                  ? (a(), c("p", { key: 3, class: "details", innerHTML: e.details }, null, 8, jo))
                  : f("", !0),
                e.linkText
                  ? (a(), c("div", zo, [v("p", qo, [F(S(e.linkText) + " ", 1), Wo])]))
                  : f("", !0),
              ]),
            ]),
            _: 1,
          },
          8,
          ["href", "rel", "target", "tag"],
        )
      );
    },
  }),
  Ro = k(Ko, [["__scopeId", "data-v-57eff742"]]),
  Jo = { key: 0, class: "VPFeatures" },
  Yo = { class: "container" },
  Qo = { class: "items" },
  Xo = _({
    __name: "VPFeatures",
    props: { features: {} },
    setup(o) {
      const e = o,
        t = $(() => {
          const s = e.features.length;
          if (s) {
            if (s === 2) return "grid-2";
            if (s === 3) return "grid-3";
            if (s % 3 === 0) return "grid-6";
            if (s > 3) return "grid-4";
          } else return;
        });
      return (s, n) =>
        s.features
          ? (a(),
            c("div", Jo, [
              v("div", Yo, [
                v("div", Qo, [
                  (a(!0),
                  c(
                    M,
                    null,
                    E(
                      s.features,
                      (r) => (
                        a(),
                        c(
                          "div",
                          { key: r.title, class: T(["item", [t.value]]) },
                          [
                            m(
                              Ro,
                              {
                                icon: r.icon,
                                title: r.title,
                                details: r.details,
                                link: r.link,
                                "link-text": r.linkText,
                                rel: r.rel,
                                target: r.target,
                              },
                              null,
                              8,
                              ["icon", "title", "details", "link", "link-text", "rel", "target"],
                            ),
                          ],
                          2,
                        )
                      ),
                    ),
                    128,
                  )),
                ]),
              ]),
            ]))
          : f("", !0);
    },
  }),
  Zo = k(Xo, [["__scopeId", "data-v-3da95af9"]]),
  xo = _({
    __name: "VPHomeFeatures",
    setup(o) {
      const { frontmatter: e } = V();
      return (t, s) =>
        i(e).features
          ? (a(),
            b(Zo, { key: 0, class: "VPHomeFeatures", features: i(e).features }, null, 8, [
              "features",
            ]))
          : f("", !0);
    },
  }),
  es = _({
    __name: "VPHomeContent",
    setup(o) {
      const { width: e } = qe({ includeScrollbar: !1 });
      return (t, s) => (
        a(),
        c(
          "div",
          {
            class: "vp-doc container",
            style: Le(i(e) ? { "--vp-offset": `calc(50% - ${i(e) / 2}px)` } : {}),
          },
          [l(t.$slots, "default", {}, void 0, !0)],
          4,
        )
      );
    },
  }),
  ts = k(es, [["__scopeId", "data-v-e10264da"]]),
  os = { class: "VPHome" },
  ss = _({
    __name: "VPHome",
    setup(o) {
      const { frontmatter: e } = V();
      return (t, s) => {
        const n = W("Content");
        return (
          a(),
          c("div", os, [
            l(t.$slots, "home-hero-before", {}, void 0, !0),
            m(Eo, null, {
              "home-hero-info-before": d(() => [
                l(t.$slots, "home-hero-info-before", {}, void 0, !0),
              ]),
              "home-hero-info": d(() => [l(t.$slots, "home-hero-info", {}, void 0, !0)]),
              "home-hero-info-after": d(() => [
                l(t.$slots, "home-hero-info-after", {}, void 0, !0),
              ]),
              "home-hero-actions-after": d(() => [
                l(t.$slots, "home-hero-actions-after", {}, void 0, !0),
              ]),
              "home-hero-image": d(() => [l(t.$slots, "home-hero-image", {}, void 0, !0)]),
              _: 3,
            }),
            l(t.$slots, "home-hero-after", {}, void 0, !0),
            l(t.$slots, "home-features-before", {}, void 0, !0),
            m(xo),
            l(t.$slots, "home-features-after", {}, void 0, !0),
            i(e).markdownStyles !== !1
              ? (a(), b(ts, { key: 0 }, { default: d(() => [m(n)]), _: 1 }))
              : (a(), b(n, { key: 1 })),
          ])
        );
      };
    },
  }),
  ns = k(ss, [["__scopeId", "data-v-f69d6849"]]),
  as = {},
  rs = { class: "VPPage" };
function is(o, e) {
  const t = W("Content");
  return a(), c("div", rs, [l(o.$slots, "page-top"), m(t), l(o.$slots, "page-bottom")]);
}
const ls = k(as, [["render", is]]),
  cs = _({
    __name: "VPContent",
    setup(o) {
      const { page: e, frontmatter: t } = V(),
        { hasSidebar: s } = O();
      return (n, r) => (
        a(),
        c(
          "div",
          {
            class: T(["VPContent", { "has-sidebar": i(s), "is-home": i(t).layout === "home" }]),
            id: "VPContent",
          },
          [
            i(e).isNotFound
              ? l(n.$slots, "not-found", { key: 0 }, () => [m(ht)], !0)
              : i(t).layout === "page"
                ? (a(),
                  b(
                    ls,
                    { key: 1 },
                    {
                      "page-top": d(() => [l(n.$slots, "page-top", {}, void 0, !0)]),
                      "page-bottom": d(() => [l(n.$slots, "page-bottom", {}, void 0, !0)]),
                      _: 3,
                    },
                  ))
                : i(t).layout === "home"
                  ? (a(),
                    b(
                      ns,
                      { key: 2 },
                      {
                        "home-hero-before": d(() => [
                          l(n.$slots, "home-hero-before", {}, void 0, !0),
                        ]),
                        "home-hero-info-before": d(() => [
                          l(n.$slots, "home-hero-info-before", {}, void 0, !0),
                        ]),
                        "home-hero-info": d(() => [l(n.$slots, "home-hero-info", {}, void 0, !0)]),
                        "home-hero-info-after": d(() => [
                          l(n.$slots, "home-hero-info-after", {}, void 0, !0),
                        ]),
                        "home-hero-actions-after": d(() => [
                          l(n.$slots, "home-hero-actions-after", {}, void 0, !0),
                        ]),
                        "home-hero-image": d(() => [
                          l(n.$slots, "home-hero-image", {}, void 0, !0),
                        ]),
                        "home-hero-after": d(() => [
                          l(n.$slots, "home-hero-after", {}, void 0, !0),
                        ]),
                        "home-features-before": d(() => [
                          l(n.$slots, "home-features-before", {}, void 0, !0),
                        ]),
                        "home-features-after": d(() => [
                          l(n.$slots, "home-features-after", {}, void 0, !0),
                        ]),
                        _: 3,
                      },
                    ))
                  : i(t).layout && i(t).layout !== "doc"
                    ? (a(), b(R(i(t).layout), { key: 3 }))
                    : (a(),
                      b(
                        ko,
                        { key: 4 },
                        {
                          "doc-top": d(() => [l(n.$slots, "doc-top", {}, void 0, !0)]),
                          "doc-bottom": d(() => [l(n.$slots, "doc-bottom", {}, void 0, !0)]),
                          "doc-footer-before": d(() => [
                            l(n.$slots, "doc-footer-before", {}, void 0, !0),
                          ]),
                          "doc-before": d(() => [l(n.$slots, "doc-before", {}, void 0, !0)]),
                          "doc-after": d(() => [l(n.$slots, "doc-after", {}, void 0, !0)]),
                          "aside-top": d(() => [l(n.$slots, "aside-top", {}, void 0, !0)]),
                          "aside-outline-before": d(() => [
                            l(n.$slots, "aside-outline-before", {}, void 0, !0),
                          ]),
                          "aside-outline-after": d(() => [
                            l(n.$slots, "aside-outline-after", {}, void 0, !0),
                          ]),
                          "aside-ads-before": d(() => [
                            l(n.$slots, "aside-ads-before", {}, void 0, !0),
                          ]),
                          "aside-ads-after": d(() => [
                            l(n.$slots, "aside-ads-after", {}, void 0, !0),
                          ]),
                          "aside-bottom": d(() => [l(n.$slots, "aside-bottom", {}, void 0, !0)]),
                          _: 3,
                        },
                      )),
          ],
          2,
        )
      );
    },
  }),
  us = k(cs, [["__scopeId", "data-v-50b226df"]]),
  ds = { class: "container" },
  vs = ["innerHTML"],
  ps = ["innerHTML"],
  hs = _({
    __name: "VPFooter",
    setup(o) {
      const { theme: e, frontmatter: t } = V(),
        { hasSidebar: s } = O();
      return (n, r) =>
        i(e).footer && i(t).footer !== !1
          ? (a(),
            c(
              "footer",
              { key: 0, class: T(["VPFooter", { "has-sidebar": i(s) }]) },
              [
                v("div", ds, [
                  i(e).footer.message
                    ? (a(),
                      c(
                        "p",
                        { key: 0, class: "message", innerHTML: i(e).footer.message },
                        null,
                        8,
                        vs,
                      ))
                    : f("", !0),
                  i(e).footer.copyright
                    ? (a(),
                      c(
                        "p",
                        { key: 1, class: "copyright", innerHTML: i(e).footer.copyright },
                        null,
                        8,
                        ps,
                      ))
                    : f("", !0),
                ]),
              ],
              2,
            ))
          : f("", !0);
    },
  }),
  fs = k(hs, [["__scopeId", "data-v-dd57b8fc"]]);
function _s() {
  const { theme: o, frontmatter: e } = V(),
    t = Pe([]),
    s = $(() => t.value.length > 0);
  return (
    ee(() => {
      t.value = _e(e.value.outline ?? o.value.outline);
    }),
    { headers: t, hasLocalNav: s }
  );
}
const ms = (o) => (C("data-v-4c7bccde"), (o = o()), H(), o),
  ks = ms(() => v("span", { class: "vpi-chevron-right icon" }, null, -1)),
  bs = { class: "header" },
  $s = { class: "outline" },
  gs = _({
    __name: "VPLocalNavOutlineDropdown",
    props: { headers: {}, navHeight: {} },
    setup(o) {
      const e = o,
        { theme: t } = V(),
        s = w(!1),
        n = w(0),
        r = w(),
        u = w();
      We(r, () => {
        s.value = !1;
      }),
        Ke("Escape", () => {
          s.value = !1;
        }),
        ee(() => {
          s.value = !1;
        });
      function h() {
        (s.value = !s.value),
          (n.value = window.innerHeight + Math.min(window.scrollY - e.navHeight, 0));
      }
      function p(y) {
        y.target.classList.contains("outline-link") &&
          (u.value && (u.value.style.transition = "none"),
          Re(() => {
            s.value = !1;
          }));
      }
      function g() {
        (s.value = !1), window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      }
      return (y, P) => (
        a(),
        c(
          "div",
          {
            class: "VPLocalNavOutlineDropdown",
            style: Le({ "--vp-vh": n.value + "px" }),
            ref_key: "main",
            ref: r,
          },
          [
            y.headers.length > 0
              ? (a(),
                c(
                  "button",
                  { key: 0, onClick: h, class: T({ open: s.value }) },
                  [F(S(i(Ne)(i(t))) + " ", 1), ks],
                  2,
                ))
              : (a(),
                c(
                  "button",
                  { key: 1, onClick: g },
                  S(i(t).returnToTopLabel || "Return to top"),
                  1,
                )),
            m(
              de,
              { name: "flyout" },
              {
                default: d(() => [
                  s.value
                    ? (a(),
                      c(
                        "div",
                        { key: 0, ref_key: "items", ref: u, class: "items", onClick: p },
                        [
                          v("div", bs, [
                            v(
                              "a",
                              { class: "top-link", href: "#", onClick: g },
                              S(i(t).returnToTopLabel || "Return to top"),
                              1,
                            ),
                          ]),
                          v("div", $s, [m(Me, { headers: y.headers }, null, 8, ["headers"])]),
                        ],
                        512,
                      ))
                    : f("", !0),
                ]),
                _: 1,
              },
            ),
          ],
          4,
        )
      );
    },
  }),
  ys = k(gs, [["__scopeId", "data-v-4c7bccde"]]),
  Ps = (o) => (C("data-v-bbaf15df"), (o = o()), H(), o),
  Vs = { class: "container" },
  Ls = ["aria-expanded"],
  Ss = Ps(() => v("span", { class: "vpi-align-left menu-icon" }, null, -1)),
  ws = { class: "menu-text" },
  Is = _({
    __name: "VPLocalNav",
    props: { open: { type: Boolean } },
    emits: ["open-menu"],
    setup(o) {
      const { theme: e, frontmatter: t } = V(),
        { hasSidebar: s } = O(),
        { headers: n } = _s(),
        { y: r } = Se(),
        u = w(0);
      z(() => {
        u.value = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue("--vp-nav-height"),
        );
      }),
        ee(() => {
          n.value = _e(t.value.outline ?? e.value.outline);
        });
      const h = $(() => n.value.length === 0),
        p = $(() => h.value && !s.value),
        g = $(() => ({ VPLocalNav: !0, "has-sidebar": s.value, empty: h.value, fixed: p.value }));
      return (y, P) =>
        i(t).layout !== "home" && (!p.value || i(r) >= u.value)
          ? (a(),
            c(
              "div",
              { key: 0, class: T(g.value) },
              [
                v("div", Vs, [
                  i(s)
                    ? (a(),
                      c(
                        "button",
                        {
                          key: 0,
                          class: "menu",
                          "aria-expanded": y.open,
                          "aria-controls": "VPSidebarNav",
                          onClick: P[0] || (P[0] = (I) => y.$emit("open-menu")),
                        },
                        [Ss, v("span", ws, S(i(e).sidebarMenuLabel || "Menu"), 1)],
                        8,
                        Ls,
                      ))
                    : f("", !0),
                  m(ys, { headers: i(n), navHeight: u.value }, null, 8, ["headers", "navHeight"]),
                ]),
              ],
              2,
            ))
          : f("", !0);
    },
  }),
  Ts = k(Is, [["__scopeId", "data-v-bbaf15df"]]);
function Ns() {
  const o = w(!1);
  function e() {
    (o.value = !0), window.addEventListener("resize", n);
  }
  function t() {
    (o.value = !1), window.removeEventListener("resize", n);
  }
  function s() {
    o.value ? t() : e();
  }
  function n() {
    window.outerWidth >= 768 && t();
  }
  const r = te();
  return q(() => r.path, t), { isScreenOpen: o, openScreen: e, closeScreen: t, toggleScreen: s };
}
const Ms = {},
  As = { class: "VPSwitch", type: "button", role: "switch" },
  Bs = { class: "check" },
  Cs = { key: 0, class: "icon" };
function Hs(o, e) {
  return (
    a(),
    c("button", As, [
      v("span", Bs, [
        o.$slots.default
          ? (a(), c("span", Cs, [l(o.$slots, "default", {}, void 0, !0)]))
          : f("", !0),
      ]),
    ])
  );
}
const Es = k(Ms, [
    ["render", Hs],
    ["__scopeId", "data-v-03442093"],
  ]),
  Ae = (o) => (C("data-v-2db0c0be"), (o = o()), H(), o),
  Fs = Ae(() => v("span", { class: "vpi-sun sun" }, null, -1)),
  Ds = Ae(() => v("span", { class: "vpi-moon moon" }, null, -1)),
  Os = _({
    __name: "VPSwitchAppearance",
    setup(o) {
      const { isDark: e, theme: t } = V(),
        s = oe("toggle-appearance", () => {
          e.value = !e.value;
        }),
        n = $(() =>
          e.value
            ? t.value.lightModeSwitchTitle || "Switch to light theme"
            : t.value.darkModeSwitchTitle || "Switch to dark theme",
        );
      return (r, u) => (
        a(),
        b(
          Es,
          { title: n.value, class: "VPSwitchAppearance", "aria-checked": i(e), onClick: i(s) },
          { default: d(() => [Fs, Ds]), _: 1 },
          8,
          ["title", "aria-checked", "onClick"],
        )
      );
    },
  }),
  me = k(Os, [["__scopeId", "data-v-2db0c0be"]]),
  Us = { key: 0, class: "VPNavBarAppearance" },
  Gs = _({
    __name: "VPNavBarAppearance",
    setup(o) {
      const { site: e } = V();
      return (t, s) =>
        i(e).appearance && i(e).appearance !== "force-dark"
          ? (a(), c("div", Us, [m(me)]))
          : f("", !0);
    },
  }),
  js = k(Gs, [["__scopeId", "data-v-db401546"]]),
  ke = w();
let Be = !1,
  re = 0;
function zs(o) {
  const e = w(!1);
  if (J) {
    !Be && qs(), re++;
    const t = q(ke, (s) => {
      var n, r, u;
      s === o.el.value || ((n = o.el.value) != null && n.contains(s))
        ? ((e.value = !0), (r = o.onFocus) == null || r.call(o))
        : ((e.value = !1), (u = o.onBlur) == null || u.call(o));
    });
    pe(() => {
      t(), re--, re || Ws();
    });
  }
  return Je(e);
}
function qs() {
  document.addEventListener("focusin", Ce), (Be = !0), (ke.value = document.activeElement);
}
function Ws() {
  document.removeEventListener("focusin", Ce);
}
function Ce() {
  ke.value = document.activeElement;
}
const Ks = { class: "VPMenuLink" },
  Rs = _({
    __name: "VPMenuLink",
    props: { item: {} },
    setup(o) {
      const { page: e } = V();
      return (t, s) => (
        a(),
        c("div", Ks, [
          m(
            D,
            {
              class: T({
                active: i(j)(
                  i(e).relativePath,
                  t.item.activeMatch || t.item.link,
                  !!t.item.activeMatch,
                ),
              }),
              href: t.item.link,
              target: t.item.target,
              rel: t.item.rel,
            },
            { default: d(() => [F(S(t.item.text), 1)]), _: 1 },
            8,
            ["class", "href", "target", "rel"],
          ),
        ])
      );
    },
  }),
  se = k(Rs, [["__scopeId", "data-v-d88aa0fe"]]),
  Js = { class: "VPMenuGroup" },
  Ys = { key: 0, class: "title" },
  Qs = _({
    __name: "VPMenuGroup",
    props: { text: {}, items: {} },
    setup(o) {
      return (e, t) => (
        a(),
        c("div", Js, [
          e.text ? (a(), c("p", Ys, S(e.text), 1)) : f("", !0),
          (a(!0),
          c(
            M,
            null,
            E(
              e.items,
              (s) => (
                a(),
                c(
                  M,
                  null,
                  ["link" in s ? (a(), b(se, { key: 0, item: s }, null, 8, ["item"])) : f("", !0)],
                  64,
                )
              ),
            ),
            256,
          )),
        ])
      );
    },
  }),
  Xs = k(Qs, [["__scopeId", "data-v-64399845"]]),
  Zs = { class: "VPMenu" },
  xs = { key: 0, class: "items" },
  en = _({
    __name: "VPMenu",
    props: { items: {} },
    setup(o) {
      return (e, t) => (
        a(),
        c("div", Zs, [
          e.items
            ? (a(),
              c("div", xs, [
                (a(!0),
                c(
                  M,
                  null,
                  E(
                    e.items,
                    (s) => (
                      a(),
                      c(
                        M,
                        { key: s.text },
                        [
                          "link" in s
                            ? (a(), b(se, { key: 0, item: s }, null, 8, ["item"]))
                            : (a(),
                              b(Xs, { key: 1, text: s.text, items: s.items }, null, 8, [
                                "text",
                                "items",
                              ])),
                        ],
                        64,
                      )
                    ),
                  ),
                  128,
                )),
              ]))
            : f("", !0),
          l(e.$slots, "default", {}, void 0, !0),
        ])
      );
    },
  }),
  tn = k(en, [["__scopeId", "data-v-d0cfa421"]]),
  on = (o) => (C("data-v-3ae3b33c"), (o = o()), H(), o),
  sn = ["aria-expanded", "aria-label"],
  nn = { key: 0, class: "text" },
  an = ["innerHTML"],
  rn = on(() => v("span", { class: "vpi-chevron-down text-icon" }, null, -1)),
  ln = { key: 1, class: "vpi-more-horizontal icon" },
  cn = { class: "menu" },
  un = _({
    __name: "VPFlyout",
    props: { icon: {}, button: {}, label: {}, items: {} },
    setup(o) {
      const e = w(!1),
        t = w();
      zs({ el: t, onBlur: s });
      function s() {
        e.value = !1;
      }
      return (n, r) => (
        a(),
        c(
          "div",
          {
            class: "VPFlyout",
            ref_key: "el",
            ref: t,
            onMouseenter: r[1] || (r[1] = (u) => (e.value = !0)),
            onMouseleave: r[2] || (r[2] = (u) => (e.value = !1)),
          },
          [
            v(
              "button",
              {
                type: "button",
                class: "button",
                "aria-haspopup": "true",
                "aria-expanded": e.value,
                "aria-label": n.label,
                onClick: r[0] || (r[0] = (u) => (e.value = !e.value)),
              },
              [
                n.button || n.icon
                  ? (a(),
                    c("span", nn, [
                      n.icon
                        ? (a(), c("span", { key: 0, class: T([n.icon, "option-icon"]) }, null, 2))
                        : f("", !0),
                      n.button
                        ? (a(), c("span", { key: 1, innerHTML: n.button }, null, 8, an))
                        : f("", !0),
                      rn,
                    ]))
                  : (a(), c("span", ln)),
              ],
              8,
              sn,
            ),
            v("div", cn, [
              m(
                tn,
                { items: n.items },
                { default: d(() => [l(n.$slots, "default", {}, void 0, !0)]), _: 3 },
                8,
                ["items"],
              ),
            ]),
          ],
          544,
        )
      );
    },
  }),
  be = k(un, [["__scopeId", "data-v-3ae3b33c"]]),
  dn = ["href", "aria-label", "innerHTML"],
  vn = _({
    __name: "VPSocialLink",
    props: { icon: {}, link: {}, ariaLabel: {} },
    setup(o) {
      const e = o,
        t = $(() =>
          typeof e.icon == "object" ? e.icon.svg : `<span class="vpi-social-${e.icon}" />`,
        );
      return (s, n) => (
        a(),
        c(
          "a",
          {
            class: "VPSocialLink no-icon",
            href: s.link,
            "aria-label": s.ariaLabel ?? (typeof s.icon == "string" ? s.icon : ""),
            target: "_blank",
            rel: "noopener",
            innerHTML: t.value,
          },
          null,
          8,
          dn,
        )
      );
    },
  }),
  pn = k(vn, [["__scopeId", "data-v-74b8741b"]]),
  hn = { class: "VPSocialLinks" },
  fn = _({
    __name: "VPSocialLinks",
    props: { links: {} },
    setup(o) {
      return (e, t) => (
        a(),
        c("div", hn, [
          (a(!0),
          c(
            M,
            null,
            E(
              e.links,
              ({ link: s, icon: n, ariaLabel: r }) => (
                a(),
                b(pn, { key: s, icon: n, link: s, ariaLabel: r }, null, 8, [
                  "icon",
                  "link",
                  "ariaLabel",
                ])
              ),
            ),
            128,
          )),
        ])
      );
    },
  }),
  $e = k(fn, [["__scopeId", "data-v-d83cc2c9"]]),
  _n = { key: 0, class: "group translations" },
  mn = { class: "trans-title" },
  kn = { key: 1, class: "group" },
  bn = { class: "item appearance" },
  $n = { class: "label" },
  gn = { class: "appearance-action" },
  yn = { key: 2, class: "group" },
  Pn = { class: "item social-links" },
  Vn = _({
    __name: "VPNavBarExtra",
    setup(o) {
      const { site: e, theme: t } = V(),
        { localeLinks: s, currentLang: n } = Y({ correspondingLink: !0 }),
        r = $(() => (s.value.length && n.value.label) || e.value.appearance || t.value.socialLinks);
      return (u, h) =>
        r.value
          ? (a(),
            b(
              be,
              { key: 0, class: "VPNavBarExtra", label: "extra navigation" },
              {
                default: d(() => [
                  i(s).length && i(n).label
                    ? (a(),
                      c("div", _n, [
                        v("p", mn, S(i(n).label), 1),
                        (a(!0),
                        c(
                          M,
                          null,
                          E(i(s), (p) => (a(), b(se, { key: p.link, item: p }, null, 8, ["item"]))),
                          128,
                        )),
                      ]))
                    : f("", !0),
                  i(e).appearance && i(e).appearance !== "force-dark"
                    ? (a(),
                      c("div", kn, [
                        v("div", bn, [
                          v("p", $n, S(i(t).darkModeSwitchLabel || "Appearance"), 1),
                          v("div", gn, [m(me)]),
                        ]),
                      ]))
                    : f("", !0),
                  i(t).socialLinks
                    ? (a(),
                      c("div", yn, [
                        v("div", Pn, [
                          m($e, { class: "social-links-list", links: i(t).socialLinks }, null, 8, [
                            "links",
                          ]),
                        ]),
                      ]))
                    : f("", !0),
                ]),
                _: 1,
              },
            ))
          : f("", !0);
    },
  }),
  Ln = k(Vn, [["__scopeId", "data-v-5d60f9f3"]]),
  Sn = (o) => (C("data-v-56764369"), (o = o()), H(), o),
  wn = ["aria-expanded"],
  In = Sn(() =>
    v(
      "span",
      { class: "container" },
      [v("span", { class: "top" }), v("span", { class: "middle" }), v("span", { class: "bottom" })],
      -1,
    ),
  ),
  Tn = [In],
  Nn = _({
    __name: "VPNavBarHamburger",
    props: { active: { type: Boolean } },
    emits: ["click"],
    setup(o) {
      return (e, t) => (
        a(),
        c(
          "button",
          {
            type: "button",
            class: T(["VPNavBarHamburger", { active: e.active }]),
            "aria-label": "mobile navigation",
            "aria-expanded": e.active,
            "aria-controls": "VPNavScreen",
            onClick: t[0] || (t[0] = (s) => e.$emit("click")),
          },
          Tn,
          10,
          wn,
        )
      );
    },
  }),
  Mn = k(Nn, [["__scopeId", "data-v-56764369"]]),
  An = ["innerHTML"],
  Bn = _({
    __name: "VPNavBarMenuLink",
    props: { item: {} },
    setup(o) {
      const { page: e } = V();
      return (t, s) => (
        a(),
        b(
          D,
          {
            class: T({
              VPNavBarMenuLink: !0,
              active: i(j)(
                i(e).relativePath,
                t.item.activeMatch || t.item.link,
                !!t.item.activeMatch,
              ),
            }),
            href: t.item.link,
            noIcon: t.item.noIcon,
            target: t.item.target,
            rel: t.item.rel,
            tabindex: "0",
          },
          { default: d(() => [v("span", { innerHTML: t.item.text }, null, 8, An)]), _: 1 },
          8,
          ["class", "href", "noIcon", "target", "rel"],
        )
      );
    },
  }),
  Cn = k(Bn, [["__scopeId", "data-v-389968b4"]]),
  Hn = _({
    __name: "VPNavBarMenuGroup",
    props: { item: {} },
    setup(o) {
      const e = o,
        { page: t } = V(),
        s = (r) =>
          "link" in r ? j(t.value.relativePath, r.link, !!e.item.activeMatch) : r.items.some(s),
        n = $(() => s(e.item));
      return (r, u) => (
        a(),
        b(
          be,
          {
            class: T({
              VPNavBarMenuGroup: !0,
              active: i(j)(i(t).relativePath, r.item.activeMatch, !!r.item.activeMatch) || n.value,
            }),
            button: r.item.text,
            items: r.item.items,
          },
          null,
          8,
          ["class", "button", "items"],
        )
      );
    },
  }),
  En = (o) => (C("data-v-88463ab2"), (o = o()), H(), o),
  Fn = { key: 0, "aria-labelledby": "main-nav-aria-label", class: "VPNavBarMenu" },
  Dn = En(() =>
    v("span", { id: "main-nav-aria-label", class: "visually-hidden" }, "Main Navigation", -1),
  ),
  On = _({
    __name: "VPNavBarMenu",
    setup(o) {
      const { theme: e } = V();
      return (t, s) =>
        i(e).nav
          ? (a(),
            c("nav", Fn, [
              Dn,
              (a(!0),
              c(
                M,
                null,
                E(
                  i(e).nav,
                  (n) => (
                    a(),
                    c(
                      M,
                      { key: n.text },
                      [
                        "link" in n
                          ? (a(), b(Cn, { key: 0, item: n }, null, 8, ["item"]))
                          : (a(), b(Hn, { key: 1, item: n }, null, 8, ["item"])),
                      ],
                      64,
                    )
                  ),
                ),
                128,
              )),
            ]))
          : f("", !0);
    },
  }),
  Un = k(On, [["__scopeId", "data-v-88463ab2"]]);
function Gn(o) {
  const { localeIndex: e, theme: t } = V();
  function s(n) {
    var A, B, L;
    const r = n.split("."),
      u = (A = t.value.search) == null ? void 0 : A.options,
      h = u && typeof u == "object",
      p =
        (h &&
          ((L = (B = u.locales) == null ? void 0 : B[e.value]) == null
            ? void 0
            : L.translations)) ||
        null,
      g = (h && u.translations) || null;
    let y = p,
      P = g,
      I = o;
    const N = r.pop();
    for (const U of r) {
      let G = null;
      const K = I == null ? void 0 : I[U];
      K && (G = I = K);
      const ne = P == null ? void 0 : P[U];
      ne && (G = P = ne);
      const ae = y == null ? void 0 : y[U];
      ae && (G = y = ae), K || (I = G), ne || (P = G), ae || (y = G);
    }
    return (
      (y == null ? void 0 : y[N]) ??
      (P == null ? void 0 : P[N]) ??
      (I == null ? void 0 : I[N]) ??
      ""
    );
  }
  return s;
}
const jn = ["aria-label"],
  zn = { class: "DocSearch-Button-Container" },
  qn = v("span", { class: "vp-icon DocSearch-Search-Icon" }, null, -1),
  Wn = { class: "DocSearch-Button-Placeholder" },
  Kn = v(
    "span",
    { class: "DocSearch-Button-Keys" },
    [v("kbd", { class: "DocSearch-Button-Key" }), v("kbd", { class: "DocSearch-Button-Key" }, "K")],
    -1,
  ),
  ge = _({
    __name: "VPNavBarSearchButton",
    setup(o) {
      const t = Gn({ button: { buttonText: "Search", buttonAriaLabel: "Search" } });
      return (s, n) => (
        a(),
        c(
          "button",
          {
            type: "button",
            class: "DocSearch DocSearch-Button",
            "aria-label": i(t)("button.buttonAriaLabel"),
          },
          [v("span", zn, [qn, v("span", Wn, S(i(t)("button.buttonText")), 1)]), Kn],
          8,
          jn,
        )
      );
    },
  }),
  Rn = { class: "VPNavBarSearch" },
  Jn = { id: "local-search" },
  Yn = { key: 1, id: "docsearch" },
  Qn = _({
    __name: "VPNavBarSearch",
    setup(o) {
      const e = () => null,
        t = () => null,
        { theme: s } = V(),
        n = w(!1),
        r = w(!1);
      z(() => {});
      function u() {
        n.value || ((n.value = !0), setTimeout(h, 16));
      }
      function h() {
        const y = new Event("keydown");
        (y.key = "k"),
          (y.metaKey = !0),
          window.dispatchEvent(y),
          setTimeout(() => {
            document.querySelector(".DocSearch-Modal") || h();
          }, 16);
      }
      const p = w(!1),
        g = "";
      return (y, P) => {
        var I;
        return (
          a(),
          c("div", Rn, [
            i(g) === "local"
              ? (a(),
                c(
                  M,
                  { key: 0 },
                  [
                    p.value
                      ? (a(), b(i(e), { key: 0, onClose: P[0] || (P[0] = (N) => (p.value = !1)) }))
                      : f("", !0),
                    v("div", Jn, [m(ge, { onClick: P[1] || (P[1] = (N) => (p.value = !0)) })]),
                  ],
                  64,
                ))
              : i(g) === "algolia"
                ? (a(),
                  c(
                    M,
                    { key: 1 },
                    [
                      n.value
                        ? (a(),
                          b(
                            i(t),
                            {
                              key: 0,
                              algolia:
                                ((I = i(s).search) == null ? void 0 : I.options) ?? i(s).algolia,
                              onVnodeBeforeMount: P[2] || (P[2] = (N) => (r.value = !0)),
                            },
                            null,
                            8,
                            ["algolia"],
                          ))
                        : f("", !0),
                      r.value ? f("", !0) : (a(), c("div", Yn, [m(ge, { onClick: u })])),
                    ],
                    64,
                  ))
                : f("", !0),
          ])
        );
      };
    },
  }),
  Xn = _({
    __name: "VPNavBarSocialLinks",
    setup(o) {
      const { theme: e } = V();
      return (t, s) =>
        i(e).socialLinks
          ? (a(),
            b($e, { key: 0, class: "VPNavBarSocialLinks", links: i(e).socialLinks }, null, 8, [
              "links",
            ]))
          : f("", !0);
    },
  }),
  Zn = k(Xn, [["__scopeId", "data-v-79fbe29b"]]),
  xn = ["href", "rel", "target"],
  ea = { key: 1 },
  ta = { key: 2 },
  oa = _({
    __name: "VPNavBarTitle",
    setup(o) {
      const { site: e, theme: t } = V(),
        { hasSidebar: s } = O(),
        { currentLang: n } = Y(),
        r = $(() => {
          var p;
          return typeof t.value.logoLink == "string"
            ? t.value.logoLink
            : (p = t.value.logoLink) == null
              ? void 0
              : p.link;
        }),
        u = $(() => {
          var p;
          return typeof t.value.logoLink == "string" || (p = t.value.logoLink) == null
            ? void 0
            : p.rel;
        }),
        h = $(() => {
          var p;
          return typeof t.value.logoLink == "string" || (p = t.value.logoLink) == null
            ? void 0
            : p.target;
        });
      return (p, g) => (
        a(),
        c(
          "div",
          { class: T(["VPNavBarTitle", { "has-sidebar": i(s) }]) },
          [
            v(
              "a",
              { class: "title", href: r.value ?? i(he)(i(n).link), rel: u.value, target: h.value },
              [
                l(p.$slots, "nav-bar-title-before", {}, void 0, !0),
                i(t).logo
                  ? (a(), b(Z, { key: 0, class: "logo", image: i(t).logo }, null, 8, ["image"]))
                  : f("", !0),
                i(t).siteTitle
                  ? (a(), c("span", ea, S(i(t).siteTitle), 1))
                  : i(t).siteTitle === void 0
                    ? (a(), c("span", ta, S(i(e).title), 1))
                    : f("", !0),
                l(p.$slots, "nav-bar-title-after", {}, void 0, !0),
              ],
              8,
              xn,
            ),
          ],
          2,
        )
      );
    },
  }),
  sa = k(oa, [["__scopeId", "data-v-c290e016"]]),
  na = { class: "items" },
  aa = { class: "title" },
  ra = _({
    __name: "VPNavBarTranslations",
    setup(o) {
      const { theme: e } = V(),
        { localeLinks: t, currentLang: s } = Y({ correspondingLink: !0 });
      return (n, r) =>
        i(t).length && i(s).label
          ? (a(),
            b(
              be,
              {
                key: 0,
                class: "VPNavBarTranslations",
                icon: "vpi-languages",
                label: i(e).langMenuLabel || "Change language",
              },
              {
                default: d(() => [
                  v("div", na, [
                    v("p", aa, S(i(s).label), 1),
                    (a(!0),
                    c(
                      M,
                      null,
                      E(i(t), (u) => (a(), b(se, { key: u.link, item: u }, null, 8, ["item"]))),
                      128,
                    )),
                  ]),
                ]),
                _: 1,
              },
              8,
              ["label"],
            ))
          : f("", !0);
    },
  }),
  ia = k(ra, [["__scopeId", "data-v-4fc0eeec"]]),
  la = (o) => (C("data-v-d2a6f0a8"), (o = o()), H(), o),
  ca = { class: "wrapper" },
  ua = { class: "container" },
  da = { class: "title" },
  va = { class: "content" },
  pa = { class: "content-body" },
  ha = la(() => v("div", { class: "divider" }, [v("div", { class: "divider-line" })], -1)),
  fa = _({
    __name: "VPNavBar",
    props: { isScreenOpen: { type: Boolean } },
    emits: ["toggle-screen"],
    setup(o) {
      const { y: e } = Se(),
        { hasSidebar: t } = O(),
        { frontmatter: s } = V(),
        n = w({});
      return (
        ye(() => {
          n.value = { "has-sidebar": t.value, home: s.value.layout === "home", top: e.value === 0 };
        }),
        (r, u) => (
          a(),
          c(
            "div",
            { class: T(["VPNavBar", n.value]) },
            [
              v("div", ca, [
                v("div", ua, [
                  v("div", da, [
                    m(sa, null, {
                      "nav-bar-title-before": d(() => [
                        l(r.$slots, "nav-bar-title-before", {}, void 0, !0),
                      ]),
                      "nav-bar-title-after": d(() => [
                        l(r.$slots, "nav-bar-title-after", {}, void 0, !0),
                      ]),
                      _: 3,
                    }),
                  ]),
                  v("div", va, [
                    v("div", pa, [
                      l(r.$slots, "nav-bar-content-before", {}, void 0, !0),
                      m(Qn, { class: "search" }),
                      m(Un, { class: "menu" }),
                      m(ia, { class: "translations" }),
                      m(js, { class: "appearance" }),
                      m(Zn, { class: "social-links" }),
                      m(Ln, { class: "extra" }),
                      l(r.$slots, "nav-bar-content-after", {}, void 0, !0),
                      m(
                        Mn,
                        {
                          class: "hamburger",
                          active: r.isScreenOpen,
                          onClick: u[0] || (u[0] = (h) => r.$emit("toggle-screen")),
                        },
                        null,
                        8,
                        ["active"],
                      ),
                    ]),
                  ]),
                ]),
              ]),
              ha,
            ],
            2,
          )
        )
      );
    },
  }),
  _a = k(fa, [["__scopeId", "data-v-d2a6f0a8"]]),
  ma = { key: 0, class: "VPNavScreenAppearance" },
  ka = { class: "text" },
  ba = _({
    __name: "VPNavScreenAppearance",
    setup(o) {
      const { site: e, theme: t } = V();
      return (s, n) =>
        i(e).appearance && i(e).appearance !== "force-dark"
          ? (a(), c("div", ma, [v("p", ka, S(i(t).darkModeSwitchLabel || "Appearance"), 1), m(me)]))
          : f("", !0);
    },
  }),
  $a = k(ba, [["__scopeId", "data-v-c06788e7"]]),
  ga = _({
    __name: "VPNavScreenMenuLink",
    props: { item: {} },
    setup(o) {
      const e = oe("close-screen");
      return (t, s) => (
        a(),
        b(
          D,
          {
            class: "VPNavScreenMenuLink",
            href: t.item.link,
            target: t.item.target,
            rel: t.item.rel,
            onClick: i(e),
          },
          { default: d(() => [F(S(t.item.text), 1)]), _: 1 },
          8,
          ["href", "target", "rel", "onClick"],
        )
      );
    },
  }),
  ya = k(ga, [["__scopeId", "data-v-96c449c0"]]),
  Pa = _({
    __name: "VPNavScreenMenuGroupLink",
    props: { item: {} },
    setup(o) {
      const e = oe("close-screen");
      return (t, s) => (
        a(),
        b(
          D,
          {
            class: "VPNavScreenMenuGroupLink",
            href: t.item.link,
            target: t.item.target,
            rel: t.item.rel,
            onClick: i(e),
          },
          { default: d(() => [F(S(t.item.text), 1)]), _: 1 },
          8,
          ["href", "target", "rel", "onClick"],
        )
      );
    },
  }),
  He = k(Pa, [["__scopeId", "data-v-13a31906"]]),
  Va = { class: "VPNavScreenMenuGroupSection" },
  La = { key: 0, class: "title" },
  Sa = _({
    __name: "VPNavScreenMenuGroupSection",
    props: { text: {}, items: {} },
    setup(o) {
      return (e, t) => (
        a(),
        c("div", Va, [
          e.text ? (a(), c("p", La, S(e.text), 1)) : f("", !0),
          (a(!0),
          c(
            M,
            null,
            E(e.items, (s) => (a(), b(He, { key: s.text, item: s }, null, 8, ["item"]))),
            128,
          )),
        ])
      );
    },
  }),
  wa = k(Sa, [["__scopeId", "data-v-ab21456f"]]),
  Ia = (o) => (C("data-v-70dd0257"), (o = o()), H(), o),
  Ta = ["aria-controls", "aria-expanded"],
  Na = ["innerHTML"],
  Ma = Ia(() => v("span", { class: "vpi-plus button-icon" }, null, -1)),
  Aa = ["id"],
  Ba = { key: 1, class: "group" },
  Ca = _({
    __name: "VPNavScreenMenuGroup",
    props: { text: {}, items: {} },
    setup(o) {
      const e = o,
        t = w(!1),
        s = $(() => `NavScreenGroup-${e.text.replace(" ", "-").toLowerCase()}`);
      function n() {
        t.value = !t.value;
      }
      return (r, u) => (
        a(),
        c(
          "div",
          { class: T(["VPNavScreenMenuGroup", { open: t.value }]) },
          [
            v(
              "button",
              { class: "button", "aria-controls": s.value, "aria-expanded": t.value, onClick: n },
              [v("span", { class: "button-text", innerHTML: r.text }, null, 8, Na), Ma],
              8,
              Ta,
            ),
            v(
              "div",
              { id: s.value, class: "items" },
              [
                (a(!0),
                c(
                  M,
                  null,
                  E(
                    r.items,
                    (h) => (
                      a(),
                      c(
                        M,
                        { key: h.text },
                        [
                          "link" in h
                            ? (a(),
                              c("div", { key: h.text, class: "item" }, [
                                m(He, { item: h }, null, 8, ["item"]),
                              ]))
                            : (a(),
                              c("div", Ba, [
                                m(wa, { text: h.text, items: h.items }, null, 8, ["text", "items"]),
                              ])),
                        ],
                        64,
                      )
                    ),
                  ),
                  128,
                )),
              ],
              8,
              Aa,
            ),
          ],
          2,
        )
      );
    },
  }),
  Ha = k(Ca, [["__scopeId", "data-v-70dd0257"]]),
  Ea = { key: 0, class: "VPNavScreenMenu" },
  Fa = _({
    __name: "VPNavScreenMenu",
    setup(o) {
      const { theme: e } = V();
      return (t, s) =>
        i(e).nav
          ? (a(),
            c("nav", Ea, [
              (a(!0),
              c(
                M,
                null,
                E(
                  i(e).nav,
                  (n) => (
                    a(),
                    c(
                      M,
                      { key: n.text },
                      [
                        "link" in n
                          ? (a(), b(ya, { key: 0, item: n }, null, 8, ["item"]))
                          : (a(),
                            b(Ha, { key: 1, text: n.text || "", items: n.items }, null, 8, [
                              "text",
                              "items",
                            ])),
                      ],
                      64,
                    )
                  ),
                ),
                128,
              )),
            ]))
          : f("", !0);
    },
  }),
  Da = _({
    __name: "VPNavScreenSocialLinks",
    setup(o) {
      const { theme: e } = V();
      return (t, s) =>
        i(e).socialLinks
          ? (a(),
            b($e, { key: 0, class: "VPNavScreenSocialLinks", links: i(e).socialLinks }, null, 8, [
              "links",
            ]))
          : f("", !0);
    },
  }),
  Ee = (o) => (C("data-v-fd7727ae"), (o = o()), H(), o),
  Oa = Ee(() => v("span", { class: "vpi-languages icon lang" }, null, -1)),
  Ua = Ee(() => v("span", { class: "vpi-chevron-down icon chevron" }, null, -1)),
  Ga = { class: "list" },
  ja = _({
    __name: "VPNavScreenTranslations",
    setup(o) {
      const { localeLinks: e, currentLang: t } = Y({ correspondingLink: !0 }),
        s = w(!1);
      function n() {
        s.value = !s.value;
      }
      return (r, u) =>
        i(e).length && i(t).label
          ? (a(),
            c(
              "div",
              { key: 0, class: T(["VPNavScreenTranslations", { open: s.value }]) },
              [
                v("button", { class: "title", onClick: n }, [
                  Oa,
                  F(" " + S(i(t).label) + " ", 1),
                  Ua,
                ]),
                v("ul", Ga, [
                  (a(!0),
                  c(
                    M,
                    null,
                    E(
                      i(e),
                      (h) => (
                        a(),
                        c("li", { key: h.link, class: "item" }, [
                          m(
                            D,
                            { class: "link", href: h.link },
                            { default: d(() => [F(S(h.text), 1)]), _: 2 },
                            1032,
                            ["href"],
                          ),
                        ])
                      ),
                    ),
                    128,
                  )),
                ]),
              ],
              2,
            ))
          : f("", !0);
    },
  }),
  za = k(ja, [["__scopeId", "data-v-fd7727ae"]]),
  qa = { class: "container" },
  Wa = _({
    __name: "VPNavScreen",
    props: { open: { type: Boolean } },
    setup(o) {
      const e = w(null),
        t = we(J ? document.body : null);
      return (s, n) => (
        a(),
        b(
          de,
          {
            name: "fade",
            onEnter: n[0] || (n[0] = (r) => (t.value = !0)),
            onAfterLeave: n[1] || (n[1] = (r) => (t.value = !1)),
          },
          {
            default: d(() => [
              s.open
                ? (a(),
                  c(
                    "div",
                    { key: 0, class: "VPNavScreen", ref_key: "screen", ref: e, id: "VPNavScreen" },
                    [
                      v("div", qa, [
                        l(s.$slots, "nav-screen-content-before", {}, void 0, !0),
                        m(Fa, { class: "menu" }),
                        m(za, { class: "translations" }),
                        m($a, { class: "appearance" }),
                        m(Da, { class: "social-links" }),
                        l(s.$slots, "nav-screen-content-after", {}, void 0, !0),
                      ]),
                    ],
                    512,
                  ))
                : f("", !0),
            ]),
            _: 3,
          },
        )
      );
    },
  }),
  Ka = k(Wa, [["__scopeId", "data-v-e85801d6"]]),
  Ra = { key: 0, class: "VPNav" },
  Ja = _({
    __name: "VPNav",
    setup(o) {
      const { isScreenOpen: e, closeScreen: t, toggleScreen: s } = Ns(),
        { frontmatter: n } = V(),
        r = $(() => n.value.navbar !== !1);
      return (
        Ie("close-screen", t),
        x(() => {
          J && document.documentElement.classList.toggle("hide-nav", !r.value);
        }),
        (u, h) =>
          r.value
            ? (a(),
              c("header", Ra, [
                m(
                  _a,
                  { "is-screen-open": i(e), onToggleScreen: i(s) },
                  {
                    "nav-bar-title-before": d(() => [
                      l(u.$slots, "nav-bar-title-before", {}, void 0, !0),
                    ]),
                    "nav-bar-title-after": d(() => [
                      l(u.$slots, "nav-bar-title-after", {}, void 0, !0),
                    ]),
                    "nav-bar-content-before": d(() => [
                      l(u.$slots, "nav-bar-content-before", {}, void 0, !0),
                    ]),
                    "nav-bar-content-after": d(() => [
                      l(u.$slots, "nav-bar-content-after", {}, void 0, !0),
                    ]),
                    _: 3,
                  },
                  8,
                  ["is-screen-open", "onToggleScreen"],
                ),
                m(
                  Ka,
                  { open: i(e) },
                  {
                    "nav-screen-content-before": d(() => [
                      l(u.$slots, "nav-screen-content-before", {}, void 0, !0),
                    ]),
                    "nav-screen-content-after": d(() => [
                      l(u.$slots, "nav-screen-content-after", {}, void 0, !0),
                    ]),
                    _: 3,
                  },
                  8,
                  ["open"],
                ),
              ]))
            : f("", !0)
      );
    },
  }),
  Ya = k(Ja, [["__scopeId", "data-v-bf8316e5"]]),
  Fe = (o) => (C("data-v-b5d92922"), (o = o()), H(), o),
  Qa = ["role", "tabindex"],
  Xa = Fe(() => v("div", { class: "indicator" }, null, -1)),
  Za = Fe(() => v("span", { class: "vpi-chevron-right caret-icon" }, null, -1)),
  xa = [Za],
  er = { key: 1, class: "items" },
  tr = _({
    __name: "VPSidebarItem",
    props: { item: {}, depth: {} },
    setup(o) {
      const e = o,
        {
          collapsed: t,
          collapsible: s,
          isLink: n,
          isActiveLink: r,
          hasActiveLink: u,
          hasChildren: h,
          toggle: p,
        } = kt($(() => e.item)),
        g = $(() => (h.value ? "section" : "div")),
        y = $(() => (n.value ? "a" : "div")),
        P = $(() => (h.value ? (e.depth + 2 === 7 ? "p" : `h${e.depth + 2}`) : "p")),
        I = $(() => (n.value ? void 0 : "button")),
        N = $(() => [
          [`level-${e.depth}`],
          { collapsible: s.value },
          { collapsed: t.value },
          { "is-link": n.value },
          { "is-active": r.value },
          { "has-active": u.value },
        ]);
      function A(L) {
        ("key" in L && L.key !== "Enter") || (!e.item.link && p());
      }
      function B() {
        e.item.link && p();
      }
      return (L, U) => {
        const G = W("VPSidebarItem", !0);
        return (
          a(),
          b(
            R(g.value),
            { class: T(["VPSidebarItem", N.value]) },
            {
              default: d(() => [
                L.item.text
                  ? (a(),
                    c(
                      "div",
                      Q(
                        { key: 0, class: "item", role: I.value },
                        Qe(L.item.items ? { click: A, keydown: A } : {}, !0),
                        { tabindex: L.item.items && 0 },
                      ),
                      [
                        Xa,
                        L.item.link
                          ? (a(),
                            b(
                              D,
                              {
                                key: 0,
                                tag: y.value,
                                class: "link",
                                href: L.item.link,
                                rel: L.item.rel,
                                target: L.item.target,
                              },
                              {
                                default: d(() => [
                                  (a(),
                                  b(
                                    R(P.value),
                                    { class: "text", innerHTML: L.item.text },
                                    null,
                                    8,
                                    ["innerHTML"],
                                  )),
                                ]),
                                _: 1,
                              },
                              8,
                              ["tag", "href", "rel", "target"],
                            ))
                          : (a(),
                            b(
                              R(P.value),
                              { key: 1, class: "text", innerHTML: L.item.text },
                              null,
                              8,
                              ["innerHTML"],
                            )),
                        L.item.collapsed != null && L.item.items && L.item.items.length
                          ? (a(),
                            c(
                              "div",
                              {
                                key: 2,
                                class: "caret",
                                role: "button",
                                "aria-label": "toggle section",
                                onClick: B,
                                onKeydown: Ye(B, ["enter"]),
                                tabindex: "0",
                              },
                              xa,
                              32,
                            ))
                          : f("", !0),
                      ],
                      16,
                      Qa,
                    ))
                  : f("", !0),
                L.item.items && L.item.items.length
                  ? (a(),
                    c("div", er, [
                      L.depth < 5
                        ? (a(!0),
                          c(
                            M,
                            { key: 0 },
                            E(
                              L.item.items,
                              (K) => (
                                a(),
                                b(G, { key: K.text, item: K, depth: L.depth + 1 }, null, 8, [
                                  "item",
                                  "depth",
                                ])
                              ),
                            ),
                            128,
                          ))
                        : f("", !0),
                    ]))
                  : f("", !0),
              ]),
              _: 1,
            },
            8,
            ["class"],
          )
        );
      };
    },
  }),
  or = k(tr, [["__scopeId", "data-v-b5d92922"]]),
  De = (o) => (C("data-v-c15eb57d"), (o = o()), H(), o),
  sr = De(() => v("div", { class: "curtain" }, null, -1)),
  nr = {
    class: "nav",
    id: "VPSidebarNav",
    "aria-labelledby": "sidebar-aria-label",
    tabindex: "-1",
  },
  ar = De(() =>
    v("span", { class: "visually-hidden", id: "sidebar-aria-label" }, " Sidebar Navigation ", -1),
  ),
  rr = _({
    __name: "VPSidebar",
    props: { open: { type: Boolean } },
    setup(o) {
      const { sidebarGroups: e, hasSidebar: t } = O(),
        s = o,
        n = w(null),
        r = we(J ? document.body : null);
      return (
        q(
          [s, n],
          () => {
            var u;
            s.open ? ((r.value = !0), (u = n.value) == null || u.focus()) : (r.value = !1);
          },
          { immediate: !0, flush: "post" },
        ),
        (u, h) =>
          i(t)
            ? (a(),
              c(
                "aside",
                {
                  key: 0,
                  class: T(["VPSidebar", { open: u.open }]),
                  ref_key: "navEl",
                  ref: n,
                  onClick: h[0] || (h[0] = Xe(() => {}, ["stop"])),
                },
                [
                  sr,
                  v("nav", nr, [
                    ar,
                    l(u.$slots, "sidebar-nav-before", {}, void 0, !0),
                    (a(!0),
                    c(
                      M,
                      null,
                      E(
                        i(e),
                        (p) => (
                          a(),
                          c("div", { key: p.text, class: "group" }, [
                            m(or, { item: p, depth: 0 }, null, 8, ["item"]),
                          ])
                        ),
                      ),
                      128,
                    )),
                    l(u.$slots, "sidebar-nav-after", {}, void 0, !0),
                  ]),
                ],
                2,
              ))
            : f("", !0)
      );
    },
  }),
  ir = k(rr, [["__scopeId", "data-v-c15eb57d"]]),
  lr = _({
    __name: "VPSkipLink",
    setup(o) {
      const e = te(),
        t = w();
      q(
        () => e.path,
        () => t.value.focus(),
      );
      function s({ target: n }) {
        const r = document.getElementById(decodeURIComponent(n.hash).slice(1));
        if (r) {
          const u = () => {
            r.removeAttribute("tabindex"), r.removeEventListener("blur", u);
          };
          r.setAttribute("tabindex", "-1"),
            r.addEventListener("blur", u),
            r.focus(),
            window.scrollTo(0, 0);
        }
      }
      return (n, r) => (
        a(),
        c(
          M,
          null,
          [
            v("span", { ref_key: "backToTop", ref: t, tabindex: "-1" }, null, 512),
            v(
              "a",
              { href: "#VPContent", class: "VPSkipLink visually-hidden", onClick: s },
              " Skip to content ",
            ),
          ],
          64,
        )
      );
    },
  }),
  cr = k(lr, [["__scopeId", "data-v-45efccf3"]]),
  ur = _({
    __name: "Layout",
    setup(o) {
      const { isOpen: e, open: t, close: s } = O(),
        n = te();
      q(() => n.path, s), mt(e, s);
      const { frontmatter: r } = V(),
        u = Ze(),
        h = $(() => !!u["home-hero-image"]);
      return (
        Ie("hero-image-slot-exists", h),
        (p, g) => {
          const y = W("Content");
          return i(r).layout !== !1
            ? (a(),
              c(
                "div",
                { key: 0, class: T(["Layout", i(r).pageClass]) },
                [
                  l(p.$slots, "layout-top", {}, void 0, !0),
                  m(cr),
                  m(ot, { class: "backdrop", show: i(e), onClick: i(s) }, null, 8, [
                    "show",
                    "onClick",
                  ]),
                  m(Ya, null, {
                    "nav-bar-title-before": d(() => [
                      l(p.$slots, "nav-bar-title-before", {}, void 0, !0),
                    ]),
                    "nav-bar-title-after": d(() => [
                      l(p.$slots, "nav-bar-title-after", {}, void 0, !0),
                    ]),
                    "nav-bar-content-before": d(() => [
                      l(p.$slots, "nav-bar-content-before", {}, void 0, !0),
                    ]),
                    "nav-bar-content-after": d(() => [
                      l(p.$slots, "nav-bar-content-after", {}, void 0, !0),
                    ]),
                    "nav-screen-content-before": d(() => [
                      l(p.$slots, "nav-screen-content-before", {}, void 0, !0),
                    ]),
                    "nav-screen-content-after": d(() => [
                      l(p.$slots, "nav-screen-content-after", {}, void 0, !0),
                    ]),
                    _: 3,
                  }),
                  m(Ts, { open: i(e), onOpenMenu: i(t) }, null, 8, ["open", "onOpenMenu"]),
                  m(
                    ir,
                    { open: i(e) },
                    {
                      "sidebar-nav-before": d(() => [
                        l(p.$slots, "sidebar-nav-before", {}, void 0, !0),
                      ]),
                      "sidebar-nav-after": d(() => [
                        l(p.$slots, "sidebar-nav-after", {}, void 0, !0),
                      ]),
                      _: 3,
                    },
                    8,
                    ["open"],
                  ),
                  m(us, null, {
                    "page-top": d(() => [l(p.$slots, "page-top", {}, void 0, !0)]),
                    "page-bottom": d(() => [l(p.$slots, "page-bottom", {}, void 0, !0)]),
                    "not-found": d(() => [l(p.$slots, "not-found", {}, void 0, !0)]),
                    "home-hero-before": d(() => [l(p.$slots, "home-hero-before", {}, void 0, !0)]),
                    "home-hero-info-before": d(() => [
                      l(p.$slots, "home-hero-info-before", {}, void 0, !0),
                    ]),
                    "home-hero-info": d(() => [l(p.$slots, "home-hero-info", {}, void 0, !0)]),
                    "home-hero-info-after": d(() => [
                      l(p.$slots, "home-hero-info-after", {}, void 0, !0),
                    ]),
                    "home-hero-actions-after": d(() => [
                      l(p.$slots, "home-hero-actions-after", {}, void 0, !0),
                    ]),
                    "home-hero-image": d(() => [l(p.$slots, "home-hero-image", {}, void 0, !0)]),
                    "home-hero-after": d(() => [l(p.$slots, "home-hero-after", {}, void 0, !0)]),
                    "home-features-before": d(() => [
                      l(p.$slots, "home-features-before", {}, void 0, !0),
                    ]),
                    "home-features-after": d(() => [
                      l(p.$slots, "home-features-after", {}, void 0, !0),
                    ]),
                    "doc-footer-before": d(() => [
                      l(p.$slots, "doc-footer-before", {}, void 0, !0),
                    ]),
                    "doc-before": d(() => [l(p.$slots, "doc-before", {}, void 0, !0)]),
                    "doc-after": d(() => [l(p.$slots, "doc-after", {}, void 0, !0)]),
                    "doc-top": d(() => [l(p.$slots, "doc-top", {}, void 0, !0)]),
                    "doc-bottom": d(() => [l(p.$slots, "doc-bottom", {}, void 0, !0)]),
                    "aside-top": d(() => [l(p.$slots, "aside-top", {}, void 0, !0)]),
                    "aside-bottom": d(() => [l(p.$slots, "aside-bottom", {}, void 0, !0)]),
                    "aside-outline-before": d(() => [
                      l(p.$slots, "aside-outline-before", {}, void 0, !0),
                    ]),
                    "aside-outline-after": d(() => [
                      l(p.$slots, "aside-outline-after", {}, void 0, !0),
                    ]),
                    "aside-ads-before": d(() => [l(p.$slots, "aside-ads-before", {}, void 0, !0)]),
                    "aside-ads-after": d(() => [l(p.$slots, "aside-ads-after", {}, void 0, !0)]),
                    _: 3,
                  }),
                  m(fs),
                  l(p.$slots, "layout-bottom", {}, void 0, !0),
                ],
                2,
              ))
            : (a(), b(y, { key: 1 }));
        }
      );
    },
  }),
  dr = k(ur, [["__scopeId", "data-v-d0a3e7a7"]]),
  pr = {
    Layout: dr,
    enhanceApp: ({ app: o }) => {
      o.component("Badge", xe);
    },
  };
export { pr as t };
