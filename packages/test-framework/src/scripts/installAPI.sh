case "$OSTYPE" in
darwin*) 
echo MACOSX &&
node ./node_modules/add-npm-scripts/bin/module.js test:component "ukri-test-framework test:API:component" &&
node ./node_modules/add-npm-scripts/bin/module.js test:API:component "ukri-test-framework test:API:component" && 
node ./node_modules/add-npm-scripts/bin/module.js test:API:all "ukri-test-framework test:API:all" && 
node ./node_modules/add-npm-scripts/bin/module.js test:API:integration "ukri-test-framework test:API:integration" && 
node ./node_modules/add-npm-scripts/bin/module.js test:API:tag "ukri-test-framework test:API:tag" && 
node ./node_modules/add-npm-scripts/bin/module.js test:API:report "ukri-test-framework test:API:report" && 
node ./node_modules/add-npm-scripts/bin/module.js test:smoke "tag=smoke npm run test:API:tag" && 
node ./node_modules/add-npm-scripts/bin/module.js test:API:debug "ukri-test-framework test:API:debug" && 
mkdir -p ./API/features &&
cp ./node_modules/@ukri-tfs/test-framework/API/features/demo.feature ./API/features &&
mkdir -p ./API/output/reports &&
mkdir -p ./API/steps &&
mkdir -p ./API/helpers &&
cp -rf ./node_modules/@ukri-tfs/test-framework/scripts/api-steps.js ./API/steps &&
cp -rf ./node_modules/@ukri-tfs/test-framework/scripts/VSC_API_Sample.json ./API
bash node_modules/@ukri-tfs/test-framework/scripts/updateGitIgnore.sh
read -p "Finished! Press enter to continue" nothing
;;
msys*) 
echo WINDOWS &&
node ./node_modules/add-npm-scripts/bin/module.js test:component "ukri-test-framework test:API:component" &&
node ./node_modules/add-npm-scripts/bin/module.js test:API:component "ukri-test-framework test:API:component" && 
node ./node_modules/add-npm-scripts/bin/module.js test:API:all "ukri-test-framework test:API:all" && 
node ./node_modules/add-npm-scripts/bin/module.js test:API:integration "ukri-test-framework test:API:integration" && 
node ./node_modules/add-npm-scripts/bin/module.js test:API:tag "ukri-test-framework test:API:tag" && 
node ./node_modules/add-npm-scripts/bin/module.js test:API:report "ukri-test-framework test:API:report" && 
node ./node_modules/add-npm-scripts/bin/module.js test:smoke "tag=smoke npm run test:API:tag" && 
node ./node_modules/add-npm-scripts/bin/module.js test:API:debug "ukri-test-framework test:API:debug" && 
mkdir -p API &&
cd API &&
mkdir -p features helpers steps output &&
cd ../.. &&
echo $PWD &&
cp node_modules/@ukri-tfs/test-framework/API/features/demo.feature API/features/ &&
cp node_modules/@ukri-tfs/test-framework/scripts/api-steps.js API/steps/ &&
cp node_modules/@ukri-tfs/test-framework/scripts/VSC_API_Sample.json API
bash node_modules/@ukri-tfs/test-framework/scripts/updateGitIgnore.sh
read -p "Finished! Press enter to continue" nothing
;;
*) echo "Unsupported OS" ;;
esac
