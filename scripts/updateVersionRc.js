const fs = require('fs');
const package = require('../package.json');

console.log("start rc version update.");
// 1.2.3,10.20.30など
const regexVersion = /^(\d{1,2})\.(\d{1,2})\.(\d{1,2})$/;
// 1.2.3-rc.1,1.2.3-rc.10,1.2.3-rc.100など
const regexVersionRc = /(\d{1,2}\.\d{1,2}\.\d{1,2}-rc\.)(\d{1,3})$/;
// commit hashを末尾に入れたバージョンがalphaバージョン
const regexVersionHash = /^(\d{1,2})\.(\d{1,2})\.(\d{1,2})-[a-z0-9]{40}$/;

if (regexVersion.test(package.version)) {
    // 通常バージョン: mainブランチからhotfix/*ブランチを作成した場合
    // patchバージョンを上げる
    const match = package.version.match(regexVersion);
    const major = match[1];
    const minor = match[2];
    const patch = parseInt(match[3]) + 1;
    package.version = `${major}.${minor}.${patch}-rc.0`;
} else if (regexVersionRc.test(package.version)) {
    // rc: rcのPRを作成して、commitを足した場合
    package.version = package.version.replace(regexVersionRc, (_, prefix, rcNum) => {
        const incrementedRc = parseInt(rcNum) + 1;
        return `${prefix}${incrementedRc}`;
    });
} else if (regexVersionHash.test(package.version)) {
    // alpha: feature/*ブランチをマージした後にrelease/*ブランチを作成した場合
    // minorバージョンを上げる
    const match = package.version.match(regexVersionHash);
    const major = match[1];
    const minor = parseInt(match[2]) + 1;
    const patch = match[3];
    package.version = `${major}.${minor}.${patch}-rc.0`;
} else {
    throw new Error("unexpected rc version notation.");
}
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
console.log("complete rc version update.");

const newVersion = package.version;
// Output the new version to $GITHUB_OUTPUT
const output = `version=${newVersion}`;
fs.appendFileSync(process.env.GITHUB_OUTPUT, output + "\n");

console.log(`New rc version is: ${newVersion}`);
