import AzureDeployer from '../../deployer/azure/azureDeployer';
import AdmZip from 'adm-zip';
import path from 'path';
import AWSDeployer from '../../deployer/aws/AWSDeployer';

jest.setTimeout(10000000);

describe('AzureDeployer', () => {
	xit('Should sucessfully deploy resources', async () => {
		const deployer = new AzureDeployer({
			clientId: '',
			clientSecret: '',
			location: 'westus',
			resourceGroupName: 'graphroots-generated',
			subscriptionId: '',
			tenantId: '',
			webAppName: 'rographrootsgenerated'
		});

		await deployer.deployResources();
	});

	xit('Should successfully deploy application', async () => {
		const deployer = new AzureDeployer({
			clientId: '',
			clientSecret: '',
			location: 'westus',
			resourceGroupName: 'graphroots-generated',
			subscriptionId: '',
			tenantId: '',
			webAppName: 'rographrootsgenerated'
		});

		const zipper = new AdmZip();
		zipper.addLocalFolder(path.resolve(__dirname, '../templates/javascript'));
		const buffer = zipper.toBuffer();

		await deployer.deployApplication(buffer);
	});
});

describe('AWSDeployer', () => {
	xit('Should sucessfully deploy resources', async () => {
		const deployer = new AWSDeployer({
			accessKeyId: '',
			secretAccessKey: '',
			applicationName: 'graphroots-generated',
			resourceGroupName: 'graphroots-generated',
			region: 'us-west-1',
			applicationVersion: '1.0.0'
		});

		await deployer.deployResources();
	});

	xit('Should sucessfully deploy application', async () => {
		const deployer = new AWSDeployer({
			accessKeyId: '',
			secretAccessKey: '',
			applicationName: 'graphroots-generated',
			resourceGroupName: 'graphroots-generated',
			region: 'us-west-1',
			applicationVersion: '1.0.0'
		});

		await deployer.deployApplication(Buffer.from('Hello'));
	});
});
