export type UserFormValues = {
    email: string;
    password: string;
    first_name: string;
    last_name: string;
    phone_number: string
}


export type OrderFormValues = {
    restaurant_id: number;
    customer_id: number;
    menu_item_id: number;
    total_amount: number;
    order_type: 'dine_in' | 'takeaway' | 'delivery'
}

export interface User {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    created_at: string;
    user_type: 'user' | 'admin'
}


export interface MenuItem {
    menu_item_id: number;
    name: string;
    description: string;
    category_name: string;
    price: number;
    menuitem_image_url: string;
    is_available: boolean;
    quantity: number;
    prepared_time: number;
}

export interface Category {
    category_id: number;
    name: string;
    restaurant_id: number;
    is_active: boolean;
    description: string;
}

export interface AdminDashboardStats {
    totalOrders: number;
    totalRevenue: number;
    totalCustomers: number;
    totalMenuItems: number;
}

export interface UserStats {
    totalOrders: number;
    favoriteItems: number;
    totalSpent: number;
    loyaltyPoints: number;
}

export interface FavoriteItems {
    id: number;
    name: string;
    price: number;
    image: string;
    orders: number
}

export interface AllOrderData {
    order_id: number;
    customer_id: number;
    menu_item_id: number;
    total_amount: number;
    order_type: 'dine_in' | 'takeaway' | 'delivery'
    status: 'pending' | 'confirmed' | 'preparing' | 'Cancelled' | 'completed';
    restaurant_name: string;
    customer_name: string;
    customer_email: string;
    created_at: string;
}

export interface RecentOrder {
    id: number;
    customer: string;
    amount: number;
    status: 'Delivered' | 'Preparing' | 'Ready' | 'Cancelled';
    time: string;
}