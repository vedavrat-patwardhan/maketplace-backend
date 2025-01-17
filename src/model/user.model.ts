import { Schema, model, Document, PopulatedDoc } from 'mongoose';
import { IRole } from './role.model';
import { ITenantProduct } from './tenantProduct.model';
import { ICoupons } from './coupon.model';
import { ITenant } from './tenant.model';

interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  shippingAddresses: Array<{
    streetAddress: string;
    landMark?: string;
    pinCode: string;
    city: string;
    state: string;
    country: string;
    addressType: 'Home' | 'Word';
  }>;
  phoneNo: string;
  billingAddress?: string;
  paymentMethods: Array<{
    cardholderName: string;
    cardNumber: string;
    cardExpiryDate: string;
    cardCVV: string;
  }>;
  wishlistProducts: PopulatedDoc<Schema.Types.ObjectId & ITenantProduct>[]; // Array of product IDs
  cart: Array<{
    productId: PopulatedDoc<Schema.Types.ObjectId & ITenantProduct>; // Product ID
    quantity: number;
  }>;
  role?: PopulatedDoc<Schema.Types.ObjectId & IRole>;
  usedCoupons: PopulatedDoc<Schema.Types.ObjectId & ICoupons>[];
  tenantId:PopulatedDoc<Schema.Types.ObjectId & ITenant>;
  domain: string;
}

// Define the User schema
const userSchema = new Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phoneNo: { type: String, required: true },
  password: { type: String, required: true },
  shippingAddresses: [
    {
      streetAddress: { type: String },
      landMark: { type: String },
      pinCode: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      addressType: { type: String, enum: ['Home', 'Work'] },
    },
  ],
  billingAddress: { type: String },
  paymentMethods: [
    {
      cardholderName: { type: String },
      cardNumber: { type: String },
      cardExpiryDate: { type: String },
      cardCVV: { type: String },
    },
  ],
  wishlistProducts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'TenantProduct',
    },
  ],
  cart: [
    {
      productId: {
        type: Schema.Types.ObjectId,
        ref: 'TenantProduct',
      },
      quantity: { type: Number, default: 1 },
    },
  ],
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    default: '661b9cf0b68b1b70fd594ed6',
  },
  usedCoupons: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Coupon',
    },
  ],
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
  },
});

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

const UserModel = model<IUser>('User', userSchema);

export { UserModel, IUser };
