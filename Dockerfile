FROM mysql:8.1

# Move or remove the original dir if it exists
RUN if [ -d /var/lib/mysql ]; then mv /var/lib/mysql /tmp/mysql; fi

# Create a new dir
RUN mkdir -p /var/lib/mysql

# Change owner to mysql (user and group)
RUN chown 777 /var/lib/mysql

# Check if the data directory is empty before initializing
RUN test -z "$(ls -A /var/lib/mysql)" && mysqld --initialize-insecure || true

CMD ["mysqld"]
