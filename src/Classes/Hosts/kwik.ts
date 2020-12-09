import {EmbededResolvedModel} from '../../Models/taiyaki';
import { HostBase } from "./base";
import cheerio from "react-native-cheerio";
import { unPack } from "./unpacker";

export default class Kwik extends HostBase {
  async grabAvailableHosts(embedLink: string): Promise<EmbededResolvedModel[]> {
    const headers = { Referer: "https://animepahe.com/" };
    const _response = await (await fetch(embedLink, { headers })).text();
    const $ = cheerio.load(_response);
    //console.log(_response);
    const packer = $("script").last().html();

    const pack = unPack(packer);

    const source = new RegExp(/const source='(.+)'/);
    console.log(source);
    const match = pack.match(source);
    if (match) {
      const link = match[1];
      return [
        {
          link,
          quality: "Auto",
          headers: { Origin: "https://kwik.cx", Referer: "https://kwik.cx" },
        },
      ];
    } else throw new Error("File could not be unpacked");
  }
}
