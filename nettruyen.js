const fs = require("fs-extra"),
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
}, module.exports.run = async function({
	api: e,
	event: t,
	args: a
}) {
	if (!a[0]) return e.sendMessage("Thieu keyword", t.threadID);
	const n = await axios.get(`https://nettruyen-crawl.herokuapp.com/search?name=${encodeURIComponent(a.join(" "))}`);
	var s = n.data.length,
		r = 1;
	(r = parseInt(a[1]) || 1) < -1 && (r = 1);
	Math.ceil(s / 5);
	for (var o = "", i = [], c = 5 * (r - 1); c < 5 * (r - 1) + 5 && !(c >= s); c++) {
		const e = n.data[c].title,
			t = (await axios.get(n.data[c].images, {
				responseType: "stream"
			})).data;
		i.push(t), o += `[${c+1}].${e}\n\n`
	}
	const d = n.data;
	return e.sendMessage({
		body: o,
		attachment: i
	}, t.threadID, ((e, a) => {
		global.client.handleReply.push({
			name: this.config.name,
			messageID: a.messageID,
			author: t.senderID,
			url: d,
			type: "info"
		})
	}), t.messageID)
}, module.exports.handleReply = async function({
	handleReply: e,
	api: t,
	event: a
}) {
	if (e.author != a.senderID) return t.sendMessage("Cut", a.threadID);
	switch (e.type) {
		case "info": {
			const n = await axios.get(`https://nettruyen-crawl.herokuapp.com/info?link=${e.url[a.body-1].url}`),
				s = n.data;
			return t.sendMessage("Hiện tại đang có " + n.data.length + " chap!\nVui lòng reply số thứ tự để chọn", a.threadID, ((e, t) => {
				global.client.handleReply.push({
					name: this.config.name,
					messageID: t.messageID,
					author: a.senderID,
					chapter: s,
					type: "read"
				})
			}), a.messageID)
		}
		case "read": {
			const o = await axios.get(`https://nettruyen-crawl.herokuapp.com/read?link=${e.chapter[a.body-1]}`);
			var n = [],
				s = [];
			const i = [];
			for (var r in o.data) {
				const e = o.data[r];
				i.push(e)
			}
			for (let e in i) await axios({
				method: "get",
				url: `${i[e]}`,
				responseType: "stream",
				headers: {
					Referer: "http://www.nettruyenone.com/",
					Connection: "keep-alive",
					Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
					"Accept-Encoding": "gzip, deflate"
				}
			}).then((function(t) {
				t.data.pipe(fs.createWriteStream(__dirname + `/nettruyen/${e}.jpg`))
			}));
			setTimeout((() => {
				for (let e = 0; e < i.length; e++) n.push(fs.createReadStream(__dirname + `/nettruyen/${e}.jpg`)), s.push(__dirname + `/nettruyen/${e}.jpg`);
				return t.sendMessage({
					body: "ok",
					attachment: n
				}, a.threadID, (() => {
					for (let e of s) fs.unlinkSync(e)
				}))
			}), 10000)
		}
	}
};
