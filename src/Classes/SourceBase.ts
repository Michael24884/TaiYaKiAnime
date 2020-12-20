import {
  EmbededResolvedModel,
  TaiyakiScrapedTitleModel,
} from '../Models/taiyaki';
import {VidstreamingHost, BP, Kwik, Mp4Upload, Cloud9, Xstream, StreamX} from './Hosts';
import { MapSourceTypesToAbstract, SourceAbstract, TaiyakiSourceTypes } from './Sources';

export class SourceBase {
  source: TaiyakiSourceTypes;

  constructor(source: TaiyakiSourceTypes) {
    this.source = source;
  }

  async scrapeTitle(
    title: string,
  ): Promise<{loading: boolean; results: TaiyakiScrapedTitleModel[]}> {
    const map = MapSourceTypesToAbstract.get(this.source)!
    let loading = true;
    const titles = await map.searchTitles(title);
    loading = false;
    //TODO: Might remove the loading params as function constructors are no longer used
    return {loading, results: titles};
  }

  async scrapeAvailableEpisodes(link: string): Promise<string[]> {
    const map = MapSourceTypesToAbstract.get(this.source)!
    const links = await map.availableEpisodes(link);
    return links
  }

  async scrapeLinks(
    episodeLink: string,
  ): Promise<{link: string; server: string}[]> {
    const map = MapSourceTypesToAbstract.get(this.source)!
    const links = await map.scrapeLinks(episodeLink);
    //If it fails here but links is showing in console, you're probably not returning an array. Wrap it between a [] even if its' only one link
    return links.filter((i) => i);
  }

  async scrapeEmbedLinks(data: {
    link: string;
    server: string;
  }): Promise<EmbededResolvedModel[]> {
    const qualityString = data.server.match(RegExp(/([0-9]+)-(\w+)/));
    
    if (qualityString) {
      const servermatch = qualityString[2];
      switch (servermatch) {
        case 'kwik':
          return await new Kwik().grabAvailableHosts(data.link);
        case 'animeowl':
          return [{link: data.link, quality: qualityString[1]}];
      }
    }
    //TODO: Bump from switch to maps
    switch (data.server.toLowerCase()) {
      case 'multi quality':
        return await new VidstreamingHost().grabAvailableHosts(data.link);
      case 'cloud9':
        return await new Cloud9().grabAvailableHosts(data.link);
      case 'xstreamcdn':
        return await new Xstream().grabAvailableHosts(data.link);
      case 'mp4upload':
        return await new Mp4Upload().grabAvailableHosts(data.link);

      case 'bp':
        return await new BP().grabAvailableHosts(data.link);
      
      case 'streamx': return await new StreamX().grabAvailableHosts(data.link);

      case 'okru':
        throw '';
      // case 'ld':
      // case 'sd':
      // case 'hd':
      // case 'fullhd':
      //   return await new AniWatch().buildWatchableLinks({
      //     link: data.link,
      //     quality: data.server.toLowerCase(),
      //   });
      case 'custom':
        return [{link: data.link, quality: data.server}];

      default:
        throw new Error(
          `The server name: ${data.server} link: ${data.link} has not been created yet for Taiyaki`,
        );
    }
  }
}

//WARNING: ARCHIVED -> MAY BE REMOVED IN THE NEAR FUTURE. Kept for now for reference

// export class SourceBase {
// 	source: TaiyakiArchiveModel;

// 	controller = new AbortController();

// 	constructor(props: SourceBaseConfig) {
// 		this.source = props.source;
// 	}

// 	async scrapeTitle(
// 		title: string
// 	): Promise<{
// 		loading: boolean;
// 		results: ScrapedTitlesModel[];
// 	}> {
// 		if (this.source.name === "AniWatch") {
// 			const aniWatch = new AniWatch();
// 			const file = await AsyncStorage.getItem("aniwatch_source");
// 			if (file){
// 				const json = JSON.parse(file) as {userID: number; token: string};
// 				const results =  (await aniWatch.scrapeTitles(title, json))
// 			return {loading: false, results};
// 			}
// 		}
// 		const func = new Function(this.source.searchTitles);
// 		let loading = true;
// 	//	if (this.source.name === "AniWatch") console.log(this.source.searchTitles)
// 		const titles: ScrapedTitlesModel[] = await func
// 			.call(null)
// 			.call(
// 				null,
// 				title,
// 				this.source,
// 				qs,
// 				this.source.extraDataTitles,
// 				cheerio,
// 				this.controller
// 			);
// 		loading = false;
// 		return { loading, results: titles };
// 	}

// 	async scrapeAvailableEpisodes(link: string): Promise<string[]> {

// 		if (this.source.hasOptions && this.source.requiredOptions?.id) {
// 			const dill = await AsyncStorage.getItem(this.source.requiredOptions.id)
// 			if (dill) {

// 				const json = JSON.parse(dill) as DynamicUserData;

// 				//TODO: REMOVE DEFAULTED ANIWATCH
// 				const aniWatch = new AniWatch();
// 				const eps: string[] = await aniWatch.scrapeEpisodes(link, json);
// 				return eps;
// 			} else throw(new Error("User is not signed in to service"));
// 		} else {
// 			const func = new Function(this.source.scrapeEpisodes);
// 			const eps: string[] = await func.call(null).call(null, link, cheerio);
// 			return eps;
// 		}
// 		//const func = new Function(this.source.scrapeEpisodes);
// 	}

// 	async scrapeLinks(
// 		episodeLink: string
// 	): Promise<{ link: string; server: string }[]> {
// 		if (this.source.hasOptions && this.source.requiredOptions?.id) {
// 			const dill = await AsyncStorage.getItem(this.source.requiredOptions.id)
// 			if (dill) {
// 				const json = JSON.parse(dill) as DynamicUserData;
// 				const aniWatch = new AniWatch();
// 				const links = await aniWatch.scrapeLinks(episodeLink, json);
// 				// const links: { link: string; server: string }[] = await func
// 				// .call(null)
// 				// .call(null, episodeLink, json);
// 				return links.filter((i) => i);
// 			//If it fails here but links is showing, you're probably not returning an array. Wrap it between a [] even if its' only one link
// 			} else throw(new Error("User is not signed in to service"));
// 		}
// 		else {

// 			const func = new Function(this.source.scrapeLinks);
// 			const links: { link: string; server: string }[] = await func
// 				.call(null)
// 				.call(null, episodeLink, cheerio);
// 			console.log("the available links", links);
// 			//If it fails here but links is showing, you're probably not returning an array. Wrap it between a [] even if its' only one link
// 			return links.filter((i) => i);
// 		}
// 	}

// 	async scrapeEmbedLinks(data: {
// 		link: string;
// 		server: string;
// 	}): Promise<EmbededResolvedModel[]> {
// 		const qualityString = data.server.match(RegExp(/([0-9]+)-(\w+)/));

// 		if (qualityString) {
// 			const servermatch = qualityString[2];
// 			switch (servermatch) {
// 				case "kwik":
// 					return await new Kwik().grabAvailableHosts(data.link);
// 				case "animeowl": return [{link: data.link, quality: qualityString[1]}]
// 			}
// 		}
// 		//TODO: Bump from switch to maps
// 		switch (data.server.toLowerCase()) {
// 			case "multi quality":
// 				return await new VidstreamingHost().grabAvailableHosts(data.link);
// 			case "cloud9":
// 				return await new CloudNineHost().grabAvailableHosts(data.link);
// 			case "xstreamcdn":
// 				return await new Xstreamcdn().grabAvailableHosts(data.link);
// 			case "mp4upload":
// 				return await new Mp4Upload().grabAvailableHosts(data.link);

// 			case "bp":
// 				return await new BP().grabAvailableHosts(data.link);

// 			case "okru":
// 				throw("")
// 			case "ld":
// 			case "sd":
// 			case "hd":
// 			case "fullhd": return await new AniWatch().buildWatchableLinks({link: data.link, quality: data.server.toLowerCase()})
// 			case "custom":
// 				return [{ link: data.link, quality: data.server }];

// 			default:
// 				throw new Error(
// 					`The server name: ${data.server} link: ${data.link} has not been created yet for Taiyaki`
// 				);
// 		}
// 	}

// 	async test_scrapeTitle(title: string, config: any, extraData?: any) {
// 		//Move orders of parameters

// 		//await scrapeTitles(title, qs, cheerio)

// 		// const t: ScrapedTitlesModel[] = await new Function(scrapeTitles)
// 		// 	.call(null)
// 		// 	.call(null, title, this.source, qs, this.source.extraDataTitles, cheerio);
// 		// console.log(t);
// 	}

// 	async test_scrapeEpisodes(link: string) {
// 		if (this.source.hasOptions && this.source.requiredOptions?.id) {
// 			const dill = await AsyncStorage.getItem(this.source.requiredOptions.id)
// 			if (dill) {
// 				const json = JSON.parse(dill) as DynamicUserData;
// 				const d = await scrapeEpisodes(link, json);
// 				console.log(d)

// 			}
// 		}

// 		// const links: string[] = await scrapeEpisodeFunction(link, cheerio);
// 		// console.log(links);
// 		//scrapeEpisodes(link, cheerio);
// 	}

// 	async test_scrapeHosts(link: {epID: number, animeID: number}) {

// 		if (this.source.hasOptions && this.source.requiredOptions?.id) {
// 			const dill = await AsyncStorage.getItem(this.source.requiredOptions.id)
// 			if (dill) {
// 				const json = JSON.parse(dill) as DynamicUserData;
// 				const d = await scrapeLinks(link, json);
// 				console.log(d)

// 			}
// 		}	//	const d = await findHosts(link, cheerio);
// 	//	console.log(d)

// 		// const func = new Function(stringme);
// 		// const links: { link: string; server: string }[] = await func
// 		// 	.call(null)
// 		// 	.call(null, link, cheerio);
// 		// console.log(links);
// 		//scrapeLinksOnEM(link, cheerio);
// 		//	addTest("https://www.bitporno.com/e/GI5LI7AK3V", cheerio);
// 	}
// }
