ARG INSTALL_EXTENSIONS="true"
ARG STABLE_EXTENSIONS="wps"
ARG ROOT_WEBAPP_REDIRECT="true"
ARG ENABLE_JSONP="true"

FROM docker.osgeo.org/geoserver:2.26.1 AS geoserver

# Start and enable SSH
RUN mkdir -p /tmp && chmod 1777 /tmp  \
    && apt-get update \
    && apt-get install -y --no-install-recommends dialog \
    && apt-get update \
    && apt-get install -y --no-install-recommends openssh-server \
    && echo "root:Docker!" | chpasswd

    
COPY ./files/ssh/sshd_config /etc/ssh/sshd_config
COPY ./files/ssh/entrypoint.sh /usr/local/bin/entrypoint.sh

RUN chmod u+x /usr/local/bin/entrypoint.sh
EXPOSE 8080 2222

COPY ./files/geoserver_data /usr/local/tomcat/webapps/geoserver/data

ENTRYPOINT [ "/usr/local/bin/entrypoint.sh" ]
