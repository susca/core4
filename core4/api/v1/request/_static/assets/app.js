(function(e){function t(t){for(var r,a,l=t[0],i=t[1],c=t[2],s=0,p=[];s<l.length;s++)a=l[s],o[a]&&p.push(o[a][0]),o[a]=0;for(r in i)Object.prototype.hasOwnProperty.call(i,r)&&(e[r]=i[r]);f&&f(t);while(p.length)p.shift()();return u.push.apply(u,c||[]),n()}function n(){for(var e,t=0;t<u.length;t++){for(var n=u[t],r=!0,l=1;l<n.length;l++){var i=n[l];0!==o[i]&&(r=!1)}r&&(u.splice(t--,1),e=a(a.s=n[0]))}return e}var r={},o={app:0},u=[];function a(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,a),n.l=!0,n.exports}a.m=e,a.c=r,a.d=function(e,t,n){a.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},a.t=function(e,t){if(1&t&&(e=a(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(a.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)a.d(n,r,function(t){return e[t]}.bind(null,r));return n},a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,"a",t),t},a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},a.p="";var l=window["webpackJsonp"]=window["webpackJsonp"]||[],i=l.push.bind(l);l.push=t,l=l.slice();for(var c=0;c<l.length;c++)t(l[c]);var f=i;u.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"56d7":function(e,t,n){"use strict";n.r(t);n("cadf"),n("551c"),n("f751"),n("097d");var r=n("2b0e"),o=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("pnbi-webapp",[n("div",{attrs:{slot:"router"},slot:"router"},[n("router-view")],1)])},u=[],a={name:"CORE4OS-Landingpage"},l=a,i=n("2877"),c=Object(i["a"])(l,o,u,!1,null,null,null),f=c.exports,s=n("8c4f"),p=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div")},d=[],v={},b=Object(i["a"])(v,p,d,!1,null,null,null),w=b.exports;r["default"].use(s["a"]);var h=new s["a"]({routes:[{path:"*",meta:{auth:!0,hideNav:!1,title:"Entry"},name:"entry",component:w,beforeEnter:function(e,t,n){var r=window.localStorage.getItem("user");r&&window.location.assign(window.REDIRECTION)}}]}),g=n("2f62");r["default"].use(g["a"]);var m=new g["a"].Store({state:{},mutations:{},actions:{}}),y=n("bf94"),O=(n("9b54"),n("903a")),E=n("23e6");r["default"].use(y["a"],{router:h,config:{DARK:!0,THEME:O["a"],TITLE:"Welcome to CORE4OS",APP_IDENTIFIER:"welcome-to-core4os"},store:m}),r["default"].config.productionTip=!1,new r["default"]({i18n:E["a"],router:h,store:m,render:function(e){return e(f)}}).$mount("#app")}});