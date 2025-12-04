FROM node:lts

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies (these will be in named volume in production)
RUN npm install

# Copy the rest of the application
COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]
