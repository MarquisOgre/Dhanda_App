-- Create trigger for handle_new_user on auth.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update INSERT policy for items to allow users to insert their own items
DROP POLICY IF EXISTS "Admin/Supervisor can insert items" ON public.items;

CREATE POLICY "Users can insert their own items" 
ON public.items 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);