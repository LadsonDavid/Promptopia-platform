export const PROMPT_DUELS = [
    {
        id: 1,
        goal: "Extract only financial risks for an EV startup entering India in 2026.",
        promptA: "You are a market analyst. Analyze the Indian EV market for a startup entering in 2026. Identify key challenges and risks in bullet points.",
        promptB: "You are a market analyst. Analyze the Indian EV market for a startup entering in 2026. Identify only financial risks (costs, capital, margins, cashflow). Exclude technology, regulation, or demand. Output 5 bullet points.",
        output1: "• High battery cost\n• Regulatory uncertainty\n• Consumer adoption risk\n• Charging infrastructure\n• Supply chain volatility",
        output2: "• High upfront battery procurement costs\n• Thin operating margins due to price competition\n• Working-capital strain from delayed dealer payments\n• High warranty and replacement liabilities\n• Currency risk on imported components",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 2,
        goal: "Generate a professional email subject line for a product launch (max 8 words).",
        promptA: "Write a professional email subject line announcing our new AI-powered analytics tool launching next month.",
        promptB: "Write a professional email subject line (maximum 8 words) announcing our new AI-powered analytics tool launching next month. Count words strictly.",
        output1: "Introducing Our Revolutionary AI-Powered Analytics Platform",
        output2: "Launch: AI Analytics Tool Available Next Month",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 3,
        goal: "List only technical requirements (no business or user requirements) for a mobile banking app.",
        promptA: "List the requirements for building a secure mobile banking application. Be comprehensive.",
        promptB: "List only technical/infrastructure requirements for a mobile banking app: servers, APIs, databases, security protocols, encryption. Exclude business features, UI/UX, or user stories. Output 6 items.",
        output1: "• User-friendly interface\n• Account balance viewing\n• Secure login system\n• Fast transaction processing\n• Customer support chat\n• Biometric authentication",
        output2: "• AES-256 encryption for data at rest\n• OAuth 2.0 + JWT for authentication\n• PostgreSQL with read replicas\n• RESTful API with rate limiting\n• TLS 1.3 for data in transit\n• Redis caching layer for sessions",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 4,
        goal: "Summarize a research paper in exactly 3 sentences, focusing only on methodology.",
        promptA: "Summarize this research paper on climate modeling in 3 sentences, focusing on the methods used.",
        promptB: "Summarize the methodology section only in exactly 3 sentences. Each sentence: one method aspect. Exclude results, implications, or background. Count sentences strictly.",
        output1: "This groundbreaking study uses advanced climate models to predict temperature changes. The researchers collected data from 50 weather stations. The findings suggest significant warming by 2050.",
        output2: "Researchers employed ensemble modeling with 15 GCM configurations to simulate climate scenarios. Data assimilation techniques integrated satellite observations with ground measurements at 6-hour intervals. Statistical downscaling was applied using quantile mapping to achieve 5km spatial resolution.",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 5,
        goal: "Extract only quantitative metrics (numbers, percentages, statistics) from a business report.",
        promptA: "Analyze this quarterly business report and extract the key metrics and performance indicators.",
        promptB: "Extract only quantitative data: numbers, percentages, dollar amounts, growth rates. No qualitative insights, strategy mentions, or explanations. Format: metric name: value.",
        output1: "• Strong revenue growth in Q3\n• Improved customer satisfaction\n• Expanding market presence in Asia\n• Increased operational efficiency\n• Positive outlook for next quarter",
        output2: "• Revenue: $4.2M\n• QoQ growth: 23%\n• Customer churn: 3.1%\n• Gross margin: 67%\n• CAC: $142",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 6,
        goal: "Generate Python function names following PEP 8 conventions (snake_case, descriptive, verb-based).",
        promptA: "Generate 5 function names for a user authentication system in Python.",
        promptB: "Generate 5 Python function names for user authentication following PEP 8: lowercase with underscores (snake_case), start with verb, descriptive. No classes or variables.",
        output1: "• AuthenticateUser\n• ValidateCredentials\n• UserLogin\n• checkPassword\n• CreateSession",
        output2: "• authenticate_user_credentials\n• validate_password_strength\n• generate_session_token\n• verify_email_format\n• hash_user_password",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 7,
        goal: "Identify only security vulnerabilities (not performance or design issues) in a code snippet.",
        promptA: "Review this login function code and identify issues that need to be fixed.",
        promptB: "Identify only security vulnerabilities: injection risks, auth flaws, data exposure, crypto issues. Exclude performance, style, or architecture. List 4 vulnerabilities.",
        output1: "• Function is too long and complex\n• Variable names could be more descriptive\n• Should use async/await pattern\n• Missing error handling\n• No input validation",
        output2: "• SQL injection via unsanitized user input\n• Password stored in plain text\n• No rate limiting on login attempts\n• Session token predictable (timestamp-based)",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 8,
        goal: "Create a JSON schema with exactly 5 required fields for a product catalog entry.",
        promptA: "Create a JSON schema for a product catalog entry with the essential fields needed for an e-commerce store.",
        promptB: "Create a JSON schema for product catalog with exactly 5 required fields. Specify data types. Use JSON Schema format. Count required fields strictly.",
        output1: '{\n  "product_id": "string",\n  "name": "string",\n  "price": "number",\n  "description": "string",\n  "category": "string",\n  "in_stock": "boolean",\n  "image_url": "string"\n}',
        output2: '{\n  "$schema": "http://json-schema.org/draft-07/schema#",\n  "type": "object",\n  "required": ["product_id", "name", "price", "category", "stock_quantity"],\n  "properties": {\n    "product_id": {"type": "string"},\n    "name": {"type": "string"},\n    "price": {"type": "number"},\n    "category": {"type": "string"},\n    "stock_quantity": {"type": "integer"}\n  }\n}',
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 9,
        goal: "Extract only action items (tasks with owners and deadlines) from a meeting transcript.",
        promptA: "Analyze this meeting transcript and summarize the key action items and decisions that were made.",
        promptB: "Extract only action items in format: [Task] - [Owner] - [Deadline]. Skip discussions, decisions, or context. Only concrete tasks assigned to people.",
        output1: "• The team agreed to improve the onboarding process\n• John will look into the database issue\n• Marketing discussed the new campaign\n• Need to schedule a follow-up meeting\n• Review Q4 goals",
        output2: "• Migrate user database to PostgreSQL - John Smith - Jan 15\n• Complete API documentation - Sarah Lee - Jan 12\n• Review security audit report - Mike Chen - Jan 18\n• Update pricing page copy - Marketing Team - Jan 20",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 10,
        goal: "Generate SQL queries using only JOIN operations (no subqueries or CTEs).",
        promptA: "Write SQL queries to retrieve customer orders with product details from our database.",
        promptB: "Write SQL queries using only explicit JOIN syntax (INNER, LEFT, RIGHT). No subqueries, no CTEs, no WHERE IN. Must use ON clause for join conditions.",
        output1: "SELECT c.name, o.order_date, p.product_name\nFROM customers c, orders o, products p\nWHERE c.id = o.customer_id AND o.product_id = p.id\nAND o.status IN (SELECT status FROM valid_statuses);",
        output2: "SELECT c.name, o.order_date, p.product_name\nFROM customers c\nINNER JOIN orders o ON c.id = o.customer_id\nINNER JOIN products p ON o.product_id = p.id\nWHERE o.status = 'completed';",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 11,
        goal: "List only client-side web technologies (no server-side or database technologies).",
        promptA: "List the modern technologies needed to build a full-stack web application in 2024.",
        promptB: "List only client-side/frontend technologies: runs in browser only. Exclude Node.js, databases, servers, APIs. Include frameworks, libraries, tools that execute client-side. 6 items.",
        output1: "• React or Vue.js\n• Node.js with Express\n• PostgreSQL database\n• REST APIs\n• Docker containers\n• AWS cloud hosting",
        output2: "• React with TypeScript\n• Tailwind CSS for styling\n• React Query for state management\n• Vite as build tool\n• Zustand for global state\n• React Router for navigation",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 12,
        goal: "Translate text to French preserving only technical terms in English (untranslated).",
        promptA: "Translate this technical documentation from English to French accurately.",
        promptB: "Translate to French but keep these terms in English: API, database, server, cache, authentication, encryption, endpoint. Everything else in French.",
        output1: "Notre API utilise un serveur sécurisé avec une base de données cryptée pour l'authentification des utilisateurs via des points de terminaison REST.",
        output2: "Notre API utilise un server sécurisé avec une database cryptée pour authentication des utilisateurs via des endpoint REST.",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 13,
        goal: "Generate test cases covering only edge cases (not happy path scenarios).",
        promptA: "Write test cases for a password validation function that checks length and complexity requirements.",
        promptB: "Generate only edge case tests: boundary values, invalid inputs, null/empty, special characters, extreme lengths. Exclude normal valid passwords. 5 test cases.",
        output1: "• Test valid password with letters and numbers\n• Test password with minimum 8 characters\n• Test password with uppercase and lowercase\n• Test password with special character\n• Test strong password acceptance",
        output2: "• Test empty string input\n• Test password with exactly 7 characters (one below minimum)\n• Test password with 1000 characters (extreme length)\n• Test null/undefined input\n• Test password with only whitespace characters",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 14,
        goal: "Extract only competitive advantages (not features or benefits) from a product description.",
        promptA: "Analyze this SaaS product description and identify what makes it stand out in the market.",
        promptB: "Extract only competitive advantages: what competitors cannot easily copy. Exclude features anyone can build or generic benefits. Use format: Advantage: Why hard to replicate. 4 items.",
        output1: "• User-friendly interface\n• Fast performance\n• 24/7 customer support\n• Affordable pricing\n• Mobile app available",
        output2: "• Proprietary ML model: Trained on 10M+ industry-specific datasets over 5 years\n• Exclusive partnerships: Integrated with top 3 ERP providers (contractual barriers)\n• Network effects: Value increases with 50K+ connected users\n• Regulatory moat: FDA-cleared algorithm (2-year approval process)",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    },
    {
        id: 15,
        goal: "Create a Git commit message following Conventional Commits format (type(scope): description).",
        promptA: "Write a commit message for code that fixes a bug in the user authentication module.",
        promptB: "Write commit message in Conventional Commits format: type(scope): description. Type must be: feat/fix/docs/style/refactor/test/chore. Lowercase, no period, max 50 chars for description.",
        output1: "Fixed the authentication bug that was preventing users from logging in properly.",
        output2: "fix(auth): resolve token expiration validation error",
        correctPrompt: "B",
        output1FromPrompt: "A",
        output2FromPrompt: "B"
    }
];
