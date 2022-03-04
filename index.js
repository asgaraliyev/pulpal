class PulPal {
  mode = null; //DEV||PRODUCTION
  paymentURL = null; //""https://pay-dev.pulpal.az/payment""|| ""https://pay.pulpal.az/payment"";
  lng = null; //"en"||"az"||"ru"
  throwError(message) {
    throw new Error(`PulPal error:
        ${message}
    `);
  }
  constructor({ mode = "DEV", defaultLng = "en", salt ,merchantId,customMerchantName}) {
    this.salt = salt;
    this.merchantId = merchantId;
    this.customMerchantName=customMerchantName
    if (!this.salt) this.throwError("salt not found");
    if (!this.merchantId) this.throwError("merchantId not found");
    if (!this.customMerchantName) this.throwError("customMerchantName not found");
    this.mode = mode;
    const paymentURLbyMode = {
      DEV: "https://pay-dev.pulpal.az/payment",
      PRODUCTION: "https://pay.pulpal.az/payment",
    };
    this.paymentURL = paymentURLbyMode[this.mode];
    this.lng = defaultLng;
  }
}
