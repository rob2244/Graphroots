export default interface IAzureDeploymentContext {
  clientId: string;
  clientSecret: string;
  tenantId: string;
  subscriptionId: string;
  location: string;
  resourceGroupName: string;
  webAppName: string;
}
