import {EmbededResolvedModel} from '../../Models/taiyaki';
import { HostBase } from "./base";

export default class CloudNineHost extends HostBase {
	async grabAvailableHosts(embedLink: string): Promise<EmbededResolvedModel[]> {
		let _box: EmbededResolvedModel[] = [];

		const _formedURL = embedLink
			.replace("/embed/", "/stream/")
			.replace("cloud9", "api.cloud9");
		await fetch(_formedURL, {
			method: "OPTIONS",
			headers: {
				"access-control-request-method": "GET",
				"access-control-request-headers": "content-type",
				"accept-encoding": "gzip, deflate, br",
				"connection": "keep-alive",
			},
		});
		const _requestFetch = await fetch(_formedURL, {
			headers: { "content-type": "application/json" },
		});
		const _request = await _requestFetch.json();
		const file = (_request.data.sources as Array<any>)[0].file;
		console.log(file);
		_box.push({ quality: "Auto", link: file });
		return _box;
	}
}
