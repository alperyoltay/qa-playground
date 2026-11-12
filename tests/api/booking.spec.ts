import { expect, test, type APIRequestContext } from "@playwright/test";

/**
 * Restful Booker is a public practice API. Its admin credentials are
 * published in its docs (https://restful-booker.herokuapp.com/apidoc).
 */
const ADMIN = { username: "admin", password: "password123" };

const booking = {
  firstname: "Alper",
  lastname: "Tester",
  totalprice: 120,
  depositpaid: true,
  bookingdates: { checkin: "2026-12-01", checkout: "2026-12-05" },
  additionalneeds: "Breakfast",
};

async function token(request: APIRequestContext) {
  const res = await request.post("/auth", { data: ADMIN });
  expect(res.ok()).toBeTruthy();
  return (await res.json()).token as string;
}

test.describe.serial("Booking API: full lifecycle", () => {
  let id: number;

  test("health check", async ({ request }) => {
    expect((await request.get("/ping")).status()).toBe(201);
  });

  test("create a booking", async ({ request }) => {
    const res = await request.post("/booking", { data: booking, headers: { Accept: "application/json" } });
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(body.booking).toEqual(booking);
    id = body.bookingid;
  });

  test("read it back", async ({ request }) => {
    const res = await request.get(`/booking/${id}`, { headers: { Accept: "application/json" } });
    expect(res.status()).toBe(200);
    expect(await res.json()).toEqual(booking);
  });

  test("find it by name", async ({ request }) => {
    const res = await request.get("/booking", { params: { firstname: "Alper", lastname: "Tester" } });
    const ids = (await res.json()).map((b: { bookingid: number }) => b.bookingid);
    expect(ids).toContain(id);
  });

  test("updating without a token is rejected", async ({ request }) => {
    const res = await request.put(`/booking/${id}`, { data: { ...booking, totalprice: 1 } });
    expect(res.status()).toBe(403);
  });

  test("partial update with a token", async ({ request }) => {
    const res = await request.patch(`/booking/${id}`, {
      data: { totalprice: 150 },
      headers: { Cookie: `token=${await token(request)}`, Accept: "application/json" },
    });
    expect(res.status()).toBe(200);
    expect((await res.json()).totalprice).toBe(150);
  });

  test("delete it, then it is gone", async ({ request }) => {
    const del = await request.delete(`/booking/${id}`, { headers: { Cookie: `token=${await token(request)}` } });
    expect(del.status()).toBe(201);
    expect((await request.get(`/booking/${id}`)).status()).toBe(404);
  });
});

test("auth with wrong credentials returns no token", async ({ request }) => {
  const res = await request.post("/auth", { data: { username: "admin", password: "wrong" } });
  expect(await res.json()).toEqual({ reason: "Bad credentials" });
});
