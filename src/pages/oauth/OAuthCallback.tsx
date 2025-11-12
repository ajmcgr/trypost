import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const platform = location.pathname.split('/')[2]; // Extract platform from path

  useEffect(() => {
    const handleCallback = async () => {
      const params = new URLSearchParams(location.search);
      const code = params.get('code');
      const error = params.get('error');

      if (error) {
        console.error('OAuth error:', error);
        navigate('/dashboard');
        return;
      }

      if (!code) {
        console.error('No authorization code received');
        navigate('/dashboard');
        return;
      }

      try {
        // Send code to backend to exchange for token
        const { data, error: invokeError } = await supabase.functions.invoke(`oauth-${platform}`, {
          body: {
            code,
            redirect_uri: `${window.location.origin}/oauth/${platform}/callback`,
          },
        });

        if (invokeError) {
          console.error('Error exchanging code:', invokeError);
          throw invokeError;
        }

        if (data.success) {
          // Redirect back to dashboard with success
          navigate('/dashboard?connected=' + platform);
        } else {
          throw new Error('Failed to connect account');
        }
      } catch (err: any) {
        console.error('Callback error:', err);
        navigate('/dashboard?error=' + encodeURIComponent(err.message));
      }
    };

    handleCallback();
  }, [location, navigate, platform]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
        <p className="text-lg">Connecting your account...</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
