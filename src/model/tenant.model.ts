import { Schema, model, Document, PopulatedDoc } from 'mongoose';
import { IRole } from './role.model';
import { ITenantCompany } from './tenantCompany.model';

interface CustomCard {
  cssProperties: Record<string, string>;
}

interface CustomSection {
  cardTemplate: string;
  heading: string;
  cards: CustomCard[];
}

interface HomeSection {
  preset: string;
  headerTemplate: string;
  navTemplate: string;
  sections: CustomSection[];
}

const homeSectionSchema = new Schema<HomeSection>({
  preset: { type: String, required: true },
  headerTemplate: { type: String, required: true },
  navTemplate: { type: String, required: true },
  sections: [
    {
      cardTemplate: { type: String, required: true },
      heading: { type: String, required: true },
      cards: [
        {
          cssProperties: { type: Schema.Types.Mixed },
        },
      ],
    },
  ],
});

interface MarketingPage {
  _id: Schema.Types.ObjectId;
  title: string;
  slug: string;
  html: string;
  status: 'active' | 'inactive';
  seo: {
    title: string;
    keywords: string[];
    description: string;
  };
}

const marketingPageSchema = new Schema<MarketingPage>({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  html: { type: String, required: true },
  status: { type: String, required: true },
  seo: {
    title: { type: String, required: true },
    keywords: [{ type: String }],
    description: { type: String, required: true },
  },
});

interface ITenant extends Document {
  name: string;
  phoneNo: number;
  email: string;
  password: string;
  customHomeSection: HomeSection;
  marketingPages: MarketingPage[];
  role: PopulatedDoc<Schema.Types.ObjectId & IRole>;
  company: PopulatedDoc<Schema.Types.ObjectId & ITenantCompany>;
  isVerified: boolean;
}

const TenantSchema = new Schema<ITenant>({
  name: { type: String, required: true },
  phoneNo: { type: Number, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  customHomeSection: { type: homeSectionSchema },
  marketingPages: [marketingPageSchema],
  role: {
    type: Schema.Types.ObjectId,
    ref: 'Role',
    default: '661b923a035c08718a53f50c',
  },
  company: { type: Schema.Types.ObjectId, ref: 'Company' },
  isVerified: { type: Boolean, default: false },
});

const TenantModel = model<ITenant>('Tenant', TenantSchema);
export { ITenant, TenantModel, TenantSchema };
