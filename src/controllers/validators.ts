import { RequestHandler } from "express";
import { body, validationResult } from "express-validator";
import { BAD_REQUEST } from "http-status-codes";
import { UploadedFile } from "express-fileupload";
import { extname } from "path";

export const azureDeploymentValidation: RequestHandler = async (
  req,
  res,
  next
) => {
  await body([
    "cloudType",
    "clientId",
    "clientSecret",
    "tenantId",
    "subscriptionId",
    "location",
    "resourceGroupName",
    "webAppName"
  ])
    .exists({ checkFalsy: true, checkNull: true })
    .isString()
    .run(req);

  const result = validationResult(req);
  if (!result.isEmpty()) {
    res.status(BAD_REQUEST).json({ errors: result.array() });
    return;
  }

  next();
};

export const fileValidator = (
  fileNames = ["*"],
  acceptedExtensions = ["*"]
): RequestHandler => {
  return (req, res, next) => {
    if (!req.files) {
      res.status(BAD_REQUEST).json({ errors: `No files uploaded` });
      return;
    }

    for (const file in req.files) {
      if (!fileNames.includes(file) && !fileNames.includes("*")) {
        res.status(BAD_REQUEST).json({
          errors: `Expected the following files: ${fileNames.join(
            ","
          )}, but they were not found`
        });

        return;
      }

      const { name } = req.files[file] as UploadedFile;

      if (!hasValidExtension(acceptedExtensions, name)) {
        const msg = `Invalid file extension, only files with the following extensions accepted: ${acceptedExtensions.join(
          ", "
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
  //todo change to use mimetype
  return (
    acceptedExtensions.includes(extname(fileName)) ||
    acceptedExtensions.includes("*")
  );
};
