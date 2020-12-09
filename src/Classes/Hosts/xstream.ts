import * as React from "react";
import { HostBase } from "./base";
import qs from "qs";
import {EmbededResolvedModel} from '../../Models/taiyaki';

export default class Xstreamcdn extends HostBase {
	grabAvailableHosts = async (
		embedLink: string
	): Promise<EmbededResolvedModel[]> => {
		const urlID = embedLink.split("/").slice(-1)[0];
		const url = `https://gcloud.live/api/source/${urlID}`;
		const _data = { r: "https://vidstreaming.io/&d=gcloud.live" };
		const _responseFetch = await fetch(url, {
			headers: {
				"content-type": "x-www-form-urlencoded",
				"referer": "https://gcloud.live/",
			},
			method: "POST",
			body: qs.stringify(_data),
		});
		const _response = await _responseFetch.json();

		if (typeof _response["data"] === "string") {
			//The video was removed or deleted
			console.log("throwing");
			throw new Error(_response["data"]);
		}
		const list = _response["data"] as Array<Object>;
		if (list) {
			return list.map((i: any) => {
				return {
					quality: i["label"],
					link: i["file"],
				};
			});
		} else {
			throw new Error("Empty list of quality links");
		}
	};

	// Future<PlayerItem> xstreamcdnPlayer( String embedLink, {String phpLink}) async {
	//     final dio = Dio();

	//   PlayerItem listVideo = PlayerItem(headers: {'Referer': 'https://gcloud.live/'},playerQualities: []);
	//   String urlID = embedLink.split('/').last;
	//   String newFormedURL = 'https://gcloud.live/api/source/$urlID';
	//   Uri gcloud = Uri.parse(newFormedURL);

	//   Response newData = await dio.post(newFormedURL, data: {'r': 'http://vidstreaming.io/&d=gcloud.live'}, options: Options(
	//       contentType: Headers.formUrlEncodedContentType,
	//       headers: {'Referer' : 'https://${gcloud.host}/', 'Origin' : gcloud.origin }
	//   ));

	// try {
	// var json = newData.data['data'] as List;
	// json.forEach((i) => listVideo.playerQualities.add({i['label'] : i['file']}));
	// }  catch(e) {
	//   throw('The video for this link could not be found, or was removed by the site');

	// }

	// return listVideo;
	// }
}
