import DeployerType from "./deployerType";
import IDeployer from "./deployer";
import AzureDeployer from "./azure/azureDeployer";

export default function createDeployer(
  type: DeployerType,
  context: any
): IDeployer {
  switch (type) {
    case DeployerType.Azure:
      return new AzureDeployer(context);

    default:
      throw new Error(`Unrecognized deployer type: ${type}`);
  }
}
