export default interface AWSDeploymentContext {
	accessKeyId: string;
	secretAccessKey: string;
	resourceGroupName: string;
	applicationName: string;
	region: string;
	applicationVersion: string;
}
