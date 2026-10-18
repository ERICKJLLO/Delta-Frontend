import { test, expect } from "@playwright/test";

test.describe("Flujos principales del frontend Delta", () => {
  test("muestra la página de inicio de sesión", async ({ page }) => {
    await page.goto("/login");

    await expect(
      page.getByRole("heading", { name: "Inicio de sesión" })
    ).toBeVisible();

    await expect(page.getByPlaceholder("contacto@empresa.com")).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Ingresar al dashboard" })
    ).toBeVisible();

    await expect(
      page.getByRole("link", { name: "Registra tu empresa" })
    ).toHaveAttribute("href", "/registro");
  });

  test("muestra el formulario de registro empresarial", async ({ page }) => {
    await page.goto("/registro");

    await expect(
      page.getByRole("heading", { name: "Registro empresarial" })
    ).toBeVisible();

    await expect(page.locator('input[name="companyName"]')).toBeVisible();
    await expect(page.locator('input[name="nit"]')).toBeVisible();
    await expect(page.locator('input[name="contactName"]')).toBeVisible();
    await expect(page.locator('input[name="email"]')).toBeVisible();
    await expect(page.locator('input[name="phone"]')).toBeVisible();
    await expect(page.locator('select[name="industry"]')).toBeVisible();

    await expect(
      page.getByRole("button", { name: /Continuar.*Seleccionar plan/ })
    ).toBeVisible();
  });
});
