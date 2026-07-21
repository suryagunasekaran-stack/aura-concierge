import {
  findProduct,
  recommendProducts,
  compareProducts,
  listAllProducts,
  listAllPackages,
} from "../data/products.js";

/**
 * Product info, recommendations, and comparisons for AURA treatments & packages.
 *
 * @param {{ productId?: string, query?: string, concern?: string, age?: number, compareIds?: string[], listAll?: boolean }} args
 */
export async function getProductInfo(args = {}, _ctx) {
  try {
    const { productId, query, concern, age, compareIds, listAll } = args;

    // Compare mode
    if (Array.isArray(compareIds) && compareIds.length >= 2) {
      const result = compareProducts(compareIds.slice(0, 4));
      if (!result.ok) return result;
      return { ok: true, mode: "compare", ...result };
    }

    // Recommend mode — concern-based (optionally with age)
    if (concern) {
      const recs = recommendProducts({
        concern,
        age: age != null ? Number(age) : undefined,
      });
      return {
        ok: true,
        mode: "recommend",
        ...recs,
        disclaimer:
          "These are general treatment suggestions based on AURA's catalogue — not a medical diagnosis. A specialist consultation is recommended for personalised advice.",
      };
    }

    // List all
    if (listAll === true) {
      return {
        ok: true,
        mode: "list",
        products: listAllProducts(),
        packages: listAllPackages(),
      };
    }

    // Single product lookup
    const product = findProduct({ productId, query });
    if (!product) {
      return { ok: false, reason: "not_found" };
    }

    if (product.type === "package") {
      return {
        ok: true,
        mode: "package",
        package: product,
      };
    }

    return {
      ok: true,
      mode: "product",
      product: {
        id: product.id,
        name: product.name,
        category: product.category,
        concernArea: product.concernArea,
        treatmentLine: product.treatmentLine,
        performedBy: product.performedBy,
        priceSGD: product.priceSGD,
        trialPriceSGD: product.trialPriceSGD,
        durationMin: product.durationMin,
        description: product.description,
        benefits: product.benefits,
        recommendedFor: product.recommendedFor,
        idealAgeRange: product.idealAgeRange,
        concernsAddressed: product.concernsAddressed,
        treatmentSteps: product.treatmentSteps,
        sourceUrl: product.sourceUrl,
      },
    };
  } catch (err) {
    return { ok: false, error: err.message || String(err) };
  }
}
