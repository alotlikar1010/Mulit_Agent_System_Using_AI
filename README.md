# 🚀 Luminos AI: Production-Ready Multi-Agent AI Platform

Luminos AI is an advanced, enterprise-grade AI microservices platform built using the MERN stack, LangGraph, Redis, Docker, and AWS. The project features an intelligent multi-agent orchestrator that dynamically routes user intents to specialized AI agents (Chat, Search, Coding, PDF/PPT Generation, PDF RAG, and Image Analysis) while utilizing a robust Redis-backed session & rate-limiting system, a Razorpay payment gateway, and an S3-based storage pipeline with secure presigned URLs.

The entire architecture is containerized with Docker, deployed on AWS ECS (Fargate) under a secure VPC with Application Load Balancers (ALB) and CloudFront CDNs, and fully automated via a secure GitHub Actions CI/CD pipeline.

---

## 🏗️ System Architecture

Luminos AI is built on a highly scalable, loosely coupled **Microservices Architecture**. Instead of a monolith, specialized tasks are split into five isolated services communicating internally via **AWS Service Connect (DNS)** and externally routed through an **API Gateway**.

```
                           [ User Browser ]
                                  │
                          (HTTPS via CloudFront)
                                  │
                    ┌─────────────▼─────────────┐
                    │  Application Load Balancer│
                    └─────────────┬─────────────┘
                                  │ (HTTP)
                    ┌─────────────▼─────────────┐
                    │      API Gateway (8000)   │
                    └──────┬───┬───┬───┬────────┘
             ┌─────────────┘   │   │   └─────────────┐
             │                 │   │                 │
     ┌───────▼──────┐    ┌─────▼───▼────┐     ┌──────▼───────┐
     │ Auth Service │    │ Chat Service │     │Billing Serv. │
     │    (8001)    │    │    (8002)    │     │    (8004)    │
     └───────┬──────┘    └───────┬──────┘     └──────┬───────┘
             │                   │                   │
             │           ┌───────▼──────┐            │
             │           │Agent Service │◄───────────┘
             │           │    (8003)    │
             │           └───────┬──────┘
             │ (Sessions)        │ (State Graphs)
   ┌─────────▼───────────────────▼─────────┐
   │ Redis Cache / ElasticCache (6379)     │
   └─────────┬─────────────────────────────┘
             │ (Persistent Data)
   ┌─────────▼─────────────────────────────┐
   │ MongoDB Atlas                         │
   └───────────────────────────────────────┘
```

### Microservice Directory Structure

```
luminos-ai/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions CI/CD Pipeline
├── front-end/                      # React SPA (Vite + Tailwind CSS)
│   ├── src/
│   │   ├── components/             # Sidebar, ChatArea, Artifacts Panel, BillingDrawer
│   │   ├── features/               # Axios API wrappers (login, getConversations, etc.)
│   │   ├── redux/                  # Redux Toolkit (store.js, userSlice, convSlice)
│   │   └── utils/                  # Firebase client setup, Axios instance config
│   ├── Dockerfile
│   └── vite.config.js
└── back-end/                       # Backend Workspace Root
    ├── docker-compose.yml          # Local container orchestration
    ├── shared/                     # Shared Redis Library
    │   └── redis/
    │       └── redis.js            # Redis client singleton (ioredis)
    └── services/
        ├── gateway/                # API Gateway (Express Proxy)
        ├── auth/                   # Authentication Service (Firebase Admin + Session manager)
        ├── chat/                   # Conversation & History Persistence Service
        ├── agent/                  # Multi-Agent StateGraph Engine (LangGraph)
        └── billing/                # Razorpay Billing, Credits, & Plans Service
```

---

## ⚡ Key Technical Features

### 1. 🤖 Intelligent Multi-Agent Orchestration (LangGraph & DeepSeek)
The **Agent Service** runs an advanced state-machine orchestrated by **LangGraph**. A **Router Agent** analyzes the user prompt and classifies the intent, dynamically routing tasks to specialized nodes:
*   **Chat Agent (Groq / Gemini):** Engages in high-speed, general chat with memory loaded from Redis.
*   **Search Agent (Tably / Groq):** Performs real-time web search for current events and compiles sources.
*   **Coding Agent (DeepSeek on OpenRouter):** Generates full-scale files and code structures. Returns structured JSON to populate the custom **Artifacts Panel** in the UI.
*   **PDF Agent (pdfkit):** Dynamically builds formatted multi-page PDF documents, uploads them to AWS S3, and returns secure presigned URLs.
*   **PPT Agent (pptxgenjs):** Generates polished corporate PowerPoint presentations, saves to S3, and hands back download links.
*   **Image Generation Agent:** Synthesizes custom diagrams or images, uploads them to S3, and returns secure references.
*   **PDF RAG Agent (Qdrant Vector DB):** Parses uploaded PDF documents, chunks them, creates vector embeddings using Gemini, stores them in a Qdrant cluster, and performs similarity searches to provide grounded answers.
*   **Image Analyzer Agent (Gemini Vision):** Processes images uploaded to S3, performing visual inspection and text extraction.

### 2. 🛡️ Redis-Backed Global Sessions & Rate Limiting
To ensure enterprise security and fair-use resource allocation:
*   **Stateful Auths:** Sessions are generated upon Firebase verification, stored in Redis under `session:<id>`, and verified at the Gateway level via custom middleware (`auth.middleware.js`). This ensures zero database hits for auth validation, keeping response times under 5ms.
*   **Token-Cost Rate Limiting:** Redis stores sliding-window rate counters for each user under `rate:<user_id>:<agent>`. Each specialized agent has a distinct "credit cost" (e.g., Chat costs 1 credit, Coding costs 10 credits, PDF RAG costs 10 credits). If a user exhausts their credits or hits rate limits, the request is blocked, returning a `429 Too Many Requests` status with a retry countdown.

### 3. 💳 Razorpay Credit & Billing System
The platform integrates **Razorpay** payments with automatic database webhooks to support a tier-based pricing model:
*   **Free Plan (Default):** 100 credits upon signup, valid for 30 days.
*   **Starter Plan (199 INR):** Grants 500 additional credits.
*   **Pro Plan (499 INR):** Grants 1,000 additional credits.
*   Transactions are saved securely to MongoDB using a `Payment` schema (tracking `orderId`, `paymentId`, `signature`, and `status: Paid/Failed/Created`). Successful verifications automatically increment user credits and update their plan tier in both MongoDB and the active Redis session cache.

### 4. 🎨 Enterprise UI with "Artifacts Panel"
The front-end React SPA includes a dual-panel layout modeled after advanced developer tools:
*   **Chat Workspace:** Real-time conversational interface rendering Markdown (`react-markdown` + `remark-gfm`) and highlighting syntax (`react-syntax-highlighter`).
*   **Interactive Artifacts Panel:** When the Coding Agent generates files, the code automatically populates an embedded **Monaco Editor** (`@monaco-editor/react`). Users can switch files, copy code, or preview a sandboxed iframe render of the HTML/CSS/JS artifacts directly in the UI.

---
## 🛠️ Technology Stack

| Layer | Technologies & Libraries |
|---|---|
| **Frontend** | React, Vite, Tailwind CSS, Redux Toolkit, React-Redux, Monaco Editor, Axios, Firebase SDK, React Markdown, Lucide Icons, Razorpay Standard Checkout Script |
| **Gateway** | Node.js, Express, `express-http-proxy`, `cors`, `cookie-parser`, `morgan`, `dotenv` |
| **Auth Service** | Node.js, Express, Mongoose, Firebase Admin SDK, `ioredis` |
| **Chat Service** | Node.js, Express, Mongoose (MongoDB schemas for `Message`, `Conversation`) |
| **Agent Service** | LangGraph, LangChain Core, LangChain Groq, LangChain Google GenAI, LangChain OpenRouter (DeepSeek Chat), Qdrant Rest Client, AWS S3 SDK (`@aws-sdk/client-s3`), S3 Presigner, `pdfkit`, `pptxgenjs`, `multer`, `ioredis` |
| **Billing Service** | Node.js, Express, Mongoose, `razorpay` |
| **Databases** | MongoDB Atlas (Persistent), Redis / AWS ElastiCache (Caching & Session management), Qdrant Cloud (Vector Store) |
| **DevOps & Infra** | Docker, Docker Compose, AWS ECR, AWS ECS (Fargate), Application Load Balancer (ALB), AWS CloudFront, AWS CloudWatch, AWS ElastiCache Redis, GitHub Actions |

---
## 🔑 Environment Variables Configuration

Create a `.env` file in each respective directory based on the following configurations.

### 1. API Gateway (`back-end/services/gateway/.env`)
```env
PORT=8000
FRONTEND_URL=http://localhost:5173
REDIS_URL=redis://localhost:6379
AUTH_SERVICE_URL=http://localhost:8001
CHAT_SERVICE_URL=http://localhost:8002
AGENT_SERVICE_URL=http://localhost:8003
BILLING_SERVICE_URL=http://localhost:8004
```

### 2. Auth Service (`back-end/services/auth/.env`)
```env
PORT=8001
MONGO_DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luminos_auth
REDIS_URL=redis://localhost:6379
```
*Note: Make sure to place your Firebase Private Key JSON as `serviceAccountKey.json` inside the Auth service directory to initialize the Firebase Admin SDK.*

### 3. Chat Service (`back-end/services/chat/.env`)
```env
PORT=8002
MONGO_DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luminos_chat
```

### 4. Agent Service (`back-end/services/agent/.env`)
```env
PORT=8003
REDIS_URL=redis://localhost:6379
CHAT_SERVICE_URL=http://localhost:8002
AUTH_SERVICE_URL=http://localhost:8001

# LLM APIs
GROQ_API_KEY=gsk_...
GOOGLE_API_KEY=AIzaSy...
OPEN_ROUTER_API_KEY=sk-or-...
TABLY_API_KEY=tab-...

# Vector Database
QUADRANT_API_KEY=...
QUADRANT_ENDPOINT=https://...qdrant.io

# S3 File Storage
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=ap-south-1
AWS_BUCKET_NAME=luminos-ai-agent-bucket
```

### 5. Billing Service (`back-end/services/billing/.env`)
```env
PORT=8004
MONGO_DB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/luminos_billing
AUTH_SERVICE_URL=http://localhost:8001
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

### 6. Frontend App (`front-end/.env`)
```env
VITE_SERVER_URL=http://localhost:8000
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_RAZORPAY_KEY_ID=rzp_test_...
```

---
## 🐳 Local Development & Containerization

### Dockerfile Pattern (Microservices)
Every backend microservice has an optimized multi-stage build. Here is the standardized `Dockerfile` used:

```dockerfile
# Stage 1: Build & Dependencies
FROM node:18-alpine AS builder
WORKDIR /app

# Copy root configurations (for shared packages)
COPY package*.json ./
RUN npm install --production

# Copy Shared Redis library and service code
COPY shared/ /shared/
COPY services/gateways/ ./    # (or the specific service folder)

# Stage 2: Runtime
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app ./
COPY --from=builder /shared /shared

EXPOSE 8000
CMD ["npm", "start"]
```

### Orcherstrating locally (`back-end/docker-compose.yml`)
To spin up the entire microservice ecosystem locally including a persistent Redis cache:

```yaml
version: '3.8'

services:
  redis:
    image: redis:alpine
    container_name: luminos_redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  gateway:
    build:
      context: ../
      dockerfile: services/gateway/Dockerfile
    ports:
      - "8000:8000"
    environment:
      - PORT=8000
      - REDIS_URL=redis://redis:6379
      - AUTH_SERVICE_URL=http://auth:8001
      - CHAT_SERVICE_URL=http://chat:8002
      - AGENT_SERVICE_URL=http://agent:8003
      - BILLING_SERVICE_URL=http://billing:8004
    depends_on:
      - redis

  auth:
    build:
      context: ../
      dockerfile: services/auth/Dockerfile
    ports:
      - "8001:8001"
    environment:
      - PORT=8001
      - REDIS_URL=redis://redis:6379
      - MONGO_DB_URI=mongodb+srv://...
    depends_on:
      - redis

  chat:
    build:
      context: ../
      dockerfile: services/chat/Dockerfile
    ports:
      - "8002:8002"
    environment:
      - PORT=8002
      - MONGO_DB_URI=mongodb+srv://...

  agent:
    build:
      context: ../
      dockerfile: services/agent/Dockerfile
    ports:
      - "8003:8003"
    environment:
      - PORT=8003
      - REDIS_URL=redis://redis:6379
      - CHAT_SERVICE_URL=http://chat:8002
      - AUTH_SERVICE_URL=http://auth:8001
      - GROQ_API_KEY=...
      - GOOGLE_API_KEY=...
      - OPEN_ROUTER_API_KEY=...
      - TABLY_API_KEY=...
      - AWS_ACCESS_KEY_ID=...
      - AWS_SECRET_ACCESS_KEY=...
      - AWS_REGION=ap-south-1
      - AWS_BUCKET_NAME=...
      - QUADRANT_API_KEY=...
      - QUADRANT_ENDPOINT=...
    depends_on:
      - redis

  billing:
    build:
      context: ../
      dockerfile: services/billing/Dockerfile
    ports:
      - "8004:8004"
    environment:
      - PORT=8004
      - MONGO_DB_URI=mongodb+srv://...
      - AUTH_SERVICE_URL=http://auth:8001
      - RAZORPAY_KEY_ID=...
      - RAZORPAY_KEY_SECRET=...

volumes:
  redis_data:
```

To boot up the infrastructure, run:
```bash
docker-compose up --build
```

---
## ☁️ Enterprise Deployment on AWS (ECS & CloudFront)

For high-availability, scalability, and secure HTTPS handling, the production stack is hosted entirely on AWS:

### 1. VPC Network Layout
*   **Virtual Private Cloud (VPC):** Constructed with two Public Subnets and two Private Subnets across distinct Availability Zones.
*   **Security Groups:**
    *   **ALB Security Group:** Allows inbound TCP traffic on port `80` (HTTP) and `443` (HTTPS) from any source.
    *   **ECS Fargate Service Security Group:** Restricts inbound TCP traffic to API Gateway port `8000` solely from the ALB Security Group. Service Connect facilitates internal cluster DNS resolution (TCP ports `8001`-`8004`) securely without external exposure.
    *   **Redis Cache Security Group:** Restricts inbound port `6379` traffic strictly to the ECS Fargate Security Group.

### 2. AWS Services Configuration
*   **AWS ElastiCache Redis:** A secure, clustered managed Redis instance handles live sessions and rate limit windows.
*   **AWS Elastic Container Registry (ECR):** Host registry containing five private repositories: `gateway`, `auth`, `chat`, `agent`, and `billing`.
*   **AWS Elastic Container Service (ECS):** A serverless Fargate cluster manages tasks with automatic vertical & horizontal scaling configured to trigger above **70% CPU/Memory utilization**.
*   **Application Load Balancer (ALB):** Inspects incoming HTTP/HTTPS traffic at the edge and routes them to the active Gateway ECS target group (`ALB-TG`).
*   **AWS S3 & CloudFront (Frontend):** The frontend static output `dist/` is hosted in an S3 Bucket with public access blocked via **Origin Access Control (OAI/OAC)**. AWS CloudFront operates as the CDN, enforcing SSL/TLS certificate handshakes, mapping root routing to `index.html`, and proxying API calls cleanly:
    *   `/` paths are routed directly to the S3 bucket origin.
    *   `/api/*` paths are routed as behaviors to the Application Load Balancer origin.

---
## 🔄 CI/CD Automation (GitHub Actions)

A complete automated Pipeline is scripted in `.github/workflows/deploy.yml` which deploys both the backend microservices (via AWS ECR & ECS update) and the frontend (via AWS S3 sync & CloudFront Invalidation) seamlessly on every push to the `main` branch.

### Full Pipeline Workflow File (`.github/workflows/deploy.yml`)
```yaml
name: Luminos AI Production Deployment

on:
  push:
    branches:
      - main

env:
  AWS_REGION: ap-south-1

jobs:
  deploy-backend:
    name: Build & Release Microservices
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code Repository
        uses: actions/checkout@v4

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Log in to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      # -------------------------------------------------------------
      # Build, Tag & Push Microservices
      # -------------------------------------------------------------
      - name: Gateway Service - Build & Release
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: gateway
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest -f back-end/services/gateway/Dockerfile back-end/
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Auth Service - Build & Release
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: auth-service
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest -f back-end/services/auth/Dockerfile back-end/
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Chat Service - Build & Release
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: chat-service
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest -f back-end/services/chat/Dockerfile back-end/
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Agent Service - Build & Release
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: agent-service
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest -f back-end/services/agent/Dockerfile back-end/
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Billing Service - Build & Release
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: billing-service
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest -f back-end/services/billing/Dockerfile back-end/
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      # -------------------------------------------------------------
      # Force New Deployments on AWS ECS Tasks
      # -------------------------------------------------------------
      - name: Deploy Tasks on ECS
        run: |
          aws ecs update-service --cluster ${{ secrets.ECS_CLUSTER }} --service ${{ secrets.GATEWAY_SERVICE }} --force-new-deployment
          aws ecs update-service --cluster ${{ secrets.ECS_CLUSTER }} --service ${{ secrets.AUTH_SERVICE }} --force-new-deployment
          aws ecs update-service --cluster ${{ secrets.ECS_CLUSTER }} --service ${{ secrets.CHAT_SERVICE }} --force-new-deployment
          aws ecs update-service --cluster ${{ secrets.ECS_CLUSTER }} --service ${{ secrets.AGENT_SERVICE }} --force-new-deployment
          aws ecs update-service --cluster ${{ secrets.ECS_CLUSTER }} --service ${{ secrets.BILLING_SERVICE }} --force-new-deployment

  deploy-frontend:
    name: Compile & Distribute Client Application
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code Repository
        uses: actions/checkout@v4

      - name: Setup Node.js Context
        uses: actions/setup-node@v4
        with:
          node-version: 18

      - name: Compile Distributable Output (Vite Build)
        run: |
          cd front-end/
          npm install
          npm run build

      - name: Configure AWS Credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Synchronize Static Files with S3
        run: |
          aws s3 sync front-end/dist/ s3://${{ secrets.S3_BUCKET }} --delete

      - name: Purge CloudFront Edge Cache
        run: |
          aws cloudfront create-invalidation --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} --paths "/*"
```

### Required GitHub Repository Secrets
To execute this deployment, add these credentials to your repository under **Settings > Secrets and variables > Actions**:
1.  `AWS_ACCESS_KEY_ID`: AWS IAM user credentials.
2.  `AWS_SECRET_ACCESS_KEY`: AWS IAM secret key.
3.  `ECS_CLUSTER`: The name of your AWS ECS Cluster (e.g., `luminos-ai-cluster`).
4.  `GATEWAY_SERVICE` / `AUTH_SERVICE` / `CHAT_SERVICE` / `AGENT_SERVICE` / `BILLING_SERVICE`: The respective service names as declared in your ECS Cluster task definitions.
5.  `S3_BUCKET`: The destination AWS S3 Bucket Name for static hosting (e.g., `luminos-ai-frontend`).
6.  `CLOUDFRONT_DISTRIBUTION_ID`: The distribution ID hosting your application to enable cache invalidation on new builds.

---

## 🛠️ Verification & Testing

1.  **Backend Gateways Check:**
    Access your cloud domain or ALB URL directly at `http://<alb-endpoint>/`. It should resolve to the Gateway index route and return:
    ```json
    { "message": "Hello from Gateway" }
    ```
2.  **API Verification:**
    Check auth health by pinging `https://<cloudfront-domain>/api/auth/health` or `https://<cloudfront-domain>/api/me` which resolves through CloudFront SSL seamlessly to the backend target groups.
