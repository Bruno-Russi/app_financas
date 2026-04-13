-- Create the transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('receita', 'despesa')),
  category TEXT NOT NULL CHECK (category IN (
    'Alimentação', 'Transporte', 'Moradia', 'Lazer',
    'Saúde', 'Educação', 'Salário', 'Freelance', 'Outros'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own transactions
CREATE POLICY "Users can view own transactions"
  ON transactions FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own transactions
CREATE POLICY "Users can insert own transactions"
  ON transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own transactions
CREATE POLICY "Users can update own transactions"
  ON transactions FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own transactions
CREATE POLICY "Users can delete own transactions"
  ON transactions FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster queries by user and date
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
