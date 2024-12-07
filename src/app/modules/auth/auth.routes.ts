import { Routes } from "@angular/router";

export default[

    {
        path: 'login',
        loadComponent: () => import('./login/login.component')
    },
    {
        path: 'register',
        loadComponent: () => import('./register/register.component')
    },
    {
        path: 'logout',
        loadComponent: () => import('./logout/logout.component')
    }

]as Routes