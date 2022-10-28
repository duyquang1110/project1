#!/bin/bash
cd /home/gitlab-runner/builds/qXZ1DF54/0/solidbytes/web-jobseekers
docker-compose build >> /usr/share/nginx/html/logs/web-jobseekers-build
#docker-compose up -d --no-deps --build >> /usr/share/nginx/html/logs/web-jobseekers-build
docker-compose up -d >> /usr/share/nginx/html/logs/web-jobseekers-build
echo "=======================$CI_COMMIT_SHORT_SHA==========================" >> /usr/share/nginx/html/logs/web-jobseekers-build
echo "=======================$(date)==========================" >> /usr/share/nginx/html/logs/web-jobseekers-build
