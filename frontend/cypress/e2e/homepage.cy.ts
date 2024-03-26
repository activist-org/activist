describe("Homepage", () => {
  beforeEach(() => {
    cy.visit("/");
    cy.injectAxe();
  });

  it("has no detectable accessibility violations on load", () => {
    cy.checkA11y();
  });
});
