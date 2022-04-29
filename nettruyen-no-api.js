"use strict";
var got = require("got"),
	cheerio = require("cheerio"),
	fs = require("fs-extra"),
	axios = require("axios");
module.exports.config = {
	name: "nettruyen",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "Thiệu Trung Kiên",
	description: "",
	commandCategory: "cc",
	usages: "",
	cooldowns: 0
}, module.exports.onLoad = async function() {
	fs.existsSync(__dirname + "/nettruyen") || fs.mkdirSync(__dirname + "/nettruyen", {
		recursive: !0
	})
}, module.exports.run = async function(e) {
	var t = this,
		a = e.api,
		n = e.event,
		r = e.args;
	if (!r[0]) return a.sendMessage("Thieu keyword", n.threadID);
	for (var i = await got("http://www.nettruyenone.com/tim-truyen?keyword=" + encodeURIComponent(r.join(" "))), o = cheerio.load(i.body), s = o("#ctl00_divCenter").find(".Module-170 > div > div > div > div > figure > div > a"), d = [], c = 0; c < s.length; c++) {
		var l = o(s[c]).attr("title"),
			u = o(s[c]).find("img").attr("data-original").replace("//", "https://"),
			h = o(s[c]).attr("href");
		d.push({
			title: l,
			images: u,
			url: h
		})
	}
	var p = d.length,
		g = 1;
	(g = parseInt(r[1]) || 1) < -1 && (g = 1), Math.ceil(p / 5);
	for (var m = "", f = [], y = 5 * (g - 1); y < 5 * (g - 1) + 5 && !(y >= p); y++) {
		var v = d[y].title,
			w = (await axios.get(d[y].images, {
				responseType: "stream"
			})).data;
		f.push(w), m = m + "[" + (y + 1) + "]." + v + "\n\n"
	}
	var x = d;
	return a.sendMessage({
		body: m,
		attachment: f
	}, n.threadID, (function(e, a) {
		global.client.handleReply.push({
			name: t.config.name,
			messageID: a.messageID,
			author: n.senderID,
			url: x,
			type: "info"
		})
	}), n.messageID)
}, module.exports.handleReply = async function(e) {
	var t = this,
		a = e.handleReply,
		n = e.api,
		r = e.event;
	if (a.author != r.senderID) return n.sendMessage("Cut", r.threadID);
	switch (a.type) {
		case "info":
			for (var i = await got(a.url[r.body - 1].url), o = (h = cheerio.load(i.body))("#ctl00_divCenter > article"), s = (h(o).find("h1").text(), []), d = h(".list-chapter > nav > ul > li").find(".col-xs-5 > a"), c = 0; c < d.length; c++) {
				var l = h(d[c]).attr("href");
				s.push(l)
			}
			s.reverse();
			var u = s;
			return n.sendMessage("Hiện tại đang có " + s.length + " chap!\nVui lòng reply số thứ tự để chọn", r.threadID, (function(e, a) {
				global.client.handleReply.push({
					name: t.config.name,
					messageID: a.messageID,
					author: r.senderID,
					chapter: u,
					type: "read"
				})
			}), r.messageID);
		case "read":
			for (var h, p = [], g = [], m = (i = await got(a.chapter[r.body - 1]), (h = cheerio.load(i.body))("#ctl00_divCenter > div").find(".reading-detail > div").find("img")), f = [], y = 0; y < m.length; y++) {
				var v = h(m[y]).attr("data-original").replace("//", "https://");
				f.push(v)
			}
			var w, x = async function(e) {
				await axios({
					method: "get",
					url: "" + f[e],
					responseType: "stream",
					headers: {
						Referer: "http://www.nettruyenone.com/",
						Connection: "keep-alive",
						Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
						"Accept-Encoding": "gzip, deflate"
					}
				}).then((function(t) {
					t.data.pipe(fs.createWriteStream(__dirname + "/nettruyen/" + e + ".jpg"))
				}))
			};
			for (w in f) await x(w);
			setTimeout((function() {
				for (var e = 0; e < f.length; e++) p.push(fs.createReadStream(__dirname + "/nettruyen/" + e + ".jpg")), g.push(__dirname + "/nettruyen/" + e + ".jpg");
				return n.sendMessage({
					body: "ok",
					attachment: p
				}, r.threadID, (function() {
					var e = !0,
						t = !1,
						a = void 0;
					try {
						for (var n, r = g[Symbol.iterator](); !(e = (n = r.next()).done); e = !0) {
							var i = n.value;
							fs.unlinkSync(i)
						}
					} catch (e) {
						t = !0, a = e
					} finally {
						try {
							!e && r.return && r.return()
						} finally {
							if (t) throw a
						}
					}
				}))
			}), 1e4)
	}
};
