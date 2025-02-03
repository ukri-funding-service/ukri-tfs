LINE1read='UI/VSC_UI_Sample.json'
LINE1='\nUI/VSC_UI_Sample.json'
LINE2='API/output/reports/'
LINE3='API/VSC_API_Sample.json'
FILE='.gitignore'
grep -qF -- "$LINE1read" "$FILE" || echo -e "$LINE1" >> "$FILE"
grep -qF -- "$LINE2" "$FILE" || echo -e "$LINE2" >> "$FILE"
grep -qF -- "$LINE3" "$FILE" || echo -e "$LINE3" >> "$FILE"