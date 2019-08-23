import { RequestHandler } from 'express';
import { body, validationResult } from 'express-validator';
import { BAD_REQUEST } from 'http-status-codes';
import { UploadedFile } from 'express-fileupload';
import { extname } from 'path';
import DeployerType from '../deployer/deployerType';

export const azureDeploymentValidation: RequestHandler = async (
	req,
	res,
	next
) => {
	switch (req.body.cloudType) {
		case DeployerType.Azure:
			await body([
				'clientId',
				'clientSecret',
				'tenantId',
				'subscriptionId',
				'location',
				'resourceGroupName',
				'webAppName'
			])
				.exists({ checkFalsy: true, checkNull: true })
				.isString()
				.run(req);
			break;

		case DeployerType.AWS:
			await body([
				'accessKeyId',
				'secretAccessKey',
				'resourceGroupName',
				'applicationName',
				'region',
				'applicationVersion'
			])
				.exists({ checkFalsy: true, checkNull: true })
				.isString()
				.run(req);
			break;

		default:
			res.status(BAD_REQUEST).json({
				errors: [
					{ msg: 'Invalid Cloud Type', param: 'cloudType', location: 'body' }
				]
			});
			return;
	}

	const result = validationResult(req);
	if (!result.isEmpty()) {
		res.status(BAD_REQUEST).json({ errors: result.array() });
		return;
	}

	next();
};

export const fileValidator = (
	fileNames = ['*'],
	acceptedExtensions = ['*']
): RequestHandler => {
	return (req, res, next) => {
		if (!req.files) {
			res.status(BAD_REQUEST).json({ errors: `No files uploaded` });
			return;
		}

		for (const file in req.files) {
			if (!fileNames.includes(file) && !fileNames.includes('*')) {
				res.status(BAD_REQUEST).json({
					errors: `Expected the following files: ${fileNames.join(
						','
					)}, but they were not found`
				});

				return;
			}

			const { name } = req.files[file] as UploadedFile;

			if (!hasValidExtension(acceptedExtensions, name)) {
				const msg = `Invalid file extension, only files with the following extensions accepted: ${acceptedExtensions.join(
					', '
				)}`;

				res.status(BAD_REQUEST).json({
					errors: msg
				});

				return;
			}
		}

		next();
	};
};

const hasValidExtension = (acceptedExtensions: string[], fileName: string) => {
	return (
		acceptedExtensions.includes(extname(fileName)) ||
		acceptedExtensions.includes('*')
	);
};

export const configurationValidation: RequestHandler = (req, res, next) => {
	const { data } = req.files.configuration as UploadedFile;
	const content = data.toString('utf-8');
	const json = JSON.parse(content);

	for (const key in json) {
		if (typeof json[key] !== 'string') {
			res.status(BAD_REQUEST).json({
				errors: `Key '${key}' has invalid value. Only string values are supported`
			});

			return;
		}
	}

	next();
};
