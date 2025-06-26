import { defineStore } from 'pinia';
import type { User } from '~/types/user';
export const useRegisterStore = defineStore('register', {
    state: () => ({
        isLoading: false as boolean,
        error: null as Record<string, string> | any | null,
        form: ref<Partial<User>>({
            name: '',
            email: '',
            password: '',
        }),
    }),
    actions: {
        async register(): Promise<void> {
            try {
                await requestValidation('/api/register', {
                    method: "POST",
                    platform: "browser",
                    body: this.form,
                })
            } catch ( error: any ) {
                this.error = error.data.message || error.message;
            } finally {
                this.isLoading = true;
            }
        }
    }
});