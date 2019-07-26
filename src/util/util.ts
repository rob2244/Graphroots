import CodeFile from "../generator/codeFile";

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
