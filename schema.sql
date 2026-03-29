-- Fitness Plans (Recurring)
CREATE TABLE plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'weekly' or 'monthly'
  frequency_data TEXT, -- JSON string for days of week/month
  reminder_time TEXT, -- e.g. '08:00'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- One-off Activities
CREATE TABLE activities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  scheduled_at DATETIME NOT NULL,
  reminder_time TEXT,
  status TEXT DEFAULT 'pending', -- 'pending', 'completed', 'cancelled'
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Daily To-dos
CREATE TABLE todos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  due_date DATE,
  reminder_time TEXT,
  status TEXT DEFAULT 'pending',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Completion Log (for analysis)
CREATE TABLE completions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  item_type TEXT NOT NULL, -- 'plan', 'activity', 'todo'
  item_id INTEGER NOT NULL,
  completed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  notes TEXT
);

-- Settings
CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
