const fs = require('fs');
const package = require('../package.json');


console.log("start alpha version update.");
const commitHash = process.argv[2];

// 1.2.3,10.20.30など
const regexVersion = /^(\d{1,2})\.(\d{1,2})\.(\d{1,2})$/;
// commit hashを末尾に入れたバージョンがalphaバージョン
const regexVersionHash = /^(\d{1,2}\.\d{1,2}\.\d{1,2})-[a-z0-9]{40}$/;

if (regexVersion.test(package.version)) {
    // 通常バージョン: リリースしてdevelopにマージされた後にfeature/*ブランチを作成した場合
    package.version = `${package.version}-${commitHash}`;
} else if (regexVersionHash.test(package.version)) {
    // alpha: feature/*ブランチのPRにcommitを足した場合、
    // またはfeature/*ブランチをマージした後に新しいfeature/*ブランチを作成した場合
    const version = package.version.match(regexVersionHash)[1];
    package.version = `${version}-${commitHash}`;
} else {
    throw new Error("unexpected alpha version notation.");
}
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
console.log("complete alpha version update.");

const newVersion = package.version;
// Output the new version to $GITHUB_OUTPUT
const output = `version=${newVersion}`;
fs.appendFileSync(process.env.GITHUB_OUTPUT, output + "\n");

console.log(`New alpha version is: ${newVersion}`);
