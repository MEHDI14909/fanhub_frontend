import React, { useState } from 'react';
import { Eye, EyeOff, LockKeyhole, Mail, UserRound } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { useFanHub } from '../context/FanHubContext.jsx';
import { api } from '../services/api.js';

export default function AuthForm({ mode }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetUrl, setResetUrl] = useState('');

  const { registerAccount, loginAccount, flash } = useFanHub();
  const navigate = useNavigate();
  const { token } = useParams();

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (mode === 'forgot') {
      setResetUrl('');
    }

    try {
      if (mode === 'forgot') {
        const result = await api.forgotPassword({ email });

        if (result.resetUrl) {
          setResetUrl(result.resetUrl);
          flash('Reset link created. Open the link below.');
        } else {
          flash(result.message);
        }

        return;
      }

      if (mode === 'reset') {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        if (password !== confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (!token) {
          throw new Error('Invalid reset link');
        }

        await api.resetPassword(token, {
          password,
          confirmPassword
        });

        flash('Password updated successfully');
        navigate('/login');
        return;
      }

      if (mode === 'register') {
        if (password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        await registerAccount({ name, email, password });
        flash('Registration successful');
        navigate('/login');
        return;
      }

      const account = await loginAccount({ email, password });

      flash(`Welcome back, ${account.name || 'User'}`);

      if (account.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      flash(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  let title = 'Welcome back';
  let buttonText = 'Log in';

  if (mode === 'register') {
    title = 'Join the fandom';
    buttonText = 'Create account';
  }

  if (mode === 'forgot') {
    title = 'Forgot password?';
    buttonText = 'Send reset link';
  }

  if (mode === 'reset') {
    title = 'Reset password';
    buttonText = 'Reset password';
  }

  return (
    <div className="authwrap">
      <form className="auth" onSubmit={submit}>
        <div className="auth-emblem">
          <span>F+</span>
        </div>

        <div className="eyebrow">FANHUB PLUS / ACCOUNT</div>
        <h1>{title}</h1>

        <p>
          {mode === 'forgot'
            ? 'Enter your email to receive a password reset link.'
            : mode === 'reset'
            ? 'Choose a secure new password.'
            : 'Discover, follow and save everything you love.'}
        </p>

        {mode === 'register' && (
          <label>
            Full name
            <div className="field">
              <UserRound size={18} />
              <input
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </div>
          </label>
        )}

        {mode !== 'reset' && (
          <label>
            Email address
            <div className="field">
              <Mail size={18} />
              <input
                required
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
              />
            </div>
          </label>
        )}

        {mode !== 'forgot' && (
          <label>
            {mode === 'reset' ? 'New password' : 'Password'}
            <div className="field">
              <LockKeyhole size={18} />
              <input
                required
                minLength={6}
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 6 characters"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>
        )}

        {mode === 'reset' && (
          <label>
            Confirm password
            <div className="field">
              <LockKeyhole size={18} />
              <input
                required
                minLength={6}
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Enter password again"
              />
            </div>
          </label>
        )}

        <button className="primary full" disabled={loading}>
          {loading ? 'Please wait...' : buttonText}
        </button>

        {mode === 'forgot' && resetUrl && (
          <div className="reset-link-box">
            <strong>Reset link ready</strong>
            <a href={resetUrl}>Open reset password page</a>
            <small>
              Email service is not configured, so use this local reset link.
            </small>
          </div>
        )}

        <div className="authlinks">
          <Link to="/login">Log in</Link>
          <Link to="/register">Register</Link>
          <Link to="/forgot-password">Forgot password?</Link>
        </div>
      </form>
    </div>
  );
}
