import {EmbededResolvedModel} from '../../Models/taiyaki';
import { unPack } from "./unpacker";
import { HostBase } from "./base";

export default class Mp4Upload extends HostBase {
	grabAvailableHosts = async (
		embedLink: string
	): Promise<EmbededResolvedModel[]> => {
		const _responseFetch = await fetch(embedLink);
		const _response = await _responseFetch.text();
		if (_responseFetch.ok) {
			console.log(_response);
			const reg = new RegExp(/<script type='text\/javascript'>(.+)/i);
			const script = _response.match(reg);
			if (script) {
				const _script = script[1];
				const _jsUnpacker = unPack(_script);
				//	console.log(_jsUnpacker, "packer");
				const _regex: RegExp = RegExp(/src:("([^"])+)/gm);
				const _src = (_jsUnpacker as string).match(_regex);
				if (_src) {
					const _finalReg = RegExp(/https[^"]+/gm);
					const _form = _src[0].match(_finalReg);
					if (_form) return [{ quality: "Auto", link: _form[0] }];
				} else {
					throw new Error("Could not find a proper link");
				}
			} else throw new Error("Could not find a proper link");
		}
		return [];
	};
}
