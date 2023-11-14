mvn clean package && ^
mvn tomee:build && ^
copy /Y .env_local .\target\apache-tomee\.env && ^
copy /Y .\src\main\resources\tomee.xml .\target\apache-tomee\conf\tomee.xml && ^
mvn tomee:run