import { RequestHandler } from "express";
import { body, validationResult } from "express-validator";
import { BAD_REQUEST } from "http-status-codes";

export const azureDeploymentValidation: RequestHandler = (req, res, next) => {
  body([
    "clientId",
    "clientSecret",
    "tenantId",
    "subscriptionId",
    "location",
    "resourceGroupName",
    "webAppName"
  ])
    .exists({ checkFalsy: true, checkNull: true })
    .isString();

  const result = validationResult(req);
  if (!result.isEmpty()) {
    return res.status(BAD_REQUEST).json({ errors: result.array() });
  }
};
