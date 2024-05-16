import { createTenantBrand } from '@src/controller/tenantBrand.controller';
import {
  createMarketingPage,
  createTenant,
  createTenantPassword,
  deleteTenant,
  getAllTenants,
  getTenant,
  homeSection,
  loginTenant,
  updateMarketingPage,
} from '@src/controller/tenant.controller';
import { createTenantWarehouse } from '@src/controller/tenantWarehouse.controller';
import authMiddleware from '@src/middleware/auth';
import validate from '@src/middleware/validate';
import { createTenantBrandSchema } from '@src/validation/tenantBrand.validation';
import { idSchema } from '@src/validation/common.validation';
import {
  createTenantPasswordSchema,
  createTenantSchema,
  homeSectionSchema,
  loginTenantSchema,
  marketingPageSchema,
  marketingPageUpdateSchema,
} from '@src/validation/tenant.validation';
import { createTenantWarehouseSchema } from '@src/validation/tenantWarehouse.validation';
import { Router } from 'express';
import {
  createTenantCompanySchema,
  organizationDetailsSchema,
  updateBankingInfoSchema,
  updateBasicInfoSchema,
  verifyGstSchema,
} from '@src/validation/tenantCompany.validation';
import {
  createTenantCompany,
  updateTenantCompany,
} from '@src/controller/tenantCompany.controller';

const tenantRouter: Router = Router();

//*POST ROUTE

/**
 * @swagger
 * /v1/tenant/register:
 *   post:
 *     tags:
 *       - Tenant
 *     summary: Register a new tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - phoneNo
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               phoneNo:
 *                 type: number
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: Password must contain at least 1 symbol, 1 lowercase letter, 1 uppercase letter and 1 number. Minimum length is 8 characters.
 *               role:
 *                 type: string
 *                 format: objectId
 *                 description: Role ID (optional)
 *     responses:
 *       200:
 *         description: Tenant registered successfully
 *       400:
 *         description: Tenant with this email or phone number already exists
 *       404:
 *         description: No tenant found
 *       500:
 *         description: Failed to register tenant
 */

tenantRouter.post(
  '/register',
  validate({ body: createTenantSchema }),
  createTenant,
);

/**
 * @swagger
 * /v1/tenant/set-password:
 *   post:
 *     tags:
 *       - Tenant
 *     summary: Register a new tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - password
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *               password:
 *                 type: string
 *                 description: Password must contain at least 1 symbol, 1 lowercase letter, 1 uppercase letter and 1 number. Minimum length is 8 characters.
 *               userId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password set successfully
 *       400:
 *         description: Tenant with this userId doesn't exists
 *       404:
 *         description: No tenant found
 *       500:
 *         description: Failed to register tenant
 */

tenantRouter.post(
  '/set-password',
  validate({ body: createTenantPasswordSchema }),
  createTenantPassword,
);

/**
 * @swagger
 * /v1/tenant/login:
 *   post:
 *     tags:
 *       - Tenant
 *     summary: Login a tenant
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid email or password
 *       404:
 *         description: Tenant not found
 */
tenantRouter.post('/login', validate({ body: loginTenantSchema }), loginTenant);

//? Company routes

//*POST ROUTE
/**
 * @swagger
 * /v1/tenant/create-company:
 *   post:
 *     tags:
 *       - Tenant
 *     summary: Create a new company
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               aadharNumber:
 *                 type: string
 *               aadharCard:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company created successfully
 *       400:
 *         description: Company with this name is already registered by the owner
 *       500:
 *         description: Failed to create company
 */

tenantRouter.post(
  '/create-company',
  authMiddleware({
    productPermissions: {
      createProduct: true,
      editProduct: true,
      deleteProduct: true,
      productDetailReport: true,
    },
    userPermissions: { salesReports: true },
  }),
  validate({ body: createTenantCompanySchema }),
  createTenantCompany,
);

//*PATCH ROUTE

/**
 * @swagger
 * /v1/tenant/verify-gstin/{id}:
 *   patch:
 *     tags:
 *       - Tenant
 *     summary: Verify and add gstin details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gstin:
 *                 type: string
 *     responses:
 *       200:
 *         description: Gst verified and added successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to update company details
 */

tenantRouter.patch(
  '/verify-gstin/:id',
  authMiddleware({
    productPermissions: {
      createProduct: true,
      editProduct: true,
      deleteProduct: true,
      productDetailReport: true,
    },
    userPermissions: { salesReports: true },
  }),
  validate({ body: verifyGstSchema, params: idSchema }),
  updateTenantCompany,
);

/**
 * @swagger
 * /v1/tenant/company-basic-details/{id}:
 *   patch:
 *     tags:
 *       - Tenant
 *     summary: Update basic company details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               primaryContactName:
 *                 type: string
 *               primaryEmailId:
 *                 type: string
 *                 format: email
 *               primaryContactNumber:
 *                 type: string
 *               businessOwnerName:
 *                 type: string
 *               businessOwnerEmail:
 *                 type: string
 *                 format: email
 *               businessOwnerContact:
 *                 type: string
 *               panNumber:
 *                 type: string
 *               businessModel:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               pincode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Company details updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to update company details
 */

tenantRouter.patch(
  '/company-basic-details/:id',
  authMiddleware({
    productPermissions: {
      createProduct: true,
      editProduct: true,
      deleteProduct: true,
      productDetailReport: true,
    },
    userPermissions: { salesReports: true },
  }),
  validate({ body: updateBasicInfoSchema, params: idSchema }),
  updateTenantCompany,
);

/**
 * @swagger
 * /v1/tenant/company-organization-details/{id}:
 *   patch:
 *     tags:
 *       - Tenant
 *     summary: Update organization details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               registeredCompanyName:
 *                 type: string
 *               gstin:
 *                 type: string
 *               panNumber:
 *                 type: string
 *               registeredCompanyAddress:
 *                 type: string
 *               city:
 *                 type: string
 *               pincode:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               gstCertificate:
 *                 type: string
 *               organizationEmail:
 *                 type: string
 *                 format: email
 *               organizationContact:
 *                 type: string
 *     responses:
 *       200:
 *         description: Organization details updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to update organization details
 */

tenantRouter.patch(
  '/company-organization-details/:id',
  authMiddleware({
    productPermissions: {
      createProduct: true,
      editProduct: true,
      deleteProduct: true,
      productDetailReport: true,
    },
    userPermissions: { salesReports: true },
  }),
  validate({ body: organizationDetailsSchema, params: idSchema }),
  updateTenantCompany,
);
/**
 * @swagger
 * /v1/tenant/company-banking-details/{id}:
 *   patch:
 *     tags:
 *       - Tenant
 *     summary: Update banking details
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The id of the company
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountHolderName:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               ifscCode:
 *                 type: string
 *               bankName:
 *                 type: string
 *               accountType:
 *                 type: string
 *               cheque:
 *                 type: string
 *     responses:
 *       200:
 *         description: Banking details updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to update banking details
 */

tenantRouter.patch(
  '/company-banking-details/:id',
  authMiddleware({
    productPermissions: {
      createProduct: true,
      editProduct: true,
      deleteProduct: true,
      productDetailReport: true,
    },
    userPermissions: { salesReports: true },
  }),
  validate({ body: updateBankingInfoSchema, params: idSchema }),
  updateTenantCompany,
);

//*POST ROUTE

/**
 * @swagger
 * /v1/tenant/warehouse/create:
 *   post:
 *     tags:
 *       - Tenant
 *     summary: Create a new warehouse
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - companyId
 *               - gstinDetails
 *               - warehouseAddress
 *               - warehouseEmail
 *               - warehouseContact
 *               - perDayOrderCapacity
 *             properties:
 *               companyId:
 *                 type: string
 *               warehousePinCode:
 *                 type: string
 *               gstinDetails:
 *                 type: string
 *               warehouseAddress:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               warehouseEmail:
 *                 type: string
 *                 format: email
 *               warehouseContact:
 *                 type: string
 *               operationStartTime:
 *                 type: string
 *               operationEndTime:
 *                 type: string
 *               perDayOrderCapacity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Warehouse created successfully
 *       400:
 *         description: Warehouse with this name already exists for this tenant
 *       500:
 *         description: Failed to create warehouse
 */

tenantRouter.post(
  '/warehouse/create',
  authMiddleware({
    productPermissions: {
      createProduct: true,
      editProduct: true,
      deleteProduct: true,
      productDetailReport: true,
    },
    userPermissions: { salesReports: true },
  }),
  validate({ body: createTenantWarehouseSchema }),
  createTenantWarehouse,
);

//? Brand routes

/**
 * @swagger
 * /v1/tenant/brand/create:
 *   post:
 *     tags:
 *       - Tenant
 *     summary: Create a new brand
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - brandName
 *               - manufactureName
 *               - manufactureAddress
 *               - manufactureContact
 *               - rootCategoryClassification
 *               - mainCategoryClassification
 *               - companyId
 *             properties:
 *               brandName:
 *                 type: string
 *               yearsOfOperation:
 *                 type: number
 *               catalogueDetails:
 *                 type: string
 *               brandLogo:
 *                 type: string
 *               tradeMark:
 *                 type: string
 *               manufactureName:
 *                 type: string
 *               manufactureAddress:
 *                 type: string
 *               manufactureContact:
 *                 type: string
 *               packerAddressAndContact:
 *                 type: string
 *               earthFriendly:
 *                 type: string
 *               rootCategoryClassification:
 *                 type: array
 *                 items:
 *                   type: string
 *               mainCategoryClassification:
 *                 type: array
 *                 items:
 *                   type: string
 *               companyId:
 *                 type: string
 *               isDisabled:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Brand created successfully
 *       400:
 *         description: Brand with this name already exists for this tenant
 *       500:
 *         description: Failed to create brand
 */

tenantRouter.post(
  '/brand/create',
  authMiddleware({
    productPermissions: {
      createProduct: true,
      editProduct: true,
      deleteProduct: true,
      productDetailReport: true,
    },
    userPermissions: { salesReports: true },
  }),
  validate({ body: createTenantBrandSchema }),
  createTenantBrand,
);

tenantRouter.post(
  '/home-section/:id',
  authMiddleware(),
  validate({ body: homeSectionSchema, params: idSchema }),
  homeSection,
);

tenantRouter.post(
  '/marketing-page/:id',
  authMiddleware(),
  validate({ body: marketingPageSchema, params: idSchema }),
  createMarketingPage,
);

//*GET ROUTE
tenantRouter.get(
  '/',
  authMiddleware({
    productPermissions: {
      createProduct: true,
      editProduct: true,
      deleteProduct: true,
      productDetailReport: true,
    },
    userPermissions: { salesReports: true },
  }),
  getAllTenants,
);

tenantRouter.get('/:id', authMiddleware(), getTenant);

tenantRouter.patch(
  '/home-section/:id',
  validate({ body: homeSectionSchema, params: idSchema }),
  homeSection,
);

tenantRouter.patch(
  '/marketing-page/:id',
  validate({ body: marketingPageUpdateSchema, params: idSchema }),
  updateMarketingPage,
);

//*DELETE ROUTE
tenantRouter.delete(
  '/:id',
  authMiddleware(),
  validate({ params: idSchema }),
  deleteTenant,
);

// tenantRouter.delete(
//   '/marketing-page/:id',
//   validate({ body: marketingPageIdSchema, params: idSchema }),
//   deleteMarketingPage,
// );

//? Warehouse routes

export default tenantRouter;
