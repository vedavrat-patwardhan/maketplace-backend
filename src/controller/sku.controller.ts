import { MarketplaceProductModel } from '@src/model/marketplaceProduct.model';
import {
  B2BPricing,
  RetailPricing,
  SKUModel,
} from '@src/model/sub-product/sku.model';
import { IVariant } from '@src/model/sub-product/variant.model';
import { NotFoundError } from '@src/utils/apiError';
import { SuccessResponse } from '@src/utils/apiResponse';
import catchAsync from '@src/utils/catchAsync';

// Create SKU
export const createSku = catchAsync(async (req, res, next) => {
  const { decoded } = req.body;
  const { productId } = req.params;
  const supplier = decoded.id;
  const product = await MarketplaceProductModel.exists({
    _id: productId,
    'generalDetails.supplier': supplier,
  });

  if (!product) {
    throw next(new NotFoundError('Product not found'));
  }

  const newSKUs = await Promise.allSettled(
    req.body.variants.map(
      async (variant: {
        images: {
          imageURLs: string[];
          thumbnailImage: string;
        };
        retailPricing: RetailPricing;
        b2bPricing: B2BPricing;
        variant: IVariant;
        productIdentifier: {
          barcode: string;
          hsnNo: string;
          manufacturerPartNumber: string;
          binPickingNumber: string;
          globalTradeItemNumber: string;
          searchKeywords: string[];
        };
      }) => {
        const newSku = await SKUModel.create({
          images: variant.images,
          retailPricing: variant.retailPricing,
          b2bPricing: variant.b2bPricing,
          visibility: {
            guestCheckout: {
              isMostLoved: false,
              isFeatured: false,
              isOnOurRadar: false,
              isTopPick: false,
              isDealOfTheDay: false,
              isSpecialOffer: false,
              isBudgetPicks: false,
              isYourWardrobeMustHave: false,
            },
            privateGroup: {
              isMostLoved: false,
              isFeatured: false,
              isOnOurRadar: false,
              isTopPick: false,
              isDealOfTheDay: false,
              isSpecialOffer: false,
              isBudgetPicks: false,
              isYourWardrobeMustHave: false,
            },
          },
          variants: variant.variant,
        });
        return {
          skuId: newSku._id,
          barcode: variant.productIdentifier.barcode,
          hsnNo: variant.productIdentifier.hsnNo,
          manufacturerPartNumber:
            variant.productIdentifier.manufacturerPartNumber,
          binPickingNumber: variant.productIdentifier.binPickingNumber,
          globalTradeItemNumber:
            variant.productIdentifier.globalTradeItemNumber,
          searchKeywords: variant.productIdentifier.searchKeywords,
        };
      },
    ),
  );

  if (!newSKUs) {
    throw next(new NotFoundError('Failed to create SKUs'));
  }

  await MarketplaceProductModel.findByIdAndUpdate(productId, {
    $push: {
      productIdentifiers: {
        $each: newSKUs,
      },
    },
  }).exec();

  return new SuccessResponse('SKUs created', newSKUs).send(res);
});

// Update product visibility
export const updateProductVisibility = catchAsync(async (req, res, next) => {
  const { decoded } = req.body;
  const { productId } = req.params;
  const supplier = decoded.id;
  const product = await MarketplaceProductModel.findOne(
    {
      _id: productId,
      'generalDetails.supplier': supplier,
    },
    { 'productIdentifiers.skuId': 1 },
  ).exec();

  if (!product) {
    throw next(new NotFoundError('Product not found'));
  }
  const updatedSku = await SKUModel.updateMany(
    {
      _id: {
        $in: product.productIdentifiers.map((identifier) => identifier.skuId),
      },
    },
    { $set: { visibility: req.body } },
  ).exec();

  if (!updatedSku) {
    throw next(new NotFoundError('Failed to update product visibility'));
  }

  return new SuccessResponse('Product visibility updated', updatedSku).send(
    res,
  );
});
