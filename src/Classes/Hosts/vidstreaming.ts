import {HostBase} from './base';
//@ts-ignore
import cheerio from "react-native-cheerio";
import {EmbededResolvedModel} from '../../Models/taiyaki';

export default class VidstreamingHost extends HostBase {
  async grabAvailableHosts(embedLink: string): Promise<EmbededResolvedModel[]> {
    const preLink = await (await fetch(embedLink)).text();
    const $ = cheerio.load(preLink);
    const d: string = $('div.wrapper').find('script').html();
    const reg = new RegExp(/file.+(https[^']+)/);
    const match = d.match(reg);
    if (match) {
      return [{link: match[1], quality: 'Adaptive'}];
    }
    return [];
  }
}
