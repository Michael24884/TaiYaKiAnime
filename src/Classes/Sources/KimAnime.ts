import qs from "qs";
import cheerio from 'react-native-cheerio';
import { SourceAbstract, TaiyakiSourceLanguage, TaiyakiSourceTypes } from ".";
import { TaiyakiScrapedTitleModel } from "../../Models";

class KimAnime extends SourceAbstract {
    baseUrl: string = 'https://kimanime.ru';
    source: TaiyakiSourceTypes = 'KimAnime';
    language: TaiyakiSourceLanguage = "English";
    options: { hasCloudflare: boolean; name: string; } = {hasCloudflare: false, name: 'KimAnime'};
    controller: AbortController = new AbortController();

    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        
        const response = await (await fetch(this.baseUrl + '/?c=search&' + qs.stringify({q: title}), {signal: this.controller.signal})).text();
        const $ = cheerio.load(response);
        return $("div.columns2 > div.column")
        .toArray()
        .map((e: any) => {
            const title = $(e).find("a").text().trim();
            const link = $(e).find("a").attr("href");
            const image = $(e).find("a > img").attr("src");
            return {title,embedLink: this.baseUrl + link, image: this.baseUrl + image,};});    
    }

    async availableEpisodes(link: string): Promise<string[]> {
        const response = await (await fetch(link, {signal: this.controller.signal})).text();
        const $ = cheerio.load(response);
        return $("tbody > tr").toArray().map((e: any) => {
            const link = $(e).find("td").find("a").attr("href");
            return "https://kimanime.ru" + link;}).reverse();
    }

    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
        const response = await (await fetch(episodeLink)).text();
        const $ = cheerio.load(response);
        const serverLink = $("div.container.has-background-black-bis").find("iframe").attr("src");
        return [{ link: serverLink, server: "BP" }];
    }
}

export default KimAnime;
