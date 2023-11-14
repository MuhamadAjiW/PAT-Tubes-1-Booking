FROM ubuntu:latest
LABEL authors="Darwin"

ENTRYPOINT ["top", "-b"]