import IDeployer from "../deployer";
import * as msRestNodeAuth from "@azure/ms-rest-nodeauth";
import { ResourceManagementClient } from "@azure/arm-resources";
import { WebSiteManagementClient } from "@azure/arm-appservice";
import fetch from "node-fetch";
import { ServiceClientCredentials } from "@azure/ms-rest-js";
import IAzureDeploymentContext from "./azureDeploymentContext";

export default class AzureDeployer implements IDeployer {
  constructor(private context: IAzureDeploymentContext) {}

  async deployResources(): Promise<void> {
    const creds = await this.getCredentials();

    await this.createResourceGroup(creds);

    const webappClient = new WebSiteManagementClient(
      creds,
      this.context.subscriptionId
    );

    await this.createWebApp(webappClient);
  }

  private async createResourceGroup(creds: ServiceClientCredentials) {
    const { subscriptionId, resourceGroupName, location } = this.context;

    const rgClient = new ResourceManagementClient(creds, subscriptionId);

    return await rgClient.resourceGroups.createOrUpdate(resourceGroupName, {
      location
    });
  }

  private async createWebApp(client: WebSiteManagementClient) {
    const { resourceGroupName, location, webAppName } = this.context;

    return await client.webApps.createOrUpdate(resourceGroupName, webAppName, {
      location,
      // Required due to api bug
      serverFarmId: "",
      siteConfig: {
        // Sets Kudu to do npm install during zip deploy
        appSettings: [
          { name: "SCM_DO_BUILD_DURING_DEPLOYMENT", value: "true" },
          { name: "WEBSITE_NODE_DEFAULT_VERSION", value: "10.15.2" }
        ]
      }
    });
  }

  async deployApplication(zipped: Buffer) {
    const { webAppName, resourceGroupName } = this.context;
    const url = `https://${webAppName}.scm.azurewebsites.net/api/zipdeploy`;

    const creds = await this.getCredentials();

    const webappClient = new WebSiteManagementClient(
      creds,
      this.context.subscriptionId
    );

    const {
      publishingUserName,
      publishingPassword
    } = await webappClient.webApps.listPublishingCredentials(
      resourceGroupName,
      webAppName
    );

    const publishingCreds = Buffer.from(
      `${publishingUserName}:${publishingPassword}`
    ).toString("base64");

    await fetch(url, {
      method: "POST",
      body: zipped,
      headers: { Authorization: `Basic ${publishingCreds}` }
    });
  }

  private async getCredentials() {
    const { clientId: clientID, clientSecret, tenantId } = this.context;

    return await msRestNodeAuth.loginWithServicePrincipalSecret(
      clientID,
      clientSecret,
      tenantId
    );
  }
}
