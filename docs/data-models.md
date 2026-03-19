# Data Models

## Summary
A breakdown of the database schema supporting the Rookies environment highlighting relational bindings, role allocations, and multi-tenant scaling parameters. This system is primarily executed against PostgreSQL via Prisma.

## Multi-Tenancy Architecture
Most system records are fundamentally mapped to the `Business` table utilizing a `business_id` attribute. This bounds individual application data points to explicitly authorized organizations to avoid bleed-over metrics between distinct customers.

## Core Entities
### `User`
The primary atomic identity for an individual utilizing the application.
- `id`: Internal primary identifier.
- `firebase_uid`: External mapping variable syncing the Postgres data to Firebase Auth records. Provides single source truth stability across identity validations.
- `name` / `email`: Human-readable descriptors.

### `Business`
The absolute organization schema tying operational states. 
- `id`: Organization identifier.
- `name`: Business operational name.
- `type`: E.g., 'home_baker', 'kirana'.
- `gst`: Taxation tracking parameters.

### `BusinessMember`
The explicit Join Table resolving many-to-many associations between Users and Businesses handling permissions.
- `user_id`: Link to User
- `business_id`: Link to Business
- `role`: RBAC (Role-Based Access Control) definition. Typically structured as `owner`, `admin`, `staff`, or `viewer`. Controls rights cascading to actions available inside the dashboard interface.

### `Order`
Transactional entries defining a sale mapping.
- `id`: Primary transaction identifier.
- `business_id`: Link to tenant constraints.
- `total_amount`: Absolute cost basis metadata.
- `source`: Platform origin notation (e.g., 'WhatsApp', 'Manual'). This is a critical metric for parsing automation efficiency directly.

### `Customer`
Representing individuals transacting with the host Business.
- `id`: Link mapping.
- `business_id`: Allows users bounding across multiple systems to remain siloed logically. 

### `Payment`
Payment settlement states attached directly to order architectures. Tracks expected vs acquired totals to indicate invoice health levels.

### `InventoryItem`
Tracking parameters related to current available inventory metrics generating alerts.
- `stock_level`: Internal counter updated upon order dispatches or returns.
- `low_stock_threshold`: Generates internal logic triggers sending dashboard alarms.

### `ActivityLog`
A security and observability trail table maintaining immutable records for administrative actions or external mutations impacting Business bound records. 

## Entity Logic Flow 
* A `User` validates via Firebase, generating an internal DB record. Complete.
* Upon dashboard generation, `Business` states and a corresponding `BusinessMember` role is structured establishing rights.
* Webhooks or manual entries will create `Order` architectures linking back directly to specifically instantiated `Business` boundaries.