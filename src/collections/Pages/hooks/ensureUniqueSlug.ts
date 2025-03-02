import type { FieldHook } from "payload";

import { ValidationError } from "payload";

import { getUserTenantIDs } from "../../../utilities/getUserTenantIDs";

export const ensureUniqueSlug: FieldHook = async ({
  data,
  originalDoc,
  req,
  value,
}) => {
  // if value is unchanged, skip validation
  if (originalDoc.slug === value) {
    return value;
  }

  const incomingTenantID =
    typeof data?.tenant === "object" ? data.tenant.id : data?.tenant;
  const currentTenantID =
    typeof originalDoc?.tenant === "object"
      ? originalDoc.tenant.id
      : originalDoc?.tenant;
  const tenantIDToMatch = incomingTenantID || currentTenantID;

  console.log('Before find');
  const findDuplicatePages = tenantIDToMatch
    ? await req.payload.find({
        collection: "pages",
        where: {
          and: [
            {
              tenant: {
                equals: tenantIDToMatch,
              },
            },
            {
              slug: {
                equals: value,
              },
            },
          ],
        },
      })
    : undefined;
    console.log('After find');

  if (findDuplicatePages && findDuplicatePages.docs.length > 0 && req.user) {
    const tenantIDs = getUserTenantIDs(req.user);
    // if the user is an admin or has access to more than 1 tenant
    // provide a more specific error message
    if (req.user.roles?.includes("super-admin") || tenantIDs.length > 1) {
      console.log('Before findByID');
      const attemptedTenantChange = await req.payload.findByID({
        id: tenantIDToMatch,
        collection: "tenants",
      });
      console.log('After findByID');

      throw new ValidationError({
        errors: [
          {
            message: `The "${attemptedTenantChange.name}" tenant already has a page with the slug "${value}". Slugs must be unique per tenant.`,
            path: "slug",
          },
        ],
      });
    }

    throw new ValidationError({
      errors: [
        {
          message: `A page with the slug ${value} already exists. Slug must be unique per tenant.`,
          path: "slug",
        },
      ],
    });
  }

  return value;
};
