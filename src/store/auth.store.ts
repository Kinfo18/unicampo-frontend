import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types/user.types';

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, token: string) => void;
    clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            setAuth: (user, token) => {
                localStorage.setItem('unicampo_token', token);
                set({ user, token, isAuthenticated: true });
            },

            clearAuth: () => {
                localStorage.removeItem('unicampo_token');
                localStorage.removeItem('unicampo_user');
                set({ user: null, token: null, isAuthenticated: false });
            },
        }),
        {
            name: 'unicampo_auth',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated,
            }),
        },
    ),
);
