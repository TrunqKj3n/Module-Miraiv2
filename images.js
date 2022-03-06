module.exports.config = {
	name: "images",
	version: "0.0.1",
	hasPermssion: 0,
	credits: "Thiệu Trung Kiên",
	description: "KCJ",
	commandCategory: "Game",
	usages: "",
	cooldowns: 0,
	envConfig: {
		cooldownTime: 12e5
	}
}, module.exports.onLoad = async function() {
	console.log("================IMAGES LOADING==============")
}, module.exports.run = async function({
	event: e,
	api: a,
	args: n
}) {
	var s = ["Gái", "Trai", "Hentai", "Anime", "Mông", "Kanna", "Cosplay", "Meme"],
		t = s.length,
		o = 1;
	(o = parseInt(n[0]) || 1) < -1 && (o = 1);
	for (var i = Math.ceil(t / 5), p = "", r = 5 * (o - 1); r < 5 * (o - 1) + 5 && !(r >= t); r++) p += `[${r+1}].[${s[r]}]\n\n`;
	return p += `Trang (${o}/${i})\nDùng ${global.config.PREFIX}${this.config.name} <số trang>\n\nReply tin nhắn theo số thứ tự để chọn ảnh!`, a.sendMessage(p, e.threadID, ((a, n) => {
		global.client.handleReply.push({
			name: this.config.name,
			messageID: n.messageID,
			author: e.senderID,
			type: "choose"
		})
	}), e.messageID)
}, module.exports.handleReply = async function({
	event: e,
	api: a,
	args: n,
	handleReply: s
}) {
	const t = require("axios");
	if ("1" == e.body) var o = "https://api-kanekidz.herokuapp.com/gaivuto";
	else if ("2" == e.body) o = "https://apikanekiflop.tk/trai";
	else if ("3" == e.body) o = "https://api-kanekidz.herokuapp.com/hentai";
	else if ("4" == e.body) o = "https://uptime.ocvat2810.repl.co/";
	else if ("5" == e.body) o = "https://api-kanekidz.herokuapp.com/gaiditbu";
	else if ("6" == e.body) o = "https://apichitanda-1.khanh-huyenhuy3.repl.co/kana.php";
	else if ("7" == e.body) o = "https://api.vinhbeat.ga/cosplay.php";
	else if ("8" == e.body) o = "https://api.ryder447.repl.co/meme";
	if ("choose" === s.type) {
		a.unsendMessage(s.messageID);
		const n = (await t.get(o)).data.data,
			i = (await t.get(n, {
				responseType: "stream"
			})).data;
		return a.sendMessage({
			body: "[DONE]",
			attachment: i
		}, e.threadID)
	}
};
