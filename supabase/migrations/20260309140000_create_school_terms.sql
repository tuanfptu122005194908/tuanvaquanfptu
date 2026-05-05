-- Create school_terms table for managing academic terms and revenue tracking
CREATE TABLE public.school_terms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL, -- e.g., "Học kỳ 1 2024-2025", "Học kỳ 2 2024-2025"
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NULL, -- NULL means current/ongoing term
  is_active BOOLEAN DEFAULT true, -- Indicates if this is the current term
  total_revenue BIGINT DEFAULT 0, -- Total revenue for this term in VND
  total_orders INTEGER DEFAULT 0, -- Total orders for this term
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_school_terms_is_active ON public.school_terms(is_active);
CREATE INDEX idx_school_terms_dates ON public.school_terms(start_date, end_date);

-- Add RLS policies
ALTER TABLE public.school_terms ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can manage school terms
CREATE POLICY "Admins can manage school terms" ON public.school_terms
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.user_roles 
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Trigger to update updated_at column
CREATE TRIGGER update_school_terms_updated_at 
  BEFORE UPDATE ON public.school_terms 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to get current active term
CREATE OR REPLACE FUNCTION public.get_current_term()
RETURNS TABLE (
  id UUID,
  name TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN,
  total_revenue BIGINT,
  total_orders INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    st.id,
    st.name,
    st.start_date,
    st.end_date,
    st.is_active,
    st.total_revenue,
    st.total_orders
  FROM public.school_terms st
  WHERE st.is_active = true
  ORDER BY st.start_date DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create a new term and archive the previous one
CREATE OR REPLACE FUNCTION public.create_new_term(
  term_name TEXT,
  term_start_date TIMESTAMP WITH TIME ZONE
)
RETURNS UUID AS $$
DECLARE
  new_term_id UUID;
  previous_term_id UUID;
BEGIN
  -- Archive previous active terms
  UPDATE public.school_terms 
  SET is_active = false, end_date = now()
  WHERE is_active = true;
  
  -- Create new term
  INSERT INTO public.school_terms (name, start_date, is_active)
  VALUES (term_name, term_start_date, true)
  RETURNING id INTO new_term_id;
  
  RETURN new_term_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update term revenue when order is completed
CREATE OR REPLACE FUNCTION public.update_term_revenue()
RETURNS TRIGGER AS $$
DECLARE
  current_term_id UUID;
BEGIN
  -- Only update for completed orders
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    -- Get current active term
    SELECT id INTO current_term_id 
    FROM public.school_terms 
    WHERE is_active = true 
    ORDER BY start_date DESC 
    LIMIT 1;
    
    -- Update term revenue and order count
    IF current_term_id IS NOT NULL THEN
      UPDATE public.school_terms 
      SET 
        total_revenue = total_revenue + NEW.total,
        total_orders = total_orders + 1
      WHERE id = current_term_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update term revenue
CREATE TRIGGER update_term_revenue_on_order_complete
  AFTER UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_term_revenue();
