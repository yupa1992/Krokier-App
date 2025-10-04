# Build stage - Use full Node image instead of Alpine
FROM node:18 as build

WORKDIR /app

# Copy all files first
COPY . .

# Clean any existing node_modules and package-lock
RUN rm -rf node_modules package-lock.json

# Install dependencies with force flag
RUN npm install --force

# Build the app
RUN npm run build

# Production stage - Use Alpine for smaller final image
FROM nginx:alpine

# Copy built files to nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
