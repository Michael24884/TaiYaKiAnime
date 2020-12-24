import { HostBase } from '.';
import { EmbededResolvedModel } from '../../Models';

class YourUpload extends HostBase {
    
    async grabAvailableHosts(embedLink: string): Promise<EmbededResolvedModel[]> {
        
        const response = await (await fetch(embedLink)).text();
        const reg = new RegExp(/file: '(\w+.+)'/);
        const match = response.match(reg);
        if (match) {
            return [{link: match[1], quality: 'Auto', headers: {Referer: 'https://yourupload.com/'}}]
        }
        throw(new Error('No matches were found using the RegExp'))
    }

}

export default YourUpload;
