import { HostBase } from ".";
import { EmbededResolvedModel } from "../../Models";
import cheerio from 'react-native-cheerio';

class UmiPlayer extends HostBase {
        
    async grabAvailableHosts(embedLink: string): Promise<EmbededResolvedModel[]> {
        const phpUrl = embedLink.replace('.html#', '.php?v=');
        const response = await (await fetch(phpUrl)).json();
        const authority = new RegExp(/\/\/(.+com)/);
        const authHeader = (response.file as string).match(authority)![1]
        console.log(response.file)
        return [{quality: 'Auto', link: (response.file as string), headers: 
        {
            'Content-Type': 'video/mp4',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36',

        }}];
    }

}

export default UmiPlayer;
