"use client"

import { useState } from 'react';
import { motion } from 'motion/react';
import { TwitterLogo } from '@/components/icons/twitter-logo';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter()
  

  const handleSubmit = (e: React.SubmitEvent) => {
    e.preventDefault();
    if (!email || !password || (isSignUp && !name)) {
      toast.error('Please fill in all fields');
      return;
    }
    console.log({ email, password, name })
    toast.success(isSignUp ? 'Account created!' : 'Welcome back!');
    router.push('/');
  };

  return (
    <div className="px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-100 space-y-8"
      >
        <div className="flex flex-col items-center gap-4">
          <TwitterLogo className="h-10 w-10 text-foreground" />
          <h1 className="text-2xl font-bold text-foreground">
            {isSignUp ? 'Create your account' : 'Sign in to X'}
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <Input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-12 rounded-md border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          )}
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-12 rounded-md border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-12 rounded-md border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
          />

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            className="h-12 w-full rounded-full bg-primary font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            {isSignUp ? 'Create account' : 'Sign in'}
          </motion.button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-primary hover:underline"
          >
            {isSignUp ? 'Sign in' : 'Sign up'}
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default Auth;
