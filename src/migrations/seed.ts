import type { MigrateUpArgs } from '@payloadcms/db-mongodb'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
  await payload.create({
    collection: "users",
    data: {
      email: "demo@payloadcms.com",
      password: "demo",
      roles: ["super-admin"],
    },
  });

  /** Tentants */

  const tenant1 = await payload.create({
    collection: "tenants",
    data: {
      name: "Prefeitura de Palmas",
      slug: "gold",
      domain: "gold.local",
    },
  });

  const tenant2 = await payload.create({
    collection: "tenants",
    data: {
      name: "Tenant 2",
      slug: "silver",
      domain: "silver.local",
    },
  });

  const tenant3 = await payload.create({
    collection: "tenants",
    data: {
      name: "Tenant 3",
      slug: "bronze",
      domain: "bronze.local",
    },
  });

  /** Users */

  await payload.create({
    collection: "users",
    data: {
      email: "tenant1@payloadcms.com",
      password: "test",
      tenants: [
        {
          roles: ["tenant-admin"],
          tenant: tenant1,
        },
      ],
      username: "tenant1",
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "tenant2@payloadcms.com",
      password: "test",
      tenants: [
        {
          roles: ["tenant-admin"],
          tenant: tenant2,
        },
      ],
      username: "tenant2",
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "tenant3@payloadcms.com",
      password: "test",
      tenants: [
        {
          roles: ["tenant-admin"],
          tenant: tenant3,
        },
      ],
      username: "tenant3",
    },
  });

  await payload.create({
    collection: "users",
    data: {
      email: "multi-admin@payloadcms.com",
      password: "test",
      tenants: [
        {
          roles: ["tenant-admin"],
          tenant: tenant1,
        },
        {
          roles: ["tenant-admin"],
          tenant: tenant2,
        },
        {
          roles: ["tenant-admin"],
          tenant: tenant3,
        },
      ],
      username: "tenant3",
    },
  });

  /** Pages */

  await payload.create({
    collection: "pages",
    data: {
      slug: "home1",
      tenant: tenant1,
      title: "Página Extra 1",
    },
  });

  await payload.create({
    collection: "pages",
    data: {
      slug: "home2",
      tenant: tenant2,
      title: "Page for Tenant 2",
    },
  });

  await payload.create({
    collection: "pages",
    data: {
      slug: "home3",
      tenant: tenant3,
      title: "Page for Tenant 3",
    },
  });
}
