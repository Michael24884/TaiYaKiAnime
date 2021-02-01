import CookieManager from "@react-native-community/cookies";
import { TaiyakiSourceTypes, TaiyakiSourceLanguage, AniWatch } from ".";
import { EmbededResolvedModel, TaiyakiScrapedTitleModel } from "../../Models";
import { randomCodeChallenge } from "../../Models/MyAnimeList";
import { randomAgent } from "../../Util";
import SourceAbstract from "./SourceAbstract";

type AniSearchModel = {
    title: string;
    detail_id: number;
    cover: string;
}

type AniAnimeModel = {
    episodes: {
      number: number;
      ep_id: number;
    }[]
}

type AniEpisodeModel = {
    lang: {
        str: string;
        id: string;
    }[];
    stream: {
        src: {
            [key: string]: string;
        }
    }
}

class Aniwatch extends SourceAbstract {
    baseUrl: string = 'https://aniwatch.me';
    source: TaiyakiSourceTypes = 'AniWatch';
    language: TaiyakiSourceLanguage = 'English';
    options: { hasCloudflare: boolean; name: string; } = {hasCloudflare: false, name: 'AniWatch'};
   
    usesWebViewAuthentication = true;
    authenticationUrl = this.baseUrl + '/login';
    storageID = 'aniwatch_account'; 

    static userAgent: string = randomAgent();

    static xsrfToken: string = randomCodeChallenge(32);


    private _aniwatchHeaders: Record<string, string> = {
        'Accept-Language': 'en-us',
       'User-Agent': Aniwatch.userAgent,
        'Cookie': `;XSRF-TOKEN=${AniWatch.xsrfToken}; `,
        'X-XSRF-TOKEN': AniWatch.xsrfToken,
        'Origin': 'https://aniwatch.me'
    }

    private async extractAuthToken(): Promise<string>{
        const cookie = await CookieManager.get(this.baseUrl);
        const session = cookie['SESSION'].value;
        return JSON.parse(unescape(session)).auth;
    }

    async searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]> {
        const authHeader = await this.extractAuthToken();
        const body = {
            controller: 'Search',
            action: 'search',
            rOrder: false,
            order: 'title',
            typed: title,
            genre: '[]',
            maxEpisodes: 0
        };
      const response = await fetch(this.baseUrl + '/api/ajax/APIHandle', {method: 'POST', body: JSON.stringify(body), keepalive: true, headers: {...this._aniwatchHeaders, 'X-AUTH': authHeader, 'X-PATH': '/search', referer: this.baseUrl + '/search'}});
      const json = (await response.json()) as AniSearchModel[];
      return json.map((i) => ({title: i.title, embedLink: i.detail_id.toString(), image: i.cover}));
        
    }

    async availableEpisodes(link: string): Promise<string[]> {
        //link is detail_id;
        const body = JSON.stringify({
            controller: 'Anime',
            action: 'getEpisodes',
            detail_id: link,
        });
        const authHeader = await this.extractAuthToken();
        const response = await fetch(this.baseUrl + '/api/ajax/APIHandle', {method: 'POST', body, headers: {...this._aniwatchHeaders, 'X-AUTH': authHeader, 'X-PATH': '/search', referer: this.baseUrl + '/search'}})
        const json = (await response.json()) as AniAnimeModel;
        return json.episodes.map((i) => i.ep_id.toString());
    }
    
    async scrapeLinks(episodeLink: string): Promise<{ link: string; server: string; }[]> {
        //episodeLink is ep_id
        const body = JSON.stringify({
            controller: 'Anime',
            action: 'watchAnime',
            lang: 'en-US',
            ep_id: Number(episodeLink),
            hoster: "",
        });
        const authHeader = await this.extractAuthToken();
        const response = await fetch(this.baseUrl + '/api/ajax/APIHandle', {method: 'POST', body, headers: {...this._aniwatchHeaders, 'X-AUTH': authHeader, 'X-PATH': '/search', referer: this.baseUrl + '/search'}})
        const json = (await response.json()) as AniEpisodeModel;
        const object = Object.entries(json.stream.src);
        const box: {link: string; server: string}[] = []
        object.forEach((i) => {
            box.push({link: i[1], server: i[0]})
        })
        
        return box;
    }

    async buildWatchableLinks(link: string, quality: string): Promise<EmbededResolvedModel[]> {
        const cookie = await CookieManager.get(this.baseUrl + '/home');
        const obj = Object.entries(cookie);
        let cookieString = '';
        obj.forEach((i) => {
            cookieString += i[0] + '=' + i[1].value + '; '
        })
        const headers: Record<string, string> = {
            Connection : 'keep-alive',
            'Accept-Encoding': 'identity',
            'sec-fetch-site': 'same-site',
            Origin: 'https://aniwatch.me',
            'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Safari/605.1.15',
            'sec-fetch-mode': 'cors',
            Cookie: cookieString + 'XSRF-TOKEN=' + Aniwatch.xsrfToken,
            Referer: 'https://aniwatch.me/',
            'Accept-Language': 'en-us',
            'sec-fetch-dest': 'empty',
        }
        return [{link, quality, headers}];
    }

}
export default Aniwatch;
