export type Configuration = { [key: string]: string };

export default interface IDeployer {
	deployResources(config?: Configuration): Promise<void>;
	deployApplication(zipped: Buffer): Promise<void>;
}
