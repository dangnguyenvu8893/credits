# User API Endpoints

## Base URL
```
/api/users
```

## Endpoints

### 1. List All Users
**GET** `/api/users`

**Response:**
```json
{
  "users": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "fullname": "Nguyen Van A",
      "birthdate": "1990-01-01",
      "idNumber": "123456789012",
      "address": "123 Nguyen Trai, Ha Noi",
      "maritalStatus": "Single",
      "phoneNumber": "0123456789",
      "occupation": "Software Engineer",
      "salary": 20000000,
      "cicRank": "A",
      "createdAt": "2024-01-01T00:00:00Z",
      "updatedAt": "2024-01-01T00:00:00Z"
    }
  ]
}
```

### 2. Create User
**POST** `/api/users`

**Request Body:**
```json
{
  "email": "user@example.com",
  "fullname": "Nguyen Van A",
  "birthdate": "1990-01-01",
  "idNumber": "123456789012",
  "address": "123 Nguyen Trai, Ha Noi",
  "maritalStatus": "Single",
  "phoneNumber": "0123456789",
  "occupation": "Software Engineer",
  "salary": 20000000,
  "cicRank": "A"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullname": "Nguyen Van A",
    // ... other fields
  }
}
```

### 3. Get User by ID
**GET** `/api/users/{id}`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    // ... other fields
  }
}
```

### 4. Update User
**PUT** `/api/users/{id}`

**Request Body:** (all fields are optional)
```json
{
  "email": "newemail@example.com",
  "fullname": "Nguyen Van B",
  "salary": 25000000
}
```

**Response:**
```json
{
  "message": "User updated successfully",
  "user": {
    "id": "uuid",
    "email": "newemail@example.com",
    // ... updated fields
  }
}
```

### 5. Delete User
**DELETE** `/api/users/{id}`

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

### 6. Search User
**GET** `/api/users/search?email=user@example.com`
**GET** `/api/users/search?idNumber=123456789012`

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    // ... other fields
  }
}
```

## Validation Rules

### Email
- Must be a valid email format
- Must be unique

### Phone Number
- Must follow Vietnamese format: `+84`, `84`, or `0` followed by 9 digits
- Examples: `0123456789`, `+84123456789`, `84123456789`

### ID Number
- Must be unique
- String format

### Salary
- Must be positive integer
- In VND currency

### Required Fields
All fields are required when creating a user:
- email
- fullname
- birthdate
- idNumber
- address
- maritalStatus
- phoneNumber
- occupation
- salary
- cicRank

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: email, fullname"
}
```

### 404 Not Found
```json
{
  "error": "User not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to create user"
}
```

## Example Usage

### Using fetch in JavaScript
```javascript
// Create user
const response = await fetch('/api/users', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    fullname: 'Nguyen Van A',
    birthdate: '1990-01-01',
    idNumber: '123456789012',
    address: '123 Nguyen Trai, Ha Noi',
    maritalStatus: 'Single',
    phoneNumber: '0123456789',
    occupation: 'Software Engineer',
    salary: 20000000,
    cicRank: 'A'
  })
});

const data = await response.json();
```

### Using curl
```bash
# List all users
curl -X GET http://localhost:3000/api/users

# Create user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "fullname": "Nguyen Van A",
    "birthdate": "1990-01-01",
    "idNumber": "123456789012",
    "address": "123 Nguyen Trai, Ha Noi",
    "maritalStatus": "Single",
    "phoneNumber": "0123456789",
    "occupation": "Software Engineer",
    "salary": 20000000,
    "cicRank": "A"
  }' 