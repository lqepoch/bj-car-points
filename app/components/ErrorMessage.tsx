"use client";

interface ErrorMessageProps {
  message: string | null;
  className?: string;
}

export default function ErrorMessage({ message, className = "" }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`error-message ${className}`} role="alert" aria-live="polite">
      <span className="error-icon">⚠️</span>
      <span className="error-text">{message}</span>
    </div>
  );
}