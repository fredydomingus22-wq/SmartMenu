import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Get or Create Organization
  let org = await prisma.organization.findFirst({
    where: { name: 'SmartMenu Demo Org' }
  });

  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: 'SmartMenu Demo Org',
        taxId: '500123456',
        address: 'Rua Principal, 123',
        city: 'Lisboa',
        country: 'Portugal',
        phone: '+351 210 000 000',
        email: 'demo@smartmenu.com',
      },
    });
    console.log('Created Organization:', org.name, org.id);
  } else {
    console.log('Organization already exists:', org.name, org.id);
  }

  // 2. Get or Create Tenant
  let tenant = await prisma.tenant.findUnique({
    where: { slug: 'central' }
  });

  if (!tenant) {
    tenant = await prisma.tenant.create({
      data: {
        organizationId: org.id,
        name: 'Restaurante Central',
        slug: 'central',
        plan: 'PRO',
        description: 'O melhor sabor no centro da cidade.',
        address: 'Praça do Município, 1',
        city: 'Lisboa',
        phone: '+351 910 000 000',
        email: 'central@restaurante.com',
      },
    });
    console.log('Created Tenant:', tenant.name, tenant.id);

    // 3. Create Tenant Branding (only if tenant is new)
    await prisma.tenantBranding.create({
      data: {
        tenantId: tenant.id,
        tenantName: 'Restaurante Central',
        primaryColor: '#e11d48', // Rose 600
        secondaryColor: '#4c1d95', // Violet 900
        borderRadius: '0.75rem',
        fontFamily: 'Outfit',
      },
    });
  } else {
    console.log('Tenant already exists:', tenant.name, tenant.id);
  }

  // 4. Create Categories (only if none exist)
  const existingCategories = await prisma.category.count({ where: { tenantId: tenant.id } });
  const categories = [];
  
  if (existingCategories === 0) {
      const categoriesData = [
        { name: { pt: 'Entradas', en: 'Starters' } },
        { name: { pt: 'Pratos Principais', en: 'Main Courses' } },
        { name: { pt: 'Sobremesas', en: 'Desserts' } },
        { name: { pt: 'Bebidas', en: 'Drinks' } },
      ];

      for (const catData of categoriesData) {
        const cat = await prisma.category.create({
          data: {
            ...catData,
            organizationId: org.id,
            tenantId: tenant.id,
          },
        });
        categories.push(cat);
      }
      console.log('Created', categories.length, 'categories');
  } else {
       console.log('Categories already exist, skipping creation.');
       // Fetch existing for product creation if needed (skipping product creation logic for brevity if they exist)
       const cats = await prisma.category.findMany({ where: { tenantId: tenant.id } });
       categories.push(...cats);
  }

  // 5. Create Products (only if none exist and we have categories)
  const existingProducts = await prisma.product.count({ where: { tenantId: tenant.id } });
  if (existingProducts === 0 && categories.length > 0) {
      const productsData = [
        {
          categoryId: categories[0].id,
          name: { pt: 'Pão de Alho', en: 'Garlic Bread' },
          description: { pt: 'Pão torrado com manteiga de alho e ervas.', en: 'Toasted bread with garlic butter and herbs.' },
          price: 3.50,
          imageUrl: 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?auto=format&fit=crop&w=400',
        },
        {
          categoryId: categories[1].id,
          name: { pt: 'Bacalhau à Brás', en: 'Codfish Brás Style' },
          description: { pt: 'Fios de bacalhau com batata palha, ovo e azeitonas.', en: 'Shredded cod with shoestring potatoes, egg and olives.' },
          price: 14.90,
          imageUrl: 'https://images.unsplash.com/photo-1534939561126-755ecf1e5828?auto=format&fit=crop&w=400',
        },
        {
          categoryId: categories[2].id,
          name: { pt: 'Mousse de Chocolate', en: 'Chocolate Mousse' },
          description: { pt: 'Mousse caseira com chocolate 70%.', en: 'Homemade mousse with 70% chocolate.' },
          price: 4.50,
          imageUrl: 'https://images.unsplash.com/photo-1590089415225-403ed3f96ca0?auto=format&fit=crop&w=400',
        },
        {
          categoryId: categories[3].id,
          name: { pt: 'Vinho Tinto Regional', en: 'Regional Red Wine' },
          description: { pt: 'Garrafa 750ml, Alentejo.', en: '750ml bottle, Alentejo.' },
          price: 12.00,
          imageUrl: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=400',
        },
      ];

      for (const prodData of productsData) {
        await prisma.product.create({
          data: {
            ...prodData,
            organizationId: org.id,
            tenantId: tenant.id,
          },
        });
      }
      console.log('Created', productsData.length, 'products');
  } else {
      console.log('Products already exist or no categories found, skipping.');
  }

  // 6. Create Tables
  const existingTables = await prisma.table.count({ where: { tenantId: tenant.id } });
  if (existingTables === 0) {
      for (let i = 1; i <= 5; i++) {
        await prisma.table.create({
          data: {
            number: i,
            organizationId: org.id,
            tenantId: tenant.id,
          },
        });
      }
      console.log('Created 5 tables');
  } else {
      console.log('Tables already exist, skipping.');
  }

  // 7. Create Users (Profiles only, as auth.users is external) via Upsert to avoid duplicates
  const usersData = [
    { name: 'Manager User', email: 'manager@smartmenu.com', role: 'MANAGER' },
    { name: 'Waiter User', email: 'waiter@smartmenu.com', role: 'WAITER' },
    { name: 'Kitchen User', email: 'kitchen@smartmenu.com', role: 'KITCHEN' },
  ];

  for (const userData of usersData) {
    const existingUser = await prisma.userProfile.findUnique({
        where: { email: userData.email }
    });

    if (!existingUser) {
        // Generate a random UUID for the user ID since we can't create auth.users easily here
        const userId = crypto.randomUUID(); 
        
        await prisma.userProfile.create({
          data: {
            id: userId,
            email: userData.email,
            name: userData.name,
            role: userData.role as any,
            organizationId: org.id,
            tenantId: tenant.id,
          },
        });
        console.log(`Created ${userData.role}:`, userData.email, userId);
    } else {
        console.log(`User ${userData.role} already exists:`, userData.email);
    }
  }

  console.log('Seed completed successfully!');
  console.log('Sample URL: http://localhost:3000/menu/' + tenant.id);
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
