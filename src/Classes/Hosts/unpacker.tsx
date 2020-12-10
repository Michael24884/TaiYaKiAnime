//Credits to Arkon https://gist.github.com/arkon/c8bea3a410d07d0682d73193941e2e94
export function unPack(code: any): string {
	function indent(code: any) {
		let tabs = 0,
			old = -1,
			add = "";
		try {
			for (var i = 0; i < code.length; i++) {
				if (code[i].indexOf("{") != -1) tabs++;
				if (code[i].indexOf("}") != -1) tabs--;

				if (old != tabs) {
					old = tabs;
					add = "";
					while (old > 0) {
						add += "\t";
						old--;
					}
					old = tabs;
				}

				code[i] = add + code[i];
			}
		} finally {
			tabs = 0;
			old = 0;
			add = "";
		}
		return code;
	}

	var env = {
		eval: function (c: any) {
			code = c;
		},
		window: {},
		document: {},
	};

	eval("with(env) {" + code + "}");

	code = (code + "")
		.replace(/;/g, ";\n")
		.replace(/{/g, "\n{\n")
		.replace(/}/g, "\n}\n")
		.replace(/\n;\n/g, ";\n")
		.replace(/\n\n/g, "\n");

	code = code.split("\n");
	code = indent(code);

	code = code.join("\n");
	return code;
}
