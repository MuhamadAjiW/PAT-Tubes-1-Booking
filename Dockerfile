FROM tomee:9.1.1-jre11
WORKDIR /usr/local/tomee/webapps
COPY target/piss-1.0.war ./ROOT.war
COPY .env_docker ./.env
EXPOSE 8080
RUN rm -rf ./ROOT
CMD ["catalina.sh", "run"]