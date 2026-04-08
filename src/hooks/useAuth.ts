import { useInternetIdentity } from "@caffeineai/core-infrastructure";

export function useAuth() {
  const { identity, loginStatus, isInitializing, login, clear } =
    useInternetIdentity();

  // Authenticated when an identity is available
  const isAuthenticated = !!identity;
  const isLoading = isInitializing;

  const principalId = identity?.getPrincipal()?.toText();

  return {
    identity,
    loginStatus,
    isAuthenticated,
    isLoading,
    principalId,
    login,
    logout: clear,
  };
}
