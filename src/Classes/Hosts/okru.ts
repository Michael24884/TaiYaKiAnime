import {EmbededResolvedModel} from '../../Models/taiyaki';
import { HostBase } from "./base";
import cheerio from 'react-native-cheerio';

export default class OkRu extends HostBase {
    
    _strip(str: string): string {
        const $ = cheerio.load(str)
        const html = $("div[data-module=OKVideo]").attr("data-options")
        
        console.log(html)
        return ""
    }
    
    async grabAvailableHosts(embedLink: string): Promise<EmbededResolvedModel[]> {
        
        const response = await (await fetch(embedLink)).text();
        const link = this._strip(response);
    }

}