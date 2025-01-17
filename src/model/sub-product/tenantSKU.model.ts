import { Schema, model, Document, PopulatedDoc } from 'mongoose';
import { IVariant, VariantSchema } from './variant.model';
import { ITenantProduct } from '../tenantProduct.model';

export interface TenantSkuRetailPricing {
  barcode: string;
  mrp: number;
  sellingPrice: number;
  cost: number;
  tax: number;
  quantity: number;
  specialPriceFrom: string;
  specialPriceTo: string;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  preBookingAvailableOn: string;
  restockAvailableOn: string;
}

const TenantSkuRetailPricingSchema = new Schema<TenantSkuRetailPricing>({
  barcode: {
    type: String,
  },
  mrp: {
    type: Number,
  },
  sellingPrice: {
    type: Number,
  },
  cost: {
    type: Number,
  },
  tax: {
    type: Number,
  },
  quantity: {
    type: Number,
  },
  specialPriceFrom: {
    type: String,
  },
  specialPriceTo: {
    type: String,
  },
  minimumOrderQuantity: {
    type: Number,
  },
  maximumOrderQuantity: {
    type: Number,
  },
  preBookingAvailableOn: {
    type: String,
  },
  restockAvailableOn: {
    type: String,
  },
});

// 4. B2B Pricing
export interface TenantSkuB2BPricing {
  mrp: number;
  wholesalePrice: number;
  specialPriceFrom: string;
  specialPriceTo: string;
  minimumOrderQuantity: number;
  maximumOrderQuantity: number;
  preBookingAvailableOn: string;
  restockAvailableOn: string;
}

const TenantSkuB2BPricingSchema = new Schema<TenantSkuB2BPricing>({
  mrp: {
    type: Number,
  },
  wholesalePrice: {
    type: Number,
  },
  specialPriceFrom: {
    type: String,
  },
  specialPriceTo: {
    type: String,
  },
  minimumOrderQuantity: {
    type: Number,
  },
  maximumOrderQuantity: {
    type: Number,
  },
  preBookingAvailableOn: {
    type: String,
  },
  restockAvailableOn: {
    type: String,
  },
});

interface Images {
  imageURLs: string[];
  thumbnailImage: string;
}

const ImagesSchema = new Schema<Images>({
  imageURLs: {
    type: [String],
  },
  thumbnailImage: {
    type: String,
  },
});
interface VisibilityOptions {
  isEditorsChoice: boolean;
  isTrendingNow: boolean;
  isNewArrival: boolean;
  isProductRecommendation: boolean;
  isBestSeller: boolean;
  isBrandAtSlashedPrice: boolean;
  isMostLoved: boolean;
  isFeatured: boolean;
  isOnOurRadar: boolean;
  isTopPick: boolean;
  isDealOfTheDay: boolean;
  isSpecialOffer: boolean;
  isBudgetPicks: boolean;
  isYourWardrobeMustHave: boolean;
  isPrivateGroup: boolean;
  isPriceVisible: boolean;
}

export interface Visibility {
  guestCheckout: VisibilityOptions;
  privateGroup: VisibilityOptions;
}

const VisibilityOptionsSchema = new Schema<VisibilityOptions>({
  isEditorsChoice: {
    type: Boolean,
  },
  isTrendingNow: {
    type: Boolean,
  },
  isNewArrival: {
    type: Boolean,
  },
  isProductRecommendation: {
    type: Boolean,
  },
  isBestSeller: {
    type: Boolean,
  },
  isBrandAtSlashedPrice: {
    type: Boolean,
  },
  isMostLoved: {
    type: Boolean,
  },
  isFeatured: {
    type: Boolean,
  },
  isOnOurRadar: {
    type: Boolean,
  },
  isTopPick: {
    type: Boolean,
  },
  isDealOfTheDay: {
    type: Boolean,
  },
  isSpecialOffer: {
    type: Boolean,
  },
  isBudgetPicks: {
    type: Boolean,
  },
  isYourWardrobeMustHave: {
    type: Boolean,
  },
});

const VisibilitySchema = new Schema<Visibility>({
  guestCheckout: {
    type: VisibilityOptionsSchema,
  },
  privateGroup: {
    type: VisibilityOptionsSchema,
  },
});

interface ITenantSKU extends Document {
  productId: PopulatedDoc<Schema.Types.ObjectId & ITenantProduct>;
  retailPricing: TenantSkuRetailPricing;
  b2bPricing: TenantSkuB2BPricing;
  images: Images;
  visibility: Visibility;
  variant: IVariant;
}

const tenantSKUSchema = new Schema<ITenantSKU>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'TenantProduct',
      required: true,
    },
    images: { type: ImagesSchema },
    retailPricing: { type: TenantSkuRetailPricingSchema },
    b2bPricing: { type: TenantSkuB2BPricingSchema },
    visibility: {
      type: VisibilitySchema,
    },
    variant: { type: VariantSchema, required: true },
  },
  { timestamps: true, versionKey: false },
);

const TenantSKUModel = model<ITenantSKU>('TenantSKU', tenantSKUSchema);

export { TenantSKUModel, ITenantSKU, tenantSKUSchema };
