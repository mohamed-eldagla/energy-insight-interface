-- Create chat_messages table
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  message TEXT NOT NULL,
  response TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create appliance_metrics table
CREATE TABLE public.appliance_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  appliance_name TEXT NOT NULL,
  current_power_kw DECIMAL(10, 3),
  total_energy_kwh_day DECIMAL(10, 3),
  status TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appliance_metrics ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_messages
CREATE POLICY "Users can view their own chat messages"
ON public.chat_messages
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own chat messages"
ON public.chat_messages
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policies for appliance_metrics
CREATE POLICY "Users can view their own appliance metrics"
ON public.appliance_metrics
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appliance metrics"
ON public.appliance_metrics
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appliance metrics"
ON public.appliance_metrics
FOR UPDATE
USING (auth.uid() = user_id);