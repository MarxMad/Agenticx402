# Imagen mínima: solo hub (API + UI estática). Sin CLI/MCP en runtime.
# Build: docker build -t pumax402-hub .
# Run:  docker run --rm -p 8080:8080 -e PORT=8080 pumax402-hub
FROM node:22-alpine
WORKDIR /app

COPY catalog/ ./catalog/
COPY apps/catalog-api/ ./apps/catalog-api/
COPY apps/catalog-web/ ./apps/catalog-web/

RUN chown -R node:node /app

ENV NODE_ENV=production
ENV PORT=8080
EXPOSE 8080

USER node
CMD ["node", "apps/catalog-api/server.mjs"]
