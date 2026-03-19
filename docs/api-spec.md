# API Specifications

## Summary
The API layer is responsible for interfacing between external services, authentication providers, and standard client applications. Rookies utilizes Next.js App Router API parameters natively structurally deployed over `/api/` domains. 

## 1. Authentication Endpoints

### `POST /api/auth/session`
Validates external IDP credentials mapped via Firebase UI converting structural metrics against internal long-lived cookies cleanly authorizing states dynamically over Edge environments organically mapped against Next.js middleware hooks.

- **Request Headers:**
  - `Authorization: Bearer <Firebase_ID_Token>`
- **Processing Logic:** 
  - Validates structurally utilizing `firebase-admin` keys. Next, triggers a backend sequence pushing data states towards PostgreSQL mapping unified DB rows bounding new User models or verifying existing mappings dynamically logically bounding states via Upsert calls locally managing connection parameters tightly gracefully yielding an active session. 
- **Response Structure (200 OK):**
  - Issues explicit HTTP-only header variables `Set-Cookie: __session="..."` dynamically resolving logic constraints explicitly managing subsequent requests functionally natively structurally caching identity logic seamlessly bounding logic appropriately rendering a basic `{"success": true}` mapped body. 

## 2. Order Aggregation

### `GET /api/orders`
Extracts high-level queries against established transactional logic pulling latest operational constraints explicitly relying upon administrative privileges locally extracting datasets logically overriding general client boundaries when structured effectively logically maintaining clean abstraction parameters efficiently. 

- **Response:**
  - Returns structured `json` mappings directly reflecting `Order` tables explicitly returning arrays of objects defining totals, dates, source attributions strictly bounded.

## 3. Webhooks & Integrations

### `POST /api/webhooks/n8n`
Crucial logic gate capturing automation responses (i.e. WhatsApp bots). It translates payload metrics explicitly saving data states matching conversational checkout logs natively pushing structural modifications into system states seamlessly structurally mapping logic explicitly mapping against predefined DB schema parameters organically parsing payloads structurally.

- **Security Requirements:**
  - `x-rookies-secret: <Secret Key Value>` MUST MATCH internal environmental logic precisely terminating execution abruptly if missing preventing unverified data injection structurally cleanly.
- **Expected Payload Example:**
  ```json
  {
    "order": {
      "customer_details": {
         "phone": "+91XXXXXXXXXX",
         "name": "Jane Doe"
      },
      "items": [ ... ],
      "total_amount": 1400.00
    }
  }
  ```
- **Processing Flow:** 
  - First, strictly map incoming `JSON` payloads against predefined `Zod` logic bounds structurally capturing invalid schema parameters rapidly. If passing, execute complex queries via Prisma creating `Customer` metrics seamlessly appending linked `Order` objects validating successful execution structurally functionally.