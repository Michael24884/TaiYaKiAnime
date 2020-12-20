import { HostBase } from ".";
import { EmbededResolvedModel } from "../../Models";

class Streamium extends HostBase {
        
    grabAvailableHosts(embedLink: string): Promise<EmbededResolvedModel[]> {
        throw new Error("Method not implemented.");
    }

}

export default Streamium;
