import { describe, it, expect } from "vitest";
import { getCustomer, getSessionsSummary } from "../src/data/customers.js";
import { getCustomerInfo } from "../src/tools/getCustomerInfo.js";

describe("customer mock data — sessions", () => {
  it("Mei Ling has 3 sessions remaining on active package", () => {
    const summary = getSessionsSummary("+6591234567");
    expect(summary.sessionsRemaining).toBe(3);
    expect(summary.activePackages).toHaveLength(1);
    expect(summary.activePackages[0].packageName).toBe("Acne Clear Starter Pack");
  });

  it("get_customer_info returns packages and sessionsRemaining", async () => {
    const result = await getCustomerInfo(
      {},
      { customerKey: "+6591234567" }
    );
    expect(result.ok).toBe(true);
    expect(result.customer.sessionsRemaining).toBe(3);
    expect(result.customer.packages).toHaveLength(2);
    expect(result.customer.activePackages[0].sessionsRemaining).toBe(3);
  });

  it("unknown customer returns not_found", async () => {
    const result = await getCustomerInfo(
      {},
      { customerKey: "+6500000000" }
    );
    expect(result.ok).toBe(false);
    expect(result.reason).toBe("not_found");
  });
});
