import {EmbededResolvedModel} from '../../Models/taiyaki';

export abstract class HostBase {
  abstract grabAvailableHosts(
    embedLink: string,
  ): Promise<EmbededResolvedModel[]>;
}
