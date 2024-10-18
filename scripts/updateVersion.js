const fs = require('fs');
const package = require('../package.json');

console.log("start release version update.");
// 1.2.3-rc.1,1.2.3-rc.10,1.2.3-rc.100など
const regexVersionRc = /^(\d{1,2}\.\d{1,2}\.\d{1,2})-rc\.\d{1,3}$/;;

// 正式リリースはrcを経由しないと出せない
// release/*ブランチからのマージではminorバージョンが、
// hotfix/*ブランチからのマージではpatchバージョンが上がる。
// majorバージョンを上げたい場合には手動でpackage.jsonのversionを変更する。
if (regexVersionRc.test(package.version)) {
    // v○.○.○の箇所のみ抜き出す
    package.version = package.version.match(regexVersionRc)[1];
} else {
    throw new Error("unexpected release version notation.");
}
fs.writeFileSync('./package.json', JSON.stringify(package, null, 2));
console.log("complete release version update.");

const newVersion = package.version;
// Output the new version to $GITHUB_OUTPUT
const output = `version=${newVersion}`;
fs.appendFileSync(process.env.GITHUB_OUTPUT, output + "\n");

console.log(`New release version is: ${newVersion}`);
