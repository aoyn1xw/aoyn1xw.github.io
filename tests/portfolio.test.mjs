import { describe, expect, it } from "vitest";
import { TestDriver } from "testdriverai/vitest/hooks";

describe("ayon1xw portfolio (production)", () => {
  it("shows the hero and navigates to Featured Projects", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: "https://aoyn1xw.github.io" });

    // Hero section renders name + intro
    const heroResult = await testdriver.assert(
      "The hero section shows the name 'Erdi / ayon1xw' and the intro 'Student developer building useful tools, experiments, and open-source projects.'",
    );
    expect(heroResult).toBeTruthy();

    // 'View Projects' CTA scrolls to the projects section
    await testdriver.find("The 'View Projects' primary button in the hero section").click();
    await testdriver.wait(2500);

    // Projects are loaded live from the GitHub API
    const projectsResult = await testdriver.assert(
      "The Featured Projects section is visible with at least one project card loaded from the GitHub API",
    );
    expect(projectsResult).toBeTruthy();
  });

  it("shows the Connect section with social links", async (context) => {
    const testdriver = TestDriver(context);

    await testdriver.provision.chrome({ url: "https://aoyn1xw.github.io" });

    // 'Quick Links' CTA scrolls down to the Connect section
    await testdriver.find("The 'Quick Links' secondary button in the hero section").click();
    await testdriver.wait(2500);

    // Connect section exposes the GitHub, Twitter and 'View All Links' links
    const connectResult = await testdriver.assert(
      "The Connect section is visible with GitHub, Twitter, and 'View All Links' links",
    );
    expect(connectResult).toBeTruthy();
  });
});
