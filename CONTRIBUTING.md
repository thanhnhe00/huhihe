# Backend Development Rules

## Repository Priority

Always follow this priority:

1. Project Report (.docx)
2. Existing Frontend
3. Common Software Engineering Practices

---

# Backend

Generate backend only inside

```
be/
```

Do not create another backend project.

---

# Frontend

Treat the frontend as the final product.

Do NOT

- redesign UI
- replace components
- change routes
- rename pages
- modify project architecture

unless absolutely necessary.

---

# Report

The project report is the source of truth.

Before writing code, identify:

- Functional Requirements
- Non-functional Requirements
- User Roles
- Use Cases
- Database Design
- ER Diagram
- Business Rules
- Required Technologies

---

# API

Inspect the frontend before implementing APIs.

Backend endpoints should match frontend requests whenever possible.

Do not rename endpoints unless required by the report.

---

# Technology

Preferred stack:

- Java
- Spring Boot
- Spring Security
- JWT
- Spring Data JPA
- Hibernate
- MySQL
- Lombok
- Validation
- Maven

Use the technologies specified in the report if different.

---

# Code Structure

Use a layered architecture.

Example

```
Controller
↓

Service
↓

Repository
↓

Database
```

Use DTOs for request and response.

Use Global Exception Handling.

Use Validation.

Use RESTful APIs.

---

# Workflow

Complete the project incrementally.

Step 1

Read the report.

Step 2

Summarize all requirements.

Step 3

Design the database.

Step 4

Generate entities.

Step 5

Generate repositories.

Step 6

Generate services.

Step 7

Generate controllers.

Step 8

Configure Spring Security and JWT.

Step 9

Generate seed data if required.

Step 10

Verify compatibility with the frontend.

Never generate the entire backend in a single step.

Wait for verification after each major step.