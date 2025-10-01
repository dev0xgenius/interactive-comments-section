CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(32),
    password_hash VARCHAR(36),
    image_url TEXT
);

CREATE TABLE IF NOT EXISTS comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users (id),
    content TEXT,
    score INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS replies (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users (id),
    replying_to UUID REFERENCES comments (id),
    content TEXT,
    score INTEGER,
    created_at TIMESTAMPTZ DEFAULT now()
);
