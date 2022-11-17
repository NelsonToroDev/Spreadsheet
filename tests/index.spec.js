// @ts-check
import { test, expect } from '@playwright/test';

test('SpreedSheet can evaluate a math expression using a cel reference', async ({ page }) => {
  await page.goto('http://localhost:4000/');

  const cellA0 = page.getByTestId('span-0-0')
  await cellA0.click()

  const inputA0 = page.getByTestId('input-0-0')
  await inputA0.fill('2')

  const cellB0 = page.getByTestId('span-0-1')
  await cellB0.click()

  const inputB0 = page.getByTestId('input-0-1')
  await inputB0.fill('=A0 * 2')

  await cellA0.click()
  
  const inputA0Again = page.getByTestId('input-0-0')
  await inputA0Again.fill('10')

  const cellC0 = page.getByTestId('span-0-2')
  await cellC0.click()

  const result = await cellB0.innerText()
  expect(result).toBe('20')
});
