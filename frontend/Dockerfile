### STAGE 1: Build ###
FROM sartography/cr-connect-angular-base AS builder

COPY . /app/

ARG build_config=prod
RUN npm install && \
    npm run build:$build_config

### STAGE 2: Run ###
FROM nginx:alpine
RUN set -x && apk add --update --no-cache bash libintl gettext curl

COPY --from=builder /app/dist/* /etc/nginx/html/
COPY --from=builder /app/nginx.conf /etc/nginx/conf.d/default.conf

# Script for substituting environment variables
COPY ./docker/substitute-env-variables.sh ./entrypoint.sh
RUN chmod +x ./entrypoint.sh

# Fix for Angular routing
RUN echo "pushstate: enabled" > /etc/nginx/html/Staticfile

# The entrypoint.sh script will run after the container finishes starting.
# Substitutes environment variables in nginx configuration and index.html,
# then starts/reloads nginx.
ENTRYPOINT ["./entrypoint.sh", \
            "/etc/nginx/html/index.html,/etc/nginx/conf.d/default.conf", \
            "PRODUCTION,API_URL,IRB_URL,HOME_ROUTE,BASE_HREF,DEPLOY_URL,PORT0,GOOGLE_ANALYTICS_KEY,SENTRY_KEY,TITLE", \
            "/etc/nginx/html", \
            "true"]
