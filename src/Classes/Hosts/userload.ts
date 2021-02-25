import {EmbededResolvedModel} from '../../Models/taiyaki';
import { HostBase } from "./base";

export default class UserLoad extends HostBase {
	grabAvailableHosts = async (
		embedLink: string
	): Promise<EmbededResolvedModel[]> => {
		var html = await (await fetch(embedLink)).text();
        const reg = /\'\|.*?\|.*?\|.*?\|.*?\|.*?\|.*?\|.*?\|.*?\|.*?\|.*?\|.*?\|(.*?)\|.*?\|.*?\|.*?\|(.*?)\|.*?/
        const groups = html.match(reg)

        if (!groups) {
            console.log("throwing");
            throw new Error("Error 404: File not found")
        }
        try {
            const form = qs.stringify({
                morocco: groups[1],
                mycountry: groups[2]
            })
            const init = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: form
            }
           return {
                quality: 'Auto',
                link: (await (await fetch('https://userload.co/api/request/', init)).text()).trim()
            }
        } catch (error) {
            throw(new Error('Could not find a proper link'))
        }
};
}
