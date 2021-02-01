  
import {EmbededResolvedModel} from '../../Models/taiyaki';
import { HostBase } from "./base";
import qs from 'qs';

export default class Trollvid extends HostBase {
	grabAvailableHosts = async (
		embedLink: string
	): Promise<EmbededResolvedModel[]> => {
		const init = {
			method: 'POST',
			headers: {"referer": 'https://anistream.xyz'}
		}
		const req = await (await fetch(embedLink, {headers: {'Referer': referer}})).text()
        var source = req.match(/<source src="(.*?)"/)
        const token = req.match(/token\s*=\s*['\"|']([^\"']*)/)[1]
        if (source) {
            return [{
                    quality: 'Auto',
                    link: source[1]
                }]
        } else if (token) {
            const trollvid_id = embedLink.split('/')[embedLink.split('/').length - 1]
            const referer = `https://mp4.sh/embed/${trollvid_id}?x=${token}`
            const api_link = `https://mp4.sh/v/${trollvid_id}`

            const resp = await (await fetch(api_link, {
                method: 'POST',
                headers: {
                    'referer': referer,
                    'content-type': 'application/x-www-form-urlencoded'
                },
                body: qs.stringify({'token': token})
            })).json()
            if (resp.success && resp.data) {
                return [{
                    quality: 'Auto',
                    link: resp.data
                }]
            }
        } else {
            console.log("throwing");
            throw new Error("Error 404: File not found")
        };
		throw(new Error('Could not find a proper link'))
};
}
