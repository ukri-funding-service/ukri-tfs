if [ -z "$tag" ]
then
      echo Please enter tag you wish to run \
      && read tag \
      && echo Will execute with @$tag tag \
      && node node_modules/cucumber/bin/cucumber-js \
            --tags @$tag ./API/features \
            -r ./node_modules/ukri-test-framework/API/steps \
            -f json:./API/output/reports/cucumber-report.json \
            -f html:./API/output/reports/cucumber-report.html \
      && npm run test:API:report
else
      echo Will execute with @$tag tag \
      && node node_modules/cucumber/bin/cucumber-js \
            --tags @$tag ./API/features \
            -r ./node_modules/ukri-test-framework/API/test/steps \
            -f json:./API/output/reports/cucumber-report.json \
            -f html:./API/output/reports/cucumber-report.html \
      && npm run test:API:report
fi
