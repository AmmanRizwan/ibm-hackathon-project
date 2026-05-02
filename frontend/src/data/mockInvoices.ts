// Mock Invoice Data for Testing and Development
// This file contains sample invoice data with various statuses and scenarios

export interface MockInvoice {
    id: string;
    invoice_number: string;
    invoice_date: string;
    customer_name: string;
    customer_email?: string;
    customer_phone?: string;
    total_amount: number;
    payment_status: 'pending' | 'partial' | 'paid' | 'overdue' | 'cancelled';
    status: 'draft' | 'sent' | 'viewed' | 'paid' | 'cancelled';
    notes?: string;
    created_at: string;
    updated_at: string;
    userId: string;
}

// Helper function to generate dates
const getDate = (daysAgo: number): string => {
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);
    return date.toISOString();
};

// Mock user ID
const MOCK_USER_ID = '550e8400-e29b-41d4-a716-446655440000';

export const mockInvoices: MockInvoice[] = [
    // Recent paid invoices
    {
        id: '1a2b3c4d-5e6f-7g8h-9i0j-1k2l3m4n5o6p',
        invoice_number: 'INV-2026-001',
        invoice_date: getDate(5),
        customer_name: 'Acme Corporation',
        customer_email: 'billing@acmecorp.com',
        customer_phone: '+1-555-0101',
        total_amount: 5250.00,
        payment_status: 'paid',
        status: 'paid',
        notes: 'Website development services - Q1 2026',
        created_at: getDate(10),
        updated_at: getDate(5),
        userId: MOCK_USER_ID,
    },
    {
        id: '2b3c4d5e-6f7g-8h9i-0j1k-2l3m4n5o6p7q',
        invoice_number: 'INV-2026-002',
        invoice_date: getDate(3),
        customer_name: 'TechStart Inc.',
        customer_email: 'accounts@techstart.io',
        customer_phone: '+1-555-0102',
        total_amount: 3800.50,
        payment_status: 'paid',
        status: 'paid',
        notes: 'Mobile app UI/UX design',
        created_at: getDate(8),
        updated_at: getDate(3),
        userId: MOCK_USER_ID,
    },

    // Pending invoices
    {
        id: '3c4d5e6f-7g8h-9i0j-1k2l-3m4n5o6p7q8r',
        invoice_number: 'INV-2026-003',
        invoice_date: getDate(2),
        customer_name: 'Global Solutions Ltd',
        customer_email: 'finance@globalsolutions.com',
        customer_phone: '+1-555-0103',
        total_amount: 12500.00,
        payment_status: 'pending',
        status: 'sent',
        notes: 'Enterprise software license - Annual subscription',
        created_at: getDate(7),
        updated_at: getDate(2),
        userId: MOCK_USER_ID,
    },
    {
        id: '4d5e6f7g-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
        invoice_number: 'INV-2026-004',
        invoice_date: getDate(1),
        customer_name: 'Creative Agency Co.',
        customer_email: 'billing@creativeagency.com',
        customer_phone: '+1-555-0104',
        total_amount: 2750.75,
        payment_status: 'pending',
        status: 'viewed',
        notes: 'Logo design and branding package',
        created_at: getDate(5),
        updated_at: getDate(1),
        userId: MOCK_USER_ID,
    },

    // Overdue invoices
    {
        id: '5e6f7g8h-9i0j-1k2l-3m4n-5o6p7q8r9s0t',
        invoice_number: 'INV-2026-005',
        invoice_date: getDate(45),
        customer_name: 'Retail Mart LLC',
        customer_email: 'payments@retailmart.com',
        customer_phone: '+1-555-0105',
        total_amount: 8900.00,
        payment_status: 'overdue',
        status: 'sent',
        notes: 'E-commerce platform development - OVERDUE',
        created_at: getDate(50),
        updated_at: getDate(40),
        userId: MOCK_USER_ID,
    },
    {
        id: '6f7g8h9i-0j1k-2l3m-4n5o-6p7q8r9s0t1u',
        invoice_number: 'INV-2026-006',
        invoice_date: getDate(35),
        customer_name: 'Startup Ventures',
        customer_email: 'admin@startupventures.com',
        customer_phone: '+1-555-0106',
        total_amount: 4200.00,
        payment_status: 'overdue',
        status: 'viewed',
        notes: 'Consulting services - March 2026',
        created_at: getDate(40),
        updated_at: getDate(30),
        userId: MOCK_USER_ID,
    },

    // Partial payment
    {
        id: '7g8h9i0j-1k2l-3m4n-5o6p-7q8r9s0t1u2v',
        invoice_number: 'INV-2026-007',
        invoice_date: getDate(15),
        customer_name: 'Manufacturing Pro',
        customer_email: 'finance@manufacturingpro.com',
        customer_phone: '+1-555-0107',
        total_amount: 15000.00,
        payment_status: 'partial',
        status: 'sent',
        notes: 'Custom ERP system - Phase 1 (50% paid)',
        created_at: getDate(20),
        updated_at: getDate(10),
        userId: MOCK_USER_ID,
    },

    // Draft invoices
    {
        id: '8h9i0j1k-2l3m-4n5o-6p7q-8r9s0t1u2v3w',
        invoice_number: 'INV-2026-008',
        invoice_date: getDate(0),
        customer_name: 'Digital Marketing Hub',
        customer_email: 'contact@digitalmarketinghub.com',
        customer_phone: '+1-555-0108',
        total_amount: 6500.00,
        payment_status: 'pending',
        status: 'draft',
        notes: 'SEO optimization services - Draft',
        created_at: getDate(1),
        updated_at: getDate(0),
        userId: MOCK_USER_ID,
    },
    {
        id: '9i0j1k2l-3m4n-5o6p-7q8r-9s0t1u2v3w4x',
        invoice_number: 'INV-2026-009',
        invoice_date: getDate(0),
        customer_name: 'Healthcare Systems Inc.',
        customer_email: 'billing@healthcaresystems.com',
        customer_phone: '+1-555-0109',
        total_amount: 22000.00,
        payment_status: 'pending',
        status: 'draft',
        notes: 'Patient management system - Pending approval',
        created_at: getDate(2),
        updated_at: getDate(0),
        userId: MOCK_USER_ID,
    },

    // Cancelled invoices
    {
        id: '0j1k2l3m-4n5o-6p7q-8r9s-0t1u2v3w4x5y',
        invoice_number: 'INV-2026-010',
        invoice_date: getDate(20),
        customer_name: 'Budget Stores',
        customer_email: 'accounts@budgetstores.com',
        customer_phone: '+1-555-0110',
        total_amount: 1500.00,
        payment_status: 'cancelled',
        status: 'cancelled',
        notes: 'Project cancelled by client',
        created_at: getDate(25),
        updated_at: getDate(18),
        userId: MOCK_USER_ID,
    },

    // More recent invoices with various amounts
    {
        id: '1k2l3m4n-5o6p-7q8r-9s0t-1u2v3w4x5y6z',
        invoice_number: 'INV-2026-011',
        invoice_date: getDate(7),
        customer_name: 'Fashion Boutique',
        customer_email: 'info@fashionboutique.com',
        customer_phone: '+1-555-0111',
        total_amount: 950.00,
        payment_status: 'paid',
        status: 'paid',
        notes: 'Social media content creation',
        created_at: getDate(12),
        updated_at: getDate(7),
        userId: MOCK_USER_ID,
    },
    {
        id: '2l3m4n5o-6p7q-8r9s-0t1u-2v3w4x5y6z7a',
        invoice_number: 'INV-2026-012',
        invoice_date: getDate(4),
        customer_name: 'Construction Co.',
        customer_email: 'billing@constructionco.com',
        customer_phone: '+1-555-0112',
        total_amount: 18500.00,
        payment_status: 'pending',
        status: 'sent',
        notes: 'Project management software implementation',
        created_at: getDate(9),
        updated_at: getDate(4),
        userId: MOCK_USER_ID,
    },
    {
        id: '3m4n5o6p-7q8r-9s0t-1u2v-3w4x5y6z7a8b',
        invoice_number: 'INV-2026-013',
        invoice_date: getDate(6),
        customer_name: 'Food Delivery Service',
        customer_email: 'payments@fooddelivery.com',
        customer_phone: '+1-555-0113',
        total_amount: 7200.00,
        payment_status: 'paid',
        status: 'paid',
        notes: 'Mobile app development - iOS & Android',
        created_at: getDate(11),
        updated_at: getDate(6),
        userId: MOCK_USER_ID,
    },
    {
        id: '4n5o6p7q-8r9s-0t1u-2v3w-4x5y6z7a8b9c',
        invoice_number: 'INV-2026-014',
        invoice_date: getDate(8),
        customer_name: 'Education Platform',
        customer_email: 'finance@eduplatform.com',
        customer_phone: '+1-555-0114',
        total_amount: 11000.00,
        payment_status: 'pending',
        status: 'viewed',
        notes: 'Learning management system customization',
        created_at: getDate(13),
        updated_at: getDate(8),
        userId: MOCK_USER_ID,
    },
    {
        id: '5o6p7q8r-9s0t-1u2v-3w4x-5y6z7a8b9c0d',
        invoice_number: 'INV-2026-015',
        invoice_date: getDate(12),
        customer_name: 'Travel Agency Plus',
        customer_email: 'accounts@travelagencyplus.com',
        customer_phone: '+1-555-0115',
        total_amount: 5600.00,
        payment_status: 'paid',
        status: 'paid',
        notes: 'Booking system integration',
        created_at: getDate(17),
        updated_at: getDate(12),
        userId: MOCK_USER_ID,
    },
    {
        id: '6p7q8r9s-0t1u-2v3w-4x5y-6z7a8b9c0d1e',
        invoice_number: 'INV-2026-016',
        invoice_date: getDate(25),
        customer_name: 'Real Estate Group',
        customer_email: 'billing@realestategroup.com',
        customer_phone: '+1-555-0116',
        total_amount: 9800.00,
        payment_status: 'overdue',
        status: 'sent',
        notes: 'Property listing website - Payment overdue',
        created_at: getDate(30),
        updated_at: getDate(20),
        userId: MOCK_USER_ID,
    },
    {
        id: '7q8r9s0t-1u2v-3w4x-5y6z-7a8b9c0d1e2f',
        invoice_number: 'INV-2026-017',
        invoice_date: getDate(3),
        customer_name: 'Fitness Center',
        customer_email: 'admin@fitnesscenter.com',
        customer_phone: '+1-555-0117',
        total_amount: 3200.00,
        payment_status: 'pending',
        status: 'sent',
        notes: 'Member management system',
        created_at: getDate(8),
        updated_at: getDate(3),
        userId: MOCK_USER_ID,
    },
    {
        id: '8r9s0t1u-2v3w-4x5y-6z7a-8b9c0d1e2f3g',
        invoice_number: 'INV-2026-018',
        invoice_date: getDate(1),
        customer_name: 'Legal Services LLC',
        customer_email: 'billing@legalservices.com',
        customer_phone: '+1-555-0118',
        total_amount: 14500.00,
        payment_status: 'pending',
        status: 'viewed',
        notes: 'Case management software development',
        created_at: getDate(6),
        updated_at: getDate(1),
        userId: MOCK_USER_ID,
    },
    {
        id: '9s0t1u2v-3w4x-5y6z-7a8b-9c0d1e2f3g4h',
        invoice_number: 'INV-2026-019',
        invoice_date: getDate(10),
        customer_name: 'Automotive Parts Co.',
        customer_email: 'finance@autoparts.com',
        customer_phone: '+1-555-0119',
        total_amount: 6750.00,
        payment_status: 'paid',
        status: 'paid',
        notes: 'Inventory management system',
        created_at: getDate(15),
        updated_at: getDate(10),
        userId: MOCK_USER_ID,
    },
    {
        id: '0t1u2v3w-4x5y-6z7a-8b9c-0d1e2f3g4h5i',
        invoice_number: 'INV-2026-020',
        invoice_date: getDate(0),
        customer_name: 'Pet Care Services',
        customer_email: 'contact@petcareservices.com',
        customer_phone: '+1-555-0120',
        total_amount: 2100.00,
        payment_status: 'pending',
        status: 'draft',
        notes: 'Appointment booking system - In progress',
        created_at: getDate(1),
        updated_at: getDate(0),
        userId: MOCK_USER_ID,
    },
];

// Summary statistics
export const mockInvoiceStats = {
    total: mockInvoices.length,
    paid: mockInvoices.filter(inv => inv.payment_status === 'paid').length,
    pending: mockInvoices.filter(inv => inv.payment_status === 'pending').length,
    overdue: mockInvoices.filter(inv => inv.payment_status === 'overdue').length,
    partial: mockInvoices.filter(inv => inv.payment_status === 'partial').length,
    cancelled: mockInvoices.filter(inv => inv.payment_status === 'cancelled').length,
    totalAmount: mockInvoices.reduce((sum, inv) => sum + inv.total_amount, 0),
    paidAmount: mockInvoices
        .filter(inv => inv.payment_status === 'paid')
        .reduce((sum, inv) => sum + inv.total_amount, 0),
    pendingAmount: mockInvoices
        .filter(inv => inv.payment_status === 'pending')
        .reduce((sum, inv) => sum + inv.total_amount, 0),
    overdueAmount: mockInvoices
        .filter(inv => inv.payment_status === 'overdue')
        .reduce((sum, inv) => sum + inv.total_amount, 0),
};

// Helper function to get paginated invoices
export const getPaginatedInvoices = (page: number = 1, limit: number = 10) => {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = mockInvoices.slice(startIndex, endIndex);
    
    return {
        data: paginatedData,
        pagination: {
            currentPage: page,
            totalPages: Math.ceil(mockInvoices.length / limit),
            totalItems: mockInvoices.length,
            itemsPerPage: limit,
        },
    };
};

// Helper function to get invoice by ID
export const getInvoiceById = (id: string): MockInvoice | undefined => {
    return mockInvoices.find(invoice => invoice.id === id);
};

// Helper function to filter invoices by status
export const getInvoicesByStatus = (status: string) => {
    return mockInvoices.filter(invoice => invoice.status === status);
};

// Helper function to filter invoices by payment status
export const getInvoicesByPaymentStatus = (paymentStatus: string) => {
    return mockInvoices.filter(invoice => invoice.payment_status === paymentStatus);
};

// Made with Bob