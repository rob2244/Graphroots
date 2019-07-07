import AzureDeployer from "../deployer/azure/azureDeployer";
import AdmZip from "adm-zip";
import path from "path";

jest.setTimeout(10000000);

describe("AzureDeployer", () => {
  it("Should sucessfully deploy resources", async () => {
    const deployer = new AzureDeployer({
      clientID: "",
      clientSecret: "",
      location: "westus",
      resourceGroupName: "graphroots-generated",
      subscriptionId: "",
      tenantId: "",
      webAppName: "rographrootsgenerated"
    });

    await deployer.deployResources();
  });

  it("Should successfully deploy application", async () => {
    const deployer = new AzureDeployer({
      clientID: "",
      clientSecret: "",
      location: "westus",
      resourceGroupName: "graphroots-generated",
      subscriptionId: "",
      tenantId: "",
      webAppName: "rographrootsgenerated"
    });

    const zipper = new AdmZip();
    zipper.addLocalFolder(path.resolve(__dirname, "../templates/javascript"));
    const buffer = zipper.toBuffer();

    await deployer.deployApplication(buffer);
  });
});
