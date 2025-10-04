# Production stage - Einfach und schnell!
FROM nginx:alpine

# Copy pre-built files directly (no build needed!)
COPY dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
