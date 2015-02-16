define("grunn-sync/app",["exports","ember","ember/resolver","ember/load-initializers","grunn-sync/config/environment"],function(e,t,n,r,a){"use strict";t["default"].MODEL_FACTORY_INJECTIONS=!0;var i=t["default"].Application.extend({modulePrefix:a["default"].modulePrefix,podModulePrefix:a["default"].podModulePrefix,Resolver:n["default"]});r["default"](i,a["default"].modulePrefix),e["default"]=i}),define("grunn-sync/components/bs-button-group",["exports","ember","ember-bootstrap/components/bs-button-group"],function(e,t,n){"use strict";e["default"]=n["default"]}),define("grunn-sync/components/bs-button",["exports","ember","ember-bootstrap/components/bs-button"],function(e,t,n){"use strict";e["default"]=n["default"]}),define("grunn-sync/controllers/application",["exports","ember"],function(e,t){"use strict";var n=t["default"].Object.extend({controller:null,topic:"",docsForTopic:t["default"].computed.filter("controller.allDocs.@each.topic",function(e){return e.get("normalizedTopic")===this.get("topic")}),usersForTopic:t["default"].computed.mapBy("docsForTopic","user"),uniqUsers:t["default"].computed.uniq("usersForTopic"),count:t["default"].computed.alias("uniqUsers.length")});e["default"]=t["default"].Controller.extend({pouchdb:t["default"].inject.service(),session:t["default"].inject.service(),connection:t["default"].inject.service(),topic:"",allDocs:t["default"].computed.alias("pouchdb.allDocs"),myDocs:t["default"].computed.filter("allDocs.@each.user",function(e){return e.get("user")===this.get("session.username")}),allTopics:t["default"].computed.mapBy("allDocs","normalizedTopic"),uniqTopics:t["default"].computed.uniq("allTopics"),nonEmptyTopics:t["default"].computed.filter("uniqTopics",function(e){return!t["default"].isEmpty(e)}),topics:t["default"].computed.map("nonEmptyTopics",function(e){return n.create({controller:this,topic:e})}),sortedBy:["count:desc"],sortedTopics:t["default"].computed.sort("topics","sortedBy")})}),define("grunn-sync/initializers/app-version",["exports","grunn-sync/config/environment","ember"],function(e,t,n){"use strict";var r=n["default"].String.classify;e["default"]={name:"App Version",initialize:function(e,a){var i=r(a.toString());n["default"].libraries.register(i,t["default"].APP.version)}}}),define("grunn-sync/initializers/connection-service",["exports"],function(e){"use strict";function t(e,t){t.inject("route","connectionService","service:connection")}e.initialize=t,e["default"]={name:"connection-service",initialize:t}}),define("grunn-sync/initializers/ember-cli-fastclick",["exports","ember"],function(e,t){"use strict";var n={name:"fastclick",initialize:function(){t["default"].run.schedule("afterRender",function(){FastClick.attach(document.body)})}};e["default"]=n}),define("grunn-sync/initializers/export-application-global",["exports","ember","grunn-sync/config/environment"],function(e,t,n){"use strict";function r(e,r){var a=t["default"].String.classify(n["default"].modulePrefix);n["default"].exportApplicationGlobal&&!window[a]&&(window[a]=r)}e.initialize=r,e["default"]={name:"export-application-global",initialize:r}}),define("grunn-sync/initializers/pouchdb-service",["exports"],function(e){"use strict";function t(e,t){t.inject("route","pouchdbService","service:pouchdb")}e.initialize=t,e["default"]={name:"pouchdb-service",initialize:t}}),define("grunn-sync/initializers/session-service",["exports"],function(e){"use strict";function t(e,t){t.inject("route","sessionService","service:session")}e.initialize=t,e["default"]={name:"session-service",initialize:t}}),define("grunn-sync/models/doc",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Object.extend({pouchdb:t["default"].inject.service(),session:t["default"].inject.service(),_id:function(){return Math.random().toString(36).substr(2,10)}.property(),user:function(){return this.get("content.user")||this.get("session.username")}.property("content.user","session.username"),normalizedTopic:function(){return(this.get("topic")||"").trim().toLowerCase()}.property("topic"),load:function(){var e=this.get("_id"),t=this;return this.get("pouchdb.db").get(e).then(function(e){t.setProperties(e)},function(){}),this},save:function(){var e=this.getProperties("_id","_rev","user","topic");return t["default"].isEmpty(e._rev)&&delete e._rev,this.get("pouchdb.db").put(e),this},remove:function(){var e=this.getProperties("_id","_rev");return t["default"].isEmpty(e._rev)||this.get("pouchdb.db").remove(e),this}})}),define("grunn-sync/router",["exports","ember","grunn-sync/config/environment"],function(e,t,n){"use strict";var r=t["default"].Router.extend({location:n["default"].locationType});r.map(function(){}),e["default"]=r}),define("grunn-sync/routes/application",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Route.extend({actions:{addTopic:function(e){if(e=e||this.controller.get("topic"),!t["default"].isEmpty(e)){var n=this.container.lookupFactory("model:doc");n.create({topic:e}).save(),this.set("controller.topic","")}},removeTopic:function(e){e.remove()}}})}),define("grunn-sync/services/connection",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Object.extend({isOnline:function(){return window.navigator.onLine}.property(),_listenOnOffline:function(){var e=this,t=function(){e.set("isOnline",!0)},n=function(){e.set("isOnline",!1)};window.addEventListener?(window.addEventListener("online",t,!1),window.addEventListener("offline",n,!1)):(document.body.ononline=t,document.body.onoffline=n)}.on("init")})}),define("grunn-sync/services/pouchdb",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Object.extend({db:new PouchDB("topics"),allDocIds:function(){var e=t["default"].A([]);return this.db.allDocs().then(function(t){console.log("got allDocIds",t),t.rows.forEach(function(t){e.addObject(t.id)})}),e}.property(),allDocs:t["default"].computed.map("allDocIds",function(e){var t=this.container.lookupFactory("model:doc");return t.create({_id:e}).load()}),listenForChanges:function(){var e=this.get("allDocIds"),t=this.get("allDocs");this.db.changes({live:!0,since:"now"}).on("change",function(n){var r=n.changes[0].rev;if(console.log("got change",n),n.deleted)e.removeObject(n.id);else if(1===parseInt(r,10))e.addObject(n.id);else{var a=t.filterBy("_id",n.id)[0];a&&a.get("_rev")!==r&&a.load()}})}.on("init"),connection:t["default"].inject.service(),sync:null,syncStatus:"",initSync:function(){var e=this.get("sync");return e&&e.cancel&&e.cancel(),this.get("connection.isOnline")?void t["default"].run.later(this,function(){var e=this;this.set("sync",this.db.sync("http://grunnjs.iriscouch.com/topics",{live:!0,retry:!0}).on("paused",function(n){t["default"].run(function(){e.set("syncStatus",n?"retrying":"synced")})}).on("active",function(){t["default"].run(function(){e.set("syncStatus","syncing")})}).on("error",function(){t["default"].run(function(){e.set("syncStatus","errored")})}))},100):void this.set("syncStatus","")}.observes("connection.isOnline").on("init")})}),define("grunn-sync/services/session",["exports","ember"],function(e,t){"use strict";e["default"]=t["default"].Object.extend({username:function(e,n){if(arguments.length>1)return localStorage.setItem("username",n),n;var r=localStorage.getItem("username");return t["default"].isEmpty(r)?(r=Math.random().toString(36).substr(2,6),localStorage.setItem("username",r),r):r}.property()})}),define("grunn-sync/templates/application",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){var e=function(){return{isHTMLBars:!0,blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),n=e.createTextNode("        ");e.appendChild(t,n);var n=e.createElement("span");e.setAttribute(n,"class","label label-success pull-right");var r=e.createTextNode("online ");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n");return e.appendChild(t,n),t},render:function(e,t,n){var r=t.dom,a=t.hooks,i=a.content;r.detectNamespace(n);var c;t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(c=this.build(r),this.hasRendered?this.cachedFragment=c:this.hasRendered=!0),this.cachedFragment&&(c=r.cloneNode(this.cachedFragment,!0))):c=this.build(r);var d=r.createMorphAt(r.childAt(c,[1]),0,-1);return i(t,d,e,"pouchdb.syncStatus"),c}}}(),t=function(){return{isHTMLBars:!0,blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),n=e.createTextNode("        ");e.appendChild(t,n);var n=e.createElement("span");e.setAttribute(n,"class","label label-info pull-right");var r=e.createTextNode("offline ");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n");return e.appendChild(t,n),t},render:function(e,t,n){var r=t.dom,a=t.hooks,i=a.content;r.detectNamespace(n);var c;t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(c=this.build(r),this.hasRendered?this.cachedFragment=c:this.hasRendered=!0),this.cachedFragment&&(c=r.cloneNode(this.cachedFragment,!0))):c=this.build(r);var d=r.createMorphAt(r.childAt(c,[1]),0,-1);return i(t,d,e,"pouchdb.syncStatus"),c}}}(),n=function(){return{isHTMLBars:!0,blockParams:1,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),n=e.createTextNode("          ");e.appendChild(t,n);var n=e.createElement("li");e.setAttribute(n,"class","list-group-item");var r=e.createTextNode("\n            ");e.appendChild(n,r);var r=e.createElement("span");e.setAttribute(r,"class","glyphicon glyphicon-minus-sign pull-right text-danger"),e.appendChild(n,r);var r=e.createTextNode("\n            ");e.appendChild(n,r);var r=e.createTextNode("\n            ");e.appendChild(n,r);var r=e.createElement("div");e.setAttribute(r,"class","clearfix"),e.appendChild(n,r);var r=e.createTextNode("\n          ");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n");return e.appendChild(t,n),t},render:function(e,t,n,r){var a=t.dom,i=t.hooks,c=i.set,d=i.get,o=i.element,s=i.content;a.detectNamespace(n);var l;t.useFragmentCache&&a.canClone?(null===this.cachedFragment&&(l=this.build(a),this.hasRendered?this.cachedFragment=l:this.hasRendered=!0),this.cachedFragment&&(l=a.cloneNode(this.cachedFragment,!0))):l=this.build(a);var u=a.childAt(l,[1]),p=a.createMorphAt(u,2,3);return c(t,e,"doc",r[0]),o(t,u,e,"action",["removeTopic",d(t,e,"doc")],{}),s(t,p,e,"doc.topic"),l}}}(),r=function(){return{isHTMLBars:!0,blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),n=e.createTextNode("          ");e.appendChild(t,n);var n=e.createElement("li");e.setAttribute(n,"class","list-group-item disabled");var r=e.createTextNode("\n            Please share your favorite topics with us\n          ");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n");return e.appendChild(t,n),t},render:function(e,t,n){var r=t.dom;r.detectNamespace(n);var a;return t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(a=this.build(r),this.hasRendered?this.cachedFragment=a:this.hasRendered=!0),this.cachedFragment&&(a=r.cloneNode(this.cachedFragment,!0))):a=this.build(r),a}}}(),a=function(){return{isHTMLBars:!0,blockParams:1,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),n=e.createTextNode("          ");e.appendChild(t,n);var n=e.createElement("li");e.setAttribute(n,"class","list-group-item");var r=e.createTextNode("\n            ");e.appendChild(n,r);var r=e.createElement("span");e.setAttribute(r,"class","badge"),e.appendChild(n,r);var r=e.createTextNode("\n            ");e.appendChild(n,r);var r=e.createElement("span");e.setAttribute(r,"class","glyphicon glyphicon-plus-sign text-success"),e.appendChild(n,r);var r=e.createTextNode("\n            ");e.appendChild(n,r);var r=e.createTextNode("\n          ");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n");return e.appendChild(t,n),t},render:function(e,t,n,r){var a=t.dom,i=t.hooks,c=i.set,d=i.get,o=i.element,s=i.content;a.detectNamespace(n);var l;t.useFragmentCache&&a.canClone?(null===this.cachedFragment&&(l=this.build(a),this.hasRendered?this.cachedFragment=l:this.hasRendered=!0),this.cachedFragment&&(l=a.cloneNode(this.cachedFragment,!0))):l=this.build(a);var u=a.childAt(l,[1]),p=a.createMorphAt(a.childAt(u,[1]),-1,-1),h=a.createMorphAt(u,4,5);return c(t,e,"helper",r[0]),o(t,u,e,"action",["addTopic",d(t,e,"helper.topic")],{}),s(t,p,e,"helper.count"),s(t,h,e,"helper.topic"),l}}}();return{isHTMLBars:!0,blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),n=e.createElement("div");e.setAttribute(n,"class","container-fluid");var r=e.createTextNode("\n  ");e.appendChild(n,r);var r=e.createElement("div");e.setAttribute(r,"class","row");var a=e.createTextNode("\n    ");e.appendChild(r,a);var a=e.createElement("div");e.setAttribute(a,"class","col-sm-6");var i=e.createTextNode("\n");e.appendChild(a,i);var i=e.createTextNode("\n      ");e.appendChild(a,i);var i=e.createElement("h2"),c=e.createTextNode("My interests");e.appendChild(i,c),e.appendChild(a,i);var i=e.createTextNode("\n      ");e.appendChild(a,i);var i=e.createElement("div");e.setAttribute(i,"class","input-group");var c=e.createTextNode("\n        ");e.appendChild(i,c);var c=e.createTextNode("\n        ");e.appendChild(i,c);var c=e.createElement("span");e.setAttribute(c,"class","input-group-btn");var d=e.createTextNode("\n          ");e.appendChild(c,d);var d=e.createElement("a");e.setAttribute(d,"class","btn btn-primary");var o=e.createTextNode("Add topic");e.appendChild(d,o),e.appendChild(c,d);var d=e.createTextNode("\n        ");e.appendChild(c,d),e.appendChild(i,c);var c=e.createTextNode("\n      ");e.appendChild(i,c),e.appendChild(a,i);var i=e.createTextNode("\n      ");e.appendChild(a,i);var i=e.createElement("ul");e.setAttribute(i,"class","list-group");var c=e.createTextNode("\n");e.appendChild(i,c);var c=e.createTextNode("      ");e.appendChild(i,c),e.appendChild(a,i);var i=e.createTextNode("\n    ");e.appendChild(a,i),e.appendChild(r,a);var a=e.createTextNode("\n\n    ");e.appendChild(r,a);var a=e.createElement("div");e.setAttribute(a,"class","col-sm-6");var i=e.createTextNode("\n      ");e.appendChild(a,i);var i=e.createElement("h2"),c=e.createTextNode("GrunnJS interests");e.appendChild(i,c),e.appendChild(a,i);var i=e.createTextNode("\n\n      ");e.appendChild(a,i);var i=e.createElement("ul");e.setAttribute(i,"class","list-group");var c=e.createTextNode("\n");e.appendChild(i,c);var c=e.createTextNode("      ");e.appendChild(i,c),e.appendChild(a,i);var i=e.createTextNode("\n    ");e.appendChild(a,i),e.appendChild(r,a);var a=e.createTextNode("\n  ");e.appendChild(r,a),e.appendChild(n,r);var r=e.createTextNode("\n");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n\n");e.appendChild(t,n);var n=e.createElement("div");e.setAttribute(n,"class","container text-center");var r=e.createTextNode("\n  ");e.appendChild(n,r);var r=e.createElement("a");e.setAttribute(r,"href","https://github.com/ssured/grunnsync"),e.setAttribute(r,"class","text-default");var a=e.createTextNode("\n    Sjoerd de Jong - MIT license 2015 - @ssured\n  ");e.appendChild(r,a),e.appendChild(n,r);var r=e.createTextNode("\n");e.appendChild(n,r),e.appendChild(t,n);var n=e.createTextNode("\n\n");return e.appendChild(t,n),t},render:function(i,c,d){var o=c.dom,s=c.hooks,l=s.get,u=s.block,p=s.inline,h=s.element;o.detectNamespace(d);var m;c.useFragmentCache&&o.canClone?(null===this.cachedFragment&&(m=this.build(o),this.hasRendered?this.cachedFragment=m:this.hasRendered=!0),this.cachedFragment&&(m=o.cloneNode(this.cachedFragment,!0))):m=this.build(o);var f=o.childAt(m,[0,1]),v=o.childAt(f,[1]),g=o.childAt(v,[4]),b=o.childAt(g,[2,1]),C=o.createMorphAt(v,0,1),x=o.createMorphAt(g,0,1),T=o.createMorphAt(o.childAt(v,[6]),0,1),y=o.createMorphAt(o.childAt(f,[3,3]),0,1);return u(c,C,i,"if",[l(c,i,"connection.isOnline")],{},e,t),p(c,x,i,"input",[],{value:l(c,i,"topic"),"class":"form-control",placeholder:"What interests you?","insert-newline":"addTopic"}),h(c,b,i,"action",["addTopic"],{}),u(c,T,i,"each",[l(c,i,"myDocs")],{},n,r),u(c,y,i,"each",[l(c,i,"sortedTopics")],{},a,null),m}}}())}),define("grunn-sync/templates/components/bs-button",["exports"],function(e){"use strict";e["default"]=Ember.HTMLBars.template(function(){var e=function(){return{isHTMLBars:!0,blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),n=e.createElement("i");e.appendChild(t,n);var n=e.createTextNode(" ");return e.appendChild(t,n),t},render:function(e,t,n){var r=t.dom,a=t.hooks,i=a.element;r.detectNamespace(n);var c;t.useFragmentCache&&r.canClone?(null===this.cachedFragment&&(c=this.build(r),this.hasRendered?this.cachedFragment=c:this.hasRendered=!0),this.cachedFragment&&(c=r.cloneNode(this.cachedFragment,!0))):c=this.build(r);var d=r.childAt(c,[0]);return i(t,d,e,"bind-attr",[],{"class":"icon"}),c}}}();return{isHTMLBars:!0,blockParams:0,cachedFragment:null,hasRendered:!1,build:function(e){var t=e.createDocumentFragment(),n=e.createTextNode("");e.appendChild(t,n);var n=e.createTextNode("");e.appendChild(t,n);var n=e.createTextNode("");e.appendChild(t,n);var n=e.createTextNode("");return e.appendChild(t,n),t},render:function(t,n,r){var a=n.dom,i=n.hooks,c=i.get,d=i.block,o=i.content;a.detectNamespace(r);var s;n.useFragmentCache&&a.canClone?(null===this.cachedFragment&&(s=this.build(a),this.hasRendered?this.cachedFragment=s:this.hasRendered=!0),this.cachedFragment&&(s=a.cloneNode(this.cachedFragment,!0))):s=this.build(a),this.cachedFragment&&a.repairClonedNode(s,[0,1,2,3]);var l=a.createMorphAt(s,0,1,r),u=a.createMorphAt(s,1,2,r),p=a.createMorphAt(s,2,3,r);return d(n,l,t,"if",[c(n,t,"icon")],{},e,null),o(n,u,t,"text"),o(n,p,t,"yield"),s}}}())}),define("grunn-sync/config/environment",["ember"],function(e){var t="grunn-sync";try{var n=t+"/config/environment",r=e["default"].$('meta[name="'+n+'"]').attr("content"),a=JSON.parse(unescape(r));return{"default":a}}catch(i){throw new Error('Could not read config from meta tag with name "'+n+'".')}}),runningTests?require("grunn-sync/tests/test-helper"):require("grunn-sync/app")["default"].create({name:"grunn-sync",version:"0.0.0.0815ccf0"});