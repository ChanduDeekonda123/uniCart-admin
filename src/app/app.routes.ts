import { Routes } from '@angular/router';

import { Login } from './auth/login/login';
import { Register } from './auth/register/register';
import { Resetpwd } from './auth/resetpwd/resetpwd';

// Seller Components
import { Dashboard } from './seller/dashboard/dashboard';
import { SellerLayout } from './seller/layout/seller-layout/seller-layout';
import { AddProduct } from './seller/products/add-product/add-product';
import { CategoryFilter } from './seller/products/category-filter/category-filter';
import { EditProduct } from './seller/products/edit-product/edit-product';
import { ProductList } from './seller/products/product-list/product-list';
import { Profile } from './seller/profile/profile';
import { Analytics } from './seller/analytics/analytics';
import { Inventory } from './seller/inventory/inventory';
import { OrderDetails } from './seller/orders/order-details/order-details';
import { OrderList } from './seller/orders/order-list/order-list';
import { Support } from './seller/support/support';

// Seller Details (New Onboarding Stepper)
import { SellerList } from './seller/seller-details/seller-list/seller-list';
import { CreateSeller } from './seller/seller-details/create-seller/create-seller';


// Admin Components
import { AdminDashboard } from './admin/admin-dashboard/admin-dashboard';
import { AdminLayout } from './admin/admin-layout/admin-layout';
import { Orders } from './admin/orders/orders';
import { Payments } from './admin/payments/payments';
import { Products } from './admin/products/products';
import { VerifySellers } from './admin/verify-sellers/verify-sellers';
import { GeneralDetail } from './seller/seller-details/general-detail/general-detail';
import { BasicDetail } from './seller/seller-details/basic-detail/basic-detail';
import { AddressDetail } from './seller/seller-details/address-detail/address-detail';
import { ContactDetail } from './seller/seller-details/contact-detail/contact-detail';
import { BankDetail } from './seller/seller-details/bank-detail/bank-detail';
import { StatutoryDetail } from './seller/seller-details/statutory-detail/statutory-detail';
import { Confirmation } from './seller/seller-details/confirmation/confirmation';
import { SmartTable } from './smart-table/smart-table';
import { Finance } from './seller/seller-details/finance/finance';
import { Notifications } from './service/notification/notifications';


export const routes: Routes = [

    // =========================
    // AUTH ROUTES
    // =========================
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'resetpwd', component: Resetpwd },
    { path: 'smarttable', component: SmartTable},

    // =========================
    // SELLER ROUTES
    // =========================
    {
        path: 'seller',
        component: SellerLayout,
        children: [

            { path: '', component: Dashboard },

            {
                path: 'products',
                children: [
                    { path: '', component: ProductList },
                    { path: 'list', component: ProductList },
                    { path: 'add', component: AddProduct },
                    { path: 'category', component: CategoryFilter },
                    { path: 'edit/:id', component: EditProduct }
                ]
            },
            { path: 'order-details', component: OrderDetails },
            { path: 'order-list', component: OrderList },
            { path: 'analytics', component: Analytics },
            { path: 'inventory', component: Inventory },
            { path: 'payments', component: Payments },
            { path: 'profile', component: Profile },
            { path: 'support', component: Support },
            { path: 'notifications', component: Notifications },
            // { path:'create-seller', component:CreateSeller},
            {
                path: 'seller-details',
                children: [
                    { path: '', component: SellerList },
                    { path: 'list', component: SellerList },
                    {
                        path: 'create-seller',
                        component: CreateSeller,
                        children: [
                            { path: 'general', component: GeneralDetail },
                            { path: 'basic', component: BasicDetail },
                            { path: 'address', component: AddressDetail },
                            { path: 'contact', component: ContactDetail },
                            { path: 'bank', component: BankDetail },
                            { path: 'finance', component: Finance},
                            { path: 'statutory', component: StatutoryDetail },
                            { path: 'confirmation', component: Confirmation },
                            { path: '', redirectTo: 'general', pathMatch: 'full' }
                        ]
                    }
                ]
            }
        ]
    },

    // =========================
    // ADMIN ROUTES
    // =========================
    {
        path: 'admin',
        component: AdminLayout,
        children: [
            { path: '', component: AdminDashboard },
            { path: 'verify-sellers', component: VerifySellers },
            { path: 'verify-sellers/confirmation', component: Confirmation },
            { path: 'products', component: Products },
            { path: 'payments', component: Payments },
            { path: 'orders', component: Orders }
        ]
    },

    // =========================
    // DEFAULT REDIRECT
    // =========================
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }

];
