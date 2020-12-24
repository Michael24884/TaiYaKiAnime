import { TaiyakiSourceLanguage, TaiyakiSourceTypes } from ".";
import { SourceTypes, TaiyakiScrapedTitleModel } from "../../Models";

type Options = {
  hasCloudflare: boolean;
  name: string;
}

abstract class SourceAbstract {
  abstract baseUrl: string;
  abstract source: TaiyakiSourceTypes;
  abstract language: TaiyakiSourceLanguage;
  abstract options: Options;
  controller: AbortController = new AbortController();

  
  public get signal(): AbortSignal {
    return this.controller.signal;
  }
  

  headers?: Record<string, string>;

  /**
   * Destroy method. Controller should be aborted here. Used at the end of the component's lifecycle
   */
  destroy(): void {
    this.controller.abort();
  };

  /**
   * SearchTitles is responsible for looking up the query/search results on the provided source. Used in binding anime
   * Returns all the available results with the corresponding titles
   * @param title The anime title, may be a custom query or the default provided romaji from Anilist
   */
  abstract searchTitles(title: string): Promise<TaiyakiScrapedTitleModel[]>;

  /**
   * AvailableEpisodes must return an array and MUST return all episodes available. 
   * Apart from showcasing episodes, this is also used for notification and episode count discovery
   * @param link The link for the anime (series). This is provided from the SearchTitles results 
   */
  abstract availableEpisodes(link: string): Promise<string[]>;

  /**
   * Episode link is provided from AvailableEpisodes
   * Returns available hosts and links to them
   * @param episodeLink The link that leads to available hosts for the current episode
   */
  abstract scrapeLinks(episodeLink: string): Promise<{link: string; server: string}[]>;
};





export default SourceAbstract;
