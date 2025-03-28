export class ConstValue {
  public static readonly REQUIRED_FIELDS = ['Order Id', 'Seller Product SKU'];
  public static readonly STATUS_DELETED = 'Deleted';
  public static readonly STATUS_ACTIVE = 'Active';
  public static readonly STATUS_SUCCEED = 'Succeed';
  public static readonly STATUS_FAILED = 'Failed';
  public static readonly SELLER_PAGE_LIMIT = 10;
  public static readonly ORDER_PAGE_LIMIT = 10;
}

export class DefaultProductValue {
  public static readonly STATUS = 'published';
  public static readonly PRICE = 0;
  public static readonly IS_PUBLISHED = 0;
  public static readonly CUSTOMER = 1;
  public static readonly TEAM = 1;
  public static readonly VARIANT_QUANTITY = 0;
  public static readonly VARIANT_SELL_PRICE = 0;
  public static readonly VARIANT_VALUE = 'N/A';
}
