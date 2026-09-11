export interface GithubButtonProps {
  mode: 'login' | 'register';
  onSuccess?: () => void;
  onError?: (error: Error) => void;
  isLoading?: boolean;
  disabled?: boolean;
}
