// Supabase Configuration for Vercel
// Using window-level environment variables that will be set by Vercel
// Supabase Configuration - Universal version
(function() {
    // Get environment variables from multiple possible sources
    const getEnvVar = (name) => {
        // Try Vercel environment variables
        if (typeof process !== 'undefined' && process.env) {
            return process.env[name];
        }
        // Try global ENV object
        if (typeof window !== 'undefined' && window.ENV && window.ENV[name]) {
            return window.ENV[name];
        }
        // Try data attributes
        if (typeof document !== 'undefined') {
            const script = document.currentScript || document.querySelector('script[data-supabase-config]');
            if (script) {
                return script.getAttribute('data-' + name.toLowerCase());
            }
        }
        return null;
    };

    const supabaseUrl = getEnvVar('SUPABASE_URL');
    const supabaseAnonKey = getEnvVar('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase environment variables are not properly configured');
        console.log('URL:', supabaseUrl);
        console.log('Key:', supabaseAnonKey ? '***' + supabaseAnonKey.slice(-4) : 'undefined');
        return;
    }

    // Initialize Supabase client
    const supabaseClient = supabase.createClient(supabaseUrl, supabaseAnonKey);

    // Database operations
    class FinanceControlDB {
        // Client operations
        static async getClients() {
            try {
                const { data, error } = await supabaseClient
                    .from('clients')
                    .select('*')
                    .order('name');

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Erro ao buscar clientes:', error);
                return [];
            }
        }

        static async createClient(clientData) {
            try {
                const { data, error } = await supabaseClient
                    .from('clients')
                    .insert([{
                        name: clientData.name,
                        email: clientData.email,
                        phone: clientData.phone,
                        cpf: clientData.cpf,
                        city: clientData.city,
                        address: clientData.address,
                        status: clientData.status || 'active'
                    }])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Erro ao criar cliente:', error);
                throw error;
            }
        }

        // Supplier operations
        static async getSuppliers() {
            try {
                const { data, error } = await supabaseClient
                    .from('suppliers')
                    .select('*')
                    .order('name');

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Erro ao buscar fornecedores:', error);
                return [];
            }
        }

        static async createSupplier(supplierData) {
            try {
                const { data, error } = await supabaseClient
                    .from('suppliers')
                    .insert([{
                        name: supplierData.name,
                        email: supplierData.email,
                        phone: supplierData.phone,
                        cnpj: supplierData.cnpj,
                        city: supplierData.city,
                        category: supplierData.category,
                        address: supplierData.address,
                        status: supplierData.status || 'active'
                    }])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Erro ao criar fornecedor:', error);
                throw error;
            }
        }

        // Product operations
        static async getProducts() {
            try {
                const { data, error } = await supabaseClient
                    .from('products')
                    .select('*')
                    .order('name');

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
                return [];
            }
        }

        static async createProduct(productData) {
            try {
                const { data, error } = await supabaseClient
                    .from('products')
                    .insert([{
                        name: productData.name,
                        code: productData.code,
                        category: productData.category,
                        price: parseFloat(productData.price),
                        cost_price: productData.cost_price ? parseFloat(productData.cost_price) : null,
                        stock_quantity: parseInt(productData.stock_quantity) || 0,
                        min_stock: parseInt(productData.min_stock) || 0,
                        description: productData.description,
                        status: 'active'
                    }])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Erro ao criar produto:', error);
                throw error;
            }
        }

        // Employee operations
        static async getEmployees() {
            try {
                const { data, error } = await supabaseClient
                    .from('employees')
                    .select('*')
                    .order('name');

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Erro ao buscar funcionários:', error);
                return [];
            }
        }

        static async createEmployee(employeeData) {
            try {
                const { data, error } = await supabaseClient
                    .from('employees')
                    .insert([{
                        name: employeeData.name,
                        email: employeeData.email,
                        phone: employeeData.phone,
                        position: employeeData.position,
                        department: employeeData.department,
                        salary: employeeData.salary ? parseFloat(employeeData.salary) : null,
                        hire_date: employeeData.hire_date,
                        status: employeeData.status || 'active'
                    }])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Erro ao criar funcionário:', error);
                throw error;
            }
        }

        // Expense operations
        static async getExpenses() {
            try {
                const { data, error } = await supabaseClient
                    .from('expenses')
                    .select('*')
                    .order('date', { ascending: false });

                if (error) throw error;
                return data || [];
            } catch (error) {
                console.error('Erro ao buscar gastos:', error);
                return [];
            }
        }

        static async createExpense(expenseData) {
            try {
                const { data, error } = await supabaseClient
                    .from('expenses')
                    .insert([{
                        description: expenseData.description,
                        type: expenseData.type,
                        category: expenseData.category,
                        amount: parseFloat(expenseData.amount),
                        date: expenseData.date,
                        notes: expenseData.notes
                    }])
                    .select()
                    .single();

                if (error) throw error;
                return data;
            } catch (error) {
                console.error('Erro ao criar gasto:', error);
                throw error;
            }
        }
    }

    // Test connection
    async function testConnection() {
        try {
            // Check if environment variables are set
            if (!supabaseUrl || !supabaseAnonKey) {
                console.error('Variáveis de ambiente do Supabase não configuradas');
                return;
            }

            const { data, error } = await supabaseClient.from('clients').select('count');
            if (error) throw error;
            console.log('Conexão com Supabase estabelecida com sucesso!');
        } catch (error) {
            console.error('Erro na conexão com Supabase:', error);
        }
    }

    // Initialize connection test
    testConnection();

    window.FinanceControlDB = FinanceControlDB;
    window.supabaseClient = supabaseClient;
})();