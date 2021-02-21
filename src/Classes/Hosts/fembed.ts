import qs from 'qs';
import cheerio from 'react-native-cheerio';
import { HostBase } from '.';
import { EmbededResolvedModel } from '../../Models';

class Fembed extends HostBase {
    async grabAvailableHosts(embedLink: string): Promise<EmbededResolvedModel[]> {
        
        const response =  (await fetch(embedLink));
            const location = response.url.replace('v/', 'api/source/');
            const body = qs.stringify({
                r: '',
                d: 'femax20.com'
            })
            const apiFetch = (await fetch(location,{headers: {'Content-Type': 'application/x-www-form-urlencoded'},method: 'POST', body, }));
            const json = (await apiFetch.json()).data as {file: string; label: string}[];

            return json.map((i) => ({
                link: i.file,
                quality: i.label,
            }))
        

    }
    
}

export default Fembed;
