import DeployerType from './deployerType';
import IDeployer from './deployer';
import AzureDeployer from './azure/azureDeployer';
import AWSDeployer from './aws/AWSDeployer';

export default function createDeployer(
	type: DeployerType,
	context: any
): IDeployer {
	switch (type) {
		case DeployerType.Azure:
			return new AzureDeployer(context);

		case DeployerType.AWS:
			return new AWSDeployer(context);

		default:
			throw new Error(`Unrecognized deployer type: ${type}`);
	}
}

export type createDeployer = (type: DeployerType, context: any) => IDeployer;
