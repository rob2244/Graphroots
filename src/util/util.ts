import CodeFile from '../generator/codeFile';
import { Configuration } from '../deployer/deployer';

export const createProjectIfNotExists = (
	session: Express.Session,
	project: string
) => {
	session[project] = session[project] ? session[project] : {};
};

export const getResolversFromProject = (session: {
	[key: string]: any;
}): CodeFile[] => {
	const keys = Object.keys(session).filter(k => /resolver(s?)/i.test(k));
	return keys.map(k => session[k]);
};

export const getConfigFromProject = (session: {
	[key: string]: any;
}): Configuration | undefined => {
	const config: CodeFile = session.configuration;
	if (!config) return undefined;

	const parsed = JSON.parse(config.content);
	return parsed;
};
