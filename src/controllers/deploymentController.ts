import { CREATED, BAD_REQUEST } from 'http-status-codes';
import { Controller, Post, Middleware } from '@overnightjs/core';
import { Request, Response } from 'express';
import { createDeployer } from '../deployer/deployerFactory';
import IGenerator from '../generator/generator';
import CodeFile from '../generator/codeFile';
import DeployerType from '../deployer/deployerType';
import * as validators from './validators';
import { getResolversFromProject, getConfigFromProject } from '../util/util';

@Controller('api/v1/deployment')
class DeploymentController {
	constructor(
		private deployerFactory: createDeployer,
		private generator: IGenerator
	) {}

	@Post(':project')
	@Middleware(validators.azureDeploymentValidation)
	async deploy(req: Request, res: Response) {
		const { project } = req.params;

		if (!req.session[project]) {
			res.status(BAD_REQUEST).send({
				error: `No project with name ${project} found in current session`
			});

			return;
		}

		const { schema, dependency = null } = req.session[project];

		if (!schema) {
			res
				.status(BAD_REQUEST)
				.send({ error: 'No graphql schema found in current session' });

			return;
		}

		const resolvers = getResolversFromProject(req.session[project]);

		if (resolvers.length === 0) {
			res
				.status(BAD_REQUEST)
				.send({ error: 'No graphql resolvers found in current session' });

			return;
		}

		const deployer = this.createDeployer(req.body);
		const codeFiles = this.createCodeFiles(schema, resolvers, dependency);

		const { generator } = this;
		const files = await generator.generate(codeFiles);

		const config = getConfigFromProject(req.session[project]);
		await deployer.deployResources(config);
		await deployer.deployApplication(files);

		res.sendStatus(CREATED);
	}

	private createDeployer(requestBody: { [key: string]: string }) {
		const { deployerFactory } = this;
		const { cloudType, ...ctx } = requestBody;

		return deployerFactory(cloudType as DeployerType, ctx);
	}

	private createCodeFiles(
		schema: CodeFile,
		resolvers: CodeFile[],
		dependency: CodeFile | null
	): CodeFile[] {
		const files = [schema, ...resolvers];

		if (dependency) {
			files.push(dependency);
		}

		return files;
	}
}

export default DeploymentController;
