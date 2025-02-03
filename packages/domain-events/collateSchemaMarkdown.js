// Utility to walk the schema subdirectory and create markdown
// docs with the same relative path name.

import fs from "fs";
import { jsonschema2md } from "@adobe/jsonschema2md";
import readdirp from "readdirp";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { mkdirp } from "mkdirp";
import fse from "fs-extra/esm";
import archiver from "archiver";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const outputDir = `${__dirname}/ukri-tfs-schemas`;
const schemaDir = `${__dirname}/schema`;
const zipFilePath = `${__dirname}/schema.zip`;

async function processSchema(schemaPath, schemaOutputDir) {
    console.log(`--> Processing ${schemaPath} to ${schemaOutputDir}`); // eslint-disable-line no-console

    if (!fs.existsSync(schemaOutputDir)) {
        mkdirp.sync(schemaOutputDir, { mode: "700" });
    }

    const schemaFiles = await readdirp.promise(schemaPath, { root: schemaPath, fileFilter: `*.schema.json` });

    console.log(`loading ${schemaFiles.length} schemas`); // eslint-disable-line no-console

    const schemas = schemaFiles.map((schema) => ({
        fileName: schema.basename,
        fullPath: schema.fullPath,
    }));

    await jsonschema2md(schemas, {
        schemaPath,
        outDir: schemaOutputDir,
        includeReadme: true,
    });
}

function fileIsNotMarkdown(src) {
    return !src.endsWith(".md");
}

async function copyRawSchema(schemaPath, rawOutputDir) {
    console.log(`--> Copying raw schema files from ${schemaPath} to ${rawOutputDir}`); // eslint-disable-line no-console

    if (!fs.existsSync(rawOutputDir)) {
        mkdirp.sync(rawOutputDir, { mode: "700" });
    }

    fse.copySync(schemaPath, rawOutputDir, { preserveTimestamps: true, filter: fileIsNotMarkdown });

    console.log("--> Finished copying"); // eslint-disable-line no-console
}

async function processAllSchemas(schemaPath) {
    const dir = await fs.promises.opendir(schemaPath);

    for await (const dirent of dir) {
        // Required because node <20 doesn't support dirent.path
        const dirPath = path.join(schemaPath, dirent.name);

        const schemaOutputPath = path.join(outputDir, dirent.name, "md");
        const rawOutputPath = path.join(outputDir, dirent.name, "event");

        await processSchema(dirPath, schemaOutputPath);
        await copyRawSchema(dirPath, rawOutputPath);
    }
}

async function zipDocs(docsPath, zipPath) {
    const output = fs.createWriteStream(zipPath);

    const compressionLevel = 9;

    const archive = archiver("zip", {
        zlib: { level: compressionLevel },
    });
    archive.pipe(output);

    // listen for all archive data to be written
    // 'close' event is fired only when a file descriptor is involved
    output.on("close", function () {
        console.log(`${archive.pointer()} total bytes archived`); // eslint-disable-line no-console
    });

    archive.on("error", (err) => {
        throw err;
    });

    archive.directory(docsPath, false);
    archive.finalize();
}

async function main() {
    if (!fs.existsSync(outputDir)) {
        mkdirp.sync(outputDir, { mode: "700" });
    }

    await processAllSchemas(schemaDir);
    await zipDocs(outputDir, zipFilePath);
}

main();
