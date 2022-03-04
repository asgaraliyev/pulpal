class PulPal {
  mode = null; //DEV||PRODUCTION
  paymentURL = null; //""https://pay-dev.pulpal.az/payment""|| ""https://pay.pulpal.az/payment"";
  lng = null; //"en"||"az"||"ru"
  throwError(message) {
    throw new Error(`PulPal error:
        ${message}
    `);
  }
  constructor({
    mode = "DEV",
    defaultLng = "en",
    salt,
    merchantId,
    customMerchantName,
  }) {
    this.salt = salt;
    this.merchantId = merchantId;
    this.customMerchantName = customMerchantName;
    if (!this.salt) this.throwError("salt not found");
    if (!this.merchantId) this.throwError("merchantId not found");
    if (!this.customMerchantName)
      this.throwError("customMerchantName not found");
    this.mode = mode;
    const paymentURLbyMode = {
      DEV: "https://pay-dev.pulpal.az/payment",
      PRODUCTION: "https://pay.pulpal.az/payment",
    };
    this.paymentURL = paymentURLbyMode[this.mode];
    this.lng = defaultLng;
  }
  createSignature2(paymentData) {
    let joined =
      paymentData.name.en +
      paymentData.name.az +
      paymentData.name.ru +
      paymentData.description.en +
      paymentData.description.az +
      paymentData.description.ru +
      paymentData.merchantId +
      paymentData.externalId +
      paymentData.price;

    let milliseconds = new Date().getTime();

    let fromEpoch = Math.floor(milliseconds / 300000);
    joined += fromEpoch + salt;
    const hash = crypto.createHash("sha1").update(joined);
    return hash.digest("hex");
  }
  objectToBase64(obj) {
    return Buffer.from(JSON.stringify(obj)).toString("base64");
  }
  createPaymentURL({
    price,
    externalId,
    repeatable,
    name,
    description,
    lng = this.lng,
  }) {
    if (!price) return this.throwError("price field not found");
    else if (!externalId) return this.throwError("externalId field not found");
    else if (!repeatable) return this.throwError("repeatable field not found");
    else if (!name) return this.throwError("name field not found");
    else if (!description)
      return this.throwError("description field not found");
    else if (typeof name !== "object")
      return this.throwError("name field has to be object");
    else if (typeof description !== "object")
      return this.throwError("description field has to be object");
    let paymentData = {
      merchantId: this.merchantId,
      customMerchantName: this.customMerchantName,
      externalId,
      repeatable,
      name,
      description,
      price,
      signature2: null,
    };
    paymentData.signature2 = this.createSignature2(paymentData);
    paymentData = this.objectToBase64(paymentData);
    return `${this.paymentURL}/?lang=${lng}&paymentdata=${encodeURI(
      paymentData
    )}`;
  }
}
