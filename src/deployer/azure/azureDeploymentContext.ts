export default interface IAzureDeploymentContext {
  clientID: string;
  clientSecret: string;
  tenantId: string;
  subscriptionId: string;
  location: string;
  resourceGroupName: string;
  webAppName: string;
}
