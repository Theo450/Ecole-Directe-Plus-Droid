const fs = require("fs");
const path = require("path");

const toCamelCase = (str) =>
    str.replace(/_+([a-z])/g, (_, letter) => letter.toUpperCase());

const isLiteralPath = (content, match) => {
    return (
        content.includes(`"${match}"`) ||
        content.includes(`'${match}'`) ||
        content.includes(`\`${match}\``)
    );
};

const excludeList = ["src/events/messageUpdate.js", "src/utils/webServer.js"];

const shouldExclude = (filePath) => {
    return excludeList.some((excludeItem) =>
        filePath.includes(path.join(...excludeItem.split("/")))
    );
};

const renameVariables = (dir) => {
    fs.readdirSync(dir).forEach((file) => {
        const filePath = path.join(dir, file);

        if (shouldExclude(filePath)) {
            console.log(`Excluded: ${filePath}`);
            return;
        }

        if (fs.statSync(filePath).isDirectory()) {
            renameVariables(filePath);
        } else if (file.endsWith(".js") || file.endsWith(".ts")) {
            let content = fs.readFileSync(filePath, "utf-8");

            const regex = /\b[a-z]+(?:_[a-z]+)+\b(?!["':])/g;

            content = content.replace(regex, (match) => {
                if (isLiteralPath(content, match)) {
                    return match;
                }

                return toCamelCase(match);
            });

            fs.writeFileSync(filePath, content, "utf-8");
            console.log(`Updated variables in: ${filePath}`);
        }

        const newFileName = toCamelCase(file);
        if (newFileName !== file) {
            const newFilePath = path.join(dir, newFileName);
            fs.renameSync(filePath, newFilePath);
            console.log(`Renamed file: ${filePath} --> ${newFilePath}`);
        }
    });
};

renameVariables("./src");
renameVariables("./scripts");

