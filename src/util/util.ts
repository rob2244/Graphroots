export const createProjectIfNotExists = (
  session: Express.Session,
  project: string
) => {
  session[project] = session[project] ? session[project] : {};
};
