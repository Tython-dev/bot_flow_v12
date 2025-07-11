# Custom Botpress v12 Dockerfile - based on official image
FROM botpress/server:latest

# Environment variables
ENV BP_WORKDIR=/botpress \
    BP_USER=botpress \
    BP_GROUP=botpress \
    BP_DATA_PATH=$BP_WORKDIR/data \
    BP_MODULE_NLU_DUCKLINGURL=http://localhost:8000 \
    BP_IS_DOCKER=true \
    LANG=C.UTF-8 \
    DUCKLING_DOWNLOAD_URL=https://s3.amazonaws.com/botpress-binaries/duckling-example-exe

# Set up workdir
WORKDIR $BP_WORKDIR

# Add customized files
COPY package.json yarn.lock ./
COPY packages/ui-admin/src/style.scss ./packages/ui-admin/src/
COPY packages/ui-admin/src/auth/style.scss ./packages/ui-admin/src/auth/
COPY packages/ ./packages/
COPY modules/ ./modules/
COPY build/ ./build/
COPY config/ ./config/

# Install all dependencies (including devDependencies for build)
RUN yarn install --frozen-lockfile

# Build the application with cache busting
ARG CACHE_BUST=1
RUN yarn build

# Clean up dev dependencies
RUN yarn install --frozen-lockfile --production

# No need to change permissions - handled by base image

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s \
    CMD curl -f http://localhost:3000/api/v1/status || exit 1

# Expose ports
EXPOSE 3000

# Run as non-root user
USER $BP_USER

# Start command
CMD ./duckling & ./bp
