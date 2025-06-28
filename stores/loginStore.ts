import { defineStore } from "pinia";
import type { User } from "~/types/user";
// const { status, data, signOut, signIn } = useAuth()
export const useLoginStore = defineStore('auth', {
    state: () => ({
        isLoading: false as boolean,
        error: null as Record<string, string> | any | null,
        form: ref<Partial<User>>({
            email: '',
            password: '',
        }),
    }),
    getters: {

    },
    actions: {
        async login(data: Partial<User>): Promise<void> {
            this.isLoading = true;
            try {
                const result = requestValidation('/api/login', {
                    method: "POST",
                    platform: "app",
                    body: data,
                });
                console.log(result);
            } catch (error: any) {
                this.error = error.data.message || error.message
            } finally {
                this.isLoading = false;
            }
        },
        async loginForm(): Promise<void> {
            try {
                const { signIn } = useAuth()
                const result = await signIn('credentials', {
                    redirect: false,
                    email: this.form.email,
                    password: this.form.password
                })
                if(result?.error == null) {
                    navigateTo('/');
                }else{
                    const error = JSON.parse(result.error)
                    this.error = error
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
});