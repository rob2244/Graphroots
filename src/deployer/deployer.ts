export default interface IDeployer {
  deployResources(): Promise<void>;
  deployApplication(zipped: Buffer): Promise<void>;
}
