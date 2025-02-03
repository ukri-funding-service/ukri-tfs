printf "Are you using VSCode? Y/N?" &&
	read vscode &&
	if [ "$vscode" = "Y" ] || [ "$vscode" = "y" ]; then
		case "$OSTYPE" in
		darwin*) echo Will add user settings and install extension &&
			/Applications/Visual\ Studio\ Code.app/Contents/Resources/app/bin/code --install-extension alexkrechik.cucumberautocomplete &&
			echo Will add cucumberautocomplete config to settings.json &&
			mkdir -p ./.vscode && cp -n ./node_modules/@ukri-tfs/test-framework/scripts/VSC_settings.json ./.vscode/settings.json &&
			echo Done please restart VSCode ;;
		msys*) echo Will add user settings and install extension &&
			code --install-extension alexkrechik.cucumberautocomplete &&
			echo Will add cucumberautocomplete config to settings.json &&
			mkdir -p ./.vscode && cp -n ./node_modules/@ukri-tfs/test-framework/scripts/VSC_settings.json ./.vscode/settings.json &&
			echo Done please restart VSCode ;;
		*) echo "Unsupported OS" ;;
		esac
	fi
printf "Please select installation \n1. API Framework \n2. UI Framework \n3. Performance Framework \n4. All \n5. Quit \n" &&
	read tag &&
	if [ "$tag" = "1" ]; then
		echo Will configure API Framework &&
			node ./node_modules/add-npm-scripts/bin/module.js config:apitest "ukri-test-framework config:apitest" &&
			npm run config:apitest
	fi
if [ "$tag" = "2" ]; then
	echo Will configure UI Framework &&
		node ./node_modules/add-npm-scripts/bin/module.js config:uitest "ukri-test-framework config:uitest" &&
		npm run config:uitest
fi
if [ "$tag" = "3" ]; then
	echo Will configure Performance Framework &&
		node ./node_modules/add-npm-scripts/bin/module.js config:perftest "ukri-test-framework config:perftest" &&
		npm run config:perftest
fi
if [ "$tag" = "4" ]; then
	echo Will configure All Framework &&
		node ./node_modules/add-npm-scripts/bin/module.js config:alltest "ukri-test-framework config:perftest && ukri-test-framework config:uitest && ukri-test-framework config:apitest" &&
		npm run config:alltest
fi
if [ "$tag" = "5" ]; then
	break
fi
