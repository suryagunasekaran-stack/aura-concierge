import { describe, it, expect } from "vitest";
import {
  findProduct,
  recommendProducts,
  compareProducts,
  listAllProducts,
} from "../src/data/products.js";
import { getProductInfo } from "../src/tools/getProductInfo.js";

describe("product catalog", () => {
  it("finds PureBiome by query", () => {
    const p = findProduct({ query: "purebiome" });
    expect(p?.name).toContain("PureBiome");
  });

  it("recommends acne products for age 25", () => {
    const recs = recommendProducts({ concern: "acne", age: 25 });
    expect(recs.recommendations.length).toBeGreaterThan(0);
    expect(recs.recommendations[0].name).toBeTruthy();
    expect(recs.packageRecommendations.length).toBeGreaterThan(0);
  });

  it("compares two acne facials", () => {
    const result = compareProducts(["crystal-clear", "purebiome-purifying"]);
    expect(result.ok).toBe(true);
    expect(result.comparison).toHaveLength(2);
  });

  it("lists products from auramedical.sg catalogue", () => {
    expect(listAllProducts().length).toBeGreaterThanOrEqual(10);
  });
});

describe("get_product_info tool", () => {
  it("returns recommendation mode for concern + age", async () => {
    const result = await getProductInfo(
      { concern: "acne", age: 25 },
      { customerKey: "+6591234567" }
    );
    expect(result.ok).toBe(true);
    expect(result.mode).toBe("recommend");
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.disclaimer).toBeTruthy();
  });

  it("returns compare mode", async () => {
    const result = await getProductInfo(
      { compareIds: ["crystal-clear", "signature-emerald-peel"] },
      { customerKey: "+6591234567" }
    );
    expect(result.ok).toBe(true);
    expect(result.mode).toBe("compare");
    expect(result.comparison).toHaveLength(2);
  });

  it("returns single product details", async () => {
    const result = await getProductInfo(
      { productId: "crystal-clear" },
      { customerKey: "+6591234567" }
    );
    expect(result.ok).toBe(true);
    expect(result.mode).toBe("product");
    expect(result.product.priceSGD).toBe(330);
    expect(result.product.sourceUrl).toContain("auramedical.sg");
  });
});
